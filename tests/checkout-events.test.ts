import { describe, it, expect, vi } from "vitest";
import { handleCheckoutCompleted, type CheckoutDeps } from "@/lib/checkout-events";
import type { OrderData } from "@/lib/orders";
import type { SupportEntry } from "@/lib/support";

const order: OrderData = {
  checkoutReference: "ASHIFA-1", firstName: "A", lastName: "B", email: "a@b.c", phone: "",
  address: "x", city: "y", postalCode: "67000", quantity: 1, bookPrice: 12, shippingPrice: 5,
  totalAmount: 17, createdAt: "", status: "pending",
};
const support: SupportEntry = {
  id: "SUP-1", kind: "membership", interval: "month", amount: 10,
  firstName: "A", lastName: "B", email: "a@b.c", status: "pending", createdAt: "",
};

function deps(over: Partial<CheckoutDeps> = {}): CheckoutDeps {
  return {
    getOrder: vi.fn(() => order),
    updateOrderStatus: vi.fn(),
    sendOrderEmails: vi.fn(async () => {}),
    getSupportEntry: vi.fn(() => support),
    markSupportPaid: vi.fn(),
    sendSupportEmails: vi.fn(async () => {}),
    ...over,
  };
}

describe("handleCheckoutCompleted", () => {
  it("livre : passe en paid et envoie les emails", async () => {
    const d = deps();
    const r = await handleCheckoutCompleted(
      { id: "cs_1", metadata: { kind: "book", checkoutReference: "ASHIFA-1" }, customer: null, subscription: null }, d);
    expect(r).toBe("book-paid");
    expect(d.updateOrderStatus).toHaveBeenCalledWith("ASHIFA-1", "paid");
    expect(d.sendOrderEmails).toHaveBeenCalledTimes(1);
  });

  it("livre : idempotent si déjà payé", async () => {
    const d = deps({ getOrder: vi.fn(() => ({ ...order, status: "paid" as const })) });
    const r = await handleCheckoutCompleted(
      { id: "cs_1", metadata: { kind: "book", checkoutReference: "ASHIFA-1" }, customer: null, subscription: null }, d);
    expect(r).toBe("already-paid");
    expect(d.updateOrderStatus).not.toHaveBeenCalled();
    expect(d.sendOrderEmails).not.toHaveBeenCalled();
  });

  it("livre : commande introuvable", async () => {
    const d = deps({ getOrder: vi.fn(() => null) });
    const r = await handleCheckoutCompleted(
      { id: "cs_1", metadata: { kind: "book", checkoutReference: "nope" }, customer: null, subscription: null }, d);
    expect(r).toBe("not-found");
  });

  it("adhésion : marque payé avec customer/subscription et envoie les emails", async () => {
    const d = deps();
    const r = await handleCheckoutCompleted(
      { id: "cs_2", metadata: { kind: "membership", supportId: "SUP-1" }, customer: "cus_1", subscription: "sub_1" }, d);
    expect(r).toBe("support-paid");
    expect(d.markSupportPaid).toHaveBeenCalledWith("SUP-1", { stripeCustomerId: "cus_1", stripeSubscriptionId: "sub_1" });
    expect(d.sendSupportEmails).toHaveBeenCalledWith(expect.objectContaining({ id: "SUP-1", status: "paid", stripeCustomerId: "cus_1" }));
  });

  it("don : idempotent si déjà payé", async () => {
    const d = deps({ getSupportEntry: vi.fn(() => ({ ...support, status: "paid" as const })) });
    const r = await handleCheckoutCompleted(
      { id: "cs_2", metadata: { kind: "donation", supportId: "SUP-1" }, customer: "cus_1", subscription: null }, d);
    expect(r).toBe("already-paid");
    expect(d.markSupportPaid).not.toHaveBeenCalled();
  });

  it("kind inconnu ou métadonnées absentes → ignored", async () => {
    const d = deps();
    expect(await handleCheckoutCompleted({ id: "cs", metadata: null, customer: null, subscription: null }, d)).toBe("ignored");
    expect(await handleCheckoutCompleted({ id: "cs", metadata: { kind: "autre" }, customer: null, subscription: null }, d)).toBe("ignored");
  });

  it("une erreur d'email ne fait pas échouer le traitement", async () => {
    const d = deps({ sendOrderEmails: vi.fn(async () => { throw new Error("smtp"); }) });
    const r = await handleCheckoutCompleted(
      { id: "cs_1", metadata: { kind: "book", checkoutReference: "ASHIFA-1" }, customer: null, subscription: null }, d);
    expect(r).toBe("book-paid");
    expect(d.updateOrderStatus).toHaveBeenCalledWith("ASHIFA-1", "paid");
  });
});
