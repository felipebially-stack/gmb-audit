"use client"

import { TrendingUp, AlertTriangle } from "lucide-react"

interface HealthScoreProps {
  score: number
  maxScore?: number
}

export function HealthScore({ score, maxScore = 100 }: HealthScoreProps) {
  const percentage = (score / maxScore) * 100
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const getScoreColor = () => {
    if (percentage >= 80) return "text-success"
    if (percentage >= 60) return "text-warning"
    return "text-destructive"
  }

  const getScoreLabel = () => {
    if (percentage >= 80) return "Excelente"
    if (percentage >= 60) return "Bom"
    if (percentage >= 40) return "Regular"
    return "Precisa Melhorar"
  }

  const getStrokeColor = () => {
    if (percentage >= 80) return "stroke-success"
    if (percentage >= 60) return "stroke-warning"
    return "stroke-destructive"
  }

  // 👇 NOVA FUNÇÃO: Mensagem dinâmica focada em conversão (CRO) 👇
  const getComparisonText = () => {
    if (percentage >= 85) {
      return `Seu perfil domina ${Math.floor(percentage - 5)}% da região, mas há dinheiro na mesa.`;
    }
    if (percentage >= 60) {
      return "Você está a perder vendas diárias para os líderes da sua região.";
    }
    if (percentage >= 40) {
      return `Alerta: Você está abaixo de ${Math.floor(80 - percentage)}% dos concorrentes locais.`;
    }
    return "Crítico: A sua empresa está praticamente invisível no Google Maps.";
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <h2 className="text-center text-lg font-semibold text-foreground sm:text-xl">
        Nota Geral de Saúde do Perfil
      </h2>
      
      <p className="mt-2 mb-6 text-center text-sm text-muted-foreground">
        Notas abaixo de 80 indicam que os seus concorrentes estão roubando os seus clientes diários.
      </p>
      
      <div className="relative flex h-40 w-40 items-center justify-center sm:h-48 sm:w-48">
        <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted/30"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-out ${getStrokeColor()}`}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
            }}
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold sm:text-5xl ${getScoreColor()}`}>
            {score}
          </span>
          <span className="text-sm text-muted-foreground">/{maxScore}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {percentage >= 60 ? (
          <TrendingUp className={`h-4 w-4 ${getScoreColor()}`} />
        ) : (
          <AlertTriangle className={`h-4 w-4 ${getScoreColor()}`} />
        )}
        <span className={`text-sm font-medium ${getScoreColor()}`}>
          {getScoreLabel()}
        </span>
      </div>

      {/* 👇 FRASE DINÂMICA RENDERIZADA AQUI 👇 */}
      <p className={`mt-2 text-center text-xs sm:text-sm font-medium ${percentage < 60 ? 'text-destructive/80' : 'text-muted-foreground'}`}>
        {getComparisonText()}
      </p>
    </div>
  )
}