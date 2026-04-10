"use client"

import { useState } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"

const faqs = [
    {
      pergunta: "Por que não é gratuito?",
      resposta: "Porque entregamos um diagnóstico profissional completo com IA avançada e um plano de ação personalizado que vale R$ 197 no mercado. Cobramos apenas R$ 15 para que qualquer negócio, do pequeno ao grande, possa ter acesso a esse nível de tecnologia."
    },
    {
      pergunta: "É realmente só R$ 15 ou tem pegadinha?",
      resposta: "É exatamente R$ 15. Sem mensalidade, sem taxas ocultas, sem compromisso de longo prazo e com garantia total de devolução se você não gostar do relatório."
    },
    {
      pergunta: "Quanto tempo leva para receber o Plano de Ação?",
      resposta: "Menos de 1 minuto após a aprovação do seu pagamento via Pix ou cartão. O sistema gera o seu PDF instantaneamente."
    },
    {
      pergunta: "Funciona para o meu tipo de negócio?",
      resposta: "Sim. Restaurantes, clínicas, lojas físicas, advogados, dentistas, prestadores de serviços em geral... Se você precisa de clientes da sua cidade, a nossa ferramenta funciona. Já ajudamos mais de 1.247 negócios."
    },
    {
      pergunta: "E se eu não gostar ou achar difícil de aplicar?",
      resposta: "Temos uma garantia incondicional de 7 dias. Se você achar que o diagnóstico de R$ 15 não valeu a pena, você nos envia um e-mail e devolvemos 100% do seu dinheiro, sem perguntas."
    }
  ]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0) // A primeira já começa aberta

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="mx-auto max-w-4xl py-12 px-4 sm:px-6">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center rounded-full bg-blue-100 p-3 text-blue-600 mb-4">
          <HelpCircle className="h-6 w-6" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900">Perguntas Frequentes</h2>
        <p className="mt-2 text-slate-600">Tire as suas dúvidas antes de liberar o seu acesso.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className={`rounded-2xl border transition-all duration-200 ${openIndex === index ? 'border-blue-200 bg-blue-50/50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}
          >
            <button
              className="flex w-full items-center justify-between px-6 py-5 text-left focus:outline-none"
              onClick={() => toggleFaq(index)}
            >
              <span className={`font-bold ${openIndex === index ? 'text-blue-700' : 'text-slate-800'}`}>
                {faq.pergunta}
              </span>
              <ChevronDown 
                className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 ${openIndex === index ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} 
              />
            </button>
            
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <div className="px-6 pb-5 pt-0 text-slate-600 text-sm leading-relaxed">
                {faq.resposta}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}