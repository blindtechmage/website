# BlindTechMage.com — Accessibility Standard

## Standard

WCAG 2.2, Level AA, is the compliance floor for the entire site. This is a
deliberate choice over Level AAA: AAA is not realistically achievable across all
real content on a site like this, and claiming it without full verification would
undercut credibility rather than build it. Individual components may exceed AA
where genuinely achievable, but AA is the named baseline for every page and
feature.

## Why This Matters for This Project Specifically

This site is, among other things, a demonstrable competency asset supporting Jad's
positioning as an accessibility consultant. Accessibility here is not a checklist
applied after the fact — it is one of the two release gates (alongside security)
that no feature bypasses.

## Process

1. **Automated testing** — axe-core runs against every pull request in CI (see
   `docs/CI_TESTING.md`). This is a floor: automated tools catch roughly a third of
   real accessibility issues, not a majority, and passing axe-core does not mean a
   feature is accessible.
2. **Manual verification** — required before any feature is considered done:
   - Full keyboard-only navigation of the feature (no mouse).
   - A full pass with JAWS, the primary contributor's daily-driver screen reader
     and the named default local verification tool for this project.
3. **Stop-and-consult** — any inconsistency discovered between an implementation
   and WCAG 2.2 AA compliance is raised and discussed before proceeding, not
   resolved unilaterally by whoever is implementing.

## Specific Requirements Carried From Project Discussion

* No custom-styled interactive control (dropdowns, filter panels, etc.) built as
  divs pretending to be native form controls. Real semantic elements (`<select>`,
  checkboxes, buttons) are used, styled as needed, rather than reimplemented.
* Dynamic content updates (e.g. resource search/filter results changing without a
  page reload) are announced to screen reader users via an ARIA live region.
* Any element that triggers navigation must be a real link (`<a href>`); any
  element that triggers an in-page action must be a real button. Interactive
  elements must not carry mismatched semantics (e.g. a `<button>` used to navigate
  to another page via an `href` attribute, which is invalid and was a defect
  identified in the prior version of this site).
* Text content must not contain encoding artifacts (mojibake) — verified as part of
  normal QA, not just visually but by inspecting rendered text output, since
  visual review alone can miss characters that render acceptably in one font but
  fail elsewhere.
* No link points to a placeholder destination (`href="#"` with no real target) in
  shipped content.

## Possible Future Content Element

A public accessibility/process page showing the site's own accessibility tooling,
standard, and verification method has been discussed as a way to make this
process itself part of the site's demonstrable-competency content. This is a
content/IA decision, not yet finalized — see `docs/PRD.md`, Open Items.

## Open Items

* Whether any component will target AAA specifically, and which.
* Full accessibility test checklist / acceptance-criteria template for feature
  issues (each feature issue's acceptance criteria should include at least one
  accessibility-focused scenario, per the lightweight issue tracking approach in
  `PROJECT.md`).
