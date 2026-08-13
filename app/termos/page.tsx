import { Header } from "@/components/dashboard/header";

export const metadata = {
  title: "Termos de Uso | GMB Audit",
};

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-slate-50 relative">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[2rem] shadow-xl p-8 sm:p-12 border border-slate-200">
          <h1 className="text-3xl font-black text-slate-900 mb-8">Termos de Uso</h1>
          
          <div className="space-y-6 text-slate-700 leading-relaxed">
            <p><strong>1. Aceitação dos Termos</strong></p>
            <p>Ao acessar e usar a plataforma GMB Audit, você concorda em cumprir e ser regido por estes Termos de Uso. Se você não concorda com qualquer parte destes termos, não deve utilizar nossos serviços.</p>

            <p><strong>2. Descrição do Serviço</strong></p>
            <p>O GMB Audit é uma ferramenta de diagnóstico e geração de relatórios baseada em algoritmos que analisa dados públicos disponíveis no Google Meu Negócio. Entregamos um Plano de Ação (PDF) focado em melhorar o ranqueamento local (SEO Local). Não garantimos posições específicas no Google, pois as diretrizes do buscador podem mudar sem aviso prévio.</p>

            <p><strong>3. Uso da Plataforma e Pagamento</strong></p>
            <p>A pesquisa inicial na plataforma é gratuita. O acesso ao Relatório Executivo e ao Plano de Ação completo requer o pagamento de uma taxa única de R$ 9,97. Este pagamento não constitui uma assinatura recorrente, a menos que explicitamente oferecido e aceito pelo usuário.</p>

            <p><strong>4. Garantia e Reembolso</strong></p>
            <p>Oferecemos uma garantia incondicional de 7 (sete) dias. Caso o usuário acredite que o relatório não trouxe valor, poderá solicitar o reembolso integral enviando um e-mail para nosso suporte dentro deste prazo.</p>

            <p><strong>5. Limitação de Responsabilidade</strong></p>
            <p>Em nenhuma circunstância o GMB Audit será responsável por danos indiretos, lucros cessantes ou interrupção de negócios decorrentes da aplicação (ou não aplicação) das sugestões presentes no relatório. O usuário é o único responsável por quaisquer alterações feitas em suas próprias fichas do Google.</p>

            <p><strong>6. Contato</strong></p>
            <p>Dúvidas sobre estes Termos de Uso devem ser enviadas para: <strong>felipebially@gmail.com</strong>.</p>
            
            <p className="text-sm text-slate-500 pt-8 mt-8 border-t border-slate-100">
              Última atualização: Agosto de 2026.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}