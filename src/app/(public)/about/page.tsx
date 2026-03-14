import type { Metadata } from "next";
import { AboutStory } from "@/components/public-site/AboutStory";
import { AboutPillars } from "@/components/public-site/AboutPillars";
import { AboutValues } from "@/components/public-site/AboutValues";
import { AboutOneTeam } from "@/components/public-site/AboutOneTeam";
import { AboutTimeline } from "@/components/public-site/AboutTimeline";
import { CTASection } from "@/components/public-site/CTASection";
import { JsonLd } from "@/components/shared/JsonLd";
import { getBreadcrumbSchema, getAboutPageSchema } from "@/lib/json-ld";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://builtbybas.com";

/** ISR: revalidate static content every hour */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About",
  description:
    "BuiltByBas is a software development company focused on building operational software systems for real-world businesses.",
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <JsonLd data={getAboutPageSchema()} />
      <main id="main-content" className="relative overflow-x-clip pt-24">
        <AboutStory />
        <AboutValues />
        <AboutPillars />
        <AboutOneTeam />
        <AboutTimeline />
        <CTASection />
      </main>
    </>
  );
}
