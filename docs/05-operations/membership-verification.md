---
title: Membership Verification
type: operations
status: proposed
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [operations, verification]
---

## Purpose

The precise manual/semi-manual workflow that turns a submission into a verified, retained
membership — who does what at each step, what evidence is required, and how mistakes get
undone. This operationalizes state machine 2 in
[`../03-architecture/data-model.md`](../03-architecture/data-model.md) and resolves open
question #3 as a **recommended default**: manual admin verification against the WhatsApp
participant list, with the product making each manual action cheap.

## What belongs here

- Step-by-step workflow with actor, evidence, and tooling per step
- Reversal, mismatch, and concurrency handling
- What is manual now vs automatable later

## What does not belong here

- State-machine formalism (see [`../03-architecture/data-model.md`](../03-architecture/data-model.md))
- Points consequences (see [`rewards-operations.md`](rewards-operations.md))

## The workflow

| Step | State after | Actor | Action & evidence | Manual or automatic |
|---|---|---|---|---|
| 1. Submission processed | `submitted` (per selected group) | System | Validated onboarding submission creates member + per-group lifecycle rows | Automatic |
| 2. Review | `approved` or `rejected` | **Admin** | Plausibility check (name/context/Instagram, fraud signals); reject records a reason | Manual (queue: `/admin/requests`; Supabase dashboard before that ships) |
| 3. Invite reveal | `invite_revealed` | Applicant (system records) | Approval notification links the applicant to their gated reveal page | Automatic once approved |
| 4. Invite click | `join_requested` | Applicant (system records) | Click-through redirect to WhatsApp | Automatic |
| 5. **Verification** | `verified` | **Admin** | Admin checks the group's WhatsApp participant list for the applicant's phone number; records evidence note (e.g. "matched ····1234 in Daytime Events participants") | **Manual — the load-bearing step** |
| 6. Retention check | `retained` | **Admin** (system reminds) | At +14 days a queue/reminder lists verifications due; admin confirms the person is still in the group | Manual with automatic scheduling |
| 7. Maturation & points | (referral `matured`) | System | If a referral attribution exists, it matures and posts the ledger entry idempotently | Automatic |

**Evidence standard for step 5:** the phone number from the member record visibly present
in the group's participant list. Name-only matches are insufficient (duplicates); if the
number isn't visible but the person demonstrably joined (e.g. they message the admin from
that number in the group context), the admin notes exactly what was seen. Evidence notes
must never contain other members' data or invite links.

## Mismatches and edge cases

- **Phone-number mismatch** (joined with a different number than submitted): admin
  confirms with the person, updates the member's phone (audited change), then verifies.
  Never verify against a number that isn't confirmed as theirs — attribution and
  duplicate-detection both key on it.
- **Joined without clicking through** (state still `approved`/`invite_revealed`):
  verification is allowed from those states; the skip is visible in the state history.
- **Never joined:** lifecycle simply rests at its last state; a 90-day unverified
  attribution expires automatically; no punitive action.
- **Left the group before day 14:** not retained — admin marks `revoked` with reason
  `left_before_retention`; any referral stays unmaturated (no points ever posted).

## Reversals and mistaken verification

An admin who verified the wrong person (or someone who then left/was removed) moves the
membership to `revoked` with a reason. Consequences cascade explicitly, never silently:
a matured referral is reversed and a compensating negative ledger entry posts; a
merely-verified referral returns to unverified credit state. Every step is audited;
nothing is deleted. Re-joining later re-uses the same lifecycle row (`revoked →
verified`).

## Concurrency

Two admins acting on the same row: transitions are guarded (`WHERE status = expected`);
the second actor gets "already handled by <name> at <time>" — informational, not an
error. Verification and reversal are therefore safe to work from a shared queue without
coordination.

## Automation boundary

Automatable later without workflow change: reminder scheduling (already system-driven),
queue prioritization, retention-check batching by group. **Not** automatable under
current assumptions: the join observation itself (see
[`../03-architecture/system-context.md`](../03-architecture/system-context.md)) — any
future WhatsApp Business API assist is a separate, researched decision.

## Relationship to other documents

- [`../03-architecture/data-model.md`](../03-architecture/data-model.md) — the state machine this drives
- [`member-onboarding.md`](member-onboarding.md) — the step-2 review context
- [`../03-architecture/referral-system.md`](../03-architecture/referral-system.md) — what maturation triggers
- [`../08-delivery/implementation-plan.md`](../08-delivery/implementation-plan.md) — when the admin tooling for this ships
