import type { Metadata } from "next";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { FadeIn } from "@/components/motion/FadeIn";
import { PortfolioGrid } from "@/components/public-site/PortfolioGrid";
import { CTASection } from "@/components/public-site/CTASection";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "See the custom software, websites, and marketing solutions BuiltByBas has delivered. Real projects, real results.",
};

export default function PortfolioPage() {
  return (
    <>
      <PublicHeader />
      <main id="main-content">
        <section className="pt-24 pb-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Our <span className="text-gradient">Work</span>
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                Real projects, real results. Every project is custom-engineered
                for the client — no templates, no shortcuts.
              </p>
            </FadeIn>
          </div>
        </section>

        <section className="pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <PortfolioGrid />
          </div>
        </section>

        <CTASection />
      </main>
      <PublicFooter />
    </>
  );
}
