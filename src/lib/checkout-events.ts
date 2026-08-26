import type { OrderData } from "./orders";
import type { SupportEntry } from "./support";

export interface CompletedSession {
  id: string;
  metadata: Record<string, string> | null;
  customer: string | null;
  subscription: string | null;
}

export interface CheckoutDeps {
  getOrder: (ref: string) => OrderData | null;
  updateOrderStatus: (ref: string, status: OrderData["status"]) => void;
  sendOrderEmails: (order: OrderData) => Promise<void>;
  getSupportEntry: (id: string) => SupportEntry | null;
  markSupportPaid: (
    id: string,
    ids: { stripeCustomerId?: string; stripeSubscriptionId?: string }
  ) => void;
  sendSupportEmails: (entry: SupportEntry) => Promise<void>;
}

export type CheckoutResult =
  | "book-paid"
  | "support-paid"
  | "already-paid"
  | "not-found"
  | "ignored";

/**
 * Traite un événement `checkout.session.completed`.
 * Idempotent : une commande/un soutien déjà payé n'est pas retraité.
 */
export async function handleCheckoutCompleted(
  session: CompletedSession,
  deps: CheckoutDeps
): Promise<CheckoutResult> {
  const kind = session.metadata?.kind;

  if (kind === "book") {
    const ref = session.metadata?.checkoutReference;
    const order = ref ? deps.getOrder(ref) : null;
    if (!order || !ref) return "not-found";
    if (order.status === "paid") return "already-paid";

    deps.updateOrderStatus(ref, "paid");
    try {
      await deps.sendOrderEmails({ ...order, status: "paid", stripeSessionId: session.id });
    } catch (err) {
      console.error(`Webhook: échec envoi emails commande ${ref}:`, err);
    }
    return "book-paid";
  }

  if (kind === "donation" || kind === "membership") {
    const id = session.metadata?.supportId;
    const entry = id ? deps.getSupportEntry(id) : null;
    if (!entry || !id) return "not-found";
    if (entry.status === "paid") return "already-paid";

    const ids = {
      stripeCustomerId: session.customer ?? undefined,
      stripeSubscriptionId: session.subscription ?? undefined,
    };
    deps.markSupportPaid(id, ids);
    try {
      await deps.sendSupportEmails({ ...entry, ...ids, status: "paid", stripeSessionId: session.id });
    } catch (err) {
      console.error(`Webhook: échec envoi emails soutien ${id}:`, err);
    }
    return "support-paid";
  }

  return "ignored";
}
