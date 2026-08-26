"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Users } from "lucide-react";
import type { DonationStats } from "@/lib/donation-stats";

const euros = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

/** Compteur de dons compact (pastille), renvoie vers la page Nous soutenir. */
export function DonationPill({
  stats,
  delay = 0,
}: {
  stats: DonationStats;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className="flex justify-center"
    >
      <Link
        href="/soutenir"
        aria-label={`${euros.format(stats.totalEuros)} collectés grâce à ${stats.donors} donateurs — nous soutenir`}
        className="group inline-flex items-center gap-3 rounded-full border border-primary/20 bg-white/70 py-1.5 pl-1.5 pr-4 text-sm shadow-sm backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-md"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Heart className="h-4 w-4 animate-heartbeat fill-current" />
        </span>
        <span className="tabular-nums">
          <span className="font-bold text-primary">
            {euros.format(stats.totalEuros)}
          </span>{" "}
          <span className="text-muted-foreground">collectés</span>
        </span>
        <span aria-hidden className="h-4 w-px bg-border" />
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          <span className="tabular-nums">
            <span className="font-semibold text-foreground">
              {stats.donors.toLocaleString("fr-FR")}
            </span>{" "}
            donateur{stats.donors > 1 ? "s" : ""}
          </span>
        </span>
      </Link>
    </motion.div>
  );
}
