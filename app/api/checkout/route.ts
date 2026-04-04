import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  try {
    // 1. INICIALIZA O STRIPE BLINDADO (Aqui dentro a Vercel não trava)
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2023-10-16" as any,
    });

    const { companyName } = await req.json();

    // Proteção extra: se a URL do site não estiver no Vercel ainda, ele usa localhost
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

    // 2. CRIA A SESSÃO DE PAGAMENTO (Tela do cartão/Pix)
    const session = await stripe.checkout.sessions.create({
      // 👇 AQUI ESTÁ A MÁGICA: "pix" adicionado ao lado de "card" 👇
      payment_method_types: ["card", "pix"], 
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: `Plano de Ação de SEO - ${companyName || 'Empresa'}`,
              description: "Auditoria Completa e Plano de Otimização do Google Meu Negócio",
            },
            unit_amount: 1500, // R$ 15,00 (O Stripe lê o valor em centavos)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      
      // 👇 LINHA ADICIONADA PARA HABILITAR OS CUPONS 👇
      allow_promotion_codes: true, 
      
      // 3. PARA ONDE O CLIENTE VAI DEPOIS DE PAGAR
      success_url: `${baseUrl}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/`,
    });

    // 4. DEVOLVE O LINK DE PAGAMENTO PARA O BOTÃO DO SITE
    return NextResponse.json({ url: session.url });
    
  } catch (error: any) {
    console.error("Erro no Stripe:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}