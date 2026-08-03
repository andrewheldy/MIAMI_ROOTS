---
title: Referral and Rewards Concept
type: product
status: proposed
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [product, referrals, rewards, points]
---

## Purpose

The product-level policy for referrals, points, and rewards. Founding principles are
retained; the 2026-07-16 planning pass adds a concrete **recommended initial policy**
(labeled as such — point values and catalog remain owner decisions to ratify, per open
questions #4–5).

## What belongs here

- Principles that hold regardless of mechanics
- The recommended initial points policy and reward posture
- What is explicitly excluded or deferred

## What does not belong here

- Attribution mechanics (see [`../03-architecture/referral-system.md`](../03-architecture/referral-system.md))
- Ledger schema (see [`../03-architecture/data-model.md`](../03-architecture/data-model.md))
- Day-to-day admin procedure (see [`../05-operations/rewards-operations.md`](../05-operations/rewards-operations.md))

## Core principles (unchanged from founding)

- Rewards follow **verified participation**, never raw clicks — a click or submission is
  a signal, not an outcome.
- **Attribution and verification are separate events**, separated in time; reward status
  waits for verification (and now: retention).
- **Attribution is correctable** by admins, with history.
- **Points are an append-only ledger**; totals are projections.
- **Simple enough to operate manually** while the community is small.

## Recommended initial policy (recommended default, 2026-07-16)

### Earning

| Action | Points | When |
|---|---|---|
| Referral matures (referred person verified in a group **and** still present at 14 days) | **100** | Automatic ledger entry at maturation, idempotent |
| Community contribution (organizing an activity, meaningful help — admin-judged) | **25–250**, admin-granted with reason code | Manual adjustment entry |
| Joining, clicking, submitting, or being referred | **0** | Never point-earning by themselves |

Placeholder magnitudes chosen for legibility (a matured referral "feels like" 100);
the *ratio* (contribution can outweigh referrals) is the deliberate part — it encodes
"reward genuine contribution, not invitation volume" from
[`../00-context/vision-and-ethos.md`](../00-context/vision-and-ethos.md).

- **Pending vs available:** a referral that is verified but not yet retained shows as
  *pending* (derived, no ledger row); points become *available* only at maturation.
- **No expiration, no decay** — unnecessary complexity and it reads as punitive.
- **Reversals**: un-verification/fraud posts a compensating negative entry; balances may
  go negative transiently on reversal (acceptable; visible; honest).

### Redemption — MVP boundary (recommended default)

**Earning ships in MVP; redemption ships immediately after MVP.** Reasons: the catalog
(open question #5) needs owner decisions with partners/inventory that don't exist yet;
redemption adds workflow, inventory, and dispute surface that isn't needed to launch the
gateway loop; and the connector dashboard showing a growing balance plus "rewards are
coming at launch+1" keeps motivation intact without blocking launch. The ledger and
redemption tables are designed now (see data model) so activation is configuration, not
rework.

Initial catalog direction (for the owner to ratify later): recognition and access first —
featured connector shout-outs, first access to events, merch when it exists — not cash.

### Explicitly excluded (unchanged, restated)

No crypto tokens, no cash or cash-equivalent balances, no gambling mechanics, no
sweepstakes constructions, no pay-for-points. These stay excluded regardless of catalog
decisions.

## Anti-gaming posture

Maturation (verify + retain) is the primary control; self-referrals are blocked;
fraud signals are surfaced for admin review rather than auto-punished
([`../03-architecture/referral-system.md`](../03-architecture/referral-system.md)).
Member-facing copy avoids quota/funnel framing per
[`../04-design/content-and-voice.md`](../04-design/content-and-voice.md) — the dashboard
celebrates people joined, not "conversion".

## Relationship to other documents

- [`../03-architecture/referral-system.md`](../03-architecture/referral-system.md) — mechanics
- [`../03-architecture/data-model.md`](../03-architecture/data-model.md) — ledger + state machines
- [`../05-operations/rewards-operations.md`](../05-operations/rewards-operations.md) — admin procedure
- [`founding-connectors-program.md`](founding-connectors-program.md) — a **separate**
  system: owner-issued NFC/QR cards that credit no points and involve no ledger. The two
  share the `/r/` namespace but not their lifecycles (open question #15)
- `docs/02-planning/open-questions.md` #4–5 — the owner ratifications still needed
