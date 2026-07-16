---
title: Testing Strategy
type: delivery
status: draft
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [delivery, testing]
---

## Purpose

States the intended shape of testing for Miami Roots, ahead of any test actually being
written, so `tests/unit`, `tests/integration`, and `tests/e2e` have a clear purpose from
the start.

## What belongs here

- What each test layer is for and roughly what it should/shouldn't cover
- Any testing principles specific to this project (e.g. around referral/verification
  correctness)

## What does not belong here

- Actual test code (belongs in `tests/`, none exists yet)
- CI configuration (belongs in `.github/workflows/`, not yet configured)

## Known initial information

No tests exist yet — this document is intent only.

- **`tests/unit/`** — pure logic: e.g. referral-attribution rules, points-ledger
  calculations, validation logic. Should not require a database or network.
- **`tests/integration/`** — logic that touches Supabase (RLS policies, ledger writes,
  admin-correction flows) against a real or local Supabase instance.
- **`tests/e2e/`** — full user journeys from `docs/01-product/user-journeys.md` (e.g.
  referral click → onboarding → invite-link click) driven through the actual UI.

Given that referral attribution and points are meant to be correctable/append-only (see
`docs/03-architecture/data-principles.md`), test coverage for those flows should
specifically include correction scenarios, not just the happy path.

## Relationship to other documents

- `docs/03-architecture/data-principles.md` — the data guarantees tests should verify
- `docs/08-delivery/implementation-plan.md` — when test infrastructure actually gets built
