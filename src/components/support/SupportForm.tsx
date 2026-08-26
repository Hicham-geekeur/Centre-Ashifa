"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Users, Lock, AlertCircle, Loader2 } from "lucide-react";
import {
  DONATION_PRESETS,
  DONATION_MIN,
  DONATION_MAX,
  MEMBERSHIP_TIERS,
} from "@/lib/validations";

type Tab = "don" | "mensuel";
type Interval = "once" | "month";

const IDENTITY = { firstName: "", lastName: "", email: "" };

export function SupportForm({ initialTab = "don" }: { initialTab?: Tab }) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [interval, setDonationInterval] = useState<Interval>("once");
  const [donation, setDonation] = useState<number>(20);
  const [customDonation, setCustomDonation] = useState("");
  const [tier, setTier] = useState<number>(10);
  const [identity, setIdentity] = useState(IDENTITY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isCustom = customDonation !== "";
  const donationAmount = isCustom ? Number(customDonation) : donation;
  const amount = tab === "don" ? donationAmount : tier;
  const effectiveInterval: Interval = tab === "don" ? interval : "month";

  const update = (field: keyof typeof IDENTITY, value: string) =>
    setIdentity((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (
      tab === "don" &&
      (!Number.isInteger(amount) || amount < DONATION_MIN || amount > DONATION_MAX)
    ) {
      setError(
        `Le montant doit être un nombre entier entre ${DONATION_MIN} € et ${DONATION_MAX} €.`
      );
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/soutenir/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...identity,
          kind: tab === "don" ? "donation" : "membership",
          interval: effectiveInterval,
          amount,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) {
        setError(data.error || "Une erreur est survenue. Veuillez réessayer.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
      setLoading(false);
    }
  };

  const tabClass = (active: boolean) =>
    `flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
      active
        ? "bg-primary text-primary-foreground shadow"
        : "text-muted-foreground hover:bg-accent"
    }`;
  const pillClass = (active: boolean) =>
    `rounded-lg border px-4 py-3 text-sm font-semibold transition-colors ${
      active
        ? "border-primary bg-primary/10 text-primary"
        : "border-border hover:bg-accent"
    }`;

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg border border-border">
      {/* Onglets */}
      <div className="mb-6 flex gap-2 rounded-xl bg-accent/50 p-1" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "don"}
          className={tabClass(tab === "don")}
          onClick={() => setTab("don")}
        >
          <Heart className="h-4 w-4" /> Faire un don
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "mensuel"}
          className={tabClass(tab === "mensuel")}
          onClick={() => setTab("mensuel")}
        >
          <Users className="h-4 w-4" /> Soutien mensuel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {tab === "don" ? (
          <>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className={pillClass(interval === "once")}
                onClick={() => setDonationInterval("once")}
              >
                Don ponctuel
              </button>
              <button
                type="button"
                className={pillClass(interval === "month")}
                onClick={() => setDonationInterval("month")}
              >
                Don mensuel
              </button>
            </div>
            <div>
              <span className="text-sm font-medium mb-2 block">Montant</span>
              <div className="grid grid-cols-3 gap-2">
                {DONATION_PRESETS.map((v) => (
                  <button
                    key={v}
                    type="button"
                    className={pillClass(!isCustom && donation === v)}
                    onClick={() => {
                      setDonation(v);
                      setCustomDonation("");
                    }}
                  >
                    {v} €
                  </button>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Input
                  type="number"
                  inputMode="numeric"
                  min={DONATION_MIN}
                  max={DONATION_MAX}
                  step={1}
                  placeholder="Montant libre"
                  aria-label="Montant libre"
                  value={customDonation}
                  onChange={(e) => setCustomDonation(e.target.value)}
                />
                <span className="text-sm text-muted-foreground">
                  €{interval === "month" ? "/mois" : ""}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div>
            <span className="text-sm font-medium mb-2 block">
              Montant mensuel
            </span>
            <div className="grid grid-cols-3 gap-2">
              {MEMBERSHIP_TIERS.map((v) => (
                <button
                  key={v}
                  type="button"
                  className={pillClass(tier === v)}
                  onClick={() => setTier(v)}
                >
                  {v} €/mois
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Ce soutien est un don régulier : il ne confère ni la qualité de
              membre de l&apos;association ni de droit de vote à
              l&apos;assemblée générale.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="s-firstName" className="text-sm font-medium mb-1.5 block">
              Prénom *
            </label>
            <Input
              id="s-firstName"
              value={identity.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              placeholder="Votre prénom"
              required
            />
          </div>
          <div>
            <label htmlFor="s-lastName" className="text-sm font-medium mb-1.5 block">
              Nom *
            </label>
            <Input
              id="s-lastName"
              value={identity.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              placeholder="Votre nom"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="s-email" className="text-sm font-medium mb-1.5 block">
            Email *
          </label>
          <Input
            id="s-email"
            type="email"
            value={identity.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="votre@email.com"
            required
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-12 text-base"
          size="lg"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : tab === "don" ? (
            <Heart className="mr-2 h-4 w-4" />
          ) : (
            <Users className="mr-2 h-4 w-4" />
          )}
          {loading
            ? "Redirection vers le paiement…"
            : tab === "don"
              ? `Donner ${Number.isFinite(amount) && amount > 0 ? amount : "…"} €${interval === "month" ? " / mois" : ""}`
              : `Soutenir — ${tier} € / mois`}
        </Button>

        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <Lock className="h-3 w-3" />
          <span>Paiement sécurisé via Stripe — résiliable à tout moment</span>
        </div>
      </form>
    </div>
  );
}
