"use client"

import { Link2, Map, Star, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

interface SearchSectionProps {
  onSearch?: (query: string) => void | Promise<void>
  isLoading?: boolean
}

export function SearchSection({ onSearch, isLoading = false }: SearchSectionProps) {
  const [query, setQuery] = useState("")
  const [isVisible, setIsVisible] = useState(false)

  // Efeito simples para acionar a animação quando a página carrega
  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query)
  }

  return (
    <section className="relative overflow-hidden bg-slate-50 py-16 sm:py-24 lg:py-32">
      {/* Background Decorativo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          
          {/* Coluna da Esquerda (Textos e Busca) */}
          <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/80 px-3 py-1 text-sm font-semibold text-blue-800 mb-6 border border-blue-200">
              <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
              Sistema de Inteligência Local
            </div>
            
            <h1 className="text-balance text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Avaliação Gratuita de <span className="text-blue-600">Google Meu Negócio</span>
            </h1>
            
            <p className="mt-6 max-w-2xl text-pretty text-lg text-slate-600">
              Descubra o que está travando as suas vendas no mapa. Faça uma avaliação agora e receba um plano de ação prático para dominar as buscas na sua região!
            </p>

            <form onSubmit={handleSubmit} className="mt-10 relative max-w-xl">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                    <Link2 className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Digite o nome da empresa ou link"
                    className="h-14 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 text-base text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all" 
                  disabled={isLoading}
                >
                  {isLoading ? "Avaliando..." : "Avaliar Empresa"}
                </Button>
              </div>
              <p className="mt-3 text-xs text-slate-500 font-medium">
                Ex: Restaurante Sabor da Casa ou cole a URL do Google Maps
              </p>
            </form>
          </div>

          {/* Coluna da Direita (Imagem / Ilustração) */}
          <div className={`hidden lg:block relative transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <div className="relative mx-auto w-full max-w-lg">
              {/* Imagem principal (Mapa abstrato) */}
              <div className="relative rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden aspect-[4/3]">
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop" 
                  alt="Mapa de buscas locais" 
                  className="object-cover w-full h-full opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
              </div>

              {/* Cards flutuantes decorativos para dar um ar de SaaS dinâmico */}
              <div className="absolute -bottom-6 -left-6 rounded-xl bg-white p-4 shadow-xl border border-slate-100 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Ranking Local</p>
                    <p className="text-sm font-bold text-slate-900">Top 3 Alcançado</p>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 rounded-xl bg-white p-4 shadow-xl border border-slate-100 animate-bounce" style={{ animationDuration: '4s' }}>
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Nota Média</p>
                    <p className="text-sm font-bold text-slate-900">4.9/5.0</p>
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