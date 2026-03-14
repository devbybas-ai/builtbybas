"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { springs } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
];

export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const toggleMenu = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className="fixed top-0 z-40 w-full border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <nav
          className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 md:h-16 lg:px-8"
          aria-label="Main navigation"
        >
          {/* Desktop nav — links left, CTA right */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  if (link.href === "/" && pathname === "/") {
                    e.preventDefault();
                    window.dispatchEvent(new CustomEvent("concierge-reset"));
                  }
                }}
                className={`text-sm transition-colors hover:text-foreground ${
                  isActive(link.href)
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link
            href="/intake"
            className="btn-shine neon-glow hidden items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-cyan-hover md:inline-flex"
          >
            Start a Project
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="relative z-50 inline-flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:hidden"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </nav>
      </header>

      {/* Full-screen mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-background/98 backdrop-blur-2xl" />

            {/* Content */}
            <nav
              className="relative flex h-full flex-col justify-between px-6 pb-10 pt-24"
              aria-label="Mobile navigation"
            >
              {/* Navigation links */}
              <div className="flex flex-col gap-2">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={
                      shouldReduceMotion
                        ? { opacity: 1 }
                        : { opacity: 0, x: -24 }
                    }
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{
                      ...springs.snappy,
                      delay: shouldReduceMotion ? 0 : 0.05 + i * 0.07,
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={(e) => {
                        setMobileOpen(false);
                        if (link.href === "/" && pathname === "/") {
                          e.preventDefault();
                          window.dispatchEvent(new CustomEvent("concierge-reset"));
                        }
                      }}
                      className={`group flex items-center justify-between rounded-xl px-4 py-4 text-2xl font-medium transition-all ${
                        isActive(link.href)
                          ? "bg-white/10 text-foreground"
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                      }`}
                    >
                      <span>{link.label}</span>
                      {isActive(link.href) && (
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Bottom section: CTA + brand */}
              <motion.div
                className="mb-12 flex flex-col gap-6"
                initial={
                  shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{
                  ...springs.smooth,
                  delay: shouldReduceMotion ? 0 : 0.3,
                }}
              >
                {/* CTA button */}
                <Link
                  href="/intake"
                  onClick={() => setMobileOpen(false)}
                  className="btn-shine neon-glow flex h-14 items-center justify-center gap-3 rounded-xl bg-primary text-lg font-semibold text-primary-foreground transition-all hover:bg-cyan-hover"
                >
                  Start a Project
                  <ArrowRight className="h-5 w-5" />
                </Link>

                {/* Brand footer */}
                <div className="flex items-center justify-between border-t border-primary/30 pt-6">
                  <p className="text-sm text-foreground">
                    The best way to predict the future is to create it
                  </p>
                  <span className="text-xs font-medium text-foreground">
                    <span className="text-primary">Built</span>By<span className="text-primary">Bas</span>
                  </span>
                </div>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
