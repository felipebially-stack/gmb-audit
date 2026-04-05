"use client"
import dynamic from "next/dynamic";
import { Header } from "@/components/dashboard/header"
import { SearchSection } from "@/components/dashboard/search-section"
import { HealthScore } from "@/components/dashboard/health-score"
import { MetricsCards } from "@/components/dashboard/metrics-cards"
import { SeoChecklist } from "@/components/dashboard/seo-checklist"
import { KeywordRankings } from "@/components/dashboard/keyword-rankings"
import { CtaSection } from "@/components/dashboard/cta-section"
const ReportGenerator = dynamic(() => import("@/components/dashboard/ReportGenerator"), {
  ssr: false,
});
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

  // 👇 ALGORITMO RIGOROSO DE SAÚDE APLICADO AQUI 👇
  const healthScore = useMemo(() => {
    if (!result) return 0;

    // 1. REPUTAÇÃO (Nota de Estrelas - Máximo de 40 pontos)
    const rating = result.rating || 0;
    const reputationScore = (rating / 5) * 40;

    // 2. AUTORIDADE (Volume de Avaliações - Máximo de 30 pontos)
    // O Google exige volume para dar destaque. Menos de 250 avaliações = perde pontos.
    const reviews = result.userRatingsTotal || 0;
    const authorityScore = Math.min((reviews / 250) * 30, 30);

    // 3. DESTAQUE (Ranking de Palavras-chave - Máximo de 30 pontos)
    // Penaliza severamente se a empresa estiver invisível nas buscas (Posição > 10).
    let rankingScore = 0;
    const rankings = result.rankings || [];
    
    if (rankings.length > 0) {
      let top3Count = 0;
      let top10Count = 0;

      rankings.forEach(r => {
        if (r.position && r.position <= 3) top3Count++;
        else if (r.position && r.position <= 10) top10Count++;
      });

      // 10 pontos por cada palavra no Top 3, 5 pontos por Top 10.
      rankingScore = Math.min((top3Count * 10) + (top10Count * 5), 30);
    }

    // Calcula a nota final somando os 3 pilares do Google
    const finalScore = Math.round(reputationScore + authorityScore + rankingScore);

    // Garante que a nota fique entre 10 e 100 (nunca 0 para não parecer erro do site)
    return Math.max(10, Math.min(finalScore, 100));
    
  }, [result]);
  // 👆 FIM DO ALGORITMO RIGOROSO 👆

  const keywordRankings = useMemo(() => {
    const fromApi = result?.rankings
    if (!Array.isArray(fromApi)) return []

    const traduzirTermo = (termo: string) => {
      let t = termo.toLowerCase();
      const dicionario: Record<string, string> = {
        "building materials store": "loja de materiais de construção",
        "hardware store": "loja de ferragens",
        "home goods store": "loja de utilidades domésticas",
        "clothing store": "loja de roupas",
        "shoe store": "loja de calçados",
        "furniture store": "loja de móveis",
        "electronics store": "loja de eletrônicos",
        "department store": "loja de departamentos",
        "jewelry store": "joalheria",
        "pet store": "pet shop",
        "convenience store": "loja de conveniência",
        "grocery store": "mercearia",
        "liquor store": "distribuidora de bebidas",
        "book store": "livraria",
        "bicycle store": "loja de bicicletas",
        "store": "loja",
        "farm": "viveiro de plantas",
        "bakery": "padaria",
        "cafe": "cafeteria",
        "coffee shop": "cafeteria",
        "restaurant": "restaurante",
        "bar": "bar",
        "supermarket": "supermercado",
        "shopping mall": "shopping center",
        "veterinary care": "clínica veterinária",
        "hospital": "hospital",
        "pharmacy": "farmácia",
        "drugstore": "farmácia",
        "doctor": "médico",
        "dentist": "dentista",
        "gym": "academia",
        "spa": "clínica de estética",
        "beauty salon": "salão de beleza",
        "hair care": "cabeleireiro",
        "car repair": "oficina mecânica",
        "car wash": "lava rápido",
        "car dealer": "concessionária",
        "gas station": "posto de gasolina",
        "parking": "estacionamento",
        "real estate agency": "imobiliária",
        "travel agency": "agência de viagens",
        "lawyer": "escritório de advocacia",
        "accounting": "escritório de contabilidade",
        "florist": "floricultura",
        "plumber": "encanador",
        "electrician": "eletricista",
        "moving company": "empresa de mudanças",
        "locksmith": "chaveiro",
        "painter": "pintor",
        "roofing contractor": "empreiteira"
      };

      for (const [eng, pt] of Object.entries(dicionario)) {
        if (t.includes(eng)) {
          t = t.replace(eng, pt);
        }
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
        headers: {
          "Content-Type": "application/json",
        },
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
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <SearchSection onSearch={handleSearch} isLoading={isLoading} />
        
        {/* Results Section */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                Resultados da Auditoria
              </h2>
              {/* NOVO SUBTÍTULO AQUI */}
              <p className="mt-2 text-md text-muted-foreground font-medium text-blue-600">
                Descubra o que está travando as suas vendas no mapa e como superar a concorrência.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {isLoading ? "Buscando dados..." : result?.companyName ? `${result.companyName} - ${result.address}` : "Pesquise uma empresa para ver os dados reais"}
              </p>
            </div>
            <div className="hidden items-center gap-2 rounded-full bg-success/10 px-3 py-1.5 text-xs font-medium text-success sm:flex">
              <span className="h-2 w-2 rounded-full bg-success" />
              Atualizado agora
            </div>
          </div>

          {errorMessage && (
            <p className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {errorMessage}
            </p>
          )}

          <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
            {/* Health Score */}
            <div className="lg:col-span-1">
              <HealthScore score={isLoading ? 0 : healthScore} />
            </div>

            {/* Metrics Cards */}
            <div className="lg:col-span-2">
              <MetricsCards
                rating={result?.rating ?? null}
                userRatingsTotal={result?.userRatingsTotal ?? null}
                address={result?.address ?? null}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* SEO Checklist */}
          <div className="mt-6 sm:mt-8">
            <SeoChecklist data={result} healthScore={healthScore} />
          </div>

          {/* Keyword Rankings */}
          <div className="mt-6 sm:mt-8">
            <KeywordRankings
              rankings={keywordRankings}
              isLoading={isLoading}
              serpStatus={result?.serpStatus}
            />
          </div>

         {/* Report generator */}
         <div className="mt-6">
            {result && result.rating ? (
              <ReportGenerator
                companyName={result.companyName || ""}
                address={result.address || ""}
                rating={result.rating}
                userRatingsTotal={result.userRatingsTotal || 0}
                rankings={keywordRankings || []}
                healthScore={healthScore}
                checklistData={result} 
              />
            ) : null}
          </div>

          {/* 🌟 NOVA SEÇÃO: PROVAS SOCIAIS (DEPOIMENTOS) 🌟 */}
          <div className="mt-16 bg-slate-50 py-12 px-6 rounded-2xl border border-slate-200">
            <h2 className="text-2xl font-bold text-center mb-8 text-slate-800">Donos de negócios que já aplicaram o Plano de Ação:</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex text-yellow-400 mb-3">★★★★★</div>
                <p className="italic text-slate-600 text-sm">"Paguei R$ 15 nesse diagnóstico e descobri exatamente o erro que estava travando as vendas da minha loja."</p>
                <div className="mt-4 font-bold text-sm text-slate-900">- Maria S., Dona de Loja</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex text-yellow-400 mb-3">★★★★★</div>
                <p className="italic text-slate-600 text-sm">"Eu não entendia por que o meu concorrente vendia mais. O plano de ação me deu tudo mastigado. Recomendo muito!"</p>
                <div className="mt-4 font-bold text-sm text-slate-900">- Roberto A., Auto Center</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex text-yellow-400 mb-3">★★★★★</div>
                <p className="italic text-slate-600 text-sm">"Muito fácil. Copiei e colei as instruções no meu perfil do Google e na mesma semana já vi diferença."</p>
                <div className="mt-4 font-bold text-sm text-slate-900">- Fernando P., Padaria</div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-8 sm:mt-12">
            <CtaSection />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2026 GMB Audit. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Termos de Uso
              </a>
              <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Privacidade
              </a>
              {/* 👇 LINK DE SUPORTE ATUALIZADO AQUI 👇 */}
              <a href="mailto:felipebially@gmail.com" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Suporte
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}