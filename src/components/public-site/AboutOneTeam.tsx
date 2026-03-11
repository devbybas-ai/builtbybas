"use client";

import { motion } from "framer-motion";
import { User, Cpu, ArrowRight } from "lucide-react";
import { springs, viewportOnce } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { FadeIn } from "@/components/motion/FadeIn";

export function AboutOneTeam() {
  const shouldReduceMotion = useReducedMotion();

  const basCard = (
    <div className="group glass-card relative p-8 text-center transition-all duration-500 hover:border-primary/30 hover:shadow-[0_0_40px_-5px] hover:shadow-primary/15">
      <div className="mx-auto mb-4 inline-flex rounded-xl bg-primary/10 p-4">
        <User className="h-8 w-8 text-primary" />
      </div>

      <h3 className="text-xl font-semibold">Bas</h3>
      <p className="mt-1 text-sm font-medium text-primary">
        Strategy &amp; Craft
      </p>

      {/* Accent bar */}
      <div className="mx-auto mt-4 h-px w-8 bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-500 group-hover:w-16" />

      <ul className="mt-4 space-y-2 text-left text-sm text-muted-foreground">
        {[
          "Human code review",
          "Human oversight",
          "Architecture decisions",
          "Business understanding",
          "Quality standards",
          "Security implementation",
          "Client relationships",
        ].map((item) => (
          <li key={item} className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary transition-transform duration-300 group-hover:scale-125" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );

  const claudeCard = (
    <div className="group glass-card relative p-8 text-center transition-all duration-500 hover:border-primary/30 hover:shadow-[0_0_40px_-5px] hover:shadow-primary/15">
      <div className="mx-auto mb-4 inline-flex rounded-xl bg-primary/10 p-4">
        <Cpu className="h-8 w-8 text-primary" />
      </div>

      <h3 className="text-xl font-semibold">Claude</h3>
      <p className="mt-1 text-sm font-medium text-primary">
        Speed &amp; Scale
      </p>

      {/* Accent bar */}
      <div className="mx-auto mt-4 h-px w-8 bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-500 group-hover:w-16" />

      <ul className="mt-4 space-y-2 text-left text-sm text-muted-foreground">
        {[
          "Code generation",
          "Testing coverage",
          "Documentation",
          "24/7 availability",
        ].map((item) => (
          <li key={item} className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary transition-transform duration-300 group-hover:scale-125" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );

  const centerBridge = (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="hidden h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent md:block" />
      <div className="flex items-center gap-3">
        <ArrowRight className="hidden h-5 w-5 text-primary md:block" />
        <div className="relative overflow-hidden rounded-full border border-primary/30 bg-primary/10 px-4 py-2 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_-5px] hover:shadow-primary/30">
          <span className="text-sm font-medium text-primary">
            Together
          </span>
        </div>
        <ArrowRight className="hidden h-5 w-5 rotate-180 text-primary md:block" />
      </div>
      <div className="hidden h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent md:block" />
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Full-stack engineering.
        <br />
        Strategic marketing.
        <br />
        <span className="font-medium text-foreground">
          Extraordinary results.
        </span>
      </p>
    </div>
  );

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-16 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Human &amp; AI <span className="text-gradient">Oversight</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Human creativity meets AI capability. That&apos;s the BuiltByBas
            advantage.
          </p>
        </FadeIn>

        <div className="grid items-center gap-8 md:grid-cols-3">
          {shouldReduceMotion ? (
            <>
              <div>{basCard}</div>
              <div>{centerBridge}</div>
              <div>{claudeCard}</div>
            </>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={viewportOnce}
                transition={springs.smooth}
              >
                {basCard}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={viewportOnce}
                transition={{ ...springs.smooth, delay: 0.2 }}
              >
                {centerBridge}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={viewportOnce}
                transition={{ ...springs.smooth, delay: 0.1 }}
              >
                {claudeCard}
              </motion.div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
