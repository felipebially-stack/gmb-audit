"use client";

import { useState } from "react";

interface ReportProps {
  companyName: string;
  rating: number | null;
  userRatingsTotal: number | null;
  address: string;
  rankings: any[];
  // 👇 AS DUAS LINHAS NOVAS MÁGICAS AQUI:
  healthScore?: number;
  checklistData?: any;
}

export default function ReportGenerator({ companyName, rating, userRatingsTotal, address, rankings, healthScore, checklistData }: ReportProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const irParaPagamento = async () => {
    setIsRedirecting(true);

    // 👇 AGORA ELE SALVA A NOTA REAL E OS DADOS REAIS DO PAINEL
    const dadosRelatorio = {
      companyName,
      rating,
      userRatingsTotal,
      address,
      rankings,
      healthScore, // Vai salvar o seu "86"
      checklistData // Vai salvar os "Vs" verdes e "Xs" vermelhos da sua tela
    };
    localStorage.setItem("ultimo_relatorio", JSON.stringify(dadosRelatorio));

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erro no checkout.");
        setIsRedirecting(false);
      }
    } catch (error) {
      console.error(error);
      setIsRedirecting(false);
    }
  };

  return (
    <div className="mt-8 flex flex-col items-center w-full">
      <button
        onClick={irParaPagamento}
        disabled={isRedirecting || !rating}
        className="w-full max-w-md bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all disabled:opacity-50 text-lg flex flex-col items-center"
      >
        {isRedirecting ? "Processando..." : (
          <>
            <span>Liberar Plano de Ação Completo</span>
            <span className="text-sm font-normal opacity-90">Análise de 10 pontos + PDF Executivo (R$ 15,00)</span>
          </>
        )}
      </button>
      <p className="text-sm text-gray-500 mt-3 flex items-center gap-1">🔒 Pagamento Seguro via Stripe</p>
    </div>
  );
}