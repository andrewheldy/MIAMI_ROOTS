---
title: Membership Verification
type: operations
status: draft
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [operations, verification]
---

## Purpose

Describes how a "verified join" is expected to be confirmed operationally — turning a
prospective member who clicked an invite link into a recorded member.

## What belongs here

- The operational process for confirming someone actually joined a WhatsApp group
- Who is responsible for performing/approving verification

## What does not belong here

- The technical mechanism, if/when one exists (see `docs/03-architecture/integrations.md`)
- Points/rewards that result from verification (see
  `docs/05-operations/rewards-operations.md`)

## Known initial information

Verification is a **distinct event from referral attribution and from the invite-link
click** — someone can click an invite link and not verify (or not immediately), and
attribution can exist well before verification happens (see
`docs/00-context/glossary.md`).

How verification is actually performed — an admin manually checking WhatsApp group
membership, some form of automated confirmation, or a hybrid — is not yet decided (see
`docs/02-planning/open-questions.md`, #3). Until it is:

- Assume verification is a **manual admin action** that an admin can perform against a
  prospective member's record.
- The system should not assume verification happens immediately or automatically after an
  invite-link click.
- Whatever mechanism is chosen, it needs to stay simple enough to operate while the
  community is small (see `docs/03-architecture/data-principles.md`).

## Relationship to other documents

- `docs/00-context/glossary.md` — the verified-join definition
- `docs/01-product/user-journeys.md` — where verification sits in the overall flow
- `docs/02-planning/open-questions.md` — the unresolved verification mechanism question
