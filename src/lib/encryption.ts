import { createCipheriv, createDecipheriv, randomBytes, createHmac } from "crypto";
import { env } from "./env";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const TAG_LENGTH = 16;
const PREFIX = "enc:v1:";

function getKey(): Buffer {
  const buf = Buffer.from(env.ENCRYPTION_KEY, "base64");
  if (buf.length !== 32) {
    throw new Error("ENCRYPTION_KEY must be exactly 32 bytes (base64-encoded)");
  }
  return buf;
}

/**
 * Encrypt a plaintext string using AES-256-GCM.
 * Returns: `enc:v1:{base64_iv}:{base64_ciphertext}:{base64_tag}`
 */
export function encrypt(plaintext: string): string {
  if (!plaintext) return plaintext;

  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: TAG_LENGTH });

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return `${PREFIX}${iv.toString("base64")}:${encrypted.toString("base64")}:${tag.toString("base64")}`;
}

/**
 * Decrypt an encrypted string produced by `encrypt()`.
 * If the value is not encrypted (no prefix), returns it as-is (backwards compatibility).
 */
export function decrypt(value: string): string {
  if (!value || !isEncrypted(value)) return value;

  const key = getKey();
  const parts = value.slice(PREFIX.length).split(":");

  if (parts.length !== 3) {
    throw new Error("Invalid encrypted value format");
  }

  const iv = Buffer.from(parts[0], "base64");
  const encrypted = Buffer.from(parts[1], "base64");
  const tag = Buffer.from(parts[2], "base64");

  const decipher = createDecipheriv(ALGORITHM, key, iv, { authTagLength: TAG_LENGTH });
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

/**
 * Check if a value is encrypted (has the enc:v1: prefix).
 */
export function isEncrypted(value: string): boolean {
  return typeof value === "string" && value.startsWith(PREFIX);
}

/**
 * Derive a separate HMAC key from the encryption key.
 * Uses HMAC with a fixed label to achieve key separation without a new env var.
 */
function getHmacKey(): Buffer {
  const encKey = getKey();
  return Buffer.from(
    createHmac("sha256", encKey).update("builtbybas-hmac-key").digest()
  );
}

/**
 * Deterministic HMAC-SHA256 hash for indexed lookups (e.g., email dedup).
 * Uses a derived key separate from the AES encryption key.
 */
export function hmacHash(value: string): string {
  const key = getHmacKey();
  return createHmac("sha256", key).update(value.toLowerCase()).digest("hex");
}

/**
 * Encrypt PII fields on an IntakeAnalysis-like object.
 * Encrypts formData.name, formData.email, formData.phone within the nested structure.
 */
export function encryptAnalysisPii<T extends { formData: { name: string; email: string; phone: string } }>(
  analysis: T
): T {
  return {
    ...analysis,
    formData: {
      ...analysis.formData,
      name: encrypt(analysis.formData.name),
      email: encrypt(analysis.formData.email),
      phone: encrypt(analysis.formData.phone),
    },
  };
}

/**
 * Decrypt PII fields on an IntakeAnalysis-like object.
 * Handles both encrypted and plaintext values (backwards compatible).
 */
export function decryptAnalysisPii<T extends { formData: { name: string; email: string; phone: string } }>(
  analysis: T
): T {
  return {
    ...analysis,
    formData: {
      ...analysis.formData,
      name: decrypt(analysis.formData.name),
      email: decrypt(analysis.formData.email),
      phone: decrypt(analysis.formData.phone),
    },
  };
}
