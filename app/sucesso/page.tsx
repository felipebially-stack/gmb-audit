"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Download, Star, MapPin, AlertTriangle, TrendingDown, TrendingUp, Zap, FileText, CheckSquare, Copy, Target, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function SucessoPage() {
  const [dados, setDados] = useState<any>(null);

  useEffect(() => {
    // 👇 CHAVE CORRETA DO COFRE 👇
    const salvo = localStorage.getItem("@gmbAudit:reportData");
    
    if (salvo) {
      const parsedDataRaw = JSON.parse(salvo);
      
      // Normalizando a estrutura de dados vinda da página inicial para o formato do PDF
      const parsedData = parsedDataRaw.result ? {
        ...parsedDataRaw.result,
        healthScore: parsedDataRaw.healthScore,
        rankings: parsedDataRaw.keywordRankings || parsedDataRaw.result?.rankings
      } : parsedDataRaw;

      setDados(parsedData);
      
      setTimeout(() => {
        if (parsedData.companyName) {
          document.title = `Consultoria_GMN_Turbo_${parsedData.companyName.replace(/\s+/g, '_')}`;
        }
      }, 500);

      // ====================================================================
      // 🚀 GATILHO DE CONVERSÃO DO FACEBOOK (PURCHASE)
      // ====================================================================
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Purchase', {
          value: 9.97, // 👇 Atualizado para o novo preço 👇
          currency: 'BRL',
          content_name: `Consultoria - ${parsedData.companyName || 'Empresa'}`,
          content_type: 'product'
        });
      }
    }
  }, []);

  if (!dados) return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-sans text-xl">Gerando Consultoria Dinâmica...</div>;

  // 1. EXTRAÇÃO DE TERMOS E CIDADE
  const safeRankings = dados.rankings || [];
  const pioresRankings = safeRankings.filter((r: any) => r.position === null || r.position > 10);
  const melhorRanking = safeRankings.find((r: any) => r.position !== null && r.position <= 5);
  
  const termoRuim = pioresRankings.length > 0 ? pioresRankings[0].keyword : "seus serviços";
  const termoBom = melhorRanking ? melhorRanking.keyword : "sua especialidade";
  
  const partesEndereco = dados.address?.split('-');
  const cidade = partesEndereco && partesEndereco.length > 1 ? partesEndereco[1].split(',')[0].trim() : "sua região";

  // SINCRONIZAÇÃO DE NOTA REAL DO PAINEL
  const healthScore = dados.healthScore || (dados.rating ? Math.round((dados.rating / 5) * 100) : 50);
  const clientesPerdidos = Math.round((100 - healthScore) * 1.5) || 12;
  const potencialAumento = Math.round((100 - healthScore) * 0.8) || 25;

  // STATUS DOS 10 PILARES DA API
  const api = dados.checklistData || {};
  const statusVerificado = typeof api.perfilVerificado === "boolean" ? (api.perfilVerificado ? "Bom" : "Fraco") : (dados.userRatingsTotal > 0 ? "Bom" : "Fraco");
  const statusHorarios = typeof api.horariosAtualizados === "boolean" ? (api.horariosAtualizados ? "Bom" : "Fraco") : (healthScore > 50 ? "Bom" : "Razoável");
  const statusFotos = typeof api.fotosRecentes === "boolean" ? (api.fotosRecentes ? "Bom" : "Fraco") : (healthScore >= 95 ? "Bom" : (healthScore >= 70 ? "Razoável" : "Fraco"));
  const statusDescricao = typeof api.descricaoCompleta === "boolean" ? (api.descricaoCompleta ? "Bom" : "Fraco") : (healthScore >= 60 ? "Bom" : "Fraco");
  const statusCategorias = typeof api.categoriaPrincipal === "boolean" ? (api.categoriaPrincipal ? "Bom" : "Fraco") : (healthScore >= 70 ? "Bom" : "Razoável");
  const statusAtributos = typeof api.atributosPreenchidos === "boolean" ? (api.atributosPreenchidos ? "Bom" : "Razoável") : (healthScore >= 80 ? "Bom" : "Razoável");
  const statusPostagens = typeof api.postagensRecentes === "boolean" ? (api.postagensRecentes ? "Bom" : "Fraco") : (healthScore >= 90 ? "Bom" : (healthScore >= 60 ? "Razoável" : "Fraco"));
  const statusProdutos = typeof api.produtosServicos === "boolean" ? (api.produtosServicos ? "Bom" : "Fraco") : (healthScore >= 75 ? "Bom" : "Razoável");
  const statusRespostas = typeof api.perguntasRespondidas === "boolean" ? (api.perguntasRespondidas ? "Bom" : "Razoável") : (healthScore >= 85 ? "Bom" : "Razoável");
  const statusWebsite = typeof api.websiteVinculado === "boolean" ? (api.websiteVinculado ? "Bom" : "Fraco") : (healthScore >= 60 ? "Bom" : "Fraco");
  const statusAvaliacoes = (dados.rating >= 4.5 && dados.userRatingsTotal >= 30) ? "Bom" : (dados.rating >= 4.0 ? "Razoável" : "Fraco");

  // ====================================================================
  // 🤖 MOTOR DE COPYWRITING INTELIGENTE (TEXTOS HUMANIZADOS)
  // ====================================================================
  
  const nomeOriginal = dados.companyName || "Sua Empresa";
  let nomeConversacional = nomeOriginal
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '') 
    .split(/[-|]/)[0]
    .trim();
  
  if (nomeConversacional.split(' ').length > 4) {
    nomeConversacional = nomeConversacional.split(' ').slice(0, 3).join(' ');
  }

  let keywordFoco = (termoRuim !== "seus serviços" && termoRuim !== "sua especialidade") ? termoRuim : "produtos e serviços de alta qualidade";
  let keywordSecundaria = (termoBom !== "sua especialidade" && termoBom !== "seus serviços") ? termoBom : "o melhor atendimento da região";

  const templateIndex = nomeOriginal.length % 3;

  let descricaoFinal = "";
  let post1 = "";
  let post2 = "";
  let respostaAva = "";

  if (templateIndex === 0) {
    descricaoFinal = `Procurando por ${keywordFoco} em ${cidade}? A ${nomeConversacional} é o lugar certo! Nosso compromisso é entregar ${keywordSecundaria} com a agilidade e a confiança que você merece. Seja para tirar dúvidas ou solicitar um orçamento, nossa equipe está de prontidão. Venha nos visitar em ${cidade} ou chame no WhatsApp para garantir as melhores condições!`;
    post1 = `Você sabia que a ${nomeConversacional} é referência quando o assunto é ${keywordFoco}? 🎯 Estamos aqui em ${cidade} prontos para te entregar o melhor resultado. Clique no botão abaixo, fale com nossa equipe e descubra por que nossos clientes confiam em nós! 👇`;
    post2 = `A qualidade que você procura está aqui. 🏆 Visite a ${nomeConversacional} hoje mesmo e aproveite nossas opções de ${keywordSecundaria}. Esperamos por você aqui em ${cidade}! ✨`;
    respostaAva = `Muito obrigado pela confiança! Nós da equipe ${nomeConversacional} ficamos extremamente felizes com seu feedback. Conte sempre com a gente quando precisar de ${keywordFoco} aqui em ${cidade}!`;
  } else if (templateIndex === 1) {
    descricaoFinal = `Bem-vindo à ${nomeConversacional}! Somos a escolha ideal quando o assunto é ${keywordFoco} na região de ${cidade}. Trabalhamos todos os dias para garantir ${keywordSecundaria} e a satisfação total dos nossos clientes. Entre em contato pelo nosso WhatsApp ou faça-nos uma visita para um atendimento 100% personalizado e soluções sob medida.`;
    post1 = `Precisando de ajuda com ${keywordFoco} em ${cidade}? 🚀 A equipe da ${nomeConversacional} está de portas abertas para te ajudar! Qualidade, rapidez e segurança. Chame no WhatsApp e faça um orçamento agora mesmo! 💬`;
    post2 = `Dica de ouro da ${nomeConversacional}: A melhor forma de garantir ${keywordSecundaria} é escolhendo quem entende do assunto. 💡 Venha tomar um café com a gente em ${cidade} e conheça nosso espaço!`;
    respostaAva = `Agradecemos muito pela sua avaliação! É muito gratificante saber que entregamos o melhor em ${keywordSecundaria}. A ${nomeConversacional} estará sempre de portas abertas para você em ${cidade}.`;
  } else {
    descricaoFinal = `A ${nomeConversacional} tem orgulho de ser a parceira número um em ${cidade} para quem busca ${keywordFoco}. Nosso foco é unir preço justo, transparência e ${keywordSecundaria}. Se você precisa de profissionais dedicados, acabou de encontrar. Ligue agora ou mande uma mensagem no nosso WhatsApp para conversarmos sobre como podemos te ajudar!`;
    post1 = `Chega de procurar! Se o assunto é ${keywordFoco} em ${cidade}, a ${nomeConversacional} tem a solução. 🏆 Venha conhecer nosso trabalho e entender por que somos os favoritos da região. Clique em "Saiba Mais" ou chame no Zap! 👇`;
    post2 = `Não deixe para depois o que você pode resolver hoje na ${nomeConversacional}! ✨ Temos as melhores opções de ${keywordSecundaria} esperando por você. Faça uma cotação rápida com a nossa equipe! 🏃‍♂️💨`;
    respostaAva = `Que alegria ler o seu comentário! Toda a equipe da ${nomeConversacional} agradece de coração. Trabalhamos duro para ser a melhor opção de ${keywordFoco} em ${cidade}. Um grande abraço e até a próxima!`;
  }

  // ====================================================================
  // MOTOR DE PRIORIZAÇÃO DINÂMICA
  // ====================================================================
  const acoesCriticas: any[] = [];
  const acoesMedias: any[] = [];
  const checklistReal: string[] = [];

  if (statusVerificado !== "Bom") {
    acoesCriticas.push({ t: "Verificação Oficial", d: "Seu perfil corre risco. Acesse o painel do Google e conclua a verificação de propriedade imediatamente."});
    checklistReal.push("Solicitar ou concluir verificação de propriedade no Google");
  }
  if (statusHorarios !== "Bom") {
    acoesCriticas.push({ t: "Ajuste de Horários", d: "Você está perdendo clientes por horários confusos. Corrija seus horários de funcionamento e feriados."});
    checklistReal.push("Revisar e confirmar horários normais e feriados no painel");
  }
  if (statusFotos !== "Bom") {
    acoesCriticas.push({ t: "Injeção de Fotos c/ GPS", d: `Vá até o local em ${cidade}, ative a localização do celular e tire 5 fotos da fachada e produtos.`});
    checklistReal.push(`Tirar e subir 5 fotos recentes pelo celular em ${cidade}`);
  }
  if (statusDescricao !== "Bom") {
    acoesCriticas.push({ t: "Otimizar Descrição", d: `A descrição atual não vende. Copie e cole o texto do nosso Kit para forçar a indexação da palavra "${termoRuim}".`});
    checklistReal.push(`Substituir descrição atual usando o texto do nosso Kit`);
  }
  if (statusCategorias !== "Bom") {
    acoesMedias.push({ t: "Expansão de Categorias", d: "O Google não entende tudo o que você faz. Adicione 3 novas categorias secundárias na aba 'Serviços'."});
    checklistReal.push("Adicionar 3 categorias secundárias estratégicas");
  }
  if (statusPostagens !== "Bom") {
    acoesMedias.push({ t: "Postagem de Reativação", d: "Seu perfil está sem frescor. Copie o 'Post Semana 1' do nosso Kit e publique agora mesmo com uma boa foto."});
    checklistReal.push(`Fazer post de oferta no perfil para atrair clientes`);
  }
  if (statusWebsite !== "Bom") {
    acoesMedias.push({ t: "Vincular Website", d: "Falta autoridade no perfil. Insira o link do seu site ou do seu WhatsApp no botão principal."});
    checklistReal.push("Adicionar URL do site ou Link de WhatsApp no painel");
  }
  if (statusProdutos !== "Bom") {
    acoesMedias.push({ t: "Otimizar Catálogo", d: `A aba de serviços está fraca. Cadastre itens no catálogo nomeados estrategicamente para atrair buscas.`});
    checklistReal.push(`Cadastrar principais serviços/produtos na aba correspondente`);
  }
  if (statusRespostas !== "Bom" || statusAvaliacoes !== "Bom") {
    acoesMedias.push({ t: "Gestão de Avaliações", d: `Responda todas as pendências usando nossos templates e envie links pedindo avaliações no WhatsApp.`});
    checklistReal.push("Zerar respostas pendentes e pedir 5 novas avaliações");
  }
  if (statusAtributos !== "Bom") {
    acoesMedias.push({ t: "Filtros de Conversão", d: "Marque opções cruciais como 'Acessibilidade', 'Wi-fi' e formas de pagamento aceitas."});
    checklistReal.push("Preencher todos os atributos (Pagamentos, Acessibilidade, etc)");
  }

  if (acoesCriticas.length === 0) {
    acoesCriticas.push({ t: "Blindagem de Descrição", d: `Sua descrição está boa, mas garanta que ela usa palavras de alta conversão. Revise com o texto do nosso Kit.`});
    acoesCriticas.push({ t: "Manutenção Visual", d: `O algoritmo adora constância. Tire mais 3 fotos da equipe ou loja em ${cidade} e poste esta semana.`});
    checklistReal.push(`Atualizar descrição preventivamente usando o Kit`);
    checklistReal.push("Programar nova sessão de fotos com GPS ativado");
  }
  if (acoesMedias.length === 0) {
    acoesMedias.push({ t: "Escalar Postagens", d: "Você está dominando! Use o 'Post Semana 2' para manter a frequência ativa e não cair no ranking."});
    acoesMedias.push({ t: "Incentivo a Avaliações", d: `A concorrência nunca dorme. Continue pedindo avaliações dos seus melhores clientes em ${cidade}.`});
    checklistReal.push("Agendar próxima postagem (Semana 2)");
    checklistReal.push("Manter rotina de respostas ágeis aos clientes");
  }

  const prioridadesUrgentes = acoesCriticas.slice(0, 2);
  const prioridadesRapidas = acoesMedias.slice(0, 2);
  const checklistFinal = checklistReal.slice(0, 5);

  const auditoria10Pontos = [
    { titulo: "1. Perfil Verificado", status: statusVerificado, porque: "O Google prioriza a exibição de empresas oficiais.", impacto: statusVerificado === "Bom" ? `Perfil verificado. Foco em dominar rankings.` : `ALERTA: Reivindique a propriedade do perfil imediatamente.` },
    { titulo: "2. Horários Atualizados", status: statusHorarios, porque: "Horários errados geram avaliações negativas e matam o SEO.", impacto: statusHorarios === "Bom" ? `Horários OK. Garanta feriados atualizados.` : `Risco de perder selo verde. Atualize horários urgentemente.` },
    { titulo: "3. Fotos Recentes", status: statusFotos, porque: "O algoritmo lê o GPS invisível nas fotos para confirmar sua área.", impacto: statusFotos === "Bom" ? `Frequência de mídia sustenta seu ranking.` : `Faltam fotos recentes em ${cidade}. Suba novas fotos com GPS.` },
    { titulo: "4. Descrição Completa", status: statusDescricao, porque: "Os 750 caracteres são varridos em busca de intenção de compra.", impacto: statusDescricao === "Bom" ? `Bom volume de texto. Monitore termos de busca.` : `Reescreva a descrição focando em "${keywordFoco}".` },
    { titulo: "5. Categoria Principal", status: statusCategorias, porque: "Fator de peso máximo no ranking local.", impacto: statusCategorias === "Bom" ? `Categoria alinhada. Explore secundárias.` : `Adicione ramificações para abrir portas no Google Maps.` },
    { titulo: "6. Atributos do Negócio", status: statusAtributos, porque: "Filtros de busca ajudam na conversão de leads qualificados.", impacto: statusAtributos === "Bom" ? `Atributos preenchidos aumentam as rotas traçadas.` : `Preencha atributos para capturar leads de filtros específicos.` },
    { titulo: "7. Postagens Recentes", status: statusPostagens, porque: "Sinal de frescor e atividade constante para o algoritmo.", impacto: statusPostagens === "Bom" ? `Atividade constante sinaliza que a empresa está viva.` : `Falta de posts paralisa o SEO. Use o kit hoje mesmo.` },
    { titulo: "8. Produtos e Serviços", status: statusProdutos, porque: "Indexa termos longos que não cabem na descrição principal.", impacto: statusProdutos === "Bom" ? `Catálogo ativo ajuda na retenção e SEO longo.` : `Cadastre serviços nomeados estrategicamente.` },
    { titulo: "9. Perguntas Respondidas", status: statusRespostas, porque: "O algoritmo pune perfis que não engajam com clientes.", impacto: statusRespostas === "Bom" ? `Interação transmite segurança e autoridade.` : `Responda dúvidas rapidamente citando "${keywordFoco}".` },
    { titulo: "10. Website Vinculado", status: statusWebsite, porque: "Cruza dados do perfil com o site para dar confiança.", impacto: statusWebsite === "Bom" ? `Website transfere autoridade externa para a ficha.` : `Vincule a URL de um site ou WhatsApp para blindar autoridade.` }
  ];

  return (
    <div className="min-h-screen bg-slate-900 font-sans print:bg-white text-gray-900">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { margin: 0; size: A4; }
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; background-color: white !important; }
          .card-auditoria { page-break-inside: avoid !important; break-inside: avoid !important; display: inline-block !important; width: 100%; }
          .quebrar-antes { page-break-before: always !important; break-before: page !important; }
          .print\\:hidden { display: none !important; }
        }
      `}} />

      <div className="print:hidden flex flex-col items-center py-12 px-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full text-center border-t-8 border-blue-600">
          <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Pagamento Aprovado!</h1>
          <p className="text-gray-600 mt-2 mb-6 text-sm">O relatório da <strong>{nomeOriginal}</strong> foi liberado e está pronto para download.</p>
          <button 
            onClick={() => window.print()} 
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-xl shadow-lg flex justify-center items-center gap-2 mb-4 transition-transform hover:scale-[1.02] uppercase tracking-wide"
          >
            <Download className="w-5 h-5" /> Baixar Consultoria em PDF
          </button>
          <Link href="/" className="text-gray-400 text-sm hover:text-gray-600 underline">Voltar para a página inicial</Link>
        </div>
      </div>

      <div className="hidden print:block w-full bg-white">
        <div className="min-h-[297mm] px-12 py-10 flex flex-col">
          <div className="flex justify-between items-start border-b-4 border-gray-900 pb-4 mb-6">
            <div>
              <p className="text-blue-600 font-black tracking-widest uppercase text-sm mb-1">Diagnóstico Executivo</p>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">Método GMN Turbo</h1>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-gray-800">{nomeOriginal}</h2>
              <p className="text-gray-500 text-sm flex items-center justify-end gap-1"><MapPin className="w-3 h-3"/> {cidade}</p>
            </div>
          </div>

          <div className="bg-red-50 border-l-8 border-red-600 p-6 mb-6 rounded-r-2xl card-auditoria">
            <h2 className="text-2xl font-black text-red-700 mb-2 leading-tight flex items-center gap-3">
              <TrendingDown className="w-7 h-7" /> Você está invisível no Google (e perdendo vendas)
            </h2>
            <p className="text-red-900 text-base leading-relaxed">
              O Top 3 do Google Maps recebe <strong>60% de todos os cliques e ligações</strong>. 
              Ao estar fora do ranking, estimamos que a {nomeConversacional} deixe de receber de <strong>{clientesPerdidos} a {clientesPerdidos * 2} clientes potenciais por mês</strong>.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6 card-auditoria">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 flex flex-col items-center justify-center text-center shadow-sm">
              <p className="font-bold text-slate-500 uppercase tracking-widest text-xs mb-3">Saúde Geral do Perfil</p>
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-gray-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.8"/>
                  <path className={healthScore > 75 ? "text-green-500" : healthScore > 50 ? "text-yellow-500" : "text-red-500"} 
                        strokeDasharray={`${healthScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.8"/>
                </svg>
                <div className="absolute text-4xl font-black text-slate-800">{healthScore}</div>
              </div>
              <p className="mt-3 text-xs font-medium text-slate-600">Média no Top 3: <strong className="text-green-600">88/100</strong></p>
            </div>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 card-auditoria">
                <div className="bg-yellow-100 p-2.5 rounded-xl"><Star className="text-yellow-600 w-5 h-5"/></div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Reputação Atual</p>
                  <p className="text-xl font-black">{dados.rating || 'N/A'} <span className="text-xs font-normal text-gray-500">em {dados.userRatingsTotal || 0} avaliações</span></p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm card-auditoria">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 flex items-center gap-2"><Target className="w-3 h-3"/> Rankings de Visibilidade</p>
                <div className="space-y-1.5">
                  {safeRankings.length > 0 ? safeRankings.slice(0, 3).map((r: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                      <span className="truncate w-44 text-gray-700">{r.keyword}</span>
                      <span className={`font-black ${r.position && r.position <= 3 ? 'text-green-600' : 'text-red-500 bg-red-50 px-1.5 py-0.5 rounded'}`}>
                        {r.position ? `${r.position}º Lugar` : 'Invisível (>20)'}
                      </span>
                    </div>
                  )) : (
                    <p className="text-xs text-gray-500">Nenhum dado de ranking encontrado.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-auto bg-blue-900 text-white p-6 rounded-2xl flex items-center justify-between card-auditoria">
             <div>
               <h3 className="text-lg font-bold text-blue-300 flex items-center gap-2"><TrendingUp className="w-5 h-5"/> Previsão de Resultados</h3>
               <p className="mt-1 text-blue-100 text-xs max-w-lg">Ao aplicar o plano personalizado hoje, estimamos em 45 dias:</p>
             </div>
             <div className="text-right">
               <p className="text-xl font-black text-green-400">+{potencialAumento}% a {potencialAumento + 15}%</p>
               <p className="text-xs text-blue-200">Mais rotas e ligações</p>
             </div>
          </div>
        </div>

        <div className="quebrar-antes min-h-[297mm] px-12 py-16">
          <div className="mb-10 card-auditoria">
            <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3"><FileText className="w-8 h-8 text-blue-600"/> Kit de Implementação Pronto</h2>
            <p className="text-gray-500 mt-2">Copiando e colando esses textos exclusivos você já começa a subir nos rankings de {cidade}.</p>
          </div>
          <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden card-auditoria mb-8">
            <div className="bg-gray-200/50 px-6 py-3 border-b border-gray-200 flex justify-between items-center text-sm font-bold text-gray-700 uppercase tracking-widest">
              <span>1. Nova Descrição Oficial</span>
              <Copy className="w-4 h-4 text-gray-400"/>
            </div>
            <div className="p-6">
              <div className="bg-white p-4 border border-blue-100 rounded-lg text-gray-800 text-sm leading-relaxed shadow-sm">
                "{descricaoFinal}"
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden card-auditoria mb-8">
            <div className="bg-gray-200/50 px-6 py-3 border-b border-gray-200 flex justify-between items-center text-sm font-bold text-gray-700 uppercase tracking-widest">
              <span>2. Postagens Otimizadas</span>
              <Copy className="w-4 h-4 text-gray-400"/>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="bg-white p-4 border border-blue-100 rounded-lg shadow-sm">
                <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded mb-2 inline-block uppercase">Post 1</span>
                <p className="text-gray-800 text-sm leading-relaxed">"{post1}"</p>
              </div>
              <div className="bg-white p-4 border border-blue-100 rounded-lg shadow-sm">
                <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded mb-2 inline-block uppercase">Post 2</span>
                <p className="text-gray-800 text-sm leading-relaxed">"{post2}"</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 card-auditoria">
            <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-200/50 px-6 py-3 border-b border-gray-200 font-bold text-gray-700 text-sm uppercase tracking-widest">3. Resposta de Avaliação</div>
              <div className="p-6 bg-white h-full italic text-sm text-gray-800 border-l-4 border-yellow-400">"{respostaAva}"</div>
            </div>
            <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-200/50 px-6 py-3 border-b border-gray-200 font-bold text-gray-700 text-sm uppercase tracking-widest">4. Serviços Complementares</div>
              <div className="p-6 bg-white h-full text-sm text-gray-800 font-bold">
                <ul className="list-disc pl-4 space-y-1">
                  <li>{keywordFoco} Premium</li>
                  <li>Especialista em {keywordSecundaria}</li>
                  <li>Atendimento em {cidade}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="quebrar-antes min-h-[297mm] px-12 py-16">
          <div className="mb-10 card-auditoria">
            <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3"><Zap className="w-8 h-8 text-yellow-500 fill-yellow-500"/> Plano de Ação Personalizado</h2>
            <p className="text-gray-500 mt-2">Ações práticas baseadas no diagnóstico real da {nomeConversacional}.</p>
          </div>
          <div className="grid grid-cols-2 gap-8 mb-10 card-auditoria">
            <div className="bg-red-50 border border-red-100 rounded-xl p-6">
              <h3 className="text-lg font-black text-red-600 mb-4 uppercase flex items-center gap-2"><AlertTriangle className="w-4 h-4"/> Urgente (48h)</h3>
              <div className="space-y-4 text-sm text-red-900">
                {prioridadesUrgentes.map((acao, i) => (
                  <div key={i}><strong>{i+1}. {acao.t}:</strong> <span>{acao.d}</span></div>
                ))}
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-6">
              <h3 className="text-lg font-black text-yellow-600 mb-4 uppercase flex items-center gap-2"><Zap className="w-4 h-4"/> Rápido (7 Dias)</h3>
              <div className="space-y-4 text-sm text-yellow-900">
                {prioridadesRapidas.map((acao, i) => (
                  <div key={i}><strong>{i+3}. {acao.t}:</strong> <span>{acao.d}</span></div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-8 card-auditoria">
            <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2"><CheckSquare className="w-6 h-6"/> Checklist de Implementação</h3>
            <div className="space-y-4">
              {checklistFinal.map((item, i) => (
                <div key={i} className="flex items-center gap-4 border-b border-gray-100 pb-3">
                  <div className="w-6 h-6 rounded border-2 border-slate-300 shrink-0"></div>
                  <p className="text-gray-700 font-medium text-sm">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="quebrar-antes min-h-[297mm] px-12 py-16">
          <div className="mb-10 card-auditoria">
            <p className="text-blue-600 font-black tracking-widest uppercase text-sm mb-1">Diagnóstico Específico da {nomeConversacional}</p>
            <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3"><ShieldAlert className="w-8 h-8 text-blue-900"/> Os 10 Pilares Técnicos GMN</h2>
          </div>
          <div className="space-y-6">
            {auditoria10Pontos.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-5 bg-gray-50/50 shadow-sm card-auditoria">
                <div className="flex justify-between items-start mb-3 border-b border-gray-200 pb-2">
                  <h3 className="font-black text-gray-900 text-sm uppercase">{item.titulo}</h3>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${item.status === 'Bom' ? 'bg-green-100 text-green-800 border-green-300' : item.status === 'Razoável' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 'bg-red-100 text-red-800 border-red-300'}`}>
                    {item.status}
                  </span>
                </div>
                <div className="mb-3 pl-2 border-l-2 border-gray-300">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Por que isso importa?</p>
                  <p className="text-gray-600 text-xs leading-relaxed">{item.porque}</p>
                </div>
                <div className="bg-white p-3 rounded border border-blue-100">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> Situação da Empresa</p>
                  <p className="text-gray-900 text-sm font-medium">{item.impacto}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center text-xs text-gray-400 mt-6 pb-8 border-t border-gray-100 pt-4 card-auditoria">
            Auditoria Técnica Algorítmica exclusiva para {nomeOriginal}. Método GMN Turbo © {new Date().getFullYear()}.
          </div>
        </div>
      </div>
    </div>
  );
}