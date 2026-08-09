import { describe, expect, it, vi } from 'vitest';
import { buildRawMessage, sendContactEmail } from '../../../src/lib/contact/gmail';

const credentials = {
  clientId: 'client-id',
  clientSecret: 'client-secret',
  refreshToken: 'refresh-token',
  sender: 'me@example.com',
};

const contact = {
  name: 'Jad',
  email: 'jad@example.com',
  topic: 'general',
  message: 'Hello there, this is a test message.',
};

describe('buildRawMessage', () => {
  it('produces a base64url-encoded MIME message with no padding characters', () => {
    const raw = buildRawMessage(credentials, contact);
    expect(raw).not.toContain('+');
    expect(raw).not.toContain('/');
    expect(raw).not.toContain('=');
  });

  it('embeds the sender as Reply-To so replies go to the actual submitter', () => {
    const raw = buildRawMessage(credentials, contact);
    const decoded = atob(raw.replace(/-/g, '+').replace(/_/g, '/'));
    expect(decoded).toContain(`Reply-To: ${contact.email}`);
  });
});

describe('sendContactEmail', () => {
  it('exchanges the refresh token then sends via the Gmail API', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: 'access-token' }),
      })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    await sendContactEmail(credentials, contact, fetchImpl as unknown as typeof fetch);

    expect(fetchImpl).toHaveBeenCalledTimes(2);
    const [sendUrl, sendOptions] = fetchImpl.mock.calls[1];
    expect(sendUrl).toContain('gmail.googleapis.com');
    expect(sendOptions.headers.authorization).toBe('Bearer access-token');
  });

  it('throws when the token exchange fails', async () => {
    const fetchImpl = vi.fn().mockResolvedValueOnce({ ok: false, json: async () => ({}) });
    await expect(
      sendContactEmail(credentials, contact, fetchImpl as unknown as typeof fetch)
    ).rejects.toThrow();
  });

  it('throws when the send request fails', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ access_token: 'access-token' }) })
      .mockResolvedValueOnce({ ok: false, json: async () => ({}) });
    await expect(
      sendContactEmail(credentials, contact, fetchImpl as unknown as typeof fetch)
    ).rejects.toThrow();
  });
});
