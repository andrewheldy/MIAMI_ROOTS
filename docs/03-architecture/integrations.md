---
title: Integrations
type: architecture
status: draft
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [architecture, integrations]
---

## Purpose

Lists the external systems Miami Roots is expected to integrate with and their expected
role, before any integration is actually built.

## What belongs here

- Each external system, why it's needed, and what it's responsible for
- Known constraints or open questions specific to that integration

## What does not belong here

- Implementation code or API client detail (belongs in `src/lib/` once it exists)
- General architecture principles not tied to a specific external system (see
  `docs/03-architecture/data-principles.md`)

## Known initial information

- **WhatsApp.** The primary communication layer and where the actual community lives.
  Integration is currently expected to be link-based (surfacing invite links) rather than
  a deep API integration — whether a WhatsApp Business API integration is used for
  automated join verification is an open question (`docs/02-planning/open-questions.md`,
  #3).
- **Supabase.** Postgres database, authentication, storage (for brand/group assets and
  possibly QR codes), and row-level security. Expected to be the sole backend — no separate
  custom server is currently planned.
- **Vercel.** Deployment target for the Next.js application.
- **QR code generation.** Referral links need a QR code representation. Whether this is
  generated client-side, server-side, or via a third-party service is not yet decided.
- **Analytics.** `.env.example` includes `NEXT_PUBLIC_ANALYTICS_ENABLED` as a placeholder
  flag; no specific analytics provider has been chosen.

## Relationship to other documents

- `docs/03-architecture/system-context.md` — how these integrations fit the overall system
- `docs/02-planning/open-questions.md` — unresolved integration questions
- `.env.example` — the environment variables integrations will eventually need
