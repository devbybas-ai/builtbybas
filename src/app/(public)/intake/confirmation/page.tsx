import type { Metadata } from "next";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { IntakeConfirmation } from "@/components/public-site/IntakeConfirmation";

export const metadata: Metadata = {
  title: "Project Submitted",
  description: "Your project details have been received. We'll be in touch within 48 hours.",
};

export default function IntakeConfirmationPage() {
  return (
    <>
      <PublicHeader />
      <main id="main-content">
        <IntakeConfirmation />
      </main>
      <PublicFooter />
    </>
  );
}
