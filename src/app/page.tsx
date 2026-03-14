import type { Metadata } from "next";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Hero } from "@/components/public-site/Hero";
import { JsonLd } from "@/components/shared/JsonLd";
import { getWebSiteSchema } from "@/lib/json-ld";

export const metadata: Metadata = {
  title: "BuiltByBas | Custom Software and Web Development",
  description:
    "Custom software, websites, dashboards, and business tools. Built fast, built right, built for your business. AI-powered.",
};

export default function HomePage() {
  return (
    <div className="fixed inset-0 overflow-hidden">
      <JsonLd data={getWebSiteSchema()} />
      <PublicHeader />
      <main id="main-content" className="relative h-full">
        <Hero />
      </main>
    </div>
  );
}
