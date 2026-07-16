---
title: System Context
type: architecture
status: draft
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [architecture, system-context]
---

## Purpose

Describes, at a high level, how the Miami Roots web application relates to WhatsApp and to
the people using it — the boundary of the system, before any internal design.

## What belongs here

- The actors and systems involved and how they connect
- What the web app owns vs. what WhatsApp owns
- High-level data flow between them

## What does not belong here

- Database schema (not yet designed)
- Specific integration mechanics/API detail (see `docs/03-architecture/integrations.md`)

## Known initial information

Miami Roots' community actually *lives* in WhatsApp — the web application is a front door
and coordination layer around it, not a replacement for it.

```
Visitor / Member (browser)
        │
        ▼
  Miami Roots Gateway (Next.js on Vercel)
        │  ├─ reads/writes: members, referrals, points, verification (Supabase Postgres)
        │  ├─ auth (Supabase Auth) — scope TBD, see open questions
        │  └─ generates: referral links, QR codes
        │
        ▼
  WhatsApp invite links (external, WhatsApp-owned)
        │
        ▼
  WhatsApp Groups (General Chat, Business & Connections, Nightlife & Event Marketing,
                    Daytime Events, Community Organizing, Sober Social)
```

Key boundary: **the web app does not control WhatsApp group membership directly.** It can
surface invite links and, depending on how question #3 in
`docs/02-planning/open-questions.md` is resolved, may or may not be able to programmatically
confirm someone joined. Until that's resolved, assume verification requires some manual or
semi-manual admin step.

The public Miami Roots URL (and per-group/per-referrer URLs derived from it) is the stable
surface visitors interact with; the underlying WhatsApp invite link behind each group can
change without breaking those URLs — see `docs/03-architecture/data-principles.md`.

## Relationship to other documents

- `docs/00-context/community-groups.md` — the groups this diagram routes to
- `docs/03-architecture/integrations.md` — WhatsApp and Supabase integration specifics
- `docs/03-architecture/data-principles.md` — the stable-URL-vs-rotating-link principle
