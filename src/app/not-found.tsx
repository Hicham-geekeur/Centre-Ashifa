import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center py-32">
      <div className="mx-auto max-w-lg px-4 text-center">
        <p className="text-8xl font-bold text-primary/20">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">
          Page introuvable
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          La page que vous recherchez n&apos;existe pas ou a ete deplacee.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Retour a l&apos;accueil
          </Link>
        </Button>
      </div>
    </section>
  );
}
