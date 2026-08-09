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

## Content Ideas (not yet finalized into an information architecture)

* The Origin Story — how Jad went from a tech nerd to the Blind Tech Mage.
* The Great Irony — why blind engineers use an IDE called Visual Studio.
* Blind Insights — what blind coding actually looks like.
* The Sound of Silence — what can be heard when you actually listen.
* Resume/CV.

These are candidate pieces, not a finalized site map. Final information architecture
is a separate design decision to be made and confirmed before implementation.

## Functional Requirements (established so far)

* A contact form, backed by a TypeScript Cloudflare Worker route.
* Domain-specific, searchable/filterable resource tables, stored in Cloudflare D1,
  each in its own table (not a single shared table across domains):
  * Ham radio resources.
  * Blindness-related resources.
  * Project-specific details.
* Public tables are queryable via a public API route and browsable/searchable on
  corresponding site pages, filterable by fields appropriate to each domain (e.g.
  category, tags via a join table rather than a delimited string column).
* Any private/personal data (notes, drafts, non-public detail) is structurally
  separate from public tables — not merely filtered by a status flag — and is never
  reachable by the public-facing API routes.
* An admin/write path for managing resource data, gated by Cloudflare Access, kept
  separate from the public read-only API routes.

## Explicitly Out of Scope (for now)

* User accounts or public-facing authentication.
* E-commerce or payment functionality.
* Real-time/live data features.
* Cross-domain unified search across all resource tables (each domain is browsed on
  its own page; a shared search index is only worth building if a real need for it
  emerges).

## Open Items

* Final information architecture / page list / navigation structure.
* Final schema for each domain-specific resource table.
* Contact form delivery mechanism and spam/abuse mitigation approach.
* Whether a public accessibility/process page is included, and what it shows.
