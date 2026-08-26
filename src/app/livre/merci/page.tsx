import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, ArrowRight, Home } from "lucide-react";
import { getStripe } from "@/lib/stripe";
import { getOrder } from "@/lib/orders";

export const metadata: Metadata = {
  title: "Commande confirmée",
  description: "Votre commande a été enregistrée avec succès.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

async function loadOrder(sessionId?: string) {
  if (!sessionId) return { ref: null, paid: false };
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    const ref = session.client_reference_id;
    const order = ref ? getOrder(ref) : null;
    const paid = session.payment_status === "paid" || order?.status === "paid";
    return { ref, paid };
  } catch (err) {
    console.error("Merci page: session retrieve failed", err);
    return { ref: null, paid: false };
  }
}

export default async function MerciPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const { ref, paid } = await loadOrder(session_id);

  return (
    <section className="min-h-screen flex items-center justify-center py-32">
      <div className="mx-auto max-w-lg px-4 text-center">
        <div
          className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${paid ? "bg-green-100" : "bg-amber-100"}`}
        >
          {paid ? (
            <CheckCircle className="h-10 w-10 text-green-600" />
          ) : (
            <Clock className="h-10 w-10 text-amber-600" />
          )}
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          {paid
            ? "Merci pour votre commande !"
            : "Paiement en cours de confirmation"}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {paid
            ? "Votre commande a été enregistrée avec succès. Le livre vous sera expédié dans les meilleurs délais."
            : "Votre paiement est en cours de validation. Vous recevrez un email de confirmation dès qu'il sera confirmé."}
        </p>
        {ref && (
          <p className="mt-2 text-sm text-muted-foreground">
            Référence : <span className="font-mono font-medium">{ref}</span>
          </p>
        )}

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Retour à l&apos;accueil
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
