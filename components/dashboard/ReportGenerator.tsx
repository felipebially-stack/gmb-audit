"use client";

import { useState } from "react";
import { ArrowRight, FileText, ShieldCheck } from "lucide-react";

interface ReportProps {
  companyName: string;
  rating: number | null;
  userRatingsTotal: number | null;
  address: string;
  rankings: any[];
  competitors?: any[];
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

    // Salva todos os dados na memória do navegador para a página de sucesso puxar após o pagamento
    const dadosRelatorio = {
      companyName,
      rating,
      userRatingsTotal,
      address,
      rankings,
      competitors,
      healthScore,
      checklistData,
      photoUrl
    };

    localStorage.setItem("ultimo_relatorio", JSON.stringify(dadosRelatorio));

    // ==========================================
    // LINK OFICIAL DA KIWIFY
    // ==========================================
    // Substitua o link abaixo pelo seu link de checkout da Kiwify:
    const KIWIFY_CHECKOUT_URL = "https://pay.kiwify.com.br/yM2aUy9";

    // Opcional: passa o nome da empresa na URL para rastreio
    const checkoutUrl = new URL(KIWIFY_CHECKOUT_URL);
    checkoutUrl.searchParams.set("src", encodeURIComponent(companyName));

    // Redireciona o cliente para o checkout oficial
    window.location.href = checkoutUrl.toString();
  };

  return (
    <div className="mt-8 flex flex-col items-center w-full">
      <button
        onClick={irParaPagamento}
        disabled={isRedirecting || !rating}
        className="w-full max-w-xl bg-orange-500 hover:bg-orange-600 text-white font-black py-5 px-8 rounded-2xl shadow-[0_0_40px_rgba(249,115,22,0.4)] transition-all hover:scale-[1.02] disabled:opacity-50 text-xl flex justify-center items-center gap-3 uppercase tracking-wide"
      >
        {isRedirecting ? (
          <span className="flex items-center gap-2">
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
            Redirecionando...
          </span>
        ) : (
          <>
            <FileText className="w-6 h-6" />
            Liberar Plano de Domínio Local (R$ 9,97)
            <ArrowRight className="w-6 h-6" />
          </>
        )}
      </button>
      <div className="flex items-center gap-2 mt-4 text-sm font-bold text-slate-400">
        <ShieldCheck className="w-5 h-5 text-green-500" />
        Pagamento 100% Seguro via PIX ou Cartão
      </div>
    </div>
  );
}