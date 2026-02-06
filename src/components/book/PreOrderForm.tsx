"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Minus, Plus } from "lucide-react";

const EMAIL = "centre.ashifa67@gmail.com";

export function PreOrderForm() {
  const [quantity, setQuantity] = useState(1);

  const handleOrder = () => {
    const subject = encodeURIComponent("Commande du livre — La Roqya à la lumière du Tawhid");
    const body = encodeURIComponent(
      `Assalamu alaykum,\n\nJe souhaite commander ${quantity} exemplaire${quantity > 1 ? "s" : ""} du livre « La Roqya à la lumière du Tawhid ».\n\nMerci de me communiquer les modalités de paiement et de livraison.\n\nCordialement,\n`
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
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

      {/* Order button */}
      <Button
        onClick={handleOrder}
        className="w-full h-12 text-base"
        size="lg"
      >
        <Mail className="mr-2 h-4 w-4" />
        Commander par email
      </Button>

      {/* Info */}
      <div className="mt-4 flex items-center justify-center text-xs text-muted-foreground">
        <span>Livraison en France</span>
      </div>
    </div>
  );
}
