import { NextRequest, NextResponse } from "next/server";
import {
  orderFormSchema,
  BOOK_PRICE,
  SHIPPING_PRICE,
  calculateTotal,
} from "@/lib/validations";
import { createOrder } from "@/lib/paypal";
import {
  saveOrder,
  generateCheckoutReference,
  updateOrderStatus,
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

    const totalAmount = calculateTotal(quantity);
    const checkoutReference = generateCheckoutReference();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Sauvegarder la commande en "pending"
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

    // Créer la commande PayPal
    const paypalOrder = await createOrder({
      reference_id: checkoutReference,
      description: `Livre "La Roqya à la lumière du Tawhid" x${quantity}`,
      amount: totalAmount,
      currency: "EUR",
      return_url: `${baseUrl}/api/checkout/capture?ref=${checkoutReference}`,
      cancel_url: `${baseUrl}/livre`,
    });

    // Stocker l'ID PayPal dans la commande
    updateOrderStatus(checkoutReference, "pending", paypalOrder.id);

    // Retourner l'ID PayPal pour le SDK JS côté client
    return NextResponse.json({ orderId: paypalOrder.id });
  } catch (error) {
    console.error("Checkout creation error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la commande" },
      { status: 500 }
    );
  }
}
