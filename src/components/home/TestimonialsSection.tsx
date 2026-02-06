"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";

const testimonials = [
  {
    id: 1,
    content:
      "Grâce au Centre Ashifa, j'ai retrouvé une paix intérieure que je pensais avoir perdue à jamais. L'approche bienveillante et professionnelle de M. DJEDADOUA m'a permis de comprendre et surmonter mes difficultés.",
    author: "Fatima R.",
    location: "Strasbourg",
  },
  {
    id: 2,
    content:
      "Après des mois de souffrance, les séances de Roqya-thérapie m'ont apporté un soulagement réel. Je recommande vivement le Centre Ashifa à toute personne en quête de bien-être.",
    author: "Mohamed K.",
    location: "Mulhouse",
  },
  {
    id: 3,
    content:
      "L'alliance entre la Roqya et la thérapie cognitive a fait toute la différence. Une approche complète et respectueuse qui m'a aidé à retrouver mon équilibre.",
    author: "Sarah L.",
    location: "Colmar",
  },
  {
    id: 4,
    content:
      "Je suis reconnaissant pour le travail exceptionnel du Centre Ashifa. Les séances à domicile sont un vrai plus pour les personnes qui né peuvent pas se déplacer.",
    author: "Ahmed B.",
    location: "Strasbourg",
  },
];

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const prev = () =>
    setCurrent(
      (c) => (c - 1 + testimonials.length) % testimonials.length
    );
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  return (
    <section className="py-20 sm:py-28 bg-accent/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Témoignages"
          subtitle="Ce que nos consultants disent de leur expérience au Centre Ashifa."
        />

        <div className="relative mx-auto max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={testimonials[current].id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <Quote className="mx-auto mb-6 h-10 w-10 text-primary/20" />
              <blockquote className="text-lg leading-relaxed text-foreground/80 sm:text-xl">
                &ldquo;{testimonials[current].content}&rdquo;
              </blockquote>
              <div className="mt-6">
                <p className="font-semibold">{testimonials[current].author}</p>
                <p className="text-sm text-muted-foreground">
                  {testimonials[current].location}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-accent"
              aria-label="Témoignage précédent"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === current
                      ? "w-8 bg-primary"
                      : "w-2 bg-primary/20"
                  }`}
                  aria-label={`Témoignage ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-accent"
              aria-label="Témoignage suivant"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
