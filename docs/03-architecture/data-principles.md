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

States principles the data model and schema must respect, agreed before any schema
exists, so implementation choices don't quietly violate them. Expanded 2026-07-16 with
the MVP planning pass; the concrete model applying these principles is
[`data-model.md`](data-model.md).

## What belongs here

- Durable principles about how data is structured and handled, with rationale

## What does not belong here

- Actual table design (see [`data-model.md`](data-model.md); migrations in
  `supabase/migrations/` once real)
- Product-level referral/rewards policy (see
  `docs/01-product/referral-and-rewards-concept.md`)

## Principles

1. **Stable public URLs over rotatable secrets.** The public Miami Roots URL space
   (site, group pages, referral URLs, QR codes) must remain stable even as WhatsApp
   invite links change. Invite links are operational data resolved server-side at
   request time — never baked into shared URLs, marketing material, QR codes, client
   bundles, or seed files.

2. **Referral attribution and membership verification are separate records, separated in
   time.** Attribution is captured early (visit/onboarding); reward-relevant status waits
   for verification and retention. One status field can't represent this — the timeline
   matters.

3. **Corrections supersede; they never overwrite.** Admin corrections (attribution
   reassignment, un-verification) create new records or audited transitions with the
   prior state preserved. If it was worth recording, it's worth keeping when it changes.

4. **Append-only where money-like or trust-like:** the points ledger, consent events, and
   the audit log take inserts only — enforced mechanically (revoked UPDATE/DELETE), not
   by convention. Mistakes are fixed with compensating entries.

5. **Canonical vs derived is explicit for every value.** Balances, counts, funnel
   metrics, and leaderboards are projections; domain tables and the ledger are truth.
   When they disagree, the projection is rebuilt — never patched by hand.

6. **Idempotency at every seam that can fire twice.** Event dedup keys, unique
   constraints on side effects (one maturation payout, one redemption debit), and
   guarded state transitions (`WHERE status = expected`) make retries and concurrent
   admins safe by construction.

7. **Deny-by-default access.** Every table has RLS enabled from creation; policies grant
   the minimum per the role matrix
   ([`identity-and-authorization.md`](identity-and-authorization.md)). Tables with no
   client-facing purpose get no client policies at all.

8. **Data minimization as a schema property.** Collect only fields with a stated purpose
   (see [`../01-product/onboarding-specification.md`](../01-product/onboarding-specification.md));
   sensitive fields are isolated in tables that public queries never touch; events and
   logs reference UUIDs, not identities. Notably: **group selection (including Sober
   Social) is stored as interest in a group, never as a health or lifestyle attribute.**

9. **Retention is designed, not accidental.** Unverified submissions purge at 90 days;
   network metadata hashes at 30; member deletion anonymizes identity while preserving
   ledger/audit integrity via surviving UUIDs. Every table states its retention rule in
   [`data-model.md`](data-model.md).

10. **Design for manual operability while small.** An admin must be able to read and
    reason about the data through the Supabase dashboard without bespoke tooling —
    plain-language status values, human-readable reason codes, no clever encodings.
    Don't over-engineer for scale the community isn't at.

## Relationship to other documents

- [`data-model.md`](data-model.md) — the concrete model implementing these principles
- [`privacy-and-safety.md`](privacy-and-safety.md) — the privacy side of minimization and
  retention
- `docs/01-product/referral-and-rewards-concept.md` — product-level counterpart
- `docs/07-decisions/decision-log.md` — where schema decisions get recorded when made
