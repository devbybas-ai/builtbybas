"use client";

import { motion } from "framer-motion";
import { Shield, Eye, Wrench, Sparkles } from "lucide-react";
import { springs, viewportOnce } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { FadeIn } from "@/components/motion/FadeIn";
import type { LucideIcon } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Quality First",
    description:
      "Every project is measured against 8 engineering pillars: security, performance, accessibility, and more. No shortcuts. No cutting corners.",
    accent: "from-cyan-400 to-blue-500",
  },
  {
    icon: Eye,
    title: "Transparent Always",
    description:
      "You see exactly where your project stands. Real-time progress, honest timelines, clear invoices. No surprises, no hidden fees.",
    accent: "from-violet-400 to-purple-500",
  },
  {
    icon: Wrench,
    title: "Built to Last",
    description:
      "Clean architecture, tested code, production-grade infrastructure. Your software should work for years, not months.",
    accent: "from-emerald-400 to-teal-500",
  },
  {
    icon: Sparkles,
    title: "Human + AI",
    description:
      "We bring the vision and craft. AI brings speed and scale. Together, we deliver what neither could alone.",
    accent: "from-amber-400 to-orange-500",
  },
];

export function AboutValues() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-16 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            What We <span className="text-gradient">Stand For</span>
          </h2>
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2">
          {values.map((value, index) => (
            <ValuesCard
              key={value.title}
              value={value}
              index={index}
              animated={!shouldReduceMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface ValuesCardProps {
  value: {
    icon: LucideIcon;
    title: string;
    description: string;
    accent: string;
  };
  index: number;
  animated: boolean;
}

function ValuesCard({ value, index, animated }: ValuesCardProps) {
  const Icon = value.icon;
  const xDirections = [-40, 40, -40, 40];

  const card = (
    <div className="group relative">
      <div className="glass-card relative p-8 transition-all duration-500 hover:border-primary/30 hover:shadow-[0_0_40px_-5px] hover:shadow-primary/15">
        {/* Icon with glow */}
        <div className="relative mb-4 inline-flex">
          <div className="absolute inset-0 rounded-lg bg-primary/20 blur-md opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative inline-flex rounded-lg bg-primary/10 p-3 transition-colors duration-300 group-hover:bg-primary/20">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>

        <h3 className="mb-2 text-lg font-semibold">{value.title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {value.description}
        </p>
      </div>
    </div>
  );

  if (!animated) return card;

  return (
    <motion.div
      initial={{ opacity: 0, x: xDirections[index] ?? 0, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={viewportOnce}
      transition={{ ...springs.smooth, duration: 0.6, delay: index * 0.1 }}
    >
      {card}
    </motion.div>
  );
}
