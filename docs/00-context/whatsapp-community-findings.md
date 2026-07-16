---
title: WhatsApp Community Findings
type: context
status: active
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [context, whatsapp, community, findings]
---

## Purpose

The conclusions the MVP plan is allowed to rely on about the real WhatsApp community —
each labeled by evidence strength — plus the gaps that remain. This is the analysis layer
above [`whatsapp-community-inventory.md`](whatsapp-community-inventory.md) (which tracks
raw per-group evidence status).

## What belongs here

- Findings usable for planning, labeled: confirmed fact / owner statement / inference /
  assumption requiring validation
- Contradictions and missing evidence, stated plainly

## What does not belong here

- Any private data from source material (phone numbers, invite links, identities,
  conversations) — never
- Product decisions derived from findings (those live in the product/architecture docs
  and the decision log)

## Findings (as of 2026-07-16)

### Confirmed facts (verified in this repository)

1. Five approved production assets exist (parent logo + 4 subgroup logos), organized and
   registered in [`../04-design/asset-register.md`](../04-design/asset-register.md).
2. Two subgroup logos display sub-brand names that differ from operating names
   ("Daytime Roots", "Nightlife Roots") — a real inconsistency the product must absorb
   (open question #10).
3. Three of six MVP groups have no logo; no banners or social graphics exist at all.

### Owner statements (from the founding brief and task instructions — trusted, not
independently verified)

4. The community operates as a WhatsApp Community with six active groups: General Chat,
   Business & Connections, Nightlife & Event Marketing, Daytime Events, Community
   Organizing, Sober Social.
5. Nightlife & Event Marketing carries an explicit **no ticket reselling** rule; Ticket
   Exchange is a separately-scoped future group with a concept logo.
6. Sober Social is a peer social space, explicitly not treatment/recovery.
7. WhatsApp group screenshots (names/bios/descriptions), a parent banner, and possibly
   more subgroup assets are forthcoming.

### Inferences from community behavior (reasonable, revisable)

8. The community is admin-operated by a small number of people; workflows must respect
   scarce admin attention (queues, one-tap actions, no double-entry).
9. Members are mobile-first WhatsApp users; the gateway must work excellently on phones
   and hand off into the WhatsApp app cleanly.

### Assumptions requiring validation (held pessimistically in the architecture)

10. **WhatsApp provides no dependable programmatic signal** for joins, membership,
    activity, retention, or invite attribution to this application — the architecture
    treats the invite-link click as the last observable event and relies on manual
    verification ([`../03-architecture/system-context.md`](../03-architecture/system-context.md)).
    If deeper access is ever validated (research backlog #1), workflows relax; nothing
    breaks in the meantime.
11. Real group names/bios in WhatsApp may differ from repository terminology — cannot be
    checked until screenshots arrive.

### Missing evidence (blocks specific work, not the plan)

- **No screenshots or exports received** → real names, bios, rules, and admin language
  unverified; content-writing for group pages must wait for them or proceed from the
  brief with an owner review pass.
- **No parent banner received** → landing hero uses a designed fallback until it arrives
  ([`../04-design/asset-implementation-plan.md`](../04-design/asset-implementation-plan.md)).
- **No member-scale numbers** (group sizes, join rates) → admin-workload estimates for
  the manual verification loop are unvalidated; the workflow is designed to be cheap per
  action but volume is unknown.

## Contradictions register

Only one known: logo wordmarks vs operating group names (finding 2 / open question #10).
No other source-vs-source contradictions exist yet — mostly because only one source (the
brief) exists. This register grows as screenshots arrive.

## Relationship to other documents

- [`whatsapp-community-inventory.md`](whatsapp-community-inventory.md) — per-group
  evidence status and the intake procedure for screenshots
- [`../01-product/community-content-requirements.md`](../01-product/community-content-requirements.md)
  — the content these findings feed
- [`../03-architecture/system-context.md`](../03-architecture/system-context.md) — the
  WhatsApp-reality constraint in architectural form
