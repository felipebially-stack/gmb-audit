"use client"

import { useState, useEffect } from "react"
import { X, ArrowRight, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ExitPopup({ reportData }: { reportData?: any }) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Verifica se já mostramos o popup nesta sessão
    const hasSeenPopup = sessionStorage.getItem("@gmbAudit:exitPopup")

    const handleMouseLeave = (e: MouseEvent) => {
      // Se o mouse sair pela parte de cima da tela (clientY <= 0)
      if (e.clientY <= 0 && !hasSeenPopup) {
        setIsOpen(true)
        sessionStorage.setItem("@gmbAudit:exitPopup", "true")
      }
    }

    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  if (!isOpen) return null

  const handleCheckout = () => {
    if (reportData && reportData.result) {
      localStorage.setItem('@gmbAudit:reportData', JSON.stringify(reportData));
    }
    // 👇 ATENÇÃO: COLOQUE AQUI O SEU LINK DA KIWIFY COM O PREÇO DE R$ 6,90 👇
    window.location.href = "https://pay.kiwify.com.br/SEU_LINK_COM_DESCONTO"; 
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-lg scale-100 transform overflow-hidden rounded-[2rem] bg-white p-8 text-center shadow-2xl transition-all">
        
        {/* Botão de Fechar */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Ícone de Alerta em Vermelho (Urgência) */}
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 border-4 border-red-50">
          <AlertTriangle className="h-10 w-10 text-red-600" />
        </div>

        {/* 👇 NOVA HEADLINE MAIS AGRESSIVA 👇 */}
        <h2 className="mb-3 text-3xl font-extrabold text-slate-900">
          Você tem certeza que vai perder essa oferta?
        </h2>
        
        <p className="mb-6 text-lg text-slate-600 font-medium">
          Essa é literalmente a sua <strong className="text-red-600">última chance</strong> de levar o Plano de Ação completo antes que essa página expire e o valor volte ao normal.
        </p>

        {/* Caixa de Preço */}
        <div className="mb-8 rounded-2xl bg-slate-50 p-6 border border-slate-200">
          <p className="text-sm font-bold text-slate-400 line-through mb-1">Preço normal: R$ 197,00</p>
          <p className="text-sm font-bold text-slate-500 line-through mb-2">Preço de hoje: R$ 9,97</p>
          <p className="text-4xl font-extrabold text-green-600 animate-pulse">Por apenas R$ 6,90</p>
        </div>

        {/* Botão de Compra com Desconto */}
        <Button
          onClick={handleCheckout}
          className="h-16 w-full bg-green-500 text-xl font-extrabold uppercase tracking-wide text-white shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all hover:scale-105 hover:bg-green-600 rounded-2xl"
        >
          Quero minha Última Chance
          <ArrowRight className="ml-2 h-6 w-6" />
        </Button>
        
        {/* Botão de Recusa Negativa */}
        <button 
          onClick={() => setIsOpen(false)}
          className="mt-6 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors underline underline-offset-4"
        >
          Não, eu assumo o risco de perder clientes para o meu concorrente.
        </button>
      </div>
    </div>
  )
}