const PAYPAL_BASE_URL = process.env.PAYPAL_SANDBOX === "true"
  ? "https://api-m.sandbox.paypal.com"
  : "https://api-m.paypal.com";

function getClientId(): string {
  const id = process.env.PAYPAL_CLIENT_ID;
  if (!id) throw new Error("PAYPAL_CLIENT_ID is not configured");
  return id;
}

function getClientSecret(): string {
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!secret) throw new Error("PAYPAL_CLIENT_SECRET is not configured");
  return secret;
}

// ─── OAuth2 Access Token ─────────────────────────────────────

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  // Réutilise le token s'il est encore valide (avec 60s de marge)
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.token;
  }

  const credentials = Buffer.from(
    `${getClientId()}:${getClientSecret()}`
  ).toString("base64");

  const res = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`PayPal OAuth failed: ${res.status} ${error}`);
  }

  const data = await res.json();

  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return cachedToken.token;
}

// ─── Create Order ────────────────────────────────────────────

export interface CreateOrderRequest {
  reference_id: string;
  description: string;
  amount: number;
  currency: string;
  return_url: string;
  cancel_url: string;
}

export interface PayPalOrder {
  id: string;
  status: "CREATED" | "SAVED" | "APPROVED" | "VOIDED" | "COMPLETED" | "PAYER_ACTION_REQUIRED";
  links: Array<{ href: string; rel: string; method: string }>;
}

export async function createOrder(
  data: CreateOrderRequest
): Promise<PayPalOrder> {
  const token = await getAccessToken();

  const res = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: data.reference_id,
          description: data.description,
          amount: {
            currency_code: data.currency,
            value: data.amount.toFixed(2),
          },
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
            brand_name: "Centre Ashifa",
            locale: "fr-FR",
            landing_page: "LOGIN",
            user_action: "PAY_NOW",
            return_url: data.return_url,
            cancel_url: data.cancel_url,
          },
        },
      },
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`PayPal create order failed: ${res.status} ${error}`);
  }

  return res.json();
}

// ─── Capture Order ───────────────────────────────────────────

export interface CaptureResult {
  id: string;
  status: "COMPLETED" | "DECLINED" | "PARTIALLY_REFUNDED" | "PENDING" | "REFUNDED" | "FAILED";
  purchase_units: Array<{
    reference_id: string;
    payments: {
      captures: Array<{
        id: string;
        status: string;
        amount: { currency_code: string; value: string };
      }>;
    };
  }>;
}

export async function captureOrder(orderId: string): Promise<CaptureResult> {
  const token = await getAccessToken();

  const res = await fetch(
    `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`PayPal capture order failed: ${res.status} ${error}`);
  }

  return res.json();
}

// ─── Get Order Details ───────────────────────────────────────

export async function getOrder(orderId: string): Promise<PayPalOrder & { purchase_units: Array<{ reference_id: string }> }> {
  const token = await getAccessToken();

  const res = await fetch(
    `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`PayPal get order failed: ${res.status} ${error}`);
  }

  return res.json();
}

// ─── Verify Webhook Signature ────────────────────────────────

export async function verifyWebhookSignature(
  headers: Record<string, string>,
  body: string
): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) {
    console.error("PAYPAL_WEBHOOK_ID is not configured — skipping verification");
    return false;
  }

  const token = await getAccessToken();

  const res = await fetch(
    `${PAYPAL_BASE_URL}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_algo: headers["paypal-auth-algo"],
        cert_url: headers["paypal-cert-url"],
        transmission_id: headers["paypal-transmission-id"],
        transmission_sig: headers["paypal-transmission-sig"],
        transmission_time: headers["paypal-transmission-time"],
        webhook_id: webhookId,
        webhook_event: JSON.parse(body),
      }),
    }
  );

  if (!res.ok) return false;

  const result = await res.json();
  return result.verification_status === "SUCCESS";
}

// ─── Helper ──────────────────────────────────────────────────

export function getApproveUrl(order: PayPalOrder): string | undefined {
  return order.links.find((l) => l.rel === "payer-action")?.href;
}
