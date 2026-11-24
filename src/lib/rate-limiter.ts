interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;
export const MAX_MESSAGE_LENGTH = 500;

class InMemoryRateLimiter {
  private records = new Map<string, RateLimitRecord>();

  check(ip: string): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
    const now = Date.now();
    const cleanIp = ip || "unknown-ip";
    const record = this.records.get(cleanIp);

    // Evict old records periodically
    if (this.records.size > 2000) {
      for (const [k, v] of this.records.entries()) {
        if (now > v.resetAt) {
          this.records.delete(k);
        }
      }
    }

    if (!record || now > record.resetAt) {
      this.records.set(cleanIp, {
        count: 1,
        resetAt: now + WINDOW_MS,
      });
      return {
        allowed: true,
        remaining: MAX_REQUESTS_PER_WINDOW - 1,
        retryAfterSeconds: 0,
      };
    }

    if (record.count >= MAX_REQUESTS_PER_WINDOW) {
      const retryAfter = Math.ceil((record.resetAt - now) / 1000);
      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds: Math.max(1, retryAfter),
      };
    }

    record.count++;
    return {
      allowed: true,
      remaining: MAX_REQUESTS_PER_WINDOW - record.count,
      retryAfterSeconds: 0,
    };
  }
}

export const rateLimiter = new InMemoryRateLimiter();
