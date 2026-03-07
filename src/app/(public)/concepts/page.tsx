import type { Metadata } from "next";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { FadeIn } from "@/components/motion/FadeIn";
import { ConceptGrid } from "@/components/portfolio/ConceptGrid";
import { CTASection } from "@/components/public-site/CTASection";

export const metadata: Metadata = {
  title: "Concept Demos",
  description:
    "Interactive concept demos showcasing what BuiltByBas can build. Explore office tools, operations platforms, client portals, and more.",
  robots: { index: false, follow: false },
};

export default function ConceptsPage() {
  return (
    <>
      <PublicHeader />
      <main id="main-content">
        <section className="pt-24 pb-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Concept <span className="text-gradient">Demos</span>
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                Interactive showcases of what we can build for your business.
                Each demo is a working prototype you can explore.
              </p>
            </FadeIn>
          </div>
        </section>

        <section className="pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ConceptGrid />
          </div>
        </section>

        <CTASection />
      </main>
      <PublicFooter />
    </>
  );
}
