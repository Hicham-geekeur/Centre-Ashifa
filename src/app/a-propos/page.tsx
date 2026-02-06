import type { Metadata } from "next";
import { Award, BookOpen, GraduationCap, Heart } from "lucide-react";
import { siteConfig } from "@/config/site";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { AppointmentCTA } from "@/components/home/AppointmentCTA";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "À propos - Larbi DJEDADOUA",
  description:
    "Découvrez le parcours de Larbi DJEDADOUA, praticien certifié en thérapie cognitive et comportementale et spécialiste en Roqya-thérapie à Strasbourg.",
  openGraph: {
    title: "À propos de Larbi DJEDADOUA | Centre Ashifa",
    description:
      "Praticien certifié en TCC et spécialiste en Roqya-thérapie à Strasbourg.",
  },
};

const credentials = [
  {
    icon: GraduationCap,
    title: "Certification TCC",
    description:
      "Praticien certifié en thérapie cognitive et comportementale, une approche scientifiquement validée.",
  },
  {
    icon: BookOpen,
    title: "Ijaza Coranique",
    description:
      "Détenteur d'une Ijaza dans les 10 lectures du Saint Coran, garantissant l'authenticité de la pratique.",
  },
  {
    icon: Heart,
    title: "Approche bienveillante",
    description:
      "Un accompagnement humain et respectueux, adapté à chaque personne et à sa situation unique.",
  },
  {
    icon: Award,
    title: "Expérience reconnue",
    description:
      "Plusieurs années d'expérience dans l'accompagnement des personnes souffrantes du mal occulte.",
  },
];

const values = [
  {
    title: "Authenticité",
    description:
      "Nos pratiques sont strictement conformes aux enseignements du Coran et de la Sunna, sans aucun charlatanisme.",
  },
  {
    title: "Professionnalisme",
    description:
      "Chaque consultant bénéficie d'une approche structurée, alliant savoir et tradition prophétique.",
  },
  {
    title: "Bienveillance",
    description:
      "Nous accueillons chaque personne avec compassion et sans jugement, dans un cadre sécurisant.",
  },
  {
    title: "Intégrité",
    description:
      "Transparence totale sur nos méthodes, nos limites et notre cadre d'intervention.",
  },
];

export default function AProposPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 bg-gradient-to-b from-accent to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <Badge variant="outline" className="mb-4">
                Votre praticien
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                {siteConfig.practitioner.name}
              </h1>
              <p className="mt-2 text-xl text-primary font-medium">
                {siteConfig.practitioner.title}
              </p>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Praticien reconnu et certifié, Larbi DJEDADOUA consacre sa vie à
                l&apos;accompagnement des personnes en souffrance. Son parcours
                unique allie une formation approfondie en thérapie cognitive et
                comportementale à une maîtrise des sciences coraniques,
                permettant une prise en charge globale et bienveillante.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Fondé avec la conviction que chaque personne mérite un
                accompagnement de qualité, le Centre Ashifa est né de la volonté
                de proposer une alternative sérieuse et éthique face aux
                pratiques douteuses trop souvent rencontrées dans ce domaine.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="rounded-2xl bg-gradient-to-br from-gold/10 via-white to-gold/5 border-2 border-gold/30 p-10 shadow-lg">
                <div className="text-center space-y-5">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold/10">
                    <Award className="h-10 w-10 text-gold" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gold">Certificat de Formation</p>
                    <h3 className="text-2xl font-bold text-foreground leading-tight">
                      Praticien en Thérapie Cognitive et Comportementale
                    </h3>
                  </div>
                  <div className="h-px w-24 mx-auto bg-gold/40" />
                  <p className="text-xl font-semibold text-primary">Larbi DJEDADOUA</p>
                  <p className="text-sm text-muted-foreground">Délivré le 27 Janvier 2022</p>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <div className="rounded-full bg-primary/10 px-4 py-1.5">
                      <span className="text-sm font-medium text-primary">Spiri&apos;Vie</span>
                    </div>
                    <div className="rounded-full bg-gold/10 px-4 py-1.5">
                      <span className="text-sm font-medium text-gold">IPHM Approved</span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-3xl font-bold tracking-tight text-center sm:text-4xl mb-12">
              Qualifications et expertise
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {credentials.map((cred) => (
              <AnimatedSection key={cred.title}>
                <div className="flex gap-4 rounded-xl bg-accent/50 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <cred.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{cred.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {cred.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-accent/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-3xl font-bold tracking-tight text-center sm:text-4xl mb-4">
              Nos valeurs
            </h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
              Des principes qui guident chacune de nos interventions.
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((value) => (
              <AnimatedSection key={value.title}>
                <div className="rounded-xl bg-white p-6 shadow-sm border border-border/50">
                  <h3 className="text-lg font-semibold">{value.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <AppointmentCTA />
    </>
  );
}
