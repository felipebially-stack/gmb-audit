"use client"

import { ArrowRight, Phone, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-primary px-6 py-12 text-center sm:px-12 sm:py-16">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent" />
      
      <div className="relative mx-auto max-w-2xl">
        <h2 className="text-balance text-2xl font-bold tracking-tight text-primary-foreground sm:text-3xl lg:text-4xl">
          Pronto para Dominar as Buscas Locais?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-base text-primary-foreground/80 sm:text-lg">
          Nossos especialistas podem ajudar você a alcançar as primeiras posições do Google Maps e atrair mais clientes.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Button
            size="lg"
            variant="secondary"
            className="w-full gap-2 text-base font-semibold sm:w-auto"
          >
            <Phone className="h-5 w-5" />
            Falar com um Especialista para Melhorar meu Ranking
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-6 text-sm text-primary-foreground/70">
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Consultoria gratuita
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">Sem compromisso</span>
        </div>
      </div>
    </section>
  )
}
