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
