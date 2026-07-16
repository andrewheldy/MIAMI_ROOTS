---
title: Chat Link Management
type: operations
status: draft
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [operations, whatsapp, invite-links]
---

## Purpose

Describes how WhatsApp invite links for each community group should be operated and kept
current, given that they are not treated as permanent public assets.

## What belongs here

- Operational practice for storing, rotating, and updating invite links
- How to respond to a leaked or expired link

## What does not belong here

- Architectural principle behind why links are treated this way (see
  `docs/03-architecture/data-principles.md`)
- Group list itself (see `docs/00-context/community-groups.md`)

## Known initial information

- **Raw WhatsApp invite links are not permanent public assets.** They can expire, be
  revoked, or need rotation (e.g. after a leak or abuse). The public Miami Roots URL for a
  group must keep working even when the underlying invite link changes.
- Until the application exists, invite links have no storage mechanism — this is a
  placeholder for the operational practice, to be filled in once links are actually stored
  in Supabase.
- When an invite link needs to change, an admin should be able to update it without
  needing to change any public-facing URL, marketing material, or previously issued QR
  code.
- If a link is found to have leaked or been used for abuse/spam outside the intended flow,
  it should be rotated promptly and the incident should inform
  `docs/03-architecture/privacy-and-safety.md` if it reveals a gap.

## Relationship to other documents

- `docs/03-architecture/data-principles.md` — the stable-URL-vs-rotating-link principle
- `docs/03-architecture/privacy-and-safety.md` — invite-link leakage as a safety concern
- `docs/00-context/community-groups.md` — the groups these links belong to
