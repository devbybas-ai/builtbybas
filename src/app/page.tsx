import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { GlassCard } from "@/components/shared/GlassCard";

export default function HomePage() {
  return (
    <>
      <PublicHeader />
      <main id="main-content" className="pt-16">
        <section className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center">
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Custom Software for{" "}
            <span className="text-gradient">Small Business</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Agency-quality websites, dashboards, and tools — built fast, built
            right, built for your business.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/intake"
              className="neon-glow rounded-lg bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-cyan-hover"
            >
              Start a Project
            </Link>
            <Link
              href="/portfolio"
              className="rounded-lg border border-white/10 bg-white/5 px-8 py-3 text-sm font-medium text-foreground transition-colors hover:bg-white/10"
            >
              View Our Work
            </Link>
          </div>

          <div className="mt-20 grid max-w-5xl gap-6 sm:grid-cols-3">
            <GlassCard hover>
              <h3 className="text-lg font-semibold text-foreground">
                Custom, Not Templated
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Every project built from scratch for your specific business
                needs.
              </p>
            </GlassCard>
            <GlassCard hover>
              <h3 className="text-lg font-semibold text-foreground">
                Fast, Not Bloated
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                AI-augmented delivery in weeks, not months. No bloated teams.
              </p>
            </GlassCard>
            <GlassCard hover>
              <h3 className="text-lg font-semibold text-foreground">
                Ongoing, Not Abandoned
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Maintenance, support, and feature add-ons. We don&apos;t
                disappear.
              </p>
            </GlassCard>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
