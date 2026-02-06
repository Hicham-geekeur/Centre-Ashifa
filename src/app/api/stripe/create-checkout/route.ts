import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();
    const { quantity = 1 } = await req.json();

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: process.env.STRIPE_BOOK_PRICE_ID!,
          quantity,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/livre/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/livre`,
      shipping_address_collection: {
        allowed_countries: ["FR"],
      },
      locale: "fr",
      metadata: {
        product: "book-preorder",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la creation de la session de paiement" },
      { status: 500 }
    );
  }
}
