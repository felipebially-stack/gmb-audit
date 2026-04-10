"use client"

import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const scrollToSection = (targetId: string) => {
    setMobileMenuOpen(false)
    if (targetId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return;
    }
    if (targetId === 'bottom') {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
      return;
    }
    const element = document.getElementById(targetId)
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => scrollToSection('top')}>
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg transition-transform group-hover:scale-105">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500 shadow-sm animate-pulse"></div>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900">
            GMB <span className="text-blue-600">Audit</span>
          </span>
        </div>

        {/* 👇 MENUS MAIS DESTACADOS 👇 */}
        <nav className="hidden items-center gap-2 md:flex bg-slate-50 p-1.5 rounded-xl border border-slate-200">
          <button onClick={() => scrollToSection('top')} className="text-base font-extrabold text-slate-700 hover:text-blue-700 hover:bg-white px-4 py-2 rounded-lg transition-all shadow-sm">
            Início
          </button>
          <button onClick={() => scrollToSection('como-funciona')} className="text-base font-extrabold text-slate-700 hover:text-blue-700 hover:bg-white px-4 py-2 rounded-lg transition-all shadow-sm">
            Como Funciona
          </button>
          <button onClick={() => scrollToSection('bottom')} className="text-base font-extrabold text-slate-700 hover:text-blue-700 hover:bg-white px-4 py-2 rounded-lg transition-all shadow-sm">
            Planos
          </button>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Button onClick={() => scrollToSection('top')} className="bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-md hover:shadow-lg transition-all rounded-lg px-6">
            Fazer Avaliação Grátis
          </Button>
        </div>

        <Button variant="ghost" size="icon" className="md:hidden text-slate-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-6 md:hidden shadow-xl absolute w-full">
          <nav className="flex flex-col gap-4">
            <button onClick={() => scrollToSection('top')} className="text-left text-lg font-extrabold text-slate-800 hover:text-blue-600">Início</button>
            <button onClick={() => scrollToSection('como-funciona')} className="text-left text-lg font-extrabold text-slate-800 hover:text-blue-600">Como Funciona</button>
            <button onClick={() => scrollToSection('bottom')} className="text-left text-lg font-extrabold text-slate-800 hover:text-blue-600">Planos</button>
            <Button onClick={() => scrollToSection('top')} className="w-full bg-blue-600 font-bold text-white hover:bg-blue-700 h-14 text-xl mt-4">
              Fazer Avaliação
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}