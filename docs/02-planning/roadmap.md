---
title: Roadmap
type: planning
status: active
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [planning, roadmap]
---

## Purpose

The phase-level view of how Miami Roots grows, with an explicit MVP boundary. Updated
2026-07-16 to align with the MVP architecture plan. Directional, not a committed
schedule; the milestone-level detail for the active phase lives in
[`../08-delivery/implementation-plan.md`](../08-delivery/implementation-plan.md).

## What belongs here

- Phase groupings, ordered, with the MVP/post-MVP boundary explicit
- No dates unless actually decided

## What does not belong here

- Milestone detail (implementation plan)
- Excluded-entirely items (see `docs/01-product/out-of-scope.md`)

## Phases

### Phase 0 — Repository foundation ✅ (complete 2026-07-16)

Documentation, brand context, directory structure.

### Phase 0.5 — Asset organization & MVP planning ✅ (complete 2026-07-16)

Canonical asset layout, private-inputs convention, and the full MVP architecture and
implementation plan (this planning pass).

### Phase 1 — Community gateway MVP (next; milestones M1–M12, M14, M15)

The branded gateway end to end: public pages, referral capture (`/r/<slug>`), lightweight
onboarding, gated invite-link access, manual admin verification, referral maturation,
points **earning** (append-only ledger), connector dashboard with QR/sharing, first-party
analytics, launch hardening. Boundary decisions of note: reward **redemption** is
deliberately just outside MVP; moderation tooling, leaderboards, and any WhatsApp API
automation are out.

### Phase 2 — Engagement and retention (starts with M13 + M16 items)

Reward redemption + catalog, refined retention definition (open question #7), improved
admin tooling as workload data arrives, member-facing polish informed by real funnel
metrics.

### Phase 3 — Events and participation

Events, RSVPs, attendance tracking wired to the same member/points system.

### Phase 4 — Directory and partnerships

Member-facing (not public) directory; partner offers — under the no-data-sharing posture
in [`../03-architecture/privacy-and-safety.md`](../03-architecture/privacy-and-safety.md).

### Phase 5 — Community projects

Structured support for community-organized projects.

### Unscheduled, decision-gated

Ticket Exchange group (explicit owner decision required); WhatsApp Business API
integration (requires research backlog #1 and demonstrated manual-workload pain).

## Relationship to other documents

- [`../08-delivery/implementation-plan.md`](../08-delivery/implementation-plan.md) — Phase 1 in executable detail
- `docs/01-product/out-of-scope.md` — excluded items
- [`open-questions.md`](open-questions.md) — the decisions gating phase content
