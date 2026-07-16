---
title: Data Model (Planned)
type: architecture
status: proposed
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [architecture, data-model, database, state-machines]
---

## Purpose

The planned Supabase/Postgres data model for the MVP gateway: which entities exist, what
each is responsible for, their state machines, and their security/audit posture. **No
migrations exist yet and none should be written from this document without entering the
database-foundation milestone** (see
[`../08-delivery/implementation-plan.md`](../08-delivery/implementation-plan.md)). All
shapes below are recommended defaults from the 2026-07-16 planning pass.

## What belongs here

- Entity list, consolidation decisions, per-table responsibility and key fields
- State machines and transition rules (including reversals and concurrency)
- RLS posture, index needs, retention and audit requirements per table

## What does not belong here

- SQL/migrations (future `supabase/migrations/`)
- Product-level policy (see `docs/01-product/`)
- Event taxonomy detail (see [`analytics-and-events.md`](analytics-and-events.md))

## Entity evaluation and consolidation

The candidate list (members, member_profiles, onboarding_submissions, community_groups,
group_interests, group_invite_links, referral_links, referral_attributions,
referral_events, membership_requests, memberships, membership_verifications,
points_ledger, rewards, reward_redemptions, consent_events, admin_actions, audit_logs)
consolidates to **13 tables**. Consolidations, with reasons:

| Candidate | Fate | Reason |
|---|---|---|
| `member_profiles` | **Folded into `members`** | A handful of profile fields doesn't justify a 1:1 table split at this scale |
| `group_interests` | **Folded into `group_memberships`** | Selecting a group at onboarding *is* a membership request in its earliest state — one lifecycle, one table |
| `membership_requests` + `memberships` | **Merged as `group_memberships`** | A request that reaches `verified` is a membership; splitting them forces a fragile handoff between two tables mid-lifecycle |
| `membership_verifications` | **Folded into `group_memberships` columns + `audit_log`** | Verification is a transition (who/when/evidence), not an entity |
| `referral_events` | **Folded into `events`** | Referral clicks are first-party funnel events like any other; one canonical append-only event stream with dedup beats two |
| `admin_actions` + `audit_logs` | **Merged as `audit_log`** | Admin actions are audit entries; two audit tables invite divergence |

Final set: `members`, `onboarding_submissions`, `community_groups`, `group_invite_links`,
`group_memberships`, `referral_links`, `referral_attributions`, `points_ledger`,
`rewards`, `reward_redemptions`, `consent_events`, `audit_log`, `events`.

Primary-key strategy for all tables: **UUID v4 default** (`gen_random_uuid()`), because
IDs leak into URLs and logs and must not be enumerable. Natural keys (phone, slug) are
unique constraints, never PKs. All tables get `created_at`; mutable tables get
`updated_at`.

## Tables

### `members`

- **Responsibility:** One row per human known to Miami Roots, from first submission
  through membership. The identity anchor everything else points at.
- **Important fields:** `id`, `first_name`, `last_name?`, `phone_e164` (unique),
  `email?`, `instagram_handle?`, `auth_user_id?` (unique, FK to Supabase Auth, null until
  activation), `role` (`member|admin|owner`), `status`
  (`applicant|active|inactive|deleted`), `notes_admin?`.
- **Relationships:** ← `group_memberships`, `referral_links`, `referral_attributions`
  (as referred person), `points_ledger`, `consent_events`, `onboarding_submissions`.
- **Unique constraints:** `phone_e164`; `auth_user_id`; `email` (partial, where not null).
- **State model:** `applicant → active → inactive`; `deleted` is a terminal
  privacy state (see retention).
- **Sensitive fields:** `phone_e164`, `email`, names, Instagram — all personal data.
- **Indexes:** unique ones above; `status`, `role`.
- **RLS:** member reads/updates own row (limited columns); admin/owner read all, update
  via defined paths; anon: none. Inserts happen server-side only (service role) from
  onboarding processing.
- **Retention:** on verified deletion request, hard-delete or irreversibly anonymize
  personal columns while preserving ledger/audit integrity via the surviving UUID (see
  [`privacy-and-safety.md`](privacy-and-safety.md)).
- **Audit:** all admin edits audited; role changes owner-only + audited.
- **Canonical vs derived:** canonical for identity. Points balance is **not** stored
  here canonically (any cached total is a projection of `points_ledger`).

### `onboarding_submissions`

- **Responsibility:** Immutable record of each onboarding form submission as submitted —
  what was consented to, which groups were selected, which referral context applied.
  Processing may create/update `members` and `group_memberships`, but the submission row
  itself is never edited.
- **Important fields:** `id`, `member_id?` (linked after processing), `first_name`,
  `phone_e164`, `email?`, `instagram_handle?`, `selected_group_ids[]`,
  `referral_slug_claimed?`, `referral_source` (`cookie|manual|none`),
  `guidelines_version_accepted`, `status` (`received|processed|rejected|purged`),
  `user_agent_hash?`, `ip_hash?` (anti-abuse, hashed, short retention).
- **Unique constraints:** none hard; duplicate handling is by `phone_e164` at processing
  time (re-submission updates the *member/request* state, not this immutable row — each
  submission is its own row).
- **Sensitive fields:** all contact fields; hashed network metadata.
- **Indexes:** `phone_e164`, `status`, `created_at`.
- **RLS:** no client access at all (server-only writes via service role; admin reads via
  server-rendered admin surface). This table never reaches the browser wholesale.
- **Retention:** submissions that never verify are purged/anonymized after **90 days**
  (recommended default); `ip_hash`/`user_agent_hash` dropped after 30 days.
- **Audit:** rejections audited with reason.
- **Canonical vs derived:** canonical record of "what the person actually submitted."

### `community_groups`

- **Responsibility:** The content and status of each subgroup the gateway displays — the
  content model in [`../01-product/community-content-requirements.md`](../01-product/community-content-requirements.md).
- **Important fields:** `id`, `slug` (unique), `name`, `short_description`,
  `full_description`, `welcome_message`, `rules` (text/markdown), `cta_label`,
  `logo_path?`, `banner_path?`, `social_asset_path?`, `display_order`, `visibility`
  (`public|unlisted`), `requires_approval` (bool, default true),
  `invite_reveal_policy` (`after_approval` for MVP), `status`
  (`active|hidden|archived`).
- **Unique constraints:** `slug`.
- **Sensitive fields:** none — **invite links deliberately live elsewhere** so this table
  can be safely readable by anon.
- **Indexes:** `slug`; `(status, visibility, display_order)`.
- **RLS:** anon/member read where `status='active'` and `visibility='public'`;
  admin/owner full read; owner writes (admin edits via Supabase dashboard in MVP).
- **Retention:** indefinite; archived rather than deleted.
- **Audit:** content changes audited once an admin UI exists; via dashboard discipline
  before that.
- **Canonical vs derived:** canonical for group content. Seeded from
  `supabase/seed/` with **public-safe fields only** — never invite links.

### `group_invite_links`

- **Responsibility:** Server-only storage of actual WhatsApp invite links, versioned for
  rotation. The single most access-restricted table in the system — see
  [`invite-link-protection` in `privacy-and-safety.md`](privacy-and-safety.md) and
  [`../05-operations/chat-link-management.md`](../05-operations/chat-link-management.md).
- **Important fields:** `id`, `group_id` (FK), `invite_url` (secret), `status`
  (`active|rotated|revoked`), `created_by`, `rotated_at?`, `rotation_reason?`.
- **Unique constraints:** one `active` row per group (partial unique index).
- **State model:** `active → rotated` (replaced) or `active → revoked` (leak/abuse).
  Rotation inserts a new row and retires the old — history is preserved.
- **Sensitive fields:** `invite_url` — treated as a credential.
- **RLS:** **no client-role access whatsoever** (not even authenticated members). Reads
  happen only in server code paths behind the reveal authorization check; writes only by
  admin/owner server paths. Never in seed files, client bundles, logs, or analytics.
- **Retention:** retired rows kept (audit of what was live when), URL column of revoked
  rows may be null-ed after incident review.
- **Audit:** every reveal, rotation, and revocation writes `audit_log` + `events`
  (without the URL itself).

### `group_memberships`

- **Responsibility:** The per-(member × group) lifecycle from group selection to matured
  membership — the workflow backbone (consolidates interests/requests/memberships/
  verifications).
- **Important fields:** `id`, `member_id`, `group_id`, `status` (state machine below),
  `submitted_at`, `approved_at?/approved_by?`, `invite_revealed_at?`,
  `invite_clicked_at?`, `verified_at?/verified_by?`, `verification_evidence?` (free text:
  e.g. "matched +1…× in participant list" — no screenshots), `retained_at?`,
  `revoked_at?/revocation_reason?`.
- **Relationships:** `members` × `community_groups`.
- **Unique constraints:** `(member_id, group_id)` — one lifecycle per pair; re-requests
  reuse the row.
- **State model:** see [State machine 2](#2-membership-per-member--group) below.
- **Sensitive fields:** verification evidence (admin-written; must never contain other
  members' data or invite links).
- **Indexes:** `(group_id, status)`, `(member_id)`, `(status, submitted_at)` for queues.
- **RLS:** member reads own rows; admin/owner all; anon none; all writes server-side.
- **Retention:** follows member deletion/anonymization.
- **Audit:** every transition audited (actor, from→to, reason).
- **Canonical vs derived:** canonical for membership state; group member counts are
  derived.

### `referral_links`

- **Responsibility:** Each member's personal referral identity — the `/r/<slug>` handle
  and QR target.
- **Important fields:** `id`, `member_id` (FK), `slug` (unique, lowercase kebab, 3–30
  chars, reserved-word checked — see [`referral-system.md`](referral-system.md)),
  `status` (`active|disabled`), `disabled_reason?`.
- **Unique constraints:** `slug` (case-insensitive via citext or lower-index);
  one `active` link per member (partial unique).
- **Sensitive fields:** none (slugs are public by nature).
- **Indexes:** unique slug (doubles as lookup).
- **RLS:** member reads own; resolution of slug → link happens server-side on `/r/…`
  (anon never queries the table directly); admin all.
- **Audit:** slug changes and disables audited.

### `referral_attributions`

- **Responsibility:** The single canonical answer to "who gets credit for this member,"
  with its own maturation lifecycle. One per referred member, ever — corrections update
  the row *through audited transitions*, never by silent overwrite.
- **Important fields:** `id`, `referred_member_id` (unique FK), `referral_link_id` (FK),
  `source` (`cookie|manual_code|admin`), `first_touch_at`, `bound_at` (submission time),
  `status` (state machine 3/4 below), `matured_at?`, `reversed_at?/reversal_reason?`,
  `superseded_by?` (self-FK for admin reassignment history).
- **Unique constraints:** `referred_member_id` among non-superseded rows.
- **Indexes:** `referral_link_id`, `status`.
- **RLS:** referring member sees own referrals (referred person's display name + status
  only — no contact data); referred member sees who referred them; admin all; anon none.
- **Audit:** creation, maturation, reversal, reassignment all audited.
- **Canonical vs derived:** canonical for credit; connector counts/leaderboards are
  derived and privacy-gated.

### `points_ledger`

- **Responsibility:** Append-only source of truth for points. Rows are **never updated or
  deleted** — corrections are compensating entries.
- **Important fields:** `id`, `member_id`, `amount` (±integer), `entry_type`
  (`referral_matured|contribution|adjustment|reversal|redemption`), `reason_code`,
  `reason_note?`, `reference_type?/reference_id?` (e.g. the attribution or redemption
  row), `reversal_of?` (self-FK), `created_by` (system|admin id).
- **Unique constraints (idempotency):** partial unique on `(entry_type, reference_id)`
  for `referral_matured` and `redemption` — the same maturation or redemption can never
  post twice.
- **State:** none — the *ledger* has no states; "pending points" are **not ledger rows**
  (see state machine 5).
- **Indexes:** `(member_id, created_at)`; `reference_id`.
- **RLS:** member reads own rows; admin all; **no update/delete policies exist for any
  role** — append-only is enforced by RLS + revoked UPDATE/DELETE grants, not convention.
- **Retention:** indefinite (financial-style record); survives member anonymization
  (member UUID persists).
- **Audit:** manual adjustments require `reason_code` + audit entry.
- **Canonical vs derived:** canonical. `available_points = SUM(amount)` per member is
  always derived (view or cached projection).

### `rewards`

- **Responsibility:** The redeemable catalog (name, description, point cost, inventory,
  active window). **Post-MVP activation** — table planned so the ledger design doesn't
  need rework, but no catalog ships in MVP (see decision in
  [`../07-decisions/decision-log.md`](../07-decisions/decision-log.md)).
- **Important fields:** `id`, `name`, `description`, `point_cost`, `inventory_count?`,
  `status` (`draft|active|paused|retired`).
- **RLS:** members read `active`; owner writes.

### `reward_redemptions`

- **Responsibility:** One row per redemption attempt, carrying the idempotency and
  fulfillment workflow. The ledger debit references this row.
- **Important fields:** `id`, `member_id`, `reward_id`, `idempotency_key` (unique,
  client-generated per attempt), `status`
  (`requested|approved|fulfilled|cancelled`), `decided_by?`, `fulfilled_at?`.
- **Unique constraints:** `idempotency_key`; ledger partial-unique on redemption
  reference (belt and braces against double debit).
- **State model:** see [State machine 6](#6-reward-redemption).
- **RLS:** member reads/creates own (`requested` only); admin transitions; no deletes.
- **Audit:** every transition audited.

### `consent_events`

- **Responsibility:** Append-only log of consent grants and withdrawals: guideline
  acceptance (with version), contact consent, marketing consent, deletion requests.
- **Important fields:** `id`, `member_id?` (or submission id pre-member), `consent_type`,
  `document_version?`, `granted` (bool), `recorded_via` (`onboarding_form|member_area|admin`).
- **RLS:** member reads own; server-side writes; append-only (no update/delete grants).
- **Retention:** kept even after anonymization (proof of consent history, keyed to UUID).

### `audit_log`

- **Responsibility:** Append-only record of every privileged or state-changing action:
  who did what to which entity, from→to, why. The merged admin_actions/audit_logs table.
- **Important fields:** `id`, `actor_type` (`admin|owner|system`), `actor_id?`, `action`,
  `entity_type`, `entity_id`, `from_state?`, `to_state?`, `reason?`, `metadata` (jsonb,
  **redaction rule: never contains invite URLs, full phone numbers, or emails** — use
  entity IDs and last-4 masking).
- **Indexes:** `(entity_type, entity_id)`, `(actor_id, created_at)`.
- **RLS:** admin/owner read; system writes server-side; **no update/delete for anyone.**
- **Retention:** indefinite.

### `events`

- **Responsibility:** First-party canonical funnel/analytics event stream (consolidates
  `referral_events`). Full taxonomy, dedup keys, and retention in
  [`analytics-and-events.md`](analytics-and-events.md).
- **Important fields:** `id`, `event_name`, `occurred_at`, `actor_kind`
  (`anon|member|admin|system`), `member_id?`, `group_id?`, `referral_link_id?`,
  `dedup_key?` (unique where present), `properties` (jsonb, classification rules apply).
- **RLS:** no client reads (aggregates are served, not raw events); server-side writes.
- **Retention:** per-event class, see the analytics doc.

## State machines

Shared rules for all machines below:

- **Transitions are guarded updates:** `UPDATE … SET status = <new> WHERE id = <id> AND
  status = <expected>` — a concurrent admin acting on the same row loses cleanly (0 rows
  updated → surface "already handled by <actor>"), never double-applies.
- **Idempotency:** re-running a transition that already happened is a no-op, not an error
  and not a duplicate side effect (side effects carry unique reference constraints).
- **Reversals are forward transitions** to a reversal state with a reason, never row
  deletion; downstream effects are compensated (ledger reversal entries), not erased.
- **Every transition writes `audit_log`** with actor and reason.
- Anything not listed as a valid transition is invalid and must be rejected.

### 1. Onboarding (`onboarding_submissions.status`)

```
received ──processed──▶ processed
   │
   └─rejected──▶ rejected        (spam/abuse; reason audited)
received|rejected ──(90 days, unverified)──▶ purged
```
Invalid: anything out of `processed`/`purged` (immutable once handled; a new attempt is a
new row).

### 2. Membership (per member × group, `group_memberships.status`)

```
submitted ──admin approves──▶ approved(invited)
submitted ──admin rejects───▶ rejected            (reason; member may re-request later → back to submitted)
approved ──system: reveal page opened──▶ invite_revealed
invite_revealed ──system: invite click──▶ join_requested
join_requested|invite_revealed|approved
          ──admin verifies (evidence)──▶ verified
verified ──14-day retention check──▶ retained
verified|retained ──admin reversal (mistake/left group)──▶ revoked (reason)
revoked ──admin re-verifies──▶ verified            (rejoin case)
```
Notes: verification may legitimately skip `join_requested` (person joined via a link click
the system missed) — allowed, flagged in evidence. `retained` currently means "still in
the group at +14 days," recommended default pending the owner's retention definition
(open question #7). Reversal of `verified` after a referral matured triggers the referral
reversal cascade (machine 4) — it does not silently un-verify.

### 3. Referral verification (attribution binding, `referral_attributions.status`)

```
(visit: cookie set, no row yet — see referral-system.md)
attributed  ← created at onboarding processing (cookie or manual code; self-referral blocked)
attributed ──referred member's first membership verified──▶ verified
attributed|verified ──admin correction──▶ superseded  (new row created with source=admin)
attributed ──90-day window expires unverified──▶ expired
```

### 4. Referral maturation (`referral_attributions.status`, continued)

```
verified ──referred member retained (14 days)──▶ matured   [posts points_ledger: referral_matured, idempotent]
verified|matured ──admin reversal (fraud, un-verify, dispute)──▶ reversed (reason)
        matured→reversed additionally posts compensating ledger entry (reversal_of = original)
```
Invalid: maturing twice (blocked by ledger unique constraint); maturing a superseded or
expired attribution; any transition without an audit entry.

### 5. Points availability (derived, not stored states)

```
"pending"   = attribution in verified (not yet matured)  → derived projection, no ledger row
"available" = SUM(points_ledger.amount) for the member   → ledger rows exist
"reversed"  = compensating negative entry posted          → both entries remain visible
"redeemed"  = negative redemption entry posted            → references reward_redemptions
```
The ledger never holds a "pending" row — pending is a query over attributions. This keeps
the ledger strictly factual (things that happened) and makes reversals arithmetic instead
of state surgery.

### 6. Reward redemption (`reward_redemptions.status`) — post-MVP activation

```
requested ──admin approves──▶ approved ──admin fulfills──▶ fulfilled
requested|approved ──admin/member cancels──▶ cancelled
```
Ledger debit posts at `approved` (idempotent via unique reference); cancellation after
approval posts a compensating credit. Balance check at request AND approval (balance may
have changed between). Concurrent double-redeem is blocked by the `idempotency_key`
unique constraint plus a balance re-check inside the approval transaction.

## Cross-cutting requirements

- **RLS on every table, deny-by-default:** enable RLS at creation; policies grant the
  minimum from the matrix in
  [`identity-and-authorization.md`](identity-and-authorization.md). Tables with no
  client-facing need (`group_invite_links`, `onboarding_submissions`, `events`,
  `audit_log`) get **no anon/authenticated policies at all**.
- **Append-only enforcement is mechanical:** `points_ledger`, `consent_events`,
  `audit_log` have UPDATE/DELETE revoked for all app roles.
- **Canonical vs derived, everywhere:** balances, counts, funnel metrics, leaderboards
  are projections; if a projection and its source disagree, the source wins and the
  projection is rebuilt.
- **Migrations discipline:** once written and applied anywhere shared, migrations are
  never edited (per `CLAUDE.md`).

## Relationship to other documents

- [`data-principles.md`](data-principles.md) — the principles this model implements
- [`identity-and-authorization.md`](identity-and-authorization.md) — role matrix behind RLS
- [`referral-system.md`](referral-system.md) — attribution mechanics feeding machines 3–4
- [`analytics-and-events.md`](analytics-and-events.md) — the `events` table taxonomy
- [`../05-operations/membership-verification.md`](../05-operations/membership-verification.md) — the human workflow driving machine 2
