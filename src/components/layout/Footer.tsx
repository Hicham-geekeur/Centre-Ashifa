import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { siteConfig } from "@/config/site";
import { footerNavItems } from "@/config/navigation";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-foreground text-white/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo-centre-ashifa.svg"
                alt="Centre Ashifa"
                className="h-20 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-sm leading-relaxed text-white/60">
              Enseignement et pratique de la Roqya-thérapie afin de combattre
              le mal-être par les Mots du Saint Coran.
            </p>
            <div className="space-y-2 text-sm">
              <a
                href={`tel:${siteConfig.phone.primary}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4 text-primary" />
                {siteConfig.phone.display}
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                {siteConfig.location.city}, {siteConfig.location.région}
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Services
            </h3>
            <ul className="space-y-2.5">
              {footerNavItems.services.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informations */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Informations
            </h3>
            <ul className="space-y-2.5">
              {footerNavItems.informations.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Legal
            </h3>
            <ul className="space-y-2.5">
              {footerNavItems.legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        {/* Disclaimer */}
        <div className="rounded-lg bg-white/5 p-4 mb-8">
          <p className="text-xs text-white/50 leading-relaxed">
            <strong className="text-white/70">Avertissement :</strong> Le Centre
            Ashifa n&apos;est pas un établissement medical et né peut en aucun
            cas prescrire de médicaments ou d&apos;ordonnances. Le centre n&apos;est ni un
            établissement d&apos;enseignement religieux ni un lieu de culte, mais un
            lieu d&apos;accueil pour les personnes souffrantes du mal occulte.
          </p>
        </div>

        {/* Copyright */}
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-white/40 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Centre Ashifa. Tous droits reserves.</p>
          <p>Séances au cabinet et à distance - Strasbourg et sa région</p>
        </div>
      </div>
    </footer>
  );
}
