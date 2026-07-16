---
title: Asset Implementation Plan
type: design
status: proposed
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [design, assets, qr, sharing]
---

## Purpose

How the organized brand assets get used, derived, and generated in the MVP product:
per-surface asset mapping, fallbacks for the gaps, runtime-generated assets (QR, sharing
cards, OG images), and the derivative work deferred until sources arrive. Recommended
defaults from the 2026-07-16 planning pass. **No derivatives are produced during
planning** — this document sequences that work.

## What belongs here

- Which asset serves which product surface, and fallbacks where none exists
- Runtime-generation plans (QR, sharing cards, OG)
- Derivative pipeline once the banner and missing logos arrive

## What does not belong here

- The asset inventory itself (see [`asset-register.md`](asset-register.md),
  [`subgroup-asset-inventory.md`](subgroup-asset-inventory.md))
- Referral URL semantics (see [`../03-architecture/referral-system.md`](../03-architecture/referral-system.md))

## Surface → asset mapping (MVP)

| Surface | Asset | Fallback until available |
|---|---|---|
| Landing hero | Parent banner (`public/brand/banners/…`) — **not yet received** | Brand-colored hero using sampled palette (`brand-foundation.md`) + parent logo |
| Site header / favicon | Parent logo (+ favicon derivative, produced at bootstrap milestone) | — |
| Group cards & detail pages | Subgroup logo | **Three groups lack logos**: parent-mark tile tinted per brand, group name prominent — a designed fallback, not a broken image |
| Group page header | Subgroup banner — none exist | Solid brand background; layout reserves the slot |
| OG / link previews | Generic parent OG image (1200×630), generated at build from logo + palette | — (this *is* the v1) |
| Connector sharing card (story 1080×1920, square 1080×1080) | Runtime-composed: brand background + parent logo + member slug + QR | — (runtime is the plan of record) |
| WhatsApp group avatars (operational, outside the app) | Existing subgroup logos (1:1, ready) | Parent logo for the three uncovered groups |

## Runtime-generated assets

- **QR codes** — `GET /api/qr/<slug>.png`, server-generated per request (cacheable),
  encoding only the stable referral URL. Never stored in the repo; `public/qr/` stays
  empty. Regeneration is free and identical because the URL is stable; "dynamic"
  behavior comes from the URL's server-side resolution, not from a QR service.
- **Sharing cards** — composed at request time (`next/og`-style image generation) from
  brand assets + slug + QR; downloadable/sharable from `/me/share`. Contain no personal
  data beyond the chosen slug. Alternates (story/square) are parameters, not stored
  variants.
- **OG images** — static generic parent version at build; per-group versions (group logo
  + name) are cheap follow-ons once per-group assets are complete.

## Derivative pipeline (deferred until sources arrive)

When the parent banner lands (registered per
[`asset-register.md`](asset-register.md)), produce in order: website hero crop → OG
1200×630 → WhatsApp Community banner crop → Instagram Story 1080×1920 → square card
1080×1080. Each derivative is a new file with a descriptive suffix, registered on
creation; sources are never modified. When the three missing group logos arrive, the
group-card fallback retires group by group — the UI reads `logo_path` nullability, so no
code change is needed.

Production notes for whoever makes derivatives: sources are opaque-background RGB PNGs
(no alpha); the seafoam backgrounds differ slightly per asset (sampled values in
[`brand-foundation.md`](brand-foundation.md)) so edge-to-edge composites should
re-sample from the specific source file rather than assuming one hex.

## Relationship to other documents

- [`asset-register.md`](asset-register.md) / [`subgroup-asset-inventory.md`](subgroup-asset-inventory.md) — what exists and what's missing
- [`brand-foundation.md`](brand-foundation.md) — sampled palette used by fallbacks
- [`../03-architecture/referral-system.md`](../03-architecture/referral-system.md) — QR/sharing semantics
- [`../01-product/community-content-requirements.md`](../01-product/community-content-requirements.md) — the nullable asset fields these surfaces read
