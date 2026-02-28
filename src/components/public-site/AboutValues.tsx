"use client";

import { motion } from "framer-motion";
import { Shield, Eye, Wrench, Sparkles } from "lucide-react";
import { fadeInUp, springs, staggerContainer, viewportOnce } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { FadeIn } from "@/components/motion/FadeIn";

const values = [
  {
    icon: Shield,
    title: "Quality First",
    description:
      "Every project is measured against 8 engineering pillars — security, performance, accessibility, and more. No shortcuts. No cutting corners.",
  },
  {
    icon: Eye,
    title: "Transparent Always",
    description:
      "You see exactly where your project stands. Real-time progress, honest timelines, clear invoices. No surprises, no hidden fees.",
  },
  {
    icon: Wrench,
    title: "Built to Last",
    description:
      "Clean architecture, tested code, production-grade infrastructure. Your software should work for years, not months.",
  },
  {
    icon: Sparkles,
    title: "Human + AI",
    description:
      "I bring the vision and craft. AI brings speed and scale. Together, we deliver what neither could alone.",
  },
];

export function AboutValues() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-16 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            What I <span className="text-gradient">Stand For</span>
          </h2>
        </FadeIn>

        {shouldReduceMotion ? (
          <div className="grid gap-8 sm:grid-cols-2">
            {values.map((value) => (
              <div key={value.title} className="glass-card p-8">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={staggerContainer(0.12)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid gap-8 sm:grid-cols-2"
          >
            {values.map((value) => (
              <motion.div
                key={value.title}
                variants={fadeInUp}
                transition={springs.smooth}
                whileHover={{ y: -4, borderColor: "rgba(0, 212, 255, 0.2)" }}
                className="glass-card p-8"
              >
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
