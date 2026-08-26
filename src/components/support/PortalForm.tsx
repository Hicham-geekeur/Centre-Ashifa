"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Settings } from "lucide-react";

export function PortalForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/soutenir/portail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setMessage(
        "Si un soutien mensuel est associé à cette adresse, vous pouvez aussi le gérer depuis le lien présent dans vos reçus Stripe. Sinon, contactez-nous."
      );
    } catch {
      setMessage("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-accent/30 p-6"
    >
      <h3 className="flex items-center gap-2 text-base font-semibold">
        <Settings className="h-4 w-4" /> Gérer mon soutien mensuel
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Modifier votre moyen de paiement ou arrêter votre don mensuel /
        cotisation.
      </p>
      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <Input
          type="email"
          placeholder="votre@email.com"
          aria-label="Votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" variant="outline" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Accéder"}
        </Button>
      </div>
      {message && (
        <p className="mt-3 text-sm text-muted-foreground">{message}</p>
      )}
    </form>
  );
}
