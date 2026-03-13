"use client";

import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { AnimatedText } from "@/components/motion/AnimatedText";
import { FadeIn } from "@/components/motion/FadeIn";
import { HeroBackground } from "@/components/public-site/HeroBackground";
import { StatsBar } from "@/components/public-site/StatsBar";
import { ScrollTeaser } from "@/components/public-site/ScrollTeaser";

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative flex h-[100svh] flex-col items-center justify-between overflow-hidden px-5 pb-4 pt-16 sm:px-6 sm:pb-6 md:pt-20">
      <HeroBackground />

      {/* Spacer to push content down from nav */}
      <div className="flex-1" />

      {/* Main content */}
      <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
        {/* Headline */}
        <AnimatedText
          text="Software That Works Like"
          as="h1"
          className="text-[2.25rem] font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          staggerDelay={0.04}
        >
          <br />
          <span className="text-gradient-shimmer-green">Your Business</span>{" "}
          <span className="text-gradient-shimmer">Does</span>
        </AnimatedText>

        {/* Subtitle */}
        <FadeIn delay={0.2} className="mt-4 sm:mt-10">
          <p className="mx-auto max-w-sm text-[0.95rem] leading-relaxed text-muted-foreground sm:max-w-2xl sm:text-xl">
            Agency-quality software, websites, dashboards, and tools.
            <span className="hidden sm:inline"><br /></span>
            <span className="sm:hidden"> </span>
            Built fast, built right, built for your business.
          </p>
        </FadeIn>

        {/* Desktop CTA buttons */}
        <FadeIn delay={0.35} className="mt-8 hidden md:block">
          <div className="mx-auto flex items-center justify-center gap-4">
            <Link
              href="/intake"
              className="btn-shine neon-glow group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground transition-all hover:bg-cyan-hover"
            >
              Start a Project
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/portfolio"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-green-400/20 bg-green-400/5 px-6 text-base font-medium text-green-400 backdrop-blur-sm transition-all hover:border-green-400/30 hover:bg-green-400/10 hover:text-green-300"
            >
              <Eye className="h-4 w-4" />
              View Our Work
            </Link>
          </div>
        </FadeIn>

        {/* Mobile CTA buttons */}
        <FadeIn delay={0.35} className="mt-6 w-full md:hidden">
          <div className="mx-auto flex max-w-sm flex-col gap-2.5">
            <Link
              href="/intake"
              className="btn-shine neon-glow group inline-flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-base font-semibold text-primary-foreground transition-all hover:bg-cyan-hover"
            >
              Start a Project
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/portfolio"
              className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-green-400/20 bg-green-400/5 text-sm font-medium text-green-400 backdrop-blur-sm transition-all hover:border-green-400/30 hover:bg-green-400/10 hover:text-green-300"
            >
              <Eye className="h-4 w-4" />
              View Our Work
            </Link>
          </div>
        </FadeIn>
      </div>

      {/* Flex spacer */}
      <div className="flex-1" />

      {/* Stats Bar */}
      <div className="relative z-10 mb-8 w-full md:mb-36">
        <StatsBar />
      </div>

      {/* Scroll teaser */}
      <div className="relative z-10 mt-3 flex justify-center md:mb-[66px] sm:mt-4">
        <ScrollTeaser />
      </div>
    </section>
  );
}
