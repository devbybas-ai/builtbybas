"use client";

import { motion } from "framer-motion";
import { springs, viewportOnce } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { FadeIn } from "@/components/motion/FadeIn";

const credentials = [
  {
    title: "Software Developer",
    description:
      "Full-stack engineer who builds everything from responsive websites to complex business platforms.",
    accent: "from-cyan-400 to-blue-500",
  },
  {
    title: "AI Pioneer",
    description:
      "One of the first developers to fully integrate AI into professional software delivery. Not as a gimmick, but as core infrastructure.",
    accent: "from-violet-400 to-purple-500",
  },
  {
    title: "Veteran-Backed",
    description:
      "Military discipline, mission focus, and a commitment to delivering on every promise. That foundation shapes how we build.",
    accent: "from-emerald-400 to-teal-500",
  },
  {
    title: "Business Advocate",
    description:
      "Every client gets our full attention. No account managers, no middlemen. You talk directly to the team building your software.",
    accent: "from-amber-400 to-orange-500",
  },
];

export function AboutStory() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl">
            The <span className="text-gradient">Story</span>
          </h2>
        </FadeIn>

        <div className="grid items-start gap-12 lg:grid-cols-2">
          {/* Story text — staggered paragraph entrances */}
          <div className="space-y-6 text-muted-foreground">
            {[
              <>
                I started BuiltByBas because I believe every business deserves
                real software built for how they actually operate. Not
                one-size-fits-all templates. Not tools that stop working six
                months later. Real solutions, built with care, that grow with
                your business. That belief lit a fire.
              </>,
              <>
                The discipline, precision, and commitment to mission that the
                military instills, that&apos;s the foundation I built on. Not
                managing layers of people. Not padding proposals. Not selling
                features nobody asked for. Just building with precision,
                because every line of code matters when it&apos;s your business
                on the line.
              </>,
              <>
                When AI changed the game, that fire became a team. Now we ship
                production code with AI as our co-pilot. Every project gets the
                full picture, the engineering AND the marketing strategy, built
                by a team that understands both. AI doesn&apos;t replace
                craftsmanship, it amplifies it. What started as one
                developer&apos;s mission is now BuiltByBas.
              </>,
            ].map((text, i) =>
              shouldReduceMotion ? (
                <p key={i} className="text-lg leading-relaxed">
                  {text}
                </p>
              ) : (
                <motion.p
                  key={i}
                  className="text-lg leading-relaxed"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={viewportOnce}
                  transition={{ ...springs.smooth, duration: 0.6, delay: i * 0.15 }}
                >
                  {text}
                </motion.p>
              )
            )}
          </div>

          {/* Credential cards — stacked with stagger */}
          <div className="space-y-4">
            {credentials.map((cred, index) => {
              const card = (
                <div key={cred.title} className="group relative">
                  <div className="glass-card relative p-6 transition-all duration-500 hover:border-primary/30 hover:shadow-[0_0_30px_-5px] hover:shadow-primary/15">

                    <div className="flex items-start gap-4">
                      {/* Animated dot */}
                      <div className="relative mt-1.5 flex-shrink-0">
                        <div className="absolute inset-0 rounded-full bg-primary/30 blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <div className="relative h-2.5 w-2.5 rounded-full bg-primary transition-transform duration-300 group-hover:scale-125" />
                      </div>

                      <div>
                        <span className="font-medium transition-colors duration-300 group-hover:text-primary">
                          {cred.title}
                        </span>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {cred.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );

              if (shouldReduceMotion) return card;

              return (
                <motion.div
                  key={cred.title}
                  initial={{ opacity: 0, x: 40, y: 10 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={viewportOnce}
                  transition={{ ...springs.smooth, duration: 0.6, delay: index * 0.12 }}
                >
                  {card}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
