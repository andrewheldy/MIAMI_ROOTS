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

The authoritative inventory of production design assets in this repository — what exists,
where it lives, its technical properties, and its approval status — so nobody has to guess
what's real versus planned. Private, non-production source material is registered
separately in [`docs/00-context/source-material-register.md`](../00-context/source-material-register.md).

## What belongs here

- Every production asset under `public/` (`brand/`, `group-logos/`, `group-banners/`,
  `social/`, `qr/`), with full technical and status detail
- Recommended future derivatives (documented, not yet produced)

## What does not belong here

- Visual-identity analysis (see [`brand-foundation.md`](brand-foundation.md))
- Per-subgroup coverage gaps (see [`subgroup-asset-inventory.md`](subgroup-asset-inventory.md))
- Private source material (never tracked — see `inputs/README.md`)
- Runtime-generated files like member QR codes (`public/qr/` stays empty in the repo)

## Directory layout

```
public/
├── brand/
│   ├── logos/          ← parent Miami Roots logos
│   └── banners/        ← parent Miami Roots banners (empty — none received yet)
├── group-logos/        ← subgroup logos (incl. future-scoped Ticket Exchange)
├── group-banners/      ← subgroup banners (empty — none received yet)
├── social/             ← finished social graphics (empty — none received yet)
└── qr/                 ← runtime-generated QR output only; stays empty in the repo
```

## Production assets

All five assets below were provided as approved production assets at project founding
(2026-07-16), committed as-is, and renamed to canonical filenames on 2026-07-16 (`git mv`,
pixel content untouched). None have been optimized, re-exported, or validated against a
formal brand guide. Shared technical properties: **PNG, 8-bit RGB, no alpha channel
(opaque seafoam background), no transparency.**

### brand-logo-parent — Miami Roots parent logo

| Field | Value |
|---|---|
| Canonical asset ID | `brand-logo-parent` |
| Current filename | `miami-roots-logo.png` |
| Repository path | `public/brand/logos/miami-roots-logo.png` |
| Parent brand / subgroup | Miami Roots (parent brand) |
| Asset type | Primary logo / avatar mark |
| File format | PNG (8-bit RGB) |
| Dimensions | 1024 × 1024 |
| Aspect ratio | 1:1 |
| Transparency | None (opaque seafoam background) |
| Intended uses | WhatsApp Community avatar, site header/landing mark, favicon source, social profile image |
| Production readiness | Usable now for avatar/square placements; not suitable where transparency or wide format is needed |
| Known limitations | Baked-in background (no transparent cutout); fine texture/noise in background; raster only (no vector source); untested at favicon sizes |
| Source / approval status | Owner-supplied at founding; **approved production asset** (confirmed 2026-07-16); provisional pending a formal brand guide |
| Recommended future derivatives | Transparent-background cutout; SVG/vector redraw; favicon/app-icon set; monochrome variant |

### group-logo-daytime-events — Daytime Events logo

| Field | Value |
|---|---|
| Canonical asset ID | `group-logo-daytime-events` |
| Current filename | `daytime-events-logo.png` |
| Repository path | `public/group-logos/daytime-events-logo.png` |
| Parent brand / subgroup | Daytime Events subgroup |
| Asset type | Subgroup logo / avatar mark |
| File format | PNG (8-bit RGB) |
| Dimensions | 1024 × 1024 |
| Aspect ratio | 1:1 |
| Transparency | None (opaque seafoam background) |
| Intended uses | WhatsApp group avatar, group card/tile on the gateway, group detail page |
| Production readiness | Usable now for avatar/square placements |
| Known limitations | Displayed wordmark reads **"DAYTIME ROOTS"**, not "Daytime Events" — naming discrepancy with the group's operating name is unresolved; opaque background; raster only |
| Source / approval status | Owner-supplied at founding; **approved production asset** (confirmed 2026-07-16); provisional pending brand guide |
| Recommended future derivatives | Transparent cutout; vector redraw; matching banner |

### group-logo-nightlife-and-event-marketing — Nightlife & Event Marketing logo

| Field | Value |
|---|---|
| Canonical asset ID | `group-logo-nightlife-and-event-marketing` |
| Current filename | `nightlife-and-event-marketing-logo.png` |
| Repository path | `public/group-logos/nightlife-and-event-marketing-logo.png` |
| Parent brand / subgroup | Nightlife & Event Marketing subgroup |
| Asset type | Subgroup logo / avatar mark |
| File format | PNG (8-bit RGB) |
| Dimensions | 1024 × 1024 |
| Aspect ratio | 1:1 |
| Transparency | None (opaque seafoam background) |
| Intended uses | WhatsApp group avatar, group card/tile on the gateway, group detail page |
| Production readiness | Usable now for avatar/square placements |
| Known limitations | Displayed wordmark reads **"NIGHTLIFE ROOTS"**, not "Nightlife & Event Marketing" — naming discrepancy unresolved; martini-glass glyph may sit oddly next to Sober Social in shared layouts (design consideration, not a defect); opaque background; raster only |
| Source / approval status | Owner-supplied at founding; **approved production asset** (confirmed 2026-07-16); provisional pending brand guide |
| Recommended future derivatives | Transparent cutout; vector redraw; matching banner |

### group-logo-sober-social — Sober Social logo

| Field | Value |
|---|---|
| Canonical asset ID | `group-logo-sober-social` |
| Current filename | `sober-social-logo.png` |
| Repository path | `public/group-logos/sober-social-logo.png` |
| Parent brand / subgroup | Sober Social subgroup |
| Asset type | Subgroup logo / avatar mark |
| File format | PNG (8-bit RGB) |
| Dimensions | 1024 × 1024 |
| Aspect ratio | 1:1 |
| Transparency | None (opaque seafoam background) |
| Intended uses | WhatsApp group avatar, group card/tile on the gateway, group detail page |
| Production readiness | Usable now for avatar/square placements |
| Known limitations | Bottle glyph (sparkling water / soda) reads correctly in context but could be mistaken for a drinks brand out of context; opaque background; raster only |
| Source / approval status | Owner-supplied at founding; **approved production asset** (confirmed 2026-07-16); provisional pending brand guide |
| Recommended future derivatives | Transparent cutout; vector redraw; matching banner |

### group-logo-ticket-exchange — Ticket Exchange logo (future-scoped)

| Field | Value |
|---|---|
| Canonical asset ID | `group-logo-ticket-exchange` |
| Current filename | `ticket-exchange-logo.png` |
| Repository path | `public/group-logos/ticket-exchange-logo.png` |
| Parent brand / subgroup | Ticket Exchange — **future group, not part of the MVP six** (see [`docs/01-product/out-of-scope.md`](../01-product/out-of-scope.md)) |
| Asset type | Subgroup logo (concept, future-scoped) |
| File format | PNG (8-bit RGB) |
| Dimensions | 1122 × 1402 |
| Aspect ratio | ~4:5 (portrait) — the only non-square logo in the set |
| Transparency | None (opaque seafoam background) |
| Intended uses | None in MVP. Reserved for a future Ticket Exchange launch decision |
| Production readiness | **Do not ship in MVP.** Also non-square, so it needs a crop/re-export before any avatar use |
| Known limitations | Non-square; group does not exist yet; opaque background; raster only |
| Source / approval status | Owner-supplied at founding; approved as an asset, but its **group is explicitly out of scope** — organized here for safekeeping, not for display |
| Recommended future derivatives | 1:1 avatar crop (only if/when the group is launched by explicit decision) |

## Assets expected but not yet received

The following were announced by the owner but had **not been supplied** as of 2026-07-16.
Destination directories exist and are ready; see
[`subgroup-asset-inventory.md`](subgroup-asset-inventory.md) for the full coverage matrix.

| Expected asset | Destination when received | Canonical filename pattern |
|---|---|---|
| Miami Roots parent banner | `public/brand/banners/` | `miami-roots-community-banner.<ext>` (add `-wide` / `-square` / `-story` suffixes only if multiple formats with supporting dimensions arrive) |
| Subgroup banners | `public/group-banners/` | `<group-slug>-banner.<ext>` |
| Logos for General Chat, Business & Connections, Community Organizing | `public/group-logos/` | `<group-slug>-logo.<ext>` |
| Social graphics | `public/social/` | `<subject>-<format>.<ext>` (e.g. `daytime-events-instagram-story.png`) |
| WhatsApp group screenshots | `inputs/screenshots/group-bios/<group-slug>/` — **never tracked** | n/a (private) |

### Planned derivatives of the parent banner (documented, not produced)

Once the parent banner arrives and is registered, these derivatives are anticipated —
**none should be produced until the source banner exists and its dimensions are known**:

- Website hero banner (responsive crop)
- WhatsApp Community banner (WhatsApp's community-header crop)
- Open Graph image (1200×630)
- Instagram Story (1080×1920)
- Square sharing card (1080×1080)

## Register maintenance rules

- Every new production asset gets an entry here **in the same change** that adds the file.
- Renames use `git mv`; pixel content, resolution, color, cropping, compression, and
  metadata are never altered during organization.
- Never overwrite an existing asset file; variants get descriptive suffixes
  (`-primary`, `-alternate-01`, `-source`) rather than one being silently declared
  canonical when evidence is unclear.
- Filenames are lowercase kebab-case.

## Relationship to other documents

- [`brand-foundation.md`](brand-foundation.md) — visual identity these assets express,
  including sampled (not ratified) color values
- [`subgroup-asset-inventory.md`](subgroup-asset-inventory.md) — per-subgroup asset
  coverage and gaps
- [`../00-context/community-groups.md`](../00-context/community-groups.md) — the groups
  these assets map to
- [`../00-context/source-material-register.md`](../00-context/source-material-register.md)
  — register of private source material (kept under `inputs/`, untracked)
