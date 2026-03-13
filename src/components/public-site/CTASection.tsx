"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { springs, viewportRepeat } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface CTASectionProps {
  heading?: string;
  description?: string;
}

export function CTASection({
  heading = "Tell Us How Your Business Works. We'll Build the System Around It.",
  description = "Share your project details and get a custom proposal within 48 hours. A solution designed around how your business actually operates.",
}: CTASectionProps) {
  const shouldReduceMotion = useReducedMotion();

  const content = (
    <div className="group relative">
      <div className="glass-card relative px-5 py-8 text-center transition-all duration-700 hover:border-primary/20 hover:shadow-[0_0_60px_-10px] hover:shadow-primary/10 sm:px-16 sm:py-12">
        <h2 className="text-3xl font-bold sm:text-4xl">{heading}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          {description}
        </p>

        <div className="mt-8">
          {shouldReduceMotion ? (
            <Link
              href="/intake"
              className="btn-shine neon-glow inline-flex h-12 items-center rounded-lg bg-primary px-8 text-base font-semibold text-primary-foreground transition-all hover:bg-cyan-hover"
            >
              Start a Project
            </Link>
          ) : (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={springs.snappy}
              className="inline-block"
            >
              <Link
                href="/intake"
                className="btn-shine neon-glow inline-flex h-12 items-center rounded-lg bg-primary px-8 text-base font-semibold text-primary-foreground transition-all hover:bg-cyan-hover"
              >
                Start a Project
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );

  if (shouldReduceMotion) {
    return (
      <section className="relative py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {content}
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportRepeat}
          transition={springs.smooth}
        >
          {content}
        </motion.div>
      </div>
    </section>
  );
}
