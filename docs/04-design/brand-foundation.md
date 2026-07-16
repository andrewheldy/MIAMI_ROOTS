---
title: Brand Foundation
type: design
status: draft
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [design, brand]
---

## Purpose

Describes the visual identity Miami Roots has started with — concept-stage marks provided
at project founding — as a starting reference for future UI and brand work. This is
observational documentation of what exists, not a finished brand guideline.

## What belongs here

- Description of the marks currently in `public/brand/` and `public/group-logos/`
- Observed color and type patterns across those marks
- What is confirmed vs. estimated

## What does not belong here

- The actual asset files (see `public/brand/`, `public/group-logos/`) or their inventory
  (see `docs/04-design/asset-register.md`)
- Voice/tone guidance (see `docs/04-design/content-and-voice.md`)
- Page-level layout (see `docs/04-design/information-architecture.md`)

## Known initial information

### Primary mark

`public/brand/logos/miami-roots-logo.png` — a palm tree growing from a WhatsApp
speech-bubble icon, itself rooted into the ground by a visible root system, with a bold
uppercase "MIAMI ROOTS" wordmark stacked between the tree and the icon. The composition
literally illustrates the brand name and its WhatsApp-first, community-rooted concept in
one mark.

### Parent banner concept

`public/brand/banners/miami-roots-community-banner.png` (received 2026-07-16) — a
horizontal (1376×768) banner concept: the palm-tree/WhatsApp/roots mark centered, flanked
by community-network, handshake, and subgroup-themed iconography (meditation, cocktail,
bottle glyphs echoing the group marks), over the tagline "TOGETHER WE RISE", the
positioning line "Miami's trusted local graph of people, businesses, and ideas.", and the
CTA "Join the WhatsApp Community". It demonstrates how the identity extends to wide-format
surfaces (site hero, WhatsApp Community cover, social headers). The copy on it is
**candidate copy, not ratified** (see `docs/01-product/community-content-requirements.md`).

### Brand moodboard

`public/brand/moodboards/miami-roots-brand-moodboard.png` (received 2026-07-16) — a 3:4
visual-direction reference collaging the master mark, the sub-brand system (Daytime Roots,
Sober Social, Nightlife Roots — matching the committed logos), banyan-tree and community
photography, WhatsApp positioning ("Low-Friction Local Network Layer", "Trusted local
graph layer for discovery & collaboration"), and stated brand principles ("Local First",
"Community Before Clout", "Clear Purpose", "Give Before You Take"). Treat it as
inspiration for color, typography, imagery, sub-brand structure, and tone — **individual
elements are not final or approved** unless backed by canonical brand documentation.

### Secondary artistic mark (concept)

`public/brand/logos/concepts/miami-roots-artistic-tree-logo.png` (received 2026-07-16) —
a detailed illustrated tree with interwoven trunk and exposed roots enclosing a gold Miami
skyline, sun in the canopy, "MIAMI ROOTS" wordmark below. An expressive secondary concept
for merchandise, posters, editorial artwork, storytelling, special events, and murals —
**not a replacement for the primary logo**, and not for small avatars, navigation bars, or
favicons where the simpler primary mark reproduces more clearly. It also introduces
gold/cream tones beyond the two-color system; treat that extension as unratified.

### Sub-brand pattern

Each community group has (or is expected to eventually have) its own mark following a
consistent system built on the primary mark:

- A bold uppercase two-line wordmark: `[CATEGORY]` over `ROOTS` (e.g. "SOBER SOCIAL /
  MIAMI ROOTS", "NIGHTLIFE / ROOTS", "DAYTIME / ROOTS").
- A rounded-square WhatsApp-style speech-bubble icon containing a glyph specific to that
  group's theme (e.g. a cocktail glass for Nightlife & Event Marketing, a seated
  meditating figure for Daytime Events, a soda bottle for Sober Social, event tickets for
  the future Ticket Exchange concept).
- Some marks (e.g. the primary logo, Nightlife) also include a palm tree motif above the
  wordmark.

This is a **pattern observed from the assets provided**, not a documented, ratified system
— treat it as a strong starting point for whoever owns brand design, not a locked
specification.

### Color

All provided marks use a two-color, high-contrast palette:

- A muted **seafoam / mint green** background (visually close to a mid-tone teal-green).
- A **deep forest green** for the wordmark, icon, and linework.

Values **measured by sampling the committed asset files** (2026-07-16, dominant background
color and dominant dark ink color per file, downsampled):

| Asset | Background (sampled) | Ink (sampled) |
|---|---|---|
| Parent logo | `#80C9B8` | `#013B24` |
| Daytime Events logo | `#7CBFB9` | `#043C2E` |
| Nightlife & Event Marketing logo | `#80C6BC` | `#013625` |
| Sober Social logo | `#7FBCB9` | `#06382C` |
| Ticket Exchange logo (future) | `#7BC1B2` | `#01412A` |

Two things follow from these measurements: the palette is consistent in character but
**not pixel-identical across assets** (the backgrounds have subtle texture/noise and vary
by a few points per channel), and **no single ratified hex pair exists yet**. These are
measured observations, not brand decisions — whoever owns brand/design should pick and
ratify canonical values (e.g. background near `#7FC3B7`, ink near `#02392A`) and record
that as a decision. Do not hard-code any of these values into product UI as "the brand
color" before that happens.

The brand moodboard (see above) **states** explicit values — "MINT: `#96D2C9`" and
"FOREST GREEN: `#003F2C`" — which are close to, but not identical with, the values sampled
from the committed logo files (the banner concept's background samples at ~`#97D0C1`,
essentially the moodboard mint). These stated values are the strongest candidate for
ratification so far, but they remain **concept-stage until the owner ratifies a canonical
pair** and it is recorded in the decision log.

As of Milestone 1, the application consumes the candidate mint/forest pair as
**provisional design tokens** centralized in `src/styles/globals.css` (a documented,
single definition point) — not as ratified brand values. When a canonical palette is
ratified, update those tokens in that one place.

### Typography

Wordmarks use a **bold, rounded, geometric sans-serif in all caps** — consistent with the
"warm, vibrant, welcoming, optimistic" ethos in
`docs/00-context/vision-and-ethos.md` rather than a sharp corporate typeface. No specific
typeface has been identified or licensed; this is a description of the rendered logo
artwork only, not a chosen web font.

### Relationship to ethos

The palm tree, roots, and "grown from WhatsApp" visual metaphor directly express "together
we rise" and the community-first, distinctly-Miami positioning in
`docs/00-context/vision-and-ethos.md` — this alignment should guide any future refinement
rather than a generic rebrand.

## Relationship to other documents

- `docs/04-design/asset-register.md` — full inventory of what asset files exist and where
- `docs/00-context/vision-and-ethos.md` — the ethos this identity should express
- `docs/00-context/community-groups.md` — which groups have marks already
