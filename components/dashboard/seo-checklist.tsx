"use client"

import { Check, X, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

type ChecklistStatus = "success" | "error" | "warning"

interface ChecklistItem {
  label: string
  status: ChecklistStatus
  description?: string
}

const checklistItems: ChecklistItem[] = [
  {
    label: "Perfil Verificado",
    status: "success",
    description: "Seu perfil está verificado pelo Google",
  },
  {
    label: "Horários Atualizados",
    status: "success",
    description: "Horários de funcionamento estão corretos",
  },
  {
    label: "Fotos Recentes",
    status: "error",
    description: "Última foto adicionada há mais de 30 dias",
  },
  {
    label: "Descrição Completa",
    status: "success",
    description: "Descrição com 750 caracteres",
  },
  {
    label: "Categoria Principal",
    status: "success",
    description: "Categoria definida corretamente",
  },
  {
    label: "Atributos do Negócio",
    status: "warning",
    description: "5 de 12 atributos preenchidos",
  },
  {
    label: "Postagens Recentes",
    status: "error",
    description: "Nenhuma postagem nos últimos 7 dias",
  },
  {
    label: "Produtos/Serviços",
    status: "success",
    description: "15 produtos cadastrados",
  },
  {
    label: "Perguntas Respondidas",
    status: "warning",
    description: "2 perguntas sem resposta",
  },
  {
    label: "Website Vinculado",
    status: "success",
    description: "Site conectado e funcionando",
  },
]

function StatusIcon({ status }: { status: ChecklistStatus }) {
  if (status === "success") {
    return (
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/10">
        <Check className="h-4 w-4 text-success" />
      </div>
    )
  }
  if (status === "error") {
    return (
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive/10">
        <X className="h-4 w-4 text-destructive" />
      </div>
    )
  }
  return (
    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-warning/10">
      <AlertCircle className="h-4 w-4 text-warning" />
    </div>
  )
}

export function SeoChecklist() {
  const successCount = checklistItems.filter((item) => item.status === "success").length
  const totalCount = checklistItems.length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg sm:text-xl">Checklist de SEO Local</CardTitle>
            <CardDescription className="mt-1">
              Verifique os pontos essenciais para otimizar seu perfil
            </CardDescription>
          </div>
          <div className="flex h-10 items-center rounded-full bg-primary/10 px-4 text-sm font-semibold text-primary">
            {successCount}/{totalCount}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {checklistItems.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-lg border border-border bg-background p-3 transition-colors hover:bg-muted/50"
            >
              <StatusIcon status={item.status} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                {item.description && (
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
