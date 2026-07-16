---
title: Rewards Operations
type: operations
status: draft
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [operations, rewards, points]
---

## Purpose

Describes how points and rewards are expected to be administered day to day, distinct from
the product-level concept behind them.

## What belongs here

- Operational steps for granting, correcting, and redeeming points/rewards
- How admins are expected to review and act on the points ledger

## What does not belong here

- The underlying principles (see `docs/01-product/referral-and-rewards-concept.md`)
- Ledger data-model detail (see `docs/03-architecture/data-principles.md`)

## Known initial information

No rewards mechanics are decided yet (see `docs/02-planning/open-questions.md`, #4 and
#5), so this document currently holds operating principles only:

- Points should be **grantable and correctable by an administrator**, with a visible
  history of why a point event was recorded (append-only ledger — see
  `docs/03-architecture/data-principles.md`) rather than a single editable total.
- Rewards should be tied to **verified participation**, not raw click/referral counts —
  see `docs/01-product/referral-and-rewards-concept.md`.
- Until the community and reward catalog are both small, redemption can reasonably be
  handled manually by an admin rather than through an automated redemption flow.

## Relationship to other documents

- `docs/01-product/referral-and-rewards-concept.md` — the concept this operationalizes
- `docs/03-architecture/data-principles.md` — the ledger principle
