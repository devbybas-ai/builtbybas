import type { Metadata } from "next";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { ServicesGrid } from "@/components/public-site/ServicesGrid";
import { CTASection } from "@/components/public-site/CTASection";
import { FadeIn } from "@/components/motion/FadeIn";

export const metadata: Metadata = {
  title: "Web Development Services",
  description:
    "Custom websites, dashboards, portals, e-commerce, CRM systems, and AI-powered tools for small businesses. Get a quote today.",
};

export default function ServicesPage() {
  return (
    <>
      <PublicHeader />
      <main id="main-content" className="pt-24">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="mb-12">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Our <span className="text-gradient">Services</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Everything your business needs to succeed online — custom-built,
              not templated.
            </p>
          </FadeIn>

          <ServicesGrid />
        </section>

        <div className="mt-16">
          <CTASection />
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
