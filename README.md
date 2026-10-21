# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Correção: saldo travado na sincronização de estoque (set/2026)

A edge function `sankhya-stock-sync` filtrava a consulta por uma **lista fixa
de códigos de produto acabado** (`VW.CODPRODPA IN (...)`). Só as matérias-primas
pertencentes ao BOM desses PAs tinham o saldo atualizado.

Qualquer item fora dessa lista — tipicamente os cadastrados depois, pela busca
individual no Sankhya — ficava com o **saldo congelado permanentemente**, por
mais que se apertasse "atualizar saldo". Eram 74 itens nessa situação.

A função agora roda uma **segunda consulta** de saldo cobrindo todos os códigos
já presentes em `estoque_mp`, independentemente de estarem no BOM da lista.
Sintoma diagnóstico: `saldo_almoxarifado IS NULL` indicava item nunca tocado
pela sincronização completa.

## Remessas de Compras (triangulação, devolução, conserto) — em construção

Base técnica validada (set/2026), antes das telas:

**TOPs do Sankhya identificados** para cada natureza:
- `2307` COMPRA PASSAGEM DIRETA SEM PEDIDO — triangulação (59 notas)
- `2302` COMPRA PASSAGEM DIRETA COM PEDIDO — triangulação (31)
- `2412` DEVOLUÇÃO DE COMPRA MATÉRIA PRIMA NACIONAL (5)
- `2410` RETORNO DE MERCADORIA CONSERTO ESTQ TERCEIRO (4)
- `2409` RETORNO INDUSTR. ENCOMENDA ESTQ TERCEIRO (3)
- `2407` RETORNO INDUSTR/CONSERTO ESTQ TERCEIRO (7)

**Edge function `buscar-documento-compra-sankhya`**: recebe um número e
devolve cabeçalho + itens. Aceita `tipo: NOTA | PEDIDO | AUTO`.
- `NOTA` busca entradas já lançadas (TIPMOV C/E) — devolução e conserto.
- `PEDIDO` busca ordem de compra (TIPMOV O/P) — triangulação, onde a nota
  costuma não ter entrado ainda na empresa.
- `AUTO` tenta nota e cai pro pedido.

Retorna parceiro, **CNPJ**, TOP e sua descrição, BR, valor, situação e os
itens com quantidade/unidade/valor. Testado com dados reais: pedido 119128
(DNG Pinturas, BR14325/26) e nota 468 (Marflex, BR14323/26).

**Edge function `buscar-parceiro-sankhya`**: autocomplete de parceiros para o
Compras escolher o fornecedor de destino da triangulação. Busca por nome, razão
social ou CNPJ (mínimo 2 letras), e ordena colocando primeiro quem **começa**
com o termo digitado — "marf" traz MARFLEX antes de TINTAS MARFIM. Devolve
código, nome, razão social, CNPJ, cidade, UF e se é fornecedor/cliente.

### Amarração nota ↔ ordem de compra (TGFVAR)

Identificada a partir do HAR do portal de compras. O Sankhya usa a entidade
`CompraVendavariosPedido`, sobre a tabela **TGFVAR**, com duas direções:

```
ORIGENS  (o que deu origem a este)   NUNOTA     = X AND NUNOTA <> NUNOTAORIG
DESTINOS (o que saiu deste)          NUNOTAORIG = X AND NUNOTA <> NUNOTAORIG
```

Campos: `NUNOTA`/`SEQUENCIA` (destino), `NUNOTAORIG`/`SEQUENCIAORIG` (origem) e
`QTDATENDIDA`.

Cobre o que o campo `NUMPEDIDO2` do item não cobria: nota atendida por vários
pedidos, pedido atendido em várias notas, e devolução apontando para a nota de
compra original. Confirmado em dados reais: NF 468 → OC 12855, NF 3240 → OC
12849, devolução NF 9656 → nota de compra 31424.

## Hora extra e sinalização do chão de fábrica

**`hora_extra`** — o líder declara antes: data, setor, OP/BR, motivo, horário
previsto de término, quem fica, se precisa lanche. Serve a dois propósitos:

1. O encerramento automático das 17h **não corta** quem está na lista — fecha
   no horário previsto da extra (`FIM_HORA_EXTRA`).
2. O RH recebe a contagem de lanches pronta, hoje feita numa lista à mão.

**`hora-extra-avisar-rh`** — roda às 15h (seg-sex), manda pro sino do portal
sempre e pro Power Automate se houver `flow_url` em `configuracoes.hora_extra_rh`.
Conta cada pessoa **uma vez** mesmo que esteja em duas extras no dia, e marca
`rh_notificado_em` para não pedir lanche duas vezes.

**`apontamento_sinalizacao`** — quem está apontando sinaliza o problema ali
mesmo, já amarrado à OP e ao BR: falta de material, problema de máquina,
dúvida de projeto, qualidade, segurança.

## Conferência portal × Sankhya

**`conferir-pedidos-sankhya`** compara item a item (por `nunota` + `sequencia`)
o que o portal tem com o que o Sankhya tem **agora**. Existe porque a
sincronização normal só adiciona e atualiza — ela não sabe o que foi **apagado**
no ERP, então item removido lá continuava aqui inflando o valor do BR.

Três tipos de diferença:

| Tipo | O que é | Como corrigir |
|---|---|---|
| **Sobrando** | Está no portal, não existe mais no Sankhya | A própria conferência remove com `{"aplicar":true}` |
| **Faltando** | Está no Sankhya, não chegou no portal | Rodar `pedidos-itens-sync` |
| **Divergente** | Existe nos dois, com valor ou quantidade diferente | Rodar `pedidos-itens-sync` |

Roda em **simulação por padrão** — mostra tudo e não altera nada. Tolerância de
1 centavo no valor, para não acusar arredondamento como divergência.

## Notificações — fluxo único do Teams

Toda automação do portal avisa pela edge function **`notificar`**, que fala com
**um único fluxo** no Power Automate (`configuracoes.notificacoes.flow_url`).

O fluxo não conhece regra de negócio: recebe `destinatarios` e `texto` (já
formatado) e posta. Quem decide o que escrever e para quem é o portal. Com
isso, criar automação nova não exige mexer no Power Automate.

```
automação → notificar → sino do portal (sempre)
                      → fluxo único → Teams (se houver flow_url)
```

Campos: `destinatarios[]`, `titulo`, `mensagem`, `texto`, `link`, `modulo`,
`prioridade`, `dados`.

Quem usa hoje: manutenção (demanda nova e aprovação), hora extra/lanche do RH e
o lembrete diário. Os destinatários da manutenção saem do cadastro de usuários,
pelo perfil e pelo `nivel_manutencao`.

**Cuidado com o payload:** o gatilho do Power Automate valida contra o esquema
gerado a partir do exemplo. Campo que no exemplo era objeto não pode chegar
`null`, e o mesmo vale para texto — o fluxo devolve **400** e o aviso se perde
em silêncio. Por isso `notificar` sempre envia string vazia no lugar de null e
objeto vazio no lugar de null. Quando o fluxo recusa, a resposta dele é
devolvida em `resposta_do_fluxo`, senão depurar vira adivinhação.

**Quebra de linha no Teams:** o corpo é renderizado como HTML, então `\n`
sozinho vira espaço e a mensagem emenda tudo numa linha — aconteceu com uma
lista de três itens, que chegou grudada. `notificar` dobra as quebras simples
antes de enviar ao fluxo. No sino do portal vai o texto original, porque lá a
quebra simples funciona e dobrar só espalharia a mensagem.

**Destinatário fora da organização:** o Teams só entrega para contas do
diretório da empresa — endereço externo falha com `GraphUserDetailNotFound`, e
pior, só na execução (o fluxo já respondeu 202). Por isso `notificar` separa os
destinatários em `destinatarios` (Teams, domínio interno) e
`destinatarios_email` (o resto), conforme
`configuracoes.notificacoes.dominio_interno`. O fluxo só precisa de um segundo
laço com "Enviar um email".

Quem entra por usuário em vez de e-mail (caso do Welton, login `welton`) tem o
endereço em `perfis_usuarios.email_notificacao` — sem isso ficaria fora de
qualquer aviso.

**Quebra de linha no e-mail:** diferente do Teams, o corpo do e-mail é HTML
puro e ignora `\n` — nem a quebra dupla funciona. Por isso `notificar` envia
também `texto_html`, com cada linha em seu bloco e o link clicável, escapando
`<`, `>` e `&` para que uma descrição com "peça <3mm>" não quebre a marcação.
No fluxo, o corpo do e-mail deve usar `texto_html`; o Teams continua com
`texto`.

### Saldo por depósito — como conferir

`saldo_disponivel` é, por definição, `saldo_1090 + saldo_1002`. Quando não
bate, o item ficou sem atualizar na sincronização e a tela mostra 0 num
depósito onde há saldo — aconteceu com o 13230, que exibia "0 PC" tendo 2 no
1002.

A view **`estoque_incoerente`** lista esses casos. Deve estar sempre vazia;
havendo linhas, rodar `sankhya-stock-sync`.

## Estoque Disponível para Comercial

A Produção informa o saldo semanalmente; o Comercial consulta e reserva. O
problema central é dois vendedores negociarem a mesma peça, então **as regras
críticas vivem no banco**, não na tela — duas abas abertas ao mesmo tempo
furariam qualquer validação feita só no front.

**`estoque_vendas`** — `qtd_disponivel` é coluna *gerada*
(`estoque − reservado`), nunca digitada. `qtd_reservada` é mantida por trigger
a partir das reservas ativas.

**`estoque_reservas`** — status `BLOQUEIO` (5 min), `RESERVADO`, `CONFIRMADO`,
`EXPIRADO`, `CANCELADO`. Numeração automática `R-AAAA-NNNN`.

Garantias:

| Regra | Onde |
|---|---|
| Não reservar acima do disponível | trigger `valida_reserva`, com `FOR UPDATE` |
| Reservado sempre coerente | trigger `recalcula_reservado` |
| Bloqueio de 5 min libera sozinho | `expira_reservas()`, cron a cada minuto |
| Reserva vencida devolve o saldo | idem |

Bloqueio que não vira reserva é marcado como `CANCELADO`, não `EXPIRADO` —
nunca chegou a ser reserva, e poluir o histórico atrapalharia a leitura.
