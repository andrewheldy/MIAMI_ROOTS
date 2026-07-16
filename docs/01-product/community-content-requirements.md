---
title: Community Content Requirements
type: product
status: proposed
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [product, content, community, groups]
---

## Purpose

Defines the content model the gateway needs for the parent brand and each subgroup, what
content exists versus must be written, and where MVP content should live. Recommended
defaults from the 2026-07-16 planning pass.

## What belongs here

- The parent and per-subgroup content model (fields and rules)
- Content inventory: written vs missing
- Where content lives in MVP

## What does not belong here

- Voice/tone rules (see [`../04-design/content-and-voice.md`](../04-design/content-and-voice.md))
- Asset files themselves (see [`../04-design/asset-register.md`](../04-design/asset-register.md))
- Table mechanics (see [`../03-architecture/data-model.md`](../03-architecture/data-model.md), `community_groups`)

## Parent-brand content model

| Field | Status | Notes |
|---|---|---|
| Community name | ✅ "Miami Roots" | |
| Tagline | ❌ to write | "Together we rise" is the load-bearing theme (`docs/00-context/vision-and-ethos.md`) — candidate, not ratified copy |
| Intro/ethos copy | ❌ to write | Derived from vision-and-ethos; needs owner voice pass |
| Parent logo | ✅ `public/brand/logos/miami-roots-logo.png` | |
| Parent banner | ⏳ announced, not received | Hero fallback needed until then (see [`../04-design/asset-implementation-plan.md`](../04-design/asset-implementation-plan.md)) |
| Community guidelines (versioned) | ◐ principles exist (`community-guidelines.md`) | Needs member-facing versioned copy — consent references the version |
| Privacy/data-use copy | ❌ to write | Plain-language; legal review pending (research backlog #2–3) |

## Subgroup content model

Per group (the `community_groups` row):

| Field | Rule |
|---|---|
| Name | Display name; **naming discrepancy with logo wordmarks unresolved** (open question #10) — the field exists so either can win without code changes |
| Slug | Canonical kebab-case (see [`../04-design/subgroup-asset-inventory.md`](../04-design/subgroup-asset-inventory.md)); stable forever once public |
| Short description | ≤140 chars, card display |
| Full description | Group detail page; warm, specific, per voice doc |
| Welcome message | Shown post-approval alongside the invite reveal ("what to say when you arrive") |
| Rules | Group-specific, displayed before join; must include the no-resale rule for Nightlife & Event Marketing and the social-not-clinical framing for Sober Social |
| CTA label | e.g. "Join General Chat" — per group, defaults acceptable |
| Logo | Path into `public/group-logos/`; **nullable** — three MVP groups have none; UI must have a branded fallback |
| Banner | Path into `public/group-banners/`; nullable (none exist yet) |
| Social-sharing asset | Path into `public/social/`; nullable (none exist yet) |
| Display order | Owner-set integer |
| Visibility | `public` / `unlisted` |
| Approval requirement | Boolean, **default true** for all MVP groups |
| Invite-reveal policy | `after_approval` (only MVP value; field exists so a future open group needs no schema change) |
| Status | `active` / `hidden` / `archived` |

### Content inventory (what must be written before launch)

All six MVP groups have **purpose statements** in
[`../00-context/community-groups.md`](../00-context/community-groups.md) usable as raw
material; none have final short/full descriptions, welcome messages, rules copy, or CTAs.
Real WhatsApp bios have not been supplied yet
([`../00-context/whatsapp-community-inventory.md`](../00-context/whatsapp-community-inventory.md))
— when they arrive, they take precedence as source material and get reconciled per
[`../05-operations/whatsapp-content-governance.md`](../05-operations/whatsapp-content-governance.md).
Ticket Exchange gets **no content row** in MVP (out of scope).

## Where MVP content lives (recommended default)

**In Supabase (`community_groups`), seeded from a public-safe seed file; edited via the
Supabase dashboard; no admin content UI in MVP.**

Compared against: *code* (cheapest, but every copy tweak is a deploy, and content-in-code
tends to fossilize) and *an admin-editable CMS interface* (nicest, but a whole feature the
MVP doesn't need). The database row is already required for memberships/invite-links to
reference; seeding it costs nothing extra; dashboard editing fits the manual-operability
principle. **Hard rule: seed files contain public-safe fields only — invite links are
entered manually into their own server-only table, never seeded, never exported**
(see [`../03-architecture/privacy-and-safety.md`](../03-architecture/privacy-and-safety.md)).

Legal/guideline pages live in code (versioned markdown rendered at build), because their
versions must be reviewable in Git history — consent records reference those versions.

## Relationship to other documents

- [`../03-architecture/data-model.md`](../03-architecture/data-model.md) — `community_groups`
- [`../04-design/asset-implementation-plan.md`](../04-design/asset-implementation-plan.md) — how assets render per group
- [`../05-operations/whatsapp-content-governance.md`](../05-operations/whatsapp-content-governance.md) — keeping site copy honest against real groups
- [`../00-context/whatsapp-community-findings.md`](../00-context/whatsapp-community-findings.md) — evidence base and its gaps
