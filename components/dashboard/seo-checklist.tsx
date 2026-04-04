"use client";

import { Check, X, AlertTriangle, Lock } from "lucide-react";

export function SeoChecklist({ data, healthScore }: { data?: any, healthScore?: number }) {
  // Se ainda não pesquisou nenhuma empresa
  if (!data || !data.companyName) {
    return (
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold">Checklist de SEO Local</h3>
            <p className="text-sm text-muted-foreground">Pesquise uma empresa para gerar a análise real</p>
          </div>
          <div className="bg-secondary px-3 py-1 rounded-full text-sm font-medium">0/10</div>
        </div>
        <div className="flex justify-center items-center h-32 opacity-50">
          <p className="text-sm text-muted-foreground">Aguardando dados da pesquisa...</p>
        </div>
      </div>
    );
  }

  const score = healthScore || 0;
  const api = data.checklistData || data || {};

  const getStatus = (apiVal: any, condBom: boolean, condAtencao?: boolean) => {
    if (typeof apiVal === "boolean") return apiVal ? "bom" : "fraco";
    if (condBom) return "bom";
    if (condAtencao) return "atencao";
    return "fraco";
  };

  // Matriz de dados reais
  const itens = [
    {
      titulo: "Perfil Verificado",
      textoBom: "Seu perfil apresenta sinais de verificação ativa",
      status: getStatus(api.perfilVerificado, data.userRatingsTotal > 0)
    },
    {
      titulo: "Horários Atualizados",
      textoBom: "Horários de funcionamento aparentam estar corretos",
      status: getStatus(api.horariosAtualizados, score > 50, true)
    },
    {
      titulo: "Fotos Recentes",
      textoBom: "O volume de mídia sustenta seu ranqueamento",
      status: getStatus(api.fotosRecentes, score >= 95, score >= 70)
    },
    {
      titulo: "Descrição Completa",
      textoBom: "Descrição otimizada com bom volume de caracteres",
      status: getStatus(api.descricaoCompleta, score >= 60)
    },
    {
      titulo: "Categoria Principal",
      textoBom: "Categoria definida corretamente",
      status: getStatus(api.categoriaPrincipal, score >= 70, true)
    },
    {
      titulo: "Atributos do Negócio",
      textoBom: "Bons atributos preenchidos",
      status: getStatus(api.atributosPreenchidos, score >= 80, true)
    },
    {
      titulo: "Postagens Recentes",
      textoBom: "Sinal de frescor ativo no Google",
      status: getStatus(api.postagensRecentes, score >= 90, score >= 60)
    },
    {
      titulo: "Produtos/Serviços",
      textoBom: "Catálogo e serviços indexados",
      status: getStatus(api.produtosServicos, score >= 75, true)
    },
    {
      titulo: "Perguntas Respondidas",
      textoBom: "Boa interação e tempo de resposta",
      status: getStatus(api.perguntasRespondidas, score >= 85, true)
    },
    {
      titulo: "Website Vinculado",
      textoBom: "Site vinculado e transferindo autoridade",
      status: getStatus(api.websiteVinculado, score >= 60)
    }
  ];

  const scoreTotal = itens.filter(i => i.status === "bom").length;

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Checklist de SEO Local</h3>
          <p className="text-sm text-muted-foreground mt-1">Verifique os pontos essenciais para otimizar seu perfil</p>
        </div>
        <div className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-black border border-blue-100 shadow-sm">
          {scoreTotal}/10
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {itens.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3 rounded-lg border p-4 bg-white transition-all hover:border-gray-300 shadow-sm">
            {/* Ícones de Status */}
            {item.status === "bom" && (
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Check className="h-3 w-3 stroke-[3]" />
              </div>
            )}
            {item.status === "atencao" && (
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                <AlertTriangle className="h-3 w-3 stroke-[3]" />
              </div>
            )}
            {item.status === "fraco" && (
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                <X className="h-3 w-3 stroke-[3]" />
              </div>
            )}
            
            {/* Textos e Bloqueio (Paywall) */}
            <div className="flex-1 w-full">
              <div className="flex items-center justify-between w-full">
                <p className="text-sm font-bold text-gray-800">{item.titulo}</p>
                {item.status !== "bom" && (
                   <Lock className="w-3.5 h-3.5 text-blue-400 opacity-70 ml-2" />
                )}
              </div>
              
              {item.status === "bom" ? (
                <p className="text-xs text-muted-foreground mt-1">
                  {item.textoBom}
                </p>
              ) : (
                <div className="relative mt-1">
                  {/* Texto Fake Embaçado para não poder ser copiado */}
                  <p className="text-xs text-gray-400 blur-[4px] select-none pointer-events-none opacity-60">
                    O diagnóstico detalhado revela o motivo deste alerta e o passo a passo para correção.
                  </p>
                  {/* Botão de Desbloqueio por cima */}
                  <div className="absolute inset-0 flex items-center justify-start pointer-events-none">
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50/90 border border-blue-200 px-2 py-0.5 rounded shadow-sm flex items-center gap-1 backdrop-blur-sm">
                       Desbloquear no PDF
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}