"use client"

import { MapPin, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <MapPin className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            GMB <span className="text-primary">Audit</span>
          </span>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Recursos
          </a>
          <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Preços
          </a>
          <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Blog
          </a>
          <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Contato
          </a>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm">
            Entrar
          </Button>
          <Button size="sm">
            Criar Conta
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-card px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Recursos
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Preços
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Blog
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Contato
            </a>
            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
              <Button variant="ghost" size="sm" className="justify-start">
                Entrar
              </Button>
              <Button size="sm">
                Criar Conta
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
