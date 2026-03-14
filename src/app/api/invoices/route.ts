import { NextResponse, type NextRequest } from "next/server";
import { eq, desc, sql } from "drizzle-orm";
import { db, type Database } from "@/lib/db";
import { invoices, invoiceItems, clients, projects } from "@/lib/schema";
import { requireAdmin } from "@/lib/api-auth";
import { createInvoiceSchema } from "@/lib/invoice-validation";
import { sanitizeString } from "@/lib/sanitize";
import { decrypt } from "@/lib/encryption";

type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0];

async function generateInvoiceNumber(tx: Transaction): Promise<string> {
  const year = new Date().getFullYear();
  const [result] = await tx
    .select({ count: sql<number>`count(*)::int` })
    .from(invoices);
  const seq = (result.count + 1).toString().padStart(4, "0");
  return `INV-${year}-${seq}`;
}

const MAX_INVOICE_RETRIES = 3;

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { searchParams } = request.nextUrl;
  const statusFilter = searchParams.get("status");

  try {
    const query = db
      .select({
        id: invoices.id,
        invoiceNumber: invoices.invoiceNumber,
        clientId: invoices.clientId,
        projectId: invoices.projectId,
        status: invoices.status,
        issuedDate: invoices.issuedDate,
        dueDate: invoices.dueDate,
        paidDate: invoices.paidDate,
        subtotalCents: invoices.subtotalCents,
        taxRate: invoices.taxRate,
        taxCents: invoices.taxCents,
        totalCents: invoices.totalCents,
        notes: invoices.notes,
        createdAt: invoices.createdAt,
        clientName: clients.name,
        clientCompany: clients.company,
        projectName: projects.name,
      })
      .from(invoices)
      .leftJoin(clients, eq(invoices.clientId, clients.id))
      .leftJoin(projects, eq(invoices.projectId, projects.id))
      .orderBy(desc(invoices.createdAt));

    const rows =
      statusFilter &&
      ["draft", "sent", "paid", "overdue", "cancelled"].includes(statusFilter)
        ? await query.where(
            eq(
              invoices.status,
              statusFilter as "draft" | "sent" | "paid" | "overdue" | "cancelled"
            )
          )
        : await query;

    const data = rows.map((row) => ({
      ...row,
      clientName: row.clientName ? decrypt(row.clientName) : null,
    }));

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve invoices" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }

  const parsed = createInvoiceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Validation failed" },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const taxRate = data.taxRate ?? 0;

  const subtotalCents = data.items.reduce(
    (sum, item) => sum + Math.round(item.quantity * item.unitPriceCents),
    0
  );
  const taxCents = Math.round(subtotalCents * taxRate);
  const totalCents = subtotalCents + taxCents;

  try {
    // Retry loop to handle unique constraint violations on invoice number
    let lastError: unknown;
    for (let attempt = 0; attempt < MAX_INVOICE_RETRIES; attempt++) {
      try {
        const invoice = await db.transaction(async (tx) => {
          // Generate inside the transaction to avoid race conditions
          const invoiceNumber = await generateInvoiceNumber(tx);

          const [inv] = await tx
            .insert(invoices)
            .values({
              invoiceNumber,
              clientId: data.clientId,
              projectId: data.projectId ?? null,
              dueDate: new Date(data.dueDate),
              taxRate: taxRate.toString(),
              subtotalCents,
              taxCents,
              totalCents,
              notes: data.notes ? sanitizeString(data.notes) : null,
            })
            .returning();

          const itemRows = data.items.map((item, i) => ({
            invoiceId: inv.id,
            description: sanitizeString(item.description),
            quantity: item.quantity.toString(),
            unitPriceCents: item.unitPriceCents,
            totalCents: Math.round(item.quantity * item.unitPriceCents),
            sortOrder: i,
          }));

          await tx.insert(invoiceItems).values(itemRows);

          return inv;
        });

        return NextResponse.json({ success: true, data: invoice }, { status: 201 });
      } catch (err) {
        lastError = err;
        // Retry only on unique constraint violation (PostgreSQL error code 23505)
        const isUniqueViolation =
          err instanceof Error &&
          "code" in err &&
          (err as Error & { code: string }).code === "23505";
        if (!isUniqueViolation) throw err;
      }
    }

    throw lastError;
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}
