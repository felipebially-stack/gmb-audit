"use client"

import { useState } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"

const faqs = [
  {
    pergunta: "O que eu recebo exatamente após o pagamento?",
    resposta: "Você receberá acesso imediato a um Plano de Ação em PDF personalizado para a sua empresa. Ele contém o diagnóstico completo que você viu na tela, além do passo a passo exato do que você precisa alterar no seu perfil do Google para voltar ao topo das buscas."
  },
  {
    pergunta: "Como vou receber o meu PDF?",
    resposta: "Assim que o seu pagamento (Pix ou Cartão) for aprovado pela plataforma segura (Kiwify/Hotmart), você será redirecionado automaticamente para uma página VIP onde o seu PDF já estará pronto para ser baixado."
  },
  {
    pergunta: "Isso serve para o meu tipo de negócio?",
    resposta: "Sim! A nossa inteligência funciona para qualquer negócio local que dependa de clientes da região: padarias, oficinas mecânicas, clínicas, escritórios, lojas de roupas, restaurantes, prestadores de serviço e muito mais."
  },
  {
    pergunta: "Preciso ter conhecimento técnico em programação ou SEO?",
    resposta: "Zero. O manual foi feito para donos de negócios, não para programadores. Nós entregamos as instruções 'mastigadas'. É literalmente copiar o que sugerimos e colar no seu perfil do Google."
  },
  {
    pergunta: "É seguro colocar os meus dados de pagamento?",
    resposta: "100% seguro. Nós não guardamos nenhum dado de pagamento. Todo o processo é criptografado e gerido pelas maiores plataformas de pagamento de infoprodutos do Brasil."
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