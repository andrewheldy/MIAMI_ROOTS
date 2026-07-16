---
title: Data Principles
type: architecture
status: active
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [architecture, data]
---

## Purpose

States principles the eventual data model and schema must respect, agreed before any
schema exists, so early implementation choices don't quietly violate them.

## What belongs here

- Durable principles about how data should be structured or handled
- Rationale, where it isn't obvious

## What does not belong here

- Actual table/column design (belongs in `supabase/migrations/` once real, and should be
  summarized here only after the fact if it clarifies a principle)
- Product-level referral/rewards concepts (see
  `docs/01-product/referral-and-rewards-concept.md` — this doc is the architectural
  counterpart)

## Known initial information

- **The public Miami Roots URL must remain stable even if individual WhatsApp invite links
  change.** Invite links should be stored as data the app resolves at request time, not
  baked into shared URLs, marketing materials, or QR codes.
- **Raw WhatsApp invite links are not permanent public assets.** They should be treated as
  operational, rotatable data — access to them should go through the app, not by
  distributing the raw link directly wherever avoidable.
- **Referral attribution and membership verification are separate events** and must be
  separate records, not a single status field — the timeline between them matters (see
  `docs/00-context/glossary.md`).
- **Referral attribution must be correctable by an administrator.** The data model should
  support an audit trail of corrections, not just an overwritable field with no history.
- **Points should eventually be backed by an append-only ledger**, not only a mutable
  running total. A denormalized/cached total is fine for read performance as long as the
  ledger remains the source of truth.
- **Design for manual operability while the community is small.** Early on, an admin
  should be able to inspect and reason about the data (e.g. via Supabase's dashboard)
  without bespoke tooling. Don't over-engineer for a scale the community isn't at yet.

## Relationship to other documents

- `docs/01-product/referral-and-rewards-concept.md` — the product-level version of these
  principles
- `docs/03-architecture/privacy-and-safety.md` — data handling from a privacy angle
- `docs/07-decisions/decision-log.md` — where the actual schema decisions will be recorded
