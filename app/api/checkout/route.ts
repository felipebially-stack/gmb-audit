import { NextResponse } from "next/server";
import Stripe from "stripe";

// Conecta com o Stripe usando a sua chave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as any,
});

export async function POST(req: Request) {
  try {
    const { companyName } = await req.json();

    // Cria a sessão de pagamento (a tela do cartão/Pix)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // No Brasil, o Stripe libera Pix no painel depois
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
      // Para onde o cliente vai se pagar ou se desistir
      success_url: `${process.env.NEXT_PUBLIC_URL}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/`,
    });

    // Devolve o link da tela de pagamento para o nosso site
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Erro no Stripe:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}