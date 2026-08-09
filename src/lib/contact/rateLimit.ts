export const RATE_LIMIT_WINDOW_SECONDS = 60 * 60;
export const RATE_LIMIT_MAX_SUBMISSIONS = 5;

export interface RateLimitKV {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

export async function checkRateLimit(kv: RateLimitKV, identifier: string): Promise<boolean> {
  const key = `contact-form:${identifier}`;
  const current = await kv.get(key);
  const count = current ? Number.parseInt(current, 10) : 0;

  if (count >= RATE_LIMIT_MAX_SUBMISSIONS) {
    return false;
  }

  await kv.put(key, String(count + 1), { expirationTtl: RATE_LIMIT_WINDOW_SECONDS });
  return true;
}
