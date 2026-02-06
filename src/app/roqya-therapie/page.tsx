import type { Metadata } from "next";
import { Heart, Shield, Users, BookOpenText } from "lucide-react";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceProcess } from "@/components/services/ServiceProcess";
import { ServiceFAQ } from "@/components/services/ServiceFAQ";
import { DisclaimerBanner } from "@/components/shared/DisclaimerBanner";
import { AppointmentCTA } from "@/components/home/AppointmentCTA";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

export const metadata: Metadata = {
  title: "Roqya-Thérapie",
  description:
    "Séances de Roqya-thérapie à Strasbourg. Accompagnement par les mots du Saint Coran pour combattre le mal occulte : sihr, mauvais oeil, mass, waswas, hasad.",
  openGraph: {
    title: "Roqya-Thérapie | Centre Ashifa",
    description:
      "Séances de Roqya-thérapie à Strasbourg et sa région. Praticien certifié.",
  },
};

const processSteps = [
  {
    number: "1",
    title: "Prise de contact",
    description:
      "Appelez-nous pour décrire votre situation. Nous évaluons vos besoins et planifions un rendez-vous.",
  },
  {
    number: "2",
    title: "Évaluation initiale",
    description:
      "Entretien approfondi pour comprendre votre etat et déterminer l'approche thérapeutique adaptee.",
  },
  {
    number: "3",
    title: "Séance de Roqya",
    description:
      "Séance d'accompagnement par la lecture du Saint Coran, dans un cadre bienveillant et sécurisant.",
  },
  {
    number: "4",
    title: "Suivi personnalisé",
    description:
      "Accompagnement post-séance avec conseils de protection et programme de suivi adapte.",
  },
];

const faqItems = [
  {
    question: "Qu'est-ce que la Roqya-thérapie ?",
    answer:
      "La Roqya est une pratique islamique qui utilise la récitation du Saint Coran et des invocations prophetiques pour accompagner les personnes touchées par les maux d'origine occulte tels que le sihr (sorcellerie), le mauvais oeil, le mass (toucher des djinns), le waswas et le hasad (jalousie).",
  },
  {
    question: "Combien de séances sont nécessaires ?",
    answer:
      "Le nombre de séances varie selon la nature et la gravite du mal. Certains cas se résolvent en une seule séance, tandis que d'autres nécessitent un suivi sur plusieurs semaines. Votre praticien evaluera votre situation lors de la première consultation.",
  },
  {
    question: "Où se déroulent les séances ?",
    answer:
      "Toutes nos séances ont repris au cabinet et à distance. Contactez-nous pour plus d'informations.",
  },
  {
    question: "La Roqya est-elle compatible avec un traitement medical ?",
    answer:
      "La Roqya est une approche complémentaire. Elle né se substitue en aucun cas a un suivi medical. Nous encourageons nos consultants a maintenir leur suivi medical en parallele.",
  },
  {
    question: "Quel est le tarif d'une séance ?",
    answer:
      "Les tarifs varient selon le type de séance et la situation du patient. Contactez-nous pour obtenir plus d'informations sur nos tarifs.",
  },
];

const themes = [
  {
    icon: Shield,
    title: "Sihr (Sorcellerie)",
    description:
      "Prise en charge des cas de sorcellerie sous toutes ses formes : sihr de separation, sihr de blocage, sihr mange ou bu.",
  },
  {
    icon: Heart,
    title: "Mauvais oeil & Hasad",
    description:
      "Prise en charge du mauvais oeil et protection contre la jalousie (hasad) par les invocations coraniques.",
  },
  {
    icon: Users,
    title: "Mass (Toucher des djinns)",
    description:
      "Prise en charge des cas de possession ou de toucher par les djinns, avec une approche respectueuse et bienveillante.",
  },
  {
    icon: BookOpenText,
    title: "WasWas",
    description:
      "Accompagnement des personnes touchées par les pensées obsessionnelles et les chuchotements (waswas) qui perturbent la vie quotidienne et la pratique religieuse.",
  },
];

export default function RoqyaThérapiePage() {
  return (
    <>
      <ServiceHero
        iconName="BookOpenText"
        badge="Notre spécialité"
        title="Roqya-Thérapie"
        subtitle="Enseignement et pratique de la Roqya-thérapie afin de combattre le mal-être par les Mots du Saint Coran."
      />

      {/* About section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <AnimatedSection>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Une approche ancree dans la tradition prophetique
              </h2>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                L&apos;institut As-Shifa a pour role d&apos;exercer la Roqya et
                initier les futurs Raqy, selon les préceptes de l&apos;Islam.
                Face aux abus de charlatans aux pratiques malhonnetes et souvent
                dangereuses, le Centre Ashifa propose une approche thérapeutique
                authentique utilisant les paroles du Coran pour interagir avec
                l&apos;ame, permettant un équilibre stable et solide.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Themes treated */}
      <section className="py-20 bg-accent/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-3xl font-bold tracking-tight text-center sm:text-4xl mb-12">
              Les maux que nous prenons en charge
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {themes.map((theme) => (
              <AnimatedSection key={theme.title}>
                <div className="rounded-xl bg-white p-6 shadow-sm border border-border/50">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <theme.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{theme.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {theme.description}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
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
