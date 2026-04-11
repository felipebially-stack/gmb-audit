"use client"

import { AlertTriangle, XCircle, Lock } from "lucide-react"

interface SeoChecklistProps {
  data?: any
  healthScore?: number
  onCheckout?: () => void
}

export function SeoChecklist({ data, onCheckout }: SeoChecklistProps) {
  // Simulando o estado das análises (se for falso é erro grave, senão é aviso)
  const api = data?.checklistData || {};

  const items = [
    { title: "Categoria Principal", status: api.categoriaPrincipal === false ? "error" : "warning" },
    { title: "Atributos do Negócio", status: api.atributosPreenchidos === false ? "error" : "warning" },
    { title: "Postagens Recentes", status: api.postagensRecentes === false ? "error" : "warning" },
    { title: "Produtos/Serviços", status: api.produtosServicos === false ? "error" : "warning" },
    { title: "Perguntas Respondidas", status: api.perguntasRespondidas === false ? "error" : "warning" },
    { title: "Website Vinculado", status: api.websiteVinculado === false ? "error" : "warning" },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item, i) => (
        <div
          key={i}
          onClick={onCheckout}
          className="relative cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-400 hover:shadow-md group"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3">
              {item.status === 'error' ? (
                <div className="rounded-full bg-red-50 border border-red-100 p-2"><XCircle className="h-5 w-5 text-red-500" /></div>
              ) : (
                <div className="rounded-full bg-yellow-50 border border-yellow-100 p-2"><AlertTriangle className="h-5 w-5 text-yellow-500" /></div>
              )}
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">{item.title}</h3>
                <button className="mt-1.5 inline-flex items-center rounded bg-blue-50 border border-blue-200 px-2.5 py-1 text-[10px] font-bold text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white uppercase tracking-wider">
                  Desbloquear no PDF
                </button>
              </div>
            </div>
            <Lock className="h-5 w-5 text-blue-300 group-hover:text-blue-600 transition-colors" />
          </div>
          
          {/* Efeito visual de texto censurado/borrado */}
          <div className="mt-5 blur-[4px] select-none opacity-40">
            <div className="h-2 w-full bg-slate-400 rounded mb-2"></div>
            <div className="h-2 w-4/5 bg-slate-400 rounded mb-2"></div>
            <div className="h-2 w-2/3 bg-slate-400 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  )
}