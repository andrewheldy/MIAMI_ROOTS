---
title: Subgroup Asset Inventory
type: design
status: active
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [design, assets, community]
---

## Purpose

A per-subgroup coverage matrix of design assets and content source material — which
subgroups have what, and what is still missing — so asset gaps are visible at a glance
before the gateway is built.

## What belongs here

- One row per subgroup (current and future), one column per asset/content type
- Status of each cell: exists, missing, expected, or not applicable

## What does not belong here

- Full per-asset technical detail (see [`asset-register.md`](asset-register.md))
- Group purposes and rules (see [`../00-context/community-groups.md`](../00-context/community-groups.md))

## Coverage matrix (as of 2026-07-16)

Canonical slugs are the lowercase kebab-case names used for filenames, directories, and
(eventually) URLs.

| Subgroup | Slug | Logo | Banner | Social graphics | Bio screenshot (private) | MVP scope |
|---|---|---|---|---|---|---|
| General Chat | `general-chat` | ❌ missing | ❌ missing | ❌ none | ⏳ expected, not received | ✅ MVP |
| Business & Connections | `business-and-connections` | ❌ missing | ❌ missing | ❌ none | ⏳ expected, not received | ✅ MVP |
| Nightlife & Event Marketing | `nightlife-and-event-marketing` | ✅ `public/group-logos/nightlife-and-event-marketing-logo.png` | ❌ missing | ❌ none | ⏳ expected, not received | ✅ MVP |
| Daytime Events | `daytime-events` | ✅ `public/group-logos/daytime-events-logo.png` | ❌ missing | ❌ none | ⏳ expected, not received | ✅ MVP |
| Community Organizing | `community-organizing` | ❌ missing | ❌ missing | ❌ none | ⏳ expected, not received | ✅ MVP |
| Sober Social | `sober-social` | ✅ `public/group-logos/sober-social-logo.png` | ❌ missing | ❌ none | ⏳ expected, not received | ✅ MVP |
| Ticket Exchange | `ticket-exchange` | ✅ `public/group-logos/ticket-exchange-logo.png` (concept, non-square) | ❌ n/a for now | ❌ n/a for now | ⏳ n/a unless launched | 🚫 future only |

Parent brand coverage:

| Parent asset | Status |
|---|---|
| Miami Roots logo | ✅ `public/brand/logos/miami-roots-logo.png` |
| Miami Roots community banner | ⏳ announced by owner, **not received** — destination `public/brand/banners/` is ready |

## Gaps that matter for the MVP

1. **Three of the six MVP groups have no logo** (General Chat, Business & Connections,
   Community Organizing). Until dedicated marks arrive, the gateway should fall back to
   the parent mark or a neutral treatment — the group-card design must not assume every
   group has a logo.
2. **No banners exist at all** (parent or subgroup). The landing-page hero and any group
   headers need a design fallback until banners arrive.
3. **No social graphics exist.** Referral sharing cards will need to be generated or
   designed later (see [`asset-implementation-plan.md`](asset-implementation-plan.md)).
4. **Two logos display names that differ from group operating names** ("Daytime Roots" vs
   Daytime Events; "Nightlife Roots" vs Nightlife & Event Marketing). Whether logos or
   operating names change is an owner decision — recorded in
   [`../02-planning/open-questions.md`](../02-planning/open-questions.md).
5. **No group bio screenshots have been received**, so group descriptions in this repo
   cannot yet be checked against the real WhatsApp bios (see
   [`../00-context/whatsapp-community-inventory.md`](../00-context/whatsapp-community-inventory.md)).

## Relationship to other documents

- [`asset-register.md`](asset-register.md) — full technical register of existing assets
- [`../00-context/community-groups.md`](../00-context/community-groups.md) — group list
  and purposes
- [`../00-context/whatsapp-community-inventory.md`](../00-context/whatsapp-community-inventory.md)
  — source-material status per group
