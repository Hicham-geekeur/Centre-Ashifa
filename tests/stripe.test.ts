import { describe, it, expect } from "vitest";
import { buildBookSessionParams, buildSupportSessionParams } from "@/lib/stripe";
import type { OrderData } from "@/lib/orders";

const order: OrderData = {
  checkoutReference: "ASHIFA-abc-123",
  firstName: "Ali", lastName: "Ben", email: "ali@example.com", phone: "",
  address: "1 rue X", city: "Strasbourg", postalCode: "67000",
  quantity: 2, bookPrice: 12, shippingPrice: 5, totalAmount: 29,
  createdAt: "2026-08-26T00:00:00.000Z", status: "pending",
};

describe("buildBookSessionParams", () => {
  const p = buildBookSessionParams(order, "https://centre-ashifa.fr");
  it("est en mode payment, EUR, fr", () => {
    expect(p.mode).toBe("payment");
    expect(p.locale).toBe("fr");
    expect(p.customer_email).toBe("ali@example.com");
    expect(p.client_reference_id).toBe("ASHIFA-abc-123");
  });
  it("facture livre x quantité + port", () => {
    const items = p.line_items!;
    expect(items).toHaveLength(2);
    expect(items[0].quantity).toBe(2);
    expect(items[0].price_data!.unit_amount).toBe(1200);
    expect(items[0].price_data!.currency).toBe("eur");
    expect(items[1].quantity).toBe(1);
    expect(items[1].price_data!.unit_amount).toBe(500);
  });
  it("porte les métadonnées et les URLs de retour", () => {
    expect(p.metadata).toEqual({ kind: "book", checkoutReference: "ASHIFA-abc-123" });
    expect(p.success_url).toBe("https://centre-ashifa.fr/livre/merci?session_id={CHECKOUT_SESSION_ID}");
    expect(p.cancel_url).toBe("https://centre-ashifa.fr/livre?annule=1");
  });
});

describe("buildSupportSessionParams", () => {
  const base = { firstName: "Ali", lastName: "Ben", email: "ali@example.com", supportId: "SUP-1" };
  it("don ponctuel → mode payment, montant en centimes", () => {
    const p = buildSupportSessionParams({ ...base, kind: "donation", interval: "once", amount: 37 }, "https://x.fr");
    expect(p.mode).toBe("payment");
    expect(p.line_items![0].price_data!.unit_amount).toBe(3700);
    expect(p.line_items![0].price_data!.recurring).toBeUndefined();
    expect(p.metadata).toEqual({ kind: "donation", supportId: "SUP-1", interval: "once", amount: "37" });
    expect(p.success_url).toBe("https://x.fr/soutenir/merci?session_id={CHECKOUT_SESSION_ID}");
    expect(p.cancel_url).toBe("https://x.fr/soutenir");
  });
  it("don mensuel → mode subscription avec recurring month", () => {
    const p = buildSupportSessionParams({ ...base, kind: "donation", interval: "month", amount: 10 }, "https://x.fr");
    expect(p.mode).toBe("subscription");
    expect(p.line_items![0].price_data!.recurring).toEqual({ interval: "month" });
  });
  it("soutien mensuel → subscription, libellé sans connotation statutaire", () => {
    const p = buildSupportSessionParams({ ...base, kind: "membership", interval: "month", amount: 20 }, "https://x.fr");
    expect(p.mode).toBe("subscription");
    expect(p.line_items![0].price_data!.unit_amount).toBe(2000);
    const name = p.line_items![0].price_data!.product_data!.name;
    expect(name).toContain("Soutien mensuel");
    expect(name).not.toMatch(/cotisation|adhésion|bienfaiteur|membre/i);
    expect(p.metadata!.kind).toBe("membership");
  });
});
