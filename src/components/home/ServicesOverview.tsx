"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpenText, Brain } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SectionHeading } from "@/components/shared/SectionHeading";

const services = [
  {
    icon: BookOpenText,
    title: "Roqya-thérapie",
    description:
      "Accompagnement par les mots du Saint Coran. Combattre le mal-être d'origine occulte : sihr, mauvais oeil, mass, waswas, hasad.",
    href: "/roqya-thérapie",
    color: "bg-primary/10 text-primary",
    free: true,
  },
  {
    icon: Brain,
    title: "Thérapie Cognitive (TCC)",
    description:
      "Reconnaissance et modification des pensées et comportements problématiques. Une approche scientifique et éprouvée pour retrouver l'équilibre.",
    href: "/thérapie-cognitive",
    color: "bg-blue-50 text-blue-600",
    free: true,
  },
];

export function ServicesOverview() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Nos Services"
          subtitle="Des approches complémentaires pour votre bien-être physique, psychologique et spirituel."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Link href={service.href} className="group block h-full">
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/50">
                  <CardHeader>
                    <div
                      className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${service.color}`}
                    >
                      <service.icon className="h-6 w-6" />
                    </div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      {service.free && (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
                          Gratuit
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {service.description}
                    </CardDescription>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      En savoir plus <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
