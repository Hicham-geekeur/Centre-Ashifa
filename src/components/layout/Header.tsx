"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { mainNavItems } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Announcement banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground text-center text-sm py-2 px-4 font-medium">
        Toutes nos séances ont repris au cabinet et à distance
      </div>

      <header
        className={cn(
          "fixed top-8 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border"
            : "bg-transparent"
        )}
      >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-28 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo-centre-ashifa.svg"
              alt="Centre Ashifa - Roqya Thérapie"
              className="h-24 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {mainNavItems.map((item) =>
              "children" in item && item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary">
                    {item.label}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  <AnimatePresence>
                    {activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-full mt-1 w-56 rounded-xl bg-white p-2 shadow-lg ring-1 ring-border"
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block rounded-lg px-4 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-accent hover:text-primary"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${siteConfig.phone.primary}`}
              className="flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              <Phone className="h-4 w-4" />
              {siteConfig.phone.display}
            </a>
            <Button asChild>
              <Link href="/rendez-vous">Prendre rendez-vous</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-lg text-foreground"
            aria-label="Menu de navigation"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden border-t border-border bg-white"
          >
            <nav className="mx-auto max-w-7xl px-4 py-4 space-y-1">
              {mainNavItems.map((item) =>
                "children" in item && item.children ? (
                  <div key={item.label}>
                    <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {item.label}
                    </p>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setIsOpen(false)}
                        className="block rounded-lg px-6 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-primary"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block rounded-lg px-4 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-primary"
                  >
                    {item.label}
                  </Link>
                )
              )}
              <div className="pt-4 border-t border-border space-y-3">
                <a
                  href={`tel:${siteConfig.phone.primary}`}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground/70"
                >
                  <Phone className="h-4 w-4" />
                  {siteConfig.phone.display}
                </a>
                <Button asChild className="w-full">
                  <Link href="/rendez-vous" onClick={() => setIsOpen(false)}>
                    Prendre rendez-vous
                  </Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    </>
  );
}
