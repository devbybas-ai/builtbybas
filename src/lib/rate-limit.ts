/**
 * Reusable in-memory rate limiter.
 *
 * Each instance maintains its own Map of IP -> attempt records.
 * Expired entries are pruned on every check to prevent unbounded growth.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

interface RateLimiterOptions {
  /** Maximum attempts allowed within the window */
  maxAttempts: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

export class RateLimiter {
  private attempts = new Map<string, RateLimitRecord>();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(options: RateLimiterOptions) {
    this.maxAttempts = options.maxAttempts;
    this.windowMs = options.windowMs;
  }

  /**
   * Check if the given key (typically an IP) is within the rate limit.
   * Returns true if the request is allowed, false if rate-limited.
   * Automatically prunes expired entries on each call.
   */
  check(key: string): boolean {
    const now = Date.now();

    // Prune expired entries to prevent unbounded memory growth
    this.pruneExpired(now);

    const record = this.attempts.get(key);

    if (!record || now > record.resetAt) {
      this.attempts.set(key, { count: 1, resetAt: now + this.windowMs });
      return true;
    }

    if (record.count >= this.maxAttempts) {
      return false;
    }

    record.count++;
    return true;
  }

  /** Remove all entries whose window has expired. */
  private pruneExpired(now: number): void {
    for (const [key, record] of this.attempts) {
      if (now > record.resetAt) {
        this.attempts.delete(key);
      }
    }
  }
}
