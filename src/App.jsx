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
  Construction,
  Edit3,
  Calendar,
  Link2,
} from 'lucide-react';

// ============================================================================
// CONFIGURAÇÃO DO SUPABASE
// ============================================================================
const SUPABASE_URL = 'https://mdsxiijlkruqnhbyxbhe.supabase.co';
const SUPABASE_KEY = 'sb_publishable_6vD-Jyf4pIJdOpvzXKDCOw_YUcX3TcG';
// ============================================================================

export default function App() {
  // --- Estados de Conexão e Auth ---
  const [supabase, setSupabase] = useState(null);
  const [dbOnline, setDbOnline] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [emailLogin, setEmailLogin] = useState('');
  const [senhaLogin, setSenhaLogin] = useState('');
  const [erroLogin, setErroLogin] = useState('');

  // --- Estados de Dados do Banco ---
  const [produtosDb, setProdutosDb] = useState({});
  const [estoqueDb, setEstoqueDb] = useState({});
  const [remessasDb, setRemessasDb] = useState([]);
  const [usuariosDb, setUsuariosDb] = useState([]);

  // --- Estados de UI e Fluxo ---
  const [abaAtiva, setAbaAtiva] = useState('NOVA_OP');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  // --- Estados do Formulário PCP ---
  const [codigoBusca, setCodigoBusca] = useState('');
  const [quantidadeProduzir, setQuantidadeProduzir] = useState(1);
  const [projeto, setProjeto] = useState('');
  const [cliente, setCliente] = useState('');
  const [observacao, setObservacao] = useState('Industrialização');
  const [outrosTexto, setOutrosTexto] = useState('');
  const [produtoEncontrado, setProdutoEncontrado] = useState(null);
  const [itensRemessa, setItensRemessa] = useState([]);

  // --- Estados de Rateio ---
  const [modalRateioAberto, setModalRateioAberto] = useState(false);
  const [idxItemRateio, setIdxItemRateio] = useState(null);
  const [novoRateio, setNovoRateio] = useState({
    projeto: '',
    codigoPA: '',
    quantidade: '',
  });
  const ITENS_RATEIO = ['4941', '4942', '552', '187'];

  // --- Estados de Expedição ---
  const [remessaSelecionada, setRemessaSelecionada] = useState(null);
  const [formExpedicao, setFormExpedicao] = useState({
    transporte: '',
    transportadora: '',
    quantidade: '',
    pesoTotal: '',
    destinatario: '',
    dataSaida: new Date().toISOString().split('T')[0],
  });
  const [templateBuffer, setTemplateBuffer] = useState(null);
  const [nomeTemplate, setNomeTemplate] = useState('');

  // --- Estados de Logística / Retorno ---
  const [buscaFornecedor, setBuscaFornecedor] = useState('');
  const [remessaParaRetorno, setRemessaParaRetorno] = useState(null);
  const [qtdPecasRetornando, setQtdPecasRetornando] = useState('');

  // 1. Carregamento de Scripts Externos e Init Supabase
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

  // 2. Função de Sincronização de Dados
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

  // 3. Funções de Negócio - Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setErroLogin('');
    if (!supabase) return setErroLogin('Conectando ao banco...');
    setIsLoading(true);
    try {
      const { data, error } = await supabase
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
      setErroLogin('Erro de acesso.');
    } finally {
      setIsLoading(false);
    }
  };

  // 4. PCP - Busca de Produto e Explosão de MP
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
            quantidadeOriginal: qtdBase,
            quantidadeRetornada: 0,
            rateiosExtras: [],
          };
        })
      );
    } else {
      setErro('Produto acabado não localizado na base.');
    }
  };

  // 5. PCP - Enviar Ordem para Expedição
  const enviarParaExpedicao = async () => {
    const servicoFinal =
      observacao === 'Outros' ? outrosTexto || 'Outros' : observacao;
    setIsLoading(true);
    try {
      for (const it of itensRemessa) {
        const { data: cur, error: errEst } = await supabase
          .from('estoque_mp')
          .select('saldo_disponivel')
          .eq('codigo_mp', it.codigoMP)
          .single();
        if (errEst) throw new Error(errEst.message);
        await supabase
          .from('estoque_mp')
          .update({
            saldo_disponivel: Number(
              ((cur?.saldo_disponivel || 0) - it.quantidadeTotal).toFixed(4)
            ),
          })
          .eq('codigo_mp', it.codigoMP);
      }

      const { error: errIns } = await supabase.from('remessas').insert([
        {
          id: `REM-${Date.now()}`,
          produto_acabado: produtoEncontrado.codigo_pa,
          descricao_produto: produtoEncontrado.descricao,
          quantidade_op: quantidadeProduzir,
          projeto: projeto.toUpperCase(),
          cliente: cliente.toUpperCase(),
          observacao: servicoFinal,
          itens: itensRemessa,
          status: 'PENDENTE_EXPEDICAO',
          criado_por: usuarioLogado.nome,
          pecas_recebidas: 0,
        },
      ]);

      if (errIns) throw new Error(errIns.message);

      setSucesso('Remessa enviada para Logística!');
      setIsLoading(false);
      setProdutoEncontrado(null);
      setOutrosTexto('');
      setAbaAtiva('HISTORICO_PCP');
      fetchAllData();
    } catch (e) {
      setErro('Erro ao salvar OP: ' + e.message);
      setIsLoading(false);
    }
  };

  // 6. Expedição - Concluir e Gerar SGQ
  const concluirExpedicao = async () => {
    if (!templateBuffer) return setErro('Modelo SGQ ausente na nuvem.');
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

      // Cabeçalho SGQ
      ws.getCell('B4').value = remessaSelecionada.projeto;
      ws.getCell('C4').value = remessaSelecionada.cliente;
      ws.getCell('B6').value = formExpedicao.transporte;
      ws.getCell('C6').value = formExpedicao.transportadora;
      ws.getCell('B8').value = formExpedicao.quantidade;
      ws.getCell('C8').value = formExpedicao.pesoTotal;
      ws.getCell(
        'E8'
      ).value = `${remessaSelecionada.projeto} - ${formExpedicao.destinatario}`;
      ws.getCell('G8').value = formExpedicao.dataSaida;

      // Itens MP
      (remessaSelecionada.itens || []).forEach((it, i) => {
        const r = 12 + i;
        ws.getCell(`C${r}`).value = it.codigoMP;
        ws.getCell(`E${r}`).value = it.descricao;
        ws.getCell(`F${r}`).value = it.quantidadeTotal;
        ws.getCell(`G${r}`).value = it.um;
        ws.getCell(`H${r}`).value =
          remessaSelecionada.observacao || 'Industrialização';
      });

      const buf = await wb.xlsx.writeBuffer();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([buf]));
      a.download = `SGQ_PRJ_${remessaSelecionada.projeto}.xlsx`;
      a.click();

      setSucesso('SGQ Gerado com sucesso!');
      setRemessaSelecionada(null);
      setIsLoading(false);
      fetchAllData();
    } catch (e) {
      setErro('Falha na geração: ' + e.message);
      setIsLoading(false);
    }
  };

  // 7. Logística - Retorno Seguro de Peças
  const processarRetornoParcial = async () => {
    const pecasDevolvidas = Number(qtdPecasRetornando);
    const pecasJaRecebidas = Number(remessaParaRetorno.pecas_recebidas || 0);
    const quantidadeOp = Number(remessaParaRetorno.quantidade_op);
    const saldoPendente = quantidadeOp - pecasJaRecebidas;

    if (pecasDevolvidas <= 0) return setErro('Informe a quantidade de peças.');
    if (pecasDevolvidas > saldoPendente)
      return setErro(
        `Bloqueio: Saldo pendente é de apenas ${saldoPendente} peça(s).`
      );

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
        const { data: cur, error: errEst } = await supabase
          .from('estoque_mp')
          .select('saldo_disponivel')
          .eq('codigo_mp', novosItens[i].codigoMP)
          .single();
        if (errEst) throw new Error(errEst.message);
        await supabase
          .from('estoque_mp')
          .update({
            saldo_disponivel: Number(
              ((cur?.saldo_disponivel || 0) + qtdMP).toFixed(4)
            ),
          })
          .eq('codigo_mp', novosItens[i].codigoMP);
      }

      const novoTotalJa = pecasJaRecebidas + pecasDevolvidas;
      const novoStatus =
        novoTotalJa >= quantidadeOp ? 'RETORNADO' : 'RETORNO_PARCIAL';

      const { error: errRem } = await supabase
        .from('remessas')
        .update({
          itens: novosItens,
          status: novoStatus,
          pecas_recebidas: novoTotalJa,
          data_retorno: new Date().toISOString(),
          recebido_por: usuarioLogado.nome,
        })
        .eq('id', remessaParaRetorno.id);

      if (errRem) throw new Error(errRem.message);
      setSucesso(
        novoStatus === 'RETORNADO' ? 'OP Finalizada!' : 'Retorno Parcial!'
      );
      setRemessaParaRetorno(null);
      setQtdPecasRetornando('');
      fetchAllData();
    } catch (e) {
      setErro('Falha no Retorno: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Filtros e Agrupamentos ---
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

  // Lógica de Explosão para o Controle Geral - AGORA ORDENADO POR DATA (Mais Recentes Primeiro)
  const todosItensExpedidos = useMemo(
    () =>
      remessasFora
        .flatMap((r) => {
          return (r.itens || []).flatMap((it) => {
            const linhas = [];
            const hasRateio = it.rateiosExtras && it.rateiosExtras.length > 0;

            // Linha Original (Ficha Técnica)
            linhas.push({
              ...it,
              quantidadeTotal: it.quantidadeOriginal || it.quantidadeTotal,
              remessa: r,
              isRateio: false,
              temRateio: hasRateio,
            });

            // Linhas de Rateio Adicional
            if (hasRateio) {
              it.rateiosExtras.forEach((rat) => {
                linhas.push({
                  ...it,
                  quantidadeTotal: rat.quantidade,
                  remessa: {
                    ...r,
                    projeto: rat.projeto,
                    produto_acabado: rat.codigoPA,
                  },
                  isRateio: true,
                  origemProjeto: r.projeto,
                });
              });
            }
            return linhas;
          });
        })
        .sort(
          (a, b) =>
            new Date(b.remessa.data_envio || 0) -
            new Date(a.remessa.data_envio || 0)
        ),
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
              placeholder="E-mail"
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
              Acessar Sistema
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
        </div>
        <div className="p-4 bg-slate-950 space-y-4">
          <div className="flex items-center justify-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            {dbOnline ? (
              <Cloud className="w-3 h-3 mr-1 text-emerald-500" />
            ) : (
              <CloudOff className="w-3 h-3 mr-1 text-red-500" />
            )}
            {dbOnline ? 'Supabase Online' : 'Offline'}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-y-auto relative p-6 md:p-8 custom-scrollbar">
        {isLoading && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-md z-[60] flex flex-col items-center justify-center text-center">
            <Loader2 className="w-20 h-20 text-indigo-600 animate-spin mb-6" />
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
              Processando...
            </h3>
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
              className="font-black text-xl ml-4"
            >
              &times;
            </button>
          </div>
        )}

        {abaAtiva === 'NOVA_OP' && (
          <div className="max-w-4xl mx-auto space-y-6 w-full animate-in fade-in">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">
              Nova Ordem de Remessa
            </h2>
            <div className="bg-white rounded-3xl p-8 border-2 border-slate-100 shadow-sm">
              <form
                onSubmit={buscarProduto}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">
                    Cód Produto Acabado
                  </label>
                  <input
                    placeholder="Ex: 100200"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-black uppercase text-slate-700 outline-none focus:border-indigo-300"
                    value={codigoBusca}
                    onChange={(e) => setCodigoBusca(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">
                    Quantidade Total OP
                  </label>
                  <input
                    type="number"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-black text-slate-700 outline-none focus:border-indigo-300"
                    value={quantidadeProduzir}
                    onChange={(e) =>
                      setQuantidadeProduzir(parseInt(e.target.value) || 1)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">
                    N° do Projeto
                  </label>
                  <input
                    placeholder="PRJ-..."
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-black text-slate-700 outline-none focus:border-indigo-300"
                    value={projeto}
                    onChange={(e) => setProjeto(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">
                    Cliente Final
                  </label>
                  <input
                    placeholder="Nome do Cliente"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-black text-slate-700 outline-none focus:border-indigo-300"
                    value={cliente}
                    onChange={(e) => setCliente(e.target.value)}
                  />
                </div>

                <div
                  className={`space-y-1 ${
                    observacao === 'Outros' ? 'lg:col-span-1' : 'lg:col-span-2'
                  }`}
                >
                  <label className="text-[10px] font-black text-indigo-600 uppercase ml-2 flex items-center">
                    <Construction className="w-3 h-3 mr-1" /> Tipo de
                    Industrialização (SGQ)
                  </label>
                  <select
                    className="w-full bg-indigo-50 border-2 border-indigo-100 rounded-xl px-4 py-3 font-black text-indigo-900 outline-none focus:border-indigo-400"
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                  >
                    <option value="Industrialização">
                      Industrialização (Padrão)
                    </option>
                    <option value="Jateamento Interno">
                      Jateamento Interno
                    </option>
                    <option value="Jateamento Externo">
                      Jateamento Externo
                    </option>
                    <option value="Reforma">Reforma</option>
                    <option value="Autoclave">Autoclave</option>
                    <option value="Montagem de Placas">
                      Montagem de Placas
                    </option>
                    <option value="Outros">Outros (Especificar)</option>
                  </select>
                </div>

                {observacao === 'Outros' && (
                  <div className="space-y-1 lg:col-span-1 animate-in slide-in-from-left-2">
                    <label className="text-[10px] font-black text-amber-600 uppercase ml-2 flex items-center">
                      <Edit3 className="w-3 h-3 mr-1" /> Descreva o Serviço
                    </label>
                    <input
                      placeholder="Ex: Pintura Especial"
                      className="w-full bg-amber-50 border-2 border-amber-200 rounded-xl px-4 py-3 font-black text-amber-900 outline-none focus:border-amber-400"
                      value={outrosTexto}
                      onChange={(e) => setOutrosTexto(e.target.value)}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="lg:col-span-3 bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-black transition-all shadow-xl uppercase tracking-wider text-sm mt-2"
                >
                  Explodir Matéria-Prima (BOM)
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
                      <th className="p-4 text-center">Quantitativo</th>
                      <th className="p-4 text-center">Estoque</th>
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
                            onClick={() =>
                              setItensRemessa((prev) =>
                                prev.filter((_, idx) => idx !== i)
                              )
                            }
                            className="text-slate-300 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4 mx-auto" />
                          </button>
                        </td>
                        <td className="p-4 font-black text-slate-700 uppercase tracking-tighter">
                          {it.codigoMP}
                        </td>
                        <td className="p-4 text-slate-500 font-medium truncate max-w-[200px]">
                          {it.descricao}
                        </td>
                        <td className="p-4 text-center font-black text-indigo-600">
                          {ITENS_RATEIO.includes(it.codigoMP) ? (
                            <div className="flex items-center justify-center gap-2">
                              <input
                                readOnly
                                value={it.quantidadeTotal}
                                className="w-16 bg-slate-100 border rounded text-center font-black text-slate-500"
                              />
                              <button
                                onClick={() => {
                                  setIdxItemRateio(i);
                                  setModalRateioAberto(true);
                                }}
                                className={`p-1.5 rounded-lg ${
                                  it.rateiosExtras?.length > 0
                                    ? 'bg-emerald-100 text-emerald-600'
                                    : 'bg-indigo-100 text-indigo-600'
                                }`}
                              >
                                <PieChart className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <span>
                              {it.quantidadeTotal} {it.um}
                            </span>
                          )}
                        </td>
                        <td
                          className={`p-4 text-center font-black ${
                            it.saldoDisponivel < it.quantidadeTotal
                              ? 'text-red-500'
                              : 'text-emerald-500'
                          }`}
                        >
                          {it.saldoDisponivel}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="p-6 bg-slate-50 flex justify-end border-t">
                  <button
                    onClick={enviarParaExpedicao}
                    className="px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl hover:bg-indigo-700 transition-all uppercase tracking-wider flex items-center text-sm"
                  >
                    <ArrowRight className="w-5 h-5 mr-3" /> Validar & Enviar p/
                    Expedição
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal de Rateio PCP */}
        {modalRateioAberto && idxItemRateio !== null && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col">
              <div className="p-8 border-b bg-slate-50 flex justify-between items-center">
                <div>
                  <span className="bg-indigo-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase">
                    Rateio Adicional de Envio
                  </span>
                  <h2 className="text-2xl font-black text-slate-800 mt-2 uppercase tracking-tighter">
                    MP: {itensRemessa[idxItemRateio].codigoMP}
                  </h2>
                </div>
                <button
                  onClick={() => setModalRateioAberto(false)}
                  className="text-slate-400 font-black text-2xl"
                >
                  &times;
                </button>
              </div>
              <div className="p-8 bg-white space-y-6">
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">
                      Projeto Destino
                    </label>
                    <input
                      placeholder="PRJ-..."
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-black text-slate-700 outline-none"
                      value={novoRateio.projeto}
                      onChange={(e) =>
                        setNovoRateio({
                          ...novoRateio,
                          projeto: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">
                      PA Destino
                    </label>
                    <input
                      placeholder="PA-..."
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-black text-slate-700 outline-none"
                      value={novoRateio.codigoPA}
                      onChange={(e) =>
                        setNovoRateio({
                          ...novoRateio,
                          codigoPA: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </div>
                  <div className="w-24">
                    <label className="text-[10px] font-black text-slate-400 uppercase">
                      Qtd
                    </label>
                    <input
                      type="number"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-black text-slate-700 outline-none"
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
                    onClick={() => {
                      if (
                        !novoRateio.projeto ||
                        !novoRateio.codigoPA ||
                        !novoRateio.quantidade
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
                      n[idxItemRateio].quantidadeTotal =
                        n[idxItemRateio].quantidadeOriginal +
                        n[idxItemRateio].rateiosExtras.reduce(
                          (acc, c) => acc + c.quantidade,
                          0
                        );
                      setItensRemessa(n);
                      setNovoRateio({
                        projeto: '',
                        codigoPA: '',
                        quantidade: '',
                      });
                    }}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black uppercase text-xs hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
                <div className="border-2 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b">
                      <tr>
                        <th className="p-3">Destino</th>
                        <th className="p-3">PA</th>
                        <th className="p-3 text-center">Quantidade</th>
                        <th className="p-3 text-center">Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-indigo-50/50 text-indigo-900 font-bold">
                        <td className="p-3">{projeto} (Ficha)</td>
                        <td className="p-3">{produtoEncontrado?.codigo_pa}</td>
                        <td className="p-3 text-center">
                          {itensRemessa[idxItemRateio].quantidadeOriginal}
                        </td>
                        <td className="p-3 text-center">
                          <Lock className="w-3 h-3 mx-auto text-indigo-300" />
                        </td>
                      </tr>
                      {(itensRemessa[idxItemRateio].rateiosExtras || []).map(
                        (r, ri) => (
                          <tr key={ri} className="border-t">
                            <td className="p-3 font-black text-slate-700">
                              {r.projeto}
                            </td>
                            <td className="p-3 font-black text-slate-700">
                              {r.codigoPA}
                            </td>
                            <td className="p-3 text-center font-bold text-emerald-600">
                              +{r.quantidade}
                            </td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => {
                                  const n = [...itensRemessa];
                                  n[idxItemRateio].rateiosExtras.splice(ri, 1);
                                  n[idxItemRateio].quantidadeTotal =
                                    n[idxItemRateio].quantidadeOriginal +
                                    n[idxItemRateio].rateiosExtras.reduce(
                                      (acc, c) => acc + c.quantidade,
                                      0
                                    );
                                  setItensRemessa(n);
                                }}
                                className="text-red-400 hover:text-red-600"
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
              <div className="p-8 bg-slate-50 border-t flex justify-between items-center">
                <span className="font-black text-slate-500 uppercase text-xs">
                  Total Aglomerado p/ SGQ:{' '}
                  <span className="text-indigo-600 text-2xl ml-2">
                    {itensRemessa[idxItemRateio].quantidadeTotal}
                  </span>
                </span>
                <button
                  onClick={() => setModalRateioAberto(false)}
                  className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black uppercase text-xs hover:bg-black"
                >
                  Gravar Rateio
                </button>
              </div>
            </div>
          </div>
        )}

        {abaAtiva === 'CONTROLE_GERAL' && (
          <div className="max-w-7xl mx-auto space-y-6 w-full animate-in fade-in">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">
                  Painel de Monitoramento
                </h2>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">
                  Ordenado por data de envio (Mais recentes primeiro)
                </p>
              </div>
              <button
                onClick={fetchAllData}
                className="bg-white border-2 border-slate-100 p-3 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
              >
                <RefreshCcw className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white rounded-[2rem] border-2 border-slate-100 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-slate-50 border-b">
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="p-5 pl-8">Data Envio</th>
                      <th className="p-5">N° Projeto</th>
                      <th className="p-5">Cód Final (PA)</th>
                      <th className="p-5">Cód Matéria (MP)</th>
                      <th className="p-5">Tipo Serviço</th>
                      <th className="p-5 text-right">Qtd</th>
                      <th className="p-5 text-center pr-8">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {todosItensExpedidos.map((linha, idx) => (
                      <tr
                        key={idx}
                        className={`hover:bg-slate-50 transition-colors ${
                          linha.isRateio ? 'bg-emerald-50/20' : ''
                        }`}
                      >
                        <td className="p-5 pl-8 font-bold text-slate-400 flex items-center">
                          <Calendar className="w-3 h-3 mr-2 opacity-50" />
                          {linha.remessa.data_envio
                            ? new Date(
                                linha.remessa.data_envio
                              ).toLocaleDateString()
                            : '---'}
                        </td>
                        <td className="p-5 font-black text-slate-800 uppercase tracking-tighter">
                          <div className="flex flex-col">
                            <span
                              className={
                                linha.isRateio
                                  ? 'text-emerald-600'
                                  : 'text-amber-600'
                              }
                            >
                              {String(linha.remessa.projeto)}
                            </span>
                            {linha.isRateio && (
                              <span className="text-[8px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full w-fit mt-1 flex items-center">
                                <Link2 className="w-2 h-2 mr-1" /> RATEADO DE:{' '}
                                {linha.origemProjeto}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-5 font-black text-blue-600 uppercase tracking-tighter">
                          {String(linha.remessa.produto_acabado)}
                        </td>
                        <td className="p-5 font-black text-slate-700 uppercase tracking-tighter">
                          {String(linha.codigoMP)}
                        </td>
                        <td className="p-5">
                          <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-tighter shadow-sm">
                            {String(
                              linha.remessa.observacao || 'Industrialização'
                            )}
                          </span>
                        </td>
                        <td className="p-5 text-right font-black text-slate-800">
                          {String(linha.quantidadeTotal)} {String(linha.um)}
                        </td>
                        <td className="p-5 text-center pr-8">
                          {linha.remessa.status === 'RETORNADO' ? (
                            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[8px] font-black uppercase">
                              Entregue
                            </span>
                          ) : (
                            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[8px] font-black uppercase">
                              Trânsito
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {todosItensExpedidos.length === 0 && (
                      <tr>
                        <td
                          colSpan="7"
                          className="p-20 text-center font-black text-slate-200 uppercase text-2xl tracking-[0.2em]"
                        >
                          Sem registos expedidos
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {abaAtiva === 'FORNECEDORES' && (
          <div className="max-w-5xl mx-auto space-y-6 w-full animate-in fade-in">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">
                  Gestão de Retornos
                </h2>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">
                  Controle de saldo e devolução proporcional de MP
                </p>
              </div>
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  placeholder="Filtrar Projeto..."
                  className="w-full bg-white border-2 border-slate-50 shadow-sm rounded-xl pl-9 pr-4 py-2 font-black text-xs outline-none focus:border-amber-400"
                  value={buscaFornecedor}
                  onChange={(e) => setBuscaFornecedor(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2 custom-scrollbar">
              {remessasFora
                .filter(
                  (r) => !buscaFornecedor || r.projeto.includes(buscaFornecedor)
                )
                .map((rem) => (
                  <div
                    key={rem.id}
                    className={`p-8 rounded-[2rem] border-2 bg-white flex justify-between items-center transition-all ${
                      rem.status === 'RETORNADO'
                        ? 'opacity-40 grayscale'
                        : 'shadow-md border-slate-50 hover:border-amber-100'
                    }`}
                  >
                    <div className="space-y-1">
                      <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">
                        PA: {rem.produto_acabado}
                      </span>
                      <h4 className="font-black text-2xl text-slate-800 uppercase tracking-tight">
                        {rem.projeto} •{' '}
                        <span className="text-indigo-600">
                          {rem.observacao || 'Industrialização'}
                        </span>
                      </h4>
                      <div className="flex gap-4 mt-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                          <ClipboardList className="w-3 h-3 mr-1" /> Enviado:{' '}
                          {rem.quantidade_op} Pçs
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest flex items-center ${
                            rem.pecas_recebidas > 0
                              ? 'text-indigo-600'
                              : 'text-slate-300'
                          }`}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" /> Recebido:{' '}
                          {rem.pecas_recebidas || 0}
                        </span>
                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center">
                          <Clock className="w-3 h-3 mr-1" /> Pendente:{' '}
                          {rem.quantidade_op - (rem.pecas_recebidas || 0)}
                        </span>
                      </div>
                    </div>
                    {rem.status !== 'RETORNADO' ? (
                      <button
                        onClick={() => {
                          setRemessaParaRetorno(rem);
                          setQtdPecasRetornando('');
                        }}
                        className="bg-amber-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs shadow-xl hover:-translate-y-1 transition-all flex items-center"
                      >
                        Confirmar Entrada{' '}
                        <ArrowLeftRight className="w-4 h-4 ml-2" />
                      </button>
                    ) : (
                      <div className="text-emerald-500 font-black flex items-center uppercase text-xs tracking-widest bg-emerald-50 px-6 py-3 rounded-2xl">
                        <CheckCircle className="w-5 h-5 mr-2" /> OP Concluída
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Modal de Retorno Proporcional */}
        {remessaParaRetorno && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-4xl shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-8 border-b bg-slate-50 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
                    Confirmar Retorno: {remessaParaRetorno.projeto}
                  </h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                    {remessaParaRetorno.observacao || 'Industrialização'} •{' '}
                    {remessaParaRetorno.produto_acabado}
                  </p>
                </div>
                <button
                  onClick={() => setRemessaParaRetorno(null)}
                  className="text-slate-400 text-2xl font-black"
                >
                  &times;
                </button>
              </div>
              <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10 overflow-y-auto custom-scrollbar">
                <div className="space-y-6">
                  <div className="bg-indigo-50 border-2 border-indigo-100 rounded-3xl p-8 shadow-inner text-center">
                    <label className="text-[10px] font-black text-indigo-900 uppercase block mb-4 tracking-widest">
                      Qtd de peças finais (PA) recebidas nesta leva:
                    </label>
                    <input
                      type="number"
                      step="1"
                      className="w-full bg-white border-2 border-indigo-200 rounded-2xl px-6 py-6 font-black text-6xl text-indigo-700 text-center outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                      value={qtdPecasRetornando}
                      onChange={(e) => {
                        let v =
                          e.target.value === '' ? '' : Number(e.target.value);
                        const max =
                          remessaParaRetorno.quantidade_op -
                          (remessaParaRetorno.pecas_recebidas || 0);
                        if (v > max) v = max;
                        if (v < 0) v = 0;
                        setQtdPecasRetornando(v);
                      }}
                    />
                  </div>
                </div>
                <div className="border-2 border-slate-50 rounded-3xl overflow-hidden shadow-sm flex flex-col">
                  <div className="p-4 bg-slate-50 border-b font-black text-[10px] text-slate-400 uppercase tracking-widest">
                    Devolução de MP (Saldo Disponível)
                  </div>
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="p-3">Material (MP)</th>
                        <th className="p-3 text-center">Crédito Automático</th>
                      </tr>
                    </thead>
                    <tbody>
                      {remessaParaRetorno.itens.map((it, idx) => {
                        const ratio =
                          Number(qtdPecasRetornando || 0) /
                          Number(remessaParaRetorno.quantidade_op);
                        const calc = Number(
                          (it.quantidadeTotal * ratio).toFixed(4)
                        );
                        return (
                          <tr key={idx} className="border-t hover:bg-slate-50">
                            <td className="p-3 font-bold uppercase text-slate-700">
                              {it.codigoMP}
                            </td>
                            <td className="p-3 text-center font-black text-emerald-600 text-sm">
                              +{calc} {it.um}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="p-8 bg-slate-50 border-t flex justify-end gap-4 items-center">
                <button
                  onClick={processarRetornoParcial}
                  disabled={!qtdPecasRetornando}
                  className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black uppercase text-xs shadow-xl disabled:opacity-20 transition-all"
                >
                  Validar Entrada
                </button>
              </div>
            </div>
          </div>
        )}

        {abaAtiva === 'EXPEDICAO' && (
          <div className="flex flex-col md:flex-row gap-6 h-full animate-in fade-in">
            <div className="w-full md:w-1/3 bg-white rounded-3xl border-2 border-slate-50 flex flex-col h-[calc(100vh-10rem)] overflow-hidden shadow-sm">
              <div className="p-6 border-b bg-amber-50 flex justify-between items-center">
                <h2 className="font-black text-amber-900 text-lg uppercase tracking-wider flex items-center">
                  <Clock className="w-5 h-5 mr-2" /> Fila Expedição (
                  {remessasPendentes.length})
                </h2>
                <button
                  onClick={fetchAllData}
                  className="text-amber-600 hover:rotate-180 transition-all duration-500"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {remessasPendentes.map((rem) => (
                  <div
                    key={rem.id}
                    onClick={() => setRemessaSelecionada(rem)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      remessaSelecionada?.id === rem.id
                        ? 'border-amber-400 bg-amber-50 shadow-md scale-[1.02]'
                        : 'border-slate-50 hover:border-amber-100'
                    }`}
                  >
                    <span className="font-black text-amber-600 text-[9px] uppercase tracking-widest block mb-1">
                      PROJETO: {rem.projeto}
                    </span>
                    <h4 className="font-black text-slate-800 text-lg tracking-tighter uppercase leading-tight">
                      {rem.produto_acabado}
                    </h4>
                    <span className="inline-block mt-2 bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter">
                      {rem.observacao || 'Industrialização'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 bg-white rounded-3xl border-2 border-slate-50 h-[calc(100vh-10rem)] shadow-sm overflow-hidden flex flex-col">
              {remessaSelecionada ? (
                <div className="p-10 space-y-8 overflow-y-auto custom-scrollbar h-full animate-in slide-in-from-right-4">
                  <div className="pb-6 border-b flex justify-between items-start">
                    <div>
                      <div className="bg-amber-600 text-white text-[9px] font-black px-3 py-1 rounded-full w-fit uppercase mb-3 tracking-widest">
                        ORDEM: {remessaSelecionada.projeto}
                      </div>
                      <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tighter leading-none">
                        {remessaSelecionada.produto_acabado}
                      </h3>
                    </div>
                    <button
                      onClick={() => setRemessaSelecionada(null)}
                      className="text-slate-300 hover:text-red-500 font-black text-xl"
                    >
                      &times;
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2">
                        Modo de Transporte
                      </label>
                      <input
                        placeholder="Ex: Rodoviário"
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-black outline-none focus:border-amber-400"
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
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2">
                        Transportadora
                      </label>
                      <input
                        placeholder="Nome da empresa"
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-black outline-none focus:border-amber-400"
                        value={formExpedicao.transportadora}
                        onChange={(e) =>
                          setFormExpedicao({
                            ...formExpedicao,
                            transportadora: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1 col-span-2">
                      <label className="text-[10px] font-black text-amber-600 uppercase ml-2">
                        Destinatário / Unidade de destino
                      </label>
                      <input
                        placeholder="Empresa responsável pelo serviço"
                        className="w-full bg-amber-50 border-2 border-amber-100 rounded-xl px-4 py-3 font-black outline-none focus:border-amber-400"
                        value={formExpedicao.destinatario}
                        onChange={(e) =>
                          setFormExpedicao({
                            ...formExpedicao,
                            destinatario: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <button
                    onClick={concluirExpedicao}
                    className="w-full bg-slate-900 text-white font-black py-5 rounded-3xl shadow-xl hover:bg-black transition-all uppercase tracking-widest text-lg flex items-center justify-center shadow-slate-200"
                  >
                    <FileSpreadsheet className="w-6 h-6 mr-3" /> Gerar SGQ Excel
                    & Enviar
                  </button>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center font-black text-slate-100 uppercase tracking-[0.4em] flex-col p-10 text-center">
                  <Truck className="w-24 h-24 mb-6 opacity-5" />
                  <p>Selecione uma remessa na fila</p>
                </div>
              )}
            </div>
          </div>
        )}

        {abaAtiva === 'UPLOAD_ESTOQUE' && (
          <div className="max-w-3xl mx-auto space-y-6 text-center w-full animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-4xl font-black text-slate-800 tracking-tighter uppercase tracking-widest">
              Sincronização ERP
            </h2>
            <div className="bg-white rounded-[3rem] p-16 border-2 border-slate-100 shadow-xl flex flex-col items-center">
              <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center mb-8 shadow-inner">
                <UploadCloud className="w-16 h-16 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-4 uppercase tracking-tighter leading-none">
                Carregar Explosão & Saldos
              </h3>
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
                    ({uploadProgress}%)
                  </>
                ) : (
                  <>
                    <Database className="w-8 h-8 mr-3" /> INJETAR DADOS NO
                    SUPABASE
                  </>
                )}
                <input
                  type="file"
                  accept=".xlsx"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setIsLoading(true);
                    setUploadProgress(10);
                    const reader = new FileReader();
                    reader.onload = async (evt) => {
                      try {
                        const wb = window.XLSX.read(evt.target.result, {
                          type: 'array',
                        });
                        const json = window.XLSX.utils.sheet_to_json(
                          wb.Sheets[wb.SheetNames[0]]
                        );
                        const parseNum = (v) => {
                          if (!v) return 0;
                          let s = String(v)
                            .replace(/\./g, '')
                            .replace(',', '.');
                          return Number(s) || 0;
                        };
                        const pMap = {};
                        const eMap = {};
                        json.forEach((row) => {
                          const pa = String(
                            row['COD ACABADO'] || row['PRODUTO'] || ''
                          ).trim();
                          const mp = String(
                            row['CODIGO MP'] || row['MATERIAL'] || ''
                          ).trim();
                          if (!pa || !mp) return;
                          if (!pMap[pa])
                            pMap[pa] = {
                              codigo_pa: pa,
                              descricao: String(row['DESCRICAO PA'] || ''),
                              materiais: [],
                            };
                          pMap[pa].materiais.push({
                            codigoMP: mp,
                            quantidade: parseNum(row['QUANTIDADE']),
                            um: String(row['UN'] || 'UN'),
                          });
                          if (!eMap[mp])
                            eMap[mp] = {
                              codigo_mp: mp,
                              descricao: String(row['DESCRICAO MP'] || ''),
                              saldo_disponivel: parseNum(
                                row['SALDO FISICO'] || row['DISPONIVEL']
                              ),
                              unidade: String(row['UN'] || 'UN'),
                            };
                        });
                        await supabase
                          .from('produtos')
                          .upsert(Object.values(pMap));
                        await supabase
                          .from('estoque_mp')
                          .upsert(Object.values(eMap));
                        setSucesso('Stock atualizado!');
                      } catch (err) {
                        setErro('Falha: ' + err.message);
                      } finally {
                        setIsLoading(false);
                        fetchAllData();
                      }
                    };
                    reader.readAsArrayBuffer(file);
                  }}
                />
              </label>
            </div>
          </div>
        )}

        {abaAtiva === 'HISTORICO_PCP' && (
          <div className="max-w-5xl mx-auto w-full animate-in fade-in">
            <h2 className="text-3xl font-black text-slate-800 mb-6 uppercase tracking-tighter">
              Histórico de Envios
            </h2>
            <div className="bg-white rounded-[2rem] border-2 border-slate-100 overflow-hidden shadow-sm">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-50 border-b">
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="p-5">Data Lançamento</th>
                    <th className="p-5">N° Projeto</th>
                    <th className="p-5">Produto Final (PA)</th>
                    <th className="p-5 text-center">Status Fila</th>
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
                      <td className="p-5 font-black text-amber-600 tracking-tighter">
                        {r.projeto}
                      </td>
                      <td className="p-5 font-black text-slate-900 tracking-tighter">
                        {r.produto_acabado}
                      </td>
                      <td className="p-5 text-center">
                        {r.status === 'PENDENTE_EXPEDICAO' ? (
                          <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                            Fila Logística
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
      </div>
    </div>
  );
}
