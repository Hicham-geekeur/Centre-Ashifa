import { NextRequest, NextResponse } from "next/server";
import { getCheckout } from "@/lib/sumup";
import { getOrder, updateOrderStatus } from "@/lib/orders";
import { sendAllOrderEmails } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event_type, id } = body;

    if (event_type !== "CHECKOUT_STATUS_CHANGED") {
      return NextResponse.json({ received: true });
    }

    // Verify payment status with SumUp API (critical security step)
    const checkout = await getCheckout(id);

    if (checkout.status !== "PAID") {
      updateOrderStatus(
        checkout.checkout_reference,
        checkout.status.toLowerCase() as "failed" | "expired" | "pending",
        id
      );
      return NextResponse.json({ received: true });
    }

    // Payment confirmed — look up order data
    const order = getOrder(checkout.checkout_reference);
    if (!order) {
      console.error(
        `Order not found for reference: ${checkout.checkout_reference}`
      );
      return NextResponse.json({ received: true });
    }

    // Idempotent: skip if already processed
    if (order.status === "paid") {
      return NextResponse.json({ received: true });
    }

    updateOrderStatus(checkout.checkout_reference, "paid", id);

    try {
      await sendAllOrderEmails(order);
      console.log(
        `All order emails sent for: ${checkout.checkout_reference}`
      );
    } catch (emailError) {
      console.error("Failed to send order emails:", emailError);
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
