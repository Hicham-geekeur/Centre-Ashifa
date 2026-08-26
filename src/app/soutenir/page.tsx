import type { Metadata } from "next";
import { HeartHandshake, Gift, Users, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { SupportForm } from "@/components/support/SupportForm";
import { PortalForm } from "@/components/support/PortalForm";

export const metadata: Metadata = {
  title: "Nous soutenir — Faire un don",
  description:
    "Soutenez l'association ASHIFA BIEN-ÊTRE ET ÉQUILIBRE par un don ponctuel ou un soutien mensuel. Nos séances restent gratuites grâce à vous.",
  openGraph: {
    title: "Nous soutenir | Centre Ashifa",
    description:
      "Faites un don ponctuel ou mensuel pour que nos séances restent gratuites.",
  },
};

const reasons = [
  {
    icon: Gift,
    title: "Des séances gratuites",
    text: "Vos dons financent l'accueil gratuit de toutes les personnes accompagnées.",
  },
  {
    icon: Users,
    title: "Une association",
    text: "ASHIFA BIEN-ÊTRE ET ÉQUILIBRE est une association à but non lucratif de droit local.",
  },
  {
    icon: ShieldCheck,
    title: "Paiement sécurisé",
    text: "Paiement par Stripe, résiliable à tout moment pour les soutiens mensuels.",
  },
];

export default async function SoutenirPage({
  searchParams,
}: {
  searchParams: Promise<{ onglet?: string }>;
}) {
  const { onglet } = await searchParams;
  const initialTab =
    onglet === "mensuel" || onglet === "adhesion" ? "mensuel" : "don";

  return (
    <>
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 bg-gradient-to-b from-accent to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <AnimatedSection>
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <HeartHandshake className="h-8 w-8 text-primary" />
              </div>
              <Badge variant="outline" className="mb-4">
                Nous soutenir
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Aidez-nous à garder nos séances gratuites
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Le Centre Ashifa est porté par une association. Chaque don,
                ponctuel ou mensuel, permet d&apos;accueillir gratuitement
                celles et ceux qui en ont besoin.
              </p>
              <ul className="mt-8 space-y-4">
                {reasons.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex gap-3">
                    <Icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">{title}</p>
                      <p className="text-sm text-muted-foreground">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <SupportForm initialTab={initialTab} />
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <PortalForm />
        </div>
      </section>
    </>
  );
}
