# Supabase

The database foundation for Miami Roots (Milestone 3): local configuration,
versioned SQL migrations, and seed data. The authoritative design documents are
`docs/03-architecture/data-model.md`, `identity-and-authorization.md`, and
`application-architecture.md`; the delivery record with the full RLS matrix and
environment-variable matrix is
`docs/08-delivery/milestone-3-database-foundation.md`.

## Layout

- **`config.toml`** — Supabase CLI configuration for local development.
- **`migrations/`** — versioned SQL migrations, applied in filename order.
  Once a migration has been applied anywhere shared (locally shared, staging,
  or production), it must not be edited — write a new migration instead
  (`CLAUDE.md` / `AGENTS.md`).
- **`seed/seed.sql`** — local/staging seed. Empty of data in M3 (group content
  arrives in M4). **Never** contains invite links, phone numbers, or any
  private community data.
- **`functions/`** — Supabase Edge Functions (none yet).

## Two ways to run the database

### 1. Supabase CLI (owner machines, full local stack — needs Docker)

```sh
npx supabase start        # local Postgres + Auth + API + Studio
npx supabase db reset     # replay ./migrations from zero, then seed
```

### 2. Plain-Postgres harness (CI, sandboxes — no Docker needed)

```sh
npm run db:start          # throwaway local Postgres cluster on :55432
export SUPABASE_DB_URL=postgresql://postgres@localhost:55432/postgres
npm run db:reset          # shim + all migrations from zero + seed
npm run db:test           # schema / RLS / constraint security suite
npm run db:validate       # reset + test in one go
npm run db:stop
```

The harness first applies `scripts/db/supabase-shim.sql`, which recreates the
minimum Supabase baseline (the `anon`/`authenticated`/`service_role` roles,
the `auth` schema with `auth.uid()`, and Supabase's default table privileges)
so migrations and RLS behave exactly as they do on the platform. The shim is a
test fixture, **never** a migration. `db:reset` refuses non-local hosts by
design — hosted projects are only ever migrated via the Supabase CLI
(`npx supabase db push` / `db reset`).

## Migration workflow

1. Add a new file `supabase/migrations/<UTC timestamp>_<name>.sql`. Never edit
   an applied migration.
2. Every new table starts with `enable row level security` plus explicit
   `revoke`/`grant`s — deny by default, minimum policies per the matrix in
   `docs/03-architecture/identity-and-authorization.md`. Tables with no
   client-facing purpose get **no** client grants or policies at all.
3. `npm run db:validate` must pass locally (replays everything from zero).
4. CI's `database` job repeats the same from-zero replay + security suite on
   every PR.
5. Deployment to hosted projects (owner): staging first, then production —
   `npx supabase link --project-ref <ref>` + `npx supabase db push`.

## Secret handling

No real credential ever appears in this directory, in migrations, in seeds, or
in CI. `SUPABASE_DB_URL` in CI points at a disposable service container. The
service-role key lives only in server-side environment configuration and is
read by exactly one module (`src/lib/supabase/service.ts`).
