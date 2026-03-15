import type { Metadata } from "next";
import { InvoiceView } from "@/components/billing/InvoiceView";

export const metadata: Metadata = {
  title: "Invoice - BuiltByBas",
  robots: { index: false, follow: false },
};

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <InvoiceView token={token} />;
}
