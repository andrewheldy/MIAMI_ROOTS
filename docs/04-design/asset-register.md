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
- Tracked **concept and reference assets** (moodboards, concept marks, banner concepts) —
  registered with the same detail but clearly separated from approved production assets
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
│   │   └── concepts/   ← secondary/concept marks (not the approved primary)
│   ├── banners/        ← parent Miami Roots banners
│   │   └── concepts/   ← (future) generated banner concepts — create when first needed
│   └── moodboards/     ← brand moodboards / visual-direction references
│       └── concepts/   ← (future) generated moodboard explorations — create when first needed
├── group-logos/        ← subgroup logos (incl. future-scoped Ticket Exchange)
├── group-banners/      ← subgroup banners (empty — none received yet)
├── social/             ← finished social graphics (empty — none received yet)
└── qr/                 ← runtime-generated QR output only; stays empty in the repo
```

Approved production assets and concept/reference material are never mixed in one folder:
generated or exploratory artwork goes in a `concepts/` subfolder (or `moodboards/`), never
alongside approved source assets.

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

## Concept and reference assets

The three assets below arrived on 2026-07-16 (after the founding five) and were placed and
classified per the owner's instruction. They are **official visual references**, not
approved primary production assets: use them to inform design work, do not ship them as
final UI branding without an explicit decision. Files are committed byte-identical to the
originals (checksums verified; no recompression, cropping, recoloring, or metadata
changes). All three are PNG, 8-bit RGB, no alpha channel. The owner's instruction
suggested `.jpg` filenames for the moodboard and artistic logo, but both source files are
PNG — extensions follow the actual format per the no-conversion rule.

### brand-banner-parent — Miami Roots community banner (concept)

| Field | Value |
|---|---|
| Canonical asset ID | `brand-banner-parent` |
| Current filename | `miami-roots-community-banner.png` |
| Repository path | `public/brand/banners/miami-roots-community-banner.png` |
| Parent brand / subgroup | Miami Roots (parent brand) |
| Asset type | **Parent-brand community banner concept** (horizontal) |
| File format | PNG (8-bit RGB) |
| Dimensions | 1376 × 768 |
| Aspect ratio | ~1.79:1 (close to 16:9) |
| Transparency | None (opaque mint background, sampled ~`#97D0C1`) |
| Displayed content | Palm-tree mark rooted through a WhatsApp icon, community-network / handshake / subgroup iconography, wordmark "MIAMI ROOTS", tagline "TOGETHER WE RISE", subline "Miami's trusted local graph of people, businesses, and ideas.", CTA "Join the WhatsApp Community" |
| Intended uses | Visual **reference** for future website headers, WhatsApp Community covers, social headers, and campaign graphics |
| Production readiness | Concept — usable as design reference now; direct production use needs owner sign-off and copy ratification (tagline/subline are candidate copy, not ratified — see [`../01-product/community-content-requirements.md`](../01-product/community-content-requirements.md)) |
| Known limitations | Raster only; opaque background; 1376×768 requires crops/re-composition for standard targets (OG 1200×630, Story 1080×1920, WhatsApp cover); baked-in English copy limits reuse |
| Source / approval status | Owner-supplied 2026-07-16; classified by owner as *parent-brand community banner concept* |
| Recommended future derivatives | Website hero banner, WhatsApp Community banner crop, Open Graph 1200×630, Instagram Story 1080×1920, square sharing card 1080×1080 (see below) |

### brand-moodboard — Miami Roots brand moodboard (reference)

| Field | Value |
|---|---|
| Canonical asset ID | `brand-moodboard` |
| Current filename | `miami-roots-brand-moodboard.png` |
| Repository path | `public/brand/moodboards/miami-roots-brand-moodboard.png` |
| Parent brand / subgroup | Miami Roots (parent brand + sub-brand system) |
| Asset type | **Brand moodboard / visual-direction reference** |
| File format | PNG (8-bit RGB) |
| Dimensions | 896 × 1195 |
| Aspect ratio | 3:4 (portrait) |
| Transparency | None (opaque) |
| Displayed content | Master mark with stated palette ("MINT: #96D2C9", "FOREST GREEN: #003F2C"); "TOGETHER WE RISE — MIAMI / SOUTH FLORIDA"; vertical identity examples (Daytime Roots, Sober Social, Nightlife Roots); community photography; banyan-tree roots imagery; "WHATSAPP COMMUNITIES: Low-Friction Local Network Layer"; principles "LOCAL FIRST / COMMUNITY BEFORE CLOUT / CLEAR PURPOSE / GIVE BEFORE YOU TAKE"; "TRUSTED LOCAL GRAPH LAYER FOR DISCOVERY & COLLABORATION" |
| Intended uses | Inspiration source for color, typography, imagery, sub-brand structure, graphic language, and brand tone |
| Production readiness | **Never a production display asset** — reference only. Individual elements are not final/approved unless supported by canonical brand documentation (see [`brand-foundation.md`](brand-foundation.md)) |
| Known limitations | Composite reference (includes photography of people not cleared for production use); stated hex values are concept-stage, not ratified; raster only |
| Source / approval status | Owner-supplied 2026-07-16; classified by owner as *brand moodboard and visual-direction reference* |
| Recommended future derivatives | None as artwork; ratified palette/typography decisions should be extracted into `brand-foundation.md` and the decision log |

### brand-logo-artistic-tree — artistic tree logo (secondary concept)

| Field | Value |
|---|---|
| Canonical asset ID | `brand-logo-artistic-tree` |
| Current filename | `miami-roots-artistic-tree-logo.png` |
| Repository path | `public/brand/logos/concepts/miami-roots-artistic-tree-logo.png` |
| Parent brand / subgroup | Miami Roots (parent brand) |
| Asset type | **Secondary artistic logo concept** — not a replacement for the approved primary logo |
| File format | PNG (8-bit RGB) |
| Dimensions | 1408 × 768 |
| Aspect ratio | ~1.83:1 (landscape canvas; artwork itself is a centered vertical composition on an off-white ~`#F8F8F3` panel with pale-mint side bars) |
| Transparency | None (opaque) |
| Displayed content | Detailed tropical tree with interwoven trunk and visible roots enclosing a gold Miami skyline, sun element in the canopy, "MIAMI ROOTS" wordmark below |
| Intended uses | Expressive secondary mark: merchandise, posters, editorial artwork, community storytelling, special events, murals, limited-edition applications, brand presentations |
| Production readiness | Concept — do **not** use for small avatars, navigation bars, favicons, or other small-scale placements where the simpler primary logo reproduces more clearly |
| Known limitations | High detail degrades at small sizes; landscape canvas needs cropping for square/portrait placements; raster only; gold/cream palette extends beyond the two-color system of the primary marks (not yet ratified) |
| Source / approval status | Owner-supplied 2026-07-16; classified by owner as *secondary artistic logo concept* |
| Recommended future derivatives | Cropped square/portrait export of the artwork panel (only when a concrete use case exists); vector redraw if adopted for merchandise |

## Assets expected but not yet received

The following were announced by the owner but had **not been supplied** as of 2026-07-16.
Destination directories exist and are ready; see
[`subgroup-asset-inventory.md`](subgroup-asset-inventory.md) for the full coverage matrix.
(The announced Miami Roots parent banner **has since been received** — registered above as
`brand-banner-parent`.)

| Expected asset | Destination when received | Canonical filename pattern |
|---|---|---|
| Subgroup banners | `public/group-banners/` | `<group-slug>-banner.<ext>` |
| Logos for General Chat, Business & Connections, Community Organizing | `public/group-logos/` | `<group-slug>-logo.<ext>` |
| Social graphics | `public/social/` | `<subject>-<format>.<ext>` (e.g. `daytime-events-instagram-story.png`) |
| WhatsApp group screenshots | `inputs/screenshots/group-bios/<group-slug>/` — **never tracked** | n/a (private) |

### Planned derivatives of the parent banner (documented, not produced)

The source banner now exists (`brand-banner-parent`, 1376×768). These derivatives are
anticipated but **were not produced during asset organization** — they are sequenced in
[`asset-implementation-plan.md`](asset-implementation-plan.md), and future generated
banner concepts belong in `public/brand/banners/concepts/`:

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
