import type { Metadata } from "next";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { Hero } from "@/components/public-site/Hero";
import { ValueProposition } from "@/components/public-site/ValueProposition";
import { CTASection } from "@/components/public-site/CTASection";
import { JsonLd } from "@/components/shared/JsonLd";
import { getWebSiteSchema } from "@/lib/json-ld";

export const metadata: Metadata = {
  title: "BuiltByBas | Custom Software and Web Development",
  description:
    "Custom software, websites, dashboards, and business tools. Built fast, built right, built for your business. AI-powered.",
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={getWebSiteSchema()} />
      <PublicHeader />
      <main id="main-content">
        <Hero />
        <ValueProposition />
        <CTASection />
      </main>
      <PublicFooter />
    </>
  );
}
