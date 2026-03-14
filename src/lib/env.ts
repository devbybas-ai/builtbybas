import { z } from "zod/v4";

const isTest = process.env.NODE_ENV === "test" || process.env.VITEST === "true";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  ENCRYPTION_KEY: z.string().min(32, "ENCRYPTION_KEY must be at least 32 characters"),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  ADMIN_EMAIL: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().optional(),
});

type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    if (isTest) {
      return {
        DATABASE_URL: process.env.DATABASE_URL ?? "postgresql://test:test@localhost:5432/test",
        ENCRYPTION_KEY: process.env.ENCRYPTION_KEY ?? "a]U9Qx!L7$Zm3pN&kR2vW8dF0hJ5tB4y",
      } as Env;
    }
    const issues = parsed.error.issues.map(
      (i) => `  - ${i.path.join(".")}: ${i.message}`
    ).join("\n");
    throw new Error(`Environment validation failed:\n${issues}`);
  }
  return parsed.data;
}

export const env = validateEnv();
