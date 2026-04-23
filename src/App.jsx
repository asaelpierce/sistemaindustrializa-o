import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Upload,
  Trash2,
  Database,
  AlertCircle,
  FileSpreadsheet,
  CheckCircle,
  RefreshCcw,
  Loader2,
  Calculator,
  Cloud,
  CloudOff,
  ServerCrash,
  Truck,
  MapPin,
  ClipboardList,
  PackageOpen,
  ArrowRight,
  LayoutDashboard,
  History,
  UploadCloud,
  Users,
  Clock,
  ShieldAlert,
  ArrowLeftRight,
  ListChecks,
  Lock,
  Mail,
  LogOut,
  User,
  Shield,
  ArrowUpCircle,
  UserPlus,
  KeyRound,
  Settings,
  XCircle,
  Info,
  FileWarning,
  FileCheck,
  Layers,
  PieChart,
} from 'lucide-react';

// ============================================================================
// CONFIGURAÇÃO DO SEU SUPABASE
// ============================================================================
const SUPABASE_URL = 'https://mdsxiijlkruqnhbyxbhe.supabase.co';
const SUPABASE_KEY = 'sb_publishable_6vD-Jyf4pIJdOpvzXKDCOw_YUcX3TcG';
// ============================================================================

export default function App() {
  const [supabase, setSupabase] = useState(null);
  const [dbOnline, setDbOnline] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [emailLogin, setEmailLogin] = useState('');
  const [senhaLogin, setSenhaLogin] = useState('');
  const [erroLogin, setErroLogin] = useState('');

  const [produtosDb, setProdutosDb] = useState({});
  const [estoqueDb, setEstoqueDb] = useState({});
  const [remessasDb, setRemessasDb] = useState([]);
  const [usuariosDb, setUsuariosDb] = useState([]);

  const [abaAtiva, setAbaAtiva] = useState('NOVA_OP');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const [codigoBusca, setCodigoBusca] = useState('');
  const [quantidadeProduzir, setQuantidadeProduzir] = useState(1);
  const [projeto, setProjeto] = useState('');
  const [cliente, setCliente] = useState('');
  const [produtoEncontrado, setProdutoEncontrado] = useState(null);
  const [itensRemessa, setItensRemessa] = useState([]);
  const [remessaSelecionada, setRemessaSelecionada] = useState(null);

  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    email: '',
    senha: '',
    perfil: 'PCP',
  });
  const [isEditingUser, setIsEditingUser] = useState(false);

  const [remessaParaRetorno, setRemessaParaRetorno] = useState(null);
  const [qtdPecasRetornando, setQtdPecasRetornando] = useState('');

  const [formExpedicao, setFormExpedicao] = useState({
    transporte: '',
    transportadora: '',
    quantidade: '',
    pesoTotal: '',
    destinatario: '',
    dataSaida: new Date().toISOString().split('T')[0],
  });
  const [buscaFornecedor, setBuscaFornecedor] = useState('');
  const [templateBuffer, setTemplateBuffer] = useState(null);
  const [nomeTemplate, setNomeTemplate] = useState('');

  // Estados para Rateio Específico
  const [modalRateioAberto, setModalRateioAberto] = useState(false);
  const [idxItemRateio, setIdxItemRateio] = useState(null);
  const [novoRateio, setNovoRateio] = useState({
    projeto: '',
    codigoPA: '',
    quantidade: '',
  });
  const ITENS_RATEIO = ['4941', '4942', '552', '187'];

  // 1. Injeção de Scripts com verificação de carregamento
  useEffect(() => {
    const scripts = [
      {
        id: 'xlsx-lib',
        src: 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
      },
      {
        id: 'exceljs-lib',
        src: 'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js',
      },
      {
        id: 'supabase-lib',
        src: 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
      },
    ];

    scripts.forEach((s) => {
      if (!document.getElementById(s.id)) {
        const script = document.createElement('script');
        script.id = s.id;
        script.src = s.src;
        script.async = true;
        document.body.appendChild(script);
      }
    });

    const checkInterval = setInterval(() => {
      if (window.supabase) {
        try {
          const client = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
          );
          setSupabase(client);
          clearInterval(checkInterval);
        } catch (e) {
          console.error('Erro Supabase init', e);
        }
      }
    }, 500);
    return () => clearInterval(checkInterval);
  }, []);

  // 2. Sincronização de Dados Centralizada
  const fetchAllData = async () => {
    if (!supabase) return;
    try {
      const [prodRes, estRes, remRes, userRes, configRes] = await Promise.all([
        supabase.from('produtos').select('*'),
        supabase.from('estoque_mp').select('*'),
        supabase
          .from('remessas')
          .select('*')
          .order('data_criacao', { ascending: false }),
        supabase.from('perfis_usuarios').select('*'),
        supabase
          .from('configuracoes')
          .select('*')
          .eq('chave', 'modelo_sgq')
          .maybeSingle(),
      ]);

      if (prodRes.data) {
        const pMap = {};
        prodRes.data.forEach((p) => {
          pMap[p.codigo_pa] = p;
        });
        setProdutosDb(pMap);
      }
      if (estRes.data) {
        const eMap = {};
        estRes.data.forEach((e) => {
          eMap[e.codigo_mp] = e;
        });
        setEstoqueDb(eMap);
      }
      if (remRes.data) setRemessasDb(remRes.data);
      if (userRes.data) setUsuariosDb(userRes.data);

      if (configRes.data && configRes.data.valor_json) {
        const base64Data = configRes.data.valor_json.data;
        setNomeTemplate(configRes.data.valor_json.nome);
        const binaryString = window.atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++)
          bytes[i] = binaryString.charCodeAt(i);
        setTemplateBuffer(bytes.buffer);
      }

      setDbOnline(true);
    } catch (e) {
      setDbOnline(false);
    }
  };

  useEffect(() => {
    if (supabase) fetchAllData();
  }, [supabase]);

  const parseNumeroBR = (v) => {
    if (typeof v === 'number') return v;
    if (!v) return 0;
    let s = String(v).trim();
    if (s.includes(',') && s.includes('.')) {
      if (s.indexOf(',') > s.indexOf('.')) {
        s = s.replace(/\./g, '').replace(',', '.');
      } else {
        s = s.replace(/,/g, '');
      }
    } else if (s.includes(',')) {
      s = s.replace(',', '.');
    }
    return Number(s) || 0;
  };

  const uploadInChunks = async (table, data, startProgress, endProgress) => {
    const chunkSize = 300;
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      const { error } = await supabase.from(table).upsert(chunk);
      if (error) throw new Error(`Erro na tabela ${table}: ${error.message}`);

      const chunkProgress = Math.round(
        ((i + chunk.length) / data.length) * (endProgress - startProgress)
      );
      setUploadProgress(startProgress + chunkProgress);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !window.XLSX || !supabase) {
      setErro('Aguardando carregamento de sistema...');
      return;
    }

    setIsLoading(true);
    setUploadProgress(5);
    setErro('');
    setSucesso('');

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const workbook = window.XLSX.read(evt.target.result, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const jsonData = window.XLSX.utils.sheet_to_json(
          workbook.Sheets[firstSheetName]
        );

        if (jsonData.length === 0)
          throw new Error('A planilha fornecida está vazia.');

        const pMap = {};
        const eMap = {};

        jsonData.forEach((row) => {
          const normalizedRow = {};
          Object.keys(row).forEach((k) => {
            const cleanKey = k
              .toUpperCase()
              .trim()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/-/g, ' ');
            normalizedRow[cleanKey] = row[k];
          });

          const pa = String(
            normalizedRow['COD PROD ACABADO'] ||
              normalizedRow['COD ACABADO'] ||
              normalizedRow['CODIGO PA'] ||
              normalizedRow['PRODUTO'] ||
              ''
          ).trim();
          const mp = String(
            normalizedRow['MATERIA PRIMA'] ||
              normalizedRow['CODIGO MP'] ||
              normalizedRow['MP'] ||
              normalizedRow['MATERIAL'] ||
              ''
          ).trim();

          if (!pa || !mp) return;

          const descPa = String(
            normalizedRow['DESCRICAO PRODUTO ACABADO'] ||
              normalizedRow['DESCRICAO PA'] ||
              normalizedRow['DESCRICAO'] ||
              ''
          ).trim();
          const descMp = String(
            normalizedRow['DESCRICAO MATERIA PRIMA'] ||
              normalizedRow['DESCRICAO MP'] ||
              normalizedRow['DESCRICAO MATERIAL'] ||
              ''
          ).trim();
          const quantidade = parseNumeroBR(
            normalizedRow['QUANTIDADE'] || normalizedRow['QTD'] || 0
          );
          const unidade = String(
            normalizedRow['UNIDADE'] || normalizedRow['UN'] || 'UN'
          ).trim();

          if (!pMap[pa]) {
            pMap[pa] = { codigo_pa: pa, descricao: descPa, materiais: [] };
          }

          pMap[pa].materiais.push({
            codigoMP: mp,
            quantidade: quantidade,
            um: unidade,
          });

          if (!eMap[mp]) {
            eMap[mp] = {
              codigo_mp: mp,
              descricao: descMp,
              saldo_disponivel: parseNumeroBR(
                normalizedRow['DISPONIVEL PARA PRODUCAO'] ||
                  normalizedRow['DISPONIVEL'] ||
                  normalizedRow['SALDO DISPONIVEL'] ||
                  0
              ),
              saldo_almoxarifado: parseNumeroBR(
                normalizedRow['SALDO ALMOXARIFADO'] ||
                  normalizedRow['ALMOXARIFADO'] ||
                  normalizedRow['SALDO FISICO'] ||
                  0
              ),
              unidade: unidade,
            };
          }
        });

        const finalProds = Object.values(pMap);
        const finalEstoque = Object.values(eMap);

        if (finalProds.length === 0) {
          throw new Error(
            'Falha na leitura! Verifique se as colunas da sua planilha contêm os títulos corretos (ex: COD ACABADO, MATERIA PRIMA, QUANTIDADE).'
          );
        }

        setUploadProgress(10);
        await uploadInChunks('produtos', finalProds, 10, 50);
        await uploadInChunks('estoque_mp', finalEstoque, 50, 100);

        setSucesso(
          `Tudo certo! ${finalProds.length} Produtos Acabados e ${finalEstoque.length} Materiais catalogados com sucesso.`
        );
        fetchAllData();
      } catch (err) {
        console.error(err);
        setErro('Falha crítica: ' + err.message);
      } finally {
        setIsLoading(false);
        setUploadProgress(0);
        if (e.target) e.target.value = null;
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleTemplateUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !supabase) return;
    setIsLoading(true);
    const fr = new FileReader();
    fr.onload = async (evt) => {
      try {
        const base64 = window.btoa(
          new Uint8Array(evt.target.result).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        );
        const { error } = await supabase
          .from('configuracoes')
          .upsert({
            chave: 'modelo_sgq',
            valor_json: { nome: file.name, data: base64 },
          });
        if (error) throw error;
        setTemplateBuffer(evt.target.result);
        setNomeTemplate(file.name);
        setSucesso(
          'Modelo SGQ atualizado e guardado na nuvem para uso contínuo!'
        );
      } catch (err) {
        setErro('Erro ao salvar SGQ: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fr.readAsArrayBuffer(file);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErroLogin('');
    if (!supabase) return setErroLogin('Conectando ao banco...');
    setIsLoading(true);
    try {
      const { data } = await supabase
        .from('perfis_usuarios')
        .select('*')
        .eq('email', emailLogin.toLowerCase().trim())
        .eq('senha', senhaLogin)
        .single();
      if (data) {
        setUsuarioLogado(data);
        setAbaAtiva(data.perfil === 'EXPEDICAO' ? 'EXPEDICAO' : 'NOVA_OP');
      } else {
        setErroLogin('E-mail ou senha inválidos.');
      }
    } catch (err) {
      setErroLogin('O e-mail ou a senha não coincidem.');
    } finally {
      setIsLoading(false);
    }
  };

  const buscarProduto = (e) => {
    if (e) e.preventDefault();
    setErro('');
    const produto = produtosDb[codigoBusca.toUpperCase().trim()];
    if (produto) {
      setProdutoEncontrado(produto);
      setItensRemessa(
        (produto.materiais || []).map((m) => {
          const est = estoqueDb[m.codigoMP] || {
            saldo_disponivel: 0,
            saldo_almoxarifado: 0,
            descricao: 'Não catalogado',
          };
          const qtdBase = Number(
            (m.quantidade * quantidadeProduzir).toFixed(4)
          );
          return {
            ...m,
            saldoDisponivel: est.saldo_disponivel,
            saldoAlmoxarifado: est.saldo_almoxarifado,
            descricao: est.descricao,
            quantidadeTotal: qtdBase,
            quantidadeOriginal: qtdBase, // Guarda a quantidade intacta do BOM
            quantidadeRetornada: 0,
            rateiosExtras: [], // Array apenas para envios excedentes
          };
        })
      );
    } else {
      setErro(
        'Cod Produto não encontrado na base sincronizada. Verifique se o upload foi feito.'
      );
    }
  };

  const enviarParaExpedicao = async () => {
    setIsLoading(true);
    try {
      for (const it of itensRemessa) {
        const { data: cur, error: errEst } = await supabase
          .from('estoque_mp')
          .select('saldo_disponivel')
          .eq('codigo_mp', it.codigoMP)
          .single();
        if (errEst) throw new Error(errEst.message);

        const { error: errUpd } = await supabase
          .from('estoque_mp')
          .update({
            saldo_disponivel: Number(
              ((cur?.saldo_disponivel || 0) - it.quantidadeTotal).toFixed(4)
            ),
          })
          .eq('codigo_mp', it.codigoMP);
        if (errUpd) throw new Error(errUpd.message);
      }
      const { error: errIns } = await supabase.from('remessas').insert([
        {
          id: `REM-${Date.now()}`,
          produto_acabado: produtoEncontrado.codigo_pa,
          descricao_produto: produtoEncontrado.descricao,
          quantidade_op: quantidadeProduzir,
          projeto: projeto.toUpperCase(),
          cliente: cliente.toUpperCase(),
          itens: itensRemessa,
          status: 'PENDENTE_EXPEDICAO',
          criado_por: usuarioLogado.nome,
          pecas_recebidas: 0,
        },
      ]);

      if (errIns) throw new Error(errIns.message);

      setSucesso('Remessa enviada com sucesso para a fila Logística!');
      setIsLoading(false);
      setProdutoEncontrado(null);
      setAbaAtiva('HISTORICO_PCP');
      fetchAllData();
    } catch (e) {
      setErro('Erro crítico ao salvar: ' + e.message);
      setIsLoading(false);
    }
  };

  const concluirExpedicao = async () => {
    if (!templateBuffer)
      return setErro('O PCP ainda não carregou o modelo SGQ na nuvem.');
    setIsLoading(true);
    try {
      const { error: errExp } = await supabase
        .from('remessas')
        .update({
          status: 'ENVIADO',
          data_envio: new Date().toISOString(),
          enviado_por: usuarioLogado.nome,
          expedicao: formExpedicao,
        })
        .eq('id', remessaSelecionada.id);
      if (errExp) throw new Error(errExp.message);

      const wb = new window.ExcelJS.Workbook();
      await wb.xlsx.load(templateBuffer);
      const ws = wb.worksheets[0];
      ws.getCell('B4').value = remessaSelecionada.projeto;
      ws.getCell('C4').value = remessaSelecionada.cliente;
      ws.getCell('B6').value = formExpedicao.transporte;
      ws.getCell('C6').value = formExpedicao.transportadora;
      ws.getCell('B8').value = formExpedicao.quantidade;
      ws.getCell('C8').value = formExpedicao.pesoTotal;
      ws.getCell('E8').value = formExpedicao.destinatario;
      ws.getCell('G8').value = formExpedicao.dataSaida;

      (remessaSelecionada.itens || []).forEach((it, i) => {
        const r = 12 + i;
        ws.getCell(`C${r}`).value = it.codigoMP;
        ws.getCell(`E${r}`).value = it.descricao;
        ws.getCell(`F${r}`).value = it.quantidadeTotal;
        ws.getCell(`G${r}`).value = it.um;
        ws.getCell(`H${r}`).value = 'Processamento';
      });

      const buf = await wb.xlsx.writeBuffer();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([buf]));
      a.download = `SGQ_${remessaSelecionada.projeto}.xlsx`;
      a.click();
      setSucesso('Planilha gerada e Fila de Expedição concluída!');
      setRemessaSelecionada(null);
      setIsLoading(false);
      fetchAllData();
    } catch (e) {
      setErro('Falha: ' + e.message);
      setIsLoading(false);
    }
  };

  // ============================================================================
  // TRAVA DE SEGURANÇA ABSOLUTA - RETORNO DE PEÇAS
  // ============================================================================
  const processarRetornoParcial = async () => {
    const pecasDevolvidas = Number(qtdPecasRetornando);
    const pecasJaRecebidas = Number(remessaParaRetorno.pecas_recebidas || 0);
    const quantidadeOp = Number(remessaParaRetorno.quantidade_op);
    const saldoPendente = quantidadeOp - pecasJaRecebidas;

    // Trava 1: Prevenir entradas inválidas ou negativas
    if (pecasDevolvidas <= 0) {
      return setErro(
        'Operação Bloqueada: Tem de informar uma quantidade maior que zero para devolver.'
      );
    }

    // Trava 2: Prevenir que retornem MAIS do que o enviado!
    if (pecasDevolvidas > saldoPendente) {
      return setErro(
        `Operação Bloqueada: O sistema detetou uma tentativa de retornar mais peças do que o saldo pendente. O máximo permitido são ${saldoPendente} peça(s).`
      );
    }

    setIsLoading(true);
    try {
      const proporcao = pecasDevolvidas / quantidadeOp;
      const novosItens = [...remessaParaRetorno.itens];

      for (let i = 0; i < novosItens.length; i++) {
        const qtdMP = Number(
          (novosItens[i].quantidadeTotal * proporcao).toFixed(4)
        );
        novosItens[i].quantidadeRetornada = Number(
          ((novosItens[i].quantidadeRetornada || 0) + qtdMP).toFixed(4)
        );

        const { data: cur, error: errEstoque } = await supabase
          .from('estoque_mp')
          .select('saldo_disponivel')
          .eq('codigo_mp', novosItens[i].codigoMP)
          .single();
        if (errEstoque)
          throw new Error(`Erro ler estoque: ${errEstoque.message}`);

        const { error: errUpdEstoque } = await supabase
          .from('estoque_mp')
          .update({
            saldo_disponivel: Number(
              ((cur?.saldo_disponivel || 0) + qtdMP).toFixed(4)
            ),
          })
          .eq('codigo_mp', novosItens[i].codigoMP);
        if (errUpdEstoque)
          throw new Error(`Erro atualizar estoque: ${errUpdEstoque.message}`);
      }

      const novoTotalJa = pecasJaRecebidas + pecasDevolvidas;
      const novoStatus =
        novoTotalJa >= quantidadeOp ? 'RETORNADO' : 'RETORNO_PARCIAL';

      const { error: errRemessa } = await supabase
        .from('remessas')
        .update({
          itens: novosItens,
          status: novoStatus,
          pecas_recebidas: novoTotalJa,
          data_retorno: new Date().toISOString(),
          recebido_por: usuarioLogado.nome,
        })
        .eq('id', remessaParaRetorno.id);

      if (errRemessa)
        throw new Error(`Erro atualizar OP: ${errRemessa.message}`);

      if (novoStatus === 'RETORNADO') {
        setSucesso('Retorno de Peças 100% concluído! A OP foi finalizada.');
      } else {
        setSucesso(
          `Retorno parcial de ${pecasDevolvidas} peças registado! O Saldo Pendente foi atualizado para ${
            quantidadeOp - novoTotalJa
          } peça(s).`
        );
      }

      setRemessaParaRetorno(null);
      setQtdPecasRetornando('');
      fetchAllData();
    } catch (e) {
      setErro('Erro interno ao processar retorno: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const salvarUsuario = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await supabase
        .from('perfis_usuarios')
        .upsert([novoUsuario], { onConflict: 'email' });
      setSucesso(
        isEditingUser
          ? 'Nível de Acesso atualizado!'
          : 'Novo utilizador criado!'
      );
      setNovoUsuario({ nome: '', email: '', senha: '', perfil: 'PCP' });
      setIsEditingUser(false);
      fetchAllData();
    } catch (e) {
      setErro('Erro ao registrar: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const excluirUsuario = async (email) => {
    if (email === usuarioLogado.email)
      return setErro('Impossível remover o seu próprio acesso atual.');
    if (window.confirm('Confirmar remoção permanente de usuário?')) {
      await supabase.from('perfis_usuarios').delete().eq('email', email);
      setSucesso('Acesso removido.');
      fetchAllData();
    }
  };

  // --- Filtros ---
  const isAdmin = usuarioLogado?.perfil === 'ADMIN';
  const isPCP = usuarioLogado?.perfil === 'PCP' || isAdmin;
  const isExp = usuarioLogado?.perfil === 'EXPEDICAO' || isAdmin;

  const remessasPendentes = useMemo(
    () => remessasDb.filter((r) => r.status === 'PENDENTE_EXPEDICAO'),
    [remessasDb]
  );
  const remessasFora = useMemo(
    () => remessasDb.filter((r) => r.status !== 'PENDENTE_EXPEDICAO'),
    [remessasDb]
  );
  const fornecedoresFiltrados = useMemo(
    () =>
      remessasFora.filter(
        (r) =>
          !buscaFornecedor ||
          (String(r.projeto) + ' ' + String(r.expedicao?.destinatario || ''))
            .toLowerCase()
            .includes(buscaFornecedor.toLowerCase())
      ),
    [remessasFora, buscaFornecedor]
  );

  const todosItensExpedidos = useMemo(
    () =>
      remessasFora
        .flatMap((r) => {
          return (r.itens || []).flatMap((it) => {
            const linhas = [];
            // 1. Linha Base (Obrigatória e bloqueada à OP original)
            linhas.push({
              ...it,
              quantidadeTotal: it.quantidadeOriginal || it.quantidadeTotal, // Fallback p/ OPs antigas
              remessa: r,
            });
            // 2. Linhas Extras de Rateio
            if (it.rateiosExtras && it.rateiosExtras.length > 0) {
              it.rateiosExtras.forEach((rat) => {
                linhas.push({
                  ...it,
                  quantidadeTotal: rat.quantidade,
                  remessa: {
                    ...r,
                    projeto: rat.projeto,
                    produto_acabado: rat.codigoPA,
                  },
                });
              });
            }
            return linhas;
          });
        })
        .sort((a, b) => {
          const projA = String(a.remessa.projeto || '').toUpperCase();
          const projB = String(b.remessa.projeto || '').toUpperCase();
          if (projA === projB) {
            return (
              new Date(b.remessa.data_envio) - new Date(a.remessa.data_envio)
            );
          }
          return projA.localeCompare(projB);
        }),
    [remessasFora]
  );

  if (!usuarioLogado) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md border-b-8 border-indigo-600">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <PackageOpen className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Kalenborn SGQ
            </h1>
            <p className="text-slate-400 font-bold text-[10px] mt-2 uppercase tracking-widest leading-relaxed">
              Industrialização • Cloud Supabase
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            {erroLogin && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-black border-2 border-red-100 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" /> {String(erroLogin)}
              </div>
            )}
            <input
              type="email"
              required
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:border-indigo-500"
              placeholder="E-mail Corporativo"
              value={emailLogin}
              onChange={(e) => setEmailLogin(e.target.value)}
            />
            <input
              type="password"
              required
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:border-indigo-500"
              placeholder="Senha"
              value={senhaLogin}
              onChange={(e) => setSenhaLogin(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl shadow-xl hover:bg-indigo-700 transition-all uppercase tracking-wider text-sm"
            >
              Acessar ao Sistema
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden text-sm">
      {/* Sidebar */}
      <div className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl z-20">
        <div className="p-6 border-b border-slate-800 flex items-center space-x-3 text-indigo-400">
          <PackageOpen className="w-8 h-8" />
          <h1 className="text-xl font-black tracking-tight leading-none text-white">
            SGQ
            <br />
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-indigo-500">
              Kalenborn
            </span>
          </h1>
        </div>
        <div className="p-4 border-b border-slate-800 bg-slate-800/30 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-slate-700 p-2 rounded-full">
              {isAdmin ? (
                <Shield className="w-4 h-4 text-amber-400" />
              ) : (
                <User className="w-4 h-4 text-indigo-400" />
              )}
            </div>
            <div>
              <p className="font-black truncate max-w-[130px]">
                {String(usuarioLogado.nome)}
              </p>
            </div>
          </div>
          <button
            onClick={() => setUsuarioLogado(null)}
            className="text-slate-500 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4 space-y-1 px-3 custom-scrollbar">
          {isPCP && (
            <>
              <button
                onClick={() => setAbaAtiva('NOVA_OP')}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${
                  abaAtiva === 'NOVA_OP'
                    ? 'bg-indigo-600 shadow-lg text-white'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="w-5 h-5 mr-3" />{' '}
                <span className="font-bold">Criar Remessa</span>
              </button>
              <button
                onClick={() => setAbaAtiva('HISTORICO_PCP')}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${
                  abaAtiva === 'HISTORICO_PCP'
                    ? 'bg-indigo-600 shadow-lg text-white'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <History className="w-5 h-5 mr-3" />{' '}
                <span className="font-bold">Envios PCP</span>
              </button>
              <button
                onClick={() => setAbaAtiva('UPLOAD_ESTOQUE')}
                className={`w-full flex items-center px-4 py-3 rounded-xl mt-4 transition-all ${
                  abaAtiva === 'UPLOAD_ESTOQUE'
                    ? 'bg-emerald-600 shadow-lg text-white'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <UploadCloud className="w-5 h-5 mr-3" />{' '}
                <span className="font-bold">Sincronizar ERP</span>
              </button>
            </>
          )}
          {isExp && (
            <>
              <button
                onClick={() => setAbaAtiva('EXPEDICAO')}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${
                  abaAtiva === 'EXPEDICAO'
                    ? 'bg-amber-600 shadow-lg text-white'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Truck className="w-5 h-5 mr-3" />{' '}
                <span className="font-bold">Fila Expedição</span>
                {remessasPendentes.length > 0 && (
                  <span className="ml-auto bg-amber-400 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full">
                    {String(remessasPendentes.length)}
                  </span>
                )}
              </button>
              <button
                onClick={() => setAbaAtiva('FORNECEDORES')}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${
                  abaAtiva === 'FORNECEDORES'
                    ? 'bg-amber-600 shadow-lg text-white'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <MapPin className="w-5 h-5 mr-3" />{' '}
                <span className="font-bold">Retornos Pendentes</span>
              </button>
              <button
                onClick={() => setAbaAtiva('CONTROLE_GERAL')}
                className={`w-full flex items-center px-4 py-3 rounded-xl mt-4 transition-all ${
                  abaAtiva === 'CONTROLE_GERAL'
                    ? 'bg-blue-600 shadow-lg text-white'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <ListChecks className="w-5 h-5 mr-3" />{' '}
                <span className="font-bold">Controle Geral</span>
              </button>
            </>
          )}
          {isAdmin && (
            <button
              onClick={() => setAbaAtiva('GESTAO_USUARIOS')}
              className={`w-full flex items-center px-4 py-3 rounded-xl mt-4 transition-all ${
                abaAtiva === 'GESTAO_USUARIOS'
                  ? 'bg-red-600 shadow-lg text-white'
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Users className="w-5 h-5 mr-3" />{' '}
              <span className="font-bold">Gestão Acessos</span>
            </button>
          )}
        </div>

        <div className="p-4 bg-slate-950 space-y-4">
          {isPCP && (
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">
                Configuração Modelo SGQ
              </p>
              <label
                className={`flex items-center justify-center px-3 py-3 rounded-xl cursor-pointer transition-all border-2 ${
                  templateBuffer
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                    : 'bg-red-600 border-red-500 text-white shadow-lg animate-pulse'
                }`}
              >
                <FileSpreadsheet className="w-5 h-5 mr-2" />
                <span className="font-black uppercase text-[10px] truncate">
                  {nomeTemplate || 'Carregar Modelo Aqui'}
                </span>
                <input
                  type="file"
                  accept=".xlsx"
                  className="hidden"
                  onChange={handleTemplateUpload}
                />
              </label>
            </div>
          )}
          <div className="flex items-center justify-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            {dbOnline ? (
              <Cloud className="w-3 h-3 mr-1 text-emerald-500" />
            ) : (
              <CloudOff className="w-3 h-3 mr-1 text-red-500" />
            )}
            {dbOnline
              ? templateBuffer
                ? 'SGQ na Nuvem'
                : 'Falta Modelo SGQ'
              : 'Offline'}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-y-auto overflow-x-hidden relative p-6 md:p-8 custom-scrollbar">
        {isLoading && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-md z-[60] flex flex-col items-center justify-center text-center">
            <Loader2 className="w-20 h-20 text-indigo-600 animate-spin mb-6" />
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
              Processando...
            </h3>
            <div className="w-80 bg-slate-200 h-3 rounded-full mt-6 overflow-hidden shadow-inner">
              <div
                className="bg-indigo-600 h-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-slate-500 font-bold mt-2 text-lg">
              {String(uploadProgress)}% Concluído
            </p>
          </div>
        )}

        {(erro || sucesso) && (
          <div
            className={`fixed top-4 right-4 z-[100] p-5 rounded-2xl shadow-2xl flex items-start border-2 animate-in slide-in-from-top-4 ${
              erro
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            <AlertCircle className="w-6 h-6 mr-3 flex-shrink-0" />
            <div className="flex-1 font-black text-sm">
              {String(erro || sucesso)}
            </div>
            <button
              onClick={() => {
                setErro('');
                setSucesso('');
              }}
              className="opacity-50 hover:opacity-100 font-black text-xl ml-4"
            >
              &times;
            </button>
          </div>
        )}

        {abaAtiva === 'NOVA_OP' && (
          <div className="max-w-4xl mx-auto space-y-6 w-full animate-in fade-in">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase tracking-widest">
              Nova Remessa
            </h2>
            <div className="bg-white rounded-3xl p-8 border-2 border-slate-100 shadow-sm">
              <form
                onSubmit={buscarProduto}
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
              >
                <input
                  placeholder="Cod Produto Final"
                  className="bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-black uppercase text-slate-700 outline-none focus:border-indigo-300"
                  value={codigoBusca}
                  onChange={(e) => setCodigoBusca(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Quantidade"
                  className="bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-black text-slate-700 outline-none focus:border-indigo-300"
                  value={String(quantidadeProduzir)}
                  onChange={(e) =>
                    setQuantidadeProduzir(parseInt(e.target.value) || 1)
                  }
                />
                <input
                  placeholder="N° Projeto"
                  className="bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-black text-slate-700 outline-none focus:border-indigo-300"
                  value={projeto}
                  onChange={(e) => setProjeto(e.target.value)}
                />
                <input
                  placeholder="Cliente"
                  className="bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-black text-slate-700 outline-none focus:border-indigo-300"
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                />
                <button
                  type="submit"
                  className="md:col-span-2 bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-black transition-all shadow-xl uppercase tracking-wider text-sm mt-2"
                >
                  Buscar Ficha Técnica (BOM)
                </button>
              </form>
            </div>
            {produtoEncontrado && (
              <div className="bg-white rounded-3xl border-2 border-slate-50 overflow-hidden shadow-sm animate-in zoom-in-95">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b">
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="p-4 text-center">Remover</th>
                      <th className="p-4">MP (Bruto)</th>
                      <th className="p-4">Descrição</th>
                      <th className="p-4 text-center">Requisitado</th>
                      <th className="p-4 text-center">Estoque Atual</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {itensRemessa.map((it, i) => (
                      <tr
                        key={i}
                        className={
                          it.saldoDisponivel < it.quantidadeTotal
                            ? 'bg-red-50/30'
                            : 'hover:bg-slate-50/50'
                        }
                      >
                        <td className="p-4 text-center">
                          <button
                            type="button"
                            onClick={() =>
                              setItensRemessa((prev) =>
                                prev.filter((_, idx) => idx !== i)
                              )
                            }
                            className="text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-5 h-5 mx-auto" />
                          </button>
                        </td>
                        <td className="p-4 font-black text-slate-700 uppercase tracking-tighter">
                          {String(it.codigoMP)}
                        </td>
                        <td className="p-4 text-slate-500 font-medium truncate max-w-[200px]">
                          {String(it.descricao)}
                        </td>
                        <td className="p-4 text-center font-black text-indigo-600 text-sm">
                          {ITENS_RATEIO.includes(it.codigoMP) ? (
                            <div className="flex items-center justify-center gap-2">
                              <input
                                type="number"
                                step="any"
                                className="w-20 border-2 rounded-lg px-2 py-1 text-center font-black outline-none transition-all bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed"
                                value={it.quantidadeTotal}
                                readOnly
                                title="Bloqueado: Para enviar quantidades adicionais deste material, utilize o botão de Rateio ao lado."
                              />
                              <span className="text-[10px]">
                                {String(it.um)}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setIdxItemRateio(i);
                                  setModalRateioAberto(true);
                                }}
                                className={`p-1.5 rounded-lg transition-all ${
                                  it.rateiosExtras?.length > 0
                                    ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                                    : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                                }`}
                                title="Adicionar Envio Extra (Rateio)"
                              >
                                <PieChart className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <span>
                              {String(it.quantidadeTotal)} {String(it.um)}
                            </span>
                          )}
                        </td>
                        <td
                          className={`p-4 text-center font-black text-sm ${
                            it.saldoDisponivel < it.quantidadeTotal
                              ? 'text-red-500'
                              : 'text-emerald-500'
                          }`}
                        >
                          {String(it.saldoDisponivel)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="p-6 bg-slate-50 flex justify-end space-x-4 border-t">
                  <button
                    onClick={enviarParaExpedicao}
                    className="px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl hover:bg-indigo-700 transition-all uppercase tracking-wider flex items-center text-sm"
                  >
                    <ArrowRight className="w-5 h-5 mr-3" /> Aprovar OP & Enviar
                    Logística
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Rateio PCP */}
        {modalRateioAberto && idxItemRateio !== null && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-8 border-b bg-slate-50 flex justify-between items-center">
                <div>
                  <span className="bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                    RATEIO DE ENVIO ADICIONAL
                  </span>
                  <h2 className="text-2xl font-black text-slate-800 mt-2 uppercase tracking-tighter">
                    MP: {itensRemessa[idxItemRateio].codigoMP}
                  </h2>
                  <p className="text-slate-500 font-bold uppercase text-xs">
                    {itensRemessa[idxItemRateio].descricao}
                  </p>
                </div>
                <button
                  onClick={() => setModalRateioAberto(false)}
                  className="text-slate-400 hover:text-red-500 font-black text-2xl"
                >
                  &times;
                </button>
              </div>

              <div className="p-8 bg-white overflow-y-auto custom-scrollbar">
                <div className="flex flex-wrap md:flex-nowrap gap-4 items-end mb-6">
                  <div className="flex-1 w-full">
                    <label className="text-[10px] font-black text-slate-400 uppercase">
                      Projeto Destino (Extra)
                    </label>
                    <input
                      placeholder="Ex: PRJ-999"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-black text-slate-700 outline-none focus:border-indigo-300"
                      value={novoRateio.projeto}
                      onChange={(e) =>
                        setNovoRateio({
                          ...novoRateio,
                          projeto: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="text-[10px] font-black text-slate-400 uppercase">
                      Cód PA (Extra)
                    </label>
                    <input
                      placeholder="Ex: PA-001"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-black text-slate-700 outline-none focus:border-indigo-300"
                      value={novoRateio.codigoPA}
                      onChange={(e) =>
                        setNovoRateio({
                          ...novoRateio,
                          codigoPA: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </div>
                  <div className="w-full md:w-32">
                    <label className="text-[10px] font-black text-slate-400 uppercase">
                      Qtd Adicional
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="0"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-black text-slate-700 outline-none focus:border-indigo-300"
                      value={novoRateio.quantidade}
                      onChange={(e) =>
                        setNovoRateio({
                          ...novoRateio,
                          quantidade: e.target.value,
                        })
                      }
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        !novoRateio.projeto ||
                        !novoRateio.codigoPA ||
                        !novoRateio.quantidade ||
                        Number(novoRateio.quantidade) <= 0
                      )
                        return;
                      const n = [...itensRemessa];
                      if (!n[idxItemRateio].rateiosExtras)
                        n[idxItemRateio].rateiosExtras = [];
                      n[idxItemRateio].rateiosExtras.push({
                        projeto: novoRateio.projeto,
                        codigoPA: novoRateio.codigoPA,
                        quantidade: Number(novoRateio.quantidade),
                      });

                      // A Quantidade Total será SEMPRE a Base + Extras (não permite adulterar a base)
                      n[idxItemRateio].quantidadeTotal =
                        n[idxItemRateio].quantidadeOriginal +
                        n[idxItemRateio].rateiosExtras.reduce(
                          (acc, curr) => acc + curr.quantidade,
                          0
                        );

                      setItensRemessa(n);
                      setNovoRateio({
                        projeto: '',
                        codigoPA: '',
                        quantidade: '',
                      });
                    }}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black uppercase text-xs hover:bg-indigo-700 transition-all w-full md:w-auto mt-2 md:mt-0"
                  >
                    Adicionar
                  </button>
                </div>

                <div className="border-2 border-slate-50 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b">
                      <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <th className="p-4">N° Projeto</th>
                        <th className="p-4">Cód Final PA</th>
                        <th className="p-4 text-center">Quantidade</th>
                        <th className="p-4 text-center">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {/* Linha da Demanda Base do BOM (Obrigatória e Inapagável) */}
                      <tr className="bg-indigo-50/50">
                        <td className="p-4 font-black text-slate-500">
                          {projeto || 'Pendente'}{' '}
                          <span className="ml-2 text-[8px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full uppercase">
                            Ficha Técnica
                          </span>
                        </td>
                        <td className="p-4 font-black text-slate-500">
                          {produtoEncontrado.codigo_pa}
                        </td>
                        <td className="p-4 text-center font-black text-slate-500">
                          {itensRemessa[idxItemRateio].quantidadeOriginal}
                        </td>
                        <td className="p-4 text-center">
                          <Lock
                            className="w-4 h-4 mx-auto text-slate-300"
                            title="Quantidade base fixa da OP. Intocável."
                          />
                        </td>
                      </tr>

                      {(itensRemessa[idxItemRateio].rateiosExtras || [])
                        .length === 0 && (
                        <tr>
                          <td
                            colSpan="4"
                            className="p-6 text-center text-slate-400 font-bold text-xs uppercase tracking-widest"
                          >
                            Nenhum Rateio extra adicionado.
                          </td>
                        </tr>
                      )}

                      {/* Linhas de Rateio Adicional */}
                      {(itensRemessa[idxItemRateio].rateiosExtras || []).map(
                        (rat, rIdx) => (
                          <tr
                            key={rIdx}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <td className="p-4 font-black text-slate-800">
                              {rat.projeto}
                            </td>
                            <td className="p-4 font-black text-slate-800">
                              {rat.codigoPA}
                            </td>
                            <td className="p-4 text-center font-black text-emerald-600">
                              +{rat.quantidade}
                            </td>
                            <td className="p-4 text-center">
                              <button
                                type="button"
                                onClick={() => {
                                  const n = [...itensRemessa];
                                  n[idxItemRateio].rateiosExtras.splice(
                                    rIdx,
                                    1
                                  );
                                  n[idxItemRateio].quantidadeTotal =
                                    n[idxItemRateio].quantidadeOriginal +
                                    n[idxItemRateio].rateiosExtras.reduce(
                                      (acc, curr) => acc + curr.quantidade,
                                      0
                                    );
                                  setItensRemessa(n);
                                }}
                                className="text-slate-300 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4 mx-auto" />
                              </button>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="p-8 bg-slate-50 flex justify-between items-center border-t">
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                  Total Aglomerado p/ SGQ:{' '}
                  <span className="text-indigo-600 text-2xl ml-2">
                    {itensRemessa[idxItemRateio].quantidadeTotal}{' '}
                    {itensRemessa[idxItemRateio].um}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setModalRateioAberto(false)}
                  className="bg-slate-900 text-white px-8 py-4 rounded-xl font-black uppercase text-xs hover:bg-black transition-all shadow-xl tracking-wider"
                >
                  Gravar e Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        {abaAtiva === 'EXPEDICAO' && (
          <div className="flex flex-col md:flex-row gap-6 animate-in fade-in h-full">
            <div className="w-full md:w-1/3 bg-white rounded-3xl border-2 border-slate-50 flex flex-col h-fit md:h-[calc(100vh-10rem)] overflow-hidden">
              <div className="p-6 border-b bg-amber-50 flex justify-between items-center">
                <h2 className="font-black text-amber-900 text-lg uppercase tracking-wider flex items-center">
                  <Clock className="w-5 h-5 mr-2" /> Fila (
                  {String(remessasPendentes.length)})
                </h2>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {remessasPendentes.map((rem) => (
                  <div
                    key={rem.id}
                    onClick={() => setRemessaSelecionada(rem)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      remessaSelecionada?.id === rem.id
                        ? 'border-amber-400 bg-amber-50 shadow-md'
                        : 'border-slate-50 hover:border-amber-100'
                    }`}
                  >
                    <span className="font-black text-amber-600 text-[10px] uppercase tracking-widest block mb-1">
                      N° PROJETO: {String(rem.projeto)}
                    </span>
                    <span className="font-black text-slate-800 text-lg tracking-tighter uppercase">
                      {String(rem.produto_acabado)}
                    </span>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 truncate">
                      {String(rem.descricao_produto)}
                    </p>
                    <div className="mt-3 pt-3 border-t text-[9px] font-bold text-slate-400 uppercase flex justify-between">
                      <span className="text-indigo-600 font-black">
                        {String(rem.criado_por)}
                      </span>
                      <span>
                        {new Date(rem.data_criacao).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 bg-white rounded-3xl border-2 border-slate-50 overflow-hidden flex flex-col h-fit md:h-[calc(100vh-10rem)] shadow-sm">
              {remessaSelecionada ? (
                <div className="flex-1 overflow-y-auto p-8 space-y-8 animate-in slide-in-from-right-4 custom-scrollbar">
                  {!templateBuffer && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-[2rem] p-8 flex flex-col items-center text-center space-y-4">
                      <FileWarning className="w-16 h-16 text-red-500 animate-pulse" />
                      <h4 className="text-xl font-black text-red-700 uppercase leading-none">
                        Modelo SGQ Ausente!
                      </h4>
                      <p className="text-red-600 font-bold text-sm max-w-sm">
                        O PCP deve carregar o modelo Excel padrão na nuvem para
                        libertar o fluxo da expedição.
                      </p>
                    </div>
                  )}
                  <div className="border-b-2 border-slate-50 pb-6">
                    <div className="bg-amber-600 text-white text-[10px] font-black px-3 py-1 rounded-full w-fit uppercase tracking-widest mb-3">
                      PROJETO: {String(remessaSelecionada.projeto)}
                    </div>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">
                      {String(remessaSelecionada.produto_acabado)}
                    </h3>
                  </div>
                  <div
                    className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${
                      !templateBuffer
                        ? 'opacity-30 pointer-events-none grayscale'
                        : ''
                    }`}
                  >
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase">
                        Transporte
                      </label>
                      <input
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-black text-slate-700 outline-none"
                        value={formExpedicao.transporte}
                        onChange={(e) =>
                          setFormExpedicao({
                            ...formExpedicao,
                            transporte: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase">
                        Transportadora
                      </label>
                      <input
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-black text-slate-700 outline-none"
                        value={formExpedicao.transportadora}
                        onChange={(e) =>
                          setFormExpedicao({
                            ...formExpedicao,
                            transportadora: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase">
                        Volumes (Qtd)
                      </label>
                      <input
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-black text-slate-700 outline-none"
                        value={formExpedicao.quantidade}
                        onChange={(e) =>
                          setFormExpedicao({
                            ...formExpedicao,
                            quantidade: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase">
                        Peso Total Estimado
                      </label>
                      <input
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-black text-slate-700 outline-none"
                        value={formExpedicao.pesoTotal}
                        onChange={(e) =>
                          setFormExpedicao({
                            ...formExpedicao,
                            pesoTotal: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[10px] font-black text-amber-600 uppercase font-black">
                        Destinatário Final / Empresa
                      </label>
                      <input
                        placeholder="Ex: Fornecedor Kalenborn"
                        className="w-full bg-amber-50 border-2 border-amber-100 rounded-xl px-4 py-3 font-black text-amber-900 outline-none"
                        value={formExpedicao.destinatario}
                        onChange={(e) =>
                          setFormExpedicao({
                            ...formExpedicao,
                            destinatario: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase">
                        Data de Saída Física
                      </label>
                      <input
                        type="date"
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-black text-slate-700 outline-none"
                        value={formExpedicao.dataSaida}
                        onChange={(e) =>
                          setFormExpedicao({
                            ...formExpedicao,
                            dataSaida: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <button
                    onClick={concluirExpedicao}
                    disabled={!templateBuffer}
                    className={`w-full text-white font-black py-5 rounded-3xl shadow-xl transition-all uppercase tracking-widest text-lg flex items-center justify-center ${
                      templateBuffer
                        ? 'bg-slate-900 hover:bg-black active:translate-y-1 shadow-slate-300'
                        : 'bg-slate-300 cursor-not-allowed'
                    }`}
                  >
                    <FileSpreadsheet className="w-6 h-6 mr-3" /> Gerar Planilha
                    SGQ & Finalizar
                  </button>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-200 font-black uppercase tracking-[0.2em] bg-slate-50/50 flex-col">
                  <Truck className="w-20 h-20 mb-4 opacity-10" />
                  <p>Selecione uma ordem na fila</p>
                </div>
              )}
            </div>
          </div>
        )}

        {abaAtiva === 'FORNECEDORES' && (
          <div className="max-w-5xl mx-auto space-y-6 w-full animate-in fade-in">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">
                  Painel de Retornos
                </h2>
                <p className="text-slate-500 font-bold uppercase text-xs">
                  Gestão de Peças que regressam ao estoque e Pendentes
                </p>
              </div>
              <div className="relative w-80">
                <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
                <input
                  placeholder="Projeto ou Cliente..."
                  className="w-full bg-white border-2 border-slate-100 shadow-sm rounded-2xl pl-12 pr-4 py-3 font-black text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
                  value={buscaFornecedor}
                  onChange={(e) => setBuscaFornecedor(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-15rem)] pr-2 custom-scrollbar">
              {fornecedoresFiltrados.map((rem) => (
                <div
                  key={rem.id}
                  className={`rounded-[2rem] border-2 overflow-hidden shadow-sm transition-all ${
                    rem.status === 'RETORNADO'
                      ? 'opacity-60 grayscale'
                      : rem.status === 'RETORNO_PARCIAL'
                      ? 'bg-indigo-50 border-indigo-200 shadow-md'
                      : 'bg-white border-slate-50 shadow-md'
                  }`}
                >
                  <div
                    className={`${
                      rem.status === 'RETORNADO'
                        ? 'bg-slate-200'
                        : rem.status === 'RETORNO_PARCIAL'
                        ? 'bg-indigo-100/50'
                        : 'bg-amber-100'
                    } p-8 flex flex-wrap justify-between items-center gap-4`}
                  >
                    <div className="space-y-1">
                      <h3 className="font-black text-2xl uppercase flex items-center tracking-tight text-slate-800">
                        <MapPin
                          className={`w-6 h-6 mr-3 ${
                            rem.status === 'RETORNO_PARCIAL'
                              ? 'text-indigo-500'
                              : 'text-amber-500'
                          }`}
                        />{' '}
                        {String(rem.projeto)} -{' '}
                        {String(rem.expedicao?.destinatario || 'SEM DESTINO')}
                      </h3>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
                        Data de Saída:{' '}
                        {new Date(rem.data_envio).toLocaleDateString()} • Por:{' '}
                        {String(rem.enviado_por || 'Sistema')}
                      </p>

                      {/* Indicadores Visuais de Saldo */}
                      {rem.status !== 'PENDENTE_EXPEDICAO' && (
                        <div className="mt-4 flex flex-wrap items-center gap-3 pt-2">
                          <span className="text-[10px] font-black text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm flex items-center uppercase tracking-widest">
                            <PackageOpen className="w-3 h-3 mr-2 text-slate-400" />{' '}
                            Enviado: {rem.quantidade_op}
                          </span>
                          <span
                            className={`text-[10px] font-black px-3 py-1.5 rounded-lg border shadow-sm flex items-center uppercase tracking-widest ${
                              rem.pecas_recebidas > 0
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                : 'bg-slate-50 text-slate-500 border-slate-200'
                            }`}
                          >
                            <CheckCircle className="w-3 h-3 mr-2 opacity-70" />{' '}
                            Já Recebido: {rem.pecas_recebidas || 0}
                          </span>
                          <span
                            className={`text-[10px] font-black px-3 py-1.5 rounded-lg border shadow-sm flex items-center uppercase tracking-widest ${
                              rem.status === 'RETORNADO'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            <Layers className="w-3 h-3 mr-2 opacity-70" /> Saldo
                            Pendente:{' '}
                            {rem.quantidade_op - (rem.pecas_recebidas || 0)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end space-y-3">
                      <div className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                        Cód Final: {String(rem.produto_acabado)}
                      </div>
                      {rem.status !== 'RETORNADO' ? (
                        <button
                          onClick={() => {
                            setRemessaParaRetorno(rem);
                            setQtdPecasRetornando('');
                          }}
                          className={`${
                            rem.status === 'RETORNO_PARCIAL'
                              ? 'bg-indigo-600 hover:bg-indigo-700'
                              : 'bg-amber-600 hover:bg-amber-700'
                          } text-white px-6 py-3 rounded-2xl text-sm font-black shadow-xl hover:-translate-y-1 transition-all uppercase tracking-wider flex items-center`}
                        >
                          <ArrowLeftRight className="w-4 h-4 mr-2" />{' '}
                          {rem.status === 'RETORNO_PARCIAL'
                            ? 'Continuar Devolução'
                            : 'Iniciar Devolução'}
                        </button>
                      ) : (
                        <div className="bg-emerald-100 text-emerald-900 px-6 py-3 rounded-2xl text-sm font-black border-2 border-emerald-200 flex items-center uppercase tracking-widest">
                          <CheckCircle className="w-5 h-5 mr-2" /> OP Totalmente
                          Fechada
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Inteligente de Retorno Proporcional */}
        {remessaParaRetorno && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-4xl shadow-2xl animate-in zoom-in-95 overflow-hidden">
              <div className="p-10 border-b bg-slate-50 flex justify-between items-center">
                <div>
                  <span className="bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                    RETORNO AUTOMATIZADO DE PEÇAS
                  </span>
                  <h2 className="text-3xl font-black text-slate-800 mt-3 uppercase tracking-tighter">
                    N° PROJETO: {String(remessaParaRetorno.projeto)}
                  </h2>
                  <p className="text-slate-500 font-bold uppercase text-xs">
                    Cód Final: {String(remessaParaRetorno.produto_acabado)} •
                    Total Original da OP:{' '}
                    {String(remessaParaRetorno.quantidade_op)} Peças
                  </p>
                </div>
                <button
                  onClick={() => setRemessaParaRetorno(null)}
                  className="text-slate-400 hover:text-red-500 font-black text-2xl"
                >
                  &times;
                </button>
              </div>

              <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="bg-indigo-50 border-2 border-indigo-200 rounded-3xl p-8 shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-indigo-200 text-indigo-800 text-[9px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                      Trava de Segurança Ativa
                    </div>
                    <label className="text-xs font-black text-indigo-900 uppercase tracking-widest mb-3 block mt-2">
                      Quantas PEÇAS FINAIS estão a chegar agora?
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        min="1"
                        placeholder="0"
                        max={
                          remessaParaRetorno.quantidade_op -
                          (remessaParaRetorno.pecas_recebidas || 0)
                        }
                        className="w-full bg-white border-2 border-indigo-300 rounded-2xl px-6 py-4 font-black text-4xl text-indigo-700 outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                        value={qtdPecasRetornando}
                        onChange={(e) => {
                          let val =
                            e.target.value === '' ? '' : Number(e.target.value);
                          const maxPermitido =
                            remessaParaRetorno.quantidade_op -
                            (remessaParaRetorno.pecas_recebidas || 0);
                          // TRAVA 1: Corrige automaticamente se o utilizador digitar mais que o saldo pendente
                          if (val !== '' && val > maxPermitido)
                            val = maxPermitido;
                          if (val !== '' && val < 0) val = 0;
                          setQtdPecasRetornando(val);
                        }}
                      />
                      <div className="text-right whitespace-nowrap bg-white p-3 rounded-2xl border-2 border-indigo-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Ainda Pendente
                        </p>
                        <p className="text-2xl font-black text-slate-800">
                          {remessaParaRetorno.quantidade_op -
                            (remessaParaRetorno.pecas_recebidas || 0)}{' '}
                          Pçs
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-6 flex items-start gap-4">
                    <Info className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
                    <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase">
                      O sistema está bloqueado para não exceder o Saldo
                      Pendente. O cálculo da devolução de Matéria-Prima (BOM)
                      será proporcional às peças que inserir acima.
                    </p>
                  </div>
                </div>

                <div className="border-2 border-slate-50 rounded-3xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-50 border-b">
                      <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <th className="p-4">Material Base (MP)</th>
                        <th className="p-4 text-center">
                          Crédito Proporcional
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto custom-scrollbar">
                      {(remessaParaRetorno.itens || []).map((it, idx) => {
                        const ratio =
                          Number(qtdPecasRetornando || 0) /
                          Number(remessaParaRetorno.quantidade_op);
                        const retCalculado =
                          qtdPecasRetornando > 0
                            ? Number((it.quantidadeTotal * ratio).toFixed(4))
                            : 0;
                        return (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="p-4 font-black text-slate-700 uppercase">
                              {String(it.codigoMP)}
                            </td>
                            <td className="p-4 text-center font-black text-emerald-600 text-sm">
                              {retCalculado > 0
                                ? `+ ${retCalculado} ${String(it.um)}`
                                : '---'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-10 bg-slate-50 flex justify-end gap-4 border-t">
                <button
                  onClick={() => setRemessaParaRetorno(null)}
                  className="px-8 py-4 font-black text-slate-400 uppercase text-xs hover:bg-slate-200 rounded-2xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={processarRetornoParcial}
                  disabled={!qtdPecasRetornando || qtdPecasRetornando <= 0}
                  className="bg-indigo-600 text-white px-12 py-4 rounded-2xl font-black shadow-xl hover:bg-indigo-700 transition-all uppercase tracking-widest flex items-center disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Confirmar Retorno Seguro{' '}
                  <ArrowUpCircle className="w-5 h-5 ml-3" />
                </button>
              </div>
            </div>
          </div>
        )}

        {abaAtiva === 'GESTAO_USUARIOS' && isAdmin && (
          <div className="max-w-6xl mx-auto space-y-8 w-full animate-in fade-in">
            <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">
              Gestão de Acessos
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-[2rem] p-8 border-2 border-slate-100 shadow-sm h-fit">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-black text-slate-800 flex items-center">
                    {isEditingUser ? (
                      <Settings className="w-5 h-5 mr-2 text-indigo-600" />
                    ) : (
                      <UserPlus className="w-5 h-5 mr-2 text-indigo-600" />
                    )}{' '}
                    {isEditingUser ? 'Modificar' : 'Novo'} Acesso
                  </h3>
                  {isEditingUser && (
                    <button
                      onClick={() => {
                        setNovoUsuario({
                          nome: '',
                          email: '',
                          senha: '',
                          perfil: 'PCP',
                        });
                        setIsEditingUser(false);
                      }}
                      className="text-xs font-black text-red-500 hover:bg-red-50 px-2 py-1 rounded-lg flex items-center"
                    >
                      <XCircle className="w-3 h-3 mr-1" /> Limpar Formulário
                    </button>
                  )}
                </div>
                <form onSubmit={salvarUsuario} className="space-y-4">
                  <input
                    placeholder="Nome Completo do Funcionário"
                    required
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none"
                    value={novoUsuario.nome}
                    onChange={(e) =>
                      setNovoUsuario({ ...novoUsuario, nome: e.target.value })
                    }
                  />
                  <input
                    placeholder="E-mail de Acesso"
                    required
                    type="email"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none"
                    value={novoUsuario.email}
                    onChange={(e) =>
                      setNovoUsuario({ ...novoUsuario, email: e.target.value })
                    }
                  />
                  <input
                    placeholder="Nova Senha"
                    required
                    type="text"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none"
                    value={novoUsuario.senha}
                    onChange={(e) =>
                      setNovoUsuario({ ...novoUsuario, senha: e.target.value })
                    }
                  />
                  <select
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-700"
                    value={novoUsuario.perfil}
                    onChange={(e) =>
                      setNovoUsuario({ ...novoUsuario, perfil: e.target.value })
                    }
                  >
                    <option value="PCP">Setor: PCP (Ex: Arthur/Martins)</option>
                    <option value="EXPEDICAO">
                      Setor: Logística/Expedição
                    </option>
                    <option value="ADMIN">Acesso Total: Administrador</option>
                  </select>
                  <button
                    type="submit"
                    className={`w-full text-white font-black py-4 rounded-2xl shadow-lg uppercase tracking-widest text-xs mt-4 ${
                      isEditingUser
                        ? 'bg-amber-500 hover:bg-amber-600'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    {isEditingUser ? 'Confirmar Edição' : 'Gerar Acesso'}
                  </button>
                </form>
              </div>
              <div className="lg:col-span-2 bg-white rounded-[2rem] border-2 border-slate-100 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b">
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="p-5">Dados do Funcionário</th>
                      <th className="p-5">Privilégios</th>
                      <th className="p-5 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {usuariosDb.map((u) => (
                      <tr key={u.email} className="hover:bg-slate-50">
                        <td className="p-5">
                          <p className="font-black text-slate-800">
                            {String(u.nome)}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold">
                            {String(u.email)}
                          </p>
                        </td>
                        <td className="p-5">
                          <span
                            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                              u.perfil === 'ADMIN'
                                ? 'bg-red-100 text-red-600'
                                : u.perfil === 'PCP'
                                ? 'bg-indigo-100 text-indigo-600'
                                : 'bg-amber-100 text-amber-600'
                            }`}
                          >
                            {String(u.perfil)}
                          </span>
                        </td>
                        <td className="p-5 text-center flex justify-center gap-2">
                          <button
                            onClick={() => {
                              setNovoUsuario(u);
                              setIsEditingUser(true);
                            }}
                            className="p-2 text-indigo-400 hover:bg-indigo-50 rounded-lg"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => excluirUsuario(u.email)}
                            className="p-2 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {abaAtiva === 'CONTROLE_GERAL' && (
          <div className="max-w-7xl mx-auto space-y-6 w-full animate-in fade-in">
            <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">
              Painel de Monitoramento
            </h2>
            <div className="bg-white rounded-[2rem] border-2 border-slate-100 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-50 border-b">
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="p-5 pl-8">Saída Logística</th>
                    <th className="p-5">N° Projeto</th>
                    <th className="p-5">Cód Final (PA)</th>
                    <th className="p-5">Empresa / Destinatário</th>
                    <th className="p-5">Cód Matéria (MP)</th>
                    <th className="p-5 text-right">Qtd Material</th>
                    <th className="p-5 text-center pr-8">Status Atual</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {todosItensExpedidos.map((linha, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-5 pl-8 font-bold text-slate-500">
                        {new Date(
                          linha.remessa.data_envio
                        ).toLocaleDateString()}
                      </td>
                      <td className="p-5 font-black text-amber-600 uppercase tracking-tighter">
                        {String(linha.remessa.projeto)}
                      </td>
                      <td className="p-5 font-black text-blue-600 uppercase tracking-tighter">
                        {String(linha.remessa.produto_acabado)}
                      </td>
                      <td className="p-5 font-black text-slate-700 uppercase">
                        {String(linha.remessa.expedicao?.destinatario || '...')}
                      </td>
                      <td className="p-5 font-black text-slate-800 uppercase tracking-tighter">
                        {String(linha.codigoMP)}
                      </td>
                      <td className="p-5 text-right font-black text-slate-800">
                        {String(linha.quantidadeTotal)} {String(linha.um)}
                      </td>
                      <td className="p-5 text-center pr-8">
                        {linha.remessa.status === 'RETORNADO' ? (
                          <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-[8px] font-black uppercase">
                            Físico Kalenborn
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-[8px] font-black uppercase">
                            Trânsito Externo
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {abaAtiva === 'HISTORICO_PCP' && (
          <div className="max-w-5xl mx-auto w-full animate-in fade-in">
            <h2 className="text-3xl font-black text-slate-800 mb-6 uppercase tracking-tighter">
              Histórico de Liberações PCP
            </h2>
            <div className="bg-white rounded-[2rem] border-2 border-slate-100 overflow-hidden shadow-sm">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-50 border-b">
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="p-5">Data Lançamento</th>
                    <th className="p-5">N° Projeto</th>
                    <th className="p-5">Cód Produto</th>
                    <th className="p-5 text-center">Status Logística</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {remessasDb.map((r) => (
                    <tr
                      key={r.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-5 font-bold text-slate-500">
                        {new Date(r.data_criacao).toLocaleDateString()}
                      </td>
                      <td className="p-5 font-black text-amber-600 uppercase tracking-tighter">
                        {String(r.projeto)}
                      </td>
                      <td className="p-5 font-black text-slate-900 uppercase text-sm tracking-tighter">
                        {String(r.produto_acabado)}
                      </td>
                      <td className="p-5 text-center">
                        {r.status === 'PENDENTE_EXPEDICAO' ? (
                          <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-[9px] font-black uppercase">
                            Na Fila
                          </span>
                        ) : (
                          <span className="bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                            Processado
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {abaAtiva === 'UPLOAD_ESTOQUE' && (
          <div className="max-w-3xl mx-auto space-y-6 text-center w-full animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-4xl font-black text-slate-800 tracking-tighter uppercase tracking-widest">
              Sincronização de Massa (ERP)
            </h2>
            <div className="bg-white rounded-[3rem] p-16 border-2 border-slate-100 shadow-xl flex flex-col items-center">
              <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center mb-8 shadow-inner">
                <UploadCloud className="w-16 h-16 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-4 uppercase tracking-tighter">
                Carregar Planilha de Explosão e Estoque
              </h3>
              <p className="text-slate-400 mb-12 max-w-sm font-bold uppercase text-[10px] tracking-widest leading-relaxed">
                A base de dados será atualizada com blocos de dados (Chunking)
                evitando lentidão do navegador.
              </p>
              <label
                className={`inline-flex items-center justify-center px-12 py-6 rounded-[2rem] font-black text-xl transition-all cursor-pointer shadow-2xl ${
                  isLoading
                    ? 'bg-slate-100 text-slate-300'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600 hover:-translate-y-2 active:scale-95'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-8 h-8 mr-3 animate-spin" /> EXECUTANDO
                    ({String(uploadProgress)}%)
                  </>
                ) : (
                  <>
                    <Database className="w-8 h-8 mr-3" /> INJETAR DADOS NO
                    SUPABASE
                  </>
                )}
                <input
                  type="file"
                  accept=".xlsx, .csv"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isLoading}
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
