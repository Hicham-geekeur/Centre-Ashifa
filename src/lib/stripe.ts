import Stripe from "stripe";
import type { OrderData } from "./orders";
import type { SupportFormData } from "./validations";

export const BOOK_TITLE = "La Roqya à la lumière du Tawhid";

let stripeSingleton: Stripe | null = null;

/** Client Stripe (serveur uniquement). */
export function getStripe(): Stripe {
  if (!stripeSingleton) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
    stripeSingleton = new Stripe(key);
  }
  return stripeSingleton;
}

function toCents(euros: number): number {
  return Math.round(euros * 100);
}

/** Paramètres de session Checkout pour l'achat du livre. */
export function buildBookSessionParams(
  order: OrderData,
  baseUrl: string
): Stripe.Checkout.SessionCreateParams {
  return {
    mode: "payment",
    locale: "fr",
    customer_email: order.email,
    client_reference_id: order.checkoutReference,
    line_items: [
      {
        quantity: order.quantity,
        price_data: {
          currency: "eur",
          unit_amount: toCents(order.bookPrice),
          product_data: { name: `Livre « ${BOOK_TITLE} »` },
        },
      },
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: toCents(order.shippingPrice),
          product_data: { name: "Frais de livraison (France)" },
        },
      },
    ],
    metadata: { kind: "book", checkoutReference: order.checkoutReference },
    success_url: `${baseUrl}/livre/merci?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/livre?annule=1`,
  };
}

/** Paramètres de session Checkout pour un don ou une cotisation. */
export function buildSupportSessionParams(
  input: SupportFormData & { supportId: string },
  baseUrl: string
): Stripe.Checkout.SessionCreateParams {
  const recurring = input.interval === "month";
  const name =
    input.kind === "membership"
      ? "Soutien mensuel à l'association Ashifa"
      : recurring
        ? "Don mensuel à l'association Ashifa"
        : "Don à l'association Ashifa";

  return {
    mode: recurring ? "subscription" : "payment",
    locale: "fr",
    customer_email: input.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: toCents(input.amount),
          product_data: { name },
          ...(recurring ? { recurring: { interval: "month" as const } } : {}),
        },
      },
    ],
    metadata: {
      kind: input.kind,
      supportId: input.supportId,
      interval: input.interval,
      amount: String(input.amount),
    },
    success_url: `${baseUrl}/soutenir/merci?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/soutenir`,
  };
}
