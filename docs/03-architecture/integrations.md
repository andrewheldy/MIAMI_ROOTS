---
title: Integrations
type: architecture
status: proposed
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [architecture, integrations]
---

## Purpose

External systems the gateway integrates with, their exact role, and their limits.
Updated 2026-07-16: the MVP integration surface is deliberately tiny — Supabase, Vercel,
and WhatsApp-via-links. Everything else is either in-process or deferred.

## What belongs here

- Each external system: role, constraints, failure posture
- Deferred integrations and the conditions that would justify them

## What does not belong here

- Client code detail (future `src/lib/`)
- General principles (see [`data-principles.md`](data-principles.md))

## MVP integrations

### WhatsApp (link-based only)

The community's home, integrated **only** through invite links that the app stores
server-side, reveals in a gated flow, and rotates operationally. Planning assumption
(held pessimistically): **no** webhooks, join confirmations, membership reads, or
invite-link attribution are available to us — see
[`system-context.md`](system-context.md). Human admins bridge the gap
(verification workflow). WhatsApp's terms around any automation remain an open research
item (`docs/06-research/research-backlog.md` #1) — nothing in MVP scope touches
automation, which keeps that risk at zero for launch.

**Future option (explicitly not MVP):** WhatsApp Business Platform / Cloud API for
onboarding messages or semi-automated join confirmation. Justified only if manual
verification workload demonstrably breaks down; requires the ToS research first;
recorded as future exploration in the decision log.

### Supabase

Postgres (sole database, RLS everywhere), Auth (magic links for activated members and
admins), and Storage only if/when runtime-generated sharing assets need persistence
(MVP generates them on demand instead). Sole backend — no separate server. Environments:
separate staging and production projects
([`application-architecture.md`](application-architecture.md)); backups per
[`../08-delivery/release-checklist.md`](../08-delivery/release-checklist.md).

### Vercel

Hosting, preview deployments, Cron for scheduled jobs (retention reminders, purges,
expiries), structured logs. Preview environments point at staging Supabase only and are
non-indexable.

## In-process (not external services)

- **QR generation:** an npm library at request time (`/api/qr/<slug>.png`) — encodes only
  the stable referral URL; no third-party QR service, nothing stored.
- **OG/sharing images:** Next.js image-generation (`next/og`) at runtime from brand
  assets — see [`../04-design/asset-implementation-plan.md`](../04-design/asset-implementation-plan.md).
- **Rate limiting:** Postgres counters for MVP; a hosted limiter (e.g. Upstash) only if
  scale demands (decision-gate, not default).

## Deferred / rejected for MVP

| Integration | Status | Condition to revisit |
|---|---|---|
| WhatsApp Business API | Future exploration | Manual verification breaks down **and** ToS research clears it |
| SMS/OTP provider | Rejected for MVP | Email activation proves insufficient (see [`identity-and-authorization.md`](identity-and-authorization.md)) |
| Third-party analytics | Optional, flag-gated | Never load-bearing; first-party events are canonical ([`analytics-and-events.md`](analytics-and-events.md)) |
| Email service beyond Supabase Auth mail | Deferred | Transactional email needs beyond magic links (e.g. digests) |
| Error-tracking SaaS (Sentry-class) | Decide at launch-hardening milestone | Include only with PII-scrubbing configured |

## Relationship to other documents

- [`system-context.md`](system-context.md) — the boundary these integrations sit on
- [`application-architecture.md`](application-architecture.md) — where each integration
  is touched in code
- `.env.example` — variable names integrations require (kept authoritative at each
  milestone)
