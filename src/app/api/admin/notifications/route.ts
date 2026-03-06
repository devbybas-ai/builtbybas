import { NextResponse } from "next/server";
import { count, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { intakeSubmissions, proposals, invoices } from "@/lib/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  const [
    [newIntakes],
    [draftProposals],
    [overdueInvoices],
  ] = await Promise.all([
    db
      .select({ value: count() })
      .from(intakeSubmissions)
      .where(eq(intakeSubmissions.status, "new")),
    db
      .select({ value: count() })
      .from(proposals)
      .where(eq(proposals.status, "draft")),
    db
      .select({ value: count() })
      .from(invoices)
      .where(eq(invoices.status, "overdue")),
  ]);

  return NextResponse.json({
    intake: newIntakes.value,
    proposals: draftProposals.value,
    invoices: overdueInvoices.value,
  });
}
