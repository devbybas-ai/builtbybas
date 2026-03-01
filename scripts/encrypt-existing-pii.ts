/**
 * One-time migration: encrypt existing plaintext PII in the database.
 * Run with: npx tsx scripts/encrypt-existing-pii.ts
 *
 * Safe to run multiple times — skips already-encrypted values.
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { encrypt, isEncrypted } from "../src/lib/encryption";
import { clients, intakeSubmissions } from "../src/lib/schema";
import { eq } from "drizzle-orm";

const { Pool } = pg;

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  console.log("Encrypting existing PII data...\n");

  // --- Clients ---
  const allClients = await db
    .select({
      id: clients.id,
      name: clients.name,
      email: clients.email,
      phone: clients.phone,
    })
    .from(clients);

  let clientsUpdated = 0;
  for (const c of allClients) {
    const updates: Record<string, string | null> = {};

    if (c.name && !isEncrypted(c.name)) updates.name = encrypt(c.name);
    if (c.email && !isEncrypted(c.email)) updates.email = encrypt(c.email);
    if (c.phone && !isEncrypted(c.phone)) updates.phone = encrypt(c.phone);

    if (Object.keys(updates).length > 0) {
      await db.update(clients).set(updates).where(eq(clients.id, c.id));
      clientsUpdated++;
    }
  }
  console.log(`  Clients: ${clientsUpdated}/${allClients.length} encrypted`);

  // --- Intake Submissions ---
  const allIntakes = await db
    .select({
      id: intakeSubmissions.id,
      name: intakeSubmissions.name,
      email: intakeSubmissions.email,
      analysis: intakeSubmissions.analysis,
      formData: intakeSubmissions.formData,
    })
    .from(intakeSubmissions);

  let intakesUpdated = 0;
  for (const intake of allIntakes) {
    const updates: Record<string, unknown> = {};

    // Encrypt denormalized columns
    if (intake.name && !isEncrypted(intake.name))
      updates.name = encrypt(intake.name);
    if (intake.email && !isEncrypted(intake.email))
      updates.email = encrypt(intake.email);

    // Encrypt PII within JSONB analysis
    const analysis = intake.analysis as Record<string, unknown> | null;
    if (analysis) {
      const formData = (analysis as { formData?: Record<string, unknown> }).formData;
      if (formData) {
        let changed = false;
        const updatedFormData = { ...formData };

        if (typeof formData.name === "string" && formData.name && !isEncrypted(formData.name)) {
          updatedFormData.name = encrypt(formData.name);
          changed = true;
        }
        if (typeof formData.email === "string" && formData.email && !isEncrypted(formData.email)) {
          updatedFormData.email = encrypt(formData.email);
          changed = true;
        }
        if (typeof formData.phone === "string" && formData.phone && !isEncrypted(formData.phone)) {
          updatedFormData.phone = encrypt(formData.phone);
          changed = true;
        }

        if (changed) {
          updates.analysis = { ...analysis, formData: updatedFormData };
          updates.formData = updatedFormData;
        }
      }
    }

    if (Object.keys(updates).length > 0) {
      await db
        .update(intakeSubmissions)
        .set(updates)
        .where(eq(intakeSubmissions.id, intake.id));
      intakesUpdated++;
    }
  }
  console.log(
    `  Intake submissions: ${intakesUpdated}/${allIntakes.length} encrypted`
  );

  console.log("\nDone. PII fields are now encrypted at rest.");
  await pool.end();
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
