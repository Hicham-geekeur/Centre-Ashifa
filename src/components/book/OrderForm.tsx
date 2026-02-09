"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShoppingBag,
  Loader2,
  Minus,
  Plus,
  Lock,
  AlertCircle,
} from "lucide-react";
import { BOOK_PRICE, SHIPPING_PRICE, calculateTotal } from "@/lib/validations";

export function OrderForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const total = calculateTotal(quantity);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, quantity }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Une erreur est survenue");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Impossible de créer le paiement");
      }
    } catch {
      setError("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg border border-border">
      <h3 className="text-lg font-semibold mb-4">Commander le livre</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="firstName"
              className="text-sm font-medium mb-1.5 block"
            >
              Prénom *
            </label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              placeholder="Votre prénom"
              required
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="text-sm font-medium mb-1.5 block"
            >
              Nom *
            </label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              placeholder="Votre nom"
              required
            />
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium mb-1.5 block"
            >
              Email *
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="votre@email.com"
              required
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="text-sm font-medium mb-1.5 block"
            >
              Téléphone
            </label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="06 XX XX XX XX"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="text-sm font-medium mb-1.5 block"
          >
            Adresse de livraison *
          </label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => update("address", e.target.value)}
            placeholder="Numéro et nom de rue"
            required
          />
        </div>

        {/* City & Postal code */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="postalCode"
              className="text-sm font-medium mb-1.5 block"
            >
              Code postal *
            </label>
            <Input
              id="postalCode"
              value={formData.postalCode}
              onChange={(e) => update("postalCode", e.target.value)}
              placeholder="67000"
              required
              maxLength={5}
              pattern="\d{5}"
            />
          </div>
          <div>
            <label htmlFor="city" className="text-sm font-medium mb-1.5 block">
              Ville *
            </label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => update("city", e.target.value)}
              placeholder="Strasbourg"
              required
            />
          </div>
        </div>

        {/* Quantity */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm font-medium">Quantité</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-accent transition-colors"
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(10, q + 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-accent transition-colors"
              disabled={quantity >= 10}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Price breakdown */}
        <div className="rounded-lg bg-accent/50 p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {quantity} x Livre
            </span>
            <span>{(BOOK_PRICE * quantity).toFixed(2)} €</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Livraison</span>
            <span>{SHIPPING_PRICE.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 font-semibold text-base">
            <span>Total</span>
            <span>{total.toFixed(2)} €</span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 text-base"
          size="lg"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ShoppingBag className="mr-2 h-4 w-4" />
          )}
          {loading ? "Redirection..." : `Payer ${total.toFixed(2)} €`}
        </Button>

        {/* Trust signals */}
        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <Lock className="h-3 w-3" />
          <span>Paiement sécurisé via SumUp</span>
          <span className="mx-1">·</span>
          <span>Livraison en France</span>
        </div>
      </form>
    </div>
  );
}
