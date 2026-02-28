"use client";

import { FadeIn } from "@/components/motion/FadeIn";

export function AboutStory() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl">
            The <span className="text-gradient">Story</span>
          </h2>
        </FadeIn>

        <div className="grid items-start gap-12 lg:grid-cols-2">
          <FadeIn direction="left">
            <div className="space-y-6 text-muted-foreground">
              <p className="text-lg leading-relaxed">
                I started BuiltByBas because I was tired of watching small
                businesses get burned. Overcharged by agencies that hand them a
                $20,000 template. Ghosted by freelancers who disappear after
                launch. Left with tools that don&apos;t actually fit their
                business.
              </p>
              <p className="text-lg leading-relaxed">
                I&apos;m a software developer, and building things is what I do
                best. Not managing teams. Not padding proposals. Not selling
                features nobody asked for. I build — and I build with precision,
                because every line of code matters when it&apos;s your business
                on the line.
              </p>
              <p className="text-lg leading-relaxed">
                When AI changed the game, I didn&apos;t resist it — I embraced
                it. While other agencies are still figuring out prompts, I&apos;m
                shipping production code with AI as my co-pilot. That means you
                get agency-quality work at freelancer speed, without the
                agency-quality invoice.
              </p>
            </div>
          </FadeIn>

          <FadeIn direction="right">
            <div className="glass-card space-y-6 p-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="font-medium">Software Developer</span>
                </div>
                <p className="pl-5 text-sm text-muted-foreground">
                  Full-stack engineer who builds everything from responsive
                  websites to complex business platforms.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="font-medium">AI Pioneer</span>
                </div>
                <p className="pl-5 text-sm text-muted-foreground">
                  One of the first developers to fully integrate AI into
                  professional software delivery — not as a gimmick, but as
                  core infrastructure.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="font-medium">Small Business Advocate</span>
                </div>
                <p className="pl-5 text-sm text-muted-foreground">
                  Every client gets my full attention. No account managers, no
                  middlemen. You talk to the person writing your code.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
