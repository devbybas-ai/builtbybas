import { NextResponse, type NextRequest } from "next/server";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { clientNotes, users } from "@/lib/schema";
import { requireAdmin } from "@/lib/api-auth";
import { createNoteSchema } from "@/lib/client-validation";
import { sanitizeString } from "@/lib/sanitize";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  if (!/^[a-f0-9-]+$/i.test(id)) {
    return NextResponse.json(
      { success: false, error: "Invalid client ID" },
      { status: 400 }
    );
  }

  try {
    const notes = await db
      .select({
        id: clientNotes.id,
        clientId: clientNotes.clientId,
        authorId: clientNotes.authorId,
        type: clientNotes.type,
        content: clientNotes.content,
        createdAt: clientNotes.createdAt,
        updatedAt: clientNotes.updatedAt,
        authorName: users.name,
      })
      .from(clientNotes)
      .leftJoin(users, eq(clientNotes.authorId, users.id))
      .where(eq(clientNotes.clientId, id))
      .orderBy(desc(clientNotes.createdAt));

    const data = notes.map((n) => ({
      ...n,
      author: { id: n.authorId, name: n.authorName },
      authorName: undefined,
    }));

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve notes" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  if (!/^[a-f0-9-]+$/i.test(id)) {
    return NextResponse.json(
      { success: false, error: "Invalid client ID" },
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

  const parsed = createNoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Validation failed" },
      { status: 400 }
    );
  }

  try {
    const [note] = await db
      .insert(clientNotes)
      .values({
        clientId: id,
        authorId: auth.user.id,
        type: parsed.data.type ?? "general",
        content: sanitizeString(parsed.data.content),
      })
      .returning();

    return NextResponse.json({ success: true, data: note }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create note" },
      { status: 500 }
    );
  }
}
