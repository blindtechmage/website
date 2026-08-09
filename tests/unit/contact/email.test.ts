import { describe, expect, it, vi } from 'vitest';
import { buildMimeMessage, sendContactEmail } from '../../../src/lib/contact/email';

const config = {
  sender: 'notify@blindtechmage.com',
  recipient: 'blindtechmage+jwauthier@gmail.com',
};

const contact = {
  name: 'Jad',
  email: 'jad@example.com',
  topic: 'general',
  message: 'Hello there, this is a test message.',
};

describe('buildMimeMessage', () => {
  it('embeds the sender as Reply-To so replies go to the actual submitter', () => {
    const raw = buildMimeMessage(config, contact);
    expect(raw).toContain(`Reply-To: <${contact.email}>`);
  });

  it('includes the contact message body', () => {
    const raw = buildMimeMessage(config, contact);
    expect(raw).toContain(contact.message);
  });
});

describe('sendContactEmail', () => {
  it('sends an EmailMessage through the provided binding', async () => {
    const send = vi.fn().mockResolvedValue(undefined);
    await sendContactEmail({ send } as unknown as SendEmail, config, contact);

    expect(send).toHaveBeenCalledTimes(1);
  });

  it('propagates errors from the binding', async () => {
    const send = vi.fn().mockRejectedValue(new Error('send failed'));
    await expect(
      sendContactEmail({ send } as unknown as SendEmail, config, contact)
    ).rejects.toThrow('send failed');
  });
});
