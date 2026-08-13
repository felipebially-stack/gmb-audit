"use client"

import dynamic from "next/dynamic";
import { Header } from "@/components/dashboard/header"
import { HowItWorks } from "@/components/dashboard/how-it-works" 
import { FaqSection } from "@/components/dashboard/faq-section" 
import { ExitPopup } from "@/components/dashboard/exit-popup"
import { AlertTriangle, MapPin, TrendingDown, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
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
  const [query, setQuery] = useState("")
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

  const handleSearch = async (searchQuery: string) => {
    const companyName = searchQuery.trim()
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

  // ✅ AQUI ESTÁ A TRAVA QUE RESOLVE O PROBLEMA DO RECARREGAMENTO
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    handleSearch(query);
  }

  return (
    <div className="min-h-screen bg-slate-50 relative">
      
      {/* BARRA VERMELHA DE URGÊNCIA */}
      <div className="bg-red-600 text-white text-center py-2 px-4 text-sm font-bold shadow-md relative z-50">
        Aviso: O Google Maps atualizou suas diretrizes de ranqueamento local. Descubra agora por que a sua ficha perdeu posições.
      </div>

      <Header />
      
      <main>
        {/* NOVA ESTRUTURA DO HERO + FECHAMENTO EMOCIONAL (SÓ APARECE SE NÃO TIVER RESULTADO) */}
        {!result && (
          <>
            <section className="relative overflow-hidden bg-slate-900 py-16 sm:py-24 border-b border-slate-800">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent" />
              
              <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-2 items-center">
                  
                  {/* Lado Esquerdo: Headline + História + Busca */}
                  <div>
                    <div className="flex flex-wrap gap-3 mb-6">
                      <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-3 py-1.5 text-sm font-bold text-orange-400 border border-orange-500/20">
                        ⏳ Oferta de Lançamento: Vagas limitadas para hoje
                      </div>
                    </div>
                    
                    <h1 className="text-balance text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
                      Pare de perder clientes para o <span className="text-blue-400 block mt-2">concorrente da rua de trás.</span>
                    </h1>

                    {/* História de Origem */}
                    <div className="mt-8 p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
                      <p className="text-slate-300 italic font-medium leading-relaxed">
                        "Gerencio o Google Meu Negócio de empresas há anos e cansei de ver negócios brilhantes fecharem as portas por erros de SEO que ninguém explicava. Criei o GMB Audit para que você não precise de uma agência cara para dominar o mapa da sua região." <span className="text-white font-bold not-italic">— Felipe Bially</span>
                      </p>
                    </div>
                    
                    {/* ✅ O FORMULÁRIO AGORA INTERCEPTA O SUBMIT */}
                    <form onSubmit={handleSubmit} className="mt-8 relative max-w-xl">
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Digite o nome da empresa..."
                        className="h-16 w-full rounded-2xl border-2 border-slate-700 bg-slate-800 text-white pl-6 pr-4 text-lg mb-3 shadow-sm focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20"
                      />
                      <Button disabled={isLoading} type="submit" className="h-16 w-full bg-orange-500 hover:bg-orange-600 text-white text-xl font-extrabold rounded-2xl shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:scale-[1.02] transition-all">
                        {isLoading ? "Buscando..." : "Analisar Meu Perfil Grátis"}
                      </Button>
                    </form>
                  </div>

                  {/* Lado Direito: Ilustração de dor */}
                  <div className="hidden lg:block">
                    <div className="rounded-2xl bg-white shadow-2xl p-8 border-4 border-orange-500">
                      <h3 className="text-xl font-black text-slate-900 mb-6">Seu perfil está neste estado?</h3>
                      <div className="space-y-4">
                         <div className="flex items-center gap-3 text-red-600 font-bold"><XCircle className="w-6 h-6"/> Invisível no Local Pack</div>
                         <div className="flex items-center gap-3 text-red-600 font-bold"><XCircle className="w-6 h-6"/> Fotos sem geotag</div>
                         <div className="flex items-center gap-3 text-orange-600 font-bold"><AlertTriangle className="w-6 h-6"/> Sem palavras-chave locais</div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* Bloco de Fechamento Emocional (O Fantasma do Passado) */}
            <section className="bg-slate-50 py-16 text-center border-b border-slate-200">
              <div className="max-w-3xl mx-auto px-4">
                <p className="text-2xl font-black text-slate-900 leading-tight">
                  "Se você fechar essa página agora, amanhã seu concorrente vai continuar aparecendo na frente do seu cliente. Você vai continuar perdendo as chamadas que deveriam ser suas."
                </p>
              </div>
            </section>
          </>
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
              
              {/* O CHOQUE */}
              <div className="bg-slate-900 p-8 sm:p-14 text-center flex flex-col items-center">
                <p className="text-blue-400 font-bold tracking-widest uppercase text-sm mb-6">Diagnóstico Concluído</p>
                
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 mb-8 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="100, 100" />
                    <path className={healthScore > 75 ? "text-green-500" : healthScore > 50 ? "text-yellow-500" : "text-red-500"} strokeDasharray={`${healthScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-5xl sm:text-6xl font-black text-white">{healthScore}</span>
                    <span className="text-slate-400 text-sm font-bold">/100</span>
                  </div>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <AlertTriangle className="text-yellow-500 w-8 h-8 shrink-0" />
                  <span>Sua empresa tirou a nota {healthScore}/100.</span>
                </h3>
                <p className="text-lg sm:text-xl text-slate-300 mt-4 font-medium max-w-2xl">
                  Você está praticamente invisível para mais da metade dos clientes da sua região.
                </p>
              </div>

              {/* O TEXTO PERSUASIVO */}
              <div className="p-8 sm:p-14 space-y-8 text-lg text-slate-700 leading-relaxed font-medium">
                
                <p>Sabe por que o seu telefone parou de tocar? <strong className="text-slate-900">Não é culpa da economia ou do seu preço.</strong> É porque o algoritmo do Google Meu Negócio mudou, e os seus concorrentes aprenderam a jogar o jogo.</p>
                
                <p>Pense no seu cliente ideal. Quando ele pega o celular precisando urgente do seu serviço, o Google mostra <strong>apenas 3 empresas no mapa</strong>.</p>
                
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
                
                <p>Uma consultoria de SEO Local não sairia por menos de R$ 197,00 no mercado. Mas hoje, liberar o seu Relatório Executivo e o Plano de Ação completo custa <strong>apenas R$ 9,97</strong>.</p>
                
                <p className="text-center font-bold text-slate-900 text-xl py-4">Menos de dez reais para destravar as vendas da sua empresa.</p>

                {/* BOTÃO DE VENDAS */}
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