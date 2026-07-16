---
title: Application Architecture
type: architecture
status: proposed
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [architecture, nextjs, routes, structure]
---

## Purpose

The planned shape of the Next.js application: rendering/execution model, route map with
access requirements, source layout, and the cross-cutting concerns (validation, rate
limiting, errors, logging, scheduled work, environments). Recommended defaults from the
2026-07-16 planning pass; **no application code exists yet**.

## What belongs here

- App Router usage patterns and client boundaries
- The route map (purpose, access, data, actions, privacy/security notes per route)
- Feature-oriented source layout
- Validation, rate limiting, error handling, logging, scheduled tasks, environments

## What does not belong here

- Data model (see [`data-model.md`](data-model.md))
- Auth rationale (see [`identity-and-authorization.md`](identity-and-authorization.md))

## Stack and execution model

Next.js App Router + TypeScript + Tailwind CSS on Vercel; Supabase for Postgres/Auth/
storage (per the founding brief — confirmed intent, not yet installed).

- **Server Components by default.** Public pages render group content server-side (SEO,
  no data-fetch waterfalls, and nothing sensitive ever serialized to the client).
- **Client Components only where interactivity demands:** onboarding form fields,
  copy-link/share buttons, QR download. Never for data access.
- **Server Actions** for mutations initiated from forms (onboarding submit, admin
  transitions): typed, validated, co-located with the feature.
- **Route handlers** for non-HTML endpoints: `/r/<slug>` capture+redirect, invite
  click-through redirect, `GET /api/qr/<slug>.png`, auth callback, cron endpoints.
- **Three Supabase client configurations:**
  1. *Anon (browser)* — only for the trivial reads RLS allows; most pages don't need it.
  2. *Server (user-scoped)* — cookie-bound session for member/admin server rendering; RLS
     enforced as that user.
  3. *Service-role (server-only module)* — for deliberate RLS bypass (anonymous
     onboarding insert, invite-link read inside the reveal path, event writes). Lives in
     one module (`src/lib/supabase/service.ts`) with a lint guard that it is never
     imported from client code; every use site justified by comment.
- **Authentication boundaries by route group:** `(public)` no auth; `(member)` requires
  activated session; `(admin)` requires admin/owner role — checked in the layout
  server-side (defense against a page forgetting the check), plus per-action re-checks.

## Route map

| Route | Purpose | Access | Main data | Main actions | Privacy/security notes |
|---|---|---|---|---|---|
| `/` | Branded landing: parent brand, ethos, group directory teaser, join CTA | Public | `community_groups` (active/public) | — | No member data; cacheable |
| `/groups` | Full subgroup directory | Public | same | — | Cacheable |
| `/groups/[slug]` | Group detail: logo, full description, rules, CTA | Public | one group | CTA → `/join?group=…` | **Never renders invite link**; cacheable |
| `/r/[slug]` | Referral capture → cookie → redirect | Public (route handler) | `referral_links` (server resolve) | set `mr_ref`, write event | httpOnly signed cookie; rate-limited; invalid slug → clean 404, no cookie |
| `/join` | Onboarding form (groups pre-selectable, referral code field) | Public | groups list | Server Action: submit | Anonymous; validation + rate limit + honeypot; consent recorded with doc version |
| `/join/success` | Confirmation + what-happens-next | Public (post-submit token) | — | — | No PII echoed back beyond first name |
| `/guidelines`, `/privacy`, `/terms` | Legal/policy pages | Public | static/versioned content | — | Guideline **version** displayed (consent references it) |
| `/login` | Magic-link request for members/admins | Public | — | send magic link | No account enumeration (identical response either way); rate-limited |
| `/auth/callback` | Supabase auth exchange, member-record linking | Public (token) | `members` | link `auth_user_id`, `member_activated` event | Validates invited status; unknown email → polite dead-end |
| `/invite/[membershipId]` | **Gated invite reveal** for an approved group request | Applicant/Member via signed token (pre-activation) or session | membership + invite link (server-only read) | `invite_revealed` event; click-through link | `Cache-Control: no-store`; link fetched server-side at render; token single-purpose, expiring; every reveal audited |
| `/out/[membershipId]` | Invite click-through redirect to WhatsApp | Same gating as reveal | active invite link | `invite_link_clicked` event → 302 | Never logs destination URL; no-store |
| `/me` | Connector dashboard: referral link, QR, funnel counts, points | Member (activated) | own link, attributions (name+status), ledger sum | copy/share; slug setup | Sees referred people's display names + statuses only |
| `/me/share` | Sharing assets: QR download, story/square cards | Member | own slug | download/share | Assets contain slug only, no personal data |
| `/api/qr/[slug].png` | QR image for a referral slug | Public (QR of public URL) | slug validity | — | Only active slugs; cacheable; rate-limited |
| `/admin` | Queues overview: pending review, verification, corrections | Admin/Owner | queue counts | — | Layout-level role gate |
| `/admin/requests` | Approve/reject membership requests | Admin | submissions + memberships | approve/reject transitions | All transitions audited; concurrency-guarded |
| `/admin/members` + `/admin/members/[id]` | Member registry, detail, activation, deletion requests | Admin | members + related | invite-to-activate; anonymize | Full PII surface — server-rendered only, never cached |
| `/admin/verification` | Verify/retain checklist per group | Admin | memberships by state | verify (evidence), retain, revoke | Evidence free-text redaction rules apply |
| `/admin/referrals` | Attribution list, disputes, corrections | Admin | attributions + events | reassign, reverse | Correction = supersede, never overwrite |
| `/admin/points` | Ledger view, manual adjustments | Admin | ledger | append adjustment (reason required) | Append-only; no edit affordance exists |
| `/admin/groups` + `/admin/groups/[slug]/links` | Group content status; invite-link rotation | Admin (links: admin/owner) | groups; link versions (masked until reveal action) | rotate/revoke link | Link value masked by default in UI; rotation audited |
| `/admin/audit` | Audit log browser | Admin/Owner | audit_log | — | Read-only |
| `/admin/rewards` | Catalog + redemptions | Owner (post-MVP) | rewards, redemptions | approve/fulfill | Post-MVP |

## Feature-oriented source layout

Avoids: one giant `components/` dump, premature enterprise layering, microservices, and
feature logic smeared across route files. Routes stay thin; features own their logic.

```
src/
├── app/                        # App Router: thin route files only
│   ├── (public)/               #   /, /groups, /join, /r, legal
│   ├── (member)/me/            #   activated-member area
│   ├── (admin)/admin/          #   admin area (role-gated layout)
│   └── api/                    #   qr, auth callback, cron endpoints
├── features/                   # one directory per domain feature
│   ├── groups/                 #   directory/detail components + queries
│   ├── onboarding/             #   form, validation schema, submit action, processing
│   ├── referrals/              #   capture, cookie, binding, dashboard widgets
│   ├── invites/                #   reveal authorization, click-through, rotation
│   ├── verification/           #   admin queues + transition actions
│   ├── points/                 #   ledger queries, balance projection, adjustments
│   └── members/                #   member registry, activation, deletion
├── components/                 # genuinely shared UI only (buttons, layout shell)
├── lib/                        # supabase clients, env parsing, rate limit, audit,
│                               # events, crypto/token helpers
├── styles/
└── types/                      # cross-feature shared types only
```

Rule of thumb: a component used by one feature lives in that feature. It moves to
`components/` only on second *unrelated* use.

## Cross-cutting concerns

- **Validation:** every boundary (Server Action, route handler) parses input with zod
  schemas defined next to the feature; nothing typed as trusted past the boundary. Phone
  normalization to E.164 happens in exactly one shared helper.
- **Rate limiting:** middleware + per-action checks on `/join` submit, `/r/…`, `/login`,
  QR generation, reveal endpoints. MVP implementation: fixed-window counters in Postgres
  (no new vendor); swap-out interface if scale demands Upstash/similar later. Trips emit
  `rate_limit_tripped` events.
- **Error handling:** user-facing errors are generic; server errors log structured
  context (request id, route, actor kind — never PII/invite URLs). Transition conflicts
  ("already handled") render as informative, non-error states in admin UI.
- **Scheduled tasks:** Vercel Cron hitting authenticated route handlers —
  retention-check reminders (14-day), attribution expiry (90-day), submission purge
  (90-day), each idempotent and audited as `actor_type=system`.
- **Logging/observability:** structured logs (Vercel), Supabase query logs, and the
  first-party `events`/`audit_log` tables as the queryable truth. Log redaction rules per
  [`analytics-and-events.md`](analytics-and-events.md). Alerting choices at launch, see
  [`../08-delivery/release-checklist.md`](../08-delivery/release-checklist.md).
- **Environment separation:** local (supabase CLI) → preview (Vercel previews against a
  **staging** Supabase project with seed data only — never production member data) →
  production (own Supabase project). Env vars per environment; `.env.example` stays the
  authoritative name list. Preview deployments must not be indexable.

## Relationship to other documents

- [`identity-and-authorization.md`](identity-and-authorization.md) — who may hit what
- [`data-model.md`](data-model.md) — what these routes read/write
- [`referral-system.md`](referral-system.md) — `/r/…` and cookie mechanics
- [`../04-design/information-architecture.md`](../04-design/information-architecture.md) — the page structure this implements
