---
title: Testing Strategy
type: delivery
status: proposed
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [delivery, testing]
---

## Purpose

The concrete testing plan for the MVP: what each layer covers, and the specific
high-risk scenarios that must have tests before the feature that owns them is considered
done. Expanded 2026-07-16 from intent to plan; test *code* arrives with the milestones in
`implementation-plan.md`.

## What belongs here

- Layer responsibilities and tooling intent
- The named scenario catalog (the tests that must exist, by area)

## What does not belong here

- Test code (future `tests/`)
- CI mechanics (arrive at M1)

## Layers

| Layer | Scope | Runs | Notes |
|---|---|---|---|
| **Unit** (`tests/unit`) | Pure logic: validation schemas, E.164 normalization, slug rules, cookie signing, window math, points arithmetic | Every push, no DB/network | Property-based tests for windows and normalization |
| **Database/constraints** (`tests/integration`) | Migrations on clean DB; unique/partial constraints; append-only enforcement; guarded transitions | CI against local Supabase | Constraint tests assert the *mechanism*, not the app code |
| **RLS** (`tests/integration`) | The full role × table matrix from `docs/03-architecture/identity-and-authorization.md`, exercised as real roles (anon/member/admin JWTs) | CI | Deny-by-default proven: default expectation in the harness is "no access" |
| **Integration flows** | Server actions end-to-end against DB: submission processing, attribution binding, transitions, ledger posting | CI | Includes retry/idempotency assertions |
| **End-to-end** (`tests/e2e`, Playwright) | The journeys in `docs/01-product/user-journeys.md` through the real UI, mobile viewport first | CI (critical set), full nightly | Two-actor flows (applicant + admin) scripted |
| **Accessibility** | axe checks on public + member pages; keyboard-only onboarding | With e2e | Mobile-first layouts asserted at 360px width |
| **Production smoke** | Post-deploy: public pages render, `/r/` sets cookie, form validates (not submits), admin auth gate holds | Every production deploy | No test data written to prod |

## Named scenario catalog

The scenarios below are the risk register expressed as tests. Each belongs to the
milestone that builds the feature; a milestone is not done while its scenarios lack
tests.

### Referral attribution (M5–M6)

- First-touch honored: second `/r/other` visit does not overwrite an unexpired cookie.
- Manual code beats cookie; invalid manual code rejected without losing the submission.
- **Cookies disabled:** flow completes; attribution only via manual code; no errors.
- **Shared device:** cookie cleared post-submission; next applicant on same browser gets
  no inherited referrer.
- **Self-referral:** connector's own phone/email blocked and flagged, submission still
  processed unattributed.
- Direct visit → `referral_source=none`, journey unbroken.
- Attribution expiry at 90 days; maturation exactly-once under concurrent triggers.

### Onboarding integrity (M6)

- **Duplicate phone numbers:** merge behavior; original attribution locked; verified
  member resubmission → re-engagement, not new applicant.
- Concurrent double-submit of the same form → one member, one attribution.
- Submission rows immutable; consent rows carry the correct guidelines version.
- Honeypot/rate-limit trips recorded, don't 500.

### Invite-link protection (M7) — highest severity

- Authorization matrix: unapproved applicant, wrong group, revoked membership, expired
  token, other member's membershipId → all denied.
- **Leak hunt:** rendered public HTML, client JS bundles, seed files, and repo tree
  contain no `chat.whatsapp.com` URL (automated in CI, plus M15 manual pass).
- Reveal/redirect responses carry `no-store`; reveal events + audit rows written; logs
  for those paths contain no destination URL.
- Rotation: old link retired mid-flight → re-rendered reveal shows the new link; public
  URLs unchanged.

### Admin workflow correctness (M8–M9)

- **Concurrent verification:** two admins verify/reject the same row — one wins, second
  gets informative conflict; no double side effects.
- **Reversals:** un-verify after maturation → attribution reversed, compensating ledger
  entry, all audited, nothing deleted.
- **Admin attribution corrections:** supersede chain intact; both connectors' views
  reflect the change; history complete.
- Privilege escalation: member JWT cannot read admin surfaces or call admin actions
  (route + RLS + action-level).
- Every transition writes exactly one audit row (completeness sweep).

### Points and rewards (M10, M13)

- Double-payout impossibility (unique constraint) under concurrent maturation.
- Ledger UPDATE/DELETE rejected for all app roles (mechanical append-only).
- Projection rebuild equals ledger sum after arbitrary scenario sequences.
- **Concurrent reward redemption / double redemption** (M13): idempotency key +
  balance re-check inside transaction; cancel-after-approve credits back exactly once.

### Privacy and lifecycle (M6, M11, M15)

- Member A's session cannot read member B's anything (RLS leakage sweep).
- Referrer sees referred person's name + status only — response shape asserted.
- **Member deletion:** anonymization irreversibly clears personal fields; ledger/audit
  remain consistent; **consent withdrawal** recorded and reflected.
- Events/logs contain no phone numbers, emails, or invite URLs (redaction sweep with
  seeded canaries).
- Purge jobs: 90-day unverified submissions, 30-day network hashes — idempotent,
  audited.

### Platform (M1, M3, M15)

- Rate limiting on `/join`, `/r/`, `/login`, QR, reveal — trips at configured
  thresholds, recovers, emits events.
- **Migration rollback:** every migration has a rehearsed down-path or a documented
  forward-fix note *before* it ships (rollback rehearsal is part of M15).
- Backup restore rehearsal into staging (M15).

## Principles

Test the mechanism, not the mood: correctness properties (exactly-once, deny-by-default,
append-only) are asserted at the database layer where they're enforced, and again through
the app path that exercises them. Correction/reversal paths get the same coverage depth
as happy paths — per `docs/03-architecture/data-principles.md`, they *are* the product.

## Relationship to other documents

- `docs/08-delivery/implementation-plan.md` — which milestone owns which scenarios
- `docs/03-architecture/data-model.md` — the machines these scenarios exercise
- `docs/08-delivery/release-checklist.md` — launch-time verification
