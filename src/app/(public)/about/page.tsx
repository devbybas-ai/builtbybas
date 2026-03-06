import type { Metadata } from "next";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { FadeIn } from "@/components/motion/FadeIn";
import { AboutStory } from "@/components/public-site/AboutStory";
import { AboutValues } from "@/components/public-site/AboutValues";
import { AboutOneTeam } from "@/components/public-site/AboutOneTeam";
import { AboutTimeline } from "@/components/public-site/AboutTimeline";
import { CTASection } from "@/components/public-site/CTASection";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Bas Rosario, veteran-backed developer behind BuiltByBas. Custom software and web development for businesses ready to grow.",
};

export default function AboutPage() {
  return (
    <>
      <PublicHeader />
      <main id="main-content" className="pt-24">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              About <span className="text-gradient">BuiltByBas</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Veteran-backed. One developer. One mission. Elite custom
              software for businesses that deserve better than templates.
            </p>
          </FadeIn>
        </section>

        <AboutStory />
        <AboutValues />
        <AboutOneTeam />
        <AboutTimeline />
        <CTASection />
      </main>
      <PublicFooter />
    </>
  );
}
