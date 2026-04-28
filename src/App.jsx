import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Upload, Trash2, Database, AlertCircle, FileSpreadsheet, 
  CheckCircle, RefreshCcw, Loader2, Calculator, Cloud, CloudOff, 
  ServerCrash, Truck, MapPin, ClipboardList, PackageOpen, ArrowRight, 
  LayoutDashboard, History, UploadCloud, Users, Clock, ShieldAlert, 
  ArrowLeftRight, ListChecks, Lock, Mail, LogOut, User, Shield, 
  ArrowUpCircle, UserPlus, KeyRound, Settings, XCircle, Info, 
  FileWarning, FileCheck, Layers, PieChart, Construction, Edit3,
  Calendar, Link2, Filter, Eye, AlertTriangle, FileSearch, Weight, Boxes,
  Building2, ArrowUpDown, ArrowUp, ArrowDown
} from 'lucide-react';

// ============================================================================
// CONFIGURAÇÃO DO SEU SUPABASE
// ============================================================================
const SUPABASE_URL = "https://mdsxiijlkruqnhbyxbhe.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_6vD-Jyf4pIJdOpvzXKDCOw_YUcX3TcG";
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

  // Estados Logística e Filtros (Metodologia Excel)
  const [buscaFornecedor, setBuscaFornecedor] = useState('');
  const [remessaParaRetorno, setRemessaParaRetorno] = useState(null);
  const [qtdPecasRetornando, setQtdPecasRetornando] = useState('');
  
  // Configuração de Filtros e Ordenação
  const [filtrosControle, setFiltrosControle] = useState({ projeto: '', pa: '', mp: '', status: '' });
  const [sortControle, setSortControle] = useState({ key: 'data_envio', dir: 'desc' });

  const [filtrosHistorico, setFiltrosHistorico] = useState({ projeto: '', pa: '', cliente: '', status: '' });
  const [sortHistorico, setSortHistorico] = useState({ key: 'data_criacao', dir: 'desc' });

  const [filtrosAuditoria, setFiltrosAuditoria] = useState({ projeto: '', pa: '', mp: '', status: '' });
  const [sortAuditoria, setSortAuditoria] = useState({ key: 'data', dir: 'desc' });

  // NÍVEIS DE ACESSO
  const isAdmin = usuarioLogado?.perfil === 'ADMIN';
  const isPCP = usuarioLogado?.perfil === 'PCP' || isAdmin;
  const isExp = usuarioLogado?.perfil === 'EXPEDICAO' || isAdmin;

  // Helper para converter qualquer valor para string segura
  const s = (val) => {
    if (val === null || val === undefined) return "";
    return String(val);
  };

  // 1. Injeção de Bibliotecas e Inicialização
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
      const [prodRes, estRes, remRes, userRes, configRes] = await Promise.all([
        supabase.from('produtos').select('*'),
        supabase.from('estoque_mp').select('*'),
        supabase.from('remessas').select('*').order('data_criacao', { ascending: false }),
        supabase.from('perfis_usuarios').select('*'),
        supabase.from('configuracoes').select('*').eq('chave', 'modelo_sgq').maybeSingle()
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
      setDbOnline(true);
    } catch (e) { setDbOnline(false); }
  };

  useEffect(() => { if (supabase) fetchAllData(); }, [supabase]);

  // Função auxiliar de ordenação
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

  // Função para tratar números brasileiros (incluindo inputs manuais)
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

  // 2. Funções de Autenticação e Acessos
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

  // 3. Funções do PCP
  const buscarProduto = (e) => {
    if (e) e.preventDefault();
    setErro('');
    const cod = codigoBusca.toUpperCase().trim();
    const produto = produtosDb[cod];
    if (produto) {
      setProdutoEncontrado(produto);
      const list = (produto.materiais || []).map(m => {
        const est = estoqueDb[m.codigoMP] || { saldo_disponivel: 0, descricao: 'Não catalogado' };
        // Agora aceita decimais multiplicando de forma correta
        const qtdBase = Number((m.quantidade * parseNumBR(quantidadeProduzir)).toFixed(4));
        return { ...m, saldoDisponivel: est.saldo_disponivel, descricao: est.descricao, quantidadeTotal: qtdBase, quantidadeOriginal: qtdBase, quantidadeRetornada: 0, rateiosExtras: [] };
      });
      setItensRemessa(list); setItensOriginaisBOM(list);
    } else { setErro('Produto não cadastrado no sistema.'); }
  };

  const enviarParaExpedicao = async () => {
    if(!projeto || !cliente) return setErro("Projeto e Cliente são obrigatórios.");
    const servFinal = observacao === 'Outros' ? (outrosTexto || 'Outros') : observacao;
    const removidos = itensOriginaisBOM
      .filter(orig => !itensRemessa.find(it => it.codigoMP === orig.codigoMP))
      .map(r => ({ codigoMP: s(r.codigoMP), descricao: s(r.descricao), quantidade: Number(r.quantidadeTotal), um: s(r.um) }));

    setIsLoading(true);
    try {
      for (const it of itensRemessa) {
        const { data: cur } = await supabase.from('estoque_mp').select('saldo_disponivel').eq('codigo_mp', it.codigoMP).single();
        await supabase.from('estoque_mp').update({ saldo_disponivel: Number(((cur?.saldo_disponivel || 0) - it.quantidadeTotal).toFixed(4)) }).eq('codigo_mp', it.codigoMP);
      }
      const { error: errIns } = await supabase.from('remessas').insert([{
        id: `REM-${Date.now()}`, produto_acabado: s(produtoEncontrado.codigo_pa), descricao_produto: s(produtoEncontrado.descricao),
        quantidade_op: parseNumBR(quantidadeProduzir), // Gravando a fração
        projeto: s(projeto).toUpperCase(), cliente: s(cliente).toUpperCase(),
        observacao: s(servFinal), obs_expedicao: s(obsExpedicao), itens: itensRemessa, itens_removidos: removidos,
        status: 'PENDENTE_EXPEDICAO', criado_por: s(usuarioLogado?.nome || 'PCP'), pecas_recebidas: 0
      }]);
      if (errIns) throw errIns;
      setSucesso('Enviado para a Expedição!'); setIsLoading(false); setProdutoEncontrado(null); setOutrosTexto(''); setObsExpedicao(''); setCliente(''); setAbaAtiva('HISTORICO_PCP'); fetchAllData();
    } catch (e) { setErro("Erro no envio: " + e.message); setIsLoading(false); }
  };

  // 4. Funções da Expedição
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
    const pecasDevolvidas = parseNumBR(qtdPecasRetornando); // Permite retorno parcial fracionado
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
          const { data: cur } = await supabase.from('estoque_mp').select('saldo_disponivel').eq('codigo_mp', novosItens[i].codigoMP).single();
          await supabase.from('estoque_mp').update({ saldo_disponivel: Number(((cur?.saldo_disponivel || 0) + qtdMP).toFixed(4)) }).eq('codigo_mp', novosItens[i].codigoMP);
      }
      const novoTotalJa = pecasJaRecebidas + pecasDevolvidas;
      const novoStatus = novoTotalJa >= Number(rem.quantidade_op) ? 'RETORNADO' : 'RETORNO_PARCIAL';
      const { error } = await supabase.from('remessas').update({ itens: novosItens, status: novoStatus, pecas_recebidas: novoTotalJa, data_retorno: new Date().toISOString(), recebido_por: s(usuarioLogado?.nome || 'Sistema') }).eq('id', rem.id);
      if (error) throw error;
      setSucesso('Estoque creditado com as entradas!'); setRemessaParaRetorno(null); setQtdPecasRetornando(''); fetchAllData();
    } catch (e) { setErro("Erro no retorno."); } finally { setIsLoading(false); }
  };

  // --- LÓGICA DE AUDITORIA E FILTROS TIPO EXCEL (BLINDADA E DINÂMICA) ---
  
  // Auditoria
  const pendenciasAuditoria = useMemo(() => {
    const allRemovidos = remessasDb.flatMap(r => (Array.isArray(r.itens_removidos) ? r.itens_removidos : []).map(rem => ({ ...rem, projeto: r.projeto, pa: r.produto_acabado, data: r.data_criacao })));
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

  // Histórico
  const historicoFiltrado = useMemo(() => {
    let list = [...remessasDb];
    if(filtrosHistorico.projeto) list = list.filter(r => s(r.projeto).toUpperCase().includes(filtrosHistorico.projeto.toUpperCase()));
    if(filtrosHistorico.cliente) list = list.filter(r => s(r.cliente).toUpperCase().includes(filtrosHistorico.cliente.toUpperCase()));
    if(filtrosHistorico.pa) list = list.filter(r => s(r.produto_acabado).toUpperCase().includes(filtrosHistorico.pa.toUpperCase()));
    if(filtrosHistorico.status) list = list.filter(r => s(r.status) === filtrosHistorico.status);

    const k = sortHistorico.key; const d = sortHistorico.dir === 'asc' ? 1 : -1;
    return list.sort((a,b) => (s(a[k]) > s(b[k]) ? 1 : -1) * d);
  }, [remessasDb, filtrosHistorico, sortHistorico]);

  // Controle Geral
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

  // Geração de Opções Únicas para Filtros Dropdown
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
      "PA": s(p.pa), 
      "MP Ausente": s(p.codigoMP), 
      "Descricao": s(p.descricao), 
      "Quantidade": Number(p.quantidade || 0), 
      "Status": p.resolvido ? 'Regularizado' : 'Pendente' 
    }));
    const ws = window.XLSX.utils.json_to_sheet(data);
    const wb = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(wb, ws, "Auditoria");
    window.XLSX.writeFile(wb, `Auditoria_Kalenborn_${Date.now()}.xlsx`);
  };

  const remessasPendentes = useMemo(() => remessasDb.filter(r => s(r.status) === 'PENDENTE_EXPEDICAO'), [remessasDb]);
  const remessasFora = useMemo(() => remessasDb.filter(r => ['ENVIADO', 'RETORNO_PARCIAL', 'RETORNADO'].includes(s(r.status))), [remessasDb]);

  // LOGIN SCREEN
  if (!usuarioLogado) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md border-b-8 border-indigo-600">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-4"><PackageOpen className="w-8 h-8" /></div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Kalenborn SGQ</h1>
            <p className="text-slate-400 font-bold text-[10px] mt-2 uppercase tracking-widest leading-relaxed text-center">Industrialização Cloud</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            {erroLogin && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-black border-2 border-red-100 flex items-center"><AlertCircle className="w-4 h-4 mr-2" /> {s(erroLogin)}</div>}
            <input type="email" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:border-indigo-500" placeholder="E-mail de acesso" value={emailLogin} onChange={e => setEmailLogin(e.target.value)} />
            <input type="password" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:border-indigo-500" placeholder="Senha" value={senhaLogin} onChange={e => setSenhaLogin(e.target.value)} />
            <button type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl shadow-xl hover:bg-indigo-700 transition-all uppercase tracking-wider text-sm">Acessar</button>
          </form>
        </div>
      </div>
    );
  }

  // MAIN RENDER
  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden text-sm">
      {/* Sidebar Navigation */}
      <div className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl z-20">
        <div className="p-6 border-b border-slate-800 flex items-center space-x-3 text-indigo-400">
          <PackageOpen className="w-8 h-8" /><h1 className="text-xl font-black">SGQ<br/><span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-indigo-500 text-center">Kalenborn</span></h1>
        </div>
        <div className="p-4 border-b border-slate-800 bg-slate-800/30 flex items-center justify-between">
           <div className="flex items-center space-x-3 truncate">
              <div className="bg-slate-700 p-2 rounded-full flex-shrink-0">{isAdmin ? <Shield className="w-4 h-4 text-amber-400" /> : <User className="w-4 h-4 text-indigo-400" />}</div>
              <p className="font-black truncate">{s(usuarioLogado?.nome)}</p>
           </div>
           <button onClick={() => setUsuarioLogado(null)} className="text-slate-500 hover:text-red-400 transition-colors ml-2"><LogOut className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto py-4 space-y-1 px-3 custom-scrollbar">
          {isPCP && (
            <>
              <button onClick={() => setAbaAtiva('NOVA_OP')} className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${abaAtiva === 'NOVA_OP' ? 'bg-indigo-600 shadow-lg text-white' : 'text-slate-400 hover:bg-slate-800'}`}><LayoutDashboard className="w-5 h-5 mr-3" /> <span className="font-bold">Nova Remessa</span></button>
              <button onClick={() => setAbaAtiva('HISTORICO_PCP')} className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${abaAtiva === 'HISTORICO_PCP' ? 'bg-indigo-600 shadow-lg text-white' : 'text-slate-400 hover:bg-slate-800'}`}><History className="w-5 h-5 mr-3" /> <span className="font-bold">Histórico Envios</span></button>
              <button onClick={() => setAbaAtiva('UPLOAD_ESTOQUE')} className={`w-full flex items-center px-4 py-3 rounded-xl mt-4 transition-all ${abaAtiva === 'UPLOAD_ESTOQUE' ? 'bg-emerald-600 shadow-lg text-white' : 'text-slate-400 hover:bg-slate-800'}`}><UploadCloud className="w-5 h-5 mr-3" /> <span className="font-bold">Sincronizar ERP</span></button>
            </>
          )}
          {isExp && (
            <>
              <button onClick={() => setAbaAtiva('EXPEDICAO')} className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${abaAtiva === 'EXPEDICAO' ? 'bg-amber-600 shadow-lg text-white' : 'text-slate-400 hover:bg-slate-800'}`}><Truck className="w-5 h-5 mr-3" /> <span className="font-bold">Fila Expedição</span>{remessasPendentes.length > 0 && <span className="ml-auto bg-amber-400 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full">{String(remessasPendentes.length)}</span>}</button>
              <button onClick={() => setAbaAtiva('FORNECEDORES')} className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${abaAtiva === 'FORNECEDORES' ? 'bg-amber-600 shadow-lg text-white' : 'text-slate-400 hover:bg-slate-800'}`}><MapPin className="w-5 h-5 mr-3" /> <span className="font-bold">Retorno de Peças</span></button>
              <button onClick={() => setAbaAtiva('CONTROLE_GERAL')} className={`w-full flex items-center px-4 py-3 rounded-xl mt-4 transition-all ${abaAtiva === 'CONTROLE_GERAL' ? 'bg-blue-600 shadow-lg text-white' : 'text-slate-400 hover:bg-slate-800'}`}><ListChecks className="w-5 h-5 mr-3" /> <span className="font-bold">Controle Geral</span></button>
            </>
          )}
          {isAdmin && (
            <>
              <button onClick={() => setAbaAtiva('AUDITORIA')} className={`w-full flex items-center px-4 py-3 rounded-xl mt-4 transition-all ${abaAtiva === 'AUDITORIA' ? 'bg-red-600 shadow-lg text-white' : 'text-slate-400 hover:bg-slate-800'}`}><FileSearch className="w-5 h-5 mr-3" /> <span className="font-bold">Auditoria BOM</span></button>
              <button onClick={() => setAbaAtiva('GESTAO_USUARIOS')} className={`w-full flex items-center px-4 py-3 rounded-xl mt-1 transition-all ${abaAtiva === 'GESTAO_USUARIOS' ? 'bg-purple-600 shadow-lg text-white' : 'text-slate-400 hover:bg-slate-800'}`}><Users className="w-5 h-5 mr-3" /> <span className="font-bold">Gestão Acessos</span></button>
            </>
          )}
        </div>
        
        {(isAdmin || isPCP) && (
          <div className="p-4 bg-slate-950 space-y-4">
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-y-auto relative p-6 md:p-8 custom-scrollbar">
        {isLoading && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-md z-[60] flex flex-col items-center justify-center text-center">
            <Loader2 className="w-20 h-20 text-indigo-600 animate-spin mb-6" />
            <h3 className="text-2xl font-black uppercase text-slate-800 tracking-tighter">Processando...</h3>
            <div className="w-64 bg-slate-200 h-2 rounded-full overflow-hidden mt-4 shadow-inner"><div className="bg-indigo-600 h-full transition-all duration-300" style={{width: `${uploadProgress}%`}}></div></div>
          </div>
        )}

        {(erro || sucesso) && <div className={`fixed top-4 right-4 z-[100] p-5 rounded-2xl shadow-2xl flex items-start border-2 animate-in slide-in-from-top-4 ${erro ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'}`}><AlertCircle className="w-6 h-6 mr-3 flex-shrink-0" /><div className="flex-1 font-black text-sm">{s(erro || sucesso)}</div><button onClick={() => {setErro(''); setSucesso('');}} className="font-black text-xl ml-4">&times;</button></div>}

        {/* 1. ABA NOVA OP */}
        {abaAtiva === 'NOVA_OP' && (
          <div className="max-w-4xl mx-auto space-y-6 w-full animate-in fade-in">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Nova Ordem de Remessa</h2>
            <div className="bg-white rounded-3xl p-8 border-2 border-slate-100 shadow-sm">
              <form onSubmit={buscarProduto} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase ml-2">Cód Produto PA</label><input placeholder="Ex: 100200" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-black uppercase text-slate-700 outline-none focus:border-indigo-300 shadow-sm" value={codigoBusca} onChange={e => setCodigoBusca(e.target.value)} /></div>
                
                {/* ALTERADO: TIPO TEXT PARA PERMITIR VÍRGULA NO FRONT-END */}
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase ml-2">Qtd Produção</label><input type="text" placeholder="Ex: 0,5 ou 1.5" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-black text-slate-700 outline-none focus:border-indigo-300 shadow-sm" value={quantidadeProduzir} onChange={e => setQuantidadeProduzir(e.target.value)} /></div>
                
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase ml-2">Projeto (BR)</label><input placeholder="BR-..." className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-black text-slate-700 outline-none focus:border-indigo-300 shadow-sm" value={projeto} onChange={e => setProjeto(e.target.value)} /></div>
                <div className="space-y-1 md:col-span-2 lg:col-span-1"><label className="text-[10px] font-black text-indigo-600 uppercase ml-2 flex items-center"><Building2 className="w-3 h-3 mr-1"/> Nome do Cliente</label><input placeholder="Cliente Final" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-black text-slate-700 outline-none focus:border-indigo-300 shadow-sm" value={cliente} onChange={e => setCliente(e.target.value)} /></div>
                <div className={`space-y-1 ${observacao === 'Outros' ? 'lg:col-span-1' : 'lg:col-span-2'}`}>
                  <label className="text-[10px] font-black text-indigo-600 uppercase ml-2 flex items-center"><Construction className="w-3 h-3 mr-1"/> Serviço p/ PCP</label>
                  <select className="w-full bg-indigo-50 border-2 border-indigo-100 rounded-xl px-4 py-3 font-black text-indigo-900 outline-none focus:border-indigo-400 shadow-sm" value={observacao} onChange={e => setObservacao(e.target.value)}>
                    <option value="Industrialização">Industrialização (Padrão)</option><option value="Jateamento Interno">Jateamento Interno</option><option value="Jateamento Externo">Jateamento Externo</option><option value="Reforma">Reforma</option><option value="Autoclave">Autoclave</option><option value="Montagem de Placas">Montagem de Placas</option><option value="Outros">Outros (Descrever)</option>
                  </select>
                </div>
                {observacao === 'Outros' && (
                  <div className="space-y-1 lg:col-span-1 animate-in slide-in-from-left-2"><label className="text-[10px] font-black text-amber-600 uppercase ml-2 flex items-center"><Edit3 className="w-3 h-3 mr-1"/> Especifique</label><input placeholder="Serviço" className="w-full bg-amber-50 border-2 border-amber-200 rounded-xl px-4 py-3 font-black text-amber-900 outline-none shadow-sm" value={outrosTexto} onChange={e => setOutrosTexto(e.target.value)} /></div>
                )}
                <div className="space-y-1 lg:col-span-3"><label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center"><Info className="w-3 h-3 mr-1"/> Nota PCP p/ Logística</label><input placeholder="Instruções..." className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:border-indigo-300 shadow-sm" value={obsExpedicao} onChange={e => setObsExpedicao(e.target.value)} /></div>
                <button type="submit" className="lg:col-span-3 bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-black transition-all shadow-xl uppercase tracking-wider text-sm mt-2">Buscar BOM</button>
              </form>
            </div>
            {produtoEncontrado && (
              <div className="bg-white rounded-3xl border-2 border-slate-50 overflow-hidden shadow-sm animate-in zoom-in-95">
                <div className="p-4 bg-amber-50 text-amber-700 font-black text-[10px] uppercase flex items-center border-b border-amber-100"><AlertTriangle className="w-4 h-4 mr-2"/> Auditoria Ativa: Itens removidos da lista serão registrados como pendentes.</div>
                <table className="w-full text-left text-xs"><thead className="bg-slate-50 border-b">
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest"><th className="p-4 text-center">Tirar</th><th className="p-4">Material MP</th><th className="p-4">Descrição</th><th className="p-4 text-center">Quantidade</th><th className="p-4 text-center">Disponível</th></tr>
                </thead><tbody className="divide-y divide-slate-50">
                  {itensRemessa.map((it, i) => (
                    <tr key={i} className={it.saldoDisponivel < it.quantidadeTotal ? 'bg-red-50/30' : 'hover:bg-slate-50'}>
                      <td className="p-4 text-center"><button onClick={() => setItensRemessa(prev => prev.filter((_, idx) => idx !== i))} className="text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4 mx-auto" /></button></td>
                      <td className="p-4 font-black text-slate-700 uppercase tracking-tighter">{s(it.codigoMP)}</td>
                      <td className="p-4 text-slate-500 font-medium truncate max-w-[200px]">{s(it.descricao)}</td>
                      <td className="p-4 text-center font-black text-indigo-600">{String(it.quantidadeTotal)} {s(it.um)}</td>
                      <td className={`p-4 text-center font-black ${it.saldoDisponivel < it.quantidadeTotal ? 'text-red-500' : 'text-emerald-500'}`}>{String(it.saldoDisponivel)}</td>
                    </tr>
                  ))}
                </tbody></table>
                <div className="p-6 bg-slate-50 flex justify-end border-t">
                  <button onClick={enviarParaExpedicao} className="px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl hover:bg-indigo-700 transition-all uppercase tracking-wider flex items-center text-sm shadow-indigo-100"><ArrowRight className="w-5 h-5 mr-3" /> Validar & Enviar p/ Expedição</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. ABA HISTÓRICO PCP (EXCEL STYLE) */}
        {abaAtiva === 'HISTORICO_PCP' && (
           <div className="max-w-7xl mx-auto w-full animate-in fade-in">
              <div className="flex justify-between items-end mb-6">
                <div><h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase leading-none">Histórico de Envios (PCP)</h2><p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">Metodologia de Filtro e Ordenação Excel</p></div>
                <button onClick={() => setFiltrosHistorico({projeto:'', pa:'', cliente:'', status:''})} className="bg-white border-2 border-slate-100 text-slate-400 text-[10px] font-black uppercase px-4 py-2 rounded-xl hover:text-red-500 transition-all flex items-center shadow-sm"><XCircle className="w-3 h-3 mr-2"/> Limpar Filtros</button>
              </div>
              <div className="bg-white rounded-[2rem] border-2 border-slate-100 overflow-hidden shadow-sm">
                 <div className="overflow-x-auto"><table className="w-full text-left text-[11px] whitespace-nowrap"><thead className="bg-slate-50 border-b">
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
                        <input list="dl-h-proj" className="w-full bg-white border border-slate-200 rounded px-2 py-1 font-bold text-slate-600 outline-none focus:border-indigo-300" placeholder="Procurar..." value={filtrosHistorico.projeto} onChange={e => setFiltrosHistorico({...filtrosHistorico, projeto: e.target.value})} />
                        <datalist id="dl-h-proj">{optionsH.projeto.map(o => <option key={o} value={o} />)}</datalist>
                      </th>
                      <th className="px-5 py-2">
                        <input list="dl-h-cli" className="w-full bg-white border border-slate-200 rounded px-2 py-1 font-bold text-slate-600 outline-none focus:border-indigo-300" placeholder="Procurar..." value={filtrosHistorico.cliente} onChange={e => setFiltrosHistorico({...filtrosHistorico, cliente: e.target.value})} />
                        <datalist id="dl-h-cli">{optionsH.cliente.map(o => <option key={o} value={o} />)}</datalist>
                      </th>
                      <th className="px-5 py-2">
                        <input list="dl-h-pa" className="w-full bg-white border border-slate-200 rounded px-2 py-1 font-bold text-slate-600 outline-none focus:border-indigo-300" placeholder="Procurar..." value={filtrosHistorico.pa} onChange={e => setFiltrosHistorico({...filtrosHistorico, pa: e.target.value})} />
                        <datalist id="dl-h-pa">{optionsH.pa.map(o => <option key={o} value={o} />)}</datalist>
                      </th>
                      <th className="px-5 py-2 pr-8 text-center"><select className="w-full bg-white border border-slate-200 rounded px-2 py-1 font-bold text-slate-600" value={filtrosHistorico.status} onChange={e => setFiltrosHistorico({...filtrosHistorico, status: e.target.value})}><option value="">Todos</option><option value="PENDENTE_EXPEDICAO">Fila</option><option value="ENVIADO">Enviado</option><option value="RETORNADO">Concluído</option></select></th>
                    </tr>
                 </thead><tbody className="divide-y divide-slate-100">
                    {historicoFiltrado.map(r => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors border-b border-slate-50/50">
                        <td className="p-5 pl-8 font-bold text-slate-400 text-center">{r.data_criacao ? s(new Date(r.data_criacao).toLocaleDateString()) : '---'}</td>
                        <td className="p-5 font-black text-amber-600 uppercase tracking-tighter">{s(r.projeto)}</td>
                        <td className="p-5 font-bold text-slate-600 uppercase">{s(r.cliente || 'Interno')}</td>
                        <td className="p-5 font-black text-slate-900 uppercase tracking-tighter">{s(r.produto_acabado)}</td>
                        <td className="p-5 text-center pr-8">{r.status === 'PENDENTE_EXPEDICAO' ? <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-[9px] font-black uppercase">Na Fila</span> : <span className="bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-[9px] font-black uppercase">Processado</span>}</td>
                      </tr>
                    ))}
                    {historicoFiltrado.length === 0 && <tr><td colSpan="5" className="p-20 text-center text-slate-300 font-black uppercase text-lg tracking-widest opacity-30">Nenhum registo no histórico</td></tr>}
                 </tbody></table></div>
              </div>
           </div>
        )}

        {/* 3. ABA CONTROLE GERAL (EXCEL STYLE) */}
        {abaAtiva === 'CONTROLE_GERAL' && (
          <div className="max-w-7xl mx-auto space-y-6 w-full animate-in fade-in">
            <div className="flex justify-between items-end">
              <div><h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase leading-none">Monitoramento Geral</h2><p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">Gestão de trânsito externo (Filtros Dropdown)</p></div>
              <button onClick={() => setFiltrosControle({projeto:'', pa:'', mp:'', status:''})} className="bg-white border-2 border-slate-100 text-slate-400 text-[10px] font-black uppercase px-4 py-2 rounded-xl hover:text-red-500 transition-all flex items-center shadow-sm"><XCircle className="w-3 h-3 mr-2"/> Limpar Filtros</button>
            </div>
            <div className="bg-white rounded-[2rem] border-2 border-slate-100 overflow-hidden shadow-sm">
              <div className="overflow-x-auto"><table className="w-full text-left text-xs whitespace-nowrap"><thead className="bg-slate-50 border-b">
                <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest cursor-pointer">
                  <th className="p-5 pl-8 text-center" onClick={() => handleSort(sortControle, setSortControle, 'data_envio')}>Saída {renderSortIcon(sortControle, 'data_envio')}</th>
                  <th className="p-5" onClick={() => handleSort(sortControle, setSortControle, 'projeto')}>Projeto {renderSortIcon(sortControle, 'projeto')}</th>
                  <th className="p-5" onClick={() => handleSort(sortControle, setSortControle, 'produto_acabado')}>PA {renderSortIcon(sortControle, 'produto_acabado')}</th>
                  <th className="p-5" onClick={() => handleSort(sortControle, setSortControle, 'codigoMP')}>MP {renderSortIcon(sortControle, 'codigoMP')}</th>
                  <th className="p-5 text-right" onClick={() => handleSort(sortControle, setSortControle, 'quantidadeTotal')}>Qtd {renderSortIcon(sortControle, 'quantidadeTotal')}</th>
                  <th className="p-5 text-center pr-8" onClick={() => handleSort(sortControle, setSortControle, 'status')}>Status {renderSortIcon(sortControle, 'status')}</th>
                </tr>
                <tr className="bg-slate-50/50">
                  <th className="px-5 py-2"></th>
                  <th className="px-5 py-2">
                    <input list="dl-c-proj" className="w-full bg-white border border-slate-200 rounded px-2 py-1 font-bold text-slate-600 outline-none focus:border-indigo-300" placeholder="Procurar..." value={filtrosControle.projeto} onChange={e => setFiltrosControle({...filtrosControle, projeto: e.target.value})} />
                    <datalist id="dl-c-proj">{optionsC.projeto.map(o => <option key={o} value={o} />)}</datalist>
                  </th>
                  <th className="px-5 py-2">
                    <input list="dl-c-pa" className="w-full bg-white border border-slate-200 rounded px-2 py-1 font-bold text-slate-600 outline-none focus:border-indigo-300" placeholder="Procurar..." value={filtrosControle.pa} onChange={e => setFiltrosControle({...filtrosControle, pa: e.target.value})} />
                    <datalist id="dl-c-pa">{optionsC.pa.map(o => <option key={o} value={o} />)}</datalist>
                  </th>
                  <th className="px-5 py-2">
                    <input list="dl-c-mp" className="w-full bg-white border border-slate-200 rounded px-2 py-1 font-bold text-slate-600 outline-none focus:border-indigo-300" placeholder="Procurar..." value={filtrosControle.mp} onChange={e => setFiltrosControle({...filtrosControle, mp: e.target.value})} />
                    <datalist id="dl-c-mp">{optionsC.mp.map(o => <option key={o} value={o} />)}</datalist>
                  </th>
                  <th className="px-5 py-2"></th>
                  <th className="px-5 py-2 pr-8 text-center"><select className="w-full bg-white border border-slate-200 rounded px-2 py-1 font-bold text-slate-600" value={filtrosControle.status} onChange={e => setFiltrosControle({...filtrosControle, status: e.target.value})}><option value="">Status</option><option value="ENVIADO">Trânsito</option><option value="RETORNO_PARCIAL">Parcial</option><option value="RETORNADO">Entregue</option></select></th>
                </tr>
              </thead><tbody className="divide-y divide-slate-100">
                {controleFiltrado.map((linha, idx) => (
                  <tr key={idx} className={`hover:bg-slate-50 transition-colors ${linha.isRateio ? 'bg-emerald-50/20' : ''}`}>
                    <td className="p-5 pl-8 font-bold text-slate-400 text-center"><Calendar className="w-3 h-3 mx-auto opacity-30" />{linha.remessa?.data_envio ? s(new Date(linha.remessa.data_envio).toLocaleDateString()) : '---'}</td>
                    <td className="p-5 font-black text-slate-800 uppercase tracking-tighter">
                      <div className="flex flex-col">
                        <span className={linha.isRateio ? 'text-emerald-600' : 'text-amber-600'}>{s(linha.remessa?.projeto)}</span>
                        {linha.isRateio && <span className="text-[8px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full w-fit mt-1 shadow-sm"><Link2 className="w-2 h-2 mr-1"/> RATEADO DE: {s(linha.origemProjeto)}</span>}
                      </div>
                    </td>
                    <td className="p-5 font-black text-blue-600 uppercase tracking-tighter">{s(linha.remessa?.produto_acabado)}</td>
                    <td className="p-5 font-black text-slate-700 uppercase tracking-tighter">{s(linha.codigoMP)}</td>
                    <td className="p-5 text-right font-black text-slate-800">{String(linha.quantidadeTotal)} {s(linha.um)}</td>
                    <td className="p-5 text-center pr-8">{linha.remessa?.status === 'RETORNADO' ? <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[8px] font-black uppercase">Interno</span> : <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-[8px] font-black uppercase">Externo</span>}</td>
                  </tr>
                ))}
                {controleFiltrado.length === 0 && <tr><td colSpan="6" className="p-20 text-center font-black text-slate-200 uppercase text-lg tracking-[0.2em] opacity-30">Sem registos encontrados</td></tr>}
              </tbody></table></div>
            </div>
          </div>
        )}

        {/* 4. ABA AUDITORIA (EXCEL STYLE) */}
        {abaAtiva === 'AUDITORIA' && isAdmin && (
          <div className="max-w-6xl mx-auto space-y-6 w-full animate-in fade-in">
             <div className="border-b-4 border-red-100 pb-4 flex justify-between items-end">
               <div><h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase leading-none">Auditoria de BOM</h2><p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">Divergências PCP vs BOM Original</p></div>
               <div className="flex gap-4">
                 <button onClick={() => setFiltrosAuditoria({projeto:'', pa:'', mp:'', status:''})} className="bg-white border-2 border-slate-100 text-slate-400 text-[10px] font-black uppercase px-4 py-2 rounded-xl hover:text-red-500 flex items-center shadow-sm"><XCircle className="w-3 h-3 mr-2"/> Limpar Filtros</button>
                 <button onClick={exportAuditoria} className="bg-emerald-600 text-white text-[10px] font-black uppercase px-4 py-2 rounded-xl hover:bg-emerald-700 flex items-center shadow-md"><FileSpreadsheet className="w-3 h-3 mr-2"/> Exportar Excel</button>
               </div>
             </div>
             <div className="bg-white rounded-[2rem] border-2 border-slate-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto"><table className="w-full text-left text-[11px] whitespace-nowrap"><thead className="bg-slate-50 border-b">
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer">
                    <th className="p-5 pl-8 text-center" onClick={() => handleSort(sortAuditoria, setSortAuditoria, 'data')}>Lançamento {renderSortIcon(sortAuditoria, 'data')}</th>
                    <th className="p-5" onClick={() => handleSort(sortAuditoria, setSortAuditoria, 'projeto')}>Projeto {renderSortIcon(sortAuditoria, 'projeto')}</th>
                    <th className="p-5" onClick={() => handleSort(sortAuditoria, setSortAuditoria, 'pa')}>Produto Final {renderSortIcon(sortAuditoria, 'pa')}</th>
                    <th className="p-5" onClick={() => handleSort(sortAuditoria, setSortAuditoria, 'codigoMP')}>Material Ausente {renderSortIcon(sortAuditoria, 'codigoMP')}</th>
                    <th className="p-5 text-center pr-8" onClick={() => handleSort(sortAuditoria, setSortAuditoria, 'resolvido')}>Status {renderSortIcon(sortAuditoria, 'resolvido')}</th>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <th className="px-5 py-2"></th>
                    <th className="px-5 py-2">
                      <input list="dl-a-proj" className="w-full bg-white border border-slate-200 rounded px-2 py-1 font-bold text-slate-600 outline-none focus:border-indigo-300" placeholder="Procurar..." value={filtrosAuditoria.projeto} onChange={e => setFiltrosAuditoria({...filtrosAuditoria, projeto: e.target.value})} />
                      <datalist id="dl-a-proj">{optionsC.projeto.map(o => <option key={o} value={o} />)}</datalist>
                    </th>
                    <th className="px-5 py-2">
                      <input list="dl-a-pa" className="w-full bg-white border border-slate-200 rounded px-2 py-1 font-bold text-slate-600 outline-none focus:border-indigo-300" placeholder="Procurar..." value={filtrosAuditoria.pa} onChange={e => setFiltrosAuditoria({...filtrosAuditoria, pa: e.target.value})} />
                      <datalist id="dl-a-pa">{optionsC.pa.map(o => <option key={o} value={o} />)}</datalist>
                    </th>
                    <th className="px-5 py-2">
                      <input list="dl-a-mp" className="w-full bg-white border border-slate-200 rounded px-2 py-1 font-bold text-slate-600 outline-none focus:border-indigo-300" placeholder="Procurar..." value={filtrosAuditoria.mp} onChange={e => setFiltrosAuditoria({...filtrosAuditoria, mp: e.target.value})} />
                      <datalist id="dl-a-mp">{optionsC.mp.map(o => <option key={o} value={o} />)}</datalist>
                    </th>
                    <th className="px-5 py-2 pr-8 text-center"><select className="w-full bg-white border border-slate-200 rounded px-2 py-1 font-bold text-slate-600 outline-none" value={filtrosAuditoria.status} onChange={e => setFiltrosAuditoria({...filtrosAuditoria, status: e.target.value})}><option value="">Status</option><option value="PENDENTE">Pendente</option><option value="RESOLVIDO">Regularizado</option></select></th>
                  </tr>
                </thead><tbody className="divide-y divide-slate-100">
                   {auditoriaFiltrada.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="p-5 pl-8 font-bold text-slate-400 text-center">{p.data ? s(new Date(p.data).toLocaleDateString()) : '---'}</td>
                        <td className="p-5 font-black text-amber-600 uppercase tracking-tighter">{s(p.projeto)}</td>
                        <td className="p-5 font-black text-slate-700 uppercase tracking-tighter">{s(p.pa)}</td>
                        <td className="p-5"><p className="font-black text-red-600 uppercase mb-1">{s(p.codigoMP)}</p><p className="text-[9px] text-slate-400 font-bold">{s(p.descricao)} • {String(p.quantidade)} {s(p.um)}</p></td>
                        <td className="p-5 text-center pr-8">
                           {p.resolvido ? (
                              <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-[9px] font-black uppercase flex items-center justify-center w-fit mx-auto border border-emerald-100 shadow-sm"><CheckCircle className="w-3 h-3 mr-1.5"/> Resolvido</div>
                           ) : (
                              <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-[9px] font-black uppercase flex items-center justify-center w-fit mx-auto border border-red-100 shadow-sm animate-pulse"><Clock className="w-3 h-3 mr-1.5"/> Pendente</div>
                           )}
                        </td>
                      </tr>
                   ))}
                   {auditoriaFiltrada.length === 0 && <tr><td colSpan="5" className="p-24 text-center font-black text-slate-200 uppercase text-lg tracking-[0.2em] opacity-30">Nenhuma divergência encontrada</td></tr>}
                </tbody></table></div>
             </div>
          </div>
        )}

        {/* 5. FILA DE EXPEDIÇÃO (LETRAS MAIORES) */}
        {abaAtiva === 'EXPEDICAO' && (
          <div className="flex flex-col md:flex-row gap-6 h-full animate-in fade-in">
             <div className="w-full md:w-1/3 bg-white rounded-3xl border-2 border-slate-50 flex flex-col h-[calc(100vh-10rem)] overflow-hidden shadow-sm">
                <div className="p-6 border-b bg-amber-50 flex justify-between items-center"><h2 className="font-black text-amber-900 text-lg uppercase tracking-wider flex items-center"><Clock className="w-5 h-5 mr-2" /> Fila Logística ({remessasPendentes.length})</h2><button onClick={fetchAllData} className="text-amber-600 hover:rotate-180 transition-all duration-500 p-2 hover:bg-amber-100 rounded-full"><RefreshCcw className="w-4 h-4"/></button></div>
                <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
                   {remessasPendentes.map(rem => (
                      <div key={rem.id} onClick={() => setRemessaSelecionada(rem)} className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${remessaSelecionada?.id === rem.id ? 'border-amber-400 bg-amber-50 shadow-md scale-[1.02]' : 'border-slate-50 hover:border-amber-100'}`}>
                         <span className="font-black text-amber-600 text-xs uppercase block mb-1 tracking-widest">BR: {s(rem.projeto)}</span>
                         <h4 className="font-black text-slate-800 text-2xl uppercase leading-tight tracking-tighter">{s(rem.produto_acabado)}</h4>
                         <span className="bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg text-[11px] font-black uppercase mt-4 inline-block shadow-sm">{s(rem.observacao)}</span>
                      </div>
                   ))}
                   {remessasPendentes.length === 0 && <div className="p-24 text-center font-black text-slate-200 uppercase text-lg tracking-[0.2em] opacity-30">Fila Vazia</div>}
                </div>
             </div>
             <div className="flex-1 bg-white rounded-3xl border-2 border-slate-50 h-[calc(100vh-10rem)] shadow-sm overflow-hidden flex flex-col">
                {remessaSelecionada ? (
                  <div className="p-10 space-y-8 overflow-y-auto custom-scrollbar h-full animate-in slide-in-from-right-4">
                     <div className="pb-6 border-b flex justify-between items-start">
                        <div>
                          <div className="bg-amber-600 text-white text-[9px] font-black px-3 py-1 rounded-full w-fit uppercase mb-3 tracking-widest">OP PROJETO: {s(remessaSelecionada.projeto)}</div>
                          <h3 className="text-4xl font-black text-slate-800 uppercase leading-none tracking-tighter">{s(remessaSelecionada.produto_acabado)}</h3>
                          {remessaSelecionada.obs_expedicao && <div className="mt-6 p-5 bg-indigo-50 border-l-8 border-indigo-500 rounded-r-2xl shadow-sm"><p className="text-[10px] font-black text-indigo-700 uppercase mb-1">Nota Urgente PCP:</p><p className="text-lg font-bold text-slate-700 italic leading-snug">"{s(remessaSelecionada.obs_expedicao)}"</p></div>}
                        </div>
                        <button onClick={() => setRemessaSelecionada(null)} className="text-slate-300 hover:text-red-500 font-black text-xl transition-all">&times;</button>
                     </div>
                     <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center"><Truck className="w-3 h-3 mr-1"/> Transporte</label><input placeholder="Rodoviário / Aéreo" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-4 font-black outline-none focus:border-amber-400 shadow-sm" value={formExpedicao.transporte} onChange={e => setFormExpedicao({...formExpedicao, transporte: e.target.value})} /></div>
                           <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center"><PackageOpen className="w-3 h-3 mr-1"/> Transportadora</label><input placeholder="Nome Empresa" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-4 font-black outline-none focus:border-amber-400 shadow-sm" value={formExpedicao.transportadora} onChange={e => setFormExpedicao({...formExpedicao, transportadora: e.target.value})} /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center"><Boxes className="w-3 h-3 mr-1"/> Volumes</label><input type="number" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-4 font-black outline-none shadow-sm" value={formExpedicao.quantidade} onChange={e => setFormExpedicao({...formExpedicao, quantidade: e.target.value})} /></div>
                           <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center"><Weight className="w-3 h-3 mr-1"/> Peso Total</label><input className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-4 font-black outline-none shadow-sm" value={formExpedicao.pesoTotal} onChange={e => setFormExpedicao({...formExpedicao, pesoTotal: e.target.value})} /></div>
                           <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center"><Calendar className="w-3 h-3 mr-1"/> Data Saída</label><input type="date" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-4 font-black outline-none focus:border-amber-400 shadow-sm" value={formExpedicao.dataSaida} onChange={e => setFormExpedicao({...formExpedicao, dataSaida: e.target.value})} /></div>
                        </div>
                        <div className="space-y-1"><label className="text-[10px] font-black text-amber-600 uppercase ml-2 flex items-center"><MapPin className="w-3 h-3 mr-1"/> Destinatário Final</label><input placeholder="Destino" className="w-full bg-amber-50 border-2 border-amber-100 rounded-xl px-4 py-4 font-black outline-none focus:border-amber-400 shadow-sm" value={formExpedicao.destinatario} onChange={e => setFormExpedicao({...formExpedicao, destinatario: e.target.value})} /></div>
                     </div>
                     <button onClick={concluirExpedicao} className="w-full bg-slate-900 text-white font-black py-6 rounded-[2rem] shadow-2xl hover:bg-black transition-all text-lg flex items-center justify-center gap-4 hover:-translate-y-1 shadow-indigo-100"><FileSpreadsheet className="w-7 h-7" /> Gerar Planilha SGQ & Finalizar</button>
                  </div>
                ) : ( <div className="h-full flex items-center justify-center font-black text-slate-100 uppercase tracking-[0.4em] flex-col p-10 text-center"><Truck className="w-32 h-32 mb-8 opacity-5"/><p className="text-xl px-10">Aguardando Seleção de Remessa</p></div> )}
             </div>
          </div>
        )}

        {/* RETORNO DE PEÇAS E MODAL (INCLUÍDOS NO FLOW CORRETO) */}
        {abaAtiva === 'FORNECEDORES' && (
           <div className="max-w-5xl mx-auto space-y-6 w-full animate-in fade-in">
              <div className="flex justify-between items-end mb-6">
                <div><h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase leading-none">Gestão de Retornos de Peças</h2><p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">Dê entrada em materiais vindos de prestadores externos</p></div>
                <div className="relative w-64">
                   <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                   <input placeholder="Filtrar por BR..." className="w-full bg-white border-2 border-slate-100 shadow-sm rounded-xl pl-9 pr-4 py-2 font-black text-xs outline-none focus:border-amber-400 transition-all" value={buscaFornecedor} onChange={e => setBuscaFornecedor(e.target.value)} />
                </div>
              </div>
              <div className="space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2 custom-scrollbar">
                 {remessasFora.filter(r => !buscaFornecedor || s(r.projeto).toUpperCase().includes(buscaFornecedor.toUpperCase())).map(rem => (
                    <div key={rem.id} className={`p-8 rounded-[2rem] border-2 bg-white flex justify-between items-center transition-all ${rem.status === 'RETORNADO' ? 'opacity-40 grayscale shadow-none' : 'shadow-md border-slate-50 hover:border-amber-100'}`}>
                       <div className="space-y-1">
                          <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">CLIENTE: {s(rem.cliente || 'Interno')}</span>
                          <h4 className="font-black text-2xl text-slate-800 uppercase tracking-tight">{s(rem.projeto)} • <span className="text-indigo-600 font-black">{s(rem.observacao || 'Industrialização')}</span></h4>
                          <div className="flex gap-6 mt-3">
                            <div className="flex flex-col"><span className="text-[9px] font-black text-slate-400 uppercase">Enviado</span><span className="font-black text-slate-700">{String(rem.quantidade_op)} Pçs</span></div>
                            <div className="flex flex-col"><span className="text-[9px] font-black text-indigo-400 uppercase">Recebido</span><span className="font-black text-indigo-600">{String(rem.pecas_recebidas || 0)} Pçs</span></div>
                            <div className="flex flex-col"><span className="text-[9px] font-black text-amber-500 uppercase">Saldo</span><span className="font-black text-amber-600">{Number(rem.quantidade_op) - Number(rem.pecas_recebidas || 0)} Pçs</span></div>
                          </div>
                       </div>
                       {rem.status !== 'RETORNADO' ? (
                          <button onClick={() => { setRemessaParaRetorno(rem); setQtdPecasRetornando(''); }} className="bg-amber-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all flex items-center">Confirmar Entrada <ArrowLeftRight className="w-4 h-4 ml-2"/></button>
                       ) : ( <div className="text-emerald-600 font-black flex items-center uppercase text-[10px] tracking-widest bg-emerald-50 px-6 py-4 rounded-2xl border border-emerald-100"><CheckCircle className="w-5 h-5 mr-2" /> OP Finalizada</div> )}
                    </div>
                 ))}
                 {remessasFora.length === 0 && <div className="p-24 text-center font-black text-slate-200 uppercase text-lg tracking-[0.2em] opacity-30">Sem remessas externas</div>}
              </div>
           </div>
        )}

        {remessaParaRetorno && (
           <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
              <div className="bg-white rounded-[2.5rem] w-full max-w-4xl shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[90vh]">
                 <div className="p-8 border-b bg-slate-50 flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Entrada de Peças: {s(remessaParaRetorno.projeto)}</h2>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{s(remessaParaRetorno.observacao)} • {s(remessaParaRetorno.produto_acabado)}</p>
                    </div>
                    <button onClick={() => setRemessaParaRetorno(null)} className="text-slate-400 text-2xl font-black hover:text-red-500 transition-all">&times;</button>
                 </div>
                 <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10 overflow-y-auto custom-scrollbar">
                    <div className="space-y-6">
                       <div className="bg-indigo-50 border-2 border-indigo-100 rounded-3xl p-10 shadow-inner text-center">
                          <label className="text-[11px] font-black text-indigo-900 uppercase block mb-6 tracking-widest">Qtd de peças (PA) a receber agora:</label>
                          <input type="text" className="w-full bg-white border-2 border-indigo-200 rounded-3xl px-6 py-8 font-black text-7xl text-indigo-700 text-center outline-none focus:ring-8 focus:ring-indigo-100 transition-all shadow-xl" value={qtdPecasRetornando} onChange={e => {
                             // Permite escrever vírgula antes de processar
                             setQtdPecasRetornando(e.target.value);
                          }} />
                          <div className="mt-8 flex justify-center gap-10">
                            <div className="text-center"><p className="text-[10px] font-black text-slate-400 uppercase">Original</p><p className="text-xl font-black text-slate-700">{String(remessaParaRetorno.quantidade_op)} Pçs</p></div>
                            <div className="text-center"><p className="text-[10px] font-black text-amber-500 uppercase">Saldo Rua</p><p className="text-xl font-black text-amber-600">{Number(remessaParaRetorno.quantidade_op) - Number(remessaParaRetorno.pecas_recebidas || 0)} Pçs</p></div>
                          </div>
                       </div>
                    </div>
                    <div className="border-2 border-slate-50 rounded-3xl overflow-hidden shadow-sm flex flex-col bg-white">
                      <div className="p-5 bg-slate-50 border-b font-black text-[10px] text-slate-500 uppercase tracking-widest flex items-center justify-between"><span>Crédito de Stock (Matéria-Prima)</span><Calculator className="w-4 h-4 opacity-30"/></div>
                      <table className="w-full text-left text-[11px]"><thead className="bg-slate-100 border-b"><tr><th className="p-4">Material MP</th><th className="p-4 text-center">Entrada no Stock</th></tr></thead><tbody className="divide-y divide-slate-50">
                       {(Array.isArray(remessaParaRetorno.itens) ? remessaParaRetorno.itens : []).map((it, idx) => {
                          const valDigitado = parseNumBR(qtdPecasRetornando);
                          const ratio = valDigitado / Number(remessaParaRetorno.quantidade_op);
                          const calc = Number((it.quantidadeTotal * ratio).toFixed(4));
                          return (<tr key={idx} className="hover:bg-slate-50 transition-colors"><td className="p-4 font-bold uppercase text-slate-700">{s(it.codigoMP)}</td><td className="p-4 text-center font-black text-emerald-600 text-sm">+{calc} {s(it.um)}</td></tr>);
                       })}
                    </tbody></table></div>
                 </div>
                 <div className="p-8 bg-slate-50 border-t flex justify-end gap-6 items-center">
                    <button onClick={processarRetornoParcial} disabled={!qtdPecasRetornando || isLoading} className="bg-indigo-600 text-white px-14 py-5 rounded-2xl font-black uppercase text-sm shadow-2xl disabled:opacity-20 transition-all hover:bg-indigo-700 hover:-translate-y-1 shadow-indigo-100">Confirmar Recebimento</button>
                 </div>
              </div>
           </div>
        )}

        {/* 7. UPLOAD ESTOQUE E GESTÃO DE ACESSOS */}
        {abaAtiva === 'UPLOAD_ESTOQUE' && (
          <div className="max-w-3xl mx-auto space-y-6 text-center w-full animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-4xl font-black text-slate-800 tracking-tighter uppercase leading-none">Sincronização ERP</h2>
            <div className="bg-white rounded-[3rem] p-16 border-2 border-slate-100 shadow-xl flex flex-col items-center">
              <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center mb-8 shadow-inner"><UploadCloud className="w-16 h-16 text-emerald-500" /></div>
              <h3 className="text-2xl font-black text-slate-800 mb-4 uppercase tracking-tighter">Injetar Planilha Mestre</h3>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-10 max-w-sm leading-relaxed text-center">Atualize Produtos e Stock Físico com suporte a vírgulas e decimais.</p>
              
              <label className={`inline-flex items-center justify-center px-16 py-8 rounded-[2rem] font-black text-xl transition-all cursor-pointer shadow-2xl ${isLoading ? 'bg-slate-100 text-slate-300 shadow-none cursor-default' : 'bg-emerald-500 text-white hover:bg-emerald-600 hover:-translate-y-2 active:scale-95 shadow-emerald-100'}`}>
                {isLoading ? <><Loader2 className="w-8 h-8 mr-3 animate-spin" /> SINCRONIZANDO ({uploadProgress}%)</> : <><Database className="w-8 h-8 mr-3" /> INICIAR SINCRONIZAÇÃO</>}
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
                        if(listProd.length === 0) throw new Error("Ficheiro inválido.");
                        setUploadProgress(40);
                        for (let i = 0; i < listProd.length; i += 100) await supabase.from('produtos').upsert(listProd.slice(i, i + 100), { onConflict: 'codigo_pa' });
                        setUploadProgress(70);
                        for (let i = 0; i < listStock.length; i += 100) await supabase.from('estoque_mp').upsert(listStock.slice(i, i + 100), { onConflict: 'codigo_mp' });
                        setUploadProgress(100); setSucesso("Stock sincronizado!");
                      } catch(err) { setErro("Erro Sync: " + err.message); }
                      finally { setIsLoading(false); setUploadProgress(0); fetchAllData(); }
                   };
                   reader.readAsArrayBuffer(file);
                }} />
              </label>
            </div>
          </div>
        )}

        {abaAtiva === 'GESTAO_USUARIOS' && isAdmin && (
           <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in">
              <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Administração de Acessos</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="bg-white rounded-[2rem] p-8 border-2 border-slate-100 shadow-sm">
                   <h3 className="font-black text-slate-800 flex items-center text-lg mb-6">{isEditingUser ? <Settings className="w-5 h-5 mr-2 text-indigo-600" /> : <UserPlus className="w-5 h-5 mr-2 text-indigo-600" />} {isEditingUser ? 'Editar Acesso' : 'Novo Funcionário'}</h3>
                   <form onSubmit={salvarUsuario} className="space-y-4">
                      <input required placeholder="Nome" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:border-indigo-400" value={novoUsuario.nome} onChange={e => setNovoUsuario({...novoUsuario, nome: e.target.value})} />
                      <input required type="email" placeholder="E-mail" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none disabled:opacity-50 focus:border-indigo-400" value={novoUsuario.email} disabled={isEditingUser} onChange={e => setNovoUsuario({...novoUsuario, email: e.target.value})} />
                      <input required placeholder="Senha" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:border-indigo-400" value={novoUsuario.senha} onChange={e => setNovoUsuario({...novoUsuario, senha: e.target.value})} />
                      <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-black text-slate-700" value={novoUsuario.perfil} onChange={e => setNovoUsuario({...novoUsuario, perfil: e.target.value})}>
                        <option value="PCP">PCP</option><option value="EXPEDICAO">EXPEDIÇÃO</option><option value="ADMIN">ADMINISTRADOR</option>
                      </select>
                      <button type="submit" className={`w-full text-white font-black py-4 rounded-2xl shadow-lg bg-indigo-600 uppercase tracking-widest text-xs mt-4 hover:bg-indigo-700 transition-all`}>Gravar Dados</button>
                   </form>
                </div>
                <div className="lg:col-span-2 bg-white rounded-[2rem] border-2 border-slate-100 overflow-hidden shadow-sm">
                   <div className="p-6 bg-slate-50 border-b flex items-center justify-between font-black text-slate-800 uppercase tracking-widest text-xs">Utilizadores Ativos ({usuariosDb.length})</div>
                   <table className="w-full text-left text-xs"><tbody className="divide-y divide-slate-100">
                      {usuariosDb.map(u => (
                        <tr key={u.email} className="hover:bg-slate-50 transition-colors border-b">
                           <td className="p-4 pl-8"><p className="font-black text-slate-800">{s(u.nome)}</p><p className="text-[10px] text-slate-400 font-bold">{s(u.email)}</p></td>
                           <td className="p-4"><span className={`px-3 py-1 rounded-full font-black text-[9px] uppercase shadow-sm ${u.perfil === 'ADMIN' ? 'bg-red-100 text-red-600' : u.perfil === 'EXPEDICAO' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>{s(u.perfil)}</span></td>
                           <td className="p-4 text-center pr-8 flex items-center justify-center gap-2">
                              <button onClick={() => { setNovoUsuario(u); setIsEditingUser(true); }} className="p-2 text-indigo-400 hover:bg-indigo-100 rounded-lg"><Settings className="w-4 h-4"/></button>
                              <button onClick={() => excluirUsuario(u.email)} className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                           </td>
                        </tr>
                      ))}
                   </tbody></table>
                </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
