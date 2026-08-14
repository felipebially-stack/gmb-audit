"use client";

import { useState } from "react";
import { ArrowRight, Beaker } from "lucide-react";

interface ReportProps {
  companyName: string;
  rating: number | null;
  userRatingsTotal: number | null;
  address: string;
  rankings: any[];
  competitors?: any[]; // ✅ Conectado para receber os concorrentes
  healthScore?: number;
  checklistData?: any;
  photoUrl?: string;
}

export default function ReportGenerator({ 
  companyName, 
  rating, 
  userRatingsTotal, 
  address, 
  rankings, 
  competitors, 
  healthScore, 
  checklistData, 
  photoUrl 
}: ReportProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const irParaPagamento = () => {
    setIsRedirecting(true);

    // Salva todos os dados na memória do navegador para gerar o PDF
    const dadosRelatorio = {
      companyName,
      rating,
      userRatingsTotal,
      address,
      rankings,
      competitors, // ✅ Salva os concorrentes na memória
      healthScore,
      checklistData,
      photoUrl
    };

    localStorage.setItem("ultimo_relatorio", JSON.stringify(dadosRelatorio));

    // 🚧 MODO TESTE ATIVO: Vai direto para o PDF sem cobrar nada
    setTimeout(() => {
      window.location.href = "/sucesso";
    }, 800);
  };

  return (
    <div className="mt-8 flex flex-col items-center w-full">
      <button
        onClick={irParaPagamento}
        disabled={isRedirecting || !rating}
        className="w-full max-w-xl bg-green-600 hover:bg-green-700 text-white font-black py-5 px-8 rounded-2xl shadow-[0_0_30px_rgba(22,163,74,0.3)] transition-all hover:scale-[1.02] disabled:opacity-50 text-xl flex justify-center items-center gap-3 uppercase tracking-wide"
      >
        {isRedirecting ? "Gerando PDF..." : (
          <>
            <Beaker className="w-6 h-6" />
            [MODO TESTE] GERAR PDF GRÁTIS
            <ArrowRight className="w-6 h-6" />
          </>
        )}
      </button>
      <p className="text-sm text-green-600 mt-4 font-bold flex items-center gap-2">
        🚧 Bypass Ativado: O checkout está desativado para análises de teste.
      </p>
    </div>
  );
}