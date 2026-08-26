import { unstable_cache } from "next/cache";
import { getStripe } from "./stripe";

/** Date de lancement des dons en ligne (migration Stripe). Rien avant n'est compté. */
export const LAUNCH_DATE = new Date("2026-08-26T00:00:00+02:00");

export interface DonationStats {
  /** Total collecté en euros (dons ponctuels + tous les prélèvements mensuels) */
  totalEuros: number;
  /** Nombre de donateurs distincts */
  donors: number;
  /** Soutiens mensuels actuellement actifs */
  monthlySupporters: number;
  /** ISO date du calcul */
  updatedAt: string;
}

/** Sous-ensemble minimal des objets Stripe utilisés (facilite les tests). */
export interface RawDonationData {
  sessions: Array<{
    mode: string;
    status: string | null;
    amount_total: number | null;
    metadata: Record<string, string> | null;
    customer_details?: { email?: string | null } | null;
  }>;
  invoices: Array<{
    status: string | null;
    amount_paid: number;
    customer_email?: string | null;
  }>;
  refunds: Array<{ status: string | null; amount: number }>;
  activeSubscriptions: number;
}

/** Agrégation pure : dons ponctuels via les sessions, mensuels via les factures, remboursements déduits. */
export function aggregateDonationStats(
  data: RawDonationData,
  now: Date = new Date()
): DonationStats {
  let cents = 0;
  const emails = new Set<string>();
  const addEmail = (e?: string | null) => {
    if (e) emails.add(e.trim().toLowerCase());
  };

  for (const s of data.sessions) {
    if (s.mode !== "payment" || s.status !== "complete") continue;
    if (s.metadata?.kind === "book") continue;
    cents += s.amount_total ?? 0;
    addEmail(s.customer_details?.email);
  }
  for (const inv of data.invoices) {
    if (inv.status !== "paid") continue;
    cents += inv.amount_paid;
    addEmail(inv.customer_email);
  }

  for (const r of data.refunds) {
    if (r.status === "succeeded") cents -= r.amount;
  }

  return {
    totalEuros: Math.max(0, Math.round(cents)) / 100,
    donors: emails.size,
    monthlySupporters: data.activeSubscriptions,
    updatedAt: now.toISOString(),
  };
}

async function fetchFromStripe(): Promise<DonationStats> {
  const stripe = getStripe();
  const since = { gte: Math.floor(LAUNCH_DATE.getTime() / 1000) };
  const sessions: RawDonationData["sessions"] = [];
  for await (const s of stripe.checkout.sessions.list({ limit: 100, created: since })) {
    sessions.push(s);
  }
  const invoices: RawDonationData["invoices"] = [];
  for await (const inv of stripe.invoices.list({ status: "paid", limit: 100, created: since })) {
    invoices.push(inv);
  }
  const refunds: RawDonationData["refunds"] = [];
  for await (const r of stripe.refunds.list({ limit: 100, created: since })) {
    refunds.push(r);
  }
  let activeSubscriptions = 0;
  for await (const sub of stripe.subscriptions.list({ status: "active", limit: 100 })) {
    if (sub.id) activeSubscriptions++;
  }
  return aggregateDonationStats({ sessions, invoices, refunds, activeSubscriptions });
}

const cached = unstable_cache(fetchFromStripe, ["donation-stats"], {
  revalidate: 3600,
});

/** Statistiques de dons (cache 1 h). Retourne null si Stripe est indisponible. */
export async function getDonationStats(): Promise<DonationStats | null> {
  try {
    return await cached();
  } catch (err) {
    console.error("donation-stats: Stripe indisponible", err);
    return null;
  }
}
