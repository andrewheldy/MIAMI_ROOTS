---
title: Decision Log
type: decisions
status: active
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [decisions]
---

## Purpose

The durable, append-only record of material product and architecture decisions: what was
decided, when, and why. Once an entry is added it should not be silently rewritten — if a
decision is reversed, add a new entry marking the old one superseded.

## What belongs here

- A decision, its date, its rationale, and its status
- A pointer to any decision it supersedes

## What does not belong here

- Open, undecided questions (see `docs/02-planning/open-questions.md`)
- Working assumptions not yet confirmed as decisions (see
  `docs/00-context/assumptions.md`)

## Known initial information

### 2026-07-16 — Repository structure and documentation system adopted

**Decision:** Establish the canonical `miami-roots` repository structure (docs, src,
public, supabase, scripts, tests, .github scaffolding) as specified at project founding,
with documentation-first content and no application code yet.

**Rationale:** Gives future implementation work (human or agent) a predictable, navigable
structure and enough context to avoid re-deciding settled things or silently inventing
unsettled ones.

**Status:** Active.

### 2026-07-16 — Proprietary "All Rights Reserved" license, not open source

**Decision:** License the repository under an all-rights-reserved proprietary notice
rather than an OSS license (MIT, Apache, etc.).

**Rationale:** Miami Roots is a private community product, not an open-source project, at
this stage. This can be revisited later if there's ever a reason to open-source part of
the codebase.

**Status:** Active.

### 2026-07-16 — Concept brand assets committed as provisional

**Decision:** Commit the primary Miami Roots mark and four group-concept marks (Sober
Social, Daytime Events, Nightlife & Event Marketing, and a future Ticket Exchange concept)
into `public/brand/` and `public/group-logos/`, and document them in
`docs/04-design/asset-register.md`, despite not being confirmed as final brand assets.

**Rationale:** These are the only concrete brand assets that exist; committing and
documenting them (marked clearly as provisional/unconfirmed) is more useful than omitting
them and leaves an honest trail for whoever finalizes the brand.

**Status:** Active. Superseding entry expected once a real brand guide is confirmed.

### 2026-07-16 — Canonical asset organization and private `inputs/` convention

**Decision:** Adopt the canonical asset layout `public/brand/logos/`,
`public/brand/banners/`, `public/group-logos/`, `public/group-banners/`, `public/social/`,
`public/qr/`, with lowercase kebab-case filenames ending in a role suffix
(`…-logo.<ext>`, `…-banner.<ext>`). The five founding assets were renamed accordingly via
`git mv` with pixel content untouched (`miami-roots-primary-logo.png` →
`brand/logos/miami-roots-logo.png`; group logos gained `-logo` suffixes;
`future-ticket-exchange.png` → `ticket-exchange-logo.png`, still future-scoped per
`docs/01-product/out-of-scope.md`). Additionally, a private `inputs/` tree
(`brand-assets/`, `whatsapp-exports/`, `screenshots/`) is excluded from Git
(`inputs/*` with only `inputs/README.md` tracked) and is the only permitted location for
WhatsApp screenshots, chat exports, and unapproved design sources.

**Rationale:** Stable, predictable asset paths before any application code references
them, and a hard structural boundary that keeps private community material (phone numbers,
invite links, conversations) out of Git history by default rather than by per-file
vigilance. Registers were added so both sides stay accounted for:
`docs/04-design/asset-register.md` (+ `subgroup-asset-inventory.md`) for public assets,
`docs/00-context/source-material-register.md` (+ `whatsapp-community-inventory.md`) for
private material.

**Status:** Active.

### 2026-07-16 — MVP architecture plan adopted as the planning baseline

**Decision:** Adopt the 2026-07-16 MVP architecture and implementation plan as the
baseline for Phase 1: the document set under `docs/03-architecture/` (identity &
authorization, data model, referral system, analytics & events, application
architecture, plus updated system context / data principles / privacy & safety /
integrations), the product specifications (`onboarding-specification.md`,
`community-content-requirements.md`, updated referral/rewards concept), the operational
workflows (`docs/05-operations/`), and the 16-milestone delivery plan
(`docs/08-delivery/implementation-plan.md`) with MVP boundary M1–M12 + M14–M15 and
reward *redemption* deliberately post-MVP.

**Rationale:** The plan is internally consistent, assumes the pessimistic WhatsApp
reality (no programmatic join signals; manual verification), keeps invite links
server-only with gated, audited reveal, and preserves the founding data principles
(append-only ledger, correctable attribution, deny-by-default RLS, manual operability).

**Explicitly NOT decided by this entry:** every item marked *recommended default* in
`docs/02-planning/open-questions.md` (auth model, onboarding fields, verification
procedure, point values, attribution/retention windows, analytics vendor, naming
question #10). Those remain proposals until the owner ratifies them at the decision
gates named in the implementation plan; this entry only establishes them as the working
baseline for planning and sequencing.

**Status:** Active. Implementation may not begin until the owner explicitly authorizes
Milestone 1.

## Relationship to other documents

- `docs/00-context/assumptions.md` — precursor to decisions recorded here
- `docs/02-planning/open-questions.md` — precursor questions that become decisions here
