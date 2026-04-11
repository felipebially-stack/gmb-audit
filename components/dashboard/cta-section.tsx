"use client"

import { ArrowRight, ShieldCheck, Lock, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CtaSection({ reportData }: { reportData?: any }) {
  const handleCheckout = () => {
    if (reportData && reportData.result) {
      localStorage.setItem('@gmbAudit:reportData', JSON.stringify(reportData));
    }
    window.location.href = "https://pay.kiwify.com.br/yM2aUy9"; 
  }

  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-blue-950 px-6 py-16 text-center sm:px-12 shadow-2xl border border-blue-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-800/40 via-blue-950 to-blue-950" />
      
      <div className="relative mx-auto max-w-3xl z-10">
        <h2 className="text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Pronto para descobrir por que você está perdendo clientes no Google?
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-200 font-medium">
          Por <strong className="text-white text-xl">apenas R$ 9,97</strong> você recebe o diagnóstico completo + plano de ação. Menos que um lanche para destravar as suas vendas.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4">
          <Button size="lg" className="w-full h-16 max-w-md gap-2 text-xl font-extrabold bg-orange-500 hover:bg-orange-600 text-white border-none shadow-[0_0_40px_rgba(249,115,22,0.5)] transition-all hover:scale-105 uppercase" onClick={handleCheckout}>
            <Lock className="h-6 w-6" /> Pagar R$ 9,97 e Receber
            <ArrowRight className="h-6 w-6" />
          </Button>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-blue-200 font-bold bg-blue-900/50 py-4 px-6 rounded-2xl border border-blue-800/50">
          <span className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-green-400" /> +1.247 entregues</span>
          <span className="hidden sm:inline text-blue-700">|</span>
          <span className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-blue-400" /> Pagamento seguro</span>
          <span className="hidden sm:inline text-blue-700">|</span>
          <span className="flex items-center gap-2 text-green-400">Garantia 7 dias</span>
        </div>
      </div>
    </section>
  )
}