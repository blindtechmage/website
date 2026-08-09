# BlindTechMage.com — CI and Testing Standard

## Scope

This document consolidates the CI and testing requirements established in
`PROJECT.md` (CI Policy and Linting and Code Quality sections) into one reference.

## What Runs, and When

A single GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every pull
request targeting `main`, as four parallel-where-possible jobs:

1. **Lint** — ESLint (JS/TS/Astro), markdownlint-cli2 (Markdown), and a TypeScript
   typecheck (`tsc --noEmit`).
2. **Unit Tests** — Vitest, covering all executable/functional code regardless of
   language (Cloudflare Worker route logic first; any other language introduced
   later is added as its own job/step).
3. **Build and HTML Lint** — Astro build (`npm run build`), then html-validate run
   against the built `dist/client/` output, since that is the actual shipped
   markup, not the source templates.
4. **Accessibility and E2E Tests** — Playwright, with `@axe-core/playwright`
   run against the built site (via `npm run preview`) for every page under test.
   Depends on the build job so it always tests real built output.

No workflow runs on push to `main`. Direct pushes to `main` are disabled at the
repository level, so every change reaching `main` has already passed this workflow
at pull-request time. A duplicate post-merge run would be redundant.

## Testing Requirement

Every function or module implementing real behavior must have a corresponding unit
test that verifies its functionality. This applies to:

* TypeScript logic in Cloudflare Worker routes (contact form handler,
  resource search/filter API, any admin-route logic).
* Any interactive frontend component with non-trivial logic (e.g. the resource
  search/filter UI's client-side behavior).
* Any script in any language introduced later (Python, or otherwise), if it
  implements real functionality.

A pull request that introduces functional code with no corresponding test is
considered incomplete and should not merge, regardless of whether the code itself
works.

There is no enforced numeric code coverage percentage. The requirement is
qualitative: new functional code needs a test. This may be revisited if the
project's scope grows significantly.

## Merge Gate

* All CI checks (lint, accessibility, tests) must pass as required status checks
  on the protected `main` branch before a pull request can merge.
* Passing CI is necessary but not sufficient for merge. Merge additionally requires
  an explicit verbal "proceed" from the primary contributor for each pull request,
  regardless of CI status. See `PROJECT.md`, Branching Strategy.

## Accessibility Testing Note

`@axe-core/playwright` results in CI are a floor, not proof of compliance. Manual
verification (keyboard-only navigation, a JAWS pass) is still required before a
feature is considered done, per `docs/ACCESSIBILITY.md`. CI does not and cannot
enforce the manual verification step — it is a process requirement tracked via the
working agreement, not a tooling gate. Playwright's browser-driven testing does
additionally allow interaction-based accessibility checks (e.g. verifying live
region announcements after a client-side filter action), not just static-markup
scanning.

## Open Items

* Linter rule-set tuning (ESLint, markdownlint, html-validate) beyond the
  recommended defaults currently configured — to be refined as real content and
  code are added.
* Expanding the Playwright accessibility suite to cover new pages/features as they
  are built (currently covers only the placeholder home page).
