import { NextRequest, NextResponse } from "next/server";
import {
  orderFormSchema,
  BOOK_PRICE,
  SHIPPING_PRICE,
  calculateTotal,
} from "@/lib/validations";
import { getStripe, buildBookSessionParams } from "@/lib/stripe";
import {
  saveOrder,
  generateCheckoutReference,
  attachStripeSession,
  type OrderData,
} from "@/lib/orders";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = orderFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      postalCode,
      quantity,
    } = parsed.data;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const order: OrderData = {
      checkoutReference: generateCheckoutReference(),
      firstName,
      lastName,
      email,
      phone: phone || "",
      address,
      city,
      postalCode,
      quantity,
      bookPrice: BOOK_PRICE,
      shippingPrice: SHIPPING_PRICE,
      totalAmount: calculateTotal(quantity),
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    saveOrder(order);

    const session = await getStripe().checkout.sessions.create(
      buildBookSessionParams(order, baseUrl)
    );
    attachStripeSession(order.checkoutReference, session.id);

    if (!session.url) throw new Error("Stripe session without url");
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout creation error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la commande" },
      { status: 500 }
    );
  }
}
