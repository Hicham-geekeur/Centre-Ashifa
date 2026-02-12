import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/paypal";
import { getOrder, updateOrderStatus } from "@/lib/orders";
import { sendAllOrderEmails } from "@/lib/email";

/**
 * Webhook PayPal — filet de sécurité si le retour capture échoue.
 * Gère l'événement PAYMENT.CAPTURE.COMPLETED.
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    // Vérifier la signature du webhook PayPal
    const headers: Record<string, string> = {};
    for (const key of [
      "paypal-auth-algo",
      "paypal-cert-url",
      "paypal-transmission-id",
      "paypal-transmission-sig",
      "paypal-transmission-time",
    ]) {
      const value = req.headers.get(key);
      if (value) headers[key] = value;
    }

    const isValid = await verifyWebhookSignature(headers, rawBody);
    if (!isValid) {
      console.error("PayPal webhook signature verification failed");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const body = JSON.parse(rawBody);
    const eventType = body.event_type;

    // On ne traite que les captures complétées
    if (eventType !== "PAYMENT.CAPTURE.COMPLETED") {
      return NextResponse.json({ received: true });
    }

    const resource = body.resource;
    const paypalOrderId = resource?.supplementary_data?.related_ids?.order_id;

    if (!paypalOrderId) {
      console.error("No order ID found in webhook payload");
      return NextResponse.json({ received: true });
    }

    // Chercher la commande via le reference_id dans les purchase_units
    // Le webhook PAYMENT.CAPTURE.COMPLETED contient le custom_id ou reference_id
    const referenceId =
      resource?.custom_id ||
      resource?.supplementary_data?.related_ids?.order_id;

    // Parcourir toutes les commandes pour trouver celle avec ce paypalOrderId
    // (le reference_id est notre checkoutReference)
    const { readFileSync, existsSync } = await import("fs");
    const { join } = await import("path");
    const ordersFile = join(process.cwd(), "data", "orders.json");

    if (!existsSync(ordersFile)) {
      return NextResponse.json({ received: true });
    }

    const orders = JSON.parse(readFileSync(ordersFile, "utf-8"));
    let matchedRef: string | null = null;

    for (const [ref, order] of Object.entries(orders)) {
      const typedOrder = order as { paypalOrderId?: string };
      if (typedOrder.paypalOrderId === paypalOrderId) {
        matchedRef = ref;
        break;
      }
    }

    if (!matchedRef) {
      console.error(
        `No order found for PayPal order ID: ${paypalOrderId} (ref: ${referenceId})`
      );
      return NextResponse.json({ received: true });
    }

    const order = getOrder(matchedRef);
    if (!order) {
      return NextResponse.json({ received: true });
    }

    // Idempotent : ne pas retraiter
    if (order.status === "paid") {
      return NextResponse.json({ received: true });
    }

    updateOrderStatus(matchedRef, "paid", paypalOrderId);

    try {
      await sendAllOrderEmails(order);
      console.log(`Webhook: all order emails sent for: ${matchedRef}`);
    } catch (emailError) {
      console.error("Webhook: failed to send order emails:", emailError);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing error" },
      { status: 500 }
    );
  }
}
