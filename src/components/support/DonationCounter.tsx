"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Heart, Users, Repeat, ShieldCheck } from "lucide-react";
import type { DonationStats } from "@/lib/donation-stats";

function useCountUp(target: number, active: boolean, duration = 1800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let frame: number;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active, duration]);
  return value;
}

const euros = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export function DonationCounter({ stats }: { stats: DonationStats }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  // Sécurité : si l'observateur ne se déclenche pas, on lance quand même le compteur.
  const [forced, setForced] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setForced(true), 1500);
    return () => clearTimeout(t);
  }, []);
  const active = inView || forced;
  const total = useCountUp(stats.totalEuros, active);
  const donors = useCountUp(stats.donors, active, 1400);
  const monthly = useCountUp(stats.monthlySupporters, active, 1400);
  const updated = new Date(stats.updatedAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-[oklch(0.35_0.11_170)] p-6 text-primary-foreground shadow-xl sm:p-8"
      aria-label="Compteur des dons reçus"
    >
      {/* Halo décoratif */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-white/5 blur-2xl"
      />

      <div className="relative">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground/80">
          <ShieldCheck className="h-4 w-4" />
          Transparence
        </div>

        <div className="mt-5 flex items-end gap-3">
          <Heart className="mb-2 h-7 w-7 shrink-0 animate-heartbeat fill-current" />
          <div>
            <div className="text-5xl font-bold tabular-nums leading-none tracking-tight sm:text-6xl">
              {euros.format(Math.round(total))}
            </div>
            <p className="mt-2 text-sm text-primary-foreground/85">
              collectés grâce à vous depuis le lancement
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-primary-foreground/80">
              <Users className="h-4 w-4" />
              <span className="text-xs font-medium">Donateurs</span>
            </div>
            <div className="mt-1 text-3xl font-bold tabular-nums">
              {Math.round(donors).toLocaleString("fr-FR")}
            </div>
          </div>
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-primary-foreground/80">
              <Repeat className="h-4 w-4" />
              <span className="text-xs font-medium">Soutiens mensuels</span>
            </div>
            <div className="mt-1 text-3xl font-bold tabular-nums">
              {Math.round(monthly).toLocaleString("fr-FR")}
            </div>
          </div>
        </div>

        <p className="mt-6 text-[11px] leading-relaxed text-primary-foreground/70">
          Chiffres issus de Stripe, hors achats du livre, mis à jour le {updated}.
          Aucune donnée personnelle n&apos;est publiée.
        </p>
      </div>
    </motion.div>
  );
}
