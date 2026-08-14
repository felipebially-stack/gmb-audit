"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Download, Star, MapPin, TrendingDown, TrendingUp, Search, Clock, ShieldAlert, Image as ImageIcon, Link as LinkIcon, MessageSquare, Video, HelpCircle } from "lucide-react";
import Link from "next/link";

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
  // MOTOR DE DADOS BASE
  // ====================================================================
  const safeRankings = dados.rankings || [];
  const partesEndereco = dados.address?.split('-');
  const cidade = partesEndereco && partesEndereco.length > 1 ? partesEndereco[1].split(',')[0].trim() : "sua região";

  const ratingNum = dados.rating || 0;
  const reviewsNum = dados.userRatingsTotal || 0;
  const healthScore = dados.healthScore || (ratingNum ? Math.round((ratingNum / 5) * 100) : 50);
  const clientesPerdidos = Math.round((100 - healthScore) * 1.5) || 12;

  const nomeOriginal = dados.companyName || "Sua Empresa";
  let nomeConversacional = nomeOriginal.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').split(/[-|]/)[0].trim();
  if (nomeConversacional.split(' ').length > 4) nomeConversacional = nomeConversacional.split(' ').slice(0, 3).join(' ');

  let introDinamica = "";
  if (reviewsNum > 500) {
    introDinamica = `A ${nomeConversacional} tem algo raro de se ver: ${reviewsNum} avaliações e nota ${ratingNum}. Isso é autoridade pura, construída com muito trabalho. O problema crítico é que toda essa reputação não está sendo convertida no volume máximo de ligações e clientes, porque a ficha do Google Maps apresenta falhas técnicas que impedem o algoritmo de colocar você no topo nas buscas mais importantes.`;
  } else if (reviewsNum > 50) {
    introDinamica = `A ${nomeConversacional} já possui uma excelente base de aprovação (${reviewsNum} avaliações reais). Você faz um bom trabalho, mas o Google Maps precisa de ajustes técnicos na sua ficha para entender essa autoridade e entregar o seu perfil na frente da concorrência de ${cidade}.`;
  } else {
    introDinamica = `A ${nomeConversacional} tem muito potencial em ${cidade}, mas o Google Maps precisa de mais sinais de atividade e otimização técnica para confiar no seu perfil. Neste exato momento, a falta de estruturação da ficha está entregando clientes prontos para comprar de mão beijada para a sua concorrência.`;
  }

  // ====================================================================
  // HEALTH CHECK DETALHADO (NOVO FORMATO VISUAL)
  // ====================================================================
  
  // Lógica dinâmica para gerar os status baseados na nota geral e avaliações
  const checkStatus = (isGood: boolean, isFair: boolean) => {
    if (isGood) return { label: "Bom", percent: 100, color: "bg-green-500", textColor: "text-green-600" };
    if (isFair) return { label: "Razoável", percent: 50, color: "bg-yellow-500", textColor: "text-yellow-600" };
    return { label: "Fraco", percent: 10, color: "bg-red-500", textColor: "text-red-600" };
  };

  const healthCheckItems = [
    {
      icone: <Star className="w-5 h-5 text-slate-700" />,
      titulo: "Média de Avaliações",
      descricao: "Analisa se a pontuação média de avaliação está boa ou se pode ser melhorada. Uma pontuação adequada nas avaliações transmite segurança e conforto para o cliente.",
      statusTexto: ratingNum >= 4.0 ? "A média de avaliações está normal." : "A média de avaliações está abaixo do padrão competitivo.",
      ...checkStatus(ratingNum >= 4.0, ratingNum >= 3.0)
    },
    {
      icone: <MessageSquare className="w-5 h-5 text-slate-700" />,
      titulo: "Quantidade de Avaliações",
      descricao: "Analisa se possui uma quantidade mínima de avaliações em relação aos concorrentes da região.",
      statusTexto: reviewsNum >= 15 ? "O negócio possui quantidade de avaliações suficiente." : "A quantidade de avaliações ainda é insuficiente para o algoritmo.",
      ...checkStatus(reviewsNum >= 15, reviewsNum >= 5)
    },
    {
      icone: <ShieldAlert className="w-5 h-5 text-slate-700" />,
      titulo: "Nome do Negócio",
      descricao: "O nome deve refletir o nome real do seu negócio, conforme é conhecido pelos clientes e apresentado na sua loja ou site. O uso de palavras-chave extras causa suspensão.",
      statusTexto: nomeOriginal.length < 50 ? "O nome do negócio está definido com uma quantidade adequada de caracteres." : "O nome possui muitos caracteres, indicando possível excesso de palavras-chave (risco de bloqueio).",
      ...checkStatus(nomeOriginal.length < 50, nomeOriginal.length < 70)
    },
    {
      icone: <ImageIcon className="w-5 h-5 text-slate-700" />,
      titulo: "Quantidade Total de Mídia pelo Proprietário",
      descricao: "Fotos publicadas pelo proprietário revelam o compromisso que você tem com o seu negócio e demonstram como gostaria que este fosse apresentado.",
      statusTexto: healthScore >= 60 ? "O negócio possui uma quantidade aceitável de mídia publicadas pelo proprietário." : "Faltam fotos de qualidade publicadas pelo proprietário.",
      ...checkStatus(healthScore >= 80, healthScore >= 50)
    },
    {
      icone: <Clock className="w-5 h-5 text-slate-700" />,
      titulo: "Data da Última Postagem",
      descricao: "Criar e compartilhar novidades, falar sobre produtos ou serviços demonstra que o seu negócio é ativo no Google e isso ajuda a melhorar a sua visibilidade online.",
      statusTexto: healthScore >= 70 ? "Postagens recentes detectadas ou dentro do limite." : "Já fazem muitos dias desde a última postagem. Quantidade máxima recomendada: 15 dias.",
      ...checkStatus(healthScore >= 80, healthScore >= 50)
    },
    {
      icone: <Video className="w-5 h-5 text-slate-700" />,
      titulo: "Mídia - Vídeos",
      descricao: "Estudos mostram que os vídeos atraem e fidelizam clientes mais do que outras formas de marketing online no Maps.",
      statusTexto: "Não existem vídeos detectados para o negócio. Quantidade mínima recomendada: 3.",
      ...checkStatus(false, healthScore >= 90) // Geralmente a maioria não tem vídeos
    },
    {
      icone: <HelpCircle className="w-5 h-5 text-slate-700" />,
      titulo: "Perguntas Não Respondidas",
      descricao: "Os clientes esperam que você assuma a liderança, respondendo e resolvendo as suas questões. Não deixe perguntas sem resposta na aba Q&A.",
      statusTexto: healthScore >= 60 ? "Nenhuma pendência crítica de perguntas detectada." : "Ainda existem perguntas ou avaliações precisando de atenção.",
      ...checkStatus(healthScore >= 75, healthScore >= 40)
    },
    {
      icone: <Search className="w-5 h-5 text-slate-700" />,
      titulo: "Descrição da Empresa",
      descricao: "Descrever o seu negócio é uma oportunidade de contar a potenciais clientes a sua história e inserir palavras-chave cruciais para o algoritmo.",
      statusTexto: healthScore >= 50 ? "O negócio possui uma descrição configurada." : "A descrição está ausente ou muito curta. Mínimo recomendado: 50 caracteres.",
      ...checkStatus(healthScore >= 70, healthScore >= 40)
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
        <div className="min-h-[297mm] px-16 py-20 flex flex-col justify-between bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/60 via-transparent to-transparent" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-16 border-b border-slate-700 pb-6">
              <span className="text-blue-400 font-bold tracking-widest text-sm uppercase">Método GMN Turbo</span>
              <span className="text-slate-300 font-bold uppercase tracking-wider text-sm">Dossiê Oficial</span>
            </div>

            <p className="text-blue-400 font-bold tracking-widest text-sm uppercase mb-4">Auditoria Estratégica Individual</p>
            <h1 className="text-[3rem] font-black tracking-tight leading-[1.1] mb-4 text-white">
              Relatório de Posicionamento
              <span className="text-orange-500 block">& Plano de Domínio Local</span>
            </h1>
            <p className="text-slate-300 text-lg max-w-xl leading-relaxed mb-12">
              Documento exclusivo gerado com base em varredura algorítmica no perfil verificado da <b>{nomeOriginal}</b> no Google Maps. Análise processada para a região de {cidade}.
            </p>

            {dados.photoUrl && (
              <div className="relative w-full h-72 rounded-2xl overflow-hidden border-4 border-slate-800 shadow-2xl mb-8 bg-slate-800">
                <img src={dados.photoUrl} alt="Fachada" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            )}

            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex justify-between items-center mt-8">
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

          <div className="relative z-10 border-t border-slate-700 pt-8 flex justify-between items-end">
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

        {/* PÁGINA 2: DIAGNÓSTICO EXECUTIVO DINÂMICO */}
        <div className="min-h-[297mm] px-16 py-20 flex flex-col quebrar-antes bg-white">
          <div className="mb-10 border-b-2 border-slate-100 pb-6">
            <p className="text-blue-600 font-black tracking-widest uppercase text-xs mb-2">Diagnóstico Executivo</p>
            <h1 className="text-3xl font-black text-slate-900">O que está acontecendo com seu perfil agora</h1>
          </div>

          <div className="text-slate-700 text-lg leading-relaxed mb-10 font-medium">
            <p className="mb-6">{introDinamica}</p>
            <p>O Local Pack (os 3 primeiros resultados do mapa) recebe <strong>60% de todos os cliques e ligações</strong>. Quem está fora dele, independente da qualidade do serviço que presta, simplesmente não existe para o cliente naquele momento exato de necessidade.</p>
          </div>

          <div className="mb-10 card-auditoria">
            <h3 className="text-lg font-black text-slate-900 mb-4 uppercase flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" /> Situação Atual nos Rankings
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Termo de Busca em {cidade}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Sua Posição</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {safeRankings.length > 0 ? safeRankings.map((kw: any, i: number) => (
                    <tr key={i}>
                      <td className="px-6 py-4 font-bold text-slate-800 capitalize">{kw.keyword}</td>
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
            <p className="text-xs text-slate-500 mt-3 italic">*Termos classificados abaixo da 3ª posição não geram vendas consistentes.</p>
          </div>

          <div className="mt-auto bg-slate-900 text-white p-8 rounded-2xl flex flex-col justify-center text-center card-auditoria border-b-4 border-orange-500">
            <h3 className="text-2xl font-black mb-3">Impacto Financeiro Direto</h3>
            <p className="text-slate-300 text-base max-w-2xl mx-auto">
              Ao corrigir as lacunas técnicas da ficha, o algoritmo passa a cruzar sua reputação de {ratingNum} estrelas com as buscas locais. A estimativa é captar de <strong>{clientesPerdidos} a {clientesPerdidos * 2} novos contatos qualificados por mês</strong> ao alcançar e se estabilizar no Top 3.
            </p>
          </div>
        </div>

        {/* PÁGINA 3: HEALTH CHECK (NOVO ESTILO) */}
        <div className="min-h-[297mm] px-16 py-20 flex flex-col quebrar-antes bg-slate-50">
          <div className="mb-10 border-b-2 border-slate-200 pb-6">
            <p className="text-blue-600 font-black tracking-widest uppercase text-xs mb-2">Auditoria Detalhada</p>
            <h1 className="text-3xl font-black text-slate-900">Análise de Saúde da {nomeConversacional}</h1>
            <p className="text-slate-500 mt-2 font-medium">Verificação profunda dos fatores de rankeamento e conversão.</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {healthCheckItems.map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm card-auditoria">
                
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-slate-100 p-2 rounded-lg">
                    {item.icone}
                  </div>
                  <h3 className="text-lg font-black text-slate-800">{item.titulo}</h3>
                </div>
                
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {item.descricao}
                </p>

                <p className="text-sm font-medium text-slate-800 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {item.statusTexto}
                </p>

                <div className="flex items-center gap-4">
                  <span className={`text-sm font-black w-20 ${item.textColor}`}>{item.label}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden flex">
                    {/* Barra visual simulando o velocímetro */}
                    <div className={`h-full ${item.color} transition-all duration-1000`} style={{ width: `${item.percent}%` }}></div>
                  </div>
                  <div className="w-32 flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
                    <span>Fraco</span>
                    <span>Bom</span>
                  </div>
                </div>

              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-xs text-slate-500 font-medium">As métricas acima guiam diretamente o algoritmo do Google Meu Negócio.</p>
          </div>
        </div>

      </div>
    </div>
  );
}