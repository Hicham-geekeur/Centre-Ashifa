"use client";

import { useRef, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import Link from "next/link";
import { DonationPill } from "@/components/support/DonationPill";
import type { DonationStats } from "@/lib/donation-stats";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Shield,
  MapPin,
  Award,
  ChevronDown,
  BookOpen,
  Star,
  Heart,
} from "lucide-react";

/* ─── Dot Grid Pattern ─── */
function DotGridPattern() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      style={{ opacity: 0.08 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="dot-grid"
          x="0"
          y="0"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="20" cy="20" r="1.2" fill="oklch(0.45 0.12 165)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dot-grid)" />
    </svg>
  );
}

/* ─── Gradient Mesh Blobs ─── */
function GradientMesh() {
  return (
    <>
      {/* Top-right green glow */}
      <motion.div
        className="absolute -top-32 -right-32 h-[600px] w-[600px] rounded-full blur-[120px]"
        style={{
          background: "radial-gradient(circle, oklch(0.45 0.12 165 / 0.10) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Bottom-left gold glow */}
      <motion.div
        className="absolute -bottom-40 -left-20 h-[500px] w-[500px] rounded-full blur-[100px]"
        style={{
          background: "radial-gradient(circle, oklch(0.72 0.12 75 / 0.07) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
      {/* Center subtle glow */}
      <motion.div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[400px] w-[800px] rounded-full blur-[140px]"
        style={{
          background: "radial-gradient(ellipse, oklch(0.45 0.12 165 / 0.05) 0%, transparent 70%)",
        }}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </>
  );
}

/* ─── Flowing Wave Lines ─── */
function FlowingWaves() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute bottom-0 left-0 w-full"
        style={{ height: "80%" }}
        viewBox="0 0 1440 600"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Wave 1 - Top, bold green */}
        <motion.path
          d="M0,200 C180,100 360,350 540,200 C720,50 900,300 1080,180 C1200,120 1320,280 1440,160 L1440,600 L0,600 Z"
          fill="oklch(0.45 0.12 165 / 0.025)"
          stroke="oklch(0.45 0.12 165 / 0.12)"
          strokeWidth="2.5"
          animate={{
            d: [
              "M0,200 C180,100 360,350 540,200 C720,50 900,300 1080,180 C1200,120 1320,280 1440,160 L1440,600 L0,600 Z",
              "M0,160 C180,300 360,80 540,250 C720,350 900,100 1080,260 C1200,320 1320,140 1440,220 L1440,600 L0,600 Z",
              "M0,200 C180,100 360,350 540,200 C720,50 900,300 1080,180 C1200,120 1320,280 1440,160 L1440,600 L0,600 Z",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Wave 2 - Middle, gold */}
        <motion.path
          d="M0,320 C240,220 480,420 720,300 C960,180 1200,380 1440,280 L1440,600 L0,600 Z"
          fill="oklch(0.72 0.12 75 / 0.02)"
          stroke="oklch(0.72 0.12 75 / 0.10)"
          strokeWidth="2"
          animate={{
            d: [
              "M0,320 C240,220 480,420 720,300 C960,180 1200,380 1440,280 L1440,600 L0,600 Z",
              "M0,280 C240,400 480,200 720,340 C960,420 1200,220 1440,340 L1440,600 L0,600 Z",
              "M0,320 C240,220 480,420 720,300 C960,180 1200,380 1440,280 L1440,600 L0,600 Z",
            ],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
        {/* Wave 3 - Lower, green filled */}
        <motion.path
          d="M0,400 C300,340 600,480 900,380 C1100,320 1300,430 1440,390 L1440,600 L0,600 Z"
          fill="oklch(0.45 0.12 165 / 0.03)"
          stroke="oklch(0.45 0.12 165 / 0.08)"
          strokeWidth="1.5"
          animate={{
            d: [
              "M0,400 C300,340 600,480 900,380 C1100,320 1300,430 1440,390 L1440,600 L0,600 Z",
              "M0,380 C300,460 600,340 900,420 C1100,480 1300,360 1440,420 L1440,600 L0,600 Z",
              "M0,400 C300,340 600,480 900,380 C1100,320 1300,430 1440,390 L1440,600 L0,600 Z",
            ],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
        {/* Wave 4 - Bottom, subtle gold fill */}
        <motion.path
          d="M0,480 C360,440 720,530 1080,460 C1200,440 1360,500 1440,470 L1440,600 L0,600 Z"
          fill="oklch(0.72 0.12 75 / 0.025)"
          stroke="oklch(0.72 0.12 75 / 0.06)"
          strokeWidth="1"
          animate={{
            d: [
              "M0,480 C360,440 720,530 1080,460 C1200,440 1360,500 1440,470 L1440,600 L0,600 Z",
              "M0,460 C360,520 720,430 1080,490 C1200,510 1360,450 1440,490 L1440,600 L0,600 Z",
              "M0,480 C360,440 720,530 1080,460 C1200,440 1360,500 1440,470 L1440,600 L0,600 Z",
            ],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        />
      </svg>
    </div>
  );
}

/* ─── Floating Crescents ─── */
function FloatingCrescents() {
  const crescents = [
    { x: "12%", y: "20%", size: 60, rotation: -30, duration: 20, delay: 0 },
    { x: "85%", y: "15%", size: 40, rotation: 45, duration: 25, delay: 3 },
    { x: "75%", y: "70%", size: 50, rotation: -60, duration: 18, delay: 1 },
    { x: "8%", y: "75%", size: 35, rotation: 20, duration: 22, delay: 5 },
  ];

  return (
    <>
      {crescents.map((c, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: c.x, top: c.y }}
          animate={{
            y: [0, -15, 0],
            rotate: [c.rotation, c.rotation + 10, c.rotation],
            opacity: [0.04, 0.08, 0.04],
          }}
          transition={{
            duration: c.duration,
            delay: c.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg width={c.size} height={c.size} viewBox="0 0 100 100">
            <path
              d="M50,10 A40,40 0 1,1 50,90 A28,28 0 1,0 50,10"
              fill="none"
              stroke="oklch(0.72 0.12 75)"
              strokeWidth="1.5"
            />
          </svg>
        </motion.div>
      ))}
    </>
  );
}

/* ─── Word-by-word text animation ─── */
function AnimatedWord({
  word,
  delay,
  className,
}: {
  word: string;
  delay: number;
  className?: string;
}) {
  return (
    <motion.span
      className={`inline-block ${className || ""}`}
      initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      {word}
    </motion.span>
  );
}

/* ─── Animated gold line separator ─── */
function GoldSeparator({ delay }: { delay: number }) {
  return (
    <motion.div
      className="mx-auto mt-6 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent"
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 120, opacity: 1 }}
      transition={{ duration: 1, delay, ease: "easeOut" }}
    />
  );
}

/* ─── Trust Badge ─── */
function TrustBadge({
  icon: Icon,
  label,
  delay,
}: {
  icon: typeof Award;
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      className="flex items-center gap-2.5 text-sm text-muted-foreground"
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        type: "spring",
        stiffness: 200,
        damping: 15,
      }}
    >
      <motion.div
        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20"
        whileHover={{ scale: 1.15, backgroundColor: "oklch(0.45 0.12 165 / 0.2)" }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Icon className="h-4 w-4 text-primary" />
      </motion.div>
      {label}
    </motion.div>
  );
}

/* ─── Main Hero ─── */
export function HeroSection({ stats }: { stats?: DonationStats | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const smoothX = useSpring(mouseX, { stiffness: 30, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 30, damping: 25 });

  const bgX = useTransform(smoothX, [0, 1], [-12, 12]);
  const bgY = useTransform(smoothY, [0, 1], [-12, 12]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    },
    [mouseX, mouseY]
  );

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-accent via-background to-background"
    >
      {/* ─── Background Layers ─── */}
      <motion.div className="absolute inset-0" style={{ x: bgX, y: bgY }}>
        <GradientMesh />
        <DotGridPattern />
        <FloatingCrescents />
      </motion.div>

      <FlowingWaves />

      {/* Aurora gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-gold/[0.03]" />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />

      {/* ─── Content ─── */}
      <motion.div
        className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="text-center">
          {/* Badge + compteur de dons compact, visibles dès l'ouverture */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Badge
              variant="secondary"
              className="px-5 py-2 text-sm font-medium shadow-sm backdrop-blur-sm border border-border/50"
            >
              <motion.span
                className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [1, 0.6, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              Séances gratuites - Cabinet et à distance
            </Badge>
          </motion.div>
          {stats && <DonationPill stats={stats} delay={0.3} />}
          </div>

          {/* Main heading - word by word reveal */}
          <h1 className="font-heading italic text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl leading-[1.1]">
            <div className="overflow-hidden pb-2">
              <AnimatedWord word="Bien-être" delay={0.2} />
              <span className="inline-block w-4" />
              <AnimatedWord word="par" delay={0.35} />
              <span className="inline-block w-4" />
              <AnimatedWord word="les" delay={0.5} />
            </div>
            <div className="overflow-hidden pb-2">
              <AnimatedWord
                word="Mots"
                delay={0.65}
                className="bg-gradient-to-r from-primary via-primary to-emerald-600 bg-clip-text text-transparent"
              />
              <span className="inline-block w-4" />
              <AnimatedWord
                word="du"
                delay={0.8}
                className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent"
              />
              <span className="inline-block w-4" />
              <AnimatedWord
                word="Saint"
                delay={0.95}
                className="bg-gradient-to-r from-emerald-600 via-primary to-primary bg-clip-text text-transparent"
              />
              <span className="inline-block w-4" />
              <AnimatedWord
                word="Coran"
                delay={1.1}
                className="bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent"
              />
            </div>
          </h1>

          {/* Gold separator line */}
          <GoldSeparator delay={1.3} />

          {/* Subtitle */}
          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
          >
            Enseignement et pratique de la Roqya-thérapie et thérapie cognitive
            comportementale (TCC) à Strasbourg et sa région.
          </motion.p>

          {/* Book pre-order highlight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5, ease: "easeOut" }}
            className="mt-8"
          >
            <Link href="/livre" className="group inline-flex items-center gap-4 rounded-2xl bg-gold/10 border border-gold/30 px-4 py-3 transition-all hover:bg-gold/20 hover:border-gold/50 hover:shadow-lg hover:shadow-gold/10">
              <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-sm shadow-md ring-1 ring-black/10">
                <Image
                  src="/images/couverture-livre.png"
                  alt="La Roqya à la lumière du Tawhid"
                  width={80}
                  height={118}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5 text-xs text-gold font-semibold">
                  <Star className="h-3 w-3" />
                  Nouveau
                </div>
                <span className="text-sm font-medium text-foreground">
                  La Roqya à la lumière du Tawhid
                </span>
              </div>
              <ArrowRight className="h-4 w-4 text-gold shrink-0 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.7, ease: "easeOut" }}
          >
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                asChild
                size="lg"
                className="text-base px-8 h-13 shadow-lg shadow-primary/25 relative overflow-hidden group"
              >
                <Link href="/rendez-vous">
                  <span className="relative z-10 flex items-center">
                    Prendre rendez-vous
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                    initial={{ x: "-200%" }}
                    whileHover={{ x: "200%" }}
                    transition={{ duration: 0.6 }}
                  />
                </Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-base px-8 h-13 backdrop-blur-sm bg-white/50"
              >
                <Link href="/livre">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Acheter le livre
                </Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                asChild
                variant="outline"
                size="lg"
                className="animate-donation-glow text-base px-8 h-13 border-primary/50 bg-primary/10 text-primary backdrop-blur-sm hover:bg-primary/20 hover:text-primary"
              >
                <Link href="/soutenir">
                  <Heart className="mr-2 h-4 w-4 animate-heartbeat fill-current" />
                  Faire un don
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Trust badges - spring animation */}
          <motion.div
            className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-12"
          >
            <TrustBadge
              icon={Award}
              label="Praticien certifié TCC"
              delay={1.9}
            />
            <TrustBadge
              icon={Shield}
              label="Approche bienveillante"
              delay={2.1}
            />
            <TrustBadge
              icon={MapPin}
              label="Strasbourg et région"
              delay={2.3}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
      >
        <motion.span className="text-xs text-muted-foreground/50 tracking-widest uppercase">
          Découvrir
        </motion.span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
