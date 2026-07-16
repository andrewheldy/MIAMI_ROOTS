---
title: Product Scope
type: product
status: draft
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [product, scope]
---

## Purpose

Defines what the initial Miami Roots product (the community gateway) actually does, at a
functional level, so implementation work has a clear boundary to build against.

## What belongs here

- The concrete capabilities of the initial gateway product
- What's explicitly deferred to a later phase (with a pointer, not full detail)

## What does not belong here

- UI layout or visual design (see `docs/04-design/information-architecture.md`)
- Data model or schema (see `docs/03-architecture/`)
- Step-by-step user flows (see `docs/01-product/user-journeys.md`)
- Anything fully out of scope, not just deferred (see `docs/01-product/out-of-scope.md`)

## Known initial information

### In scope for the initial gateway

- Introduce Miami Roots and its ethos to a first-time visitor
- Display the current WhatsApp community groups (see
  `docs/00-context/community-groups.md`)
- Let a visitor select the group(s) relevant to them
- Capture lightweight member onboarding information
- Attribute a new member to whoever referred them
- Issue each member a personal referral link and a QR code version of it
- Track, at minimum: referral clicks, onboarding submissions, invite-link clicks, verified
  joins, retention signals, contributions, points, and rewards
- Give administrators tooling to manage members, referral attribution, chat invite links,
  verification, points, and rewards

### Explicitly future (not initial scope, but expected to exist eventually)

- Events, RSVPs, and attendance tracking
- Partner offers
- Community projects
- A member directory

These are named in the founding brief as eventual product surface, but no detail on them
belongs in the initial build — see `docs/02-planning/roadmap.md` for phasing.

## Relationship to other documents

- `docs/01-product/user-types.md` — who uses each part of this scope
- `docs/01-product/user-journeys.md` — how the in-scope flows actually play out
- `docs/01-product/out-of-scope.md` — what is not planned at all right now
- `docs/02-planning/roadmap.md` — when future scope might get picked up
