import { cookies } from "next/headers";
import { eq, and, gt } from "drizzle-orm";
import bcryptjs from "bcryptjs";
import { db } from "./db";
import { users, sessions } from "./schema";
import type { SafeUser, SessionPayload } from "@/types/auth";

const SESSION_COOKIE = "builtbybas_session";
const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds
const BCRYPT_ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcryptjs.hash(plain, BCRYPT_ROUNDS);
}

export async function verifyPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  return bcryptjs.compare(plain, hash);
}

export async function createSession(userId: string): Promise<string> {
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);

  const [session] = await db
    .insert(sessions)
    .values({ userId, expiresAt })
    .returning({ id: sessions.id });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return session.id;
}

export async function getSession(): Promise<SafeUser | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionId) return null;

  const result = await db
    .select({
      sessionId: sessions.id,
      userId: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      expiresAt: sessions.expiresAt,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(
      and(eq(sessions.id, sessionId), gt(sessions.expiresAt, new Date()))
    )
    .limit(1);

  if (result.length === 0) {
    await destroySession();
    return null;
  }

  return {
    id: result[0].userId,
    email: result[0].email,
    name: result[0].name,
    role: result[0].role,
  };
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (sessionId) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
  }

  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}

export function getSessionPayload(user: SafeUser, sessionId: string): SessionPayload {
  return {
    sessionId,
    userId: user.id,
    role: user.role,
    expiresAt: Date.now() + SESSION_MAX_AGE * 1000,
  };
}
