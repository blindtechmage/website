import { EmailMessage } from 'cloudflare:email';
import { createMimeMessage, Mailbox } from 'mimetext';

export interface EmailConfig {
  sender: string;
  recipient: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  topic: string;
  message: string;
}

export function buildMimeMessage(config: EmailConfig, contact: ContactMessage): string {
  const msg = createMimeMessage();
  msg.setSender({ addr: config.sender });
  msg.setRecipient(config.recipient);
  msg.setHeader('Reply-To', new Mailbox({ addr: contact.email }, { type: 'From' }));
  msg.setSubject(`BlindTechMage contact form: ${contact.topic}`);
  msg.addMessage({
    contentType: 'text/plain',
    data: [
      `Name: ${contact.name}`,
      `Email: ${contact.email}`,
      `Topic: ${contact.topic}`,
      '',
      contact.message,
    ].join('\n'),
  });
  return msg.asRaw();
}

export async function sendContactEmail(
  binding: SendEmail,
  config: EmailConfig,
  contact: ContactMessage
): Promise<void> {
  const raw = buildMimeMessage(config, contact);
  const message = new EmailMessage(config.sender, config.recipient, raw);
  await binding.send(message);
}
