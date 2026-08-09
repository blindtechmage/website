# BlindTechMage.com — Project Conventions

## Purpose

This document establishes the conventions, workflows, and governing facts for the
BlindTechMage.com project. It is adapted from TechClusive Solutions' general project
startup template, scoped down to fit a solo-maintained personal site rather than a
team-maintained commercial product.

## Legal and Organizational Facts

* Legal entity: none. This is a personal project, deliberately separate from
  Tech-Clusive Solutions, LLC.
* Primary contributor: Jad Wauthier (the Blind Tech Mage).
* GitHub account: BlindTechMage.
* Contact email: <info@BlindTechMage.com>.
* SSH key for GitHub operations: `C:/Users/jwauthier/.ssh/btm_cynthus_ed25519`.

## Working Agreement

* If something is unclear or ambiguous, ask before acting. Do not guess at intent and
  proceed.
* When asked how something can or should be done, answer the question asked. Do not
  perform the action unless asked to. An offer to perform the action may be made, but
  the default is to answer, not act.
* Do not present information in tables. All structured information should be
  presented in hierarchical linear format, since the primary contributor uses a
  screen reader and tabular output does not read well non-visually.
* In the event of a snag during implementation, testing, or deployment, check in
  unless the solution is straightforward and obvious.
* If there is an inconsistency between the environment and what would be expected,
  stop and check in rather than assuming the inconsistency is intentional.
* No implementation decision is acted on until the corresponding design has been
  presented and explicitly approved or rejected by the primary contributor.

## Session Discipline

* Every session begins by reading the most recent briefing document(s) and any other
  relevant project documents before starting work.
* Every session ends by updating the briefing documents with decisions made,
  rationale, accomplishments, and outstanding items, so the next session can pick up
  context without re-deriving it.
* Briefing documents live outside this repository (in the parent working directory),
  alongside `CLAUDE.md`. They are working notes, not published project documentation.

## Order of Operations for Any Feature or Fix

Work proceeds in this order, and no step is skipped:

1. Plan — establish what is being built and why, and get alignment before writing
   anything down formally.
2. Design — document the design, walked through section by section for confirmation,
   before any implementation begins.
3. Track — open a GitHub issue for the unit of work before any code is written.
4. Implement — write the code.
5. Test — write and run the corresponding unit tests.

Issue tracking is intentionally lightweight for this project (see Issue Tracking,
below) rather than following a full formal field checklist.

## Branching Strategy

* One permanent branch: `main`. All work happens on feature branches cut from
  `main`, merged back via pull request — no exceptions, including small fixes.
* `main` is protected at the repository level: direct pushes are disabled entirely
  (including for the repository owner), no force pushes, no branch deletion.
* No GitHub-enforced formal review/approval requirement is configured on pull
  requests. Merge instead requires an explicit verbal "proceed" from the primary
  contributor in conversation, given each time, regardless of CI status.
* No semantic-versioning or release-branch machinery. This is a live site, not a
  versioned distributed product. Deploys happen on merge to `main` via a
  dedicated deploy workflow that runs `wrangler deploy` (see Environmental
  Conditions — this project deploys to Cloudflare Workers with static assets,
  not classic Cloudflare Pages, which does not have the same git-integration
  auto-deploy Pages offered; deploy automation is a separate, not-yet-built CI
  workflow).

## CI Policy

* A GitHub Actions workflow runs on every pull request targeting `main`, executing:
  * Linting for Markdown, JavaScript/TypeScript, and HTML.
  * Unit tests for all executable/functional code, regardless of language
    (TypeScript, Python, or anything else introduced later). Every function or
    module implementing real behavior must have a corresponding unit test that
    verifies its functionality. This applies to Cloudflare Worker route logic (e.g.
    the contact form handler, resource search/filter API) as much as to frontend
    code. A pull request introducing functional code with no corresponding test is
    considered incomplete.
* No separate CI workflow runs on push to `main` — direct pushes are disabled, so
  every change reaching `main` has already passed the pull-request-time CI run. A
  duplicate post-merge run would be redundant.
* No enforced numeric code coverage threshold. The requirement is qualitative: new
  functional code needs a test, rather than a percentage gate.

## Accessibility by Design

* Standard: WCAG 2.2, Level AA, as the compliance floor for the entire site.
* Accessibility is a release gate, not a follow-up task. No feature is considered
  complete until it has been manually verified, not just automated-checked.
* axe-core is integrated into CI, running on every pull request alongside linting
  and unit tests.
* Automated results are treated as a floor, not proof of compliance. Manual
  verification — keyboard-only navigation and a screen reader pass — is required
  before a feature is considered done.
* JAWS is the named default local screen reader for manual verification.
* Inconsistencies between an implementation and WCAG 2.2 AA compliance are
  stop-and-consult items, not judgment calls resolved unilaterally.
* The site's accessibility process (tooling, standard, verification method) is
  itself a demonstrable competency asset, consistent with the primary contributor's
  positioning as an accessibility consultant. Content decisions reflecting this
  (e.g. a public accessibility/process page) are made separately, during site
  content/IA design.

## Security Gate

* Security is a release gate alongside accessibility, not a follow-up task.
* Any change touching stored content (D1 tables), the contact form, authentication
  or admin access (Cloudflare Access), or any third-party API call is checked
  against the project's security document before being considered complete.
* No project bundles or hardcodes API keys, tokens, or credentials. Cloudflare
  bindings/secrets are used for D1 access, and any third-party service (e.g. email
  delivery for the contact form) uses environment-based secrets, never committed
  values.
* No real or placeholder-looking credentials, tokens, or `.env`-style files are ever
  committed. Clearly fake placeholder values are used in examples and
  documentation.

## Linting and Code Quality

* A linter is configured from the start for each language in use (ESLint for
  TypeScript/JavaScript, markdownlint for Markdown, an HTML linter/validator), run
  locally and enforced in CI.
* TypeScript is used for all functional/executable code — Cloudflare Worker route
  logic, interactive frontend components — not plain JavaScript.
* Every first-order module/file has exactly one primary responsibility, unless
  additional code is a directly related helper or configuration type.

## Issue Tracking

* Every non-trivial unit of work gets a GitHub issue before code is written — no
  untracked work.
* Each issue includes a clear title, a description of what is being built and why,
  and acceptance criteria for anything that is a real feature (not required for
  small tasks or fixes).
* Labels are used loosely for categorization (e.g. `bug`, `feature`,
  `accessibility`, `content`).
* No formal parent/child/sibling issue linking, no milestone-based project board, no
  estimated-completion field. This can be revisited if the project ever grows
  additional contributors.

## Environmental Conditions

* Target platform: Cloudflare Workers with static assets (via
  `@astrojs/cloudflare`, which targets Workers rather than classic Cloudflare
  Pages), plus D1 (SQLite-compatible database). This is a correction from an
  earlier assumption that the platform would be classic Cloudflare Pages —
  the Astro adapter's current majors generate a Workers-style deployment
  (`wrangler.toml` with an `[assets]` binding), not a Pages-style one. The
  practical effect is the same (Cloudflare-hosted, TypeScript route handlers,
  D1-backed), but deployment is via `wrangler deploy` in CI rather than Pages'
  built-in git-integration auto-deploy.
* Frontend framework: Astro, chosen for its island-based interactivity model, which
  fits a mostly-static site with a small number of interactive pages (resource
  search/filter). The site builds in Astro's `server` output mode (required for
  Worker route/API handling), with individual static content pages opted into
  prerendering (`export const prerender = true`) so they build to plain HTML
  rather than being server-rendered per request.
* Language: TypeScript for all functional/executable code.
* No self-managed server, no OS/runtime matrix beyond what Cloudflare's platform
  dictates. The previously used server (`fornax.techclusivesolutions.com`) is
  retired from serving this site once cutover to Cloudflare Workers is complete.
* Credential storage uses Cloudflare's native secrets/bindings mechanism. Never
  plaintext, never committed.
* Any dependency that is unmaintained, deprecated, or otherwise at risk is flagged
  at the point of choosing it, with a note to re-validate the choice when work in
  that area actually begins.

## Documentation Set

* `docs/PRD.md` — lightweight scope document: what the site is, who it is for, and
  the content/IA plan.
* `docs/SECURITY.md` — security document, per the Security Gate section above.
* `docs/CI_TESTING.md` — consolidated CI and testing standard, per the CI Policy and
  Linting and Code Quality sections above.
* `docs/ACCESSIBILITY.md` — consolidated accessibility standard and process, per the
  Accessibility by Design section above.
* All of the above live inside this repository, since they are polished, deliberate
  process artifacts — part of the demonstrable-competency story — not raw working
  notes.
* Session briefings and `CLAUDE.md` live outside this repository, in the parent
  working directory. They are informal working notes for session-to-session
  continuity, not published project documentation.
* No separate phase/milestone plan, Definition of Done document, or formal
  acceptance-criteria standard document exists as a standalone artifact. These are
  intentionally not built speculatively; if a future client engagement needs
  formal versions of this kind of process documentation, they will be developed
  against that engagement's actual requirements rather than guessed at now.

## License and Repository Policy

* License: Apache License 2.0 (see `LICENSE`).
* The repository is public and readable/forkable by anyone, but is not soliciting
  outside contributions. It is a personal project and portfolio artifact, not a
  community project.

## What Remains Open

The following are not yet decided and should be resolved through the normal
Plan → Design → Track → Implement → Test process before work begins in that area:

* Site information architecture (page list, navigation structure) and how the
  content ideas discussed (Origin Story, The Great Irony, Blind Insights, The Sound
  of Silence, resume/CV) map onto it.
* Schema design for the domain-specific resource tables (ham radio resources,
  blindness-related resources, project details) in D1.
* Contact form implementation details (delivery mechanism, spam/abuse mitigation).
* Cloudflare Access configuration for any admin/write-gated routes.
* A deploy workflow (GitHub Actions running `wrangler deploy` on merge to `main`,
  using a Cloudflare API token stored as a repository secret) — not yet built.
* DNS cutover from `fornax.techclusivesolutions.com` to the deployed Cloudflare
  Worker — decided in principle, but not yet executed pending a working deployment
  to point to. This requires explicit confirmation before being carried out, as a
  live change to a working domain.
