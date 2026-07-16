---
title: WhatsApp Community Inventory
type: context
status: active
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [context, whatsapp, community, source-material]
---

## Purpose

Tracks what is actually known about the real WhatsApp community — group by group — from
verifiable source material (screenshots, exports), as distinct from the planning-level
group list in [`community-groups.md`](community-groups.md). This is where "what the
WhatsApp groups really say about themselves" gets recorded, without copying private data
into the repository.

## What belongs here

- Per-group: exact displayed name, bio/description (transcribed only when it contains no
  sensitive information), stated purpose, visible rules, and how current the evidence is
- Discrepancies between real WhatsApp names/bios and repository terminology
- The evidence status per group (what source material has actually been reviewed)

## What does not belong here

- Phone numbers, invite links, member identities, admin identities, member counts tied to
  identities, or any conversation content — **never**, even paraphrased
- The source files themselves (those stay under `inputs/`, untracked — see
  [`source-material-register.md`](source-material-register.md))

## Evidence status (as of 2026-07-16)

**No WhatsApp screenshots or chat exports have been received yet.** The owner announced
that screenshots of each group (names, bios, descriptions) and possibly exports would be
supplied; as of this date the `inputs/` directory is empty. Everything below is therefore
**unverified against the real WhatsApp community** — it reflects the founding brief plus
what the supplied logo artwork displays.

| Group (repo name) | Displayed name verified? | Bio verified? | Rules verified? | Evidence |
|---|---|---|---|---|
| General Chat | ❌ | ❌ | ❌ | none received |
| Business & Connections | ❌ | ❌ | ❌ | none received |
| Nightlife & Event Marketing | ❌ (logo artwork reads "Nightlife Roots") | ❌ | ❌ (no-resale rule from founding brief only) | logo only |
| Daytime Events | ❌ (logo artwork reads "Daytime Roots") | ❌ | ❌ | logo only |
| Community Organizing | ❌ | ❌ | ❌ | none received |
| Sober Social | ❌ (logo artwork reads "Sober Social / Miami Roots") | ❌ | ❌ | logo only |
| Ticket Exchange (future) | ❌ (logo artwork reads "Ticket Exchange / Miami Roots") | n/a — group may not exist yet | n/a | logo only |

### Known naming discrepancies (from logo artwork)

Two supplied logos display sub-brand names that differ from the groups' operating names in
the founding brief:

- **Daytime Events** — logo wordmark reads **"DAYTIME ROOTS"**
- **Nightlife & Event Marketing** — logo wordmark reads **"NIGHTLIFE ROOTS"**

It is unresolved whether the WhatsApp groups themselves use the "… Roots" naming, the
descriptive naming, or both (e.g. descriptive group name + branded avatar). This affects
what the gateway should display. Recorded as an open question in
[`../02-planning/open-questions.md`](../02-planning/open-questions.md).

## Procedure when screenshots arrive

1. Place files under `inputs/screenshots/group-bios/<group-slug>/` (never track them).
2. Inspect each screenshot for: exact displayed group name, current bio/description,
   stated purpose, visible rules, administrator language, and apparent currency
   (does it look up to date?).
3. Register each file (path, date, what it shows — no private content) in
   [`source-material-register.md`](source-material-register.md).
4. Update this inventory's table and, where bios contain no sensitive information,
   transcribe or lightly normalize them here and reconcile
   [`community-groups.md`](community-groups.md).
5. Never carry over phone numbers, invite links, member counts tied to identities, or
   member/admin identities into any tracked file.

## Relationship to other documents

- [`community-groups.md`](community-groups.md) — the planning-level group list this
  inventory verifies (or corrects)
- [`source-material-register.md`](source-material-register.md) — file-level register of
  private source material
- `whatsapp-community-findings.md` (planned) — conclusions drawn from this inventory for
  product planning
