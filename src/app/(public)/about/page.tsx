import type { Metadata } from "next";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Bas Rosario — the developer behind BuiltByBas. Custom software and web development for small businesses.",
};

export default function AboutPage() {
  return (
    <>
      <PublicHeader />
      <main id="main-content" className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          About <span className="text-gradient">BuiltByBas</span>
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          One developer. One mission. Elite custom software for small businesses
          that deserve better than templates.
        </p>
      </main>
      <PublicFooter />
    </>
  );
}
