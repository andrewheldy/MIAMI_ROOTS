---
title: Onboarding Specification
type: product
status: proposed
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [product, onboarding, privacy]
---

## Purpose

Specifies the lightweight onboarding flow field by field: what is collected and why, what
is deliberately not collected, validation, duplicates, and consent. This resolves open
question #2 as a **recommended default** pending owner ratification (see
`docs/07-decisions/decision-log.md`).

## What belongs here

- Required/optional/never-collected fields with purpose and retention
- Validation, duplicate handling, consent mechanics

## What does not belong here

- Auth model (see [`../03-architecture/identity-and-authorization.md`](../03-architecture/identity-and-authorization.md))
- Admin processing workflow (see [`../05-operations/member-onboarding.md`](../05-operations/member-onboarding.md))
- Form UI design (future design work)

## Principles

Ask only for what onboarding *uses*; say why next to the field; the form should take
under a minute on a phone. Every field maps to a stated purpose and a retention rule —
if a purpose can't be stated, the field is cut.

## Required fields

| Field | Purpose | Validation |
|---|---|---|
| First name | Addressing the person; admin recognition at verification | 1–50 chars, trimmed; no URLs/emoji-only |
| WhatsApp phone number | **The verification key**: the number an admin matches in the WhatsApp participant list; duplicate detection | Normalized to E.164 (default region US); length/prefix sanity; uniqueness handled at processing (below) |
| Group selection (≥1) | What they're joining; creates `group_memberships` rows | Must be active, public groups; max = all six |
| Community-guideline acceptance | Consent gate; versioned legal record | Unchecked-by-default checkbox; stores `guidelines_version` in `consent_events` |
| Contact consent | Permission to contact them about their application via WhatsApp/email | Unchecked-by-default checkbox; recorded in `consent_events` |

## Optional fields

| Field | Purpose | Validation |
|---|---|---|
| Last name | Disambiguation in admin queues | ≤50 chars |
| Email | **Account activation** (magic link → connector dashboard); fallback contact | RFC-shape check + lowercase; explained inline: "needed later to access your referral dashboard" |
| Instagram handle | Community connection; admin plausibility signal | `@`-stripped, `[a-z0-9._]{1,30}` |
| Referral code | Manual attribution when no cookie (see [`../03-architecture/referral-system.md`](../03-architecture/referral-system.md)) | Must resolve to an active slug; explicit entry beats cookie |
| "What brings you to Miami Roots?" (short text) | Human context for admin review; spam tell | ≤280 chars; never analyzed as data, never public |

## Deliberately not collected

Date of birth, address/ZIP, gender, photo, employer/title, links other than Instagram,
password (no passwords exist in the system), and **anything health- or
sobriety-related** — selecting Sober Social is stored as group interest only, per the
hard rule in [`../03-architecture/privacy-and-safety.md`](../03-architecture/privacy-and-safety.md).
"How did you hear about us" is served by referral attribution and is not asked
separately.

## Duplicate handling

Phone (E.164) is the duplicate key, applied at server-side processing:

- Same phone, pending state → treated as an update/re-request: latest group selections
  merge into the open lifecycle; **original referral attribution is kept** (first
  submission locks credit; changes are admin corrections).
- Same phone, already a verified member → no new member record; surfaced to admins as
  re-engagement (e.g. wants an additional group) rather than a new applicant.
- Every raw submission row is retained as an immutable record regardless
  ([`../03-architecture/data-model.md`](../03-architecture/data-model.md)).

## Anti-abuse (form level)

Server-side validation of everything; rate limit per IP-hash; hidden honeypot field;
no CAPTCHA in MVP (friction not yet justified — decision gate if spam appears). The
human approval step before invite reveal is the real backstop.

## Consent and data-use disclosure (copy requirement)

At the point of submission the form states, in plain warm language (voice per
`docs/04-design/content-and-voice.md`): what's collected and why; that admins review
applications; that the person who referred them will see their **name and application
status** (not contact info); that data is never sold or shared with partners; and how to
request deletion. Retention: unverified submissions purge after 90 days.

## Relationship to other documents

- [`../03-architecture/identity-and-authorization.md`](../03-architecture/identity-and-authorization.md) — why no account is created here
- [`../03-architecture/referral-system.md`](../03-architecture/referral-system.md) — referral-code precedence
- [`../03-architecture/privacy-and-safety.md`](../03-architecture/privacy-and-safety.md) — minimization and Sober Social rules
- [`../05-operations/member-onboarding.md`](../05-operations/member-onboarding.md) — what admins do with submissions
