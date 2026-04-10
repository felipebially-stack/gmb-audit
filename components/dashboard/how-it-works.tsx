"use client"

import { Search, MapPin, Flame, CheckCircle2, Link2 } from "lucide-react"

export function HowItWorks() {
  return (
    // 👇 ADICIONEI O ID "como-funciona" AQUI NESTA LINHA 👇
    <section id="como-funciona" className="bg-white py-16 sm:py-24 border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Como a nossa Inteligência <span className="text-blue-600">Avalia o seu Negócio?</span>
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Três passos simples para descobrir os seus erros e destravar as vendas no mapa.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          
          {/* Passo 1: Como Pesquisar (Educativo) */}
          <div className="relative flex flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 shadow-sm border border-blue-200">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-slate-900">1. Encontre a sua Empresa</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Para uma avaliação precisa, precisamos encontrar o seu perfil exato. Você tem duas opções fáceis:
            </p>
            <div className="w-full bg-slate-50 rounded-xl p-4 border border-slate-200 text-left">
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <span><strong>Digite:</strong> Nome da Empresa + Cidade (Ex: Padaria Pão Doce Curitiba)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Link2 className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <span><strong>Ou cole o link:</strong> Abra o seu Google Maps, clique em "Compartilhar" e cole a URL completa aqui.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Passo 2: A Avaliação Profunda (Termômetros e Mapas de Calor) */}
          <div className="relative flex flex-col items-center text-center">
            {/* Linha conectora invisivel no mobile, visível no desktop */}
            <div className="hidden lg:block absolute top-8 -left-1/2 w-full h-[2px] bg-gradient-to-r from-blue-100 to-blue-300 -z-10"></div>
            
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 shadow-sm border border-orange-200">
              <Flame className="h-8 w-8" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-slate-900">2. Raio-X do Algoritmo</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              A nossa IA fará uma varredura em tempo real comparando o seu perfil com o dos líderes da região.
            </p>
            <div className="w-full bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  <span>Termômetro de Saúde</span>
                  <span className="text-orange-600">Crítico</span>
                </div>
                {/* Barrinha simulando termômetro/mapa de calor */}
                <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden flex">
                  <div className="h-full bg-red-500 w-[20%]"></div>
                  <div className="h-full bg-orange-400 w-[20%]"></div>
                </div>
                <p className="text-xs text-slate-500 text-left mt-2 italic">
                  Analisamos mapas de calor de palavras-chave, densidade de fotos e checklist de SEO local.
                </p>
              </div>
            </div>
          </div>

          {/* Passo 3: O Destrave */}
          <div className="relative flex flex-col items-center text-center">
            {/* Linha conectora */}
            <div className="hidden lg:block absolute top-8 -left-1/2 w-full h-[2px] bg-gradient-to-r from-blue-300 to-green-300 -z-10"></div>

            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-600 shadow-sm border border-green-200">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-slate-900">3. Destrave as Vendas</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Receba a nota exata do seu negócio e o acesso imediato ao seu Plano de Ação em PDF.
            </p>
            <div className="w-full bg-green-50 rounded-xl p-4 border border-green-200">
               <p className="text-sm text-green-800 font-medium">
                 O manual é prático. Você copia as nossas instruções, cola no seu perfil do Google Meu Negócio e assiste o seu telefone voltar a tocar na mesma semana.
               </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}