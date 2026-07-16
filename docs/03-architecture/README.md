---
title: Architecture Overview
type: architecture
status: active
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [architecture]
---

## Purpose

Index for architecture documentation. No database schema or system implementation exists
yet — these documents record principles and context intended to constrain and inform that
work when it starts, not a finished design.

## What belongs here

- `system-context.md` — how Miami Roots fits with WhatsApp and external systems, and the
  canonical funnel chain
- `data-principles.md` — principles the data model must respect
- `data-model.md` — the planned tables, state machines, and RLS posture (no migrations yet)
- `identity-and-authorization.md` — auth approach, roles, and the deny-by-default matrix
- `referral-system.md` — referral URLs, attribution rules, QR behavior
- `analytics-and-events.md` — the canonical event taxonomy
- `application-architecture.md` — Next.js structure, route map, source layout
- `privacy-and-safety.md` — privacy, consent, and safety design
- `integrations.md` — external integrations and their limits

## What does not belong here

- Actual schema/migrations (see `supabase/migrations/` once they exist)
- Product feature definitions (see `docs/01-product/`)
- Operational procedures (see `docs/05-operations/`)

## Relationship to other documents

Architecture documents should be read before any schema or infrastructure decision, and
updated (or superseded by a decision-log entry) whenever such a decision is made.
