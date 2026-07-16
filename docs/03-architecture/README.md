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

- `system-context.md` — how Miami Roots fits with WhatsApp and external systems
- `data-principles.md` — principles the eventual data model must respect
- `privacy-and-safety.md` — privacy, consent, and safety constraints
- `integrations.md` — expected external integrations and their role

## What does not belong here

- Actual schema/migrations (see `supabase/migrations/` once they exist)
- Product feature definitions (see `docs/01-product/`)
- Operational procedures (see `docs/05-operations/`)

## Relationship to other documents

Architecture documents should be read before any schema or infrastructure decision, and
updated (or superseded by a decision-log entry) whenever such a decision is made.
