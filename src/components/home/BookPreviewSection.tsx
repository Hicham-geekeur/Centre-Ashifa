"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, ShieldCheck, BookOpenText, Sparkles } from "lucide-react";
import { BookMockup3D } from "@/components/book/BookMockup";

export function BookPreviewSection() {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-gold/5" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/30 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-gold text-gold-foreground hover:bg-gold/90">
            <Star className="mr-1 h-3 w-3" />
            Nouveau
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Un ouvrage essentiel sur la Roqya
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Disponible — Commander maintenant
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Single 3D mockup */}
          <div className="flex justify-center">
            <BookMockup3D className="w-56 sm:w-64 md:w-72" />
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                La Roqya à la lumière du Tawhid
              </h3>
              <p className="mt-1 text-sm font-medium text-gold">
                Traité sur la Roqya — Larbi Al-Khattab
              </p>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              Aujourd&apos;hui largement répandue mais souvent déformée, la Roqya
              suscite curiosité, questions… et parfois inquiétude. Ce livre offre
              enfin une compréhension claire, authentique et accessible de cette
              pratique spirituelle essentielle de l&apos;Islam.
            </p>

            <ul className="space-y-2.5">
              {[
                { icon: BookOpenText, text: "Les bases spirituelles de la Roqya, expliquées simplement" },
                { icon: ShieldCheck, text: "Les erreurs à éviter et les pratiques occultes à fuir" },
                { icon: Sparkles, text: "Les méthodes légiférées, approuvées par les savants" },
                { icon: Star, text: "Les critères pour reconnaître un praticien fiable" },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-3 text-sm">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                    <item.icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  {item.text}
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <Button asChild size="lg">
                <Link href="/livre">
                  Commander le livre
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
