import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from '../../../src/pages/api/contact';
import { env } from '../../../tests/shims/cloudflare-workers';

type Handler = typeof POST;
type Context = Parameters<Handler>[0];

function makeRequest(fields: Record<string, string>): Request {
  const body = new URLSearchParams(fields);
  return new Request('https://blindtechmage.com/api/contact', {
    method: 'POST',
    body,
  });
}

function makeContext(fields: Record<string, string>): Context {
  return {
    request: makeRequest(fields),
    clientAddress: '203.0.113.7',
  } as unknown as Context;
}

const validFields = {
  name: 'Jad',
  email: 'jad@example.com',
  topic: 'general',
  message: 'This is a long enough message to pass validation checks.',
  'g-recaptcha-response': 'valid-token',
};

describe('POST /api/contact', () => {
  let kvStore: Map<string, string>;
  let emailSend: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    kvStore = new Map();
    emailSend = vi.fn().mockResolvedValue(undefined);

    env.RECAPTCHA_SECRET = 'recaptcha-secret';
    env.CONTACT_SENDER = 'notify@blindtechmage.com';
    env.CONTACT_RECIPIENT = 'blindtechmage+jwauthier@gmail.com';
    env.RATE_LIMIT = {
      get: vi.fn((key: string) => Promise.resolve(kvStore.get(key) ?? null)),
      put: vi.fn((key: string, value: string) => {
        kvStore.set(key, value);
        return Promise.resolve();
      }),
    } as unknown as Cloudflare.Env['RATE_LIMIT'];
    env.EMAIL = { send: emailSend } as unknown as Cloudflare.Env['EMAIL'];

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends an email through the EMAIL binding for a valid submission', async () => {
    const response = await POST(makeContext(validFields));
    const body = (await response.json()) as { ok: boolean };

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(emailSend).toHaveBeenCalledTimes(1);

    const [message] = emailSend.mock.calls[0] as [{ from: string; to: string }];
    expect(message.from).toBe(env.CONTACT_SENDER);
    expect(message.to).toBe(env.CONTACT_RECIPIENT);
  });

  it('rejects an invalid submission without sending an email', async () => {
    const response = await POST(makeContext({ ...validFields, email: 'not-an-email' }));

    expect(response.status).toBe(400);
    expect(emailSend).not.toHaveBeenCalled();
  });

  it('rejects a submission that fails reCAPTCHA without sending an email', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: false }),
      })
    );

    const response = await POST(makeContext(validFields));

    expect(response.status).toBe(400);
    expect(emailSend).not.toHaveBeenCalled();
  });

  it('silently accepts a honeypot-triggered submission without sending an email', async () => {
    const response = await POST(makeContext({ ...validFields, website: 'i-am-a-bot' }));
    const body = (await response.json()) as { ok: boolean };

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(emailSend).not.toHaveBeenCalled();
  });

  it('rejects submissions once the rate limit is exceeded', async () => {
    for (let i = 0; i < 5; i += 1) {
      await POST(makeContext(validFields));
    }
    emailSend.mockClear();

    const response = await POST(makeContext(validFields));

    expect(response.status).toBe(429);
    expect(emailSend).not.toHaveBeenCalled();
  });

  it('returns a 502 and does not swallow the error when sending fails', async () => {
    emailSend.mockRejectedValueOnce(new Error('binding unavailable'));

    const response = await POST(makeContext(validFields));
    const body = (await response.json()) as { ok: boolean };

    expect(response.status).toBe(502);
    expect(body.ok).toBe(false);
  });
});
