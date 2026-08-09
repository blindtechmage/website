const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SEND_URL = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';

export interface GmailCredentials {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  sender: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  topic: string;
  message: string;
}

function base64UrlEncode(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function buildRawMessage(credentials: GmailCredentials, contact: ContactMessage): string {
  const lines = [
    `From: ${credentials.sender}`,
    `To: ${credentials.sender}`,
    `Reply-To: ${contact.email}`,
    `Subject: BlindTechMage contact form: ${contact.topic}`,
    'Content-Type: text/plain; charset=utf-8',
    '',
    `Name: ${contact.name}`,
    `Email: ${contact.email}`,
    `Topic: ${contact.topic}`,
    '',
    contact.message,
  ];
  return base64UrlEncode(lines.join('\r\n'));
}

async function getAccessToken(
  credentials: GmailCredentials,
  fetchImpl: typeof fetch
): Promise<string> {
  const response = await fetchImpl(TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
      refresh_token: credentials.refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to obtain Gmail access token: ${response.status}`);
  }

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new Error('Gmail token response did not include an access token.');
  }
  return data.access_token;
}

export async function sendContactEmail(
  credentials: GmailCredentials,
  contact: ContactMessage,
  fetchImpl: typeof fetch = fetch
): Promise<void> {
  const accessToken = await getAccessToken(credentials, fetchImpl);
  const raw = buildRawMessage(credentials, contact);

  const response = await fetchImpl(SEND_URL, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ raw }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send contact email: ${response.status}`);
  }
}
