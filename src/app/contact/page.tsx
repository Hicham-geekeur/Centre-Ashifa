import type { Metadata } from "next";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez le Centre Ashifa pour prendre rendez-vous ou pour toute question sur nos services de Roqya-thérapie à Strasbourg.",
  openGraph: {
    title: "Contact | Centre Ashifa",
    description:
      "Contactez-nous pour une séance de Roqya-thérapie à Strasbourg.",
  },
};

const contactMethods = [
  {
    icon: Phone,
    title: "Telephone",
    detail: siteConfig.phone.display,
    href: `tel:${siteConfig.phone.primary}`,
    description: "Du lundi au samedi",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    detail: siteConfig.phone.display,
    href: `https://wa.me/${siteConfig.whatsapp}`,
    description: "Reponse rapide",
  },
  {
    icon: MapPin,
    title: "Zone d'intervention",
    detail: "Strasbourg et sa région",
    href: null,
    description: "Séances à domicile uniquement",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-12 sm:pt-40 sm:pb-16 bg-gradient-to-b from-accent to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <Badge variant="outline" className="mb-4">
              Contact
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Contactez-nous
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Pour toute question ou pour prendre rendez-vous, n&apos;hesitez pas
              a nous contacter.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact methods + Form */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact methods */}
            <div className="space-y-4">
              {contactMethods.map((method) => (
                <AnimatedSection key={method.title}>
                  <div className="rounded-xl bg-accent/50 p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <method.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{method.title}</h3>
                        {method.href ? (
                          <a
                            href={method.href}
                            target={
                              method.href.startsWith("https") ? "_blank" : undefined
                            }
                            rel={
                              method.href.startsWith("https")
                                ? "noopener noreferrer"
                                : undefined
                            }
                            className="text-sm text-primary hover:underline"
                          >
                            {method.detail}
                          </a>
                        ) : (
                          <p className="text-sm text-primary">{method.detail}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <AnimatedSection delay={0.2}>
                <div className="rounded-xl border border-border bg-white p-6 sm:p-8 shadow-sm">
                  <h2 className="text-xl font-semibold mb-6">
                    Envoyez-nous un message
                  </h2>
                  <ContactForm />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
