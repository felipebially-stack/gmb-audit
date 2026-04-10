"use client"
import dynamic from "next/dynamic";
import { Header } from "@/components/dashboard/header"
import { SearchSection } from "@/components/dashboard/search-section"
import { HowItWorks } from "@/components/dashboard/how-it-works" 
import { HealthScore } from "@/components/dashboard/health-score"
import { MetricsCards } from "@/components/dashboard/metrics-cards"
import { SeoChecklist } from "@/components/dashboard/seo-checklist"
import { KeywordRankings } from "@/components/dashboard/keyword-rankings"
import { FaqSection } from "@/components/dashboard/faq-section" 
import { CtaSection } from "@/components/dashboard/cta-section"

import { useMemo, useState } from "react"

interface PlaceAuditData {
  companyName: string
  rating: number | null
  userRatingsTotal: number | null
  address: string | null
  rankings: KeywordRanking[]
  serpStatus?: "ok" | "api_unavailable" | "not_configured"
}

interface KeywordRanking {
  keyword: string
  position: number | null
  previousPosition: number | null
  searchVolume: string
}

export default function AuditDashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [result, setResult] = useState<PlaceAuditData | null>(null)

  const healthScore = useMemo(() => {
    if (!result) return 0;
    const rating = result.rating || 0;
    const reputationScore = (rating / 5) * 40;
    const reviews = result.userRatingsTotal || 0;
    const authorityScore = Math.min((reviews / 250) * 30, 30);
    let rankingScore = 0;
    const rankings = result.rankings || [];
    
    if (rankings.length > 0) {
      let top3Count = 0;
      let top10Count = 0;
      rankings.forEach(r => {
        if (r.position && r.position <= 3) top3Count++;
        else if (r.position && r.position <= 10) top10Count++;
      });
      rankingScore = Math.min((top3Count * 10) + (top10Count * 5), 30);
    }
    const finalScore = Math.round(reputationScore + authorityScore + rankingScore);
    return Math.max(10, Math.min(finalScore, 100));
  }, [result]);

  const keywordRankings = useMemo(() => {
    const fromApi = result?.rankings
    if (!Array.isArray(fromApi)) return []

    const traduzirTermo = (termo: string) => {
      let t = termo.toLowerCase();
      const dicionario: Record<string, string> = {
        "building materials store": "loja de materiais de construção", "hardware store": "loja de ferragens", "home goods store": "loja de utilidades domésticas", "clothing store": "loja de roupas", "shoe store": "loja de calçados", "furniture store": "loja de móveis", "electronics store": "loja de eletrônicos", "department store": "loja de departamentos", "jewelry store": "joalheria", "pet store": "pet shop", "convenience store": "loja de conveniência", "grocery store": "mercearia", "liquor store": "distribuidora de bebidas", "book store": "livraria", "bicycle store": "loja de bicicletas", "store": "loja", "farm": "viveiro de plantas", "bakery": "padaria", "cafe": "cafeteria", "coffee shop": "cafeteria", "restaurant": "restaurante", "bar": "bar", "supermarket": "supermercado", "shopping mall": "shopping center", "veterinary care": "clínica veterinária", "hospital": "hospital", "pharmacy": "farmácia", "drugstore": "farmácia", "doctor": "médico", "dentist": "dentista", "gym": "academia", "spa": "clínica de estética", "beauty salon": "salão de beleza", "hair care": "cabeleireiro", "car repair": "oficina mecânica", "car wash": "lava rápido", "car dealer": "concessionária", "gas station": "posto de gasolina", "parking": "estacionamento", "real estate agency": "imobiliária", "travel agency": "agência de viagens", "lawyer": "escritório de advocacia", "accounting": "escritório de contabilidade", "florist": "floricultura", "plumber": "encanador", "electrician": "eletricista", "moving company": "empresa de mudanças", "locksmith": "chaveiro", "painter": "pintor", "roofing contractor": "empreiteira"
      };
      for (const [eng, pt] of Object.entries(dicionario)) {
        if (t.includes(eng)) { t = t.replace(eng, pt); }
      }
      return t.split(' ').map(word => {
        if (["de", "da", "do", "das", "dos", "e", "em"].includes(word)) return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
      }).join(' ');
    }

    return fromApi.map((row) => {
      const toNum = (v: unknown): number | null => {
        if (v === null || v === undefined) return null
        const n = typeof v === "number" ? v : Number(v)
        return Number.isFinite(n) ? n : null
      }
      return {
        keyword: traduzirTermo(String(row.keyword ?? "")),
        searchVolume: String(row.searchVolume ?? ""),
        position: toNum(row.position),
        previousPosition: toNum(row.previousPosition),
      }
    })
  }, [result?.rankings])

  const handleSearch = async (query: string) => {
    const companyName = query.trim()
    if (!companyName) {
      setErrorMessage("Digite o nome de uma empresa para pesquisar.")
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const response = await fetch("/api/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: companyName }),
        cache: "no-store", 
      })

      const data = (await response.json()) as PlaceAuditData & { error?: string }
      if (!response.ok) {
        setResult(null)
        setErrorMessage(data.error ?? "Não foi possível buscar os dados da empresa.")
        return
      }

      setResult(data)
    } catch {
      setResult(null)
      setErrorMessage("Falha de conexão ao buscar dados.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 relative">
      
      {/* 👇 BARRA VERMELHA DE URGÊNCIA (NOVO PREÇO) 👇 */}
      <div className="bg-red-600 text-white text-center py-2 px-4 text-sm font-bold shadow-md relative z-50">
        Apenas mais 47 diagnósticos com preço promocional de R$ 9,97 hoje. Aproveite antes que volte para R$ 197.
      </div>

      <Header />
      
      <main>
        <SearchSection onSearch={handleSearch} isLoading={isLoading} />
        
        {!result && !isLoading && (
          <HowItWorks />
        )}
        
        {/* Results Section */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          {(result || isLoading) && (
            <div className="mb-8 flex flex-col gap-2">
              <h2 className="text-2xl font-extrabold text-slate-900">
                Resultados da Avaliação
              </h2>
              <p className="text-lg text-blue-600 font-bold">
                {isLoading ? "Buscando dados..." : result?.companyName ? `${result.companyName} - ${result.address}` : ""}
              </p>
            </div>
          )}

          {errorMessage && (
            <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 font-bold">
              {errorMessage}
            </p>
          )}

          {(result || isLoading) && (
            <>
              <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
                <div className="lg:col-span-1">
                  <HealthScore score={isLoading ? 0 : healthScore} />
                </div>
                <div className="lg:col-span-2">
                  <MetricsCards
                    rating={result?.rating ?? null}
                    userRatingsTotal={result?.userRatingsTotal ?? null}
                    address={result?.address ?? null}
                    isLoading={isLoading}
                  />
                </div>
              </div>

              <div className="mt-6 sm:mt-8">
                <SeoChecklist data={result} healthScore={healthScore} />
              </div>

              <div className="mt-6 sm:mt-8">
                <KeywordRankings
                  rankings={keywordRankings}
                  isLoading={isLoading}
                  serpStatus={result?.serpStatus}
                />
              </div>
            </>
          )}

          {/* 👇 SUPER DESTAQUE NOS DEPOIMENTOS (FUNDO AZUL MARINHO GIGANTE) 👇 */}
          <div className="mt-20 bg-blue-950 py-20 px-6 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-800/30 via-transparent to-transparent" />
            <div className="relative z-10">
              <h2 className="text-4xl font-extrabold text-center mb-16 text-white">Negócios que investiram R$ 9,97 e viraram o jogo:</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                
                <div className="bg-white p-10 rounded-3xl shadow-xl relative transform transition hover:-translate-y-2">
                  <div className="absolute -top-5 right-6 bg-green-500 text-white text-sm font-extrabold px-4 py-2 rounded-full shadow-lg">+412% de visualizações</div>
                  <div className="flex text-yellow-400 mb-6 text-xl">★★★★★</div>
                  <p className="italic text-slate-700 text-lg leading-relaxed font-medium">"Paguei R$ 9,97 e em 3 dias já vi diferença. Segui o passo a passo da IA e o telefone não para de tocar. Melhor investimento que já fiz!"</p>
                  <div className="mt-8 flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-black text-xl">MC</div>
                    <div>
                      <div className="font-extrabold text-lg text-slate-900">Maria Clara</div>
                      <div className="text-sm font-medium text-slate-500">Doceria Doce Encanto, SP</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-10 rounded-3xl shadow-xl relative transform transition hover:-translate-y-2">
                  <div className="absolute -top-5 right-6 bg-green-500 text-white text-sm font-extrabold px-4 py-2 rounded-full shadow-lg">Top 3 em 1 semana</div>
                  <div className="flex text-yellow-400 mb-6 text-xl">★★★★★</div>
                  <p className="italic text-slate-700 text-lg leading-relaxed font-medium">"Por R$ 9,97 recebi um relatório mais prático que o de um consultor que me cobrou R$ 1.200. Incrível, não tem pegadinha."</p>
                  <div className="mt-8 flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-black text-xl">RM</div>
                    <div>
                      <div className="font-extrabold text-lg text-slate-900">Roberto M.</div>
                      <div className="text-sm font-medium text-slate-500">Auto Center, RJ</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="mt-20">
            <FaqSection />
          </div>

          <div className="mt-16 mb-10" id="planos">
            <CtaSection reportData={{ result, healthScore, keywordRankings }} />
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm font-bold text-slate-500">
            © 2026 GMB Audit. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-sm font-bold text-slate-500">
            <a href="#" className="hover:text-blue-600">Termos de Uso</a>
            <a href="#" className="hover:text-blue-600">Privacidade</a>
            <a href="mailto:felipebially@gmail.com" className="hover:text-blue-600">Suporte</a>
          </div>
        </div>
      </footer>
    </div>
  )
}