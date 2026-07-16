---
title: Community Groups
type: context
status: active
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [context, whatsapp, community]
---

## Purpose

Records the current set of WhatsApp chats that make up Miami Roots, as the community
gateway product needs to display and link to them. This is the seed list the initial
product is built against.

## What belongs here

- The canonical list of current community groups/chats and their purpose
- Any explicit rules attached to a group (e.g. what's not allowed in it)
- Notes on which groups have brand assets already and which don't

## What does not belong here

- How invite links are technically generated, stored, or rotated (see
  `docs/05-operations/chat-link-management.md`)
- Moderation policy detail (see `docs/05-operations/moderation.md`)
- UI/IA for how groups are presented on the site (see
  `docs/04-design/information-architecture.md`)

## Known initial information

### Current groups

| Group | Purpose | Notes |
|---|---|---|
| **General Chat** | The central gathering place for everyday conversation, quick questions, community updates, and informal connection. | No logo asset yet. |
| **Business & Connections** | A place to share projects and businesses, find collaborators, exchange opportunities, and use the network effect to help members grow together. | No logo asset yet. |
| **Nightlife & Event Marketing** | For promoters and event organizers to share flyers, guest lists, nightlife events, and collaborative opportunities. | **Explicit rule: no ticket reselling** — ticket resale belongs in a separate, future group (see below). Logo asset exists (`public/group-logos/nightlife-and-event-marketing.png`, "Nightlife Roots"). |
| **Daytime Events** | Wellness-oriented gatherings — yoga, run clubs, Pilates, outdoor activities, and other experiences that help members recharge, meet people, and restore balance. | Logo asset exists (`public/group-logos/daytime-events.png`, "Daytime Roots"). |
| **Community Organizing** | Hobby activities, beach cleanups, dog-adoption days, volunteering, group outings, and other projects that bring people together and strengthen relationships. | No logo asset yet. |
| **Sober Social** | For people who enjoy Miami's social life while remaining sober. Focus is friendship, mutual support, vibrant experiences, and clear-headed fun — **not** treatment or clinical recovery services. | Logo asset exists (`public/group-logos/sober-social.png`, "Sober Social"). |

### Future / explicitly out of scope for now

- **Ticket Exchange** — a dedicated group for ticket resale, separate from Nightlife &
  Event Marketing (which explicitly disallows reselling). A concept logo already exists
  (`public/group-logos/future-ticket-exchange.png`, "Ticket Exchange") but **this group is
  not part of the initial six** and should not be built into the initial product. See
  `docs/01-product/out-of-scope.md`.

### Operational implication

Raw WhatsApp invite links should not be treated as permanent public assets — they can be
revoked or rotated by WhatsApp or by admins. The public Miami Roots URL for each group must
stay stable independent of the underlying invite link. See
`docs/03-architecture/data-principles.md` and `docs/05-operations/chat-link-management.md`.

## Relationship to other documents

- `docs/00-context/vision-and-ethos.md` — why these groups exist and what they're for
- `docs/04-design/asset-register.md` — full asset inventory including these logos
- `docs/01-product/out-of-scope.md` — Ticket Exchange and other deferred groups/features
- `docs/05-operations/chat-link-management.md` — how invite links are operated day to day
