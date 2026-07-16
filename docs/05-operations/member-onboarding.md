---
title: Member Onboarding
type: operations
status: proposed
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [operations, onboarding]
---

## Purpose

What admins do with onboarding submissions — review, approval, correction — from the
operational side. The visitor-facing flow is
[`../01-product/user-journeys.md`](../01-product/user-journeys.md); the field
specification is
[`../01-product/onboarding-specification.md`](../01-product/onboarding-specification.md).

## What belongs here

- The admin review step: what to check, how to act
- Referral-attribution corrections in practice
- Manual vs product-supported operation over time

## What does not belong here

- Verification of joins (see [`membership-verification.md`](membership-verification.md))
- Attribution rules themselves (see [`../03-architecture/referral-system.md`](../03-architecture/referral-system.md))

## Review step (workflow step 2)

New submissions land in a pending-review queue (`/admin/requests` once shipped; the
Supabase dashboard is the interim tool — submissions are readable rows with
plain-language statuses by design). For each submission an admin checks:

- **Plausibility:** does this read like a real person (name, optional Instagram, the
  "what brings you" note)? Fraud signals from
  [`../03-architecture/referral-system.md`](../03-architecture/referral-system.md)
  (burst patterns, self-referral flags) are surfaced alongside.
- **Duplicates:** same phone → the system already merged into the existing lifecycle;
  the admin just confirms nothing odd (e.g. someone re-applying under a new name).
- **Group fit:** nothing to gate hard in MVP (all six groups are open-to-apply), but an
  admin may reach out via the consented contact channel when something needs a human
  conversation before approval.

Approve → the applicant gets their gated invite reveal for each approved group.
Reject → reason recorded (spam/duplicate/other), audited; rejection is reversible by a
later re-submission.

**Queue discipline:** aim to clear review within 24–48h — the applicant is warm now;
this queue is the MVP's operational heartbeat.

## Referral-attribution corrections

When a new member reports the wrong referrer was credited (or a connector disputes):

1. Admin opens the member's attribution (`/admin/referrals`), sees the full claim
   history (cookie visits, manual code, timestamps).
2. Correction creates a superseding attribution (`source=admin`) with a reason — the
   original is preserved, points consequences recompute through the normal
   maturation/reversal machinery, and both connectors' dashboards reflect reality.
3. Corrections are visible in the audit log; there is no silent-overwrite path.

## Manual now → product-supported later

| Task | While tiny (pre-admin-UI) | Once admin UI ships |
|---|---|---|
| Review queue | Supabase dashboard rows | `/admin/requests` with one-tap approve/reject |
| Contacting applicants | Admin's own WhatsApp/email (consented) | Same (no in-app messaging planned) |
| Attribution corrections | SQL-free dashboard edit is **not** allowed for attribution — corrections wait for the server action to exist, or are done by the developer via an audited script | `/admin/referrals` |

## Relationship to other documents

- [`../01-product/onboarding-specification.md`](../01-product/onboarding-specification.md) — the fields under review
- [`membership-verification.md`](membership-verification.md) — the next workflow stage
- [`../03-architecture/data-model.md`](../03-architecture/data-model.md) — submission immutability and lifecycle rows
