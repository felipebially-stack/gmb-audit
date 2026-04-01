"use client"

import { Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface SearchSectionProps {
  onSearch?: (query: string) => void | Promise<void>
  isLoading?: boolean
}

export function SearchSection({ onSearch, isLoading = false }: SearchSectionProps) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query)
  }

  return (
    <section className="relative overflow-hidden bg-card py-12 sm:py-16">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Auditoria de Google Meu Negócio
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
          Digite o nome da empresa ou cole o link do Google Maps para buscar dados reais e receber uma análise para melhorar seu ranking local.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 sm:mt-10">
          <div className="relative mx-auto max-w-2xl">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4">
              <Link2 className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Digite o nome da empresa ou cole o link"
              className="h-14 w-full rounded-xl border border-border bg-background pl-12 pr-32 text-base text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:h-16 sm:text-lg"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              <Button type="submit" size="lg" className="h-10 px-4 sm:h-12 sm:px-6" disabled={isLoading}>
                {isLoading ? "Buscando dados..." : "Analisar"}
              </Button>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Ex: Restaurante Sabor da Casa ou https://share.google/...
          </p>
        </form>

      </div>
    </section>
  )
}
