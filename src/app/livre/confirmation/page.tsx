import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Home } from "lucide-react";

export const metadata: Metadata = {
  title: "Commande confirmee",
  description: "Votre pré-commande a ete enregistree avec succes.",
  robots: { index: false, follow: false },
};

export default function ConfirmationPage() {
  return (
    <section className="min-h-screen flex items-center justify-center py-32">
      <div className="mx-auto max-w-lg px-4 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Merci pour votre commande !
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Votre pré-commande a ete enregistree avec succes. Vous recevrez un
          email de confirmation avec les details de votre commande.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Le livre vous sera expedie des sa parution.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Retour a l&apos;accueil
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/rendez-vous">
              Prendre rendez-vous
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
