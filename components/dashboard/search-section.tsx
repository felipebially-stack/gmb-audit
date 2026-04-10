"use client"

import { Link2, MapPin, Star, TrendingUp, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

interface SearchSectionProps {
  onSearch?: (query: string) => void | Promise<void>
  isLoading?: boolean
}

export function SearchSection({ onSearch, isLoading = false }: SearchSectionProps) {
  const [query, setQuery] = useState("")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query)
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 via-white to-white py-12 sm:py-20 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/30 via-transparent to-transparent" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          
          <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            
            {/* Badge de Preço e Escassez */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1.5 text-sm font-bold text-red-700 border border-red-200">
                <span className="flex h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
                De R$ 197 por apenas R$ 15
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 border border-slate-200">
                🔥 Hoje já foram realizados 237 diagnósticos
              </div>
            </div>
            
            <h1 className="text-balance text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Seu negócio está perdendo clientes no Google todo dia? <span className="text-blue-600 block mt-2">Por apenas R$ 15 você descobre exatamente por quê.</span>
            </h1>
            
            <p className="mt-6 max-w-2xl text-pretty text-lg text-slate-600 font-medium">
              Diagnóstico completo do seu Google Meu Negócio feito por IA + Plano de Ação com as 9 otimizações que mais convertem em 2026. <br/><span className="text-slate-800 font-bold">Leva 47 segundos • Resultado instantâneo • Garantia de devolução total.</span>
            </p>

            <form onSubmit={handleSubmit} className="mt-8 relative max-w-xl">
              <div className="flex flex-col gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                    <Link2 className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Digite o nome da empresa ou link"
                    className="h-16 w-full rounded-xl border-2 border-slate-300 bg-white pl-12 pr-4 text-lg text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="h-16 flex-1 bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold rounded-xl shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:shadow-[0_0_40px_rgba(249,115,22,0.5)] transition-all uppercase tracking-wide hover:scale-[1.02]" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Buscando empresa..." : "Avaliar agora a minha empresa"}
                  </Button>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-green-500"/> Pagamento seguro</span>
                <span>•</span>
                <span>Acesso imediato</span>
                <span>•</span>
                <span>100% confidencial</span>
              </div>
            </form>
          </div>

          {/* Radar Animado Mantido */}
          <div className={`hidden lg:block relative transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <div className="relative mx-auto w-full max-w-lg">
              <div className="relative rounded-2xl bg-blue-950 shadow-2xl border border-blue-800 overflow-hidden aspect-[4/3] p-6 flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-800/30 via-blue-950 to-blue-950" />
                <div className="absolute h-72 w-72 rounded-full border border-blue-500/20"></div>
                <div className="absolute h-56 w-56 rounded-full border border-blue-400/20"></div>
                <div className="absolute h-36 w-36 rounded-full border border-blue-300/30"></div>
                <div className="absolute h-16 w-16 rounded-full border border-blue-200/40 bg-blue-500/20"></div>
                <div className="absolute h-72 w-72 animate-[spin_3s_linear_infinite] rounded-full border-r-2 border-blue-400 border-t-2 border-transparent border-b-transparent border-l-transparent opacity-80"></div>
                <div className="absolute top-1/4 left-1/4 animate-pulse"><MapPin className="h-8 w-8 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" /></div>
                <div className="absolute bottom-1/3 right-1/4 animate-bounce" style={{ animationDuration: '2.5s' }}><MapPin className="h-6 w-6 text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]" /></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}