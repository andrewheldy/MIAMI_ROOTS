---
title: Referral and Rewards Concept
type: product
status: draft
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [product, referrals, rewards, points]
---

## Purpose

Captures the founding principles for how referrals, points, and rewards should work,
without committing yet to specific numbers, tiers, or a redemption catalog.

## What belongs here

- Principles that should hold regardless of exact mechanics
- The distinction between events in the referral/verification funnel
- What is explicitly deferred to later design work

## What does not belong here

- Specific point values or reward items (not yet decided — see
  `docs/02-planning/open-questions.md`)
- Database schema for the ledger (see `docs/03-architecture/data-principles.md`)
- Day-to-day admin procedures for granting/correcting points (see
  `docs/05-operations/rewards-operations.md`)

## Known initial information

### Core principles

- **Meaningful rewards should be based on verified participation, not only clicks.** A
  referral click or onboarding submission is a signal, not by itself a reward-worthy
  outcome.
- **Referral attribution and membership verification are different events**, and can be
  separated in time. Attribution should be recorded early (at click/onboarding), but
  reward-relevant status should generally wait for verification.
- **Administrators must be able to correct referral attribution** — attribution is not
  immutable once recorded; mistakes and disputes need a correction path.
- **Points should eventually use an append-only ledger, not only a mutable total.** A
  running total is fine as a read-optimized projection, but the source of truth should be
  a sequence of point-earning events so history, audits, and corrections are possible
  without destroying data.
- The system should stay **simple enough to operate manually** while the community is
  small — e.g. an admin should be able to look at a member's ledger and understand it
  without special tooling, even before any automation exists.

### What's deferred

- Concrete point values per action (referral, verified join, contribution, event
  attendance, etc.)
- The reward catalog and redemption mechanics
- Whether points ever expire or decay
- Anti-gaming rules beyond "verification matters more than clicks"

## Relationship to other documents

- `docs/01-product/user-journeys.md` — where in the flow these events occur
- `docs/03-architecture/data-principles.md` — the append-only ledger principle in more
  architectural detail
- `docs/05-operations/rewards-operations.md` — how this gets operated day to day
- `docs/02-planning/open-questions.md` — the concrete mechanics not yet decided
