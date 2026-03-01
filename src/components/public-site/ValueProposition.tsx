"use client";

import { motion } from "framer-motion";
import { Code2, Zap, HeartHandshake } from "lucide-react";
import { fadeInUp, springs, staggerContainer, viewportOnce } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { FadeIn } from "@/components/motion/FadeIn";

const values = [
  {
    icon: Code2,
    title: "Custom, Not Templated",
    description:
      "Every project built from scratch for your specific business needs. No cookie-cutter themes. No recycled designs. Just solutions that fit.",
  },
  {
    icon: Zap,
    title: "Fast, Not Bloated",
    description:
      "AI-augmented delivery in weeks, not months. One developer, zero bloated teams. You get speed without sacrificing quality.",
  },
  {
    icon: HeartHandshake,
    title: "Ongoing, Not Abandoned",
    description:
      "Maintenance, support, and feature add-ons for as long as you need them. We don't disappear after launch.",
  },
];

export function ValueProposition() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-16 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Why <span className="text-gradient">BuiltByBas</span>?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Your business deserves better than what most agencies deliver.
          </p>
        </FadeIn>

        {shouldReduceMotion ? (
          <div className="grid gap-8 md:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className="glass-card-hover p-8">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={staggerContainer(0.15)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid gap-8 md:grid-cols-3"
          >
            {values.map((value) => (
              <motion.div
                key={value.title}
                variants={fadeInUp}
                transition={springs.smooth}
                whileHover={{ y: -8, borderColor: "rgba(0, 212, 255, 0.3)" }}
                className="glass-card p-8 transition-shadow hover:shadow-[0_0_20px_rgba(0,212,255,0.1)]"
              >
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
