import { NextRequest, NextResponse } from "next/server";
import { captureOrder } from "@/lib/paypal";
import { getOrder, updateOrderStatus } from "@/lib/orders";
import { sendAllOrderEmails } from "@/lib/email";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import type { OrderData } from "@/lib/orders";

/**
 * Trouve la référence de commande à partir d'un PayPal Order ID.
 */
function findOrderRefByPaypalId(paypalOrderId: string): string | null {
  const ordersFile = join(process.cwd(), "data", "orders.json");
  if (!existsSync(ordersFile)) return null;

  const orders: Record<string, OrderData> = JSON.parse(
    readFileSync(ordersFile, "utf-8")
  );

  for (const [ref, order] of Object.entries(orders)) {
    if (order.paypalOrderId === paypalOrderId) {
      return ref;
    }
  }

  return null;
}

/**
 * POST — Appelé par le SDK PayPal JS depuis le frontend après approbation.
 * Capture le paiement, met à jour la commande et envoie les emails.
 */
export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json(
        { error: "orderId manquant" },
        { status: 400 }
      );
    }

    // Trouver la commande liée à cet ID PayPal
    const ref = findOrderRefByPaypalId(orderId);
    if (!ref) {
      return NextResponse.json(
        { error: "Commande introuvable" },
        { status: 404 }
      );
    }

    const order = getOrder(ref);
    if (!order) {
      return NextResponse.json(
        { error: "Commande introuvable" },
        { status: 404 }
      );
    }

    // Idempotent : si déjà payé, retourner la référence directement
    if (order.status === "paid") {
      return NextResponse.json({ ref });
    }

    // Capturer le paiement PayPal
    const capture = await captureOrder(orderId);

    if (capture.status !== "COMPLETED") {
      console.error(`PayPal capture not completed: ${capture.status}`);
      updateOrderStatus(ref, "failed", orderId);
      return NextResponse.json(
        { error: "Le paiement a échoué" },
        { status: 400 }
      );
    }

    // Paiement confirmé
    updateOrderStatus(ref, "paid", orderId);

    // Envoyer les emails
    try {
      await sendAllOrderEmails(order);
      console.log(`All order emails sent for: ${ref}`);
    } catch (emailError) {
      console.error("Failed to send order emails:", emailError);
    }

    return NextResponse.json({ ref });
  } catch (error) {
    console.error("PayPal capture error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la capture du paiement" },
      { status: 500 }
    );
  }
}

/**
 * GET — Fallback si le client est redirigé par PayPal (mode redirect classique).
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const ref = searchParams.get("ref");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  if (!token || !ref) {
    return NextResponse.redirect(`${baseUrl}/livre?error=missing_params`);
  }

  try {
    const order = getOrder(ref);
    if (!order) {
      return NextResponse.redirect(`${baseUrl}/livre?error=order_not_found`);
    }

    if (order.status === "paid") {
      return NextResponse.redirect(`${baseUrl}/livre/confirmation?ref=${ref}`);
    }

    const capture = await captureOrder(token);

    if (capture.status !== "COMPLETED") {
      updateOrderStatus(ref, "failed", token);
      return NextResponse.redirect(`${baseUrl}/livre?error=payment_failed`);
    }

    updateOrderStatus(ref, "paid", token);

    try {
      await sendAllOrderEmails(order);
    } catch (emailError) {
      console.error("Failed to send order emails:", emailError);
    }

    return NextResponse.redirect(`${baseUrl}/livre/confirmation?ref=${ref}`);
  } catch (error) {
    console.error("PayPal capture error:", error);
    return NextResponse.redirect(`${baseUrl}/livre?error=capture_failed`);
  }
}
