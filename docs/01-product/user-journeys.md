---
title: User Journeys
type: product
status: draft
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [product, journeys]
---

## Purpose

Walks through the primary end-to-end flows the initial gateway needs to support, in plain
language, before any UI or schema work begins.

## What belongs here

- Step-by-step narrative flows for each user type's main path
- The key events each flow needs to produce (for tracking/analytics purposes)

## What does not belong here

- Wireframes or visual layout (see `docs/04-design/information-architecture.md`)
- Database events/tables that implement tracking (see `docs/03-architecture/`)
- Edge cases better suited to an open question (see `docs/02-planning/open-questions.md`)

## Known initial information

### 1. Referral → onboarding → verified join

1. A member shares their personal referral link or QR code with someone outside the
   community.
2. The invitee opens the link → **referral click** recorded, attributed to the referrer.
3. The invitee sees the Miami Roots introduction and the group list, and selects the
   group(s) relevant to them.
4. The invitee submits lightweight onboarding info → **onboarding submission** recorded,
   still attributed to the referrer.
5. The invitee clicks through to a WhatsApp group invite link → **invite-link click**
   recorded.
6. The invitee actually joins the WhatsApp group. At some point — manually or via an
   automated check — this is confirmed → **verified join** recorded. This is a distinct
   event from referral attribution and can happen a meaningful time after it (see
   `docs/00-context/glossary.md`).
7. Once verified, the person is a **member**, and the referrer may become eligible for
   referral-related points/rewards per whatever policy is decided (see
   `docs/01-product/referral-and-rewards-concept.md`).

### 2. Direct (non-referred) discovery

A visitor may arrive without a referral link (e.g. word of mouth, a public post). The same
onboarding → invite-link click → verified join flow applies, simply without referral
attribution. This path must not be broken or degraded just because there's no referrer to
credit.

### 3. Administrator correction

An admin needs to be able to correct referral attribution after the fact (e.g. wrong
referrer credited, referral link shared incorrectly) — see
`docs/05-operations/member-onboarding.md` and `docs/07-decisions/decision-log.md` for the
underlying principle.

## Relationship to other documents

- `docs/01-product/product-scope.md` — the capabilities these journeys are built from
- `docs/01-product/referral-and-rewards-concept.md` — what happens after a verified join
- `docs/05-operations/member-onboarding.md` — the operational side of onboarding
- `docs/05-operations/membership-verification.md` — how verification is actually performed
