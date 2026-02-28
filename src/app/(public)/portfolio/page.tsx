import type { Metadata } from "next";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "See the custom software, websites, and tools BuiltByBas has delivered for small businesses.",
};

export default function PortfolioPage() {
  return (
    <>
      <PublicHeader />
      <main id="main-content" className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Our <span className="text-gradient">Work</span>
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Real projects, real results. Every project is custom-built for the client.
        </p>
      </main>
      <PublicFooter />
    </>
  );
}
