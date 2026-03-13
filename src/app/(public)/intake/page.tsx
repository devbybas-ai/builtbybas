import { Suspense } from "react";
import type { Metadata } from "next";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { FadeIn } from "@/components/motion/FadeIn";
import { IntakeForm } from "@/components/public-site/IntakeForm";

export const metadata: Metadata = {
  title: "Start a Project",
  description:
    "Tell us about your project. Fill out the intake form and get a custom proposal within 48 hours. No templates, no shortcuts.",
};

export default function IntakePage() {
  return (
    <>
      <PublicHeader />
      <main id="main-content" className="relative overflow-x-clip">
        <section className="pt-24 pb-8">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
            <FadeIn>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Start a <span className="text-gradient">Project</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Tell us about your business and what you need. The more detail,
                the better your proposal will be.
              </p>
            </FadeIn>
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6 lg:px-8">
          <Suspense>
            <IntakeForm />
          </Suspense>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
