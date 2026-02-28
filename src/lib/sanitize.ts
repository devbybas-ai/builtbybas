const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (char) => HTML_ENTITIES[char] || char);
}

export function sanitizeString(str: string): string {
  return escapeHtml(str.trim());
}

export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  allowedKeys: Set<string>
): Partial<T> {
  const sanitized: Record<string, unknown> = {};

  for (const key of Object.keys(obj)) {
    if (!allowedKeys.has(key)) continue;

    const value = obj[key];
    if (typeof value === "string") {
      sanitized[key] = sanitizeString(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as Partial<T>;
}
