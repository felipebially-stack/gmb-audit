import { Header } from "@/components/dashboard/header";

export const metadata = {
  title: "Política de Privacidade | GMB Audit",
};

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-slate-50 relative">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[2rem] shadow-xl p-8 sm:p-12 border border-slate-200">
          <h1 className="text-3xl font-black text-slate-900 mb-8">Política de Privacidade</h1>
          
          <div className="space-y-6 text-slate-700 leading-relaxed">
            <p>A sua privacidade é importante para nós. É política do GMB Audit respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar em nosso site.</p>

            <p><strong>1. Coleta de Informações</strong></p>
            <p>Solicitamos informações pessoais, como nome da empresa e dados de faturamento, apenas quando realmente precisamos delas para lhe fornecer um serviço (a geração do seu PDF e processamento do pagamento via Stripe). Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento.</p>

            <p><strong>2. Uso de Dados Públicos</strong></p>
            <p>Para gerar o diagnóstico, nosso sistema realiza consultas públicas na API do Google Maps baseando-se no termo pesquisado. Estes são dados empresariais públicos e não constituem dados sensíveis de pessoas físicas.</p>

            <p><strong>3. Armazenamento e Segurança</strong></p>
            <p>Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Os dados de pagamento são processados de forma segura e criptografada pela plataforma Stripe. Nós não armazenamos os números do seu cartão de crédito em nossos servidores.</p>

            <p><strong>4. Compartilhamento de Dados</strong></p>
            <p>Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei ou pelos processadores de pagamento (Stripe) estritamente para finalizar a sua compra.</p>

            <p><strong>5. Cookies e Rastreamento</strong></p>
            <p>Utilizamos cookies e tecnologias de rastreamento (como o Pixel do Facebook) para entender como você interage com nosso site, melhorar a experiência do usuário e otimizar nossas campanhas de publicidade.</p>

            <p><strong>6. Contato</strong></p>
            <p>Se você tiver alguma dúvida sobre como lidamos com dados do usuário e informações pessoais, entre em contato através do e-mail: <strong>felipebially@gmail.com</strong>.</p>
            
            <p className="text-sm text-slate-500 pt-8 mt-8 border-t border-slate-100">
              Última atualização: Agosto de 2026.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}