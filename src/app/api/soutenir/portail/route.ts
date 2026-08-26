import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getStripe } from "@/lib/stripe";
import { findLatestCustomerIdByEmail } from "@/lib/support";

const schema = z.object({ email: z.string().email() });

/**
 * Ouvre le portail client Stripe pour gérer un don mensuel / une cotisation.
 * Répond toujours 200 : `{ url: null }` si aucun client connu (pas de fuite d'info).
 */
export async function POST(req: NextRequest) {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    const customerId = findLatestCustomerIdByEmail(parsed.data.email);
    if (!customerId) return NextResponse.json({ url: null });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const portal = await getStripe().billingPortal.sessions.create({
      customer: customerId,
      return_url: `${baseUrl}/soutenir`,
    });
    return NextResponse.json({ url: portal.url });
  } catch (error) {
    console.error("Portal session error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'ouverture du portail" },
      { status: 500 }
    );
  }
}
