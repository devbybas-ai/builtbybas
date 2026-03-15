import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { invoices, invoiceItems, clients, projects } from "@/lib/schema";
import { hmacHash, decrypt } from "@/lib/encryption";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token || !/^[a-f0-9]{64}$/.test(token)) {
    return NextResponse.json(
      { success: false, error: "Invalid token" },
      { status: 400 }
    );
  }

  const hashedToken = hmacHash(token);

  try {
    const [invoice] = await db
      .select({
        id: invoices.id,
        invoiceNumber: invoices.invoiceNumber,
        status: invoices.status,
        issuedDate: invoices.issuedDate,
        dueDate: invoices.dueDate,
        paidDate: invoices.paidDate,
        subtotalCents: invoices.subtotalCents,
        taxRate: invoices.taxRate,
        taxCents: invoices.taxCents,
        totalCents: invoices.totalCents,
        notes: invoices.notes,
        paymentMethod: invoices.paymentMethod,
        clientName: clients.name,
        clientCompany: clients.company,
        projectName: projects.name,
      })
      .from(invoices)
      .leftJoin(clients, eq(invoices.clientId, clients.id))
      .leftJoin(projects, eq(invoices.projectId, projects.id))
      .where(eq(invoices.token, hashedToken))
      .limit(1);

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: "Invoice not found" },
        { status: 404 }
      );
    }

    const items = await db
      .select({
        description: invoiceItems.description,
        quantity: invoiceItems.quantity,
        unitPriceCents: invoiceItems.unitPriceCents,
        totalCents: invoiceItems.totalCents,
        sortOrder: invoiceItems.sortOrder,
      })
      .from(invoiceItems)
      .where(eq(invoiceItems.invoiceId, invoice.id))
      .orderBy(invoiceItems.sortOrder);

    const decryptedInvoice = {
      ...invoice,
      clientName: invoice.clientName ? decrypt(invoice.clientName) : null,
    };

    return NextResponse.json({
      success: true,
      invoice: decryptedInvoice,
      items,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve invoice" },
      { status: 500 }
    );
  }
}
