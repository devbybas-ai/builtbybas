import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import { env } from "./env";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// TODO: Replace console.error with structured logging (pino or winston)
// to capture pool errors with context (timestamp, severity, correlation ID)
// in production. See audit item li3.
pool.on("error", (err) => {
  if (process.env.NODE_ENV === "development") {
    console.error("Unexpected pool error:", err);
  }
});

export const db = drizzle(pool, { schema });

export type Database = typeof db;
