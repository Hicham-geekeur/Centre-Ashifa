import type { Metadata } from "next";
import Link from "next/link";
import { Star, CheckCircle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { OrderForm } from "@/components/book/OrderForm";
import {
  InteractiveBook3D,
  BackCoverMockup,
} from "@/components/book/BookMockup";

export const metadata: Metadata = {
  title: "Le Livre — La Roqya à la lumière du Tawhid",
  description:
    "Commandez le livre « La Roqya à la lumière du Tawhid » de Larbi Al-Khattab. Un traité complet, authentique et accessible sur la Roqya, fondé sur le Coran et la Sunna.",
  openGraph: {
    title: "La Roqya à la lumière du Tawhid | Centre Ashifa",
    description:
      "Le nouveau livre de Larbi Al-Khattab — Un ouvrage éclairant qui redonne à la Roqya sa véritable place.",
  },
};

const tableOfContents = [
  "Introduction — Des incantations préislamiques à la purification prophétique",
  "Les fondements spirituels : Tawhid, Coran et Sunna",
  "Comprendre le sihr, le mauvais œil, le mass et le waswas",
  "Les signes et symptômes du mal occulte",
  "Les méthodes légiférées, approuvées par les savants",
  "Les erreurs à éviter et les pratiques occultes qui n'ont rien d'islamique",
  "Reconnaître un praticien fiable et se protéger des charlatans",
  "Demander la Roqya est-il déconseillé ? Réponse claire et apaisante",
  "La protection au quotidien",
  "Témoignages et cas pratiques",
];

const features = [
  "Les bases spirituelles de la Roqya, expliquées simplement",
  "Les erreurs à éviter et les pratiques occultes à fuir",
  "Les méthodes légiférées, approuvées par les savants",
  "Les critères pour reconnaître un praticien fiable",
  "Une réponse claire à la question : demander la Roqya est-il déconseillé ?",
];

export default function LivrePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 bg-gradient-to-b from-accent to-background overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-gold/5" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Interactive 3D Book — drag to rotate 360° */}
            <InteractiveBook3D className="w-full max-w-sm mx-auto" />

            {/* Info */}
            <AnimatedSection delay={0.2}>
              <div className="space-y-6">
                <div>
                  <Badge className="mb-4 bg-gold text-gold-foreground hover:bg-gold/90">
                    <Star className="mr-1 h-3 w-3" />
                    Disponible
                  </Badge>
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                    La Roqya à la lumière du Tawhid
                  </h1>
                  <p className="mt-2 text-lg text-gold font-medium">
                    Traité sur la Roqya
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    par Larbi Al-Khattab
                  </p>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  Aujourd&apos;hui largement répandue mais souvent déformée, la
                  Roqya suscite curiosité, questions… et parfois inquiétude. Ce
                  livre offre enfin une compréhension claire, authentique et
                  accessible de cette pratique spirituelle essentielle de
                  l&apos;Islam. En plongeant dans son histoire — des incantations
                  préislamiques jusqu&apos;à la purification opérée par le
                  Prophète ﷺ — l&apos;ouvrage dévoile comment la Roqya est
                  devenue un acte d&apos;adoration pur, fondé sur le Coran, la
                  Sunna et la confiance totale en Allah.
                </p>

                <ul className="space-y-2">
                  {features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm"
                    >
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <OrderForm />

                <div className="mt-4 text-center">
                  <Button asChild variant="outline" className="w-full h-11">
                    <Link href="/rendez-vous">
                      Prendre rendez-vous gratuitement
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Accroche / Why this book */}
      <section className="py-20 bg-accent/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Un chemin vers la guérison et la sérénité intérieure
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                Que vous soyez débutant, curieux, ou en quête de repères
                fiables, ce livre est un guide indispensable pour comprendre
                comment la Roqya apaise, protège et guérit — non par
                superstition, mais par un retour sincère vers le Créateur.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Un ouvrage éclairant, moderne et profondément spirituel, qui
                redonne à la Roqya sa véritable place.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Table of contents + Back cover mockup */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Back cover — left side */}
            <AnimatedSection>
              <div className="flex justify-center lg:sticky lg:top-32">
                <BackCoverMockup className="w-64 sm:w-72 md:w-80 lg:w-[22rem]" />
              </div>
            </AnimatedSection>

            {/* Sommaire — right side */}
            <AnimatedSection delay={0.2}>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Sommaire
              </h2>
              <p className="mt-4 mb-8 text-muted-foreground">
                Un guide complet et structuré, des incantations préislamiques
                jusqu&apos;aux méthodes de protection au quotidien.
              </p>
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
                Larbi Al-Khattab est un praticien reconnu et certifié en
                thérapie cognitive et comportementale. Détenteur d&apos;une Ijaza
                dans les 10 lectures du Saint Coran, il exerce la
                Roqya-thérapie depuis plusieurs années à Strasbourg et sa
                région. Ce livre est le fruit de son expérience de terrain et de
                sa volonté de transmettre un savoir authentique et accessible à
                tous.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
