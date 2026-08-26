import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home } from "lucide-react";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Merci pour votre soutien",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function SoutenirMerciPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  let kind: string | undefined;
  let interval: string | undefined;
  let amount: string | undefined;

  if (session_id) {
    try {
      const s = await getStripe().checkout.sessions.retrieve(session_id);
      kind = s.metadata?.kind;
      interval = s.metadata?.interval;
      amount = s.metadata?.amount;
    } catch (err) {
      console.error("Soutenir merci: retrieve failed", err);
    }
  }
  const isMembership = kind === "membership";

  return (
    <section className="min-h-screen flex items-center justify-center py-32">
      <div className="mx-auto max-w-lg px-4 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isMembership
            ? "Bienvenue parmi nos membres bienfaiteurs !"
            : "Merci pour votre don !"}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {amount ? `${amount} €${interval === "month" ? " par mois" : ""} — ` : ""}
          un email de confirmation vous a été envoyé. Grâce à vous, nos séances
          restent gratuites.
        </p>
        <div className="mt-10">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Retour à l&apos;accueil
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
