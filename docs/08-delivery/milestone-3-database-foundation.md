---
title: Milestone 3 — Database and Security Foundation
type: delivery
status: active
owner: unassigned
created: 2026-07-18
updated: 2026-07-18
tags: [delivery, milestone-3, database, supabase, rls, security]
---

## Purpose

Delivery record for Milestone 3: the Supabase/Postgres schema, deny-by-default
Row Level Security, typed client boundaries, environment validation, database
test suite, and CI wiring. **Nothing user-visible changed** — the public site
still renders entirely from the in-code content module (`src/content/groups/`);
moving content into the database is Milestone 4.

Design sources implemented here (authoritative): `docs/03-architecture/data-model.md`,
`identity-and-authorization.md`, `application-architecture.md`, `data-principles.md`.

## What shipped

### Schema — the M3 spine (six tables)

Versioned migrations in `supabase/migrations/`, replayable from a clean
database, with UUID primary keys, explicit constraints, `created_at`/`updated_at`
(+ trigger) on mutable tables, and the documented indexes:

| Table | Responsibility | Notable integrity |
| --- | --- | --- |
| `members` | Identity anchor; `role` member/admin/owner; `status` lifecycle | unique `phone_e164` (+E.164 check), partial-unique `auth_user_id` and `lower(email)`; FK → `auth.users` |
| `community_groups` | Public group content shape (content itself arrives in M4) | unique kebab `slug`; status/visibility checks; directory index |
| `onboarding_submissions` | Immutable submission records | E.164 + status checks; FK → members (`set null`) |
| `consent_events` | Append-only consent record | subject-present check; FK blocks hard-deleting a member with history (anonymize instead) |
| `audit_log` | Append-only privileged-action trail | actor-presence check; entity + actor indexes |
| `events` | Canonical first-party event stream | unique `dedup_key` idempotency seam; FKs → members/groups |

Identity helpers (`current_member_id()`, `is_admin()`, `is_owner()`) are
`SECURITY DEFINER` functions with pinned search paths, so policies consult
membership without granting broad table access.

### RLS policy matrix (deny by default — anything not listed is denied)

| Table | anon | authenticated (member) | authenticated (admin) | authenticated (owner) | service_role (server-only) |
| --- | --- | --- | --- | --- | --- |
| `members` | none | SELECT own row (all columns except `notes_admin`); UPDATE own `first_name`/`last_name`/`email`/`instagram_handle` | + SELECT all rows | same as admin | full (bypasses RLS) |
| `community_groups` | SELECT `active`+`public` | SELECT `active`+`public` | + SELECT all rows | + INSERT/UPDATE | full |
| `onboarding_submissions` | none | none | none (server-rendered surfaces use the service path) | none | full |
| `consent_events` | none | SELECT own rows | (own rows only — matrix lists no admin client read) | same | INSERT only — **UPDATE/DELETE revoked even for service_role** |
| `audit_log` | none | none (0 rows) | SELECT all | SELECT all | INSERT only — **UPDATE/DELETE revoked even for service_role** |
| `events` | none | none | none | none | full (writes + retention purges) |

Mechanics worth knowing:

- **Fail closed:** `onboarding_submissions` and `events` have RLS enabled and
  zero client policies/grants — any client access is a hard permission error.
- **Append-only is mechanical, not conventional:** UPDATE/DELETE/TRUNCATE are
  revoked on `consent_events` and `audit_log` for every app role including
  `service_role` (grants are not bypassed by BYPASSRLS).
- **Column-level limits:** `members.notes_admin` is excluded from the
  `authenticated` column grant entirely. Because column grants are per
  Postgres role (not per member/admin), admins read notes only through
  privileged server paths — consistent with the architecture's
  "server-rendered admin surface" rule.
- **No DELETE policy exists on any table for client roles**; groups archive,
  members anonymize.

### Supabase client boundaries (`src/lib/supabase/`)

| Module | Configuration | Guard |
| --- | --- | --- |
| `browser.ts` | anon key, browser | lazy singleton; public env only |
| `server.ts` | anon key + request cookies (RLS as the signed-in user) | `server-only` import |
| `service.ts` | service-role key, deliberate RLS bypass | `server-only` import; sole reader of `SUPABASE_SERVICE_ROLE_KEY`; per-call creation (never at build); every future call site requires a justification comment |

Three layers keep the service key out of browsers: the `server-only` package
turns any client-side import into a build error; ESLint blocks shared-UI and
content modules from importing privileged clients; and `npm run test:bundle`
(part of `validate`, run in CI) scans every built client chunk for
service-role markers and fails the build on a hit.

Environment validation (`src/lib/supabase/env.ts`) names the offending
variable in every failure without ever echoing values, requires https (http
for localhost only), rejects a service key equal to the anon key, and rejects
any `NEXT_PUBLIC_`-prefixed service key outright.

### Environment-variable matrix

| Variable | Local dev | CI | Preview (Vercel) | Staging | Production | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | unset | preview URL | staging URL | prod URL | existing |
| `NEXT_PUBLIC_SUPABASE_URL` | CLI-local or staging URL | unset (not needed) | **staging** project URL | staging project URL | production project URL | previews must never point at production |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | matching anon key | unset | staging anon key | staging anon key | production anon key | RLS-constrained, client-safe |
| `SUPABASE_SERVICE_ROLE_KEY` | local service key (CLI-generated) | **never** | staging service key | staging service key | production service key | server-only; read by one module |
| `SUPABASE_DB_URL` | `postgresql://postgres@localhost:55432/postgres` | disposable service container | never | never | never | harness/CI only; reset script refuses non-local hosts |

### Tests

- `tests/db/schema.test.ts` — six spine tables exist; RLS enabled on every
  `public` table; zero client policies on server-only tables; UPDATE/DELETE
  revoked on append-only tables; documented unique indexes; `updated_at`
  trigger behavior; helper functions present.
- `tests/db/rls.test.ts` — the full behavior matrix: anon denial + public
  group reads; member own-row/own-consent isolation (including the
  `notes_admin` column denial and zero-row cross-member updates); admin
  read-everything without owner write; owner group-write success; service-role
  server writes; append-only enforcement against the service role itself.
- `tests/db/constraints.test.ts` — uniqueness (phone, case-insensitive email,
  slug, event dedup key), CHECK constraints (E.164, role/status enums, slug
  shape, audit actor presence, consent subject presence), FK failures, and the
  member-with-consent-history delete block.
- `tests/unit/supabase-env.test.ts` — environment validation acceptance and
  rejection paths.
- `npm run test:bundle` — post-build assertion that no client chunk contains
  service-role material.

Tests impersonate real Postgres roles (`SET LOCAL ROLE` + the
`request.jwt.claims` GUC that `auth.uid()` reads) inside rolled-back
transactions — behavior tests, not source-grepping.

### CI

`.github/workflows/ci.yml` gains a `database` job: a disposable `postgres:16`
service container, `npm run db:reset` (shim → all migrations from zero →
seed), then `npm run db:test`. The existing `validate` job now ends with the
client-bundle assertion. No production or staging credentials exist in CI.

## Deployment order (owner runbook, when credentials exist)

1. Create the **staging** Supabase project → `npx supabase link --project-ref
   <staging-ref>` → `npx supabase db push` → verify with the dashboard.
2. Set staging env vars in Vercel (preview + staging environments).
3. Create the **production** project → link → `db push` → set production env
   vars in Vercel (production environment only).
4. From then on, every schema change is a new migration file pushed through
   the same staging-first order. Never edit applied migrations; never make
   dashboard-only schema changes.

## Owner actions still required (M3 remote half)

1. Create the Supabase organization + **staging** and **production** projects.
2. Put the three per-environment values into Vercel: `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (per the matrix
   above — previews get **staging** values, never production).
3. Run the deployment order above (`supabase db push` to staging, then prod).
4. No app code change is needed when this happens — clients read env lazily.

## Deviations from source-of-truth documents (recorded, deliberate)

1. **`events.referral_link_id` deferred to M5** with the `referral_links`
   table itself, so the column and its FK land together (no dangling
   unconstrained column). The implementation plan defers referral tables; the
   data-model lists the column — the narrower reading wins.
2. **Role checks use `SECURITY DEFINER` helpers, not JWT claim mirroring.**
   `identity-and-authorization.md` mentions roles "mirrored into JWT claims";
   claim mirroring requires a Supabase auth hook configured per project
   (remote, owner-gated). The definer functions implement the same
   authorization semantics reversibly; claims can replace them later without
   policy rewrites.
3. **Admin client-side reads of `consent_events` are not granted** — the
   data-model's RLS line lists only member-own reads; the broader
   identity-matrix "admin reads all" is satisfied through privileged server
   paths. Narrowest implementation preserving security, per instructions.
4. **`members.notes_admin` is column-revoked for all authenticated users**
   (admins included) because Postgres column grants can't distinguish member
   from admin within the `authenticated` role; admin notes access goes through
   server-rendered privileged paths.

## Explicitly not in M3

Referral/membership/points/invite-link tables (each arrives with its feature
milestone), onboarding UI, auth UI/flows, admin surfaces, analytics wiring,
seeding of group content (M4), and any public page reading from the database.
