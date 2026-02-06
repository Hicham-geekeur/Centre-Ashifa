"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { BookOpenText, Brain, Sparkles } from "lucide-react";
import { type ReactNode } from "react";

const iconMap = {
  BookOpenText,
  Brain,
  Sparkles,
} as const;

interface ServiceHeroProps {
  iconName: keyof typeof iconMap;
  badge: string;
  title: string;
  subtitle: string;
}

export function ServiceHero({
  iconName,
  badge,
  title,
  subtitle,
}: ServiceHeroProps) {
  const Icon = iconMap[iconName];

  return (
    <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 bg-gradient-to-b from-accent to-background overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage:
          "linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Icon className="h-8 w-8 text-primary" />
          </div>
          <Badge variant="outline" className="mb-4">
            {badge}
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {subtitle}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
