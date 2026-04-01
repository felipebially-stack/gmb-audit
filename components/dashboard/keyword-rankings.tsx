"use client"

import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface KeywordRanking {
  keyword: string
  position: number | null
  previousPosition: number | null
  searchVolume: string
}

interface KeywordRankingsProps {
  rankings: KeywordRanking[]
  isLoading?: boolean
  serpStatus?: "ok" | "api_unavailable" | "not_configured"
}

function PositionChange({ current, previous }: { current: number; previous: number }) {
  const diff = previous - current

  if (diff > 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
        <TrendingUp className="h-3 w-3" />
        +{diff}
      </span>
    )
  }
  if (diff < 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive">
        <TrendingDown className="h-3 w-3" />
        {diff}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
      <Minus className="h-3 w-3" />
      0
    </span>
  )
}

function PositionBadge({ position }: { position: number | null }) {
  if (position === null) {
    return (
      <span className="inline-flex min-w-12 items-center justify-center rounded-full bg-muted px-2 py-1 text-xs font-bold text-muted-foreground">
        &gt;20
      </span>
    )
  }

  let bgColor = "bg-muted text-muted-foreground"
  if (position <= 3) bgColor = "bg-success/10 text-success"
  else if (position <= 10) bgColor = "bg-primary/10 text-primary"
  else if (position <= 20) bgColor = "bg-warning/10 text-warning"

  return (
    <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${bgColor}`}>
      {position}
    </span>
  )
}

export function KeywordRankings({
  rankings,
  isLoading = false,
  serpStatus = "not_configured",
}: KeywordRankingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Ranking de Palavras-chave</CardTitle>
        <CardDescription>
          Posição do seu negócio para as principais buscas na região
        </CardDescription>
        {!isLoading && serpStatus === "api_unavailable" && (
          <p className="text-xs text-muted-foreground">
            Dados de ranking indisponíveis no momento (SerpApi/cota). Exibindo fallback de não ranqueado.
          </p>
        )}
        {!isLoading && serpStatus === "not_configured" && (
          <p className="text-xs text-muted-foreground">
            SerpApi não configurada. Exibindo fallback de não ranqueado.
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto -mx-6 px-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Palavra-chave</TableHead>
                <TableHead className="text-center">Posição</TableHead>
                <TableHead className="text-center">Variação</TableHead>
                <TableHead className="text-right">Volume</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                    {isLoading
                      ? "Analisando palavras-chave do seu nicho e posições..."
                      : "Faça uma busca para ver o ranking com termos gerados automaticamente para o seu segmento."}
                  </TableCell>
                </TableRow>
              ) : (
                rankings.map((ranking, index) => (
                  <TableRow key={`${ranking.keyword}-${index}`}>
                    <TableCell className="font-medium text-foreground">
                      {ranking.keyword}
                    </TableCell>
                    <TableCell className="text-center">
                      {isLoading ? (
                        <span className="text-xs text-muted-foreground">Analisando posições...</span>
                      ) : (
                        <PositionBadge position={ranking.position} />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {isLoading ? (
                        <span className="text-xs text-muted-foreground">Analisando posições...</span>
                      ) : ranking.position === null || ranking.previousPosition === null ? (
                        <span className="text-xs text-muted-foreground">Não ranqueado</span>
                      ) : (
                        <PositionChange current={ranking.position} previous={ranking.previousPosition} />
                      )}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {ranking.searchVolume}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
