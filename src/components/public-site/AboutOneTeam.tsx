"use client";

import { User, Cpu, ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";

export function AboutOneTeam() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-16 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            <span className="text-gradient">#OneTeam</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Human creativity meets AI capability. That&apos;s the BuiltByBas
            advantage.
          </p>
        </FadeIn>

        <div className="grid items-center gap-8 md:grid-cols-3">
          <FadeIn direction="left">
            <div className="glass-card p-8 text-center">
              <div className="mx-auto mb-4 inline-flex rounded-xl bg-primary/10 p-4">
                <User className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Bas</h3>
              <p className="mt-1 text-sm font-medium text-primary">
                Strategy &amp; Craft
              </p>
              <ul className="mt-4 space-y-2 text-left text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Architecture decisions
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Business understanding
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Quality standards
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Client relationships
                </li>
              </ul>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="hidden h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent md:block" />
              <div className="flex items-center gap-3">
                <ArrowRight className="hidden h-5 w-5 text-primary md:block" />
                <div className="rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
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
          </FadeIn>

          <FadeIn direction="right">
            <div className="glass-card p-8 text-center">
              <div className="mx-auto mb-4 inline-flex rounded-xl bg-primary/10 p-4">
                <Cpu className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Claude</h3>
              <p className="mt-1 text-sm font-medium text-primary">
                Speed &amp; Scale
              </p>
              <ul className="mt-4 space-y-2 text-left text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Code generation
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Testing coverage
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Documentation
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  24/7 availability
                </li>
              </ul>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
