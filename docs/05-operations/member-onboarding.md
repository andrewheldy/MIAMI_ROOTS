---
title: Member Onboarding
type: operations
status: draft
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [operations, onboarding]
---

## Purpose

Describes how member onboarding is expected to be run operationally — what an admin does,
by hand if necessary, until (and after) the product automates parts of it.

## What belongs here

- The operational steps around onboarding, from an admin's perspective
- How referral attribution corrections are actually handled
- What can be done manually vs. what needs product support

## What does not belong here

- The visitor-facing flow itself (see `docs/01-product/user-journeys.md`)
- Verification mechanics (see `docs/05-operations/membership-verification.md`)

## Known initial information

While the community is small, onboarding operations should stay simple enough to run
manually:

- An admin should be able to see new onboarding submissions and their referral attribution
  (if any) without specialized tooling — e.g. directly via the Supabase dashboard while no
  admin UI exists yet.
- **Referral attribution must be correctable.** If a new member reports the wrong referrer
  was credited, or a submission came in with missing/incorrect attribution, an admin needs
  a way to fix it — and that correction should be recorded, not just silently overwritten
  (see `docs/03-architecture/data-principles.md`).
- Onboarding submission and verified join are separate operational steps — a submission
  does not by itself make someone a member (see `docs/05-operations/membership-verification.md`).

Concrete onboarding fields and validation rules are not yet decided — see
`docs/02-planning/open-questions.md`, #2.

## Relationship to other documents

- `docs/01-product/user-journeys.md` — the flow this operates
- `docs/05-operations/membership-verification.md` — what happens after onboarding
- `docs/03-architecture/data-principles.md` — the correction/audit-trail principle
