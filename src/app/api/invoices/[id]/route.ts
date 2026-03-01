import { NextResponse, type NextRequest } from "next/server";
import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { invoices, invoiceItems, clients, projects } from "@/lib/schema";
import { requireAdmin } from "@/lib/api-auth";
import { updateInvoiceSchema } from "@/lib/invoice-validation";
import { sanitizeString } from "@/lib/sanitize";
import { decrypt } from "@/lib/encryption";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  if (!/^[a-f0-9-]+$/i.test(id)) {
    return NextResponse.json(
      { success: false, error: "Invalid invoice ID" },
      { status: 400 }
    );
  }

  try {
    const [invoice] = await db
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
        updatedAt: invoices.updatedAt,
        clientName: clients.name,
        clientCompany: clients.company,
        clientEmail: clients.email,
        projectName: projects.name,
      })
      .from(invoices)
      .leftJoin(clients, eq(invoices.clientId, clients.id))
      .leftJoin(projects, eq(invoices.projectId, projects.id))
      .where(eq(invoices.id, id))
      .limit(1);

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: "Invoice not found" },
        { status: 404 }
      );
    }

    const items = await db
      .select()
      .from(invoiceItems)
      .where(eq(invoiceItems.invoiceId, id))
      .orderBy(asc(invoiceItems.sortOrder));

    return NextResponse.json({
      success: true,
      data: {
        ...invoice,
        clientName: invoice.clientName ? decrypt(invoice.clientName) : null,
        clientEmail: invoice.clientEmail ? decrypt(invoice.clientEmail) : null,
        items,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve invoice" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  if (!/^[a-f0-9-]+$/i.test(id)) {
    return NextResponse.json(
      { success: false, error: "Invalid invoice ID" },
      { status: 400 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }

  const parsed = updateInvoiceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Validation failed" },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const updates: Record<string, unknown> = { updatedAt: new Date() };

  if (data.status !== undefined) {
    updates.status = data.status;
    if (data.status === "paid") updates.paidDate = new Date();
  }
  if (data.dueDate !== undefined) updates.dueDate = new Date(data.dueDate);
  if (data.notes !== undefined)
    updates.notes = data.notes ? sanitizeString(data.notes) : null;

  if (data.items) {
    const taxRate = data.taxRate ?? 0;
    const subtotalCents = data.items.reduce(
      (sum, item) => sum + Math.round(item.quantity * item.unitPriceCents),
      0
    );
    const taxCents = Math.round(subtotalCents * taxRate);
    updates.subtotalCents = subtotalCents;
    updates.taxCents = taxCents;
    updates.totalCents = subtotalCents + taxCents;
    if (data.taxRate !== undefined) updates.taxRate = taxRate.toString();
  }

  try {
    const [updated] = await db
      .update(invoices)
      .set(updates)
      .where(eq(invoices.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Invoice not found" },
        { status: 404 }
      );
    }

    if (data.items) {
      await db.delete(invoiceItems).where(eq(invoiceItems.invoiceId, id));
      const itemRows = data.items.map((item, i) => ({
        invoiceId: id,
        description: sanitizeString(item.description),
        quantity: item.quantity.toString(),
        unitPriceCents: item.unitPriceCents,
        totalCents: Math.round(item.quantity * item.unitPriceCents),
        sortOrder: i,
      }));
      await db.insert(invoiceItems).values(itemRows);
    }

    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update invoice" },
      { status: 500 }
    );
  }
}
