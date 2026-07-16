---
title: Rewards Operations
type: operations
status: proposed
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [operations, rewards, points]
---

## Purpose

How admins operate points day to day under the recommended policy in
[`../01-product/referral-and-rewards-concept.md`](../01-product/referral-and-rewards-concept.md):
granting contribution points, reading the ledger, handling reversals, and (post-MVP)
fulfilling redemptions.

## What belongs here

- Admin procedures around the ledger and (later) redemptions
- Reason-code discipline

## What does not belong here

- Policy and point values (product doc above)
- Ledger mechanics (see [`../03-architecture/data-model.md`](../03-architecture/data-model.md))

## Operating the ledger

- **Referral points post themselves** at maturation — no admin action, no double-post
  possible (idempotent by constraint). The admin's lever is upstream: verification and
  retention confirmation.
- **Contribution grants** are manual adjustments: amount + reason code
  (`event_organizing`, `community_help`, `other` + required note) recorded via the admin
  surface. The reason note should let a member understand the entry a year later.
- **Reading a member's ledger** is designed to need no tooling: entries are
  plain-language, signed integers, in order; the balance is the sum. If a balance looks
  wrong, the ledger is right and the projection gets rebuilt — never a "fix-up" entry
  without an explanation.
- **Reversals** (fraud, mistaken verification): triggered from the membership/referral
  surfaces, which post the compensating entries automatically with linkage. Manual
  compensating entries are a last resort and must reference what they compensate.

## Redemptions (activates post-MVP)

When the catalog launches: member requests → admin approves (balance re-checked, debit
posts) → admin fulfills (hands over the reward) → marked fulfilled. Cancel at any
pre-fulfillment point credits back automatically. Two admins can't double-approve
(guarded transitions); a member can't double-redeem (idempotency key + balance check).
Until then, the surfaces stay dark — no manual IOUs; if the owner wants to give someone
a reward early, that's a contribution grant with a note, not a shadow redemption.

## Discipline

Every manual entry is audited with the acting admin; the owner reviews adjustments in
the audit log periodically. No admin adjusts their own balance (owner does it, or a
second admin) — recommended default, enforceable socially now, mechanically later.

## Relationship to other documents

- [`../01-product/referral-and-rewards-concept.md`](../01-product/referral-and-rewards-concept.md) — the policy
- [`../03-architecture/data-model.md`](../03-architecture/data-model.md) — ledger + redemption machines
- [`membership-verification.md`](membership-verification.md) — the upstream admin lever
