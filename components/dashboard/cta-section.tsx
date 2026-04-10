"use client"

import { ArrowRight, FileText, ShieldCheck, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

// 👇 1. Adicionamos a propriedade reportData para receber os dados
export function CtaSection({ reportData }: { reportData?: any }) {
  
  // 👇 2. Nova função inteligente de Checkout
  const handleCheckout = () => {
    // Guarda no "Cofre Invisível" se houver dados pesquisados
    if (reportData && reportData.result) {
      localStorage.setItem('@gmbAudit:reportData', JSON.stringify(reportData));
    }

    // Redireciona para o checkout
    // ATENÇÃO: Substitua o link abaixo pelo seu link real da Kiwify ou Mercado Pago
    window.location.href = "https://pay.kiwify.com.br/SEU_LINK_AQUI"; 
  }

  return (
    <section className="relative overflow-hidden rounded-2xl bg-slate-900 px-6 py-12 text-center sm:px-12 sm:py-16 shadow-xl border border-slate-800">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent" />
      
      <div className="relative mx-auto max-w-2xl">
        <h2 className="text-balance text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
          Pronto para Dominar as Buscas Locais?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-base text-slate-300 sm:text-lg">
          O nosso sistema inteligente já mapeou o algoritmo do Google. Receba agora o passo a passo exato que centenas de empresas estão a usar para sair da invisibilidade e multiplicar as vendas.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {/* 👇 3. Botão Principal de Vendas ATUALIZADO 👇 */}
          <Button
            size="lg"
            className="w-full gap-2 text-base font-bold sm:w-auto bg-green-600 hover:bg-green-500 text-white border-none shadow-[0_0_20px_rgba(22,163,74,0.4)] transition-all"
            onClick={handleCheckout}
          >
            <FileText className="h-5 w-5" />
            Liberar Meu Plano de Ação
            <ArrowRight className="h-4 w-4" />
          </Button>

          {/* Botão Secundário de E-mail mantido */}
          <a href="mailto:felipebially@gmail.com?subject=Dúvida sobre a Auditoria GMB" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full gap-2 text-base font-medium sm:w-auto text-slate-300 border-slate-700 bg-transparent hover:bg-slate-800 hover:text-white"
            >
              <Mail className="h-5 w-5" />
              Falar com alguém
            </Button>
          </a>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-green-500" />
            Acesso Imediato (PDF)
          </span>
          <span className="hidden sm:inline opacity-50">•</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-blue-400" />
            Pagamento 100% Seguro
          </span>
        </div>
      </div>
    </section>
  )
}