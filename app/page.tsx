"use client"

import dynamic from "next/dynamic";
import { Header } from "@/components/dashboard/header"
import { SearchSection } from "@/components/dashboard/search-section"
import { HowItWorks } from "@/components/dashboard/how-it-works" 
import { HealthScore } from "@/components/dashboard/health-score"
import { FaqSection } from "@/components/dashboard/faq-section" 
import { ExitPopup } from "@/components/dashboard/exit-popup"
import { AlertTriangle, MapPin, TrendingDown } from "lucide-react"
import { useMemo, useState } from "react"

const ReportGenerator = dynamic(() => import("@/components/dashboard/ReportGenerator"), {
  ssr: false,
});

interface PlaceAuditData {
  companyName: string
  rating: number | null
  userRatingsTotal: number | null
  address: string | null
  rankings: KeywordRanking[]
  checklistData?: any
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
    <div className="min-h-screen bg-slate-50 relative">
      
      {/* BARRA VERMELHA DE URGÊNCIA (NOVO PREÇO E COPY) */}
      <div className="bg-red-600 text-white text-center py-2 px-4 text-sm font-bold shadow-md relative z-50">
        Aviso: O Google Maps atualizou suas diretrizes de ranqueamento local. Descubra agora por que a sua ficha perdeu posições.
      </div>

      <Header />
      
      <main>
        {/* BUSCA: Só aparece se não tiver resultado */}
        {!result && (
          <SearchSection onSearch={handleSearch} isLoading={isLoading} />
        )}
        
        {/* COMO FUNCIONA: Só aparece se não tiver resultado */}
        {!result && !isLoading && (
          <HowItWorks />
        )}

        {errorMessage && (
          <div className="max-w-4xl mx-auto mt-8 px-4">
            <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 font-bold">
              {errorMessage}
            </p>
          </div>
        )}
        
        {/* 👇 A CARTA DE VENDAS (SÓ APARECE APÓS A PESQUISA) 👇 */}
        {result && result.rating && (
          <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-extrabold text-slate-900 flex items-center justify-center gap-2 mb-2">
                <MapPin className="text-blue-600" /> {result.companyName}
              </h2>
              <p className="text-slate-500">{result.address}</p>
            </div>

            <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200">
              
              {/* O CHOQUE (Health Score Grande) */}
              <div className="bg-slate-900 p-10 text-center flex flex-col items-center">
                <p className="text-blue-400 font-bold tracking-widest uppercase text-sm mb-6">Diagnóstico Concluído</p>
                
                <div className="w-48 h-48 mb-6">
                  <HealthScore score={isLoading ? 0 : healthScore} />
                </div>
                
                <h3 className="text-3xl font-black text-white mt-4 flex items-center gap-3">
                  <AlertTriangle className="text-yellow-500 w-8 h-8" />
                  Sua empresa tirou a nota {healthScore}/100.
                </h3>
                <p className="text-xl text-slate-300 mt-3 font-medium max-w-2xl">
                  Você está praticamente invisível para mais da metade dos clientes da sua região.
                </p>
              </div>

              {/* O TEXTO PERSUASIVO */}
              <div className="p-10 sm:p-14 space-y-8 text-lg text-slate-700 leading-relaxed font-medium">
                
                <p>Sabe por que o seu telefone parou de tocar? <strong className="text-slate-900">Não é culpa da economia ou do seu preço.</strong> É porque o algoritmo do Google Meu Negócio mudou, e os seus concorrentes aprenderam a jogar o jogo.</p>
                
                <p>Pense no seu cliente ideal. Seja você dono de uma empresa de serviços de pintura ou de um escritório focado em defesa patrimonial. Quando o seu cliente pega o celular precisando urgente do seu serviço, o Google mostra <strong>apenas 3 empresas no mapa</strong>.</p>
                
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl">
                  <p className="flex items-start gap-3 text-red-900">
                    <TrendingDown className="w-6 h-6 shrink-0 mt-1" />
                    <span>Essas 3 empresas levam <strong>60% de todos os cliques e ligações da cidade</strong>.</span>
                  </p>
                </div>

                <p>Se a sua ficha apresenta a pontuação que você acabou de ver acima, <strong>você nunca será uma dessas 3 opções.</strong> Pior: você está entregando dinheiro de mão beijada para a concorrência todos os dias.</p>
                
                <h4 className="text-2xl font-black text-slate-900 pt-6">A Solução Rápida</h4>
                
                <p>Nossa Inteligência Artificial cruzou os dados da sua ficha com as diretrizes oficiais do Google e encontrou exatamente o que está travando o seu perfil. Nós agrupamos as falhas e a solução em um <strong>Plano de Domínio Local (PDF)</strong> mastigado para você.</p>
                
                <ul className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-200 text-base">
                  <li className="flex gap-3"><span className="text-green-500 font-black">✓</span> <strong>A Auditoria:</strong> Descubra para quais palavras-chave você simplesmente não existe.</li>
                  <li className="flex gap-3"><span className="text-green-500 font-black">✓</span> <strong>O Kit Copie e Cole:</strong> A IA já escreveu a sua nova descrição e o roteiro das suas postagens. É só copiar.</li>
                  <li className="flex gap-3"><span className="text-green-500 font-black">✓</span> <strong>O Checklist de 7 Dias:</strong> As tarefas urgentes para fazer o algoritmo devolver as suas ligações em 72 horas.</li>
                </ul>

                <p className="pt-4">Você pode tentar adivinhar o que está errado e perder semanas testando, ou pode receber o plano exato do que alterar hoje para o telefone voltar a tocar.</p>
                
                <p>Uma consultoria de SEO Local não sairia por menos de R$ 1.000,00 no mercado. Por isso, liberar o seu Relatório Executivo e o Plano de Ação completo custa <strong>apenas R$ 9,97</strong>.</p>
                
                <p className="text-center font-bold text-slate-900 text-xl py-4">Menos de dez reais para destravar as vendas da sua empresa.</p>

                {/* 👇 O BOTÃO DE VENDAS QUE SUBSTITUI TODO O RESTO 👇 */}
                <ReportGenerator
                  companyName={result.companyName || ""}
                  address={result.address || ""}
                  rating={result.rating}
                  userRatingsTotal={result.userRatingsTotal || 0}
                  rankings={keywordRankings || []}
                  healthScore={healthScore}
                  checklistData={result.checklistData}
                />
              </div>
            </div>
          </section>
        )}

        {/* DEPOIMENTOS GIGANTES */}
        <div className="mt-20 bg-blue-950 py-20 px-6 rounded-[3rem] shadow-2xl relative overflow-hidden max-w-7xl mx-auto">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-800/30 via-transparent to-transparent" />
          <div className="relative z-10">
            <h2 className="text-4xl font-extrabold text-center mb-16 text-white">Negócios que investiram R$ 9,97 e viraram o jogo:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              
              <div className="bg-white p-10 rounded-3xl shadow-xl relative transform transition hover:-translate-y-2">
                <div className="absolute -top-5 right-6 bg-green-500 text-white text-sm font-extrabold px-4 py-2 rounded-full shadow-lg">+412% de visualizações</div>
                <div className="flex text-yellow-400 mb-6 text-xl">★★★★★</div>
                <p className="italic text-slate-700 text-lg leading-relaxed font-medium">"Eu achava que o problema era preço, mas o diagnóstico me mostrou que eu estava invisível no mapa. Paguei R$ 9,97, apliquei o PDF e meu telefone não para de tocar."</p>
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
                <p className="italic text-slate-700 text-lg leading-relaxed font-medium">"Por R$ 9,97 recebi um relatório prático que me disse exatamente o que fazer. Hoje os orçamentos chegam sozinhos no WhatsApp. Incrível."</p>
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

      <ExitPopup reportData={{ result, healthScore, keywordRankings }} />
    </div>
  )
}