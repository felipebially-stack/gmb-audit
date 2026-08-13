"use client";

import { useState } from "react";
import { Lock, ArrowRight, Beaker } from "lucide-react";

interface ReportProps {
  companyName: string;
  rating: number | null;
  userRatingsTotal: number | null;
  address: string;
  rankings: any[];
  healthScore?: number;
  checklistData?: any;
  photoUrl?: string; // ✅ AQUI: Ensinamos o componente a aceitar a foto
}

export default function ReportGenerator({ companyName, rating, userRatingsTotal, address, rankings, healthScore, checklistData, photoUrl }: ReportProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const irParaPagamento = async () => {
    setIsRedirecting(true);

    // Salva os dados na memória do navegador para gerar o PDF dinâmico depois
    const dadosRelatorio = {
      companyName,
      rating,
      userRatingsTotal,
      address,
      rankings,
      healthScore,
      checklistData,
      photoUrl // ✅ AQUI: Guardamos a foto na mala para a página de sucesso
    };

    localStorage.setItem("ultimo_relatorio", JSON.stringify(dadosRelatorio));

    // 🚧 INÍCIO DO BYPASS DE TESTE 🚧
    // Em vez de chamar o Stripe, simulamos um pequeno delay e vamos direto para o PDF
    setTimeout(() => {
      window.location.href = "/sucesso";
    }, 800);

    /* 👇 CÓDIGO ORIGINAL DO STRIPE (COMENTADO PARA TESTES) 👇
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
    👆 FIM DO CÓDIGO ORIGINAL DO STRIPE 👆 */
  };

  return (
    <div className="mt-8 flex flex-col items-center w-full">
      <button
        onClick={irParaPagamento}
        disabled={isRedirecting || !rating}
        className="w-full max-w-xl bg-green-600 hover:bg-green-700 text-white font-extrabold py-5 px-8 rounded-2xl shadow-[0_0_30px_rgba(22,163,74,0.3)] transition-all hover:scale-105 disabled:opacity-50 text-xl flex justify-center items-center gap-3 uppercase tracking-wide"
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
        🚧 Bypass Ativado: O checkout via Stripe foi pulado.
      </p>
    </div>
  );
}