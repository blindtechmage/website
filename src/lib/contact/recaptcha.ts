const VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

export interface RecaptchaVerifyResult {
  success: boolean;
}

export async function verifyRecaptcha(
  token: string,
  secret: string,
  remoteIp: string | undefined,
  fetchImpl: typeof fetch = fetch
): Promise<RecaptchaVerifyResult> {
  if (!token) {
    return { success: false };
  }

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) {
    body.set('remoteip', remoteIp);
  }

  const response = await fetchImpl(VERIFY_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!response.ok) {
    return { success: false };
  }

  const data = (await response.json()) as { success?: boolean };
  return { success: data.success === true };
}
