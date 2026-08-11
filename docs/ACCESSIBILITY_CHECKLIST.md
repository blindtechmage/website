# WCAG 2.2 AA User Acceptance Checklist

## Purpose

This is the point-by-point acceptance checklist referenced as an open item in
`docs/ACCESSIBILITY.md`. It exists to make WCAG 2.2 AA compliance a series of
discrete, binary, testable checks rather than a general standard to keep in
mind. Every feature issue's acceptance criteria should draw from this list;
it is also the reference for manual QA passes and for scripting automated
coverage over time.

## How to use this document

Each item is written as a single **pass/fail check**, not a description of
the requirement — if you can't answer "pass" or "fail" for a page/component
without further interpretation, the item needs rewriting, not the page.

Each item is tagged with:

* **[SC x.x.x]** — the WCAG 2.2 success criterion it verifies, for traceability.
* **(Auto)** — mechanically checkable today by axe-core in CI
  (`docs/CI_TESTING.md`) or by `html-validate`.
* **(Script)** — not covered by current tooling, but checkable by a
  deterministic script/lint rule (DOM query, regex, computed-style check)
  without a human in the loop. Candidates for future automation.
* **(Manual)** — requires a human, generally keyboard-only navigation and/or
  a full JAWS pass per `docs/ACCESSIBILITY.md`'s process. Not realistically
  scriptable.

A page/feature is not "done" until every applicable item below is a pass —
this is a release gate, not a nice-to-have, per `docs/ACCESSIBILITY.md`.

---

## Links

* [ ] **(Script)** Every `<a>` has a non-empty accessible name (text content,
  `aria-label`, or `aria-labelledby`). [SC 2.4.4, 4.1.2]
* [ ] **(Manual)** Link text is understandable out of context (no bare
  "click here" / "read more" / "learn more" without surrounding context that
  disambiguates it programmatically, e.g. via `aria-label`). [SC 2.4.4]
* [ ] **(Script)** No `href="#"` or empty `href` used as a placeholder for
  unshipped functionality. [Project rule, `docs/ACCESSIBILITY.md`]
* [ ] **(Script)** Every link that opens a new tab/window (`target="_blank"`)
  has a visually-hidden text cue (e.g. "(opens in a new tab)") in its
  accessible name. [SC 3.2.5 — best practice beyond the letter of AA]
* [ ] **(Auto)** Links are distinguishable from surrounding text by more than
  color alone (underline or equivalent non-color indicator). [SC 1.4.1]
* [ ] **(Script)** No two links on the same page share identical accessible
  names but point to different destinations. [SC 2.4.4]
* [ ] **(Manual)** Every link is reachable and operable via keyboard alone
  (Tab to focus, Enter to activate). [SC 2.1.1]
* [ ] **(Auto)** Link has a visible focus indicator meeting the 3:1 contrast
  minimum against adjacent colors, and is not fully suppressed
  (`outline: none` with no replacement). [SC 2.4.7, 2.4.11]

## Buttons

* [ ] **(Script)** Every interactive-action element is a real `<button>` (or
  `role="button"` only when a native button is genuinely unavailable), never
  a styled `<div>`/`<span>`. [Project rule, `docs/ACCESSIBILITY.md`]
* [ ] **(Script)** No `<button>` is used to navigate to another page via
  `href`/`onclick` location change — navigation uses `<a href>`. [Project
  rule, `docs/ACCESSIBILITY.md`]
* [ ] **(Script)** Every `<button>` has a non-empty accessible name (text
  content, `aria-label`, or `aria-labelledby`) — icon-only buttons in
  particular. [SC 4.1.2]
* [ ] **(Manual)** Every button is reachable and operable via keyboard alone
  (Tab to focus, Enter and Space both activate). [SC 2.1.1]
* [ ] **(Auto)** Button has a visible focus indicator meeting the 3:1
  contrast minimum. [SC 2.4.7, 2.4.11]
* [ ] **(Script)** Disabled buttons are conveyed programmatically
  (`disabled` attribute or `aria-disabled="true"`), not by visual styling
  alone. [SC 4.1.2]
* [ ] **(Manual)** Buttons that trigger a destructive or hard-to-reverse
  action have a confirmation step or are otherwise not a single accidental
  keystroke away from firing. [SC 3.3.4 — where applicable]

## Images

* [ ] **(Auto)** Every `<img>` has an `alt` attribute. [SC 1.1.1]
* [ ] **(Manual)** Every informative image's `alt` text conveys the same
  information/purpose the image conveys visually — not a filename, not
  "image of...", not omitted detail a sighted user would get. [SC 1.1.1]
* [ ] **(Script)** Every purely decorative image has `alt=""` (empty, not
  missing) so screen readers skip it. [SC 1.1.1]
* [ ] **(Script)** No text is conveyed only as an image without an
  equivalent text alternative available (e.g. a logo with a wordmark baked
  in and no accessible name matching that text). [SC 1.1.1, 1.4.5]
* [ ] **(Manual)** Complex images (charts, diagrams, infographics) have a
  long-form text equivalent available (adjacent text, `aria-describedby`
  pointing to a full description, or a linked data table), not just a short
  `alt`. [SC 1.1.1]
* [ ] **(Script)** SVGs used as meaningful graphics have an accessible name
  (`<title>`, `aria-label`, or `role="img"` + label); SVGs used decoratively
  have `aria-hidden="true"`. [SC 1.1.1]

## Aria

* [ ] **(Auto)** No ARIA attribute references an `id` that doesn't exist on
  the page (`aria-labelledby`, `aria-describedby`, `aria-controls`,
  `aria-owns`). [SC 4.1.2]
* [ ] **(Auto)** No use of an ARIA role/attribute combination flagged
  invalid by axe-core's `aria-*` rule set (e.g. `aria-required-children`,
  `aria-allowed-attr`). [SC 4.1.2]
* [ ] **(Script)** ARIA is used only to fill a real gap — no `role`,
  `aria-label`, etc. added to a native element that already expresses the
  same semantics natively (redundant ARIA). ["No ARIA is better than bad
  ARIA"]
* [ ] **(Manual)** Any dynamic content update (search/filter results,
  form-submission status, async load) that isn't part of the next visible
  focus target is announced via an ARIA live region
  (`aria-live="polite"`/`"assertive"` as appropriate). [Project rule,
  `docs/ACCESSIBILITY.md`; SC 4.1.3]
* [ ] **(Manual)** Live-region announcements are verified by ear with JAWS,
  not just inspected in the DOM — confirms the live region actually fires
  and reads sensibly. [Project rule, `docs/ACCESSIBILITY.md`]
* [ ] **(Auto)** No `aria-hidden="true"` on an element that contains
  focusable content (creates a focusable-but-invisible-to-AT trap). [SC
  4.1.2]

## Semantic tags

* [ ] **(Auto)** Page has exactly one `<h1>`, and heading levels do not skip
  a level (no `<h2>` directly to `<h4>`). [SC 1.3.1, 2.4.6]
* [ ] **(Script)** Page has the expected landmark structure — one `<header>`,
  one `<main>`, one `<footer>`, `<nav>` for each distinct navigation block —
  and no landmark is duplicated without a distinguishing `aria-label`. [SC
  1.3.1]
* [ ] **(Manual)** A skip link ("skip to main content") is present, is the
  first focusable element on the page, and moves focus to `<main>` when
  activated via keyboard. [SC 2.4.1]
* [ ] **(Script)** Lists of items use `<ul>`/`<ol>`/`<li>`, not visually
  list-styled `<div>`s. [SC 1.3.1]
* [ ] **(Script)** Tabular data uses `<table>` with `<th>` (and `scope`
  where needed), not a div/CSS-grid layout. [SC 1.3.1]
* [ ] **(Auto)** Document `<html>` element has a valid `lang` attribute; any
  passage in a different language has its own `lang` attribute. [SC 3.1.1,
  3.1.2]
* [ ] **(Auto)** No content built with deprecated/invalid HTML that
  `html-validate` flags (see `docs/CI_TESTING.md`). [SC 4.1.1 — parsing]

## Font

* [ ] **(Manual)** Text remains readable and no content/functionality is
  lost when the page is zoomed to 200% in the browser (not just a CSS
  `zoom`/`transform` — actual browser zoom). [SC 1.4.4]
* [ ] **(Manual)** Text reflows without horizontal scrolling or content loss
  at a 320px-equivalent viewport width (400% zoom equivalent). [SC 1.4.10]
* [ ] **(Script)** No text is set in `px` in a way that defeats user
  browser font-size preferences (prefer relative units — `rem`/`em`/`%` —
  for font sizing). [SC 1.4.4]
* [ ] **(Script)** Body text is at least 16px (or the `rem` equivalent) at
  default zoom. [Best practice supporting SC 1.4.4]
* [ ] **(Manual)** Custom line-height, letter-spacing, and word-spacing can
  each be overridden/increased by the user (per WCAG's text-spacing
  requirements) without loss of content or functionality. [SC 1.4.12]

## Foreground/Background Contrast

* [ ] **(Auto)** Normal-size text has a contrast ratio of at least 4.5:1
  against its background. [SC 1.4.3]
* [ ] **(Auto)** Large-scale text (≥24px, or ≥19px bold) has a contrast
  ratio of at least 3:1 against its background. [SC 1.4.3]
* [ ] **(Auto)** UI components and graphical objects required to identify
  state (borders, icons, focus indicators, form-field outlines) have a
  contrast ratio of at least 3:1 against adjacent colors. [SC 1.4.11]
* [ ] **(Manual)** Contrast holds up under both the site's light and dark
  presentations if more than one exists (re-check per theme, not just
  once). [SC 1.4.3, 1.4.11]
* [ ] **(Script)** No information is conveyed by color alone (e.g. a "valid"
  form field shown only via a green border) — always paired with text,
  icon, or another non-color cue. [SC 1.4.1]

## Spacing

* [ ] **(Manual)** Text spacing overrides (line height ≥1.5x font size,
  paragraph spacing ≥2x font size, letter spacing ≥0.12x font size, word
  spacing ≥0.16x font size) can be applied without clipping or overlapping
  content. [SC 1.4.12]
* [ ] **(Script)** Interactive targets (links, buttons, form controls) are
  at least 24×24 CSS px, or have sufficient spacing from adjacent targets
  to avoid accidental activation, per WCAG 2.2's new target-size criterion.
  [SC 2.5.8]
* [ ] **(Manual)** Adequate spacing exists between adjacent interactive
  elements for both mouse and touch use — no controls close enough together
  to cause frequent mis-taps in manual testing. [SC 2.5.8]

## Element Layout

* [ ] **(Auto)** Reading and navigation order (DOM order / Tab order)
  matches the visual/meaningful order of content — no CSS-only reordering
  that creates a mismatch. [SC 1.3.2, 2.4.3]
* [ ] **(Manual)** Content and functionality are fully available and usable
  in both portrait and landscape orientation; nothing is locked to a single
  orientation without a genuine essential reason. [SC 1.3.4]
* [ ] **(Manual)** No content appears only on `:hover` or only on
  keyboard `:focus` without an equivalent path for the other input
  modality, and any hover/focus-triggered content is dismissible,
  hoverable, and persistent per WCAG's content-on-hover-or-focus
  criterion. [SC 1.4.13]
* [ ] **(Manual)** No component of the page auto-updates, scrolls, or
  auto-advances (carousels, marquees, auto-refreshing sections) without a
  user-operable pause/stop/hide control, if the movement lasts more than 5
  seconds. [SC 2.2.2]
* [ ] **(Manual)** Focus order through the page is logical and predictable
  as you Tab through it — matches visual flow, doesn't jump erratically.
  [SC 2.4.3]

## Form Submission

* [ ] **(Auto)** Every form input has a programmatically associated label
  (`<label for>`, `aria-label`, or `aria-labelledby`) — placeholder text
  alone is never the only label. [SC 1.3.1, 4.1.2]
* [ ] **(Manual)** Client-side validation errors are announced to screen
  reader users (via live region or focus movement to the error), not shown
  only as a visual color/icon change. [SC 3.3.1, 4.1.3]
* [ ] **(Script)** Every validation error message is programmatically
  associated with its field (`aria-describedby` pointing to the error
  text). [SC 3.3.1]
* [ ] **(Manual)** Required fields are conveyed programmatically
  (`required`/`aria-required="true"`) in addition to any visual marker
  (e.g. asterisk), and the visual marker itself has a text equivalent
  explained somewhere on the page. [SC 3.3.2]
* [ ] **(Manual)** Field-format requirements (e.g. expected email format)
  are stated in text before or at the point of error, not conveyed by
  format alone. [SC 3.3.2]
* [ ] **(Manual)** Successful submission gives clear, announced
  confirmation (not just a silent redirect or a visual-only toast). [SC
  4.1.3]
* [ ] **(Manual)** The complete form is operable via keyboard alone,
  including submission, without any control being reachable only by mouse.
  [SC 2.1.1]
* [ ] **(Manual)** Server-side validation failures (independent of the
  contact form's own layered protections — see `docs/SECURITY.md`) surface
  a genuinely accessible error state, not a generic/blank failure. [SC
  3.3.1]

## General

* [ ] **(Auto)** Zero axe-core violations at the default (WCAG 2 A/AA)
  ruleset, per the CI gate in `docs/CI_TESTING.md`. [Multiple SCs]
* [ ] **(Manual)** Full keyboard-only navigation of the page/feature is
  possible with no dead ends, no keyboard traps, and no mouse-only
  interaction. [SC 2.1.1, 2.1.2]
* [ ] **(Manual)** Full pass with JAWS (the project's named default
  verification tool, per `docs/ACCESSIBILITY.md`) confirms the page is
  actually usable end to end, not just technically compliant. [Project
  process]
* [ ] **(Script)** Page `<title>` is unique and descriptive of the specific
  page's content/purpose. [SC 2.4.2]
* [ ] **(Manual)** No content flashes more than three times per second.
  [SC 2.3.1]
* [ ] **(Script)** No rendered text contains encoding artifacts/mojibake —
  checked in rendered output, not just source. [Project rule,
  `docs/ACCESSIBILITY.md`]
* [ ] **(Manual)** Any session timeout (if one is ever introduced) warns the
  user in advance and offers a way to extend it. [SC 2.2.1]

## Other

* [ ] **(Manual)** Any PDF, downloadable document, or embedded third-party
  widget introduced in the future meets the same AA bar as the rest of the
  site, or is flagged as a known gap rather than silently shipped
  non-compliant. [SC 1.1.1, 1.3.1, etc., applied to non-HTML content]
* [ ] **(Manual)** Any video/audio content introduced in the future has
  captions (video) and a text transcript (audio-only), per SC 1.2.2/1.2.1.
* [ ] **(Manual)** Error/empty/loading states for any feature are each
  individually checked for accessibility, not just the happy path — a
  common gap where automated tools and one-pass manual review both tend to
  stop short. [Multiple SCs]

---

## Notes for future scripting work

* Items tagged **(Auto)** are already covered or coverable by axe-core in
  the existing CI pipeline (`docs/CI_TESTING.md`) — verify each is actually
  included in the ruleset in use, rather than assuming axe covers
  everything tagged this way by default.
* Items tagged **(Script)** are the best candidates for new tooling: most
  are expressible as an `html-validate` rule, a small DOM-query lint script
  run against built output, or a Playwright assertion alongside the
  existing `tests/e2e/*.a11y.spec.ts` files.
* Items tagged **(Manual)** are not being deferred out of laziness — WCAG
  success criteria like content-on-hover behavior, live-region
  announcement quality, and focus-order sanity are not reliably machine
  verifiable with current tooling, and (Manual) items are exactly where
  automated tools are known to miss issues, per the "catches roughly a
  third of real accessibility issues" note in `docs/ACCESSIBILITY.md`.
