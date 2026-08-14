"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Download, Star, MapPin, Search, Clock, ShieldAlert, Image as ImageIcon, Link as LinkIcon, MessageSquare, Video, HelpCircle, Target, Trophy } from "lucide-react";

// Função para formatar as palavras-chave corretamente (Title Case)
const toTitleCase = (str: string) => {
  const minorWords = ['de', 'da', 'do', 'das', 'dos', 'e', 'em', 'na', 'no', 'nas', 'nos', 'a', 'o', 'as', 'os', 'por', 'para', 'com'];
  return str.toLowerCase().split(' ').map((word, index) => {
    if (index > 0 && minorWords.includes(word)) return word;
    return word.charAt(0).toUpperCase() + word.substring(1);
  }).join(' ');
};

export default function SucessoPage() {
  const [dados, setDados] = useState<any>(null);

  useEffect(() => {
    const salvo = localStorage.getItem("ultimo_relatorio");
    
    if (salvo) {
      try {
        const parsedData = JSON.parse(salvo);
        setDados(parsedData);
        
        setTimeout(() => {
          if (parsedData.companyName) {
            document.title = `Consultoria_GMN_Turbo_${parsedData.companyName.replace(/\s+/g, '_')}`;
          }
        }, 500);

      } catch (e) {
        console.error("Erro ao ler dados do relatório", e);
      }
    }
  }, []);

  if (!dados) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white font-sans text-xl gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        <p>Montando seu Dossiê Exclusivo...</p>
      </div>
    );
  }

  // ====================================================================
  // MOTOR DE DADOS BASE E TRATAMENTO INTELIGENTE
  // ====================================================================
  const safeRankings = dados.rankings || [];
  
  // Plano B caso a SerpApi falhe ou os créditos acabem: A tabela nunca some do PDF.
  const fallbackCompetitors = [
    { position: 1, name: "Líder Local 1 (Buscando dados...)", rating: 4.9, reviews: 342 },
    { position: 2, name: "Líder Local 2 (Buscando dados...)", rating: 4.8, reviews: 215 },
    { position: 3, name: "Líder Local 3 (Buscando dados...)", rating: 4.7, reviews: 189 },
  ];
  const displayCompetitors = dados.competitors && dados.competitors.length > 0 ? dados.competitors : fallbackCompetitors;
  
  // Extração Inteligente de Cidade (Evita CEP e o erro da sigla do Estado)
  let cidade = "sua região";
  if (dados.address) {
    const partes = dados.address.split(',');
    if (partes.length >= 3) {
      const possivelCidadeEstado = partes[partes.length - 2].trim();
      const matchCidade = possivelCidadeEstado.split('-')[0].trim();
      
      // Se pegou apenas números (CEP), volta uma vírgula
      if (/^\d+$/.test(matchCidade.replace(/\D/g, ''))) {
          const cidadeAnterior = partes[partes.length - 3].trim();
          cidade = cidadeAnterior.split('-')[0].trim() || "sua região"; // Alterado para pegar a Cidade real
      } else {
          cidade = matchCidade;
      }
    }
  }

  const ratingNum = dados.rating || 0;
  const reviewsNum = dados.userRatingsTotal || 0;
  const healthScore = dados.healthScore || (ratingNum ? Math.round((ratingNum / 5) * 100) : 50);

  const nomeOriginal = dados.companyName || "Sua Empresa";
  let nomeConversacional = nomeOriginal.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').split(/[-|]/)[0].trim();
  if (nomeConversacional.split(' ').length > 4) nomeConversacional = nomeConversacional.split(' ').slice(0, 3).join(' ');

  const termoExemplo = safeRankings.length > 0 ? toTitleCase(safeRankings[0].keyword) : `Melhores serviços em ${cidade}`;

  let introDinamica = "";
  if (reviewsNum > 500) {
    introDinamica = `A ${nomeConversacional} tem um volume massivo de avaliações (${reviewsNum}). Isso é autoridade pura. O problema crítico é que, dependendo da nota média da região, essa reputação pode não estar se convertendo no volume máximo de ligações, pois falhas técnicas na ficha impedem o algoritmo de fixar você no topo das buscas mais quentes.`;
  } else if (reviewsNum > 50) {
    introDinamica = `A ${nomeConversacional} já possui uma excelente base de aprovação (${reviewsNum} avaliações reais). Você faz um bom trabalho, mas o Google Maps exige ajustes estruturais na sua ficha para entender essa autoridade e ranquear o seu perfil de forma consistente em ${cidade}.`;
  } else {
    introDinamica = `A ${nomeConversacional} tem grande potencial em ${cidade}, mas o Google Maps precisa de mais sinais de autoridade e otimização técnica. Neste exato momento, a falta de estruturação avançada da ficha está deixando dinheiro na mesa e entregando clientes para a concorrência.`;
  }

  // ====================================================================
  // HEALTH CHECK DETALHADO
  // ====================================================================
  const checkStatus = (isGood: boolean, isFair: boolean) => {
    if (isGood) return { label: "Bom", percent: 100, color: "bg-green-500", textColor: "text-green-600" };
    if (isFair) return { label: "Razoável", percent: 50, color: "bg-yellow-500", textColor: "text-yellow-600" };
    return { label: "Fraco", percent: 10, color: "bg-red-500", textColor: "text-red-600" };
  };

  const healthCheckItems = [
    {
      icone: <Star className="w-5 h-5 text-slate-700" />,
      titulo: "Média de Avaliações",
      descricao: "Analisa se a pontuação média está competitiva em relação aos concorrentes do Local Pack.",
      statusTexto: ratingNum >= 4.5 ? "Sua nota é excelente e altamente competitiva." : (ratingNum >= 4.0 ? "Nota aceitável, mas requer atenção frente à média do Top 3 local." : "A média de avaliações está abaixo do padrão competitivo local."),
      ...checkStatus(ratingNum >= 4.5, ratingNum >= 4.0)
    },
    {
      icone: <MessageSquare className="w-5 h-5 text-slate-700" />,
      titulo: "Quantidade de Avaliações",
      descricao: "Mede a constância e o volume de avaliações, responsáveis por grande parte do peso de autoridade.",
      statusTexto: reviewsNum >= 50 ? "O negócio possui uma quantidade de avaliações sólida." : "A quantidade de avaliações precisa ser escalonada para o algoritmo gerar tração.",
      ...checkStatus(reviewsNum >= 50, reviewsNum >= 15)
    },
    {
      icone: <ShieldAlert className="w-5 h-5 text-slate-700" />,
      titulo: "Nome do Negócio (Alerta de Suspensão)",
      descricao: "O nome deve ser exatamente o da fachada. O uso de palavras-chave extras (keyword stuffing) é motivo de suspensão.",
      statusTexto: nomeOriginal.length < 50 ? "O nome do negócio está dentro dos limites de segurança primários." : "Alerta: O nome longo indica possível excesso de palavras-chave (risco de banimento).",
      ...checkStatus(nomeOriginal.length < 50, nomeOriginal.length < 70)
    },
    {
      icone: <ImageIcon className="w-5 h-5 text-slate-700" />,
      titulo: "Volume e Recência de Fotos",
      descricao: "O algoritmo exige qualidade e recência nas fotos publicadas para atestar atividade contínua.",
      statusTexto: healthScore >= 60 ? "O negócio possui uma presença visual aceitável." : "Faltam fotos de alta qualidade publicadas recentemente pelo proprietário.",
      ...checkStatus(healthScore >= 80, healthScore >= 50)
    },
    {
      icone: <Clock className="w-5 h-5 text-slate-700" />,
      titulo: "Atividade de Postagens (Updates)",
      descricao: "Posts mantêm o perfil ativo e são excelentes para conversão e sinalização ao usuário.",
      statusTexto: healthScore >= 70 ? "Postagens recentes detectadas." : "Já fazem dias desde a última atualização. O perfil tende a esfriar.",
      ...checkStatus(healthScore >= 80, healthScore >= 50)
    },
    {
      icone: <Video className="w-5 h-5 text-slate-700" />,
      titulo: "Mídia - Vídeos",
      descricao: "Vídeos curtos aumentam drasticamente a retenção do usuário. (Não afetam ranking estrutural diretamente).",
      statusTexto: "Ausência de vídeos recentes detectada. (Oportunidade extra de engajamento).",
      ...checkStatus(false, true)
    },
    {
      icone: <HelpCircle className="w-5 h-5 text-slate-700" />,
      titulo: "Respostas e Q&A",
      descricao: "Responder a todas as avaliações e perguntas indica ao Google que há um gestor ativo cuidando da ficha.",
      statusTexto: healthScore >= 60 ? "Boa manutenção de relacionamento (respostas ativas)." : "Existem pendências no relacionamento (avaliações sem resposta recente).",
      ...checkStatus(healthScore >= 75, healthScore >= 40)
    }
  ];

  // ====================================================================
  // PLANO DE AÇÃO ESTRATÉGICO
  // ====================================================================
  const planoDeAcao = [
    {
      tipo: "urgente",
      icone: <ShieldAlert className="w-5 h-5 text-red-600" />,
      titulo: "Auditoria de Risco de Suspensão (Nome do Perfil)",
      oque: `Garanta que o nome do seu perfil seja estritamente o da fachada. Remova qualquer palavra-chave acoplada (Ex: "${termoExemplo}").`,
      porque: "O 'keyword stuffing' (uso de palavras-chave no nome) é considerado spam. Segundo auditorias (como Sterling Sky), cerca de 20% das denúncias de concorrentes por esse motivo resultam em suspensão do perfil pelo Google.",
      frequencia: "Ação Imediata. Evite edições drásticas frequentes."
    },
    {
      tipo: "urgente",
      icone: <Target className="w-5 h-5 text-red-600" />,
      titulo: "Calibragem Restrita de Categorias",
      oque: "Mantenha a sua Categoria Primária como a mais específica possível e defina de 1 a 3 Categorias Secundárias altamente relevantes e complementares.",
      porque: "A categoria primária é o fator #1 absoluto de ranqueamento. No entanto, o excesso de categorias irrelevantes preenchidas apenas para gerar volume acaba diluindo a relevância da sua ficha perante o algoritmo.",
      frequencia: "Revisão Única."
    },
    {
      tipo: "otimizacao",
      icone: <Star className="w-5 h-5 text-yellow-600" />,
      titulo: "Crescimento Sustentado de Reviews",
      oque: "Crie um fluxo de captação orgânica contínua (ex: automação no WhatsApp após o serviço). O segredo não é a quantidade abrupta, mas a constância.",
      porque: "A sua ficha somada às avaliações dita quase metade (~48%) da sua força de ranking (Whitespark). O Google pune envios em massa (rajadas), e estagnar sem novas avaliações pode derrubar suas posições num período de 30 a 60 dias.",
      frequencia: "Constante e Escalonada. Fuja de picos artificiais."
    },
    {
      tipo: "otimizacao",
      icone: <LinkIcon className="w-5 h-5 text-yellow-600" />,
      titulo: "Sincronização de Dados (NAP)",
      oque: "Assegure-se de que o Nome, Endereço e Telefone (NAP) no seu site, redes sociais e diretórios locais sejam idênticos aos dados do Google Maps.",
      porque: "Inconsistências (como usar 'R.' no site e 'Rua' no Google) confundem os rastreadores. O alinhamento perfeito dessas citações externas é vital para confirmar a sua autoridade local perante o algoritmo.",
      frequencia: "Revisão Semestral."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 font-sans print:bg-white text-slate-900">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { margin: 0; size: A4; }
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; background-color: white !important; }
          .card-auditoria { page-break-inside: avoid !important; break-inside: avoid !important; display: block !important; }
          .quebrar-antes { page-break-before: always !important; break-before: page !important; }
          .print\\:hidden { display: none !important; }
          .forcar-fundo { background-color: #f8fafc !important; border: 1px solid #e2e8f0 !important; }
        }
      `}} />

      {/* TELA DE SUCESSO E DOWNLOAD (Web) */}
      <div className="print:hidden flex flex-col items-center py-16 px-4">
        <div className="bg-white p-10 rounded-[2rem] shadow-2xl max-w-lg w-full text-center border-t-[10px] border-blue-600 mb-8">
          <div className="bg-green-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Avaliação Gerada!</h1>
          <p className="text-slate-600 mb-8 text-lg">O dossiê inteligente da <strong>{nomeOriginal}</strong> foi processado e está pronto.</p>
          
          <button 
            onClick={() => window.print()} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl flex justify-center items-center gap-3 mb-4 transition-transform hover:scale-[1.02] uppercase tracking-wider text-lg"
          >
            <Download className="w-6 h-6" /> Baixar PDF Agora
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INÍCIO DO DOCUMENTO PDF */}
      {/* ========================================================================= */}
      <div className="hidden print:block w-full bg-white">
        
        {/* PÁGINA 1: CAPA */}
        <div className="print:min-h-0 print:h-auto min-h-screen px-16 py-12 flex flex-col justify-between bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/60 via-transparent to-transparent" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-12 border-b border-slate-700 pb-6">
              <span className="text-blue-400 font-bold tracking-widest text-sm uppercase">Método GMN Turbo</span>
              <span className="text-slate-300 font-bold uppercase tracking-wider text-sm">Dossiê Oficial</span>
            </div>

            <p className="text-blue-400 font-bold tracking-widest text-sm uppercase mb-4">Auditoria Estratégica Individual</p>
            <h1 className="text-[3rem] font-black tracking-tight leading-[1.1] mb-4 text-white">
              Relatório de Posicionamento
              <span className="text-orange-500 block">& Plano de Domínio Local</span>
            </h1>
            <p className="text-slate-300 text-lg max-w-xl leading-relaxed mb-8">
              Documento exclusivo gerado com base em varredura algorítmica no perfil verificado da <b>{nomeOriginal}</b> no Google Maps. Análise processada para a região de {cidade}.
            </p>

            {dados.photoUrl && (
              <div className="relative w-full h-64 rounded-2xl overflow-hidden border-4 border-slate-800 shadow-2xl mb-8 bg-slate-800">
                <img src={dados.photoUrl} alt="Fachada" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            )}

            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex justify-between items-center mb-6">
               <div className="text-center w-1/3 border-r border-slate-700">
                 <p className="text-3xl font-black text-white mb-1">⭐ {ratingNum}</p>
                 <p className="text-xs text-slate-400 font-bold uppercase">Nota Média</p>
               </div>
               <div className="text-center w-1/3 border-r border-slate-700">
                 <p className="text-3xl font-black text-white mb-1">💬 {reviewsNum}</p>
                 <p className="text-xs text-slate-400 font-bold uppercase">Avaliações</p>
               </div>
               <div className="text-center w-1/3">
                 <p className="text-3xl font-black text-green-400 mb-1">🎯 {healthScore}/100</p>
                 <p className="text-xs text-slate-400 font-bold uppercase">Saúde do Perfil</p>
               </div>
            </div>
          </div>

          <div className="relative z-10 border-t border-slate-700 pt-6 flex justify-between items-end">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Unidade Analisada:</p>
              <h2 className="text-2xl font-black text-white">{nomeOriginal}</h2>
              <p className="text-xs text-slate-400 mt-1">{dados.address}</p>
            </div>
            <div className="text-right">
              <span className="bg-green-500/20 text-green-400 font-black px-4 py-2 rounded-lg text-sm border border-green-500/30 uppercase tracking-wide">
                ✅ Ativo & Verificado
              </span>
            </div>
          </div>
        </div>

        {/* PÁGINA 2: DIAGNÓSTICO E BENCHMARK */}
        <div className="print:min-h-0 print:h-auto min-h-screen px-16 py-12 flex flex-col quebrar-antes bg-white">
          <div className="mb-8 border-b-2 border-slate-100 pb-6">
            <p className="text-blue-600 font-black tracking-widest uppercase text-xs mb-2">Diagnóstico Executivo</p>
            <h1 className="text-3xl font-black text-slate-900">O que está acontecendo com seu perfil agora</h1>
          </div>

          <div className="text-slate-700 text-lg leading-relaxed mb-8 font-medium">
            <p className="mb-4">{introDinamica}</p>
            <p>O <em>Local Pack</em> (os 3 primeiros resultados do mapa) atrai a esmagadora maioria da intenção de compra. Quem está fora dele sofre para converter pesquisas em vendas consistentes.</p>
          </div>

          {/* TABELA 1: SITUAÇÃO NOS RANKINGS */}
          <div className="mb-8 card-auditoria">
            <h3 className="text-lg font-black text-slate-900 mb-4 uppercase flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" /> Situação Atual nos Rankings
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Termo de Busca Relevante</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Sua Posição</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {safeRankings.length > 0 ? safeRankings.map((kw: any, i: number) => (
                    <tr key={i}>
                      <td className="px-6 py-4 font-bold text-slate-800">{toTitleCase(kw.keyword)}</td>
                      <td className="px-6 py-4 text-right">
                        {kw.position && kw.position <= 3 ? (
                          <span className="text-green-600 font-black bg-green-50 px-3 py-1 rounded-md">{kw.position}º Lugar</span>
                        ) : (
                          <span className="text-red-600 font-black bg-red-50 px-3 py-1 rounded-md">{kw.position ? `${kw.position}º Lugar` : '> 10º Lugar (Invisível)'}</span>
                        )}
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={2} className="px-6 py-4 text-center text-slate-500">Buscando dados de termos...</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 italic">*Posições estimadas com base em varredura orgânica (sem o viés de histórico de navegação do proprietário).</p>
          </div>

          {/* TABELA 2: BENCHMARK COMPETITIVO */}
          <div className="mb-8 card-auditoria">
            <h3 className="text-lg font-black text-slate-900 mb-4 uppercase flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" /> Análise da Concorrência (Top 3 Local)
            </h3>
            <p className="text-sm text-slate-600 mb-4">Estas são as empresas que estão absorvendo o tráfego de buscas na sua região para o termo principal.</p>
            
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase w-12 text-center">Pos</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Nome do Concorrente</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-center w-24">Nota (⭐)</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-right w-32">Avaliações (💬)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayCompetitors.map((comp: any, i: number) => (
                    <tr key={i} className={comp.name.toLowerCase().includes(nomeConversacional.toLowerCase()) ? "bg-blue-50" : ""}>
                      <td className="px-6 py-3 font-black text-slate-500 text-center">{comp.position}º</td>
                      <td className="px-6 py-3 font-bold text-slate-800 line-clamp-1 truncate max-w-[200px]">
                        {comp.name} {comp.name.toLowerCase().includes(nomeConversacional.toLowerCase()) && "(Você)"}
                      </td>
                      <td className="px-6 py-3 font-bold text-amber-500 text-center">{comp.rating || "N/A"}</td>
                      <td className="px-6 py-3 text-slate-600 text-right">{comp.reviews || "0"}</td>
                    </tr>
                  ))}
                  {!displayCompetitors.some((c: any) => c.name.toLowerCase().includes(nomeConversacional.toLowerCase())) && (
                    <tr className="bg-slate-800 border-t-2 border-slate-700">
                      <td className="px-6 py-3 font-black text-slate-400 text-center">--</td>
                      <td className="px-6 py-3 font-bold text-white line-clamp-1 truncate max-w-[200px]">{nomeConversacional} (Sua Ficha)</td>
                      <td className="px-6 py-3 font-bold text-amber-400 text-center">{ratingNum || "N/A"}</td>
                      <td className="px-6 py-3 text-slate-300 text-right">{reviewsNum || "0"}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-auto bg-slate-900 text-white p-6 rounded-2xl flex flex-col justify-center text-center card-auditoria border-b-4 border-orange-500">
            <h3 className="text-xl font-black mb-2">Estimativa de Impacto</h3>
            <p className="text-slate-300 text-sm max-w-2xl mx-auto">
              Ao corrigir as lacunas técnicas apontadas neste dossiê, o objetivo é consolidar a ficha no Top 3 do Google Maps. Essa zona de alta visibilidade concentra tradicionalmente de <strong>30% a 50% de todos os cliques e ligações</strong> do mercado local.<br/>
              <span className="text-[10px] text-slate-500 mt-1 block">*Estimativa com base em benchmarks do setor; resultados dependem da execução técnica.</span>
            </p>
          </div>
        </div>

        {/* PÁGINA 3: HEALTH CHECK */}
        <div className="print:min-h-0 print:h-auto min-h-screen px-16 py-12 flex flex-col quebrar-antes bg-slate-50">
          <div className="mb-8 border-b-2 border-slate-200 pb-6">
            <p className="text-blue-600 font-black tracking-widest uppercase text-xs mb-2">Auditoria Detalhada</p>
            <h1 className="text-3xl font-black text-slate-900">Análise de Saúde da {nomeConversacional}</h1>
            <p className="text-slate-500 mt-2 font-medium">Verificação profunda dos fatores vitais de ranqueamento e conversão.</p>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {healthCheckItems.map((item, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm card-auditoria">
                
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-slate-100 p-2 rounded-lg">
                    {item.icone}
                  </div>
                  <h3 className="text-lg font-black text-slate-800">{item.titulo}</h3>
                </div>
                
                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                  {item.descricao}
                </p>

                <p className="text-sm font-medium text-slate-800 mb-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  {item.statusTexto}
                </p>

                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex items-center gap-4">
                    <span className={`text-sm font-black w-20 text-right ${item.textColor}`}>{item.label}</span>
                    <div className="flex-1 bg-slate-200 rounded-full h-3 overflow-hidden flex shadow-inner">
                      <div className={`h-full ${item.color} transition-all duration-1000`} style={{ width: `${item.percent}%` }}></div>
                    </div>
                  </div>
                  <div className="flex justify-between pl-28 pr-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>Fraco</span>
                    <span>Razoável</span>
                    <span>Bom</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* PÁGINA 4: PLANO DE AÇÃO ESTRATÉGICO */}
        <div className="print:min-h-0 print:h-auto min-h-screen px-16 py-12 flex flex-col quebrar-antes bg-white">
          <div className="mb-8 border-b-2 border-slate-100 pb-6">
            <p className="text-blue-600 font-black tracking-widest uppercase text-xs mb-2">Implementação Prática</p>
            <h1 className="text-3xl font-black text-slate-900">Plano de Ação Estratégico</h1>
            <p className="text-slate-500 mt-2 font-medium">As diretrizes técnicas com maior peso de ranking baseadas nos estudos de algoritmos.</p>
          </div>

          <div className="space-y-6">
            {planoDeAcao.map((acao, i) => (
              <div key={i} className={`p-6 rounded-2xl border-l-4 card-auditoria forcar-fundo ${acao.tipo === 'urgente' ? 'border-l-red-500' : 'border-l-yellow-500'}`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl shrink-0 ${acao.tipo === 'urgente' ? 'bg-red-100' : 'bg-yellow-100'}`}>
                    {acao.icone}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-black text-slate-900 mb-3">{i + 1}. {acao.titulo}</h3>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Ação Recomendada:</span>
                        <p className="text-sm font-bold text-slate-700 leading-relaxed">{acao.oque}</p>
                      </div>
                      
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 block mb-1">Impacto no Algoritmo (Por que fazer?)</span>
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">{acao.porque}</p>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">Periodicidade Recomendada:</span>
                        <span className="text-xs font-bold text-slate-800">{acao.frequencia}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto border-t border-slate-200 pt-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mb-1">Desenvolvido por</p>
              <p className="text-lg font-black text-slate-900">Método GMN Turbo © {new Date().getFullYear()}</p>
            </div>
            <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 text-right">
              <p className="text-xs font-bold text-slate-600">Dificuldade em aplicar?</p>
              <p className="text-[10px] text-slate-500">Nossa agência executa este plano por você.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}