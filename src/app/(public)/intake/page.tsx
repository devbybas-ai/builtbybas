import type { Metadata } from "next";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

export const metadata: Metadata = {
  title: "Start a Project",
  description:
    "Tell us about your project. Fill out the intake form and get a custom proposal within 48 hours.",
};

export default function IntakePage() {
  return (
    <>
      <PublicHeader />
      <main id="main-content" className="mx-auto max-w-3xl px-4 pt-24 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Start a <span className="text-gradient">Project</span>
        </h1>
        <p className="mt-4 text-muted-foreground">
          Tell us about your business and what you need. The more detail, the
          better your proposal will be.
        </p>
      </main>
      <PublicFooter />
    </>
  );
}
