---
title: WhatsApp Content Governance
type: operations
status: proposed
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [operations, whatsapp, content, governance]
---

## Purpose

How the gateway's group content is kept honest against the real WhatsApp groups, and how
WhatsApp-derived material is handled safely on an ongoing basis. The gateway describes
groups it does not control; drift between the site's promises and the groups' reality is
a trust failure this process exists to prevent.

## What belongs here

- The sync loop between real group names/bios/rules and `community_groups` content
- Ownership and cadence of content review
- Handling rules for WhatsApp-derived material (screenshots, exports, bios)

## What does not belong here

- Invite-link operations (see [`chat-link-management.md`](chat-link-management.md))
- The content model itself (see [`../01-product/community-content-requirements.md`](../01-product/community-content-requirements.md))
- Moderation of behavior (see [`moderation.md`](moderation.md))

## Source-of-truth rule

**For what a group *is* (name, bio, rules as lived), WhatsApp reality is the source of
truth; the gateway is a curated mirror.** For what the gateway *promises* (guidelines
version, invite-reveal policy, approval flow), the repository/database is the source of
truth and WhatsApp admins should keep group descriptions consistent with it. Every
discrepancy is resolved in one of those two directions explicitly — never left ambiguous.

## The sync loop

1. **Intake:** group screenshots/exports arrive under untracked `inputs/` and are
   registered in
   [`../00-context/source-material-register.md`](../00-context/source-material-register.md).
2. **Review:** compare each group's displayed name, bio, and rules against
   [`../00-context/community-groups.md`](../00-context/community-groups.md) and the
   `community_groups` content; record findings in
   [`../00-context/whatsapp-community-inventory.md`](../00-context/whatsapp-community-inventory.md).
3. **Reconcile:** update site content (dashboard edit + doc update), or ask the WhatsApp
   admin to update the group description — one or the other, decided per discrepancy;
   naming-level conflicts (e.g. "Daytime Roots" vs "Daytime Events", open question #10)
   escalate to the owner.
4. **Re-check cadence:** monthly while the community is small, plus event-driven checks
   whenever a group's rules or purpose change.

## Privacy rules for WhatsApp-derived content (restated as operations)

- Screenshots/exports never leave `inputs/`; tracked docs and the database receive only
  non-sensitive transcriptions (bios/rules), lightly normalized at most.
- Phone numbers, invite links, member/admin identities, member counts tied to
  identities, and conversation content never enter tracked files, seed data, the
  `community_groups` table, or analytics.
- Welcome messages and rules published on the gateway are **written for publication** —
  they may be informed by group content but are product copy, reviewed for voice
  (`../04-design/content-and-voice.md`) and for the Sober Social and no-resale rules.

## Group lifecycle governance

- **Adding a group** to the gateway requires: owner decision (decision log), content row
  complete per the content model, invite link entered server-side, admin coverage for
  its verification queue. Ticket Exchange specifically requires an explicit launch
  decision — its asset existing is not a decision.
- **Renaming/rebranding** a group: slug never changes (URLs/QRs in the wild); display
  name changes via content edit + doc update in the same pass.
- **Archiving:** status → `archived` (site), group link revoked or left per owner
  choice (WhatsApp); the row and history remain.

## Relationship to other documents

- [`chat-link-management.md`](chat-link-management.md) — the link half of group operations
- [`../01-product/community-content-requirements.md`](../01-product/community-content-requirements.md) — fields being governed
- [`../00-context/whatsapp-community-inventory.md`](../00-context/whatsapp-community-inventory.md) — where review findings land
