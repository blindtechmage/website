/// <reference types="astro/client" />
/// <reference types="@cloudflare/workers-types" />

declare namespace Cloudflare {
  interface Env {
    RATE_LIMIT: KVNamespace;
    EMAIL: SendEmail;
    CONTACT_SENDER: string;
    CONTACT_RECIPIENT: string;
    RECAPTCHA_SECRET: string;
  }
}
