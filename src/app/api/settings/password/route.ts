import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { requireAdmin } from "@/lib/api-auth";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { verifyPassword, hashPassword } from "@/lib/auth";

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(128),
});

export async function PATCH(request: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 },
    );
  }

  const parsed = passwordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Validation failed" },
      { status: 400 },
    );
  }

  const { currentPassword, newPassword } = parsed.data;

  // Fetch current password hash
  const [row] = await db
    .select({ passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.id, auth.user.id))
    .limit(1);

  if (!row) {
    return NextResponse.json(
      { success: false, error: "User not found" },
      { status: 404 },
    );
  }

  const valid = await verifyPassword(currentPassword, row.passwordHash);
  if (!valid) {
    return NextResponse.json(
      { success: false, error: "Current password is incorrect" },
      { status: 403 },
    );
  }

  const newHash = await hashPassword(newPassword);
  await db
    .update(users)
    .set({ passwordHash: newHash, updatedAt: new Date() })
    .where(eq(users.id, auth.user.id));

  return NextResponse.json({ success: true });
}
