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

## Relationship to other documents

- `docs/00-context/assumptions.md` — precursor to decisions recorded here
- `docs/02-planning/open-questions.md` — precursor questions that become decisions here
