import { NextRequest, NextResponse } from "next/server";
import { supportFormSchema } from "@/lib/validations";
import { getStripe, buildSupportSessionParams } from "@/lib/stripe";
import { saveSupportEntry, generateSupportId } from "@/lib/support";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = supportFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const supportId = generateSupportId();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const session = await getStripe().checkout.sessions.create(
      buildSupportSessionParams({ ...data, supportId }, baseUrl)
    );

    saveSupportEntry({
      id: supportId,
      kind: data.kind,
      interval: data.interval,
      amount: data.amount,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      status: "pending",
      createdAt: new Date().toISOString(),
      stripeSessionId: session.id,
    });

    if (!session.url) throw new Error("Stripe session without url");
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Support checkout error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du paiement" },
      { status: 500 }
    );
  }
}
