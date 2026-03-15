import { sql } from "drizzle-orm";
import { invoices } from "./schema";
import type { Database } from "./db";

export type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0];

export const MAX_INVOICE_RETRIES = 3;

export async function generateInvoiceNumber(tx: Transaction): Promise<string> {
  const year = new Date().getFullYear();
  const [result] = await tx
    .select({ count: sql<number>`count(*)::int` })
    .from(invoices);
  const seq = (result.count + 1).toString().padStart(4, "0");
  return `INV-${year}-${seq}`;
}
