"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { springs } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { FadeIn } from "@/components/motion/FadeIn";

const steps = [
  "We review your project details and goals",
  "We research your industry and competitors",
  "We craft a custom proposal tailored to your business",
  "We schedule a call to walk through the plan together",
];

function getStoredName() {
  if (typeof window === "undefined") return "";
  const name = sessionStorage.getItem("intake-name") || "";
  if (name) sessionStorage.removeItem("intake-name");
  return name;
}

function subscribe() {
  // No external updates — name is read once on mount
  return () => {};
}

export function IntakeConfirmation() {
  const name = useSyncExternalStore(subscribe, getStoredName, () => "");
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="flex min-h-[70vh] items-center py-24">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        <FadeIn>
          {/* Animated Checkmark */}
          <div className="mx-auto mb-8 inline-flex">
            {shouldReduceMotion ? (
              <CheckCircle2 className="h-20 w-20 text-primary" />
            ) : (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ ...springs.bouncy, delay: 0.2 }}
              >
                <CheckCircle2 className="h-20 w-20 text-primary" />
              </motion.div>
            )}
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {name ? (
              <>
                Thank you, <span className="text-gradient">{name}</span>!
              </>
            ) : (
              <>
                Thank <span className="text-gradient">You</span>!
              </>
            )}
          </h1>

          <p className="mt-4 text-lg text-muted-foreground">
            Your project details have been received. We&apos;ll review
            everything and get back to you within{" "}
            <span className="font-medium text-foreground">48 hours</span> with
            a custom proposal.
          </p>
        </FadeIn>

        {/* Next Steps */}
        <FadeIn delay={0.3}>
          <div className="mt-12 text-left">
            <h2 className="mb-6 text-lg font-semibold">
              What Happens Next
            </h2>
            <ol className="space-y-4">
              {steps.map((step, i) => (
                <li key={step} className="flex items-start gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </FadeIn>

        <FadeIn delay={0.5}>
          <div className="mt-12">
            <Link
              href="/"
              className="inline-flex h-12 items-center rounded-lg bg-primary px-8 text-base font-semibold text-primary-foreground transition-colors hover:bg-cyan-hover"
            >
              Back to Home
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
