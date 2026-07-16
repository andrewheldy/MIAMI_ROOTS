---
title: Information Architecture
type: design
status: draft
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [design, information-architecture]
---

## Purpose

Sketches the rough page/section structure of the initial gateway, before any UI is built,
so navigation and content ownership are considered early.

## What belongs here

- Rough page/section list and what each contains
- Navigation relationships between them

## What does not belong here

- Visual layout, components, or styling (not started)
- Copy itself (see `docs/04-design/content-and-voice.md` for tone; actual copy isn't
  written yet)

## Known initial information

Rough, provisional structure implied by `docs/01-product/product-scope.md`:

- **Landing / introduction** — Miami Roots intro and ethos, entry point for both direct
  and referred visitors.
- **Group selection** — displays the current community groups
  (`docs/00-context/community-groups.md`) and lets a visitor pick relevant ones.
- **Onboarding form** — lightweight info capture, tied to whichever group(s) were
  selected and to referral attribution if present.
- **Post-submission / invite hand-off** — where invite-link clicks happen, leading out to
  WhatsApp.
- **Member area (referral link/QR code)** — where a verified member retrieves their
  personal referral link and QR code. Whether this requires login is an open question
  (`docs/02-planning/open-questions.md`, #1).
- **Admin area** — member, referral, chat-link, verification, and points/rewards
  management. Entirely separate access level from the public-facing pages.

This is a first pass for planning purposes, not a sitemap ready for implementation.

## Relationship to other documents

- `docs/01-product/product-scope.md` — the functionality this structure needs to expose
- `docs/01-product/user-journeys.md` — the flows this structure needs to support
- `docs/04-design/brand-foundation.md` — the visual identity these pages would use
