import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { handleCheckoutCompleted } from "@/lib/checkout-events";
import { getOrder, updateOrderStatus } from "@/lib/orders";
import { getSupportEntry, markSupportPaid } from "@/lib/support";
import { sendAllOrderEmails, sendSupportEmails } from "@/lib/email";

/**
 * Webhook Stripe — événement `checkout.session.completed`.
 * Le corps brut est nécessaire pour vérifier la signature.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get("stripe-signature");
  if (!secret || !signature) {
    return NextResponse.json({ error: "Webhook non configuré" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const rawBody = await req.text();
    event = getStripe().webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const customer =
    typeof session.customer === "string"
      ? session.customer
      : (session.customer?.id ?? null);
  const subscription =
    typeof session.subscription === "string"
      ? session.subscription
      : (session.subscription?.id ?? null);

  try {
    const result = await handleCheckoutCompleted(
      { id: session.id, metadata: session.metadata, customer, subscription },
      {
        getOrder,
        updateOrderStatus,
        sendOrderEmails: sendAllOrderEmails,
        getSupportEntry,
        markSupportPaid,
        sendSupportEmails,
      }
    );
    console.log(`Stripe webhook ${session.id}: ${result}`);
    return NextResponse.json({ received: true, result });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing error" },
      { status: 500 }
    );
  }
}
