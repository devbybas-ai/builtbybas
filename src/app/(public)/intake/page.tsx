import { Suspense } from "react";
import type { Metadata } from "next";
import { FadeIn } from "@/components/motion/FadeIn";
import { IntakeForm } from "@/components/public-site/IntakeForm";
import { JsonLd } from "@/components/shared/JsonLd";
import { getBreadcrumbSchema } from "@/lib/json-ld";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://builtbybas.com";

export const metadata: Metadata = {
  title: "Start a Project",
  description:
    "Tell us about your project. Fill out the intake form and get a custom proposal within 48 hours. No templates, no shortcuts.",
  alternates: { canonical: `${SITE_URL}/intake` },
};

export default function IntakePage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Start a Project", path: "/intake" },
        ])}
      />
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
    </>
  );
}
