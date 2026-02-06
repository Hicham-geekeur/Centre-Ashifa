import type { Metadata } from "next";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceProcess } from "@/components/services/ServiceProcess";
import { ServiceFAQ } from "@/components/services/ServiceFAQ";
import { DisclaimerBanner } from "@/components/shared/DisclaimerBanner";
import { AppointmentCTA } from "@/components/home/AppointmentCTA";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

export const metadata: Metadata = {
  title: "Thérapie Cognitive et Comportementale (TCC)",
  description:
    "Thérapie cognitive et comportementale (TCC) à Strasbourg. Praticien certifié. Reconnaissance et modification des pensées problématiques pour retrouver l'équilibre.",
  openGraph: {
    title: "Thérapie Cognitive (TCC) | Centre Ashifa",
    description:
      "TCC à Strasbourg - Praticien certifié en thérapie cognitive et comportementale.",
  },
};

const processSteps = [
  {
    number: "1",
    title: "Bilan initial",
    description:
      "Évaluation complète de votre situation psychologique et identification des schémas de pensée problématiques.",
  },
  {
    number: "2",
    title: "Plan thérapeutique",
    description:
      "Élaboration d'un programme personnalisé avec des objectifs clairs et mesurables.",
  },
  {
    number: "3",
    title: "Séances de TCC",
    description:
      "Travail en séance sur les pensées automatiques, les croyances et les comportements à modifier.",
  },
  {
    number: "4",
    title: "Autonomie",
    description:
      "Acquisition d'outils concrets pour gérer vos émotions et pensées de manière autonome.",
  },
];

const faqItems = [
  {
    question: "Qu'est-ce que la TCC ?",
    answer:
      "La Thérapie Cognitive et Comportementale (TCC) est une approche thérapeutique scientifiquement validée qui vise à identifier et modifier les pensées négatives automatiques et les comportements problématiques qui maintiennent la souffrance psychologique.",
  },
  {
    question: "Pour quels troubles la TCC est-elle efficace ?",
    answer:
      "La TCC est reconnue pour son efficacité dans le traitement de l'anxiété, la dépression, les phobies, les troubles obsessionnels, le stress post-traumatique, les troubles du sommeil et bien d'autres problématiques psychologiques.",
  },
  {
    question: "Combien de séances faut-il prévoir ?",
    answer:
      "La TCC est une thérapie brève. En général, un suivi de 10 à 20 séances permet d'obtenir des résultats significatifs, selon la problématique traitée.",
  },
  {
    question: "La TCC est-elle compatible avec la Roqya ?",
    answer:
      "Oui, au Centre Ashifa nous proposons une approche intégrative qui combine la TCC et la Roqya pour une prise en charge globale du patient, tant sur le plan psychologique que spirituel.",
  },
];

const benefits = [
  "Gestion de l'anxiété et du stress",
  "Traitement de la dépression",
  "Surmontement des phobies",
  "Amélioration de l'estime de soi",
  "Gestion des émotions",
  "Résolution des troubles du sommeil",
];

export default function TherapieCognitivePage() {
  return (
    <>
      <ServiceHero
        iconName="Brain"
        badge="Approche scientifique"
        title="Thérapie Cognitive et Comportementale"
        subtitle="Reconnaissance et modification des pensées et comportements problématiques pour retrouver un équilibre psychologique durable."
      />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Une approche scientifique et éprouvée
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                La TCC repose sur l&apos;idée que nos pensées, émotions et
                comportements sont étroitement liés. En identifiant les pensées
                automatiques négatives et les schémas cognitifs dysfonctionnels,
                nous pouvons les modifier pour améliorer notre bien-être
                psychologique.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Notre praticien, Larbi DJEDADOUA, est certifié en TCC et
                propose une approche intégrative unique qui allie les apports de
                la science cognitive à la dimension spirituelle.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="rounded-xl bg-accent p-8">
                <h3 className="text-lg font-semibold mb-6">
                  Domaines d&apos;intervention
                </h3>
                <ul className="space-y-3">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <ServiceProcess steps={processSteps} />
      <ServiceFAQ items={faqItems} />
      <DisclaimerBanner />
      <AppointmentCTA />
    </>
  );
}
