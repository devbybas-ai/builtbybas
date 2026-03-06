import type { Metadata } from "next";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { ServicesGrid } from "@/components/public-site/ServicesGrid";
import { CTASection } from "@/components/public-site/CTASection";
import { FadeIn } from "@/components/motion/FadeIn";
import { JsonLd } from "@/components/shared/JsonLd";
import {
  getServiceSchemas,
  getBreadcrumbSchema,
  getFAQSchema,
} from "@/lib/json-ld";

export const metadata: Metadata = {
  title: "Web Development Services",
  description:
    "Custom websites, dashboards, portals, e-commerce, CRM systems, and AI-powered tools. Precision-engineered for your business. Get a quote today.",
};

const faqItems = [
  {
    question: "How long does a typical project take?",
    answer:
      "Project timelines vary based on scope. A marketing website typically takes 2-4 weeks. Custom software platforms can take 2-6 months. We'll provide a detailed timeline in your custom proposal.",
  },
  {
    question: "Do you offer ongoing support after launch?",
    answer:
      "Yes. Every project includes a post-launch support period. We also offer monthly maintenance retainers for ongoing updates, monitoring, and feature development.",
  },
  {
    question: "What makes BuiltByBas different from other developers?",
    answer:
      "BuiltByBas is a full-stack development and marketing company. We build the platform AND the growth strategy. Engineering and marketing unified under one roof. Every project is custom-engineered, never templated.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={getServiceSchemas()} />
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />
      <JsonLd data={getFAQSchema(faqItems)} />
      <PublicHeader />
      <main id="main-content" className="pt-24">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="mb-12">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Our <span className="text-gradient">Services</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Everything your business needs to succeed online. Custom-built,
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
