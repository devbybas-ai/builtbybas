/**
 * Seed script — creates the owner user (Bas Rosario) for local development.
 *
 * Usage: pnpm db:seed
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { hash } from "bcryptjs";
import { users } from "../src/lib/schema";
import { eq } from "drizzle-orm";

const BCRYPT_ROUNDS = 12;

async function seed() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  const email = "devbybas@gmail.com";

  // Check if owner already exists
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing.length > 0) {
    console.log(`Owner user already exists (${email}). Skipping.`);
    await pool.end();
    return;
  }

  const passwordHash = await hash("BuiltByBas2026!", BCRYPT_ROUNDS);

  const [owner] = await db
    .insert(users)
    .values({
      email,
      passwordHash,
      name: "Bas Rosario",
      role: "owner",
    })
    .returning({ id: users.id, email: users.email, role: users.role });

  console.log(`Owner user created:`);
  console.log(`  ID:    ${owner.id}`);
  console.log(`  Email: ${owner.email}`);
  console.log(`  Role:  ${owner.role}`);
  console.log(`  Pass:  BuiltByBas2026!`);

  await pool.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
