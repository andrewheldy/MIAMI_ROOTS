---
title: Analytics and Events
type: architecture
status: proposed
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [architecture, analytics, events, observability]
---

## Purpose

Defines the canonical event taxonomy for the MVP: which events exist, what triggers them,
where they're captured, how they deduplicate, how they're classified, and how long they
live. Recommended defaults from the 2026-07-16 planning pass.

## What belongs here

- The layered model (source of truth vs product analytics vs audit vs security)
- The event catalog with per-event specification
- Classification and retention rules

## What does not belong here

- The `events` table shape (see [`data-model.md`](data-model.md))
- Operational dashboards/alerting practice (see
  [`../08-delivery/release-checklist.md`](../08-delivery/release-checklist.md) for launch
  monitoring)

## Layered model

| Layer | Lives in | Purpose | Loss tolerance |
|---|---|---|---|
| **Operational source of truth** | Domain tables (`group_memberships`, `referral_attributions`, `points_ledger`, `consent_events`) | The actual state of the world; funnel *states* | None — transactional |
| **Canonical funnel events** | First-party `events` table | Timestamped things-that-happened powering funnel metrics; **referral truth stays first-party** | Very low — written server-side in the same code path as the action |
| **Product analytics** | Optional third-party (privacy-friendly, e.g. Vercel Analytics/Plausible-class), behind `NEXT_PUBLIC_ANALYTICS_ENABLED` | Page views, rough traffic shape | High — nice-to-have, never load-bearing |
| **Audit events** | `audit_log` | Who did what, admin/privileged actions | None — append-only |
| **Security events** | `audit_log` (flagged) + platform logs | Auth failures, rate-limit trips, reveal anomalies | Low |
| **Derived metrics** | Views/queries over the above | Conversion rates, connector stats, leaderboards | Rebuildable at will |

Rule: **a metric that matters is computed from the first two layers only.** Third-party
analytics may corroborate, never define. If an event and a domain-table state disagree,
the domain table wins.

## Event catalog (canonical `events` table)

Common fields: `event_name`, `occurred_at`, `actor_kind`, optional `member_id`,
`group_id`, `referral_link_id`, `dedup_key`, `properties`. Data classes: **A** = no
personal data; **B** = pseudonymous (UUID references only); **C** = would identify a
person (avoided in events — identity lives in domain tables).

| Event | Trigger | Actor | Required properties | Captured | Dedup / idempotency | Class | Retention | Canonical? |
|---|---|---|---|---|---|---|---|---|
| `referral_link_visited` | GET `/r/<slug>` resolves | anon | referral_link_id, had_existing_cookie | Server route handler | None (every visit counts); rate-limited per IP hash | B | 24 mo | ✅ |
| `onboarding_started` | First interaction with form (lazy, once per session) | anon | referral_present (bool) | Server action ping | Session-scoped key | A | 12 mo | Analytical only |
| `onboarding_submitted` | Submission accepted (post-validation) | anon | submission_id, group_count, referral_source | Server action, same transaction as insert | submission_id unique | B | 24 mo | ✅ |
| `onboarding_rejected` | Submission rejected (spam/validation) | system | reason_code | Server | submission_id | B | 6 mo | Security |
| `group_selected` | Part of submission (one event per group) | anon | submission_id, group_id | Server | (submission_id, group_id) | B | 24 mo | ✅ |
| `guidelines_accepted` | Consent checkbox at submission | anon | document_version | Server (also writes `consent_events` — that row is the legal record) | submission_id | B | 24 mo | ✅ (consent table is the record; event is funnel signal) |
| `invite_revealed` | Reveal page renders the actual link | member/applicant | membership_id, group_id, invite_link_version_id | Server, inside reveal authorization path | (membership_id, link_version) — first reveal canonical, re-views counted separately | B | 24 mo | ✅ + audit twin |
| `invite_link_clicked` | Click-through from reveal page to WhatsApp | member/applicant | membership_id, group_id | Server redirect endpoint (not client JS) | First click per membership canonical | B | 24 mo | ✅ |
| `membership_verified` | Admin verifies join | admin | membership_id, group_id | Server action (transition) | Transition guard | B | 24 mo | ✅ (mirror of state change) |
| `membership_revoked` | Admin reversal | admin | membership_id, reason_code | Server action | Transition guard | B | 24 mo | ✅ |
| `membership_retained` | 14-day retention confirmation | admin/system | membership_id | Server action / scheduled check | Once per membership | B | 24 mo | ✅ |
| `referral_attributed` | Attribution row bound at processing | system | attribution_id, source | Server, same transaction | attribution_id | B | 24 mo | ✅ |
| `referral_matured` | Maturation transition | system | attribution_id | Server | Ledger unique ref is the real guard | B | 24 mo | ✅ |
| `referral_reversed` | Admin reversal | admin | attribution_id, reason_code | Server | Transition guard | B | 24 mo | ✅ |
| `self_referral_blocked` | Binding check trips | system | referral_link_id | Server | — | B | 12 mo | Security |
| `points_awarded` / `points_adjusted` | Ledger entry posted | system/admin | ledger_entry_id, entry_type | Server, after ledger insert | ledger_entry_id | B | 24 mo | Ledger is canonical; event is signal |
| `reward_redemption_requested/approved/fulfilled/cancelled` | Redemption transitions (post-MVP) | member/admin | redemption_id | Server | redemption_id + state | B | 24 mo | Redemption table canonical |
| `member_activated` | Magic-link account linked | member | member_id | Server auth callback | member_id | B | 24 mo | ✅ |
| `member_deletion_requested` | Deletion/withdrawal request | member/admin | member_id | Server | member_id (open request) | B | Kept as consent record | ✅ |
| `rate_limit_tripped` | Any rate limiter fires | system | surface, ip_hash | Middleware/server | — | A/B | 3 mo | Security |
| `admin_login_failed` | Auth failure on admin surface | system | — (no identifiers beyond ip_hash) | Auth hooks/platform | — | B | 6 mo | Security |

**Redaction rules for `properties` (hard rules):** never an invite URL, never a full
phone number or email, never free-text member content, never a raw IP (hashed only,
short retention). Events reference UUIDs; joins to identity happen only in admin-scoped
queries.

## Derived metrics (examples, all rebuildable)

Funnel conversion (visited → submitted → revealed → clicked → verified → retained →
matured) per group and per connector; connector effectiveness (matured / attributed);
time-in-state distributions (where does the funnel stall); invite-reveal-to-verify lag
(admin workload signal). Public leaderboards are a **privacy-gated post-MVP decision**,
not a default (see [`privacy-and-safety.md`](privacy-and-safety.md)).

## Relationship to other documents

- [`data-model.md`](data-model.md) — `events`, `audit_log` tables
- [`referral-system.md`](referral-system.md) — the funnel these events instrument
- [`privacy-and-safety.md`](privacy-and-safety.md) — classification and redaction rationale
