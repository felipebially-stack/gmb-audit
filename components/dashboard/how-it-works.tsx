"use client"

import { Search, Zap, Trophy } from "lucide-react"

export function HowItWorks() {
  return (
    // 👇 FUNDO GRAFITE 👇
    <section id="como-funciona" className="bg-slate-800 py-20 border-b border-slate-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Por apenas R$ 9,97 a IA mais avançada do Brasil <span className="text-blue-400 block mt-2">faz o que nenhum consultor faria por menos de R$ 800</span>
          </h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          <div className="relative flex flex-col items-center text-center bg-slate-900 p-8 rounded-3xl border border-slate-700 shadow-xl">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Search className="h-10 w-10" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-white">1. Localizamos como um cliente faria</h3>
            <p className="text-slate-400 text-base leading-relaxed mb-6">
              Basta digitar o nome da sua empresa. A nossa IA rastreia o seu perfil exato no mapa para iniciar a varredura.
            </p>
            <div className="w-full mt-auto bg-slate-800 rounded-xl p-3 border border-slate-700">
              <p className="text-sm font-bold text-slate-300">"68% dos concorrentes já estão na base..."</p>
            </div>
          </div>

          <div className="relative flex flex-col items-center text-center bg-slate-900 p-8 rounded-3xl border border-slate-700 shadow-xl">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Zap className="h-10 w-10" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-white">2. Analisamos os 127 fatores do Google</h3>
            <p className="text-slate-400 text-base leading-relaxed mb-6">
              A nossa IA fará um raio-x profundo, comparando a sua densidade de palavras-chave e fotos com os líderes da sua região.
            </p>
            <div className="w-full mt-auto bg-orange-500/10 rounded-xl p-3 border border-orange-500/20">
              <p className="text-sm font-bold text-orange-400">"Falhas identificadas em 47 segundos..."</p>
            </div>
          </div>

          <div className="relative flex flex-col items-center text-center bg-slate-900 p-8 rounded-3xl border border-slate-700 shadow-xl">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-green-500/10 text-green-400 border border-green-500/20">
              <Trophy className="h-10 w-10" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-white">3. Entregamos o seu Plano de Domínio</h3>
            <p className="text-slate-400 text-base leading-relaxed mb-6">
              Receba o passo a passo mastigado para copiar e colar no seu perfil e assistir o seu telefone voltar a tocar.
            </p>
            <div className="w-full mt-auto bg-green-500/10 rounded-xl p-3 border border-green-500/20">
               <p className="text-sm font-extrabold text-green-400 uppercase">Valor real: R$ 197,00</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}