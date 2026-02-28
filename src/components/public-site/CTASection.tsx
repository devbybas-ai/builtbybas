"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { springs } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { FadeIn } from "@/components/motion/FadeIn";

interface CTASectionProps {
  heading?: string;
  description?: string;
}

export function CTASection({
  heading = "Ready to Build Something Great?",
  description = "Tell us about your project and get a custom proposal within 48 hours. No templates, no surprises — just a solution built for your business.",
}: CTASectionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="text-3xl font-bold sm:text-4xl">{heading}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{description}</p>
          <div className="mt-8">
            <motion.div
              whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
              transition={springs.snappy}
              className="inline-block"
            >
              <Link
                href="/intake"
                className="neon-glow inline-flex h-12 items-center rounded-lg bg-primary px-8 text-base font-semibold text-primary-foreground transition-colors hover:bg-cyan-hover"
              >
                Start a Project
              </Link>
            </motion.div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
