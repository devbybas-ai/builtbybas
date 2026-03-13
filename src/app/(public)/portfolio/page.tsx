import type { Metadata } from "next";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { FadeIn } from "@/components/motion/FadeIn";
import { ProjectGrid } from "@/components/portfolio/ProjectGrid";
import { CTASection } from "@/components/public-site/CTASection";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "Real projects, live demos. See the custom websites, platforms, and tools BuiltByBas has shipped. Try our interactive capability showcases.",
};

export default function PortfolioPage() {
  return (
    <>
      <PublicHeader />
      <main id="main-content" className="relative overflow-x-clip">
        <section className="pt-24 pb-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Our <span className="text-gradient">Work</span>
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                Real projects, real results. Every project is custom-engineered
                with no templates and no shortcuts.
              </p>
            </FadeIn>
          </div>
        </section>

        <section className="relative pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ProjectGrid />
          </div>
        </section>

        <CTASection />
      </main>
      <PublicFooter />
    </>
  );
}
