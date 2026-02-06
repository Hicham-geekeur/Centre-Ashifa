import type { Metadata } from "next";
import { BookOpen, Star, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { PreOrderForm } from "@/components/book/PreOrderForm";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Le Livre - Pré-commande",
  description:
    "Pré-commandez le nouveau livre de Larbi DJEDADOUA sur la Roqya-thérapie. Un ouvrage complet sur l'accompagnement par les mots du Saint Coran.",
  openGraph: {
    title: "Le Livre | Centre Ashifa",
    description:
      "Pré-commandez le nouveau livre sur la Roqya-thérapie par Larbi DJEDADOUA.",
  },
};

const tableOfContents = [
  "Introduction à la Roqya-thérapie",
  "Les fondements coraniques de l'accompagnement spirituel",
  "Comprendre le sihr, le mauvais oeil et le mass",
  "Les signes et symptômes du mal occulte",
  "Les méthodes de diagnostic",
  "Le protocole de Roqya",
  "La protection au quotidien",
  "Témoignages et cas pratiques",
];

const features = [
  "Basé sur des années d'expérience de terrain",
  "Approche conforme au Coran et à la Sunna",
  "Conseils pratiques et accessibles",
  "Témoignages réels d'accompagnement",
];

export default function LivrePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 bg-gradient-to-b from-accent to-background overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-gold/5" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Book mockup */}
            <AnimatedSection>
              <div className="flex justify-center">
                <div className="relative w-64 sm:w-80">
                  <div className="absolute -bottom-4 left-4 right-4 h-8 rounded-full bg-black/10 blur-xl" />
                  <div className="relative rounded-lg bg-gradient-to-br from-primary to-primary/80 p-10 shadow-2xl aspect-[3/4]">
                    <div className="flex h-full flex-col items-center justify-center text-center text-white">
                      <div className="mb-6 h-px w-20 bg-gold" />
                      <BookOpen className="mb-6 h-12 w-12 text-gold" />
                      <h2 className="text-2xl font-bold leading-tight">
                        La Roqya
                      </h2>
                      <p className="mt-1 text-white/70">Thérapie</p>
                      <div className="mt-6 h-px w-20 bg-gold" />
                      <p className="mt-6 text-sm text-white/50">
                        Larbi DJEDADOUA
                      </p>
                    </div>
                    <div className="absolute left-0 top-0 bottom-0 w-4 rounded-l-lg bg-primary/60" />
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Info */}
            <AnimatedSection delay={0.2}>
              <div className="space-y-6">
                <div>
                  <Badge className="mb-4 bg-gold text-gold-foreground hover:bg-gold/90">
                    <Star className="mr-1 h-3 w-3" />
                    Pré-commande
                  </Badge>
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                    La Roqya Thérapie
                  </h1>
                  <p className="mt-2 text-lg text-muted-foreground">
                    par {siteConfig.practitioner.name}
                  </p>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  Découvrez le fruit de plusieurs années d&apos;expérience et de
                  recherche dans le domaine de la Roqya-thérapie. Cet ouvrage
                  complet vous guidera dans la compréhension des maux occultes
                  et les méthodes d&apos;accompagnement par les mots du Saint Coran.
                </p>

                <ul className="space-y-2">
                  {features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm"
                    >
                      <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <PreOrderForm />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Table of contents */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <AnimatedSection>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Sommaire
              </h2>
              <p className="mt-4 text-muted-foreground">
                Un guide complet et structuré pour comprendre et pratiquer la
                Roqya-thérapie selon les préceptes de l&apos;Islam.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <ol className="space-y-3">
                {tableOfContents.map((chapter, index) => (
                  <li
                    key={chapter}
                    className="flex items-center gap-4 rounded-lg bg-accent/50 p-4"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium">{chapter}</span>
                  </li>
                ))}
              </ol>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Author section */}
      <section className="py-20 bg-accent/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                À propos de l&apos;auteur
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                {siteConfig.practitioner.name} est un praticien reconnu et
                certifié en thérapie cognitive et comportementale. Détenteur
                d&apos;une Ijaza dans les 10 lectures du Saint Coran, il exerce
                la Roqya-thérapie depuis plusieurs années à Strasbourg et sa
                région. Ce livre est le fruit de son expérience de terrain et de
                sa volonté de transmettre un savoir authentique et accessible.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
