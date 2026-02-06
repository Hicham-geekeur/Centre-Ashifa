"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ArrowRight, Star } from "lucide-react";

export function BookPreviewSection() {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-gold/5" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <Badge className="mb-4 bg-gold text-gold-foreground hover:bg-gold/90">
                <Star className="mr-1 h-3 w-3" />
                Nouveau
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Bientôt disponible
              </h2>
              <p className="mt-2 text-lg text-muted-foreground">
                Le nouveau livre de Larbi DJEDADOUA
              </p>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              Découvrez le fruit de plusieurs années d&apos;expérience et de
              recherche dans le domaine de la Roqya-thérapie. Un ouvrage
              complet qui vous guidera dans la compréhension et la pratique de
              l&apos;accompagnement par les mots du Saint Coran.
            </p>

            <ul className="space-y-2">
              {[
                "Comprendre les fondements de la Roqya",
                "Les différents types de maux occultes",
                "Les méthodes de protection et d'accompagnement",
                "Témoignages et cas pratiques",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            <Button asChild size="lg">
              <Link href="/livre">
                <BookOpen className="mr-2 h-4 w-4" />
                Pré-commander le livre
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Book mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <motion.div
              className="relative"
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Book shape */}
              <div className="relative w-64 sm:w-72">
                {/* Book shadow */}
                <div className="absolute -bottom-4 left-4 right-4 h-8 rounded-full bg-black/10 blur-xl" />
                {/* Book cover */}
                <div className="relative rounded-lg bg-gradient-to-br from-primary to-primary/80 p-8 shadow-2xl aspect-[3/4]">
                  <div className="flex h-full flex-col items-center justify-center text-center text-white">
                    <div className="mb-4 h-px w-16 bg-gold" />
                    <BookOpen className="mb-4 h-10 w-10 text-gold" />
                    <h3 className="text-xl font-bold leading-tight">
                      La Roqya
                    </h3>
                    <p className="mt-1 text-sm text-white/70">Thérapie</p>
                    <div className="mt-4 h-px w-16 bg-gold" />
                    <p className="mt-4 text-xs text-white/50">
                      Larbi DJEDADOUA
                    </p>
                  </div>
                  {/* Book spine effect */}
                  <div className="absolute left-0 top-0 bottom-0 w-3 rounded-l-lg bg-primary/60" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
