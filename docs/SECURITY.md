# BlindTechMage.com — Security Document

## Purpose

Security is a release gate for this project, alongside accessibility, not a
follow-up task. Any change touching stored content, the contact form,
authentication/admin access, or a third-party API call is checked against this
document before being considered complete. Inconsistencies discovered between an
implementation and this document's requirements are stop-and-consult items.

## Data Classification

* **Public data** — content in domain-specific D1 tables (ham radio resources,
  blindness-related resources, project details) that is explicitly intended for
  public display, and general site content.
* **Private data** — anything not explicitly marked and intended for public
  display: personal notes, draft content, work-in-progress project details,
  contact form submissions.

Public and private data are kept in structurally separate tables/columns, not
merely distinguished by a status flag queried by the same code path. Public-facing
API routes are written so that they cannot reach private tables at all, rather than
relying on a filter to exclude private rows.

## Authentication and Admin Access

* Any route that writes to D1, or reads private data, is gated behind Cloudflare
  Access.
* No custom-rolled authentication/session system. Cloudflare Access handles
  identity verification for admin routes.
* Public API routes require no authentication and only ever query public tables.

## Credential and Secret Handling

* No project bundles or hardcodes API keys, tokens, database credentials, or OAuth
  application secrets.
* Cloudflare's native secrets/bindings mechanism is used for D1 access and any
  third-party service credentials (e.g. an email delivery service for the contact
  form).
* No real or placeholder-looking credentials, tokens, or `.env`-style files are
  ever committed to the repository. Documentation and examples use clearly fake
  placeholder values only.

## Contact Form

* The contact form is a public, unauthenticated endpoint and is treated as an
  abuse surface. Implemented protections, layered:
  * Server-side input validation on all fields (name, email format, topic
    against an allowed list, minimum message length), independent of the
    client-side validation in the page itself.
  * A honeypot field (`website`), hidden from sighted and assistive-technology
    users alike (`aria-hidden`, visually off-screen, not part of the tab
    order). A populated honeypot is silently rejected without revealing that
    detection occurred.
  * Google reCAPTCHA v2 (checkbox variant, not the distorted-text challenge).
    Chosen over reCAPTCHA v3 specifically because v3's behavioral scoring has
    a documented history of penalizing atypical interaction patterns,
    including keyboard-only and screen-reader-driven navigation — a real risk
    given this site's audience. The checkbox variant can still occasionally
    escalate to a secondary challenge for sessions Google's own risk engine
    flags, which is outside this project's control; Google provides an audio
    alternative for that case. This is a third-party script that sends
    visitor behavioral data to Google — treated as the explicit third-party
    tracking decision called for above, not a default.
  * Rate limiting via a Cloudflare KV-backed counter, keyed by client IP
    (`src/lib/contact/rateLimit.ts`), capped per time window.
* Submitted data is not publicly queryable and is not exposed through any public
  API route. Messages are relayed via the Gmail API (OAuth2, not raw SMTP —
  Cloudflare Workers does not reliably support raw SMTP), using credentials
  supplied by the primary contributor, stored as Cloudflare Worker secrets.
* All four contact-form logic modules (validation, reCAPTCHA verification,
  rate limiting, Gmail send) are pure/testable and have unit test coverage,
  per the CI policy in `PROJECT.md`.

## Third-Party Services

* Any third-party API or service integration (e.g. email delivery) is evaluated
  for its own data-handling practices before adoption, since contact form
  submissions may contain personal information.
* No third-party analytics or tracking script is added without an explicit design
  decision, given this site's accessibility and privacy-conscious positioning.

## Dependency Risk

* Any dependency that is unmaintained, deprecated, or otherwise at risk is flagged
  at the point of choosing it, per the project conventions document, with a note to
  re-validate the choice when work in that area actually begins.

## Open Items

* The contact form's KV namespace (`RATE_LIMIT`), Gmail API OAuth2
  credentials, and reCAPTCHA site/secret key pair are not yet provisioned.
  All three require manual setup outside this repository (Cloudflare KV
  namespace creation; a Google Cloud project with Gmail API enabled and an
  OAuth consent flow run once to obtain a refresh token; reCAPTCHA site
  registration in Google's admin console) before the contact form is
  functional in production. The code is written against these as named
  bindings/secrets (see `wrangler.toml`, `src/env.d.ts`) and will fail
  clearly, not silently, if they are unset.
