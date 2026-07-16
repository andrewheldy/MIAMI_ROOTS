---
title: Moderation
type: operations
status: draft
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [operations, moderation]
---

## Purpose

Describes how community guidelines are expected to be enforced in practice, across both
WhatsApp groups and the gateway product.

## What belongs here

- Enforcement practice for the norms in `docs/01-product/community-guidelines.md`
- How violations are reported and handled operationally

## What does not belong here

- The guidelines themselves (see `docs/01-product/community-guidelines.md`)
- Privacy/safety architecture concerns (see `docs/03-architecture/privacy-and-safety.md`)

## Known initial information

No moderation tooling exists yet — this document exists to hold the operational intent
until it does:

- Moderation currently happens **within WhatsApp itself** (group admins), since that is
  where the community lives. The gateway product does not moderate WhatsApp conversations
  directly.
- The explicit **no ticket reselling** rule in Nightlife & Event Marketing is a group-level
  norm to be enforced by group admins, and should be stated plainly wherever the group is
  described in the product (see `docs/01-product/community-guidelines.md`).
- **Sober Social** moderation should protect the space's specific purpose — sober social
  participation, not treatment — and should not let it drift into either party-culture
  content or clinical/recovery-service framing.
- As the product grows, admin tooling may need a way to flag/handle problem members (e.g.
  someone repeatedly violating guidelines) tied to the same member records used for
  verification and points — not designed yet.

## Relationship to other documents

- `docs/01-product/community-guidelines.md` — what's being enforced
- `docs/03-architecture/privacy-and-safety.md` — the broader safety design this feeds into
