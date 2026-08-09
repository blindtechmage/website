import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { validateContactForm } from '../../lib/contact/validation';
import { verifyRecaptcha } from '../../lib/contact/recaptcha';
import { checkRateLimit } from '../../lib/contact/rateLimit';
import { sendContactEmail } from '../../lib/contact/gmail';

export const prerender = false;

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const formData = await request.formData();

  // Honeypot: real users never see or fill this field. If it's populated,
  // reject without revealing that detection occurred.
  const honeypot = String(formData.get('website') ?? '');
  if (honeypot.trim() !== '') {
    return jsonResponse({ ok: true }, 200);
  }

  const input = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    topic: String(formData.get('topic') ?? ''),
    message: String(formData.get('message') ?? ''),
  };

  const validation = validateContactForm(input);
  if (!validation.valid) {
    return jsonResponse({ ok: false, errors: validation.errors }, 400);
  }

  const recaptchaToken = String(formData.get('g-recaptcha-response') ?? '');
  const recaptchaResult = await verifyRecaptcha(
    recaptchaToken,
    env.RECAPTCHA_SECRET,
    clientAddress
  );
  if (!recaptchaResult.success) {
    return jsonResponse(
      { ok: false, errors: { recaptcha: 'Please complete the checkbox verification.' } },
      400
    );
  }

  const withinLimit = await checkRateLimit(env.RATE_LIMIT, clientAddress ?? 'unknown');
  if (!withinLimit) {
    return jsonResponse(
      { ok: false, errors: { form: 'Too many submissions. Please try again later.' } },
      429
    );
  }

  try {
    await sendContactEmail(
      {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        refreshToken: env.GOOGLE_REFRESH_TOKEN,
        sender: env.GMAIL_SENDER,
      },
      input
    );
  } catch {
    return jsonResponse(
      { ok: false, errors: { form: 'Something went wrong sending your message. Please try again.' } },
      502
    );
  }

  return jsonResponse({ ok: true }, 200);
};
