"use client"

import { Star, MessageSquare, Reply, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MetricCardProps {
  title: string
  value: string
  description: string
  valueClassName?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  icon: React.ReactNode
}

function MetricCard({ title, value, description, valueClassName, trend, icon }: MetricCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className={`font-bold text-foreground ${valueClassName ?? "text-3xl"}`}>{value}</div>
        <div className="mt-1 flex items-center gap-2">
          {trend && (
            <span
              className={`flex items-center gap-0.5 text-xs font-medium ${
                trend.isPositive ? "text-success" : "text-destructive"
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {trend.value}%
            </span>
          )}
          <span className="text-xs text-muted-foreground">{description}</span>
        </div>
      </CardContent>
    </Card>
  )
}

interface MetricsCardsProps {
  rating: number | null
  userRatingsTotal: number | null
  address: string | null
  isLoading?: boolean
}

export function MetricsCards({ rating, userRatingsTotal, address, isLoading = false }: MetricsCardsProps) {
  const ratingValue = isLoading ? "Buscando dados..." : rating?.toFixed(1) ?? "-"
  const totalRatingsValue = isLoading ? "Buscando dados..." : userRatingsTotal?.toLocaleString("pt-BR") ?? "-"
  const addressValue = isLoading ? "Buscando dados..." : address ?? "-"

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <MetricCard
        title="Nota Média"
        value={ratingValue}
        description="baseado nas avaliações do Google"
        icon={<Star className="h-5 w-5" />}
      />
      <MetricCard
        title="Total de Avaliações"
        value={totalRatingsValue}
        description="total público no Google"
        icon={<MessageSquare className="h-5 w-5" />}
      />
      <MetricCard
        title="Endereço"
        value={addressValue}
        valueClassName="text-sm leading-6"
        description="local retornado pela busca"
        icon={<Reply className="h-5 w-5" />}
      />
    </div>
  )
}
