const SUMUP_BASE_URL = "https://api.sumup.com";

function getApiKey(): string {
  const key = process.env.SUMUP_API_KEY;
  if (!key) throw new Error("SUMUP_API_KEY is not configured");
  return key;
}

export interface CreateCheckoutRequest {
  checkout_reference: string;
  amount: number;
  currency: string;
  merchant_code: string;
  description?: string;
  return_url?: string;
  redirect_url?: string;
  hosted_checkout?: { enabled: boolean };
}

export interface CheckoutResponse {
  id: string;
  checkout_reference: string;
  amount: number;
  currency: string;
  status: "PENDING" | "PAID" | "FAILED" | "EXPIRED";
  date: string;
  hosted_checkout_url?: string;
  transactions?: Array<{
    id: string;
    transaction_code: string;
    amount: number;
    status: string;
    timestamp: string;
  }>;
}

export async function createCheckout(
  data: CreateCheckoutRequest
): Promise<CheckoutResponse> {
  const res = await fetch(`${SUMUP_BASE_URL}/v0.1/checkouts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`SumUp create checkout failed: ${res.status} ${error}`);
  }

  return res.json();
}

export async function getCheckout(
  checkoutId: string
): Promise<CheckoutResponse> {
  const res = await fetch(`${SUMUP_BASE_URL}/v0.1/checkouts/${checkoutId}`, {
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`SumUp get checkout failed: ${res.status} ${error}`);
  }

  return res.json();
}
