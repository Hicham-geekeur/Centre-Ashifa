import { Award, BookOpen, Home } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

const signals = [
  {
    icon: Award,
    title: "Praticien certifié",
    description: "Certifié en thérapie cognitive et comportementale (TCC)",
  },
  {
    icon: BookOpen,
    title: "Ijaza Coranique",
    description: "Ijaza dans les 10 lectures du Saint Coran",
  },
  {
    icon: Home,
    title: "Séances à domicile",
    description: "Interventions à domicile sur Strasbourg et sa région",
  },
];

export function TrustSignals() {
  return (
    <section className="py-12 bg-accent/50 border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {signals.map((signal, index) => (
            <AnimatedSection key={signal.title} delay={index * 0.1}>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <signal.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{signal.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {signal.description}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
