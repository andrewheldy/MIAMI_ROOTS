---
title: Chat Link Management
type: operations
status: proposed
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [operations, whatsapp, invite-links, security]
---

## Purpose

The operational practice for WhatsApp invite links: entry, storage, rotation, revocation,
and the leak-response runbook. The architectural design these operations rely on is in
[`../03-architecture/privacy-and-safety.md`](../03-architecture/privacy-and-safety.md)
(invite-link protection) and [`../03-architecture/data-model.md`](../03-architecture/data-model.md)
(`group_invite_links`).

## What belongs here

- Day-to-day link procedures and the incident runbook
- Who may do what with links

## What does not belong here

- Storage/authorization architecture (see the architecture docs above)
- Group content governance (see [`whatsapp-content-governance.md`](whatsapp-content-governance.md))

## Standing rules

- Raw invite links are **credentials**: server-only storage, gated reveal, full audit.
  They never appear in Git, seed files, docs, chat messages, screenshots in tracked
  locations, logs, analytics, or client bundles.
- The public URL for a group never changes; the link behind it rotates freely.
- One active link per group; history retained.

> Interim implementation (Milestone 2.5+): the seven live chats are held as server-only
> `WHATSAPP_*_URL` environment variables behind validated `/go/<slug>` redirects — including
> `WHATSAPP_TICKET_EXCHANGE_URL` for the Ticket Exchange community approved 2026-07-19
> (decision log). This env-var interim stands until the full server-store + audited-reveal
> design below ships. Ticket Exchange additionally carries member-facing **safety guidance**
> (verify before paying; Miami Roots does not guarantee any transaction) — that is public
> content, separate from these link-credential rules.

> **The parent community link is an exception to the rules above (2026-08-17).** The
> invite to the parent WhatsApp **Community** that contains every room is a **build-time
> constant in code**: `MIAMI_ROOTS_COMMUNITY_URL` in `src/content/join/community-link.ts`,
> served by `/go/community`. It is not an environment variable and not a credential in the
> sense this page uses the word.
>
> Why the exception: it briefly was `WHATSAPP_COMMUNITY_URL`, and a deployment without
> that variable set showed an "unavailable" page instead of opening the community. For the
> site's single call to action, a value that can go missing in configuration is a worse
> failure than a value that lives in Git. See the 2026-08-17 decision-log entry.
>
> Operational consequences:
>
> 1. **Rotating it is a code change**, not a hosting-config change: edit the constant, open
>    a pull request, merge, deploy. Budget minutes, not seconds. The old value stays in Git
>    history and cannot be scrubbed from it, so treat any rotation as a change of address
>    rather than as revocation of a secret. If the link is ever abused, reset it in WhatsApp
>    first, exactly as step 1 of the runbook below says.
> 2. **Rotating it still invalidates nothing printed.** Cards, flyers, and QR codes carry
>    `/go/community` or `miami-roots.vercel.app/join`, never the WhatsApp URL, so a
>    rotation is invisible to everyone holding one.
> 3. **`/go/community` cannot fail from missing configuration.** There is no unavailable
>    state on that path any more.
>
> The seven per-chat variables are unchanged and remain credentials under every rule on
> this page: server-only, validated, never committed, rotated in hosting config. They stay
> configured even though no page links to them any more, because `/go/<chat>` paths were
> shared before the redesign and must keep resolving.

## Procedures

- **Entering a link (new group or rotation):** a WhatsApp group admin generates the link
  in WhatsApp; an app admin enters it directly into the server-side store (admin UI at
  `/admin/groups/<slug>/links` once shipped; Supabase dashboard before that). Never
  transmit links through email/chat where avoidable; if transmitted, rotate soon after
  setup.
- **Routine rotation:** recommended default — rotate any link ~quarterly, and
  immediately on: admin departure, suspicious join pattern, or any suspected exposure.
  Rotation = generate new link in WhatsApp → enter as new active row → old row marked
  `rotated`. Zero public-facing impact.
- **Revocation:** WhatsApp-side "reset link" first (kills the old link for real), then
  record `revoked` with reason in the store.

## Leak-response runbook

1. **Reset the link in WhatsApp immediately** (the only step that actually stops joins).
2. Record revocation + reason; enter the replacement link.
3. Review the reveal audit trail (`invite_revealed` events + audit log) for the exposure
   window — who legitimately saw the leaked version.
4. Ask the group's WhatsApp admins to watch for unexpected joiners; remove any.
5. Post-incident: note what leaked and how in
   [`../03-architecture/privacy-and-safety.md`](../03-architecture/privacy-and-safety.md)'s
   concerns if it reveals a design gap; treat every historical location of the leaked
   link (screenshot, message) as needing cleanup.

## Permissions

Admins: enter, rotate, revoke, and reveal-for-verification purposes. Owner: additionally
changes who is an admin. No member-facing path ever returns a link outside the gated
reveal flow. All of these actions are audited.

## Relationship to other documents

- [`../03-architecture/privacy-and-safety.md`](../03-architecture/privacy-and-safety.md) — protection design
- [`../03-architecture/data-model.md`](../03-architecture/data-model.md) — link versioning model
- [`whatsapp-content-governance.md`](whatsapp-content-governance.md) — the content half of group ops
