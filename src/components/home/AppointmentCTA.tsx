import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, ArrowRight, Heart } from "lucide-react";
import { siteConfig } from "@/config/site";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

export function AppointmentCTA() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 px-8 py-16 text-center text-white sm:px-16 sm:py-20">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-64 w-64 rounded-full bg-white/5" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 h-48 w-48 rounded-full bg-white/5" />

            <div className="relative z-10">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Prêt à commencer votre parcours de bien-être ?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
                Toutes nos séances sont gratuites, au cabinet et à distance.
                Prenez rendez-vous dès maintenant.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="text-base px-8 h-12"
                >
                  <Link href="/rendez-vous">
                    Prendre rendez-vous
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-base px-8 h-12 border-white text-white bg-white/20 hover:bg-white/30 hover:text-white"
                >
                  <a href={`mailto:${siteConfig.email}`}>
                    <Mail className="mr-2 h-4 w-4" />
                    Nous contacter
                  </a>
                </Button>
              </div>

              <p className="mt-8 text-sm text-white/80">
                Vous souhaitez nous aider à rester gratuits ?{" "}
                <Link
                  href="/soutenir"
                  className="inline-flex items-center gap-1 font-semibold text-white underline underline-offset-4 hover:text-white/90"
                >
                  <Heart className="h-3.5 w-3.5" />
                  Faire un don ou adhérer
                </Link>
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
