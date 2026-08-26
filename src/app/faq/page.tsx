import type { Metadata } from "next";
import { HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { AppointmentCTA } from "@/components/home/AppointmentCTA";

export const metadata: Metadata = {
  title: "FAQ - Questions fréquentes",
  description:
    "Questions fréquentes sur la Roqya-thérapie et la TCC au Centre Ashifa à Strasbourg.",
  openGraph: {
    title: "FAQ | Centre Ashifa",
    description: "Retrouvez les réponses à vos questions sur nos services.",
  },
};

const faqCategories = [
  {
    title: "Général",
    items: [
      {
        question: "Qu'est-ce que le Centre Ashifa ?",
        answer:
          "Le Centre Ashifa est un centre spécialisé dans la Roqya-thérapie et la thérapie cognitive et comportementale (TCC). Nous accompagnons les personnes souffrantes du mal occulte à Strasbourg et sa région.",
      },
      {
        question: "Le Centre Ashifa est-il un établissement medical ?",
        answer:
          "Non, le Centre Ashifa n'est pas un établissement medical et né peut en aucun cas prescrire de médicaments. Nos thérapies sont complémentaires et né se substituent pas a un traitement medical.",
      },
      {
        question: "Où se déroulent les séances ?",
        answer:
          "Toutes nos séances ont repris au cabinet et à distance. Contactez-nous pour plus d'informations.",
      },
    ],
  },
  {
    title: "Roqya-thérapie",
    items: [
      {
        question: "Qu'est-ce que la Roqya ?",
        answer:
          "La Roqya est une pratique islamique qui utilise la récitation du Saint Coran et des invocations prophétiques pour accompagner les personnes touchées par les maux d'origine occulte (sihr, mauvais oeil, mass, waswas, hasad).",
      },
      {
        question: "Combien coûte une séance de Roqya ?",
        answer:
          "Toutes nos séances sont entièrement gratuites, au cabinet comme à distance. Le Centre Ashifa est porté par une association : si vous souhaitez nous aider, vous pouvez faire un don ou adhérer sur la page « Nous soutenir ».",
      },
      {
        question: "Combien de séances sont nécessaires ?",
        answer:
          "Le nombre de séances depend de la nature et de la gravite du mal. Certains cas se résolvent en une séance, d'autres nécessitent un suivi sur plusieurs semaines.",
      },
    ],
  },
  {
    title: "Rendez-vous",
    items: [
      {
        question: "Comment prendre rendez-vous ?",
        answer:
          "Vous pouvez prendre rendez-vous en ligne via notre page de réservation, par telephone au 07 68 84 84 83 ou par WhatsApp.",
      },
      {
        question: "Peut-on annuler un rendez-vous ?",
        answer:
          "Oui, nous vous demandons simplement de nous prévenir au moins 24 heures à l'avance en cas d'annulation ou de report.",
      },
      {
        question: "Les séances à distance sont-elles aussi efficaces ?",
        answer:
          "Oui, les séances à distance sont tout à fait efficaces. Elles se déroulent par telephone ou visioconference et permettent un accompagnement de qualité.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
      <section className="relative pt-32 pb-12 sm:pt-40 sm:pb-16 bg-gradient-to-b from-accent to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
            <Badge variant="outline" className="mb-4">
              FAQ
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Questions fréquentes
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Retrouvez les réponses aux questions les plus posées sur nos
              services.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-12">
          {faqCategories.map((category) => (
            <AnimatedSection key={category.title}>
              <h2 className="text-2xl font-bold mb-4">{category.title}</h2>
              <Accordion type="single" collapsible className="w-full">
                {category.items.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`${category.title}-${index}`}
                  >
                    <AccordionTrigger className="text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <AppointmentCTA />
    </>
  );
}
