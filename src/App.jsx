import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, Upload, Trash2, Database, AlertCircle, FileSpreadsheet, 
  CheckCircle, RefreshCcw, Loader2, Calculator, Cloud, CloudOff, 
  ServerCrash, Truck, MapPin, ClipboardList, PackageOpen, ArrowRight, 
  LayoutDashboard, History, UploadCloud, Users, Clock, ShieldAlert, 
  ArrowLeftRight, ListChecks, Lock, Mail, LogOut, User, Shield, 
  ArrowUpCircle, UserPlus, KeyRound, Settings, XCircle, Info, 
  FileWarning, FileCheck, Layers, PieChart, Construction, Edit3,
  Calendar, Link2, Filter, Eye, AlertTriangle, FileSearch, Weight, Boxes,
  Building2, ArrowUpDown, ArrowUp, ArrowDown, TrendingUp, BarChart, Activity, Target,
  GripVertical, CornerDownRight, Network, PlusCircle, MessageSquare, Send, Bot, Maximize2,
  Lightbulb, Presentation, BrainCircuit, LineChart, Menu, X, Save, FileText, Printer, ChevronLeft,
  MessageCircle, BotMessageSquare
} from 'lucide-react';

// ============================================================================
// CONFIGURAÇÃO DO SEU SUPABASE
// ============================================================================
const SUPABASE_URL = "https://mdsxiijlkruqnhbyxbhe.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_6vD-Jyf4pIJdOpvzXKDCOw_YUcX3TcG";
// ============================================================================

const s = (val) => {
  if (val === null || val === undefined) return "";
  return String(val);
};

// Componente Super Premium de Gráfico para a Diretoria (Lido da IA)
const BoardChart = ({ title, data }) => {
  if (!data || !Array.isArray(data) || data.length === 0) return (
     <div className="my-8 bg-slate-900/5 p-8 rounded-[2rem] border border-slate-200 border-dashed text-center font-bold text-slate-400 uppercase tracking-widest text-xs">Dados insuficientes para gerar o módulo visual</div>
  );
  
  const max = Math.max(...(data.map(d => Number(d.value) || 0)), 1);
  
  return (
    <div className="my-8 bg-slate-950 p-6 md:p-10 rounded-[2.5rem] shadow-2xl border border-slate-800 animate-in zoom-in-95 overflow-hidden relative w-full group/chart print:bg-white print:border-slate-200 print:shadow-none print:break-inside-avoid">
      {/* Background Grid Hi-Tech */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 print:hidden"></div>
      
      {/* Luzes decorativas */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20 pointer-events-none print:hidden"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-20 pointer-events-none print:hidden"></div>

      <h5 className="font-black text-white print:text-slate-800 uppercase tracking-tighter text-lg md:text-2xl mb-12 flex items-center relative z-10"><LineChart className="w-8 h-8 mr-4 text-emerald-400 print:text-emerald-600 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)] print:drop-shadow-none"/> {title}</h5>
      
      <div className="flex items-end justify-around gap-2 md:gap-6 h-64 md:h-80 mt-4 relative z-10 w-full overflow-x-auto pb-8 custom-scrollbar px-2">
        {data.slice(0, 15).map((d, i) => {
          const valNum = Number(d.value) || 0;
          const heightPercent = Math.max((valNum / max) * 100, 4); // min 4% height
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-4 group relative h-full justify-end min-w-[3.5rem] md:min-w-[5rem]">
              
              {/* Tooltip Hover (Balão Inteligente) - Hidden in Print, always show values in print */}
              <div className="absolute -top-16 bg-white border-2 border-slate-100 text-slate-900 text-xs md:text-sm font-black px-5 py-3 rounded-2xl opacity-0 group-hover:opacity-100 print:opacity-100 print:-top-10 print:bg-transparent print:border-none print:shadow-none group-hover:-translate-y-3 transition-all duration-300 z-30 whitespace-nowrap shadow-2xl pointer-events-none flex flex-col items-center">
                <span className="text-emerald-600 text-lg leading-none mb-1 drop-shadow-sm">{valNum}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase truncate max-w-[150px] print:hidden">{d.name}</span>
                <div className="absolute -bottom-1.5 w-4 h-4 bg-white border-b-2 border-r-2 border-slate-100 rotate-45 print:hidden"></div>
              </div>

              {/* Barra 3D com Glassmorphism */}
              <div className="w-full relative flex-1 flex flex-col justify-end group-hover:scale-105 transition-transform duration-500 ease-out cursor-crosshair">
                <div className="w-full bg-gradient-to-t from-emerald-700 via-emerald-400 to-teal-200 rounded-t-xl transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(52,211,153,0.1)] group-hover:shadow-[0_0_40px_rgba(52,211,153,0.6)] group-hover:from-emerald-500 group-hover:via-teal-300 group-hover:to-cyan-200 relative overflow-hidden print:shadow-none print:from-emerald-500 print:to-emerald-500" style={{ height: `${heightPercent}%` }}>
                   {/* Efeito de Reflexo (Luz na barra) */}
                   <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/40 to-transparent opacity-60 print:hidden"></div>
                   <div className="absolute top-0 left-0 w-1/2 h-full bg-white/20 skew-x-[20deg] transform -translate-x-2 print:hidden"></div>
                </div>
              </div>

              {/* Rótulo da Barra */}
              <span className="text-[9px] md:text-xs font-black text-slate-400 print:text-slate-600 uppercase w-full text-center truncate px-1 group-hover:text-emerald-300 transition-colors duration-300" title={d.name}>{d.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const InsightCard = ({ title, text }) => (
  <div className="my-8 relative group animate-in slide-in-from-left-4 print:break-inside-avoid">
    {/* Efeito Glow de Fundo */}
    <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-500 print:hidden"></div>
    <div className="relative bg-white border border-slate-100 print:border-slate-300 p-6 md:p-8 rounded-[2rem] shadow-xl print:shadow-none flex flex-col md:flex-row gap-6 items-start">
       <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-4 rounded-2xl shrink-0 shadow-inner border border-amber-200/50">
          <Lightbulb className="w-8 h-8 text-amber-600 animate-pulse print:animate-none"/>
       </div>
       <div>
          <h5 className="font-black text-slate-800 text-lg md:text-xl uppercase tracking-tighter mb-3 flex items-center">{title}</h5>
          <p className="text-slate-600 font-medium text-sm md:text-base leading-relaxed">{text}</p>
       </div>
    </div>
  </div>
);

export default function App() {
  const [supabase, setSupabase] = useState(null);
  const [dbOnline, setDbOnline] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [emailLogin, setEmailLogin] = useState('');
  const [senhaLogin, setSenhaLogin] = useState('');
  const [erroLogin, setErroLogin] = useState('');

  // Controle de Menu Mobile
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);

  const [produtosDb, setProdutosDb] = useState({});
  const [estoqueDb, setEstoqueDb] = useState({});
  const [remessasDb, setRemessasDb] = useState([]);
  const [usuariosDb, setUsuariosDb] = useState([]); 
  const [relatoriosIaDb, setRelatoriosIaDb] = useState([]); 
  
  const [abaAtiva, setAbaAtiva] = useState('NOVA_OP');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  // Estados Formulário PCP
  const [codigoBusca, setCodigoBusca] = useState('');
  const [quantidadeProduzir, setQuantidadeProduzir] = useState(1);
  const [projeto, setProjeto] = useState('');
  const [cliente, setCliente] = useState(''); 
  const [observacao, setObservacao] = useState('Industrialização'); 
  const [outrosTexto, setOutrosTexto] = useState(''); 
  const [obsExpedicao, setObsExpedicao] = useState(''); 
  const [produtoEncontrado, setProdutoEncontrado] = useState(null);
  const [itensRemessa, setItensRemessa] = useState([]);
  const [itensOriginaisBOM, setItensOriginaisBOM] = useState([]); 

  const [isModoManual, setIsModoManual] = useState(false);
  const [manualCodMP, setManualCodMP] = useState('');
  const [manualDescMP, setManualDescMP] = useState('');
  const [manualQtdMP, setManualQtdMP] = useState('');
  const [manualUmMP, setManualUmMP] = useState('UN');
  const [isComplemento, setIsComplemento] = useState(false);
  const [remessaPaiId, setRemessaPaiId] = useState('');
  
  // Estados Gestão de Acessos
  const [novoUsuario, setNovoUsuario] = useState({ nome: '', email: '', senha: '', perfil: 'PCP' });
  const [isEditingUser, setIsEditingUser] = useState(false);

  // Estados Rateio
  const [modalRateioAberto, setModalRateioAberto] = useState(false);
  const [idxItemRateio, setIdxItemRateio] = useState(null);
  const [novoRateio, setNovoRateio] = useState({ projeto: '', codigoPA: '', quantidade: '' });
  const ITENS_RATEIO = ['4941', '4942', '552', '187'];

  // Estados Expedição
  const [remessaSelecionada, setRemessaSelecionada] = useState(null);
  const [formExpedicao, setFormExpedicao] = useState({
    transporte: '', transportadora: '', quantidade: '', pesoTotal: '', destinatario: '', dataSaida: new Date().toISOString().split('T')[0]
  });
  const [templateBuffer, setTemplateBuffer] = useState(null);
  const [nomeTemplate, setNomeTemplate] = useState('');

  // Estados Logística e Filtros
  const [buscaFornecedor, setBuscaFornecedor] = useState('');
  const [remessaParaRetorno, setRemessaParaRetorno] = useState(null);
  const [qtdPecasRetornando, setQtdPecasRetornando] = useState('');
  
  const [filtrosControle, setFiltrosControle] = useState({ projeto: '', pa: '', mp: '', status: '' });
  const [sortControle, setSortControle] = useState({ key: 'data_envio', dir: 'desc' });

  const [filtrosHistorico, setFiltrosHistorico] = useState({ projeto: '', pa: '', cliente: '', status: '' });
  const [sortHistorico, setSortHistorico] = useState({ key: 'data_criacao', dir: 'desc' });

  const [filtrosAuditoria, setFiltrosAuditoria] = useState({ projeto: '', pa: '', mp: '', status: '' });
  const [sortAuditoria, setSortAuditoria] = useState({ key: 'data', dir: 'desc' });

  // Estados IA Analista MAX TIER
  const [openAIApiKey, setOpenAIApiKey] = useState('');
  const msgInicialIA = {role: 'assistant', content: 'Olá! Sou a sua **Cientista de Dados Avançada (Motor Class-5)** do SGQ.\n\nCom a remoção das limitações de token, agora possuo visão integral de todo o seu banco de dados. Posso gerar **Gráficos Executivos 3D** e **Insights Gerenciais** para suas reuniões de diretoria.\n\nExperimente pedir uma análise e, quando estiver satisfeito com o raciocínio construído, clique no botão **Salvar Relatório** no topo para guardar essa investigação no nosso acervo corporativo.'};
  const [chatMessages, setChatMessages] = useState([msgInicialIA]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatScrollRef = useRef(null);

  // Estados do Acervo de Relatórios
  const [viewIA, setViewIA] = useState('CHAT'); // CHAT, LISTA, APRESENTACAO
  const [relatorioVisualizacao, setRelatorioVisualizacao] = useState(null);
  const [modalSalvarRelatorio, setModalSalvarRelatorio] = useState(false);
  const [nomeNovoRelatorio, setNomeNovoRelatorio] = useState('');

  const [projetoDetalheSelecionado, setProjetoDetalheSelecionado] = useState(null);
  const [buscaDetalheProjeto, setBuscaDetalheProjeto] = useState('');

  const [modalAtrasadasAberto, setModalAtrasadasAberto] = useState(false);

  // Novos Estados: Chat Interno (Com DM e Notificação) e Mini-IA
  const [mensagensEquipe, setMensagensEquipe] = useState([]);
  const [isChatEquipeAberto, setIsChatEquipeAberto] = useState(false);
  const [msgEquipeInput, setMsgEquipeInput] = useState('');
  const [chatDestinatario, setChatDestinatario] = useState('Geral');
  const [hasNovaMsgEquipe, setHasNovaMsgEquipe] = useState(false);
  const chatEquipeRef = useRef(null);

  const [isMiniIaAberto, setIsMiniIaAberto] = useState(false);
  const [miniIaInput, setMiniIaInput] = useState('');
  const [miniIaMessages, setMiniIaMessages] = useState([]);
  const [isMiniIaLoading, setIsMiniIaLoading] = useState(false);
  const miniIaRef = useRef(null);

  // NÍVEIS DE ACESSO
  const isAdmin = usuarioLogado?.perfil === 'ADMIN';
  const isPCP = usuarioLogado?.perfil === 'PCP' || isAdmin;
  const isExp = usuarioLogado?.perfil === 'EXPEDICAO' || isAdmin;

  useEffect(() => {
    const scripts = [
      { id: 'xlsx-lib', src: 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js' },
      { id: 'exceljs-lib', src: 'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js' },
      { id: 'supabase-lib', src: 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2' }
    ];
    scripts.forEach(scriptObj => {
      if (!document.getElementById(scriptObj.id)) {
        const script = document.createElement('script');
        script.id = scriptObj.id; script.src = scriptObj.src; script.async = true;
        document.body.appendChild(script);
      }
    });
    const checkInterval = setInterval(() => {
      if (window.supabase) {
        try {
          const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
          setSupabase(client);
          clearInterval(checkInterval);
        } catch (e) {}
      }
    }, 500);
    return () => clearInterval(checkInterval);
  }, []);

  const fetchAllData = async () => {
    if (!supabase) return;
    try {
      // Usando then/catch para a tabela nova não quebrar o sistema se o usuário ainda não rodou o SQL
      const reqRelatorios = supabase.from('relatorios_ia').select('*').order('data_criacao', { ascending: false }).then(r=>r).catch(()=>({data:[]}));

      const [prodRes, estRes, remRes, userRes, configRes, configGptRes, relIaRes] = await Promise.all([
        supabase.from('produtos').select('*'),
        supabase.from('estoque_mp').select('*'),
        supabase.from('remessas').select('*').order('data_criacao', { ascending: false }),
        supabase.from('perfis_usuarios').select('*'),
        supabase.from('configuracoes').select('*').eq('chave', 'modelo_sgq').maybeSingle(),
        supabase.from('configuracoes').select('*').eq('chave', 'openai_api_key').maybeSingle(),
        reqRelatorios
      ]);
      
      if (prodRes.data) {
        const pMap = {}; prodRes.data.forEach(p => { if(p.codigo_pa) pMap[p.codigo_pa] = p; });
        setProdutosDb(pMap);
      }
      if (estRes.data) {
        const eMap = {}; estRes.data.forEach(e => { if(e.codigo_mp) eMap[e.codigo_mp] = e; });
        setEstoqueDb(eMap);
      }
      if (remRes.data) setRemessasDb(remRes.data);
      if (userRes.data) setUsuariosDb(userRes.data);
      if (configRes.data && configRes.data.valor_json) {
        const b64 = configRes.data.valor_json.data;
        setNomeTemplate(configRes.data.valor_json.nome);
        const binaryString = window.atob(b64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
        setTemplateBuffer(bytes.buffer);
      }
      if (configGptRes.data && configGptRes.data.valor_json) {
         setOpenAIApiKey(configGptRes.data.valor_json.key);
      }
      if (relIaRes && !relIaRes.error && relIaRes.data) {
         setRelatoriosIaDb(relIaRes.data);
      }
      setDbOnline(true);
    } catch (e) { setDbOnline(false); }
  };

  useEffect(() => { if (supabase) fetchAllData(); }, [supabase]);

  // EFEITO DE POLLING DO CHAT (Atualiza e checa mensagens privadas)
  useEffect(() => {
     if (!supabase || !usuarioLogado) return;
     const userName = usuarioLogado.nome;
     
     const carregarChat = async () => {
        try {
           const { data } = await supabase.from('chat_interno')
              .select('*')
              .or(`destinatario.eq.Geral,destinatario.is.null,destinatario.eq."${userName}",remetente.eq."${userName}"`)
              .order('data_envio', { ascending: true })
              .limit(200);
           
           if (data) {
              setMensagensEquipe(prev => {
                 // Notifica se houver mensagem nova E ela não foi enviada por mim E o chat está fechado
                 const temMensagemNova = data.length > prev.length;
                 const ultimaMsg = data[data.length - 1];
                 
                 if (temMensagemNova && ultimaMsg && ultimaMsg.remetente !== userName && !isChatEquipeAberto) {
                    setHasNovaMsgEquipe(true);
                 }
                 return data;
              });
           }
        } catch(e) {}
     };

     carregarChat();
     const interval = setInterval(carregarChat, 5000); // Polling a cada 5 segundos
     return () => clearInterval(interval);
  }, [supabase, usuarioLogado, isChatEquipeAberto]);

  // Scroll Automático do Chat
  useEffect(() => {
     if(chatScrollRef.current && viewIA === 'CHAT') {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
     }
  }, [chatMessages, viewIA]);

  useEffect(() => {
     if(chatEquipeRef.current) chatEquipeRef.current.scrollTop = chatEquipeRef.current.scrollHeight;
  }, [mensagensEquipe, isChatEquipeAberto, chatDestinatario]);

  useEffect(() => {
     if(miniIaRef.current) miniIaRef.current.scrollTop = miniIaRef.current.scrollHeight;
  }, [miniIaMessages, isMiniIaAberto]);

  const handleSort = (state, setState, key) => {
    setState(prev => ({
      key,
      dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc'
    }));
  };

  const renderSortIcon = (tableSort, key) => {
    if(tableSort.key !== key) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-20 inline" />;
    return tableSort.dir === 'asc' ? <ArrowUp className="w-3 h-3 ml-1 text-indigo-600 inline" /> : <ArrowDown className="w-3 h-3 ml-1 text-indigo-600 inline" />;
  };

  const parseNumBR = (v) => {
    if (typeof v === 'number') return v;
    if (!v) return 0;
    let str = s(v?.result || v).trim();
    if (str.includes('.') && str.includes(',')) {
      if (str.indexOf('.') < str.indexOf(',')) str = str.replace(/\./g, '').replace(',', '.');
      else str = str.replace(/,/g, '');
    } else {
      str = str.replace(',', '.');
    }
    return parseFloat(str) || 0;
  };

  const normalizeKey = (k) => s(k).toUpperCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "_").replace(/[.-]/g, "");

  const enviarMsgEquipe = async (e) => {
     e.preventDefault();
     if(!msgEquipeInput.trim()) return;
     const payload = { 
        remetente: usuarioLogado?.nome || 'Usuário', 
        mensagem: msgEquipeInput,
        destinatario: chatDestinatario // Envia para Geral ou Privado
     };
     setMsgEquipeInput('');
     try {
        const { data } = await supabase.from('chat_interno').insert([payload]).select();
        if(data) setMensagensEquipe(prev => [...prev, data[0]]);
     } catch (err) {}
  };

  // Filtragem local de mensagens do Chat Interno baseada no Destinatário Selecionado
  const mensagensVisiveis = mensagensEquipe.filter(m => {
     if (chatDestinatario === 'Geral') {
         return !m.destinatario || m.destinatario === 'Geral';
     } else {
         return (m.remetente === usuarioLogado?.nome && m.destinatario === chatDestinatario) ||
                (m.remetente === chatDestinatario && m.destinatario === usuarioLogado?.nome);
     }
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setErroLogin('');
    if (!supabase) return setErroLogin('Conectando ao servidor...');
    setIsLoading(true);
    try {
      const { data } = await supabase.from('perfis_usuarios').select('*').eq('email', emailLogin.toLowerCase().trim()).eq('senha', senhaLogin).single();
      if (data) {
        setUsuarioLogado(data);
        setAbaAtiva(data.perfil === 'EXPEDICAO' ? 'EXPEDICAO' : 'NOVA_OP');
      } else { setErroLogin('Dados inválidos.'); }
    } catch (err) { setErroLogin('Falha de acesso.'); } 
    finally { setIsLoading(false); }
  };

  const salvarUsuario = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.from('perfis_usuarios').upsert([novoUsuario], { onConflict: 'email' });
      if (error) throw error;
      setSucesso("Acesso gravado!"); setNovoUsuario({ nome: '', email: '', senha: '', perfil: 'PCP' }); setIsEditingUser(false); fetchAllData();
    } catch (err) { setErro("Erro: " + err.message); }
    finally { setIsLoading(false); }
  };

  const excluirUsuario = async (email) => {
    if (email === usuarioLogado?.email) return setErro("Não pode remover o seu próprio acesso.");
    if (window.confirm("Remover permanentemente?")) {
      await supabase.from('perfis_usuarios').delete().eq('email', email);
      setSucesso("Removido."); fetchAllData();
    }
  };

  const buscarProduto = (e) => {
    if (e) e.preventDefault();
    setErro('');
    const cod = codigoBusca.toUpperCase().trim();
    const produto = produtosDb[cod];
    
    if (produto) {
      setIsModoManual(false);
      setProdutoEncontrado(produto);
      const list = (produto.materiais || []).map(m => {
        const est = estoqueDb[m.codigoMP] || { saldo_disponivel: 0, descricao: 'Não catalogado' };
        const qtdBase = Number((m.quantidade * parseNumBR(quantidadeProduzir)).toFixed(4));
        return { ...m, saldoDisponivel: est.saldo_disponivel, descricao: est.descricao, quantidadeTotal: qtdBase, quantidadeOriginal: qtdBase, quantidadeRetornada: 0, rateiosExtras: [] };
      });
      setItensRemessa(list); setItensOriginaisBOM(list);
    } else {
      // PRODUTO NÃO ENCONTRADO -> ATIVA MODO MANUAL
      setIsModoManual(true);
      setProdutoEncontrado({ codigo_pa: cod, descricao: 'PRODUTO NÃO CADASTRADO (INSERÇÃO MANUAL)' });
      setItensRemessa([]); setItensOriginaisBOM([]);
      setErro('Produto não cadastrado na base. MODO MANUAL ATIVADO.');
    }
  };

  const adicionarItemManual = () => {
     if(!manualCodMP || !manualQtdMP) return;
     const est = estoqueDb[manualCodMP.toUpperCase()] || { saldo_disponivel: 0, descricao: 'Não catalogado no estoque' };
     const qtdNum = parseNumBR(manualQtdMP);
     const novo = {
        codigoMP: manualCodMP.toUpperCase(),
        descricao: manualDescMP || est.descricao,
        quantidadeTotal: qtdNum,
        quantidadeOriginal: qtdNum,
        um: manualUmMP,
        saldoDisponivel: est.saldo_disponivel,
        quantidadeRetornada: 0,
        rateiosExtras: []
     };
     setItensRemessa([...itensRemessa, novo]);
     setManualCodMP(''); setManualDescMP(''); setManualQtdMP('');
  };

  const enviarParaExpedicao = async () => {
    if(!projeto || !cliente) return setErro("Projeto e Cliente são obrigatórios.");
    if(isComplemento && !remessaPaiId) return setErro("Selecione a OP Original do complemento.");
    
    // Validação rígida de estoque do sistema
    const itemSemEstoque = itensRemessa.find(it => it.quantidadeTotal > (it.saldoDisponivel || 0));
    if (itemSemEstoque) {
      return setErro(`Estoque bloqueado! A MP ${itemSemEstoque.codigoMP} possui saldo de apenas ${itemSemEstoque.saldoDisponivel || 0} no sistema, mas foi solicitado ${itemSemEstoque.quantidadeTotal}.`);
    }

    const servFinal = observacao === 'Outros' ? (outrosTexto || 'Outros') : observacao;
    const removidos = isModoManual ? [] : itensOriginaisBOM
      .filter(orig => !itensRemessa.find(it => it.codigoMP === orig.codigoMP))
      .map(r => ({ codigoMP: s(r.codigoMP), descricao: s(r.descricao), quantidade: Number(r.quantidadeTotal), um: s(r.um) }));

    setIsLoading(true);
    try {
      for (const it of itensRemessa) {
        const { data: cur } = await supabase.from('estoque_mp').select('saldo_disponivel').eq('codigo_mp', it.codigoMP).maybeSingle();
        if(cur) {
            await supabase.from('estoque_mp').update({ saldo_disponivel: Number(((cur.saldo_disponivel || 0) - it.quantidadeTotal).toFixed(4)) }).eq('codigo_mp', it.codigoMP);
        }
      }
      
      const { error: errIns } = await supabase.from('remessas').insert([{
        id: `REM-${Date.now()}`, 
        produto_acabado: s(produtoEncontrado.codigo_pa), 
        descricao_produto: s(produtoEncontrado.descricao),
        quantidade_op: parseNumBR(quantidadeProduzir), 
        projeto: s(projeto).toUpperCase(), 
        cliente: s(cliente).toUpperCase(),
        observacao: s(isComplemento ? `COMPLEMENTO - ${servFinal}` : servFinal), 
        obs_expedicao: s(obsExpedicao), 
        itens: itensRemessa, 
        itens_removidos: removidos,
        remessa_pai_id: isComplemento ? remessaPaiId : null, 
        status: 'PENDENTE_EXPEDICAO', 
        criado_por: s(usuarioLogado?.nome || 'PCP'), 
        pecas_recebidas: 0
      }]);
      if (errIns) throw errIns;
      setSucesso('Enviado para a Expedição!'); setIsLoading(false); setProdutoEncontrado(null); setIsModoManual(false); setOutrosTexto(''); setObsExpedicao(''); setCliente(''); setIsComplemento(false); setRemessaPaiId(''); setAbaAtiva('HISTORICO_PCP'); fetchAllData();
    } catch (e) { setErro("Erro no envio: " + e.message); setIsLoading(false); }
  };

  const concluirExpedicao = async () => {
    if (!templateBuffer) return setErro("Modelo SGQ ausente.");
    if (!formExpedicao.transporte || !formExpedicao.destinatario) return setErro("Preencha Transporte e Destinatário.");
    setIsLoading(true);
    try {
      const { error: errExp } = await supabase.from('remessas').update({ status: 'ENVIADO', data_envio: new Date().toISOString(), enviado_por: s(usuarioLogado?.nome || 'Logística'), expedicao: formExpedicao }).eq('id', remessaSelecionada.id);
      if (errExp) throw errExp;
      const wb = new window.ExcelJS.Workbook(); await wb.xlsx.load(templateBuffer);
      const ws = wb.worksheets[0];
      ws.getCell('B4').value = s(remessaSelecionada.projeto); ws.getCell('C4').value = s(remessaSelecionada.cliente);
      ws.getCell('B6').value = s(formExpedicao.transporte); ws.getCell('C6').value = s(formExpedicao.transportadora);
      ws.getCell('B8').value = Number(formExpedicao.quantidade); ws.getCell('C8').value = s(formExpedicao.pesoTotal);
      ws.getCell('E8').value = `${s(remessaSelecionada.projeto)} - ${s(formExpedicao.destinatario)}`; ws.getCell('G8').value = s(formExpedicao.dataSaida);
      (remessaSelecionada.itens || []).forEach((it, i) => { 
          const r = 12+i; ws.getCell(`C${r}`).value = s(it.codigoMP); ws.getCell(`E${r}`).value = s(it.descricao); ws.getCell(`F${r}`).value = Number(it.quantidadeTotal); ws.getCell(`G${r}`).value = s(it.um); ws.getCell(`H${r}`).value = s(remessaSelecionada.observacao); 
      });
      const buf = await wb.xlsx.writeBuffer();
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([buf])); a.download = `SGQ_${s(remessaSelecionada.projeto)}.xlsx`; a.click();
      setSucesso('Finalizado com Sucesso!'); setRemessaSelecionada(null); setIsLoading(false); fetchAllData();
    } catch (e) { setErro("Falha Excel."); setIsLoading(false); }
  };

  const processarRetornoParcial = async () => {
    const pecasDevolvidas = parseNumBR(qtdPecasRetornando); 
    const rem = remessaParaRetorno;
    if(!rem) return;

    const pecasJaRecebidas = Number(rem.pecas_recebidas || 0);
    const saldoPendente = Number(rem.quantidade_op) - pecasJaRecebidas;

    if (pecasDevolvidas <= 0 || pecasDevolvidas > saldoPendente) return setErro("Quantidade Inválida.");
    setIsLoading(true);
    try {
      const proporcao = pecasDevolvidas / Number(rem.quantidade_op);
      const novosItens = [...(rem.itens || [])];
      for (let i = 0; i < novosItens.length; i++) {
          const qtdMP = Number((novosItens[i].quantidadeTotal * proporcao).toFixed(4));
          novosItens[i].quantidadeRetornada = Number(((novosItens[i].quantidadeRetornada || 0) + qtdMP).toFixed(4));
          const { data: cur } = await supabase.from('estoque_mp').select('saldo_disponivel').eq('codigo_mp', novosItens[i].codigoMP).maybeSingle();
          if(cur) {
             await supabase.from('estoque_mp').update({ saldo_disponivel: Number(((cur.saldo_disponivel || 0) + qtdMP).toFixed(4)) }).eq('codigo_mp', novosItens[i].codigoMP);
          }
      }
      const novoTotalJa = pecasJaRecebidas + pecasDevolvidas;
      const novoStatus = novoTotalJa >= Number(rem.quantidade_op) ? 'RETORNADO' : 'RETORNO_PARCIAL';
      const { error } = await supabase.from('remessas').update({ itens: novosItens, status: novoStatus, pecas_recebidas: novoTotalJa, data_retorno: new Date().toISOString(), recebido_por: s(usuarioLogado?.nome || 'Sistema') }).eq('id', rem.id);
      if (error) throw error;
      setSucesso('Estoque creditado com as entradas!'); setRemessaParaRetorno(null); setQtdPecasRetornando(''); fetchAllData();
    } catch (e) { setErro("Erro no retorno."); } finally { setIsLoading(false); }
  };

  const remessasPendentes = useMemo(() => remessasDb.filter(r => s(r.status) === 'PENDENTE_EXPEDICAO'), [remessasDb]);
  const remessasFora = useMemo(() => remessasDb.filter(r => ['ENVIADO', 'RETORNO_PARCIAL', 'RETORNADO'].includes(s(r.status))), [remessasDb]);

  const remessasAtrasadas20Dias = useMemo(() => {
     return remessasFora.filter(r => {
        if (['ENVIADO', 'RETORNO_PARCIAL'].includes(r.status) && r.data_envio) {
           const diffTime = Math.abs(new Date() - new Date(r.data_envio));
           const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
           return diffDays > 20;
        }
        return false;
     });
  }, [remessasFora]);

  // AGRUPAMENTO DE PROJETOS E COMPLEMENTOS (PAI/FILHO) PARA O NOVO DASHBOARD
  const dashboardProjetosAgrupados = useMemo(() => {
     const map = {};
     remessasDb.forEach(r => {
        if (!r.remessa_pai_id) {
           map[r.id] = { ...r, filhos: [], metaPA: Number(r.quantidade_op || 0), totalEnviado: Number(r.quantidade_op || 0), mpsConsumidas: [] };
           if (Array.isArray(r.itens)) {
              r.itens.forEach(it => {
                 map[r.id].mpsConsumidas.push({ codigoMP: s(it.codigoMP), descricao: it.descricao, um: it.um, qtdAcumulada: Number(it.quantidadeTotal || 0) });
              });
           }
        }
     });

     remessasDb.forEach(r => {
        if (r.remessa_pai_id && map[r.remessa_pai_id]) {
           const pai = map[r.remessa_pai_id];
           pai.filhos.push(r);
           pai.totalEnviado += Number(r.quantidade_op || 0);
           if (Array.isArray(r.itens)) {
              r.itens.forEach(it => {
                 const mp = s(it.codigoMP);
                 const ex = pai.mpsConsumidas.find(x => x.codigoMP === mp);
                 if (ex) ex.qtdAcumulada += Number(it.quantidadeTotal || 0);
                 else pai.mpsConsumidas.push({ codigoMP: mp, descricao: it.descricao, um: it.um, qtdAcumulada: Number(it.quantidadeTotal || 0) });
              });
           }
        }
     });
     return Object.values(map).sort((a,b) => new Date(b.data_criacao) - new Date(a.data_criacao));
  }, [remessasDb]);

  const dashboardData = useMemo(() => {
    const topMpsMap = {};
    const topPasMap = {};
    const saidasPorDiaMap = {};
    let kpiTotalOps = remessasDb.length;
    let kpiEmTransito = 0;
    let kpiConcluidas = 0;
    let kpiVolumePecas = 0;

    remessasDb.forEach(r => {
       if(r.status === 'RETORNADO') kpiConcluidas++;
       if(['ENVIADO', 'RETORNO_PARCIAL'].includes(r.status)) kpiEmTransito++;
       kpiVolumePecas += Number(r.quantidade_op || 0);

       const pa = s(r.produto_acabado);
       const descPa = s(r.descricao_produto || 'Produto Final');
       if(pa) topPasMap[pa] = { name: `${pa} - ${descPa}`, value: (topPasMap[pa]?.value || 0) + Number(r.quantidade_op || 0) };

       if(Array.isArray(r.itens)) {
          r.itens.forEach(it => {
             const mp = s(it.codigoMP);
             const descMp = s(it.descricao);
             if(mp) topMpsMap[mp] = { name: `${mp} - ${descMp}`, value: (topMpsMap[mp]?.value || 0) + Number(it.quantidadeTotal || 0) };
          });
       }

       if(r.data_criacao) {
          const dateStr = new Date(r.data_criacao).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'});
          saidasPorDiaMap[dateStr] = (saidasPorDiaMap[dateStr] || 0) + Number(r.quantidade_op || 0);
       }
    });

    const topMps = Object.values(topMpsMap).sort((a,b) => b.value - a.value).slice(0, 5);
    const maxMp = Math.max(...topMps.map(x => x.value), 1);

    const topPas = Object.values(topPasMap).sort((a,b) => b.value - a.value).slice(0, 5);
    const maxPa = Math.max(...topPas.map(x => x.value), 1);
    
    const saidasData = Object.entries(saidasPorDiaMap)
      .map(([date, value]) => {
          const [d,m] = date.split('/');
          return { date, value, _sort: parseInt(`${m}${d}`) };
      })
      .sort((a,b) => a._sort - b._sort)
      .slice(-10);
    const maxSaida = Math.max(...saidasData.map(x => x.value), 1);

    return { kpiTotalOps, kpiEmTransito, kpiConcluidas, kpiVolumePecas, topMps, maxMp, topPas, maxPa, saidasData, maxSaida };
  }, [remessasDb]);

  const pendenciasAuditoria = useMemo(() => {
    const allRemovidos = remessasDb.flatMap(r => (Array.isArray(r.itens_removidos) ? r.itens_removidos : []).map(rem => ({ ...rem, projeto: r.projeto, pa: r.produto_acabado, data: r.data_criacao, quantidade_op: r.quantidade_op, cliente: r.cliente })));
    const allEnviados = remessasDb.flatMap(r => (Array.isArray(r.itens) ? r.itens : []).map(it => ({ codigoMP: it.codigoMP, projeto: r.projeto })));
    return allRemovidos.map(p => ({ ...p, resolvido: allEnviados.some(e => e.codigoMP === p.codigoMP && e.projeto === p.projeto) }));
  }, [remessasDb]);

  const auditoriaFiltrada = useMemo(() => {
    let list = [...pendenciasAuditoria];
    if(filtrosAuditoria.projeto) list = list.filter(p => s(p.projeto).toUpperCase().includes(filtrosAuditoria.projeto.toUpperCase()));
    if(filtrosAuditoria.pa) list = list.filter(p => s(p.pa).toUpperCase().includes(filtrosAuditoria.pa.toUpperCase()));
    if(filtrosAuditoria.mp) list = list.filter(p => s(p.codigoMP).toUpperCase().includes(filtrosAuditoria.mp.toUpperCase()));
    if(filtrosAuditoria.status === 'RESOLVIDO') list = list.filter(p => p.resolvido);
    if(filtrosAuditoria.status === 'PENDENTE') list = list.filter(p => !p.resolvido);
    const k = sortAuditoria.key; const d = sortAuditoria.dir === 'asc' ? 1 : -1;
    return list.sort((a,b) => (s(a[k]) > s(b[k]) ? 1 : -1) * d);
  }, [pendenciasAuditoria, filtrosAuditoria, sortAuditoria]);

  const historicoFiltrado = useMemo(() => {
    let list = [...remessasDb];
    if(filtrosHistorico.projeto) list = list.filter(r => s(r.projeto).toUpperCase().includes(filtrosHistorico.projeto.toUpperCase()));
    if(filtrosHistorico.cliente) list = list.filter(r => s(r.cliente).toUpperCase().includes(filtrosHistorico.cliente.toUpperCase()));
    if(filtrosHistorico.pa) list = list.filter(r => s(r.produto_acabado).toUpperCase().includes(filtrosHistorico.pa.toUpperCase()));
    if(filtrosHistorico.status) list = list.filter(r => s(r.status) === filtrosHistorico.status);
    const k = sortHistorico.key; const d = sortHistorico.dir === 'asc' ? 1 : -1;
    return list.sort((a,b) => (s(a[k]) > s(b[k]) ? 1 : -1) * d);
  }, [remessasDb, filtrosHistorico, sortHistorico]);

  const controleFiltrado = useMemo(() => {
    const listFora = remessasDb.filter(r => ['ENVIADO', 'RETORNO_PARCIAL', 'RETORNADO'].includes(s(r.status)));
    let result = listFora.flatMap(r => (Array.isArray(r.itens) ? r.itens : []).map(it => ({ ...it, remessa: r, isRateio: false })));
    if(filtrosControle.projeto) result = result.filter(x => s(x.remessa?.projeto).toUpperCase().includes(filtrosControle.projeto.toUpperCase()));
    if(filtrosControle.pa) result = result.filter(x => s(x.remessa?.produto_acabado).toUpperCase().includes(filtrosControle.pa.toUpperCase()));
    if(filtrosControle.mp) result = result.filter(x => s(x.codigoMP).toUpperCase().includes(filtrosControle.mp.toUpperCase()));
    if(filtrosControle.status) result = result.filter(x => s(x.remessa?.status) === filtrosControle.status);
    const k = sortControle.key; const d = sortControle.dir === 'asc' ? 1 : -1;
    return result.sort((a,b) => {
       const valA = k === 'data_envio' ? s(a.remessa?.data_envio) : s(a[k] || a.remessa?.[k]);
       const valB = k === 'data_envio' ? s(b.remessa?.data_envio) : s(b[k] || b.remessa?.[k]);
       return (valA > valB ? 1 : -1) * d;
    });
  }, [remessasDb, filtrosControle, sortControle]);

  const optionsH = useMemo(() => ({
    projeto: [...new Set(remessasDb.map(r => s(r.projeto)))].filter(x=>x).sort(),
    cliente: [...new Set(remessasDb.map(r => s(r.cliente)))].filter(x=>x).sort(),
    pa: [...new Set(remessasDb.map(r => s(r.produto_acabado)))].filter(x=>x).sort()
  }), [remessasDb]);

  const optionsC = useMemo(() => ({
    projeto: [...new Set(remessasDb.map(r => s(r.projeto)))].filter(x=>x).sort(),
    pa: [...new Set(remessasDb.map(r => s(r.produto_acabado)))].filter(x=>x).sort(),
    mp: [...new Set(remessasDb.flatMap(r => (Array.isArray(r.itens) ? r.itens : []).map(it => s(it.codigoMP))))].filter(x=>x).sort()
  }), [remessasDb]);

  const exportAuditoria = () => {
    if(!window.XLSX) return setErro("Biblioteca de exportação a carregar, tente novamente.");
    const data = auditoriaFiltrada.map(p => ({ 
      "Data": p.data ? s(new Date(p.data).toLocaleDateString()) : '---', 
      "Projeto (BR)": s(p.projeto), 
      "Cliente/Local": s(p.cliente),
      "PA Alvo": s(p.pa), 
      "Qtd Produzir (PA)": Number(p.quantidade_op || 0),
      "MP Ausente": s(p.codigoMP), 
      "Descricao MP": s(p.descricao), 
      "Qtd Falta (MP)": Number(p.quantidade || 0), 
      "Status": p.resolvido ? 'Regularizado' : 'Pendente' 
    }));
    const ws = window.XLSX.utils.json_to_sheet(data);
    const wb = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(wb, ws, "Auditoria");
    window.XLSX.writeFile(wb, `Auditoria_Kalenborn_${Date.now()}.xlsx`);
  };

  const parseBotMessage = (content) => {
     if (!content) return [];
     const parts = [];
     let lastIndex = 0;
     const regex = /<(CHART|INSIGHT)>([\s\S]*?)<\/\1>/g;
     let match;
     
     while ((match = regex.exec(content)) !== null) {
        if (match.index > lastIndex) {
           parts.push({ type: 'text', content: content.substring(lastIndex, match.index) });
        }
        try {
           let jsonStr = match[2].trim();
           jsonStr = jsonStr.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
           const payload = JSON.parse(jsonStr);
           parts.push({ type: match[1], payload });
        } catch(e) {
           parts.push({ type: 'error', content: `[A IA gerou um módulo visual com falha estrutural. Tentando recuperar... Erro interno: ${e.message}]` });
        }
        lastIndex = regex.lastIndex;
     }
     if (lastIndex < content.length) {
        parts.push({ type: 'text', content: content.substring(lastIndex) });
     }
     return parts;
  };

  const enviarMensagemGPT = async (e) => {
     e.preventDefault();
     if(!chatInput.trim() || !openAIApiKey) return;
     const novaMsg = { role: 'user', content: chatInput };
     setChatMessages(prev => [...prev, novaMsg]);
     setChatInput('');
     setIsChatLoading(true);

     try {
        const resumoRemessas = remessasDb.map(r => ({
           data: r.data_criacao ? new Date(r.data_criacao).toLocaleDateString('pt-BR') : '', 
           projeto: s(r.projeto), 
           cliente: s(r.cliente), 
           pa: s(r.produto_acabado), 
           qtd_pa: Number(r.quantidade_op), 
           status: s(r.status),
           obs: s(r.observacao),
           mps: Array.isArray(r.itens) ? r.itens.map(i => `${i.codigoMP}(${i.quantidadeTotal})`).join(', ') : ''
        }));

        const resumoEstoque = Object.values(estoqueDb).map(e => ({
           mp: e.codigo_mp, desc: s(e.descricao).substring(0, 20), saldo: e.saldo_disponivel 
        }));

        const dadosSistema = JSON.stringify({ remessas: resumoRemessas, estoque: resumoEstoque });

        const contextoGlobal = `Você é o Cientista de Dados Sênior e Analista Executivo do Kalenborn SGQ.
Você está construindo um Relatório Gerencial junto com a Supervisora.
Você tem acesso COMPLETO aos dados reais de estoque e remessas abaixo (em JSON).
Cruze os dados, responda perguntas de negócio detalhadas, identifique tendências e falhas ativamente.

=== REGRA DE NEGÓCIO CRÍTICA SOBRE ESTOQUES ===
Atenção: Os usuários frequentemente questionam sobre a falta de saldo das Matérias-Primas (MPs). É vital que você saiba que se o material estiver com saldo zerado, ELE PODE ESTAR COM TERCEIROS. 
Remessas com o status "ENVIADO" ou "RETORNO_PARCIAL" significam que as peças saíram fisicamente da nossa empresa para industrialização e SÓ RETORNARÃO ao saldo do estoque interno quando a logística der baixa (status RETORNADO). 
O saldo que você vê no sistema (estoque_mp) dita APENAS se podemos criar *novas remessas*. Sempre avalie se o estoque está com terceiros (na rua) antes de afirmar que o material sumiu ou acabou completamente da empresa.

=== REGRAS DE FORMATAÇÃO VISUAL PREMIUM ===
SEMPRE QUE O USUÁRIO PEDIR GRÁFICOS OU QUANDO IDENTIFICAR PADRÕES IMPORTANTES, GERE GRÁFICOS E BALÕES DE INSIGHT PARA A TELA DA DIRETORIA.
Obrigatoriamente use as tags XML <CHART> ou <INSIGHT> e coloque APENAS um JSON estritamente válido dentro delas. SEM MARCADORES MARKDOWN.

EXEMPLO DE GRÁFICO (Até 10 itens no data):
<CHART>
{"title": "Título do Gráfico", "data": [{"name": "Aço Inox", "value": 150}, {"name": "Borracha", "value": 90}]}
</CHART>

EXEMPLO DE INSIGHT (Destaque para Reunião):
<INSIGHT>
{"title": "Alerta de Estoque Encontrado", "text": "Identifiquei que o material X não cobrirá as próximas remessas baseadas no fluxo atual de saídas."}
</INSIGHT>

Analise tudo detalhadamente e sempre entregue relatórios densos, úteis e ricos em formatação quando solicitado.
DADOS DE HOJE DO SISTEMA:
${dadosSistema}`;
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openAIApiKey}` },
           body: JSON.stringify({ 
              model: 'gpt-4o',
              messages: [{ role: 'system', content: contextoGlobal }, ...chatMessages.map(m => ({role: m.role, content: m.content})), novaMsg],
              max_tokens: 8000, 
              temperature: 0.1
           })
        });

        if(!response.ok) throw new Error("Falha na API da OpenAI");
        const data = await response.json();
        
        if(data.choices && data.choices[0]) {
           setChatMessages(prev => [...prev, data.choices[0].message]);
        }
     } catch (err) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: '❌ Falha de processamento no motor de Inteligência Artificial. Verifique a conectividade da chave de acesso do provedor OpenAI.' }]);
     } finally {
        setIsChatLoading(false);
     }
  };

  const enviarMensagemMiniIA = async (e) => {
     e.preventDefault();
     if(!miniIaInput.trim() || !openAIApiKey) return;
     const novaMsg = { role: 'user', content: miniIaInput };
     setMiniIaMessages(prev => [...prev, novaMsg]);
     setMiniIaInput('');
     setIsMiniIaLoading(true);

     try {
        const resumoRemessas = remessasDb.slice(0, 50).map(r => ({ projeto: r.projeto, pa: r.produto_acabado, qtd: r.quantidade_op, status: r.status }));
        const contextoGlobal = `Você é o Copiloto IA do sistema SGQ. Responda perguntas sobre o sistema. Lembre-se que itens sem saldo interno frequentemente estão em poder de terceiros (nas OPs com status ENVIADO). Responda de forma direta e curta. Dados: ${JSON.stringify(resumoRemessas)}`;
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openAIApiKey}` },
           body: JSON.stringify({ 
              model: 'gpt-4o',
              messages: [{ role: 'system', content: contextoGlobal }, ...miniIaMessages, novaMsg],
              max_tokens: 500, 
              temperature: 0.2
           })
        });

        if(!response.ok) throw new Error("Falha API");
        const data = await response.json();
        if(data.choices && data.choices[0]) {
           setMiniIaMessages(prev => [...prev, data.choices[0].message]);
        }
     } catch (err) {
        setMiniIaMessages(prev => [...prev, { role: 'assistant', content: '❌ Falha de conexão na API.' }]);
     } finally {
        setIsMiniIaLoading(false);
     }
  };

  const salvarRelatorioIA = async (e) => {
     e.preventDefault();
     if (!nomeNovoRelatorio.trim()) return setErro("O relatório precisa de um título.");
     setIsLoading(true);
     try {
        const payload = {
           titulo: nomeNovoRelatorio,
           conteudo: chatMessages,
           criado_por: usuarioLogado?.nome || 'Supervisora'
        };
        const { error } = await supabase.from('relatorios_ia').insert([payload]);
        if(error) throw error;
        
        setSucesso("Relatório salvo e arquivado com sucesso!");
        setModalSalvarRelatorio(false);
        setNomeNovoRelatorio('');
        setViewIA('LISTA');
        fetchAllData();
     } catch(err) {
        setErro("Não foi possível salvar o relatório. Verifique se a tabela SQL foi criada. " + err.message);
     } finally {
        setIsLoading(false);
     }
  };

  if (!usuarioLogado) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-[2rem] shadow-2xl p-8 md:p-10 w-full max-w-md border-b-8 border-indigo-600">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-4"><PackageOpen className="w-8 h-8" /></div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Kalenborn SGQ</h1>
            <p className="text-slate-400 font-bold text-[10px] mt-2 uppercase tracking-widest leading-relaxed text-center">Industrialização Cloud</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            {erroLogin && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-black border-2 border-red-100 flex items-center"><AlertCircle className="w-4 h-4 mr-2" /> {s(erroLogin)}</div>}
            <input type="email" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-4 font-bold text-slate-700 outline-none focus:border-indigo-500" placeholder="E-mail de acesso" value={emailLogin} onChange={e => setEmailLogin(e.target.value)} />
            <input type="password" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-4 font-bold text-slate-700 outline-none focus:border-indigo-500" placeholder="Senha" value={senhaLogin} onChange={e => setSenhaLogin(e.target.value)} />
            <button type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl shadow-xl hover:bg-indigo-700 transition-all uppercase tracking-wider text-sm">Acessar Sistema</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden text-sm">
      
      {/* Mobile Header Toggle */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center z-40 shadow-md shrink-0 print:hidden">
        <div className="flex items-center space-x-3">
          <PackageOpen className="w-6 h-6 text-indigo-400" />
          <h1 className="text-lg font-black tracking-tighter">SGQ Mobile</h1>
        </div>
        <button onClick={() => setMenuMobileAberto(!menuMobileAberto)} className="text-slate-300 hover:text-white p-2">
          {menuMobileAberto ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <div className={`fixed inset-y-0 left-0 transform ${menuMobileAberto ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-50 w-72 bg-slate-900 text-white flex flex-col shadow-2xl shrink-0 h-full md:h-auto print:hidden`}>
        <div className="p-6 border-b border-slate-800 flex items-center space-x-3 text-indigo-400 hidden md:flex">
          <PackageOpen className="w-8 h-8" /><h1 className="text-xl font-black">SGQ<br/><span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-indigo-500 text-center">Kalenborn</span></h1>
        </div>
        <div className="p-4 border-b border-slate-800 bg-slate-800/30 flex items-center justify-between mt-12 md:mt-0">
           <div className="flex items-center space-x-3 truncate">
              <div className="bg-slate-700 p-2 rounded-full flex-shrink-0">{isAdmin ? <Shield className="w-4 h-4 text-amber-400" /> : <User className="w-4 h-4 text-indigo-400" />}</div>
              <p className="font-black truncate">{s(usuarioLogado?.nome)}</p>
           </div>
           <button onClick={() => setUsuarioLogado(null)} className="text-slate-500 hover:text-red-400 transition-colors ml-2"><LogOut className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto py-4 space-y-1 px-3 custom-scrollbar">
          {isPCP && (
            <>
              <button onClick={() => { setAbaAtiva('NOVA_OP'); setMenuMobileAberto(false); }} className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${abaAtiva === 'NOVA_OP' ? 'bg-indigo-600 shadow-lg text-white' : 'text-slate-400 hover:bg-slate-800'}`}><LayoutDashboard className="w-5 h-5 mr-3" /> <span className="font-bold">Nova Remessa</span></button>
              <button onClick={() => { setAbaAtiva('HISTORICO_PCP'); setMenuMobileAberto(false); }} className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${abaAtiva === 'HISTORICO_PCP' ? 'bg-indigo-600 shadow-lg text-white' : 'text-slate-400 hover:bg-slate-800'}`}><History className="w-5 h-5 mr-3" /> <span className="font-bold">Histórico Envios</span></button>
              <button onClick={() => { setAbaAtiva('UPLOAD_ESTOQUE'); setMenuMobileAberto(false); }} className={`w-full flex items-center px-4 py-3 rounded-xl mt-4 transition-all ${abaAtiva === 'UPLOAD_ESTOQUE' ? 'bg-emerald-600 shadow-lg text-white' : 'text-slate-400 hover:bg-slate-800'}`}><UploadCloud className="w-5 h-5 mr-3" /> <span className="font-bold">Sincronizar ERP</span></button>
            </>
          )}
          {isExp && (
            <>
              <button onClick={() => { setAbaAtiva('EXPEDICAO'); setMenuMobileAberto(false); }} className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${abaAtiva === 'EXPEDICAO' ? 'bg-amber-600 shadow-lg text-white' : 'text-slate-400 hover:bg-slate-800'}`}><Truck className="w-5 h-5 mr-3" /> <span className="font-bold">Fila Expedição</span>{remessasPendentes.length > 0 && <span className="ml-auto bg-amber-400 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full">{String(remessasPendentes.length)}</span>}</button>
              <button onClick={() => { setAbaAtiva('FORNECEDORES'); setMenuMobileAberto(false); }} className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${abaAtiva === 'FORNECEDORES' ? 'bg-amber-600 shadow-lg text-white' : 'text-slate-400 hover:bg-slate-800'}`}><MapPin className="w-5 h-5 mr-3" /> <span className="font-bold">Retorno de Peças</span></button>
              <button onClick={() => { setAbaAtiva('CONTROLE_GERAL'); setMenuMobileAberto(false); }} className={`w-full flex items-center px-4 py-3 rounded-xl mt-4 transition-all ${abaAtiva === 'CONTROLE_GERAL' ? 'bg-blue-600 shadow-lg text-white' : 'text-slate-400 hover:bg-slate-800'}`}><ListChecks className="w-5 h-5 mr-3" /> <span className="font-bold">Controle Geral</span></button>
            </>
          )}
          {isAdmin && (
            <>
              <button onClick={() => { setAbaAtiva('DASHBOARD'); setMenuMobileAberto(false); }} className={`w-full flex items-center px-4 py-3 rounded-xl mt-4 transition-all ${abaAtiva === 'DASHBOARD' ? 'bg-indigo-600 shadow-lg text-white' : 'text-slate-400 hover:bg-slate-800'}`}><PieChart className="w-5 h-5 mr-3" /> <span className="font-bold text-amber-400">Painel Executivo</span></button>
              <button onClick={() => { setAbaAtiva('IA_ANALISTA'); setViewIA('CHAT'); setMenuMobileAberto(false); }} className={`w-full flex items-center px-4 py-3 rounded-xl mt-1 transition-all border border-indigo-600/30 ${abaAtiva === 'IA_ANALISTA' ? 'bg-gradient-to-r from-indigo-700 to-indigo-500 shadow-xl text-white' : 'bg-slate-800 text-indigo-300 hover:bg-indigo-900/50'}`}><BrainCircuit className="w-5 h-5 mr-3 animate-pulse" /> <span className="font-black uppercase tracking-widest text-[10px]">Construtor de Relatórios (IA)</span></button>
              <button onClick={() => { setAbaAtiva('AUDITORIA'); setMenuMobileAberto(false); }} className={`w-full flex items-center px-4 py-3 rounded-xl mt-4 transition-all ${abaAtiva === 'AUDITORIA' ? 'bg-red-600 shadow-lg text-white' : 'text-slate-400 hover:bg-slate-800'}`}><FileSearch className="w-5 h-5 mr-3" /> <span className="font-bold">Auditoria BOM</span></button>
              <button onClick={() => { setAbaAtiva('GESTAO_USUARIOS'); setMenuMobileAberto(false); }} className={`w-full flex items-center px-4 py-3 rounded-xl mt-1 transition-all ${abaAtiva === 'GESTAO_USUARIOS' ? 'bg-purple-600 shadow-lg text-white' : 'text-slate-400 hover:bg-slate-800'}`}><Users className="w-5 h-5 mr-3" /> <span className="font-bold">Gestão Acessos</span></button>
            </>
          )}
        </div>
        
        {(isAdmin || isPCP) && (
          <div className="p-4 bg-slate-950 space-y-4 shrink-0">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Modelo SGQ Excel</p>
            <label className={`flex items-center justify-center px-3 py-3 rounded-xl cursor-pointer transition-all border-2 ${templateBuffer ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-red-600 border-red-500 text-white animate-pulse'}`}>
              <FileSpreadsheet className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="font-black uppercase text-[10px] truncate">{s(nomeTemplate || 'Carregar Modelo')}</span>
              <input type="file" accept=".xlsx" className="hidden" onChange={async (e) => {
                 const file = e.target.files[0]; if(!file) return;
                 setIsLoading(true);
                 const fr = new FileReader(); fr.onload = async(evt) => {
                    const b64 = window.btoa(new Uint8Array(evt.target.result).reduce((d, b) => d + String.fromCharCode(b), ''));
                    await supabase.from('configuracoes').upsert({ chave: 'modelo_sgq', valor_json: { nome: file.name, data: b64 } });
                    setTemplateBuffer(evt.target.result); setNomeTemplate(file.name); setIsLoading(false); setSucesso("Modelo Salvo!");
                 }; fr.readAsArrayBuffer(file);
              }} />
            </label>
            <div className="flex items-center justify-center text-[10px] text-slate-500 font-bold uppercase tracking-widest gap-2">
              {dbOnline ? <Cloud className="w-3 h-3 text-emerald-500" /> : <CloudOff className="w-3 h-3 text-red-500" />} {dbOnline ? 'Nuvem Ativa' : 'Offline'}
            </div>
          </div>
        )}
      </div>

      {/* Overlay Mobile */}
      {menuMobileAberto && <div className="fixed inset-0 bg-black/60 z-40 md:hidden print:hidden" onClick={() => setMenuMobileAberto(false)}></div>}

      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-y-auto relative p-4 md:p-8 custom-scrollbar print:p-0 print:bg-white">
        {isLoading && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-md z-[60] flex flex-col items-center justify-center text-center print:hidden">
            <Loader2 className="w-20 h-20 text-indigo-600 animate-spin mb-6" />
            <h3 className="text-2xl font-black uppercase text-slate-800 tracking-tighter">Processando...</h3>
            <div className="w-64 bg-slate-200 h-2 rounded-full overflow-hidden mt-4 shadow-inner"><div className="bg-indigo-600 h-full transition-all duration-300" style={{width: `${uploadProgress}%`}}></div></div>
          </div>
        )}

        {(erro || sucesso) && <div className={`fixed top-4 right-4 z-[100] p-5 rounded-2xl shadow-2xl flex items-start border-2 animate-in slide-in-from-top-4 print:hidden ${erro ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'}`}><AlertCircle className="w-6 h-6 mr-3 flex-shrink-0" /><div className="flex-1 font-black text-sm">{s(erro || sucesso)}</div><button onClick={() => {setErro(''); setSucesso('');}} className="font-black text-xl ml-4">&times;</button></div>}

        {abaAtiva === 'DASHBOARD' && isAdmin && (
           <div className="max-w-7xl mx-auto space-y-8 w-full animate-in fade-in pb-10">
              <div className="flex flex-col md:flex-row justify-between md:items-end border-b-4 border-indigo-100 pb-4 gap-4">
                 <div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tighter uppercase leading-none">Painel Executivo</h2>
                    <p className="text-indigo-600 font-bold uppercase text-[10px] md:text-xs tracking-widest mt-2 flex items-center"><TrendingUp className="w-4 h-4 mr-1"/> Visão Estratégica de Operações e Recursos</p>
                 </div>
                 <div className="flex flex-wrap items-center gap-4">
                    {remessasAtrasadas20Dias.length > 0 && (
                       <button onClick={() => setModalAtrasadasAberto(true)} className="bg-red-50 px-5 py-3 rounded-2xl shadow-sm border border-red-200 flex items-center font-black text-xs text-red-600 uppercase tracking-widest animate-pulse hover:bg-red-100 hover:scale-105 transition-all cursor-pointer">
                          <AlertTriangle className="w-5 h-5 mr-3"/> {remessasAtrasadas20Dias.length} OPs Fora +20 Dias
                       </button>
                    )}
                    <div className="bg-white px-5 py-3 rounded-2xl shadow-md border border-slate-200 flex items-center font-black text-xs text-slate-600 uppercase tracking-widest">
                       <Calendar className="w-5 h-5 mr-3 text-indigo-500"/> Visão Geral Acumulada
                    </div>
                 </div>
              </div>

              {/* KPIs Principais */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                 <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-transform cursor-default">
                    <div className="absolute -right-6 -top-6 bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center group-hover:scale-125 transition-transform duration-500"><Layers className="w-10 h-10 text-blue-200" /></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest relative z-10">Total de OPs Emitidas</p>
                    <p className="text-4xl font-black text-slate-800 mt-2 relative z-10">{dashboardData.kpiTotalOps}</p>
                 </div>
                 <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-transform cursor-default">
                    <div className="absolute -right-6 -top-6 bg-indigo-50 w-24 h-24 rounded-full flex items-center justify-center group-hover:scale-125 transition-transform duration-500"><Boxes className="w-10 h-10 text-indigo-200" /></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest relative z-10">Volume Total (PA)</p>
                    <p className="text-4xl font-black text-indigo-600 mt-2 relative z-10">{dashboardData.kpiVolumePecas}</p>
                 </div>
                 <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-transform cursor-default">
                    <div className="absolute -right-6 -top-6 bg-amber-50 w-24 h-24 rounded-full flex items-center justify-center group-hover:scale-125 transition-transform duration-500"><Truck className="w-10 h-10 text-amber-200" /></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest relative z-10">OPs em Trânsito/Rua</p>
                    <p className="text-4xl font-black text-amber-500 mt-2 relative z-10">{dashboardData.kpiEmTransito}</p>
                 </div>
                 <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-transform cursor-default">
                    <div className="absolute -right-6 -top-6 bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center group-hover:scale-125 transition-transform duration-500"><CheckCircle className="w-10 h-10 text-emerald-200" /></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest relative z-10">OPs Concluídas</p>
                    <p className="text-4xl font-black text-emerald-500 mt-2 relative z-10">{dashboardData.kpiConcluidas}</p>
                 </div>
              </div>

              {/* Gráficos Principais Premium */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                 <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-lg flex flex-col hover:shadow-xl transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                       <h3 className="font-black text-slate-800 uppercase tracking-tight flex items-center text-lg"><Target className="w-6 h-6 mr-3 text-rose-500" /> Top Materiais (MP)</h3>
                       <span className="text-[9px] font-black bg-rose-50 text-rose-600 px-4 py-2 rounded-full uppercase tracking-widest whitespace-nowrap text-center">Maiores Consumos Fisicos</span>
                    </div>
                    <div className="flex-1 space-y-6 flex flex-col justify-center">
                       {dashboardData.topMps.map((mp, index) => (
                          <div key={mp.name} className="relative group/bar cursor-default">
                             <div className="flex justify-between items-end mb-2">
                                <span className="font-black text-slate-700 uppercase tracking-tighter text-xs md:text-sm flex items-center truncate pr-4">
                                   <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] mr-3 shrink-0 shadow-inner">{index + 1}</span> 
                                   <span className="truncate">{mp.name}</span>
                                </span>
                                <span className="font-black text-rose-600 shrink-0 text-base">{mp.value} <span className="text-[10px] text-slate-400">PÇS</span></span>
                             </div>
                             <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden shadow-inner p-0.5">
                                <div className="bg-gradient-to-r from-rose-400 to-rose-600 h-full rounded-full transition-all duration-1000 ease-out group-hover/bar:from-rose-500 group-hover/bar:to-pink-500 relative" style={{width: `${(mp.value / dashboardData.maxMp) * 100}%`}}>
                                   <div className="absolute top-0 right-0 bottom-0 w-10 bg-white/20 blur-md"></div>
                                </div>
                             </div>
                          </div>
                       ))}
                       {dashboardData.topMps.length === 0 && <p className="text-center text-slate-400 font-black uppercase text-xs tracking-widest opacity-50 py-10">Sem dados registrados</p>}
                    </div>
                 </div>

                 <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-lg flex flex-col hover:shadow-xl transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                       <h3 className="font-black text-slate-800 uppercase tracking-tight flex items-center text-lg"><Activity className="w-6 h-6 mr-3 text-indigo-500" /> Fluxo de Lançamentos</h3>
                       <span className="text-[9px] font-black bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full uppercase tracking-widest whitespace-nowrap text-center">Últimos 10 Dias</span>
                    </div>
                    <div className="flex-1 flex items-end gap-2 md:gap-4 h-48 md:h-64 mt-4 overflow-x-auto custom-scrollbar pb-2">
                       {dashboardData.saidasData.map((d, index) => (
                          <div key={index} className="flex-1 flex flex-col items-center gap-3 group h-full justify-end relative min-w-[2.5rem]">
                             <div className="absolute -top-10 bg-slate-800 text-white text-[10px] font-black px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none shadow-xl whitespace-nowrap z-10 flex flex-col items-center group-hover:-translate-y-2">
                                {d.value} PÇS
                                <div className="absolute -bottom-1 w-2 h-2 bg-slate-800 rotate-45"></div>
                             </div>
                             <div className="w-full bg-slate-50 border border-slate-100 rounded-t-2xl relative flex-1 flex flex-col justify-end overflow-hidden group-hover:bg-slate-100 transition-colors">
                                <div className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-2xl transition-all duration-1000 ease-out relative shadow-[0_-5px_15px_rgba(79,70,229,0.2)] group-hover:from-indigo-500 group-hover:to-purple-400" style={{height: `${(d.value / dashboardData.maxSaida) * 100}%`, minHeight: d.value > 0 ? '10%' : '0%'}}>
                                   <div className="absolute top-0 left-0 right-0 h-4 bg-white/20"></div>
                                </div>
                             </div>
                             <span className="text-[9px] font-black text-slate-400">{d.date}</span>
                          </div>
                       ))}
                       {dashboardData.saidasData.length === 0 && <div className="w-full h-full flex items-center justify-center"><p className="text-center text-slate-400 font-black uppercase text-xs tracking-widest opacity-50">Sem dados recentes</p></div>}
                    </div>
                 </div>
              </div>

              {/* Gráfico 3: Top Produtos Acabados */}
              <div className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-slate-100 shadow-lg">
                 <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <h3 className="font-black text-slate-800 uppercase tracking-tight flex items-center text-xl"><BarChart className="w-8 h-8 mr-4 text-emerald-500" /> Produtos Alvo (PA) Mais Demandados</h3>
                    <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-5 py-2 rounded-full uppercase tracking-widest text-center">Volume Total</span>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
                    {dashboardData.topPas.map((pa, index) => (
                       <div key={pa.name} className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-[2rem] p-6 flex flex-col justify-between group hover:border-emerald-300 transition-colors shadow-sm hover:shadow-md cursor-default">
                          <div className="flex justify-between items-start mb-6">
                             <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 font-black flex items-center justify-center shadow-inner text-lg shrink-0">{index + 1}</div>
                             <Boxes className="w-6 h-6 text-slate-300 group-hover:text-emerald-400 transition-colors shrink-0" />
                          </div>
                          <div>
                             <p className="font-black text-slate-800 uppercase tracking-tighter truncate text-xl" title={pa.name}>{pa.name.split('-')[0]}</p>
                             <p className="text-xs text-slate-500 font-bold truncate mt-1" title={pa.name}>{pa.name.split('-')[1] || 'Produto Final'}</p>
                             <div className="flex items-end gap-2 mt-6">
                                <span className="font-black text-emerald-600 text-3xl leading-none">{pa.value}</span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Vol. Prod</span>
                             </div>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 mt-6 overflow-hidden">
                             <div className="bg-emerald-500 h-2 rounded-full relative" style={{width: `${(pa.value / dashboardData.maxPa) * 100}%`}}>
                                <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/40"></div>
                             </div>
                          </div>
                       </div>
                    ))}
                    {dashboardData.topPas.length === 0 && <div className="col-span-1 md:col-span-5 py-10"><p className="text-center text-slate-400 font-black uppercase text-xs tracking-widest opacity-50">Sem dados registrados</p></div>}
                 </div>
              </div>

              {/* Seção Analítica de Demandas e Vínculos */}
              <div className="mt-16 bg-white p-6 md:p-10 rounded-[3rem] shadow-xl border border-slate-100">
                 <div className="flex flex-col md:flex-row justify-between md:items-end border-b-4 border-indigo-100 pb-6 mb-8 gap-4">
                    <div>
                       <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tighter uppercase leading-none">Gestão de Demandas (Raio-X)</h2>
                       <p className="text-slate-500 font-bold uppercase text-[10px] md:text-xs tracking-widest mt-3 flex items-center"><Network className="w-4 h-4 mr-2"/> Agrupamento Automático de OPs e Complementos Físicos</p>
                    </div>
                 </div>
                 <div className="space-y-8">
                    {dashboardProjetosAgrupados.map(root => (
                       <div key={root.id} className="bg-slate-50 rounded-[2rem] border border-slate-200 shadow-sm p-6 md:p-8 hover:shadow-lg transition-shadow">
                          <div className="flex flex-col xl:flex-row justify-between xl:items-center border-b border-slate-200 pb-6 mb-6 gap-6">
                             <div>
                                <p className="text-[10px] md:text-xs font-black text-indigo-500 uppercase tracking-widest mb-2 flex items-center bg-indigo-100/50 w-fit px-3 py-1 rounded-lg"><MapPin className="w-4 h-4 mr-2"/> Cliente: {s(root.cliente)}</p>
                                <h3 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tighter break-words">{s(root.projeto)} <span className="text-slate-300 font-black mx-2 md:mx-4">/</span> <span className="text-slate-600 text-xl md:text-2xl break-words">{s(root.produto_acabado)}</span></h3>
                             </div>
                             <div className="flex flex-wrap md:flex-nowrap items-center gap-4 md:gap-8 bg-slate-900 p-6 rounded-[2rem] border border-slate-800 shrink-0 w-full xl:w-auto justify-center md:justify-start">
                                <div className="text-center">
                                   <p className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Meta Original (PA)</p>
                                   <p className="text-2xl font-black text-slate-200">{root.metaPA}</p>
                                </div>
                                <div className="w-px h-10 bg-slate-700 hidden md:block"></div>
                                <div className="text-center">
                                   <p className="text-[9px] md:text-[10px] text-emerald-400 font-black uppercase tracking-widest mb-2">Total Enviado (PA)</p>
                                   <p className="text-2xl font-black text-emerald-400">{root.totalEnviado}</p>
                                </div>
                                <div className="w-full md:w-auto md:border-l md:border-slate-700 md:pl-8 pt-4 md:pt-0 flex justify-center">
                                   <button onClick={() => setProjetoDetalheSelecionado(root)} className="w-full md:w-auto bg-indigo-600 text-white border border-indigo-500 hover:bg-indigo-500 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)]"><Maximize2 className="w-5 h-5 mr-3"/> Raio-X Detalhado</button>
                                </div>
                             </div>
                          </div>
                          {root.filhos.length > 0 && (
                             <div className="pl-4 md:pl-8 border-l-4 border-indigo-200 space-y-3 mt-6 bg-indigo-50/50 py-4 pr-4 rounded-r-3xl">
                                <p className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest flex items-center"><CornerDownRight className="w-4 h-4 mr-2 text-indigo-400"/> Complementos Vinculados na Carga:</p>
                                {root.filhos.map(f => (
                                   <div key={f.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm gap-3">
                                      <div className="flex flex-wrap items-center gap-3 md:gap-6">
                                         <span className="font-black text-emerald-600 text-base md:text-lg bg-emerald-50 px-3 py-1 rounded-lg">+{f.quantidade_op} PÇS</span>
                                         <span className="text-xs md:text-sm font-bold text-slate-600 uppercase bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">{s(f.observacao)}</span>
                                      </div>
                                      <span className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg text-center sm:text-right">{f.data_criacao ? new Date(f.data_criacao).toLocaleDateString() : ''}</span>
                                   </div>
                                ))}
                             </div>
                          )}
                       </div>
                    ))}
                    {dashboardProjetosAgrupados.length === 0 && <div className="text-center py-24 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200"><Network className="w-16 h-16 mx-auto mb-6 text-slate-300"/><p className="text-slate-400 font-black uppercase tracking-widest text-lg">Sem agrupamentos de demanda</p></div>}
                 </div>
              </div>
           </div>
        )}

        {abaAtiva === 'IA_ANALISTA' && isAdmin && (
           <div className="max-w-6xl mx-auto w-full h-[calc(100vh-4rem)] md:h-[calc(100vh-6rem)] flex flex-col animate-in fade-in print:h-auto print:max-w-full">
              
              {/* Menu de Abas da IA - Hidden in print */}
              <div className="flex gap-4 mb-6 shrink-0 print:hidden overflow-x-auto pb-2">
                 <button onClick={()=>setViewIA('CHAT')} className={`flex items-center px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-sm ${viewIA==='CHAT' ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-white border-2 border-slate-100 text-slate-500 hover:border-indigo-200 hover:text-indigo-600'}`}>
                    <Bot className="w-5 h-5 mr-3"/> Análise Dinâmica (Chat)
                 </button>
                 <button onClick={()=>setViewIA('LISTA')} className={`flex items-center px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-sm ${viewIA==='LISTA' ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-white border-2 border-slate-100 text-slate-500 hover:border-indigo-200 hover:text-indigo-600'}`}>
                    <FileText className="w-5 h-5 mr-3"/> Acervo de Relatórios
                 </button>
              </div>

              {viewIA === 'CHAT' && (
                 <>
                    <div className="bg-slate-950 rounded-t-[2.5rem] p-6 md:p-10 shrink-0 relative overflow-hidden shadow-2xl border-b border-indigo-500/30 flex justify-between items-center">
                       <div className="absolute top-0 right-0 opacity-20 pointer-events-none"><BrainCircuit className="w-64 h-64 -mt-10 -mr-10 text-indigo-400"/></div>
                       <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-indigo-600 rounded-full blur-[120px] opacity-40"></div>
                       <div className="relative z-10">
                          <h2 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase flex items-center"><Bot className="w-8 h-8 md:w-10 md:h-10 mr-4 text-indigo-400"/> Construtor Analítico</h2>
                          <div className="flex items-center gap-3 mt-4 ml-0 md:ml-14">
                             <span className="bg-emerald-500 text-white text-[9px] md:text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.5)]">Motor Class-5 Ativo</span>
                             <span className="text-indigo-300 font-bold uppercase text-[9px] md:text-[10px] tracking-widest hidden md:inline">Acesso Integral ao Banco de Dados</span>
                          </div>
                       </div>
                       <button onClick={() => setModalSalvarRelatorio(true)} className="relative z-10 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center backdrop-blur-sm shadow-xl hover:-translate-y-1">
                          <Save className="w-5 h-5 mr-3"/> Salvar Relatório
                       </button>
                    </div>
                    <div className="flex-1 bg-white border-x border-slate-200 overflow-y-auto p-4 md:p-10 custom-scrollbar space-y-10" ref={chatScrollRef}>
                       {chatMessages.map((msg, i) => (
                          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                             <div className={`w-full md:max-w-[85%] p-6 md:p-8 shadow-sm text-sm md:text-base ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-[2rem] rounded-tr-none font-medium' : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-[2rem] rounded-tl-none'}`}>
                                {msg.role === 'user' ? (msg.content) : (
                                   parseBotMessage(msg.content).map((part, pIdx) => {
                                      if(part.type === 'text') return <div key={pIdx} className="whitespace-pre-wrap leading-relaxed">{part.content}</div>;
                                      if(part.type === 'CHART') return <BoardChart key={pIdx} title={part.payload.title} data={part.payload.data} />;
                                      if(part.type === 'INSIGHT') return <InsightCard key={pIdx} title={part.payload.title} text={part.payload.text} />;
                                      if(part.type === 'error') return <div key={pIdx} className="my-6 bg-red-50 text-red-600 p-6 rounded-2xl text-xs md:text-sm font-bold border border-red-200 shadow-sm">{part.content}</div>;
                                      return null;
                                   })
                                )}
                             </div>
                          </div>
                       ))}
                       {isChatLoading && (
                          <div className="flex justify-start">
                             <div className="max-w-[85%] p-6 rounded-[2rem] bg-slate-50 border border-slate-200 text-slate-500 rounded-tl-none flex flex-col md:flex-row gap-4 items-center shadow-sm">
                                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin"/> 
                                <span className="font-black text-xs uppercase tracking-widest text-center md:text-left">Construindo raciocínio e minerando dados...</span>
                             </div>
                          </div>
                       )}
                    </div>
                    <form onSubmit={enviarMensagemGPT} className="p-4 md:p-8 bg-white border border-slate-200 rounded-b-[2.5rem] shrink-0 flex flex-col md:flex-row gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                       <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Ex: Adicione um gráfico das 5 peças mais demandadas da VALE..." className="flex-1 bg-slate-100 border-2 border-slate-200 rounded-2xl md:rounded-[2rem] px-6 py-4 md:py-5 text-sm md:text-base outline-none focus:border-indigo-500 text-slate-800 font-bold transition-all shadow-inner" disabled={isChatLoading || !openAIApiKey} />
                       <button type="submit" disabled={isChatLoading || !chatInput.trim() || !openAIApiKey} className="bg-indigo-600 text-white px-8 md:px-12 py-4 md:py-0 rounded-2xl md:rounded-[2rem] hover:bg-indigo-700 transition-all shadow-[0_5px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_10px_30px_rgba(79,70,229,0.5)] disabled:opacity-50 flex items-center justify-center font-black uppercase tracking-widest text-xs"><Send className="w-5 h-5 mr-3"/> Adicionar ao Relatório</button>
                    </form>
                    {!openAIApiKey && <div className="mt-6 p-4 bg-red-50 rounded-2xl border border-red-200 text-center text-red-600 font-black text-xs uppercase tracking-widest shadow-sm"><AlertCircle className="w-5 h-5 inline mr-2"/> Chave Secreta da OpenAI Ausente no Banco de Dados</div>}
                 </>
              )}

              {viewIA === 'LISTA' && (
                 <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm overflow-y-auto">
                    <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase mb-8">Acervo de Relatórios (IA)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {relatoriosIaDb.map(rel => (
                          <div key={rel.id} className="bg-slate-50 border border-slate-200 p-8 rounded-[2rem] hover:shadow-xl hover:border-indigo-300 transition-all group flex flex-col justify-between cursor-pointer" onClick={() => { setRelatorioVisualizacao(rel); setViewIA('APRESENTACAO'); }}>
                             <div>
                                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Presentation className="w-6 h-6"/></div>
                                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-2 line-clamp-2">{s(rel.titulo)}</h3>
                                <p className="text-slate-500 font-medium text-xs line-clamp-3 mb-6">
                                   Contém {Array.isArray(rel.conteudo) ? rel.conteudo.filter(c=>c.role==='assistant').length : 0} análises geradas pelo assistente executivo.
                                </p>
                             </div>
                             <div className="flex justify-between items-end pt-6 border-t border-slate-200">
                                <div>
                                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Criado por</p>
                                   <p className="font-bold text-slate-700 text-xs">{s(rel.criado_por)}</p>
                                </div>
                                <p className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg">{new Date(rel.data_criacao).toLocaleDateString()}</p>
                             </div>
                          </div>
                       ))}
                       {relatoriosIaDb.length === 0 && (
                          <div className="col-span-full py-24 text-center border-2 border-dashed border-slate-200 rounded-[2rem]">
                             <FileText className="w-16 h-16 mx-auto mb-6 text-slate-300"/>
                             <p className="text-slate-400 font-black uppercase tracking-widest text-lg">Nenhum relatório salvo</p>
                             <p className="text-slate-500 font-medium mt-2">Crie uma análise no chat e clique em "Salvar Relatório".</p>
                          </div>
                       )}
                    </div>
                 </div>
              )}

              {viewIA === 'APRESENTACAO' && relatorioVisualizacao && (
                 <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-200 p-8 md:p-16 shadow-sm overflow-y-auto print:p-0 print:border-none print:shadow-none print:bg-white print:overflow-visible relative">
                    
                    {/* Botões de Ação Superiores */}
                    <div className="flex justify-between items-center mb-16 print:hidden sticky top-0 bg-white/90 backdrop-blur-md z-40 py-4 border-b border-slate-100">
                       <button onClick={() => setViewIA('LISTA')} className="flex items-center text-slate-500 hover:text-indigo-600 font-black uppercase text-xs tracking-widest transition-colors"><ChevronLeft className="w-5 h-5 mr-2"/> Voltar ao Acervo</button>
                       <button onClick={() => window.print()} className="bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all shadow-xl flex items-center"><Printer className="w-5 h-5 mr-3"/> Imprimir / Gerar PDF</button>
                    </div>

                    {/* Cabeçalho do Relatório */}
                    <div className="text-center mb-16 border-b-4 border-indigo-600 pb-12 print:border-b-2">
                       <p className="text-indigo-600 font-black uppercase tracking-[0.3em] text-xs mb-4">Relatório Executivo SGQ</p>
                       <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase mb-6 leading-tight">{s(relatorioVisualizacao.titulo)}</h1>
                       <div className="flex justify-center gap-8 text-slate-500 font-bold uppercase tracking-widest text-xs">
                          <span className="flex items-center"><User className="w-4 h-4 mr-2"/> {s(relatorioVisualizacao.criado_por)}</span>
                          <span className="flex items-center"><Calendar className="w-4 h-4 mr-2"/> {new Date(relatorioVisualizacao.data_criacao).toLocaleDateString()}</span>
                       </div>
                    </div>

                    {/* Corpo do Relatório */}
                    <div className="space-y-16 max-w-5xl mx-auto print:space-y-8">
                       {(Array.isArray(relatorioVisualizacao.conteudo) ? relatorioVisualizacao.conteudo : []).map((msg, i) => {
                          if(msg.role === 'system' || (msg.role === 'assistant' && i === 0)) return null; // Esconde prompt do sistema e a primeira msg padrão

                          if(msg.role === 'user') {
                             return (
                                <div key={i} className="flex items-center gap-4 border-b-2 border-slate-100 pb-4 mt-16 print:mt-10 print:break-after-avoid">
                                   <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center shrink-0"><Search className="w-5 h-5 text-indigo-600"/></div>
                                   <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">{msg.content}</h3>
                                </div>
                             );
                          }

                          if(msg.role === 'assistant') {
                             return (
                                <div key={i} className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-medium print:text-sm">
                                   {parseBotMessage(msg.content).map((part, pIdx) => {
                                      if(part.type === 'text') return <div key={pIdx} className="whitespace-pre-wrap">{part.content}</div>;
                                      if(part.type === 'CHART') return <BoardChart key={pIdx} title={part.payload.title} data={part.payload.data} />;
                                      if(part.type === 'INSIGHT') return <InsightCard key={pIdx} title={part.payload.title} text={part.payload.text} />;
                                      return null;
                                   })}
                                </div>
                             );
                          }
                          return null;
                       })}
                    </div>
                    
                    {/* Rodapé de Impressão */}
                    <div className="mt-24 pt-8 border-t border-slate-200 text-center hidden print:block text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                       Kalenborn SGQ • Documento Gerencial Extraído via Inteligência Artificial (Motor Class-5)
                    </div>
                 </div>
              )}
           </div>
        )}

        {/* 1. ABA NOVA OP (COM COMPLEMENTO E MODO MANUAL) */}
        {abaAtiva === 'NOVA_OP' && (
          <div className="max-w-4xl mx-auto space-y-6 w-full animate-in fade-in pb-10">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Nova Ordem de Remessa</h2>
            <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-200 shadow-sm">
              <form onSubmit={buscarProduto} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase ml-2">Cód Produto PA</label><input placeholder="Ex: 100200" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-black uppercase text-slate-700 outline-none focus:border-indigo-400 focus:bg-white shadow-inner transition-all" value={codigoBusca} onChange={e => setCodigoBusca(e.target.value)} /></div>
                
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase ml-2">Qtd Produção</label><input type="text" placeholder="Ex: 0,5 ou 1.5" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-black text-slate-700 outline-none focus:border-indigo-400 focus:bg-white shadow-inner transition-all" value={quantidadeProduzir} onChange={e => setQuantidadeProduzir(e.target.value)} /></div>
                
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase ml-2">Projeto (BR)</label><input placeholder="BR-..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-black text-slate-700 outline-none focus:border-indigo-400 focus:bg-white shadow-inner transition-all" value={projeto} onChange={e => setProjeto(e.target.value)} /></div>
                <div className="space-y-1 md:col-span-2 lg:col-span-1"><label className="text-[10px] font-black text-indigo-600 uppercase ml-2 flex items-center"><Building2 className="w-3 h-3 mr-1"/> Nome do Cliente</label><input placeholder="Cliente Final" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-black text-slate-700 outline-none focus:border-indigo-400 focus:bg-white shadow-inner transition-all" value={cliente} onChange={e => setCliente(e.target.value)} /></div>
                <div className={`space-y-1 ${observacao === 'Outros' ? 'lg:col-span-1' : 'lg:col-span-2'}`}>
                  <label className="text-[10px] font-black text-indigo-600 uppercase ml-2 flex items-center"><Construction className="w-3 h-3 mr-1"/> Serviço p/ PCP</label>
                  <select className="w-full bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 font-black text-indigo-900 outline-none focus:border-indigo-500 shadow-sm transition-all cursor-pointer" value={observacao} onChange={e => setObservacao(e.target.value)}>
                    <option value="Industrialização">Industrialização (Padrão)</option><option value="Jateamento Interno">Jateamento Interno</option><option value="Jateamento Externo">Jateamento Externo</option><option value="Reforma">Reforma</option><option value="Autoclave">Autoclave</option><option value="Montagem de Placas">Montagem de Placas</option><option value="Outros">Outros (Descrever)</option>
                  </select>
                </div>
                {observacao === 'Outros' && (
                  <div className="space-y-1 lg:col-span-1 animate-in slide-in-from-left-2"><label className="text-[10px] font-black text-amber-600 uppercase ml-2 flex items-center"><Edit3 className="w-3 h-3 mr-1"/> Especifique</label><input placeholder="Serviço" className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 font-black text-amber-900 outline-none shadow-sm focus:border-amber-500 transition-all" value={outrosTexto} onChange={e => setOutrosTexto(e.target.value)} /></div>
                )}
                <div className="space-y-1 lg:col-span-3"><label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center"><Info className="w-3 h-3 mr-1"/> Nota PCP p/ Logística</label><input placeholder="Instruções..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:border-indigo-400 focus:bg-white shadow-inner transition-all" value={obsExpedicao} onChange={e => setObsExpedicao(e.target.value)} /></div>

                {/* Bloco de Complemento de Carga */}
                <div className="lg:col-span-3 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-4 items-center mt-2 shadow-sm">
                   <label className="flex items-center gap-3 cursor-pointer font-black text-slate-700 uppercase tracking-widest text-xs select-none">
                      <input type="checkbox" className="w-5 h-5 accent-indigo-600 rounded cursor-pointer" checked={isComplemento} onChange={e => setIsComplemento(e.target.checked)} />
                      É um Complemento de Carga?
                   </label>
                   {isComplemento && (
                      <select className="flex-1 bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 shadow-sm cursor-pointer animate-in fade-in" value={remessaPaiId} onChange={e => setRemessaPaiId(e.target.value)}>
                         <option value="">Selecione a OP Original na lista...</option>
                         {remessasDb.filter(r => !r.remessa_pai_id).map(r => (
                            <option key={r.id} value={r.id}>{s(r.projeto)} - {s(r.produto_acabado)} ({s(r.cliente)})</option>
                         ))}
                      </select>
                   )}
                </div>

                <button type="submit" className="lg:col-span-3 bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-black transition-all shadow-xl uppercase tracking-wider text-sm mt-4 shadow-indigo-100 flex items-center justify-center gap-3"><Search className="w-5 h-5"/> Buscar BOM / Iniciar Lançamento</button>
              </form>
            </div>
            
            {produtoEncontrado && (
              <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm animate-in zoom-in-95 mt-8">
                <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                   <h3 className="font-black text-slate-800 uppercase tracking-tighter text-lg">{produtoEncontrado.descricao}</h3>
                   {isModoManual && <span className="bg-red-100 text-red-600 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest animate-pulse flex items-center w-fit shadow-sm"><AlertTriangle className="w-3 h-3 mr-2"/> MODO MANUAL ATIVADO</span>}
                </div>

                {/* Formulário de Adição Manual de Itens */}
                {isModoManual && (
                   <div className="p-6 bg-amber-50 border-b border-amber-200">
                      <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-4 flex items-center"><PlusCircle className="w-4 h-4 mr-2"/> Inserção de Itens Avulsos / Não Cadastrados</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 items-end">
                         <div className="md:col-span-2"><label className="text-[10px] font-black text-slate-500 uppercase">Código MP</label><input className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm font-bold uppercase outline-none focus:border-amber-500 shadow-sm" value={manualCodMP} onChange={e => setManualCodMP(e.target.value.toUpperCase())} placeholder="Ex: 8569" /></div>
                         <div className="md:col-span-2"><label className="text-[10px] font-black text-slate-500 uppercase">Descrição (Opcional)</label><input className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm font-bold outline-none focus:border-amber-500 shadow-sm" value={manualDescMP} onChange={e => setManualDescMP(e.target.value)} placeholder="Material..." /></div>
                         <div className="md:col-span-1"><label className="text-[10px] font-black text-slate-500 uppercase">Qtd</label><input type="number" step="0.0001" className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm font-bold outline-none focus:border-amber-500 shadow-sm" value={manualQtdMP} onChange={e => setManualQtdMP(e.target.value)} placeholder="0.00" /></div>
                         <div className="md:col-span-1"><button type="button" onClick={adicionarItemManual} className="w-full bg-amber-500 text-white font-black py-2.5 rounded-lg hover:bg-amber-600 transition-all uppercase text-xs shadow-md">Add <ArrowRight className="w-3 h-3 inline ml-1"/></button></div>
                      </div>
                   </div>
                )}

                {!isModoManual && (
                  <div className="p-4 bg-indigo-50 text-indigo-700 font-black text-[10px] uppercase flex items-center border-b border-indigo-100"><Info className="w-4 h-4 mr-2 flex-shrink-0"/> Auditoria Ativa: Itens removidos da lista serão registrados como pendentes.</div>
                )}

                <div className="overflow-x-auto">
                   <table className="w-full text-left text-xs whitespace-nowrap"><thead className="bg-slate-50 border-b border-slate-200">
                     <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest"><th className="p-5 text-center w-16">Ação</th><th className="p-5">Código MP</th><th className="p-5 w-full">Descrição do Material</th><th className="p-5 text-center">Quantidade</th><th className="p-5 text-center pr-8">Estoque Atual</th></tr>
                   </thead><tbody className="divide-y divide-slate-100">
                     {itensRemessa.map((it, i) => (
                       <tr key={i} className={it.saldoDisponivel < it.quantidadeTotal ? 'bg-red-50/20' : 'hover:bg-slate-50 transition-colors'}>
                         <td className="p-4 text-center"><button type="button" onClick={() => setItensRemessa(prev => prev.filter((_, idx) => idx !== i))} className="text-slate-300 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all"><Trash2 className="w-4 h-4 mx-auto" /></button></td>
                         <td className="p-4 font-black text-slate-700 uppercase tracking-tighter">{s(it.codigoMP)}</td>
                         <td className="p-4 text-slate-600 font-bold max-w-[200px] md:max-w-md truncate" title={s(it.descricao)}>{s(it.descricao)}</td>
                         <td className="p-4 text-center font-black text-indigo-600">
                           {ITENS_RATEIO.includes(s(it.codigoMP)) && !isModoManual ? (
                             <div className="flex items-center justify-center gap-2">
                                <span className="w-16 bg-slate-100 border border-slate-200 rounded-lg text-center font-black text-slate-600 py-1.5 inline-block">{String(it.quantidadeTotal)}</span>
                                <button type="button" onClick={() => { setIdxItemRateio(i); setModalRateioAberto(true); }} className={`p-1.5 rounded-lg transition-all ${it.rateiosExtras?.length > 0 ? 'bg-emerald-100 text-emerald-600 shadow-sm' : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'}`} title="Rateio / Ajustar Qtd"><PieChart className="w-4 h-4" /></button>
                             </div>
                           ) : (<span>{String(it.quantidadeTotal)} <span className="text-[10px] text-slate-400 font-bold">{s(it.um)}</span></span>)}
                         </td>
                         <td className={`p-4 text-center font-black pr-8 ${it.saldoDisponivel < it.quantidadeTotal ? 'text-red-500' : 'text-emerald-500'}`}>{String(it.saldoDisponivel)}</td>
                       </tr>
                     ))}
                     {itensRemessa.length === 0 && <tr><td colSpan="5" className="p-16 text-center text-slate-400 font-black uppercase text-sm tracking-widest opacity-50">Nenhum item na lista</td></tr>}
                   </tbody></table>
                </div>
                <div className="p-6 bg-slate-50 flex justify-end border-t border-slate-200">
                  <button onClick={enviarParaExpedicao} disabled={itensRemessa.length === 0 || isLoading} className="w-full md:w-auto px-10 py-4 bg-indigo-600 text-white font-black rounded-xl shadow-xl hover:bg-indigo-700 transition-all uppercase tracking-wider flex justify-center items-center text-sm shadow-indigo-200 disabled:opacity-50"><ArrowRight className="w-5 h-5 mr-3" /> Validar & Enviar p/ Expedição</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. ABA HISTÓRICO PCP */}
        {abaAtiva === 'HISTORICO_PCP' && (
           <div className="max-w-7xl mx-auto w-full animate-in fade-in pb-10">
              <div className="flex flex-col md:flex-row justify-between md:items-end mb-6 gap-4">
                <div><h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase leading-none">Histórico de Envios (PCP)</h2><p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">Metodologia de Filtro e Ordenação Excel</p></div>
                <button onClick={() => setFiltrosHistorico({projeto:'', pa:'', cliente:'', status:''})} className="bg-white border border-slate-200 text-slate-500 text-[10px] font-black uppercase px-4 py-2.5 rounded-xl hover:text-red-500 transition-all flex items-center shadow-sm w-fit"><XCircle className="w-4 h-4 mr-2"/> Limpar Filtros</button>
              </div>
              <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                 <div className="overflow-x-auto"><table className="w-full text-left text-xs whitespace-nowrap"><thead className="bg-slate-50 border-b border-slate-200">
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer">
                      <th className="p-5 pl-8 text-center" onClick={() => handleSort(sortHistorico, setSortHistorico, 'data_criacao')}>Lançamento {renderSortIcon(sortHistorico, 'data_criacao')}</th>
                      <th className="p-5" onClick={() => handleSort(sortHistorico, setSortHistorico, 'projeto')}>BR (Projeto) {renderSortIcon(sortHistorico, 'projeto')}</th>
                      <th className="p-5" onClick={() => handleSort(sortHistorico, setSortHistorico, 'cliente')}>Cliente Final {renderSortIcon(sortHistorico, 'cliente')}</th>
                      <th className="p-5" onClick={() => handleSort(sortHistorico, setSortHistorico, 'produto_acabado')}>Produto PA {renderSortIcon(sortHistorico, 'produto_acabado')}</th>
                      <th className="p-5 text-center pr-8" onClick={() => handleSort(sortHistorico, setSortHistorico, 'status')}>Situação {renderSortIcon(sortHistorico, 'status')}</th>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <th className="px-5 py-2"></th>
                      <th className="px-5 py-2">
                        <input list="dl-h-proj" className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 font-bold text-slate-700 outline-none focus:border-indigo-400 shadow-sm" placeholder="Procurar..." value={filtrosHistorico.projeto} onChange={e => setFiltrosHistorico({...filtrosHistorico, projeto: e.target.value})} />
                        <datalist id="dl-h-proj">{optionsH.projeto.map(o => <option key={o} value={o} />)}</datalist>
                      </th>
                      <th className="px-5 py-2">
                        <input list="dl-h-cli" className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 font-bold text-slate-700 outline-none focus:border-indigo-400 shadow-sm" placeholder="Procurar..." value={filtrosHistorico.cliente} onChange={e => setFiltrosHistorico({...filtrosHistorico, cliente: e.target.value})} />
                        <datalist id="dl-h-cli">{optionsH.cliente.map(o => <option key={o} value={o} />)}</datalist>
                      </th>
                      <th className="px-5 py-2">
                        <input list="dl-h-pa" className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 font-bold text-slate-700 outline-none focus:border-indigo-400 shadow-sm" placeholder="Procurar..." value={filtrosHistorico.pa} onChange={e => setFiltrosHistorico({...filtrosHistorico, pa: e.target.value})} />
                        <datalist id="dl-h-pa">{optionsH.pa.map(o => <option key={o} value={o} />)}</datalist>
                      </th>
                      <th className="px-5 py-2 pr-8 text-center"><select className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 font-bold text-slate-700 shadow-sm outline-none cursor-pointer" value={filtrosHistorico.status} onChange={e => setFiltrosHistorico({...filtrosHistorico, status: e.target.value})}><option value="">Todos</option><option value="PENDENTE_EXPEDICAO">Solicitado</option><option value="ENVIADO">Enviado</option><option value="RETORNADO">Concluído</option></select></th>
                    </tr>
                 </thead><tbody className="divide-y divide-slate-100">
                    {historicoFiltrado.map(r => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors border-b border-slate-50/50">
                        <td className="p-5 pl-8 font-bold text-slate-500 text-center">{r.data_criacao ? s(new Date(r.data_criacao).toLocaleDateString()) : '---'}</td>
                        <td className="p-5 font-black text-amber-600 uppercase tracking-tighter text-sm">{s(r.projeto)}</td>
                        <td className="p-5 font-bold text-slate-700 uppercase">{s(r.cliente || 'Interno')}</td>
                        <td className="p-5 font-black text-slate-900 uppercase tracking-tighter text-sm">{s(r.produto_acabado)}</td>
                        <td className="p-5 text-center pr-8">
                           {r.status === 'PENDENTE_EXPEDICAO' && <span className="bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full text-[9px] font-black uppercase shadow-sm">Solicitado</span>}
                           {['ENVIADO', 'RETORNO_PARCIAL'].includes(r.status) && <span className="bg-amber-100 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-full text-[9px] font-black uppercase shadow-sm">Enviado</span>}
                           {r.status === 'RETORNADO' && <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full text-[9px] font-black uppercase shadow-sm">Concluído</span>}
                        </td>
                      </tr>
                    ))}
                    {historicoFiltrado.length === 0 && <tr><td colSpan="5" className="p-20 text-center text-slate-400 font-black uppercase text-lg tracking-widest opacity-50">Nenhum registo no histórico</td></tr>}
                 </tbody></table></div>
              </div>
           </div>
        )}

        {/* 3. ABA CONTROLE GERAL */}
        {abaAtiva === 'CONTROLE_GERAL' && (
          <div className="max-w-7xl mx-auto space-y-6 w-full animate-in fade-in pb-10">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
              <div><h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase leading-none">Monitoramento Geral</h2><p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">Gestão de trânsito externo (Filtros Dropdown)</p></div>
              <button onClick={() => setFiltrosControle({projeto:'', pa:'', mp:'', status:''})} className="bg-white border border-slate-200 text-slate-500 text-[10px] font-black uppercase px-4 py-2.5 rounded-xl hover:text-red-500 transition-all flex items-center shadow-sm w-fit"><XCircle className="w-4 h-4 mr-2"/> Limpar Filtros</button>
            </div>
            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto"><table className="w-full text-left text-xs whitespace-nowrap"><thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest cursor-pointer">
                  <th className="p-5 pl-8 text-center" onClick={() => handleSort(sortControle, setSortControle, 'data_envio')}>Saída {renderSortIcon(sortControle, 'data_envio')}</th>
                  <th className="p-5" onClick={() => handleSort(sortControle, setSortControle, 'projeto')}>Projeto & Local/Destino {renderSortIcon(sortControle, 'projeto')}</th>
                  <th className="p-5" onClick={() => handleSort(sortControle, setSortControle, 'produto_acabado')}>PA (Alvo de Prod.) {renderSortIcon(sortControle, 'produto_acabado')}</th>
                  <th className="p-5" onClick={() => handleSort(sortControle, setSortControle, 'codigoMP')}>MP Retirada {renderSortIcon(sortControle, 'codigoMP')}</th>
                  <th className="p-5 text-right" onClick={() => handleSort(sortControle, setSortControle, 'quantidadeTotal')}>Qtd MP {renderSortIcon(sortControle, 'quantidadeTotal')}</th>
                  <th className="p-5 text-center pr-8" onClick={() => handleSort(sortControle, setSortControle, 'status')}>Status {renderSortIcon(sortControle, 'status')}</th>
                </tr>
                <tr className="bg-slate-50/50">
                  <th className="px-5 py-2"></th>
                  <th className="px-5 py-2">
                    <input list="dl-c-proj" className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 font-bold text-slate-700 outline-none focus:border-indigo-400 shadow-sm" placeholder="Procurar..." value={filtrosControle.projeto} onChange={e => setFiltrosControle({...filtrosControle, projeto: e.target.value})} />
                    <datalist id="dl-c-proj">{optionsC.projeto.map(o => <option key={o} value={o} />)}</datalist>
                  </th>
                  <th className="px-5 py-2">
                    <input list="dl-c-pa" className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 font-bold text-slate-700 outline-none focus:border-indigo-400 shadow-sm" placeholder="Procurar..." value={filtrosControle.pa} onChange={e => setFiltrosControle({...filtrosControle, pa: e.target.value})} />
                    <datalist id="dl-c-pa">{optionsC.pa.map(o => <option key={o} value={o} />)}</datalist>
                  </th>
                  <th className="px-5 py-2">
                    <input list="dl-c-mp" className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 font-bold text-slate-700 outline-none focus:border-indigo-400 shadow-sm" placeholder="Procurar..." value={filtrosControle.mp} onChange={e => setFiltrosControle({...filtrosControle, mp: e.target.value})} />
                    <datalist id="dl-c-mp">{optionsC.mp.map(o => <option key={o} value={o} />)}</datalist>
                  </th>
                  <th className="px-5 py-2"></th>
                  <th className="px-5 py-2 pr-8 text-center"><select className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 font-bold text-slate-700 shadow-sm outline-none cursor-pointer" value={filtrosControle.status} onChange={e => setFiltrosControle({...filtrosControle, status: e.target.value})}><option value="">Status</option><option value="ENVIADO">Trânsito</option><option value="RETORNO_PARCIAL">Parcial</option><option value="RETORNADO">Entregue</option></select></th>
                </tr>
              </thead><tbody className="divide-y divide-slate-100">
                {controleFiltrado.map((linha, idx) => (
                  <tr key={idx} className={`hover:bg-slate-50 transition-colors ${linha.isRateio ? 'bg-emerald-50/30' : ''}`}>
                    <td className="p-5 pl-8 font-bold text-slate-500 text-center"><Calendar className="w-3 h-3 mx-auto opacity-30 mb-1" />{linha.remessa?.data_envio ? s(new Date(linha.remessa.data_envio).toLocaleDateString()) : '---'}</td>
                    <td className="p-5 font-black text-slate-800 uppercase tracking-tighter">
                      <div className="flex flex-col gap-1.5">
                        <span className={`text-sm ${linha.isRateio ? 'text-emerald-600' : 'text-amber-600'}`}>{s(linha.remessa?.projeto)}</span>
                        <div className="flex items-center text-[9px] text-slate-600 font-bold bg-slate-100/80 border border-slate-200 px-2 py-0.5 rounded w-fit" title="Localização / Destino">
                           <MapPin className="w-3 h-3 mr-1 text-slate-400"/>
                           {linha.remessa?.status === 'RETORNADO' ? 'Estoque Interno' : s(linha.remessa?.expedicao?.destinatario || linha.remessa?.cliente || 'Em Trânsito')}
                        </div>
                        {linha.isRateio && <span className="text-[8px] font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full w-fit mt-0.5 shadow-sm border border-emerald-200"><Link2 className="w-2 h-2 mr-1"/> RATEADO DE: {s(linha.origemProjeto)}</span>}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col items-start gap-1.5">
                        <span className="font-black text-blue-600 uppercase tracking-tighter text-sm">{s(linha.remessa?.produto_acabado)}</span>
                        <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest whitespace-nowrap shadow-sm">
                           Alvo: {String(linha.remessa?.quantidade_op)} PÇS
                        </span>
                      </div>
                    </td>
                    <td className="p-5 font-black text-slate-700 uppercase tracking-tighter text-sm">{s(linha.codigoMP)}</td>
                    <td className="p-5 text-right font-black text-slate-800">
                       <span className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-sm shadow-sm">{String(linha.quantidadeTotal)} <span className="text-[10px] text-slate-400">{s(linha.um)}</span></span>
                    </td>
                    <td className="p-5 text-center pr-8">{linha.remessa?.status === 'RETORNADO' ? <span className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-[9px] font-black uppercase shadow-sm">Interno</span> : <span className="bg-amber-100 text-amber-900 px-3 py-1.5 rounded-full text-[9px] font-black uppercase shadow-sm">Externo</span>}</td>
                  </tr>
                ))}
                {controleFiltrado.length === 0 && <tr><td colSpan="6" className="p-20 text-center font-black text-slate-300 uppercase text-lg tracking-[0.2em] opacity-50">Sem registos encontrados</td></tr>}
              </tbody></table></div>
            </div>
          </div>
        )}

        {/* 4. ABA AUDITORIA BOM */}
        {abaAtiva === 'AUDITORIA' && isAdmin && (
          <div className="max-w-6xl mx-auto space-y-6 w-full animate-in fade-in pb-10">
             <div className="border-b-4 border-red-100 pb-4 flex flex-col md:flex-row justify-between md:items-end gap-4">
               <div><h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase leading-none">Auditoria de BOM</h2><p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">Divergências PCP vs BOM Original</p></div>
               <div className="flex flex-wrap gap-4">
                 <button onClick={() => setFiltrosAuditoria({projeto:'', pa:'', mp:'', status:''})} className="bg-white border border-slate-200 text-slate-500 text-[10px] font-black uppercase px-4 py-2.5 rounded-xl hover:text-red-500 flex items-center shadow-sm transition-all"><XCircle className="w-4 h-4 mr-2"/> Limpar Filtros</button>
                 <button onClick={exportAuditoria} className="bg-emerald-600 text-white text-[10px] font-black uppercase px-5 py-2.5 rounded-xl hover:bg-emerald-700 flex items-center shadow-md transition-all shadow-emerald-200"><FileSpreadsheet className="w-4 h-4 mr-2"/> Exportar Excel</button>
               </div>
             </div>
             <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto"><table className="w-full text-left text-[11px] whitespace-nowrap"><thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer">
                    <th className="p-5 pl-8 text-center" onClick={() => handleSort(sortAuditoria, setSortAuditoria, 'data')}>Lançamento {renderSortIcon(sortAuditoria, 'data')}</th>
                    <th className="p-5" onClick={() => handleSort(sortAuditoria, setSortAuditoria, 'projeto')}>Projeto & Local {renderSortIcon(sortAuditoria, 'projeto')}</th>
                    <th className="p-5" onClick={() => handleSort(sortAuditoria, setSortAuditoria, 'pa')}>PA (Alvo de Prod.) {renderSortIcon(sortAuditoria, 'pa')}</th>
                    <th className="p-5" onClick={() => handleSort(sortAuditoria, setSortAuditoria, 'codigoMP')}>Material Ausente (MP) {renderSortIcon(sortAuditoria, 'codigoMP')}</th>
                    <th className="p-5 text-center pr-8" onClick={() => handleSort(sortAuditoria, setSortAuditoria, 'resolvido')}>Status {renderSortIcon(sortAuditoria, 'resolvido')}</th>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <th className="px-5 py-2"></th>
                    <th className="px-5 py-2">
                      <input list="dl-a-proj" className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 font-bold text-slate-700 outline-none focus:border-indigo-400 shadow-sm" placeholder="Procurar..." value={filtrosAuditoria.projeto} onChange={e => setFiltrosAuditoria({...filtrosAuditoria, projeto: e.target.value})} />
                      <datalist id="dl-a-proj">{optionsC.projeto.map(o => <option key={o} value={o} />)}</datalist>
                    </th>
                    <th className="px-5 py-2">
                      <input list="dl-a-pa" className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 font-bold text-slate-700 outline-none focus:border-indigo-400 shadow-sm" placeholder="Procurar..." value={filtrosAuditoria.pa} onChange={e => setFiltrosAuditoria({...filtrosAuditoria, pa: e.target.value})} />
                      <datalist id="dl-a-pa">{optionsC.pa.map(o => <option key={o} value={o} />)}</datalist>
                    </th>
                    <th className="px-5 py-2">
                      <input list="dl-a-mp" className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 font-bold text-slate-700 outline-none focus:border-indigo-400 shadow-sm" placeholder="Procurar..." value={filtrosAuditoria.mp} onChange={e => setFiltrosAuditoria({...filtrosAuditoria, mp: e.target.value})} />
                      <datalist id="dl-a-mp">{optionsC.mp.map(o => <option key={o} value={o} />)}</datalist>
                    </th>
                    <th className="px-5 py-2 pr-8 text-center"><select className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 font-bold text-slate-700 outline-none shadow-sm cursor-pointer" value={filtrosAuditoria.status} onChange={e => setFiltrosAuditoria({...filtrosAuditoria, status: e.target.value})}><option value="">Status</option><option value="PENDENTE">Pendente</option><option value="RESOLVIDO">Regularizado</option></select></th>
                  </tr>
                </thead><tbody className="divide-y divide-slate-100">
                   {auditoriaFiltrada.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="p-5 pl-8 font-bold text-slate-500 text-center">{p.data ? s(new Date(p.data).toLocaleDateString()) : '---'}</td>
                        <td className="p-5 font-black text-amber-600 uppercase tracking-tighter">
                           <div className="flex flex-col gap-1.5">
                              <span className="text-sm">{s(p.projeto)}</span>
                              {p.cliente && <div className="flex items-center text-[9px] text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded w-fit border border-slate-200 shadow-sm"><MapPin className="w-2.5 h-2.5 mr-1"/> {s(p.cliente)}</div>}
                           </div>
                        </td>
                        <td className="p-5">
                           <div className="flex flex-col items-start gap-1.5">
                             <span className="font-black text-slate-800 uppercase tracking-tighter text-sm">{s(p.pa)}</span>
                             <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest shadow-sm">
                                Alvo: {String(p.quantidade_op || 0)} PÇS
                             </span>
                           </div>
                        </td>
                        <td className="p-5">
                           <div className="flex flex-col items-start gap-1.5">
                              <div className="flex items-center gap-2">
                                 <span className="font-black text-red-600 uppercase text-sm">{s(p.codigoMP)}</span>
                                 <span className="bg-red-50 text-red-700 font-black text-[10px] px-2 py-0.5 rounded-md border border-red-200 shadow-sm">FALTA: {String(p.quantidade)} <span className="text-[8px] opacity-70">{s(p.um)}</span></span>
                              </div>
                              <p className="text-[9px] text-slate-500 font-bold max-w-[250px] md:max-w-xs truncate" title={s(p.descricao)}>{s(p.descricao)}</p>
                           </div>
                        </td>
                        <td className="p-5 text-center pr-8">
                           {p.resolvido ? (
                              <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-[9px] font-black uppercase flex items-center justify-center w-fit mx-auto border border-emerald-200 shadow-sm"><CheckCircle className="w-3 h-3 mr-1.5"/> Resolvido</div>
                           ) : (
                              <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-[9px] font-black uppercase flex items-center justify-center w-fit mx-auto border border-red-200 shadow-sm animate-pulse"><Clock className="w-3 h-3 mr-1.5"/> Pendente</div>
                           )}
                        </td>
                      </tr>
                   ))}
                   {auditoriaFiltrada.length === 0 && <tr><td colSpan="5" className="p-24 text-center font-black text-slate-300 uppercase text-lg tracking-[0.2em] opacity-50">Nenhuma divergência encontrada</td></tr>}
                </tbody></table></div>
             </div>
          </div>
        )}

        {/* 5. FILA DE EXPEDIÇÃO */}
        {abaAtiva === 'EXPEDICAO' && (
          <div className="flex flex-col lg:flex-row gap-6 h-full animate-in fade-in pb-10">
             <div className="w-full lg:w-1/3 bg-white rounded-[2rem] border border-slate-200 flex flex-col h-[600px] lg:h-[calc(100vh-10rem)] overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-200 bg-amber-50 flex justify-between items-center"><h2 className="font-black text-amber-900 text-lg uppercase tracking-wider flex items-center"><Clock className="w-5 h-5 mr-2" /> Fila Logística ({remessasPendentes.length})</h2><button onClick={fetchAllData} className="text-amber-600 hover:rotate-180 transition-all duration-500 p-2 hover:bg-amber-100 rounded-full"><RefreshCcw className="w-4 h-4"/></button></div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                   {remessasPendentes.map(rem => (
                      <div key={rem.id} onClick={() => setRemessaSelecionada(rem)} className={`p-6 rounded-2xl border cursor-pointer transition-all ${remessaSelecionada?.id === rem.id ? 'border-amber-400 bg-amber-50 shadow-md scale-[1.02]' : 'border-slate-100 hover:border-amber-200 hover:bg-slate-50'}`}>
                         <span className="font-black text-amber-600 text-xs uppercase block mb-1 tracking-widest">BR: {s(rem.projeto)}</span>
                         <h4 className="font-black text-slate-800 text-xl md:text-2xl uppercase leading-tight tracking-tighter">{s(rem.produto_acabado)}</h4>
                         <span className="bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase mt-4 inline-block shadow-sm">{s(rem.observacao)}</span>
                      </div>
                   ))}
                   {remessasPendentes.length === 0 && <div className="p-24 text-center font-black text-slate-300 uppercase text-lg tracking-[0.2em] opacity-50">Fila Vazia</div>}
                </div>
             </div>
             <div className="flex-1 bg-white rounded-[2rem] border border-slate-200 h-auto lg:h-[calc(100vh-10rem)] shadow-sm overflow-hidden flex flex-col">
                {remessaSelecionada ? (
                  <div className="p-6 md:p-10 space-y-8 overflow-y-auto custom-scrollbar h-full animate-in slide-in-from-right-4">
                     <div className="pb-6 border-b border-slate-200 flex justify-between items-start">
                        <div>
                          <div className="bg-amber-600 text-white text-[9px] font-black px-3 py-1.5 rounded-full w-fit uppercase mb-3 tracking-widest shadow-sm">OP PROJETO: {s(remessaSelecionada.projeto)}</div>
                          <h3 className="text-3xl md:text-4xl font-black text-slate-800 uppercase leading-none tracking-tighter">{s(remessaSelecionada.produto_acabado)}</h3>
                          {remessaSelecionada.obs_expedicao && <div className="mt-6 p-5 bg-indigo-50 border-l-8 border-indigo-500 rounded-r-2xl shadow-sm"><p className="text-[10px] font-black text-indigo-700 uppercase mb-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1"/> Nota Urgente PCP:</p><p className="text-base md:text-lg font-bold text-slate-700 italic leading-snug">"{s(remessaSelecionada.obs_expedicao)}"</p></div>}
                        </div>
                        <button onClick={() => setRemessaSelecionada(null)} className="text-slate-400 hover:text-red-500 font-black text-3xl transition-all">&times;</button>
                     </div>
                     <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-1"><label className="text-[10px] font-black text-slate-500 uppercase ml-2 flex items-center"><Truck className="w-3 h-3 mr-1"/> Transporte</label><input placeholder="Rodoviário / Aéreo" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 font-black outline-none focus:border-amber-400 focus:bg-white shadow-inner transition-all" value={formExpedicao.transporte} onChange={e => setFormExpedicao({...formExpedicao, transporte: e.target.value})} /></div>
                           <div className="space-y-1"><label className="text-[10px] font-black text-slate-500 uppercase ml-2 flex items-center"><PackageOpen className="w-3 h-3 mr-1"/> Transportadora</label><input placeholder="Nome Empresa" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 font-black outline-none focus:border-amber-400 focus:bg-white shadow-inner transition-all" value={formExpedicao.transportadora} onChange={e => setFormExpedicao({...formExpedicao, transportadora: e.target.value})} /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           <div className="space-y-1"><label className="text-[10px] font-black text-slate-500 uppercase ml-2 flex items-center"><Boxes className="w-3 h-3 mr-1"/> Volumes</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 font-black outline-none focus:border-amber-400 focus:bg-white shadow-inner transition-all" value={formExpedicao.quantidade} onChange={e => setFormExpedicao({...formExpedicao, quantidade: e.target.value})} /></div>
                           <div className="space-y-1"><label className="text-[10px] font-black text-slate-500 uppercase ml-2 flex items-center"><Weight className="w-3 h-3 mr-1"/> Peso Total</label><input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 font-black outline-none focus:border-amber-400 focus:bg-white shadow-inner transition-all" value={formExpedicao.pesoTotal} onChange={e => setFormExpedicao({...formExpedicao, pesoTotal: e.target.value})} /></div>
                           <div className="space-y-1"><label className="text-[10px] font-black text-slate-500 uppercase ml-2 flex items-center"><Calendar className="w-3 h-3 mr-1"/> Data Saída</label><input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 font-black outline-none focus:border-amber-400 focus:bg-white shadow-inner transition-all" value={formExpedicao.dataSaida} onChange={e => setFormExpedicao({...formExpedicao, dataSaida: e.target.value})} /></div>
                        </div>
                        <div className="space-y-1"><label className="text-[10px] font-black text-amber-600 uppercase ml-2 flex items-center"><MapPin className="w-3 h-3 mr-1"/> Destinatário Final</label><input placeholder="Destino" className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-4 font-black outline-none focus:border-amber-500 shadow-sm transition-all" value={formExpedicao.destinatario} onChange={e => setFormExpedicao({...formExpedicao, destinatario: e.target.value})} /></div>
                     </div>
                     <button onClick={concluirExpedicao} className="w-full bg-slate-900 text-white font-black py-5 md:py-6 rounded-2xl md:rounded-[2rem] shadow-xl hover:bg-black transition-all text-sm md:text-base flex items-center justify-center gap-4 hover:-translate-y-1 shadow-indigo-100 mt-8"><FileSpreadsheet className="w-6 h-6 md:w-7 md:h-7" /> Gerar Planilha SGQ & Finalizar</button>
                  </div>
                ) : ( <div className="h-full flex items-center justify-center font-black text-slate-200 uppercase tracking-[0.3em] flex-col p-10 text-center"><Truck className="w-32 h-32 mb-8 opacity-20"/><p className="text-xl md:text-2xl px-10">Aguardando Seleção de Remessa</p></div> )}
             </div>
          </div>
        )}

        {/* 6. RETORNO DE PEÇAS / FORNECEDORES */}
        {abaAtiva === 'FORNECEDORES' && (
           <div className="max-w-5xl mx-auto space-y-6 w-full animate-in fade-in pb-10">
              <div className="flex flex-col md:flex-row justify-between md:items-end mb-6 gap-4">
                <div><h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase leading-none">Gestão de Retornos</h2><p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">Dê entrada em materiais vindos de prestadores externos</p></div>
                <div className="relative w-full md:w-72">
                   <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
                   <input placeholder="Filtrar por Projeto BR..." className="w-full bg-white border border-slate-200 shadow-sm rounded-2xl pl-12 pr-4 py-3 font-black text-sm outline-none focus:border-amber-400 transition-all" value={buscaFornecedor} onChange={e => setBuscaFornecedor(e.target.value)} />
                </div>
              </div>
              <div className="space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2 custom-scrollbar">
                 {remessasFora.filter(r => !buscaFornecedor || s(r.projeto).toUpperCase().includes(buscaFornecedor.toUpperCase())).map(rem => (
                    <div key={rem.id} className={`p-6 md:p-8 rounded-[2rem] border bg-white flex flex-col md:flex-row justify-between md:items-center gap-6 transition-all ${rem.status === 'RETORNADO' ? 'opacity-50 grayscale shadow-none border-slate-200' : 'shadow-md border-slate-200 hover:border-amber-200'}`}>
                       <div className="space-y-2">
                          <span className="bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest shadow-sm">CLIENTE: {s(rem.cliente || 'Interno')}</span>
                          <h4 className="font-black text-xl md:text-2xl text-slate-800 uppercase tracking-tight">{s(rem.projeto)} • <span className="text-indigo-600 font-black">{s(rem.observacao || 'Industrialização')}</span></h4>
                          <div className="flex flex-wrap gap-4 md:gap-8 mt-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <div className="flex flex-col"><span className="text-[10px] font-black text-slate-400 uppercase">Enviado</span><span className="font-black text-slate-700 text-lg">{String(rem.quantidade_op)} Pçs</span></div>
                            <div className="w-px bg-slate-200 hidden md:block"></div>
                            <div className="flex flex-col"><span className="text-[10px] font-black text-indigo-500 uppercase">Recebido</span><span className="font-black text-indigo-600 text-lg">{String(rem.pecas_recebidas || 0)} Pçs</span></div>
                            <div className="w-px bg-slate-200 hidden md:block"></div>
                            <div className="flex flex-col"><span className="text-[10px] font-black text-amber-500 uppercase">Saldo Rua</span><span className="font-black text-amber-600 text-lg">{Number(rem.quantidade_op) - Number(rem.pecas_recebidas || 0)} Pçs</span></div>
                          </div>
                       </div>
                       {rem.status !== 'RETORNADO' ? (
                          <button onClick={() => { setRemessaParaRetorno(rem); setQtdPecasRetornando(''); }} className="bg-amber-600 text-white px-8 py-5 rounded-2xl font-black uppercase text-xs shadow-xl shadow-amber-200 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center w-full md:w-auto">Confirmar Entrada <ArrowLeftRight className="w-4 h-4 ml-3"/></button>
                       ) : ( <div className="text-emerald-600 font-black flex items-center justify-center uppercase text-[10px] tracking-widest bg-emerald-50 px-8 py-5 rounded-2xl border border-emerald-200 shadow-sm w-full md:w-auto"><CheckCircle className="w-5 h-5 mr-2" /> OP Finalizada</div> )}
                    </div>
                 ))}
                 {remessasFora.length === 0 && <div className="p-24 text-center font-black text-slate-300 uppercase text-lg tracking-[0.2em] opacity-50 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">Sem remessas externas</div>}
              </div>
           </div>
        )}

        {/* 7. UPLOAD ESTOQUE */}
        {abaAtiva === 'UPLOAD_ESTOQUE' && (
          <div className="max-w-3xl mx-auto space-y-6 text-center w-full animate-in fade-in slide-in-from-bottom-4 pb-10">
            <h2 className="text-4xl font-black text-slate-800 tracking-tighter uppercase leading-none">Sincronização ERP</h2>
            <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-slate-200 shadow-xl flex flex-col items-center">
              <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center mb-8 shadow-inner border border-emerald-100"><UploadCloud className="w-16 h-16 text-emerald-500" /></div>
              <h3 className="text-2xl font-black text-slate-800 mb-4 uppercase tracking-tighter">Injetar Planilha Mestre</h3>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mb-10 max-w-sm leading-relaxed text-center">Atualize Produtos e Stock Físico com suporte a vírgulas e decimais através da exportação padrão do sistema.</p>
              
              <label className={`inline-flex items-center justify-center px-8 md:px-16 py-6 md:py-8 rounded-[2rem] font-black text-sm md:text-xl transition-all cursor-pointer shadow-2xl w-full md:w-auto ${isLoading ? 'bg-slate-100 text-slate-400 shadow-none cursor-default border border-slate-200' : 'bg-emerald-500 text-white hover:bg-emerald-600 hover:-translate-y-2 active:scale-95 shadow-emerald-200'}`}>
                {isLoading ? <><Loader2 className="w-6 h-6 md:w-8 md:h-8 mr-3 animate-spin" /> SINCRONIZANDO ({uploadProgress}%)</> : <><Database className="w-6 h-6 md:w-8 md:h-8 mr-3" /> INICIAR SINCRONIZAÇÃO</>}
                <input type="file" accept=".xlsx" className="hidden" disabled={isLoading} onChange={async (e) => {
                   const file = e.target.files[0]; if(!file || !window.XLSX) return;
                   setIsLoading(true); setUploadProgress(5);
                   const reader = new FileReader();
                   reader.onload = async (evt) => {
                      try {
                        const wb = window.XLSX.read(evt.target.result, { type: 'array' });
                        const json = window.XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
                        const pMap = {}; const eMap = {};
                        json.forEach(row => {
                           const nRow = {}; Object.keys(row).forEach(k => nRow[normalizeKey(k)] = row[k]);
                           const pa = s(nRow['COD_PROD_ACABADO'] || nRow['COD_ACABADO'] || nRow['PRODUTO'] || nRow['PA'] || '').trim();
                           const mp = s(nRow['MATERIA_PRIMA'] || nRow['CODIGO_MP'] || nRow['MATERIAL'] || nRow['MP'] || '').trim();
                           if(!pa || !mp) return;
                           if(!pMap[pa]) pMap[pa] = { codigo_pa: pa, descricao: s(nRow['DESCRICAO_PRODUTO_ACABADO'] || nRow['DESCRICAO_PA'] || nRow['DESCRICAO'] || 'PA'), materiais: [] };
                           pMap[pa].materiais.push({ codigoMP: mp, quantidade: parseNumBR(nRow['QUANTIDADE'] || nRow['QTD']), um: s(nRow['UNIDADE'] || nRow['UN'] || 'UN') });
                           if(!eMap[mp]) eMap[mp] = { codigo_mp: mp, descricao: s(nRow['DESCRICAO_MATERIA_PRIMA'] || nRow['DESCRICAO_MP'] || nRow['DESCRICAO_MATERIAL'] || 'MP'), saldo_disponivel: parseNumBR(nRow['DISPONIVEL_PARA_PRODUCAO'] || nRow['SALDO_FISICO'] || nRow['DISPONIVEL'] || nRow['SALDO']), unidade: s(nRow['UNIDADE'] || nRow['UN'] || 'UN') };
                        });
                        const listProd = Object.values(pMap); const listStock = Object.values(eMap);
                        if(listProd.length === 0) throw new Error("Ficheiro inválido ou colunas não reconhecidas.");
                        setUploadProgress(40);
                        for (let i = 0; i < listProd.length; i += 100) await supabase.from('produtos').upsert(listProd.slice(i, i + 100), { onConflict: 'codigo_pa' });
                        setUploadProgress(70);
                        for (let i = 0; i < listStock.length; i += 100) await supabase.from('estoque_mp').upsert(listStock.slice(i, i + 100), { onConflict: 'codigo_mp' });
                        setUploadProgress(100); setSucesso("Banco de Dados e Stock Físico Sincronizados com Sucesso!");
                      } catch(err) { setErro("Erro na leitura do Arquivo: " + err.message); }
                      finally { setIsLoading(false); setUploadProgress(0); fetchAllData(); }
                   };
                   reader.readAsArrayBuffer(file);
                }} />
              </label>
            </div>
          </div>
        )}

        {/* 8. GESTÃO DE ACESSOS */}
        {abaAtiva === 'GESTAO_USUARIOS' && isAdmin && (
           <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in pb-10">
              <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Administração de Acessos</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
                   <h3 className="font-black text-slate-800 flex items-center text-lg mb-6 pb-4 border-b border-slate-100">{isEditingUser ? <Settings className="w-6 h-6 mr-3 text-indigo-600" /> : <UserPlus className="w-6 h-6 mr-3 text-indigo-600" />} {isEditingUser ? 'Editar Acesso' : 'Novo Funcionário'}</h3>
                   <form onSubmit={salvarUsuario} className="space-y-4">
                      <div><label className="text-[10px] font-black text-slate-500 uppercase ml-2 mb-1 block">Nome Completo</label><input required placeholder="Colaborador" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:border-indigo-400 shadow-inner transition-all" value={novoUsuario.nome} onChange={e => setNovoUsuario({...novoUsuario, nome: e.target.value})} /></div>
                      <div><label className="text-[10px] font-black text-slate-500 uppercase ml-2 mb-1 block">E-mail Profissional</label><input required type="email" placeholder="usuario@kalenborn.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none disabled:opacity-50 focus:border-indigo-400 shadow-inner transition-all" value={novoUsuario.email} disabled={isEditingUser} onChange={e => setNovoUsuario({...novoUsuario, email: e.target.value})} /></div>
                      <div><label className="text-[10px] font-black text-slate-500 uppercase ml-2 mb-1 block">Senha Temporária</label><input required placeholder="***" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:border-indigo-400 shadow-inner transition-all" value={novoUsuario.senha} onChange={e => setNovoUsuario({...novoUsuario, senha: e.target.value})} /></div>
                      <div><label className="text-[10px] font-black text-slate-500 uppercase ml-2 mb-1 block">Nível de Permissão</label>
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-black text-slate-700 outline-none focus:border-indigo-400 shadow-sm cursor-pointer" value={novoUsuario.perfil} onChange={e => setNovoUsuario({...novoUsuario, perfil: e.target.value})}>
                        <option value="PCP">PCP (Produção e Requisições)</option><option value="EXPEDICAO">EXPEDIÇÃO (Logística e Entradas)</option><option value="ADMIN">ADMINISTRADOR (Acesso Total)</option>
                      </select></div>
                      <button type="submit" className={`w-full text-white font-black py-4 rounded-xl shadow-xl shadow-indigo-200 bg-indigo-600 uppercase tracking-widest text-xs mt-6 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex justify-center items-center`}><CheckCircle className="w-4 h-4 mr-2"/> Gravar Credenciais</button>
                   </form>
                </div>
                <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                   <div className="p-6 md:p-8 bg-slate-50 border-b border-slate-200 flex items-center justify-between font-black text-slate-800 uppercase tracking-widest text-sm">Utilizadores Ativos ({usuariosDb.length})</div>
                   <div className="overflow-x-auto"><table className="w-full text-left text-xs whitespace-nowrap"><tbody className="divide-y divide-slate-100">
                      {usuariosDb.map(u => (
                        <tr key={u.email} className="hover:bg-slate-50 transition-colors">
                           <td className="p-5 pl-8"><div className="flex items-center"><div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black mr-4 uppercase border border-indigo-200">{s(u.nome).charAt(0)}</div><div><p className="font-black text-slate-800 text-sm">{s(u.nome)}</p><p className="text-[10px] text-slate-500 font-bold mt-0.5">{s(u.email)}</p></div></div></td>
                           <td className="p-5"><span className={`px-4 py-1.5 rounded-md font-black text-[9px] uppercase shadow-sm border ${u.perfil === 'ADMIN' ? 'bg-red-50 text-red-600 border-red-200' : u.perfil === 'EXPEDICAO' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-indigo-50 text-indigo-600 border-indigo-200'}`}>{s(u.perfil)}</span></td>
                           <td className="p-5 text-center pr-8">
                              <div className="flex items-center justify-end gap-2">
                                 <button onClick={() => { setNovoUsuario(u); setIsEditingUser(true); }} className="p-2.5 text-indigo-500 hover:bg-indigo-100 rounded-lg transition-all" title="Editar Permissões"><Settings className="w-4 h-4"/></button>
                                 <button onClick={() => excluirUsuario(u.email)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Revogar Acesso"><Trash2 className="w-4 h-4"/></button>
                              </div>
                           </td>
                        </tr>
                      ))}
                      {usuariosDb.length === 0 && <tr><td colSpan="3" className="p-16 text-center text-slate-400 font-black uppercase text-sm tracking-widest opacity-50">Nenhum registro encontrado</td></tr>}
                   </tbody></table></div>
                </div>
              </div>
           </div>
        )}

        {/* MODAL DE ENTRADA (RETORNO LOGÍSTICA) */}
        {remessaParaRetorno && (
           <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
              <div className="bg-white rounded-[2.5rem] w-full max-w-4xl shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[90vh]">
                 <div className="p-8 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Entrada de Peças: {s(remessaParaRetorno.projeto)}</h2>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{s(remessaParaRetorno.observacao)} • {s(remessaParaRetorno.produto_acabado)}</p>
                    </div>
                    <button onClick={() => setRemessaParaRetorno(null)} className="text-slate-400 text-3xl font-black hover:text-red-500 transition-all">&times;</button>
                 </div>
                 <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10 overflow-y-auto custom-scrollbar">
                    <div className="space-y-6">
                       <div className="bg-indigo-50 border border-indigo-200 rounded-3xl p-8 md:p-10 shadow-inner text-center">
                          <label className="text-[11px] font-black text-indigo-900 uppercase block mb-6 tracking-widest">Qtd de peças (PA) a receber agora:</label>
                          <input type="text" className="w-full bg-white border-2 border-indigo-200 rounded-3xl px-6 py-8 font-black text-6xl md:text-7xl text-indigo-700 text-center outline-none focus:ring-4 focus:ring-indigo-100 transition-all shadow-md" value={qtdPecasRetornando} onChange={e => {
                             setQtdPecasRetornando(e.target.value);
                          }} placeholder="0" />
                          <div className="mt-8 flex justify-center gap-10 bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm">
                            <div className="text-center"><p className="text-[10px] font-black text-slate-400 uppercase">Enviado Original</p><p className="text-xl font-black text-slate-700">{String(remessaParaRetorno.quantidade_op)} Pçs</p></div>
                            <div className="w-px bg-slate-200"></div>
                            <div className="text-center"><p className="text-[10px] font-black text-amber-500 uppercase">Saldo Pendente</p><p className="text-xl font-black text-amber-600">{Number(remessaParaRetorno.quantidade_op) - Number(remessaParaRetorno.pecas_recebidas || 0)} Pçs</p></div>
                          </div>
                       </div>
                    </div>
                    <div className="border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col bg-white">
                      <div className="p-6 bg-slate-50 border-b border-slate-200 font-black text-[10px] text-slate-500 uppercase tracking-widest flex items-center justify-between"><span>Crédito de Stock (Matéria-Prima)</span><Calculator className="w-5 h-5 text-slate-300"/></div>
                      <div className="overflow-auto"><table className="w-full text-left text-[11px] whitespace-nowrap"><thead className="bg-slate-100 border-b border-slate-200"><tr><th className="p-5 pl-6">Material MP</th><th className="p-5 text-center pr-6">Entrada no Estoque</th></tr></thead><tbody className="divide-y divide-slate-100">
                        {(Array.isArray(remessaParaRetorno.itens) ? remessaParaRetorno.itens : []).map((it, idx) => {
                          const valDigitado = parseNumBR(qtdPecasRetornando);
                          const ratio = valDigitado / Number(remessaParaRetorno.quantidade_op);
                          const calc = Number((it.quantidadeTotal * ratio).toFixed(4));
                          return (<tr key={idx} className="hover:bg-slate-50 transition-colors"><td className="p-5 pl-6 font-bold uppercase text-slate-700 text-xs">{s(it.codigoMP)}</td><td className="p-5 text-center pr-6 font-black text-emerald-600 text-sm bg-emerald-50/30">+{calc} {s(it.um)}</td></tr>);
                        })}
                     </tbody></table></div></div>
                 </div>
                 <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-200 flex justify-end gap-6 items-center">
                    <button onClick={processarRetornoParcial} disabled={!qtdPecasRetornando || isLoading} className="w-full md:w-auto bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black uppercase text-sm shadow-xl disabled:opacity-50 transition-all hover:bg-indigo-700 hover:-translate-y-1 shadow-indigo-200 flex justify-center items-center gap-3"><ArrowLeftRight className="w-5 h-5"/> Confirmar Recebimento</button>
                 </div>
              </div>
           </div>
        )}

        {/* MODAL DE RATEIO GLOBAL (PCP) */}
        {modalRateioAberto && idxItemRateio !== null && (
           <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[150] flex items-center justify-center p-4">
              <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col">
                 <div className="p-8 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <div><span className="bg-indigo-600 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase shadow-sm">Rateio Adicional Físico</span><h2 className="text-3xl font-black text-slate-800 mt-3 uppercase tracking-tighter">MP: {s(itensRemessa[idxItemRateio]?.codigoMP)}</h2></div>
                    <button onClick={() => setModalRateioAberto(false)} className="text-slate-400 font-black text-3xl hover:text-red-500 transition-all">&times;</button>
                 </div>
                 <div className="p-8 bg-white space-y-8">
                    <div className="flex flex-col sm:flex-row gap-4 sm:items-end p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                       <div className="flex-1"><label className="text-[10px] font-black text-slate-500 uppercase ml-1 mb-1 block">Projeto Destino</label><input placeholder="BR-..." className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 font-black text-slate-800 outline-none focus:border-indigo-400 shadow-sm transition-all uppercase" value={novoRateio.projeto} onChange={e => setNovoRateio({...novoRateio, projeto: e.target.value.toUpperCase()})} /></div>
                       <div className="flex-1"><label className="text-[10px] font-black text-slate-500 uppercase ml-1 mb-1 block">PA Destino</label><input placeholder="PA-..." className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 font-black text-slate-800 outline-none focus:border-indigo-400 shadow-sm transition-all uppercase" value={novoRateio.codigoPA} onChange={e => setNovoRateio({...novoRateio, codigoPA: e.target.value.toUpperCase()})} /></div>
                       <div className="w-full sm:w-28"><label className="text-[10px] font-black text-slate-500 uppercase ml-1 mb-1 block">Qtd</label><input type="number" step="0.0001" className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 font-black text-slate-800 outline-none focus:border-indigo-400 shadow-sm transition-all" value={novoRateio.quantidade} onChange={e => setNovoRateio({...novoRateio, quantidade: e.target.value})} /></div>
                       <button onClick={() => {
                          if(!novoRateio.projeto || !novoRateio.codigoPA || !novoRateio.quantidade) return;
                          const n = [...itensRemessa]; if(!n[idxItemRateio].rateiosExtras) n[idxItemRateio].rateiosExtras = [];
                          n[idxItemRateio].rateiosExtras.push({ projeto: novoRateio.projeto, codigoPA: novoRateio.codigoPA, quantidade: Number(novoRateio.quantidade) });
                          n[idxItemRateio].quantidadeTotal = n[idxItemRateio].quantidadeOriginal + n[idxItemRateio].rateiosExtras.reduce((acc, c) => acc + c.quantidade, 0);
                          setItensRemessa(n); setNovoRateio({ projeto: '', codigoPA: '', quantidade: '' });
                       }} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black uppercase text-xs hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all w-full sm:w-auto mt-4 sm:mt-0 h-[46px] flex items-center justify-center">Add</button>
                    </div>
                    <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm"><table className="w-full text-left text-xs whitespace-nowrap"><thead className="bg-slate-50 border-b border-slate-200"><tr><th className="p-4 pl-6 text-slate-500 uppercase tracking-widest text-[9px] font-black">Destino Lógico</th><th className="p-4 text-slate-500 uppercase tracking-widest text-[9px] font-black">PA Vinculado</th><th className="p-4 text-center text-slate-500 uppercase tracking-widest text-[9px] font-black">Qtd</th><th className="p-4 text-center pr-6 text-slate-500 uppercase tracking-widest text-[9px] font-black">Ação</th></tr></thead><tbody className="divide-y divide-slate-100">
                       <tr className="bg-indigo-50/80 text-indigo-900 font-bold"><td className="p-4 pl-6 flex items-center"><Layers className="w-3.5 h-3.5 mr-2 text-indigo-400"/> {s(projeto || 'Ficha Padrão')}</td><td className="p-4">{s(produtoEncontrado?.codigo_pa)}</td><td className="p-4 text-center text-sm">{String(itensRemessa[idxItemRateio]?.quantidadeOriginal)}</td><td className="p-4 text-center pr-6"><Lock className="w-4 h-4 mx-auto text-indigo-300" /></td></tr>
                       {(itensRemessa[idxItemRateio]?.rateiosExtras || []).map((r, ri) => (
                          <tr key={ri} className="bg-white hover:bg-slate-50 transition-colors">
                            <td className="p-4 pl-6 font-black text-slate-700 flex items-center"><Link2 className="w-3.5 h-3.5 mr-2 text-emerald-500"/> {s(r.projeto)}</td><td className="p-4 font-black text-slate-700">{s(r.codigoPA)}</td><td className="p-4 text-center font-black text-emerald-600 text-sm">+{String(r.quantidade)}</td>
                            <td className="p-4 text-center pr-6"><button onClick={() => { const n = [...itensRemessa]; n[idxItemRateio].rateiosExtras.splice(ri, 1); n[idxItemRateio].quantidadeTotal = n[idxItemRateio].quantidadeOriginal + n[idxItemRateio].rateiosExtras.reduce((acc, c) => acc + c.quantidade, 0); setItensRemessa(n); }} className="text-slate-300 hover:text-red-600 transition-all p-2 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 mx-auto"/></button></td>
                          </tr>
                       ))}
                       {(!itensRemessa[idxItemRateio]?.rateiosExtras || itensRemessa[idxItemRateio]?.rateiosExtras.length === 0) && <tr><td colSpan="4" className="p-8 text-center text-slate-400 font-black uppercase text-xs tracking-widest opacity-60">Sem rateios extras</td></tr>}
                    </tbody></table></div>
                 </div>
                 <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-200 flex justify-between items-center"><span className="font-black text-slate-500 uppercase text-xs tracking-widest flex items-center">Total Físico (SGQ): <span className="text-indigo-600 text-3xl ml-4 bg-white border border-slate-200 px-4 py-1 rounded-xl shadow-sm">{String(itensRemessa[idxItemRateio]?.quantidadeTotal)}</span></span><button onClick={() => setModalRateioAberto(false)} className="bg-slate-900 text-white px-8 py-4 rounded-xl font-black uppercase text-xs hover:bg-black shadow-xl transition-all shadow-slate-300 flex items-center gap-2"><CheckCircle className="w-4 h-4"/> Aplicar Rateio</button></div>
              </div>
           </div>
        )}

        {/* Modal Salvar Relatório IA */}
        {modalSalvarRelatorio && (
           <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
              <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col border border-slate-200">
                 <div className="p-8 border-b bg-slate-50 flex justify-between items-center">
                    <div>
                      <span className="bg-indigo-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Acervo Corporativo</span>
                      <h2 className="text-2xl font-black text-slate-800 mt-2 tracking-tighter uppercase">Salvar Relatório</h2>
                    </div>
                    <button onClick={() => setModalSalvarRelatorio(false)} className="text-slate-400 font-black text-2xl hover:text-red-500 transition-all">&times;</button>
                 </div>
                 <form onSubmit={salvarRelatorioIA} className="p-8 space-y-6">
                    <div>
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 mb-2 block">Título do Relatório</label>
                       <input autoFocus required placeholder="Ex: Análise de Materiais Ociosos - Maio/26" className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-5 font-black text-slate-800 outline-none focus:border-indigo-500 transition-all shadow-inner" value={nomeNovoRelatorio} onChange={e => setNomeNovoRelatorio(e.target.value)} />
                    </div>
                    <div className="flex gap-4">
                       <button type="button" onClick={() => setModalSalvarRelatorio(false)} className="flex-1 bg-slate-100 text-slate-600 px-6 py-4 rounded-xl font-black uppercase text-xs hover:bg-slate-200 transition-all">Cancelar</button>
                       <button type="submit" disabled={isLoading} className="flex-1 bg-indigo-600 text-white px-6 py-4 rounded-xl font-black uppercase text-xs hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all flex items-center justify-center">
                          {isLoading ? <Loader2 className="w-5 h-5 animate-spin"/> : 'Arquivar Documento'}
                       </button>
                    </div>
                 </form>
              </div>
           </div>
        )}

        {/* Modal Raio-X Detalhado */}
        {projetoDetalheSelecionado && (
           <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-[110] flex items-center justify-center p-4 print:hidden">
              <div className="bg-white rounded-[2.5rem] w-full max-w-6xl shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col h-[95vh] md:h-[90vh]">
                 <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
                    <div>
                       <div className="flex items-center gap-3 mb-2">
                          <span className="bg-indigo-600 text-white text-[9px] md:text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">Análise de Demanda</span>
                          <span className={`text-[9px] md:text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border ${projetoDetalheSelecionado.status === 'RETORNADO' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>{projetoDetalheSelecionado.status === 'RETORNADO' ? 'Carga Entregue' : 'Em Andamento Físico'}</span>
                       </div>
                       <h2 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tighter mt-2">{s(projetoDetalheSelecionado.projeto)} <span className="text-slate-300 mx-2">•</span> {s(projetoDetalheSelecionado.produto_acabado)}</h2>
                       <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2">{s(projetoDetalheSelecionado.descricao_produto)}</p>
                    </div>
                    <button onClick={() => { setProjetoDetalheSelecionado(null); setBuscaDetalheProjeto(''); }} className="bg-white border-2 border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 p-3 rounded-2xl transition-all shadow-sm"><XCircle className="w-8 h-8"/></button>
                 </div>

                 <div className="flex-1 overflow-hidden flex flex-col bg-white">
                    <div className="p-6 md:p-8 bg-white border-b border-slate-100 flex gap-4 shrink-0 shadow-sm z-10 relative">
                       <div className="relative flex-1">
                          <Search className="w-6 h-6 absolute left-5 top-4 text-indigo-400" />
                          <input placeholder="Pesquisar MP, Cód ou Descrição em toda a árvore desta remessa..." className="w-full bg-indigo-50/30 border-2 border-indigo-100 rounded-2xl pl-14 pr-6 py-4 font-black text-sm md:text-base outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800 shadow-inner" value={buscaDetalheProjeto} onChange={e => setBuscaDetalheProjeto(e.target.value)} />
                       </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 md:p-10 bg-slate-50/50 custom-scrollbar space-y-10">
                       <div>
                          <h4 className="font-black text-slate-800 uppercase tracking-tight flex items-center mb-6 text-xl"><Network className="w-6 h-6 mr-3 text-indigo-500"/> Estrutura Física de Envios</h4>
                          <div className="space-y-4 pl-2 border-l-4 border-indigo-200 ml-4">
                             <div className="relative pl-8">
                                <div className="absolute -left-[26px] top-1/2 -translate-y-1/2 w-4 h-4 bg-indigo-600 rounded-full border-4 border-indigo-100 shadow-[0_0_10px_rgba(79,70,229,0.5)]"></div>
                                <div className="bg-white border border-slate-200 p-5 md:p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                                   <div>
                                      <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2 bg-slate-100 px-3 py-1 rounded-md w-fit">OP Principal / Árvore Raiz</p>
                                      <p className="font-black text-indigo-900 text-xl md:text-2xl">{String(projetoDetalheSelecionado.quantidade_op)} PÇS <span className="text-sm md:text-base text-slate-500 font-bold ml-3 hidden md:inline">Enviadas em {new Date(projetoDetalheSelecionado.data_criacao).toLocaleDateString()}</span></p>
                                      <p className="text-xs text-slate-500 font-bold mt-2 md:hidden">Data: {new Date(projetoDetalheSelecionado.data_criacao).toLocaleDateString()}</p>
                                   </div>
                                </div>
                             </div>
                             {projetoDetalheSelecionado.filhos.map((f, i) => (
                                <div key={f.id} className="relative pl-8">
                                   <div className="absolute -left-[26px] top-1/2 -translate-y-1/2 w-4 h-4 bg-amber-400 rounded-full border-4 border-amber-100 shadow-[0_0_10px_rgba(251,191,36,0.5)]"></div>
                                   <div className="bg-white border border-slate-200 p-5 md:p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                                      <div>
                                         <p className="text-[10px] md:text-xs font-black text-amber-600 uppercase tracking-widest mb-2 flex items-center bg-amber-50 px-3 py-1 rounded-md w-fit"><CornerDownRight className="w-4 h-4 mr-2"/> Complemento {i+1}</p>
                                         <p className="font-black text-slate-800 text-xl md:text-2xl">{String(f.quantidade_op)} PÇS <span className="text-sm md:text-base text-slate-500 font-bold ml-3 hidden md:inline">Enviadas em {new Date(f.data_criacao).toLocaleDateString()}</span></p>
                                         <p className="text-xs text-slate-500 font-bold mt-2 md:hidden">Data: {new Date(f.data_criacao).toLocaleDateString()}</p>
                                      </div>
                                      <p className="text-xs md:text-sm text-slate-600 font-black bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 uppercase tracking-widest text-center">{s(f.observacao).replace('COMPLEMENTO - ', '')}</p>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>

                       <div>
                          <h4 className="font-black text-slate-800 uppercase tracking-tight flex items-center mb-6 text-xl"><Database className="w-6 h-6 mr-3 text-rose-500"/> Matérias-Primas (MPs) Retiradas no Total</h4>
                          <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                             <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                   <thead className="bg-slate-100 border-b border-slate-200">
                                      <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                         <th className="p-5 pl-8">Código MP</th>
                                         <th className="p-5 w-full">Descrição do Material</th>
                                         <th className="p-5 text-center">Unid.</th>
                                         <th className="p-5 text-right pr-8">Volume Físico Descontado Total</th>
                                      </tr>
                                   </thead>
                                   <tbody className="divide-y divide-slate-100">
                                      {projetoDetalheSelecionado.mpsConsumidas
                                         .filter(mp => {
                                            if(!buscaDetalheProjeto) return true;
                                            const termo = buscaDetalheProjeto.toLowerCase();
                                            return s(mp.codigoMP).toLowerCase().includes(termo) || s(mp.descricao).toLowerCase().includes(termo);
                                         })
                                         .sort((a, b) => b.qtdAcumulada - a.qtdAcumulada)
                                         .map((mp, i) => (
                                         <tr key={i} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-5 pl-8 font-black text-rose-600">{s(mp.codigoMP)}</td>
                                            <td className="p-5 text-slate-700 font-bold truncate max-w-[200px] md:max-w-xl">{s(mp.descricao)}</td>
                                            <td className="p-5 text-center font-black text-slate-400 bg-slate-50">{s(mp.um)}</td>
                                            <td className="p-5 pr-8 text-right font-black text-slate-900 text-lg bg-slate-50/50">{String(Number(mp.qtdAcumulada.toFixed(4)))}</td>
                                         </tr>
                                      ))}
                                      {projetoDetalheSelecionado.mpsConsumidas.filter(mp => !buscaDetalheProjeto || s(mp.codigoMP).toLowerCase().includes(buscaDetalheProjeto.toLowerCase()) || s(mp.descricao).toLowerCase().includes(buscaDetalheProjeto.toLowerCase())).length === 0 && (
                                         <tr><td colSpan="4" className="p-16 text-center font-black text-slate-300 uppercase tracking-widest text-base">Nenhum material encontrado na busca para esta árvore</td></tr>
                                      )}
                                   </tbody>
                                </table>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* Modal de OPs Atrasadas */}
        {modalAtrasadasAberto && (
           <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-[200] flex items-center justify-center p-4 print:hidden">
              <div className="bg-white rounded-[2.5rem] w-full max-w-5xl shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[90vh]">
                 <div className="p-6 md:p-8 border-b border-slate-100 bg-red-50 flex justify-between items-center shrink-0">
                    <div>
                       <span className="bg-red-600 text-white text-[9px] md:text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">Alerta Gerencial Crítico</span>
                       <h2 className="text-2xl md:text-3xl font-black text-red-900 uppercase tracking-tighter mt-3 flex items-center"><AlertTriangle className="w-8 h-8 mr-3"/> OPs com +20 dias em poder de terceiros</h2>
                       <p className="text-red-700 font-bold text-xs uppercase tracking-widest mt-2 ml-11">Peças despachadas que ainda não receberam baixa de retorno da Logística</p>
                    </div>
                    <button onClick={() => setModalAtrasadasAberto(false)} className="bg-white border-2 border-red-200 text-red-400 hover:text-red-600 hover:border-red-300 hover:bg-red-100 p-3 rounded-2xl transition-all shadow-sm"><XCircle className="w-8 h-8"/></button>
                 </div>
                 <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 custom-scrollbar">
                    <div className="space-y-4">
                       {remessasAtrasadas20Dias.map(r => {
                          const diffTime = Math.abs(new Date() - new Date(r.data_envio));
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                          return (
                             <div key={r.id} className="bg-white border border-red-100 rounded-[2rem] p-6 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-6 hover:shadow-md hover:border-red-300 transition-all group">
                                <div className="flex-1">
                                   <div className="flex flex-wrap items-center gap-3 mb-3">
                                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">BR: {s(r.projeto)}</span>
                                      <span className="text-[10px] font-black text-red-600 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-lg flex items-center border border-red-100 shadow-sm animate-pulse"><Clock className="w-3.5 h-3.5 mr-1.5"/> Fora há {diffDays} Dias</span>
                                   </div>
                                   <h4 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight leading-tight">{s(r.produto_acabado)}</h4>
                                   <div className="flex items-center text-[11px] text-slate-500 font-bold mt-2 uppercase tracking-widest bg-slate-50 px-3 py-1.5 w-fit rounded-lg border border-slate-100">
                                      <MapPin className="w-3 h-3 mr-1.5 text-slate-400"/> Destinatário/Local: {s(r.expedicao?.destinatario || r.cliente || 'Em Trânsito')}
                                   </div>
                                </div>
                                <div className="flex items-center gap-6 bg-red-50/50 p-4 rounded-2xl border border-red-100 shrink-0">
                                   <div className="text-center">
                                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Data Saída SGQ</p>
                                      <p className="font-black text-slate-700">{new Date(r.data_envio).toLocaleDateString('pt-BR')}</p>
                                   </div>
                                   <div className="w-px h-10 bg-red-200"></div>
                                   <div className="text-center">
                                      <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-1">Volume Retido</p>
                                      <p className="font-black text-red-600 text-2xl">{Number(r.quantidade_op) - Number(r.pecas_recebidas || 0)} <span className="text-xs">PÇS</span></p>
                                   </div>
                                </div>
                             </div>
                          );
                       })}
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* WIDGET: CHAT INTERNO EQUIPE */}
        <div className="fixed bottom-6 left-6 z-[90] print:hidden">
           {isChatEquipeAberto && (
              <div className="bg-white w-80 h-[28rem] rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-slate-200 flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-4">
                 <div className="bg-slate-900 p-4 flex flex-col gap-3 text-white shrink-0">
                    <div className="flex justify-between items-center">
                       <span className="font-black uppercase tracking-widest text-xs flex items-center"><MessageCircle className="w-4 h-4 mr-2 text-indigo-400"/> Chat Operacional</span>
                       <button onClick={() => setIsChatEquipeAberto(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5"/></button>
                    </div>
                    {/* Seletor de Chat Privado / Geral */}
                    <select className="bg-slate-800 text-xs font-bold text-slate-200 outline-none p-2 rounded-lg border border-slate-700 cursor-pointer" value={chatDestinatario} onChange={e => setChatDestinatario(e.target.value)}>
                       <option value="Geral">🌐 Chat Geral (Toda a Equipe)</option>
                       {usuariosDb.filter(u => u.nome !== usuarioLogado?.nome).map(u => (
                          <option key={u.email} value={u.nome}>🔒 Privado: {s(u.nome)}</option>
                       ))}
                    </select>
                 </div>
                 <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 custom-scrollbar" ref={chatEquipeRef}>
                    {mensagensVisiveis.map(m => (
                       <div key={m.id} className={`flex flex-col ${m.remetente === usuarioLogado?.nome ? 'items-end' : 'items-start'}`}>
                          <span className="text-[9px] font-bold text-slate-400 mb-1">{s(m.remetente)}</span>
                          <div className={`px-4 py-2 rounded-2xl text-sm max-w-[85%] ${m.remetente === usuarioLogado?.nome ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'}`}>
                             {s(m.mensagem)}
                          </div>
                       </div>
                    ))}
                    {mensagensVisiveis.length === 0 && <div className="text-center text-slate-400 text-xs font-bold mt-10 uppercase tracking-widest opacity-50">Nenhuma mensagem...</div>}
                 </div>
                 <form onSubmit={enviarMsgEquipe} className="p-3 bg-white border-t border-slate-200 flex gap-2 shrink-0">
                    <input value={msgEquipeInput} onChange={e=>setMsgEquipeInput(e.target.value)} placeholder={`Mensagem para ${chatDestinatario === 'Geral' ? 'todos' : chatDestinatario}...`} className="flex-1 bg-slate-100 px-3 py-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-medium" />
                    <button type="submit" className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-colors"><Send className="w-4 h-4"/></button>
                 </form>
              </div>
           )}
           {!isChatEquipeAberto && (
              <button onClick={() => { setIsChatEquipeAberto(true); setHasNovaMsgEquipe(false); }} className="w-14 h-14 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform relative group">
                 {hasNovaMsgEquipe && <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 border-2 border-white shadow-sm"></span></span>}
                 <MessageCircle className="w-6 h-6"/>
                 <span className="absolute -top-10 bg-slate-800 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">Chat Equipe</span>
              </button>
           )}
        </div>

        {/* WIDGET: COPILOTO MINI-IA */}
        <div className="fixed bottom-6 right-6 z-[90] print:hidden">
           {isMiniIaAberto && (
              <div className="bg-white w-80 md:w-96 h-[30rem] rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-slate-200 flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-4">
                 <div className="bg-indigo-600 p-4 flex justify-between items-center text-white shrink-0 bg-gradient-to-r from-indigo-700 to-indigo-500">
                    <span className="font-black uppercase tracking-widest text-xs flex items-center"><BotMessageSquare className="w-4 h-4 mr-2 text-indigo-200"/> Copiloto IA Rápido</span>
                    <button onClick={() => setIsMiniIaAberto(false)} className="text-indigo-200 hover:text-white"><X className="w-5 h-5"/></button>
                 </div>
                 <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 custom-scrollbar" ref={miniIaRef}>
                    <div className="bg-indigo-50 border border-indigo-100 text-indigo-800 text-xs p-3 rounded-xl mb-4 font-medium leading-relaxed">Olá! Sou o seu Copiloto Integrado. Posso puxar lógicas rápidas ou responder dúvidas sem que você precise sair desta aba.</div>
                    {miniIaMessages.map((m, i) => (
                       <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                          <div className={`px-4 py-3 rounded-2xl text-sm max-w-[90%] shadow-sm ${m.role === 'user' ? 'bg-slate-800 text-white rounded-br-none font-medium' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none whitespace-pre-wrap leading-relaxed'}`}>
                             {m.content}
                          </div>
                       </div>
                    ))}
                    {isMiniIaLoading && <Loader2 className="w-5 h-5 text-indigo-500 animate-spin ml-2"/>}
                 </div>
                 <form onSubmit={enviarMensagemMiniIA} className="p-3 bg-white border-t border-slate-200 flex gap-2 shrink-0">
                    <input value={miniIaInput} onChange={e=>setMiniIaInput(e.target.value)} placeholder="Pergunte à IA..." className="flex-1 bg-slate-100 px-3 py-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-medium" disabled={!openAIApiKey || isMiniIaLoading} />
                    <button type="submit" disabled={!openAIApiKey || isMiniIaLoading} className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"><Send className="w-4 h-4"/></button>
                 </form>
              </div>
           )}
           {!isMiniIaAberto && (
              <button onClick={() => setIsMiniIaAberto(true)} className="w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl shadow-indigo-300 flex items-center justify-center hover:scale-110 transition-transform relative group">
                 <BotMessageSquare className="w-6 h-6"/>
                 <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500 border-2 border-white"></span></span>
                 <span className="absolute -top-10 bg-slate-800 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">Copiloto IA Rápido</span>
              </button>
           )}
        </div>

      </div>
    </div>
  );
}
