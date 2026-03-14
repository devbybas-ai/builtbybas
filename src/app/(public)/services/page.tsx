import type { Metadata } from "next";
import { ServicesGrid } from "@/components/public-site/ServicesGrid";
import { CTASection } from "@/components/public-site/CTASection";
import { FadeIn } from "@/components/motion/FadeIn";
import { JsonLd } from "@/components/shared/JsonLd";
import {
  getServiceSchemas,
  getBreadcrumbSchema,
  getFAQSchema,
} from "@/lib/json-ld";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://builtbybas.com";

/** ISR: revalidate static content every hour */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Web Development Services",
  description:
    "Custom websites, dashboards, portals, e-commerce, CRM systems, and AI-powered tools. Precision-engineered for your business. Get a quote today.",
  alternates: { canonical: `${SITE_URL}/services` },
};

const faqItems = [
  {
    question: "How long does a typical project take?",
    answer:
      "Most projects are delivered within 2-3 weeks, though timelines vary based on scope and complexity. We'll provide a detailed timeline in your custom proposal.",
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
      <main id="main-content" className="relative overflow-x-clip pt-24">
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
    </>
  );
}
