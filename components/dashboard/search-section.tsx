"use client"

import { Link2, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export function SearchSection({ onSearch, isLoading = false }: { onSearch?: (q: string) => void, isLoading?: boolean }) {
  const [query, setQuery] = useState("")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => { setIsVisible(true) }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query)
  }

  return (
    // 👇 FUNDO ESCURO TECNOLÓGICO 👇
    <section className="relative overflow-hidden bg-slate-900 py-16 sm:py-24 lg:py-32 border-b border-slate-800">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          
          <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1.5 text-sm font-bold text-red-400 border border-red-500/20 shadow-sm">
                <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>
                De R$ 197 por apenas R$ 9,97
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1.5 text-sm font-bold text-slate-300 border border-slate-700 shadow-sm">
                🔥 237 diagnósticos hoje
              </div>
            </div>
            
            {/* Textos em branco para destacar no fundo escuro */}
            <h1 className="text-balance text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Seu negócio está perdendo clientes no Google? <span className="text-blue-400 block mt-2">Por apenas R$ 9,97 você descobre o porquê.</span>
            </h1>
            
            <p className="mt-6 max-w-2xl text-pretty text-lg text-slate-300 font-medium">
              Diagnóstico completo do seu Google Meu Negócio feito por IA + Plano de Ação. <br/><span className="text-white font-bold">Leva 47 segundos • Resultado instantâneo • Garantia de devolução.</span>
            </p>

            <form onSubmit={handleSubmit} className="mt-8 relative max-w-xl">
              <div className="flex flex-col gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                    <Link2 className="h-6 w-6 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Digite o nome da empresa..."
                    className="h-16 w-full rounded-2xl border-2 border-slate-700 bg-slate-800 text-white pl-12 pr-4 text-lg shadow-sm placeholder:text-slate-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20"
                  />
                </div>
                <Button type="submit" className="h-16 w-full bg-orange-500 hover:bg-orange-600 text-white text-xl font-extrabold rounded-2xl shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all uppercase tracking-wide hover:scale-[1.02]">
                  {isLoading ? "Buscando empresa..." : "Pagar R$ 9,97 e Receber Agora"}
                </Button>
              </div>
              <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-4 text-xs font-bold text-slate-400">
                <span className="flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-green-400"/> Pagamento seguro</span>
                <span>•</span>
                <span>Acesso imediato</span>
                <span>•</span>
                <span>100% confidencial</span>
              </div>
            </form>
          </div>

          <div className={`hidden lg:block relative transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <div className="relative mx-auto w-full max-w-lg">
              {/* Painel claro contrastando com o fundo escuro */}
              <div className="rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[400px]">
                <div className="h-12 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                  <div className="h-3 w-3 rounded-full bg-green-400"></div>
                  <div className="ml-4 h-4 w-32 bg-slate-200 rounded-md"></div>
                </div>
                <div className="p-8 flex-1 flex flex-col gap-8 bg-slate-50/50">
                  <div className="flex items-center gap-6">
                    <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-8 border-red-500 bg-white shadow-inner">
                      <span className="text-3xl font-extrabold text-slate-800">12</span>
                      <span className="absolute bottom-4 text-[10px] font-bold text-slate-400 uppercase">/100</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-800">Saúde do Perfil</h3>
                      <p className="text-sm font-medium text-red-600 flex items-center gap-1 mt-1"><AlertCircle className="h-4 w-4"/> Risco de invisibilidade</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-12 rounded-xl bg-red-50 border border-red-100 flex items-center px-4 gap-3"><AlertCircle className="h-5 w-5 text-red-500"/><div className="h-2 w-1/2 bg-red-200 rounded"></div></div>
                    <div className="h-12 rounded-xl bg-green-50 border border-green-100 flex items-center px-4 gap-3"><CheckCircle2 className="h-5 w-5 text-green-500"/><div className="h-2 w-2/3 bg-green-200 rounded"></div></div>
                    <div className="h-12 rounded-xl bg-red-50 border border-red-100 flex items-center px-4 gap-3"><AlertCircle className="h-5 w-5 text-red-500"/><div className="h-2 w-1/3 bg-red-200 rounded"></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}