"use client"

import { Search, MapPin, Zap, Trophy, Link2 } from "lucide-react"

export function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-white py-16 sm:py-24 border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Por apenas R$ 15 a IA mais avançada do Brasil <span className="text-blue-600 block mt-2">faz o que nenhum consultor faria por menos de R$ 800</span>
          </h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          
          <div className="relative flex flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 shadow-sm border border-blue-200">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-slate-900">1. Localizamos o seu negócio como um cliente faria</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Basta digitar o nome da sua empresa. A nossa IA rastreia o seu perfil exato no mapa para iniciar a varredura.
            </p>
            <div className="w-full bg-slate-50 rounded-xl p-3 border border-slate-200">
              <p className="text-xs font-bold text-slate-700 italic">"68% dos seus concorrentes já estão na nossa base de dados..."</p>
            </div>
          </div>

          <div className="relative flex flex-col items-center text-center">
            <div className="hidden lg:block absolute top-8 -left-1/2 w-full h-[2px] bg-gradient-to-r from-blue-100 to-orange-200 -z-10"></div>
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 shadow-sm border border-orange-200">
              <Zap className="h-8 w-8" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-slate-900">2. Analisamos os 127 fatores do Google em 2026</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              A nossa IA fará um raio-x profundo, comparando a sua densidade de palavras-chave e fotos com os líderes da sua região.
            </p>
            <div className="w-full bg-orange-50 rounded-xl p-3 border border-orange-200">
              <p className="text-xs font-bold text-orange-800 italic">"Identificamos falhas críticas em menos de 47 segundos..."</p>
            </div>
          </div>

          <div className="relative flex flex-col items-center text-center">
            <div className="hidden lg:block absolute top-8 -left-1/2 w-full h-[2px] bg-gradient-to-r from-orange-200 to-green-300 -z-10"></div>
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-600 shadow-sm border border-green-200">
              <Trophy className="h-8 w-8" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-slate-900">3. Entregamos o seu Plano de Domínio Local</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Receba o passo a passo mastigado para copiar e colar no seu perfil e assistir o seu telefone voltar a tocar.
            </p>
            <div className="w-full bg-green-50 rounded-xl p-3 border border-green-200">
               <p className="text-xs font-bold text-green-800 uppercase tracking-wide">Valor real: R$ 197,00</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}