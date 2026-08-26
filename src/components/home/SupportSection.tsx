import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeartHandshake, Heart, Users, ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

const highlights = [
  {
    icon: Heart,
    title: "Un don, ponctuel ou mensuel",
    text: "À partir de 1 €, librement, pour financer l'accueil gratuit des personnes accompagnées.",
  },
  {
    icon: Users,
    title: "Un soutien mensuel",
    text: "5, 10 ou 20 € par mois, modifiable ou résiliable à tout moment.",
  },
];

export function SupportSection() {
  return (
    <section className="py-20 sm:py-24 bg-accent/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Texte */}
            <div>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <HeartHandshake className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Nos séances sont gratuites.{" "}
                <span className="text-primary">Grâce à vous.</span>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Le Centre Ashifa est porté par une association à but non
                lucratif. Aucune séance n&apos;est facturée : ce sont vos dons
                qui permettent d&apos;accueillir celles et ceux qui en ont
                besoin.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  size="lg"
                  className="animate-donation-glow text-base px-8 h-12"
                >
                  <Link href="/soutenir">
                    <Heart className="mr-2 h-4 w-4 animate-heartbeat fill-current" />
                    Faire un don
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-base px-8 h-12"
                >
                  <Link href="/soutenir?onglet=mensuel">
                    Soutenir chaque mois
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Cartes */}
            <div className="grid grid-cols-1 gap-4">
              {highlights.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-border bg-white p-6 shadow-sm"
                >
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                        {text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <p className="px-2 text-xs text-muted-foreground">
                Paiement sécurisé par Stripe. Association ASHIFA BIEN-ÊTRE ET
                ÉQUILIBRE, Bischheim.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
