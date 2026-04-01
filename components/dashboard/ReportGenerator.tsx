"use client";

import { useState } from "react";

interface ReportProps {
  companyName: string;
  rating: number | null;
  userRatingsTotal: number | null;
  address: string;
  rankings: any[];
}

export default function ReportGenerator({ companyName, rating, userRatingsTotal, address, rankings }: ReportProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  if (typeof window === "undefined") return null;

  const baixarPDF = () => {
    setIsGenerating(true);
    
    try {
      const content = document.getElementById("area-do-pdf");
      if (!content) {
        alert("Relatório não encontrado.");
        setIsGenerating(false);
        return;
      }

      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
        .map(s => s.outerHTML)
        .join('');

      const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;
      
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Auditoria-${companyName ? companyName.replace(/\s+/g, '-') : 'GMB'}</title>
              ${styles}
              <style>
                @page { margin: 15mm; }
                body { 
                  -webkit-print-color-adjust: exact !important; 
                  print-color-adjust: exact !important; 
                  background: white; 
                  color: #111827 !important;
                  font-family: sans-serif;
                }
                .page-break { page-break-before: always; }
                h1, h2, h3, h4 { color: #1e3a8a !important; }
              </style>
            </head>
            <body>
              <div style="width: 100%; max-width: 800px; margin: 0 auto; padding: 10px;">
                ${content.innerHTML}
              </div>
              <script>
                setTimeout(() => {
                  window.focus();
                  window.print();
                }, 500);
              </script>
            </body>
          </html>
        `);
        iframeDoc.close();
      }

      setTimeout(() => {
        setIsGenerating(false);
        setTimeout(() => document.body.removeChild(iframe), 3000);
      }, 2000);

    } catch (error) {
      console.error("Erro na geração do documento:", error);
      alert("Houve um erro. Tente novamente.");
      setIsGenerating(false);
    }
  };

  // Inteligência de Dados para Personalizar o Texto
  const safeRankings = rankings || [];
  const dicasPrioritarias = [];
  
  const posicoesRuins = safeRankings.filter(r => r.position === null || r.position > 10);
  const posicoesBoas = safeRankings.filter(r => r.position !== null && r.position <= 10);
  
  // Pega uma palavra-chave ruim real para usar nos exemplos do texto (ou usa um texto genérico se não tiver)
  const palavraRuimExemplo = posicoesRuins.length > 0 ? posicoesRuins[0].keyword : "seus principais serviços";

  if (rating && rating < 4.5) dicasPrioritarias.push(`A nota da ${companyName} está em ${rating}, o que afasta clientes. Urgente: Crie uma campanha no WhatsApp pedindo avaliações 5 estrelas para reverter isso.`);
  if (userRatingsTotal && userRatingsTotal < 50) dicasPrioritarias.push(`A ${companyName} tem apenas ${userRatingsTotal} avaliações. O Google prioriza concorrentes com mais volume. Peça feedback a cada venda concluída.`);
  
  if (posicoesRuins.length > 0) dicasPrioritarias.push(`A ${companyName} está invisível (abaixo do 10º lugar) em ${posicoesRuins.length} buscas cruciais, perdendo vendas diárias. Adicione esses termos na descrição do seu perfil hoje mesmo.`);

  return (
    <div className="mt-8 flex flex-col items-center w-full relative">
      
      <button
        onClick={baixarPDF}
        disabled={isGenerating || !rating}
        className="w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all disabled:opacity-50 text-lg flex justify-center items-center gap-2"
      >
        {isGenerating ? "Preparando Documento..." : "Baixar Plano de Ação (PDF)"}
      </button>
      <p className="text-sm text-gray-500 mt-2">Relatório executivo liberado após o pagamento.</p>

      <div className="hidden">
        <div id="area-do-pdf" className="bg-white text-gray-900">
          
          {/* Cabeçalho */}
          <div className="border-b-4 border-blue-600 pb-4 mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-extrabold text-blue-900">GMB Audit</h1>
              <p className="text-gray-500 font-medium">Relatório de Inteligência em SEO Local</p>
            </div>
            <p className="text-gray-500 font-medium">Data: {new Date().toLocaleDateString('pt-BR')}</p>
          </div>

          <div className="p-6 rounded-lg mb-8 border bg-gray-50 border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{companyName}</h2>
            <p className="text-gray-600 mb-4">{address}</p>
            <div className="flex gap-8">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Nota Média</span>
                <span className="text-2xl font-bold text-yellow-500">{rating} ⭐</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Total de Avaliações</span>
                <span className="text-2xl font-bold text-gray-800">{userRatingsTotal}</span>
              </div>
            </div>
          </div>

          {/* SESSÃO 1: Plano de Ação Imediato */}
          <h3 className="text-2xl font-bold text-red-600 mb-4">Plano de Ação</h3>
          <p className="text-gray-700 mb-6">Este documento apresenta um roteiro estratégico desenhado especificamente para a <strong>{companyName}</strong>, com o objetivo de dominar as buscas locais.</p>

          <h4 className="text-lg font-semibold text-gray-800 mb-3">Diagnóstico Prioritário de Alto Impacto</h4>
          <div className="border-l-4 border-red-500 p-5 mb-12 rounded-r-lg bg-red-50">
            <ul className="list-disc pl-5 space-y-3">
              {dicasPrioritarias.map((dica, i) => (
                <li key={i} className="font-medium text-gray-800">{dica}</li>
              ))}
              {dicasPrioritarias.length === 0 && <li className="font-bold text-green-700">A {companyName} tem uma base excelente! O foco agora é postar fotos semanais e manter a nota alta.</li>}
            </ul>
          </div>

          {/* SESSÃO 2: Guia de Otimização Personalizado */}
          <div className="page-break"></div>
          <h3 className="text-2xl font-bold text-blue-900 mb-6 pt-6">Plano de Otimização para a {companyName}</h3>
          <p className="text-gray-700 mb-8">Cruzamos os dados do seu ranking e avaliações com nosso checklist de SEO. Abaixo, explicamos o que deve ser feito e o <strong>impacto real</strong> de cada ação no seu posicionamento.</p>
          
          <div className="space-y-6">
            
            <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
              <h4 className="text-lg font-bold text-gray-800 mb-1">1. Estratégia de Avaliações (Rating: {rating}⭐ | Total: {userRatingsTotal})</h4>
              <p className="text-gray-700 text-sm mb-2"><strong>O Impacto:</strong> O algoritmo do Google Maps usa o volume e a nota das avaliações como o principal fator de confiança. Empresas com menos de 100 avaliações ou notas baixas perdem posições instantaneamente.</p>
              <p className="text-green-700 text-sm font-medium"><strong>O que fazer:</strong> Responda a 100% das avaliações atuais usando a palavra "{palavraRuimExemplo}" na sua resposta. Crie uma mensagem padrão de WhatsApp para enviar aos clientes pedindo novas avaliações positivas.</p>
            </div>

            <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
              <h4 className="text-lg font-bold text-gray-800 mb-1">2. Descrição Completa e Palavras-chave</h4>
              <p className="text-gray-700 text-sm mb-2"><strong>O Impacto:</strong> Atualmente, a {companyName} não aparece nas cabeças de busca para <strong>"{palavraRuimExemplo}"</strong>. O Google não consegue associar este termo à sua empresa se ele não estiver escrito no seu perfil.</p>
              <p className="text-green-700 text-sm font-medium"><strong>O que fazer:</strong> Reescreva a descrição da empresa (usando os 750 caracteres permitidos) e inclua frases naturais como "Somos especialistas em {palavraRuimExemplo} na região".</p>
            </div>

            <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
              <h4 className="text-lg font-bold text-gray-800 mb-1">3. Categoria Principal e Secundárias</h4>
              <p className="text-gray-700 text-sm mb-2"><strong>O Impacto:</strong> É o fator técnico de maior peso. Se a categoria principal for ampla demais, você compete com empresas gigantes. Se não tiver categorias secundárias, perde buscas específicas.</p>
              <p className="text-green-700 text-sm font-medium"><strong>O que fazer:</strong> Verifique se a categoria reflete exatamente o que a {companyName} faz de melhor. Adicione pelo menos 3 categorias secundárias relacionadas aos seus serviços de maior lucro.</p>
            </div>

            <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
              <h4 className="text-lg font-bold text-gray-800 mb-1">4. Atualização de Fotos Recentes</h4>
              <p className="text-gray-700 text-sm mb-2"><strong>O Impacto:</strong> Perfis estáticos perdem ranking com o tempo. O Google premia perfis vivos. Mais fotos geram mais tempo de retenção do cliente na sua ficha.</p>
              <p className="text-green-700 text-sm font-medium"><strong>O que fazer:</strong> Suba pelo menos 2 fotos novas por semana. O segredo de SEO: antes de subir a foto, renomeie o arquivo de imagem no seu celular para "{palavraRuimExemplo.replace(/\s+/g, '-')}.jpg".</p>
            </div>

            <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
              <h4 className="text-lg font-bold text-gray-800 mb-1">5. Cadastramento de Produtos e Serviços</h4>
              <p className="text-gray-700 text-sm mb-2"><strong>O Impacto:</strong> O menu de serviços é uma área enorme que o Google lê para indexar termos de busca. Deixar essa aba vazia é o maior desperdício de SEO Local.</p>
              <p className="text-green-700 text-sm font-medium"><strong>O que fazer:</strong> Cadastre cada um dos serviços da {companyName} manualmente. Na descrição de cada produto, repita as palavras-chave onde você está ranqueando mal na tabela abaixo.</p>
            </div>

            <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
              <h4 className="text-lg font-bold text-gray-800 mb-1">6. Postagens (Google Updates)</h4>
              <p className="text-gray-700 text-sm mb-2"><strong>O Impacto:</strong> Funciona como uma rede social. Fazer posts no Google Maps gera "sinais de frescor" no algoritmo, empurrando a {companyName} para cima dos concorrentes inativos.</p>
              <p className="text-green-700 text-sm font-medium"><strong>O que fazer:</strong> Crie um post de "Oferta" ou "Novidade" a cada 15 dias. Sempre adicione um botão de "Saiba Mais" ou "Ligar Agora" para aumentar a conversão direta.</p>
            </div>

          </div>

          {/* SESSÃO 3: Tabela de Rankings */}
          <div className="page-break"></div>
          <h3 className="text-2xl font-bold text-gray-800 mb-6 pt-6">Posicionamento Real da {companyName} no Google Maps</h3>
          <p className="text-gray-700 mb-6">Esta tabela reflete a posição exata da sua empresa quando um cliente na sua região pesquisa por estes termos hoje. Lembre-se: posições maiores que 3 não aparecem na primeira tela do Google.</p>
          
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="p-3 border border-blue-800 font-semibold">Termo Pesquisado</th>
                <th className="p-3 border border-blue-800 font-semibold text-center">Posição Atual</th>
              </tr>
            </thead>
            <tbody>
              {safeRankings.map((r, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-3 border border-gray-300 text-gray-700">{r.keyword}</td>
                  <td className={`p-3 border border-gray-300 text-center font-bold ${r.position && r.position <= 10 ? 'text-green-600' : 'text-red-500'}`}>
                    {r.position ? `${r.position}º lugar` : '> 20 (Invisível)'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="mt-12 text-center text-sm text-gray-400 border-t border-gray-200 pt-4 pb-8">
            Gerado pela ferramenta de Inteligência GMB Audit. Documento confidencial da {companyName}.
          </div>
        </div>
      </div>

    </div>
  );
}