---
title: Information Architecture
type: design
status: active
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

## Implemented public architecture (Milestone 2)

The 2026-07-16 public-site redesign turns the provisional gateway outline into the
following public route and section structure. All routes are static/SSG Server Components
and read from the interim typed content module at
`src/features/groups/content.ts` until Milestone 4 moves group content into Supabase.

- **`/` — civic-brand landing experience:** full-height mission hero; the Miami
  transience/belonging story; six-community preview; future-facing initiative areas;
  honest empty-state structure for approved stories; non-statistical impact framing; and
  six ways to get involved.
- **`/groups` — community directory:** all six current groups, designed fallbacks for the
  three missing logos, and a clear starting path through General Chat.
- **`/groups/[slug]` — six statically generated detail pages:** purpose, audience,
  group-specific rules, gallery-ready structure, related communities, and a prominent
  prelaunch CTA. These pages never render invite links.
- **`/about` — mission and origin:** Andrew appears here, not on the homepage; the page
  frames the origin through friendships and keeps the mission/community larger than the
  founder.
- **`/guidelines` — versioned public draft:** shared norms plus the Nightlife no-resale
  rule and Sober Social non-clinical framing. Current displayed version:
  `2026-07-16-draft.1`.
- **`/find-your-people` — private-by-design matching guide:** three browser-only questions
  suggest two starting communities without an account, email address, or persisted data.
- **`/impact` — measurement thesis:** separates verified current structure from future
  proof, defines leading/lagging outcome categories, and sets explicit anti-surveillance
  boundaries.
- **`/partners` — funder and collaborator narrative:** the need, model, intended outcomes,
  partnership pathways, potential funded programs, and a clearly unavailable-until-ready
  partnership brief.
- **`/get-involved` — audience pathway router:** member, organizer, event, volunteer,
  host, business, civic, and funding entry points.
- **`/join` — public access-model explanation:** adults 18+, referral/organizer approval,
  organizer pathway, no live application capture, and labeled future MyVerse/Sidequests
  relationship.
- **`/contact` — prelaunch inquiry router:** directs visitors to the right public context
  and explicitly withholds a direct form until an owner-controlled channel exists.

The landing-page emotional sequence follows the redesign brief: wonder (root-network
hero) → curiosity (why the community exists) → belonging/discovery (community directory)
→ action (initiatives and get-involved paths). WhatsApp is described as the current
gathering layer, not the brand or product definition.

## Earlier planning outline

The earlier provisional structure implied by `docs/01-product/product-scope.md` remains
useful for the later authenticated/application routes:

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

This first pass has since been elaborated into a concrete proposed route map (URLs,
access levels, data dependencies, and per-route privacy/security notes) in
[`../03-architecture/application-architecture.md`](../03-architecture/application-architecture.md)
— that document is now the implementation-facing source; this one remains the
design-level summary.

## Relationship to other documents

- `docs/01-product/product-scope.md` — the functionality this structure needs to expose
- `docs/01-product/user-journeys.md` — the flows this structure needs to support
- `docs/04-design/brand-foundation.md` — the visual identity these pages would use
- [`../03-architecture/application-architecture.md`](../03-architecture/application-architecture.md) — the proposed route map
