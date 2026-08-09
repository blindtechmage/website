# BlindTechMage.com — Scope Document

## What This Site Is

BlindTechMage.com is Jad Wauthier's personal brand site — distinct and deliberately
separate from TechClusiveSolutions.com, the site for his company, Tech-Clusive
Solutions, LLC. Where the company site is for clients and investors/partners,
BlindTechMage.com is for colleagues, peers, potential employers, and clients who
want to know Jad beyond the office.

The site also serves as a demonstrable competency asset for Jad's positioning as an
accessibility consultant: a real, live example of a WCAG 2.2 AA compliant site,
built and verified using both automated tooling (axe-core) and manual screen reader
testing (JAWS), rather than a claim without evidence.

## Who It Is For

* Colleagues and professional peers.
* Potential employers.
* Clients who want to know Jad outside of a strictly transactional/company context.
* Prospective accessibility-consulting clients evaluating Jad's demonstrated
  competency.

## Background

Jad has worked as a developer and engineer for 20 years, starting as a support
engineer at a VoIP company, and since then working across healthcare, finance,
telecom, consulting, manufacturing, and technology. He is a mentor and currently
serves as the technology director at a blindness-focused nonprofit. He is a licensed
ham radio operator, with interests spanning multiple branches of technology and
psychology. He is currently building a research initiative comprising three research
programs — Agentic Reasoning and Engagement Analysis, Cognitive Architecture for
Intuitive Reasoning Exploration, and Framework for Responsible Optimization and
Self-Directed Transformation — exploring multi-agent AI system behavior and
safeguards for responsible AI integration.

## Information Architecture

Top-level navigation, flat (no nested dropdown/tree menus), agreed in design
discussion:

* Home
* Resources — single flat page with filter controls over the unified
  `resources` table (see Functional Requirements, above), not a category tree.
* Projects — top-level nav item.
  * Research Projects — thin pointer pages linking to TechClusiveSolutions.com
    (TechClusive holds the IP; substantive content lives there, not here).
  * Open-Source Projects.
  * Proprietary Projects.
* Blog — a distinct section from About Me, hosted on BlindTechMage itself
  (Astro content collections), not a third-party platform, for accessibility
  control, ownership/durability, and consistency with the site's purpose. RSS
  feed considered for distribution without ceding ownership of the primary
  content.
  * The Great Irony — why blind engineers use an IDE called Visual Studio.
  * Blind Insights — what blind coding actually looks like.
  * The Sound of Silence — what can be heard when you actually listen.
* About Me — distinct from Blog; a fixed, load-bearing section rather than a
  chronological post stream.
  * The Origin Story — not an essay; a persona-rationale page explaining why
    the Blind Tech Mage persona exists, aimed at a reader who might otherwise
    find the branding whimsical. Likely warrants prominent placement (e.g.
    linked from the homepage) rather than being buried in a list.
  * Personal Interests
    * Technology
      * AI
    * Psychology
      * Developmental Psychology
      * Personality Typing
  * Resume/CV.
* About the Site — possible home for an accessibility/process page
  demonstrating the site's own tooling and standard (still an open decision,
  see below).
* Contact Me.

This is still subject to change and confirmation before implementation begins,
per the Plan → Design → Track → Implement → Test process, but represents the
converged state of design discussion so far.

## Functional Requirements (established so far)

* A contact form, backed by a TypeScript Cloudflare Worker route.
* A single, unified `resources` table in Cloudflare D1 (not one table per domain —
  this was the original design, revised once the resource taxonomy grew past
  three domains to include Community, Engineering (Software Engineering; AI and
  Agentic Workflows), Psychology, Ham Radio, and Blindness). Domain/category/
  subcategory/type (e.g. Organizations vs. Websites) are columns on this one
  table, with tags handled via a join table rather than a delimited string
  column, so filtering is a real SQL query rather than string matching.
* The Resources page is a single, flat page with filter controls (real
  `<select>`/checkbox elements) for domain, subcategory, and type, backed by a
  paginated, filtered query against the unified table — not a nested tree of
  category pages. This keeps the site's navigation shallow (see Information
  Architecture, below) while still supporting fine-grained categorization as
  data rather than as page/menu depth. Pagination uses real paginated links
  (page numbers/prev-next), not infinite scroll, for accessibility.
* Public rows are queryable via a public API route and browsable/searchable on
  the Resources page. Any private/personal data (notes, drafts, non-public
  detail) is structurally separate — not merely filtered by a status flag — and
  is never reachable by the public-facing API route.
* An admin/write path for managing resource data, gated by Cloudflare Access, kept
  separate from the public read-only API route.
* Project entries (Research, Open-Source, Proprietary) are a separate concern
  from the resources table — see Information Architecture, below. Research
  project pages are thin pointer pages linking to TechClusiveSolutions.com,
  since TechClusive holds the IP for those projects; BlindTechMage does not
  host the substantive content for them.

## Explicitly Out of Scope (for now)

* User accounts or public-facing authentication.
* E-commerce or payment functionality.
* Real-time/live data features.
* A separate search experience for Blog content (deferred until post volume
  warrants filtering/pagination, per Open Items).

## Open Items

* Final column/index design for the unified `resources` table and its tag join
  table (domain/category/subcategory/type structure is agreed in principle; exact
  schema not yet written).
* Contact form delivery mechanism and spam/abuse mitigation approach.
* Whether a public accessibility/process page is included under "About the
  Site," and what it shows.
* Whether Blog ever needs the same filter/pagination treatment as Resources
  (deferred until post volume warrants it).
