import type { Metadata } from "next";
import { DemoSidebar } from "@/components/layout/DemoSidebar";

export const metadata: Metadata = {
  title: "Live Demo - BuiltByBas Backend",
  description:
    "Explore the BuiltByBas admin backend. See the CRM, pipeline, proposals, invoices, and analytics that power every project.",
  robots: { index: true, follow: true },
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <DemoSidebar />
      <main id="main-content" className="md:pl-64">
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3">
            <p className="text-sm text-amber-400">
              <span className="font-bold">Demo Mode</span> — You are exploring
              a live preview of the BuiltByBas admin backend. All data shown is
              sample data.
            </p>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
