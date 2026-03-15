import { Suspense } from "react";
import type { Metadata } from "next";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { MobileConcierge } from "@/components/public-site/MobileConcierge";
import { JsonLd } from "@/components/shared/JsonLd";
import { getWebSiteSchema } from "@/lib/json-ld";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://builtbybas.com";

export const metadata: Metadata = {
  title: "BuiltByBas | Custom Software and Web Development",
  description:
    "Custom software, websites, dashboards, and business tools. Built fast, built right, built for your business. AI-powered.",
  alternates: { canonical: SITE_URL },
};

export default function HomePage() {
  return (
    <div className="fixed inset-0 overflow-hidden">
      <JsonLd data={getWebSiteSchema()} />
      <PublicHeader />
      <main id="main-content" className="relative h-full">
        <Suspense>
          <MobileConcierge />
        </Suspense>
      </main>
    </div>
  );
}
