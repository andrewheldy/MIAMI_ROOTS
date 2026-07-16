---
title: Release Checklist
type: delivery
status: draft
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [delivery, release]
---

## Purpose

A placeholder checklist for what needs to be true before the initial gateway product is
released publicly. Not usable yet — filled in as the product takes shape.

## What belongs here

- Concrete, checkable items that must be true before release
- Grouped by concern (functional, legal, operational, safety)

## What does not belong here

- Long-term roadmap items (see `docs/02-planning/roadmap.md`)
- Implementation task tracking (see `docs/08-delivery/implementation-plan.md`)

## Known initial information

No release has been planned yet. Draft categories to fill in once the product exists:

- [ ] Onboarding flow captures and stores only the fields decided in
      `docs/02-planning/open-questions.md` (#2), with consent language reviewed
- [ ] Referral attribution, verification, and points ledger all behave per
      `docs/03-architecture/data-principles.md` (including admin correction paths)
- [ ] Row-level security policies reviewed against `docs/03-architecture/privacy-and-safety.md`
- [ ] Research items in `docs/06-research/research-backlog.md` that block launch (privacy
      obligations, terms of service) are resolved
- [ ] Invite links for all live groups are current and correctly mapped (see
      `docs/05-operations/chat-link-management.md`)
- [ ] `.env.example` reflects every environment variable actually required, with no real
      secrets anywhere in the repo or deployment config history
- [ ] Basic admin tooling exists for members, referrals, chat links, verification, points,
      and rewards per `docs/01-product/product-scope.md`

This list should grow substantially as implementation proceeds — it is not close to
complete.

## Relationship to other documents

- `docs/08-delivery/implementation-plan.md` — the work this checklist gates
- `docs/06-research/research-backlog.md` — research items that may block release
