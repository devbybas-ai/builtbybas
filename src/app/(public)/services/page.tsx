import type { Metadata } from "next";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

export const metadata: Metadata = {
  title: "Web Development Services",
  description:
    "Custom websites, dashboards, portals, e-commerce, CRM systems, and AI-powered tools for small businesses. Get a quote today.",
};

export default function ServicesPage() {
  return (
    <>
      <PublicHeader />
      <main id="main-content" className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Our <span className="text-gradient">Services</span>
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Everything your business needs to succeed online — custom-built, not templated.
        </p>
      </main>
      <PublicFooter />
    </>
  );
}
