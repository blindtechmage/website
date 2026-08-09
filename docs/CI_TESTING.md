# BlindTechMage.com — CI and Testing Standard

## Scope

This document consolidates the CI and testing requirements established in
`PROJECT.md` (CI Policy and Linting and Code Quality sections) into one reference.

## What Runs, and When

A single GitHub Actions workflow runs on every pull request targeting `main`. It
executes, in this order:

1. Linting:
   - Markdown (markdownlint or equivalent).
   - JavaScript/TypeScript (ESLint).
   - HTML (an HTML linter/validator).
2. Accessibility:
   - axe-core, run against the built site output.
3. Unit tests:
   - All executable/functional code, regardless of language.

No workflow runs on push to `main`. Direct pushes to `main` are disabled at the
repository level, so every change reaching `main` has already passed this workflow
at pull-request time. A duplicate post-merge run would be redundant.

## Testing Requirement

Every function or module implementing real behavior must have a corresponding unit
test that verifies its functionality. This applies to:

* TypeScript logic in Cloudflare Pages Functions/Workers (contact form handler,
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

axe-core results in CI are a floor, not proof of compliance. Manual verification
(keyboard-only navigation, a JAWS pass) is still required before a feature is
considered done, per `docs/ACCESSIBILITY.md`. CI does not and cannot enforce the
manual verification step — it is a process requirement tracked via the working
agreement, not a tooling gate.

## Open Items

* Specific linter configurations (rule sets) for ESLint, markdownlint, and the HTML
  validator — to be established when CI is actually scaffolded.
* Test framework selection for TypeScript (e.g. Vitest) — to be decided when the
  first functional code (contact form handler) is built.
