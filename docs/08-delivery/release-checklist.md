---
title: Release Checklist and Launch Plan
type: delivery
status: proposed
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [delivery, release, launch, operations]
---

## Purpose

The launch plan for the MVP gateway and the checklist executed at M15 (launch
hardening). Written at planning time (2026-07-16) so setup needs are visible early;
items get checked only when actually verified. **No credentials or invite links ever
appear in this or any tracked file.**

## Environments and setup

### Environment variables (names only — values live in Vercel/Supabase config)

| Name | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | client-safe | Canonical public URL |
| `NEXT_PUBLIC_SUPABASE_URL` | client-safe | Supabase project URL (per environment) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client-safe | RLS-bound anon key |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | client-safe | Product-analytics flag (default `false`) |
| `SUPABASE_SERVICE_ROLE_KEY` | **server-only** | Deliberate RLS bypass paths only |
| `SESSION_COOKIE_SECRET` | **server-only** | Signing the referral cookie + reveal tokens |
| `CRON_SECRET` | **server-only** | Authenticating Vercel Cron endpoints |

`.env.example` stays the authoritative name list and is updated in the same change as
any new variable (M1 onward).

### Supabase

Two projects: **staging** (previews + rehearsals; seed data only, never real member
data) and **production**. Both: RLS everywhere, Auth configured for magic links (mail
sender domain verified), scheduled backups on production (daily, ≥14-day retention),
point-in-time recovery if plan allows.

### Vercel

Project linked to the repo; preview deployments → staging Supabase, non-indexable
(`X-Robots-Tag`); production → production Supabase; Cron jobs configured (retention
reminders, expiries, purges) with `CRON_SECRET`.

### Domain, DNS, email

Production domain + `www` redirect; TLS automatic via Vercel. **Email deliverability is
launch-critical** (magic links): SPF/DKIM/DMARC configured for the auth sender domain and
verified with real inboxes (Gmail/iCloud/Outlook) before launch.

## Seed and initial content

- Seed: `community_groups` rows for the six MVP groups (public-safe fields only) —
  content owner-approved; guidelines/privacy/terms pages versioned and live.
- **Initial owner + admins:** owner account created and role-assigned; each admin
  activated, walked through `/admin` on their own phone.
- **Invite links:** entered manually into production `group_invite_links` (never via
  seed/repo); each link fresh-generated at launch (pre-launch rotation), verified by a
  test join per group.
- Connector slugs for the founding members created and QR cards generated.

## Launch checklist (M15 gate — all must be checked)

### Security

- [ ] RLS matrix tests green against production schema
- [ ] Leak hunt (repo, bundles, rendered HTML, seeds: no `chat.whatsapp.com`) green
- [ ] Secret-pattern scan of repo and deployment config history clean
- [ ] Rate limits tuned and verified on `/join`, `/r/`, `/login`, QR, reveal
- [ ] Reveal/redirect paths: `no-store` verified; audit rows verified; log redaction
      verified with canary values
- [ ] Dependency audit (no known-critical vulns); security headers/CSP verified
- [ ] Human security review of M7 invite paths signed off

### Legal / privacy (start during M8–M11, not at M15)

- [ ] Privacy/data-use copy legally reviewed (research backlog #2–3 resolved)
- [ ] Consent flow shows correct versioned guidelines; `consent_events` verified
- [ ] Deletion request procedure tested end-to-end (anonymization verified)

### Functional

- [ ] Full two-phone journey on production infra (staging data): referral visit →
      onboarding → approval → reveal → join → verify → retain → mature → points visible
- [ ] All six groups render correctly incl. logo fallbacks; Ticket Exchange absent
- [ ] Accessibility pass (axe + keyboard-only onboarding) green; 360px layouts verified
- [ ] Production smoke suite green on the launch deploy

### Operational

- [ ] Backups verified **by restoring** into staging (rehearsal, not configuration)
- [ ] Rollback rehearsed: previous-deploy restore on Vercel + migration
      forward-fix/down-path notes current
- [ ] Admin runbooks read by actual admins: verification workflow, link rotation,
      leak response (`docs/05-operations/`)
- [ ] Alerting: error-rate and cron-failure notifications reach a human
- [ ] Analytics validation: each canonical event observed once in production smoke,
      dedup confirmed, no PII in properties

## Recovery and rollback

- **App rollback:** redeploy previous Vercel build (minutes).
- **Data:** migrations are forward-fix by default; destructive migrations require a
  rehearsed restore path before they ship. Worst case: restore latest backup to a fresh
  project, repoint env vars — rehearsed at M15.
- **Invite-link incident:** runbook in
  `docs/05-operations/chat-link-management.md` (WhatsApp reset first).

## First-week monitoring and manual operating procedures

- Daily (admins): clear review queue (<48h SLA), verification queue, watch
  `rate_limit_tripped` / `onboarding_rejected` for abuse patterns.
- Daily (owner/dev): error logs, cron job success, funnel counts sanity
  (visits ≥ submissions ≥ reveals ≥ clicks).
- Day 7: first retention checks come due — confirm the reminder queue populates and the
  first maturations post correctly (watch the first ledger entries land).
- Anomaly triggers: submission spike from one slug or IP-hash cluster → review before
  approving; any suspected link exposure → runbook immediately.

## Relationship to other documents

- `docs/08-delivery/implementation-plan.md` — M15 executes this document
- `docs/08-delivery/testing-strategy.md` — the suites referenced here
- `docs/05-operations/` — the runbooks admins operate from
