import { describe, expect, it, vi } from 'vitest';
import { verifyRecaptcha } from '../../../src/lib/contact/recaptcha';

function mockFetch(responseBody: unknown, ok = true): typeof fetch {
  return vi.fn().mockResolvedValue({
    ok,
    json: async () => responseBody,
  }) as unknown as typeof fetch;
}

describe('verifyRecaptcha', () => {
  it('returns false immediately for an empty token, without calling fetch', async () => {
    const fetchImpl = mockFetch({ success: true });
    const result = await verifyRecaptcha('', 'secret', '1.2.3.4', fetchImpl);
    expect(result.success).toBe(false);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('returns true when Google reports success', async () => {
    const fetchImpl = mockFetch({ success: true });
    const result = await verifyRecaptcha('token', 'secret', '1.2.3.4', fetchImpl);
    expect(result.success).toBe(true);
  });

  it('returns false when Google reports failure', async () => {
    const fetchImpl = mockFetch({ success: false });
    const result = await verifyRecaptcha('token', 'secret', '1.2.3.4', fetchImpl);
    expect(result.success).toBe(false);
  });

  it('returns false when the request itself fails', async () => {
    const fetchImpl = mockFetch({}, false);
    const result = await verifyRecaptcha('token', 'secret', '1.2.3.4', fetchImpl);
    expect(result.success).toBe(false);
  });
});
