"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Loader2, CreditCard, AlertCircle } from "lucide-react";

interface PayPalCheckoutProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  quantity: number;
  onSuccess: (ref: string) => void;
  onError: (message: string) => void;
}

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: Record<string, unknown>) => {
        render: (el: HTMLElement) => Promise<void>;
        close: () => void;
      };
      FUNDING: {
        PAYPAL: string;
        CARD: string;
      };
    };
  }
}

export function PayPalCheckout({
  formData,
  quantity,
  onSuccess,
  onError,
}: PayPalCheckoutProps) {
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const buttonsRendered = useRef(false);

  // Charge le SDK PayPal
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!clientId) {
      onError("Configuration PayPal manquante");
      return;
    }

    // Éviter de charger le script plusieurs fois
    if (document.querySelector('script[data-paypal-sdk]')) {
      if (window.paypal) {
        setSdkReady(true);
        setLoading(false);
      }
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR&intent=capture&components=buttons`;
    script.setAttribute("data-paypal-sdk", "true");
    script.async = true;

    script.onload = () => {
      setSdkReady(true);
      setLoading(false);
    };

    script.onerror = () => {
      onError("Impossible de charger PayPal. Vérifiez votre connexion.");
      setLoading(false);
    };

    document.head.appendChild(script);
  }, [onError]);

  // Crée la commande côté serveur
  const createOrderOnServer = useCallback(async (): Promise<string> => {
    const res = await fetch("/api/checkout/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, quantity }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Erreur lors de la création de la commande");
    }

    return data.orderId;
  }, [formData, quantity]);

  // Capture le paiement côté serveur
  const captureOrderOnServer = useCallback(
    async (orderId: string): Promise<string> => {
      const res = await fetch("/api/checkout/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la capture du paiement");
      }

      return data.ref;
    },
    []
  );

  // Rend les boutons PayPal une fois le SDK prêt
  useEffect(() => {
    if (!sdkReady || !window.paypal || buttonsRendered.current) return;
    buttonsRendered.current = true;

    const paypal = window.paypal;

    // Bouton Carte bancaire (prioritaire, affiché en premier)
    if (cardContainerRef.current) {
      paypal
        .Buttons({
          fundingSource: paypal.FUNDING.CARD,
          style: {
            color: "black" as const,
            label: "pay" as const,
            height: 48,
          },
          createOrder: async () => {
            try {
              return await createOrderOnServer();
            } catch (err) {
              onError(
                err instanceof Error ? err.message : "Erreur de création"
              );
              throw err;
            }
          },
          onApprove: async (data: { orderID: string }) => {
            try {
              const ref = await captureOrderOnServer(data.orderID);
              onSuccess(ref);
            } catch (err) {
              onError(
                err instanceof Error ? err.message : "Erreur de paiement"
              );
            }
          },
          onError: () => {
            onError("Une erreur est survenue avec PayPal");
          },
        })
        .render(cardContainerRef.current);
    }

    // Bouton PayPal (option secondaire)
    if (paypalContainerRef.current) {
      paypal
        .Buttons({
          fundingSource: paypal.FUNDING.PAYPAL,
          style: {
            color: "gold" as const,
            label: "pay" as const,
            height: 48,
          },
          createOrder: async () => {
            try {
              return await createOrderOnServer();
            } catch (err) {
              onError(
                err instanceof Error ? err.message : "Erreur de création"
              );
              throw err;
            }
          },
          onApprove: async (data: { orderID: string }) => {
            try {
              const ref = await captureOrderOnServer(data.orderID);
              onSuccess(ref);
            } catch (err) {
              onError(
                err instanceof Error ? err.message : "Erreur de paiement"
              );
            }
          },
          onError: () => {
            onError("Une erreur est survenue avec PayPal");
          },
        })
        .render(paypalContainerRef.current);
    }
  }, [sdkReady, createOrderOnServer, captureOrderOnServer, onSuccess, onError]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Chargement du paiement sécurisé...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bouton Carte bancaire */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Carte bancaire</span>
        </div>
        <div ref={cardContainerRef} />
      </div>

      {/* Séparateur */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">ou</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Bouton PayPal */}
      <div ref={paypalContainerRef} />

      {/* Mentions de sécurité */}
      <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
        <AlertCircle className="h-3 w-3" />
        Paiement sécurisé — Vos données bancaires ne sont jamais stockées
      </p>
    </div>
  );
}
