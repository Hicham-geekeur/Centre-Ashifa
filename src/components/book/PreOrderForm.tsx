"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2, Minus, Plus } from "lucide-react";

export function PreOrderForm() {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg border border-border">
      <h3 className="text-lg font-semibold mb-4">Commander le livre</h3>

      {/* Quantity selector */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-muted-foreground">Quantité</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-accent transition-colors"
            disabled={quantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="w-8 text-center font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-accent transition-colors"
            disabled={quantity >= 10}
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Checkout button */}
      <Button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full h-12 text-base"
        size="lg"
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <ShoppingCart className="mr-2 h-4 w-4" />
        )}
        {loading ? "Redirection..." : "Pré-commander maintenant"}
      </Button>

      {/* Security badges */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <span>Paiement sécurisé</span>
        <span>|</span>
        <span>Livraison en France</span>
      </div>
    </div>
  );
}
