import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { Hero } from "@/components/public-site/Hero";
import { ValueProposition } from "@/components/public-site/ValueProposition";
import { CTASection } from "@/components/public-site/CTASection";

export default function HomePage() {
  return (
    <>
      <PublicHeader />
      <main id="main-content">
        <Hero />
        <ValueProposition />
        <CTASection />
      </main>
      <PublicFooter />
    </>
  );
}
