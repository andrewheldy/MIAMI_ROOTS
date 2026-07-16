---
title: Asset Register
type: design
status: active
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [design, assets]
---

## Purpose

Inventories the actual brand/design asset files present in this repository — what exists,
where, and its provenance — so nobody has to guess what's real versus planned.

## What belongs here

- Every file under `public/brand/`, `public/group-logos/`, `public/social/`, `public/qr/`
- Its source/provenance and current status

## What does not belong here

- Descriptive analysis of the visual identity itself (see
  `docs/04-design/brand-foundation.md`)
- Generated, per-user assets like member QR codes (those are runtime-generated product
  output, not tracked design assets — `public/qr/` stays empty in this repository)

## Known initial information

All files below were provided as concept-stage brand artwork at project founding
(2026-07-16) and committed as-is. None have been optimized, re-exported, or validated
against a formal brand guide.

### `public/brand/`

| File | Dimensions | Description |
|---|---|---|
| `miami-roots-primary-logo.png` | 1024×1024 | Primary Miami Roots mark — palm tree, WhatsApp-bubble icon, root system, "MIAMI ROOTS" wordmark. Seafoam background, deep forest green mark. |

### `public/group-logos/`

| File | Dimensions | Maps to group | Description |
|---|---|---|---|
| `sober-social.png` | 1024×1024 | Sober Social | Bottle icon, "SOBER SOCIAL / MIAMI ROOTS" wordmark. |
| `daytime-events.png` | 1024×1024 | Daytime Events | Sunrise + seated meditating figure in a WhatsApp-bubble icon, "DAYTIME / ROOTS" wordmark. |
| `nightlife-and-event-marketing.png` | 1024×1024 | Nightlife & Event Marketing | Palm tree + cocktail glass in a WhatsApp-bubble icon, "NIGHTLIFE / ROOTS" wordmark. |
| `future-ticket-exchange.png` | 1122×1402 | **Not a current group** — future "Ticket Exchange" concept only (see `docs/00-context/community-groups.md` and `docs/01-product/out-of-scope.md`) | Tickets + palm tree in a phone/ticket icon, "TICKET EXCHANGE / MIAMI ROOTS" wordmark. |

**No logo assets currently exist for:** General Chat, Business & Connections, Community
Organizing. These groups should use the primary mark or a neutral treatment until
dedicated marks are produced.

### `public/social/`

Empty — no social share images exist yet.

### `public/qr/`

Empty — member QR codes are expected to be generated at runtime by the future application,
not stored as static repository assets.

## Relationship to other documents

- `docs/04-design/brand-foundation.md` — analysis of the visual identity these assets
  express
- `docs/00-context/community-groups.md` — the groups these logos map to
