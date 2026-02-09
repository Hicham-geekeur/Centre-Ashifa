import { NextRequest, NextResponse } from "next/server";
import {
  orderFormSchema,
  BOOK_PRICE,
  SHIPPING_PRICE,
  calculateTotal,
} from "@/lib/validations";
import { createCheckout } from "@/lib/sumup";
import { saveOrder, generateCheckoutReference } from "@/lib/orders";

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

    const totalAmount = calculateTotal(quantity);
    const checkoutReference = generateCheckoutReference();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    saveOrder({
      checkoutReference,
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
      totalAmount,
      createdAt: new Date().toISOString(),
      status: "pending",
    });

    const checkout = await createCheckout({
      checkout_reference: checkoutReference,
      amount: totalAmount,
      currency: "EUR",
      merchant_code: process.env.SUMUP_MERCHANT_CODE!,
      description: `Livre "La Roqya à la lumière du Tawhid" x${quantity}`,
      return_url: `${baseUrl}/api/checkout/webhook`,
      redirect_url: `${baseUrl}/livre/confirmation?ref=${checkoutReference}`,
      hosted_checkout: { enabled: true },
    });

    return NextResponse.json({ url: checkout.hosted_checkout_url });
  } catch (error) {
    console.error("Checkout creation error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la commande" },
      { status: 500 }
    );
  }
}
