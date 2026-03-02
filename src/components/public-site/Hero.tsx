"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { springs } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { AnimatedText } from "@/components/motion/AnimatedText";
import { FadeIn } from "@/components/motion/FadeIn";
import { HeroBackground } from "@/components/public-site/HeroBackground";
import { StatsBar } from "@/components/public-site/StatsBar";

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-4">
      <HeroBackground />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Headline */}
        <AnimatedText
          text="Custom Solutions for"
          as="h1"
          className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          staggerDelay={0.04}
        >
          <br />
          <span className="text-gradient-shimmer">Your Business</span>
        </AnimatedText>

        {/* Subtitle */}
        <FadeIn delay={0.4} className="mt-6">
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Agency-quality software, websites, dashboards, and tools.
            <br />
            Built fast, built right, built for your business.
          </p>
        </FadeIn>

        {/* CTA Buttons */}
        <FadeIn delay={0.6} className="mt-10">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <motion.div
              whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
              transition={springs.snappy}
            >
              <Link
                href="/intake"
                className="btn-shine neon-glow inline-flex h-12 items-center rounded-lg bg-primary px-8 text-base font-semibold text-primary-foreground transition-colors hover:bg-cyan-hover"
              >
                Start a Project
              </Link>
            </motion.div>

            <motion.div
              whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
              transition={springs.snappy}
            >
              <Link
                href="/portfolio"
                className="inline-flex h-12 items-center rounded-lg border border-white/10 bg-white/5 px-8 text-base font-semibold transition-colors hover:bg-white/10"
              >
                View Our Work
              </Link>
            </motion.div>
          </div>
        </FadeIn>
      </div>

      {/* Stats Bar */}
      <div className="relative z-10 mt-20 w-full pb-12">
        <StatsBar />
      </div>
    </section>
  );
}
