"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Award } from "lucide-react";
import { siteConfig } from "@/config/site";

export function PractitionerSection() {
  return (
    <section className="py-20 sm:py-28 bg-accent/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Diploma showcase */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="rounded-2xl bg-gradient-to-br from-gold/10 via-white to-gold/5 border-2 border-gold/30 p-8 shadow-lg">
              <div className="text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
                  <Award className="h-8 w-8 text-gold" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gold">Certificat de Formation</p>
                  <h3 className="text-xl font-bold text-foreground">Praticien en Thérapie Cognitive et Comportementale</h3>
                </div>
                <div className="h-px w-20 mx-auto bg-gold/40" />
                <p className="text-lg font-semibold text-primary">Larbi DJEDADOUA</p>
                <p className="text-sm text-muted-foreground">Délivré le 27 Janvier 2022</p>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <div className="rounded-full bg-primary/10 px-3 py-1">
                    <span className="text-xs font-medium text-primary">Spiri&apos;Vie</span>
                  </div>
                  <div className="rounded-full bg-gold/10 px-3 py-1">
                    <span className="text-xs font-medium text-gold">IPHM Approved</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-xl bg-gold/20 -z-10" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <Badge variant="outline" className="mb-4">
                Votre praticien
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {siteConfig.practitioner.name}
              </h2>
              <p className="mt-2 text-lg text-primary font-medium">
                {siteConfig.practitioner.title}
              </p>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              Praticien reconnu et certifié, Larbi DJEDADOUA accompagne depuis
              plusieurs années les personnes souffrantes du mal occulte. Son
              approche allie les enseignements du Saint Coran a la thérapie
              cognitive et comportementale pour offrir un accompagnement complet
              et bienveillant.
            </p>

            <ul className="space-y-3">
              {siteConfig.practitioner.credentials.map((credential) => (
                <li
                  key={credential}
                  className="flex items-center gap-3 text-sm"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  {credential}
                </li>
              ))}
            </ul>

            <Button asChild variant="outline">
              <Link href="/a-propos">
                En savoir plus
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
