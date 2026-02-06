import type { Metadata } from "next";
import { CalendarDays, Home, Phone, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { CalendlyEmbed } from "@/components/appointment/CalendlyEmbed";

export const metadata: Metadata = {
  title: "Prendre rendez-vous",
  description:
    "Prenez rendez-vous pour une séance de Roqya-thérapie ou TCC à Strasbourg. Séances au cabinet et à distance.",
  openGraph: {
    title: "Prendre rendez-vous | Centre Ashifa",
    description:
      "Réservez votre séance de Roqya-thérapie à Strasbourg et sa région.",
  },
};

const infos = [
  {
    icon: Home,
    title: "Au cabinet et à distance",
    description: "Séances au cabinet ou à distance selon votre préférence.",
  },
  {
    icon: MapPin,
    title: "Strasbourg et région",
    description: "Interventions sur Strasbourg et sa région.",
  },
  {
    icon: Clock,
    title: "Durée de la séance",
    description: "Entre 45 minutes et 1h30 selon le type de séance.",
  },
  {
    icon: Phone,
    title: "Contact direct",
    description: siteConfig.phone.display,
  },
];

export default function RendezVousPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-12 sm:pt-40 sm:pb-16 bg-gradient-to-b from-accent to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <CalendarDays className="h-8 w-8 text-primary" />
            </div>
            <Badge variant="outline" className="mb-4">
              Rendez-vous
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Prendre rendez-vous
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Choisissez le type de séance et le créneau qui vous convient.
              Toutes nos séances ont repris au cabinet et à distance.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Info cards */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {infos.map((info) => (
              <AnimatedSection key={info.title}>
                <div className="flex items-center gap-3 rounded-xl bg-accent/50 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <info.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{info.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {info.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Calendly embed */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
            <CalendlyEmbed />
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Vous pouvez aussi nous contacter directement au{" "}
            <a
              href={`tel:${siteConfig.phone.primary}`}
              className="font-medium text-primary hover:underline"
            >
              {siteConfig.phone.display}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
