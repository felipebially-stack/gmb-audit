"use client";

import { MapPin } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  // Função inteligente que detecta a página atual e o estado da pesquisa
  const handleNavigation = (targetId: string) => {
    if (pathname === "/") {
      if (targetId === "top") {
        // Força o recarregamento da Home para limpar a pesquisa ativa e resetar a tela
        window.location.href = "/";
      } else {
        const element = document.getElementById(targetId);
        if (element) {
          // Se o elemento existe na tela (nenhuma pesquisa ativa escondendo ele), faz a rolagem suave
          element.scrollIntoView({ behavior: "smooth" });
        } else {
          // Se o elemento NÃO existe (foi ocultado pelo relatório), recarrega a página indo direto para a seção
          window.location.href = `/#${targetId}`;
        }
      }
    } else {
      // Comportamento para quando o usuário está em outras páginas (ex: /termos, /privacidade)
      if (targetId === "top") {
        router.push("/");
      } else {
        router.push(`/#${targetId}`);
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/90 backdrop-blur-md shadow-sm transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div onClick={() => handleNavigation("top")} className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg transition-transform group-hover:scale-105">
            <MapPin className="h-6 w-6 text-white" />
            <div className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-slate-900 bg-green-500 shadow-sm animate-pulse"></div>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-white">
            GMB <span className="text-blue-400">Audit</span>
          </span>
        </div>

        {/* Navegação Principal */}
        <nav className="hidden items-center gap-4 md:flex">
          <button 
            onClick={() => handleNavigation("top")} 
            className="text-sm font-bold text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-all"
          >
            Início
          </button>
          <button 
            onClick={() => handleNavigation("como-funciona")} 
            className="text-sm font-bold text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-all"
          >
            Como Funciona
          </button>
          <button 
            onClick={() => handleNavigation("faq")} 
            className="text-sm font-bold text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-all"
          >
            Dúvidas (FAQ)
          </button>
        </nav>

        {/* Botão de Ação do Topo */}
        <div className="hidden items-center gap-4 md:flex">
          <button 
            onClick={() => handleNavigation("top")}
            className="inline-flex items-center justify-center gap-2 text-sm bg-orange-500 text-white font-bold hover:bg-orange-600 shadow-md hover:shadow-lg transition-all rounded-xl px-6 py-3"
          >
            Fazer Avaliação Grátis
          </button>
        </div>
      </div>
    </header>
  );
}