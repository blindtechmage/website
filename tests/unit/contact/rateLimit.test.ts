import { describe, expect, it } from 'vitest';
import {
  checkRateLimit,
  RATE_LIMIT_MAX_SUBMISSIONS,
  type RateLimitKV,
} from '../../../src/lib/contact/rateLimit';

function createFakeKV(initial: Record<string, string> = {}): RateLimitKV {
  const store = new Map(Object.entries(initial));
  return {
    async get(key) {
      return store.get(key) ?? null;
    },
    async put(key, value) {
      store.set(key, value);
    },
  };
}

describe('checkRateLimit', () => {
  it('allows the first submission from a new identifier', async () => {
    const kv = createFakeKV();
    expect(await checkRateLimit(kv, '1.2.3.4')).toBe(true);
  });

  it('allows submissions up to the configured maximum', async () => {
    const kv = createFakeKV();
    for (let i = 0; i < RATE_LIMIT_MAX_SUBMISSIONS; i += 1) {
      expect(await checkRateLimit(kv, '1.2.3.4')).toBe(true);
    }
  });

  it('rejects submissions beyond the configured maximum', async () => {
    const kv = createFakeKV({ 'contact-form:1.2.3.4': String(RATE_LIMIT_MAX_SUBMISSIONS) });
    expect(await checkRateLimit(kv, '1.2.3.4')).toBe(false);
  });

  it('tracks identifiers independently', async () => {
    const kv = createFakeKV({ 'contact-form:1.2.3.4': String(RATE_LIMIT_MAX_SUBMISSIONS) });
    expect(await checkRateLimit(kv, '5.6.7.8')).toBe(true);
  });
});
