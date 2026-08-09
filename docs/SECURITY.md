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
  abuse surface. Requirements:
  - Server-side input validation on all fields.
  - Rate limiting to prevent bulk submission abuse.
  - Basic bot mitigation (e.g. a honeypot field or equivalent low-friction
    measure) — full CAPTCHA is avoided if possible, given accessibility concerns
    with CAPTCHA and this site's accessibility positioning; if a bot-mitigation
    measure with accessibility implications is ever considered, it is a
    stop-and-consult design decision, not an implementation-time default.
* Submitted data is not publicly queryable and is not exposed through any public
  API route.

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

* Specific email delivery service selection for the contact form (not yet decided).
* Specific rate-limiting implementation (Cloudflare-native rate limiting vs.
  application-level) — to be decided when the contact form is designed.
