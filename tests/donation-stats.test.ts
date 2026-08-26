import { describe, it, expect } from "vitest";
import { aggregateDonationStats } from "@/lib/donation-stats";

describe("aggregateDonationStats", () => {
  it("additionne dons ponctuels et factures, exclut le livre, dédoublonne les donateurs", () => {
    const stats = aggregateDonationStats({
      sessions: [
        { mode: "payment", status: "complete", amount_total: 1000, metadata: { kind: "donation" }, customer_details: { email: "A@x.fr" } },
        { mode: "payment", status: "complete", amount_total: 1700, metadata: { kind: "book" }, customer_details: { email: "b@x.fr" } },
        { mode: "payment", status: "open", amount_total: 5000, metadata: { kind: "donation" }, customer_details: { email: "c@x.fr" } },
        { mode: "subscription", status: "complete", amount_total: 500, metadata: { kind: "membership" }, customer_details: { email: "d@x.fr" } },
      ],
      invoices: [
        { status: "paid", amount_paid: 500, customer_email: "d@x.fr" },
        { status: "paid", amount_paid: 500, customer_email: "d@x.fr" },
        { status: "paid", amount_paid: 200, customer_email: "a@x.fr" },
      ],
      refunds: [{ status: "succeeded", amount: 300 }, { status: "failed", amount: 900 }],
      activeSubscriptions: 3,
    });
    expect(stats.totalEuros).toBe(19); // 10 + 5 + 5 + 2 − 3 remboursés
    expect(stats.donors).toBe(2); // a et d
    expect(stats.monthlySupporters).toBe(3);
  });

  it("ne descend jamais sous zéro", () => {
    const s = aggregateDonationStats({ sessions: [], invoices: [], refunds: [{ status: "succeeded", amount: 500 }], activeSubscriptions: 0 });
    expect(s.totalEuros).toBe(0);
  });

  it("retourne des zéros sans données", () => {
    const s = aggregateDonationStats({ sessions: [], invoices: [], refunds: [], activeSubscriptions: 0 });
    expect(s).toMatchObject({ totalEuros: 0, donors: 0, monthlySupporters: 0 });
  });
});
