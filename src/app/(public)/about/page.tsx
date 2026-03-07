import type { Metadata } from "next";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { AboutStory } from "@/components/public-site/AboutStory";
import { AboutPillars } from "@/components/public-site/AboutPillars";
import { AboutValues } from "@/components/public-site/AboutValues";
import { AboutOneTeam } from "@/components/public-site/AboutOneTeam";
import { AboutTimeline } from "@/components/public-site/AboutTimeline";
import { CTASection } from "@/components/public-site/CTASection";

export const metadata: Metadata = {
  title: "About",
  description:
    "BuiltByBas is a software development company focused on building operational software systems for real-world businesses.",
};

export default function AboutPage() {
  return (
    <>
      <PublicHeader />
      <main id="main-content" className="pt-24">
        <AboutStory />
        <AboutValues />
        <AboutPillars />
        <AboutOneTeam />
        <AboutTimeline />
        <CTASection />
      </main>
      <PublicFooter />
    </>
  );
}
