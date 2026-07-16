# Supabase

This directory will hold the Supabase project's local configuration, database migrations,
seed data, and edge functions once implementation begins.

- **`migrations/`** — SQL migrations. Once a migration has been applied anywhere (locally
  shared, staging, or production), it must not be edited — write a new migration instead.
  See `CLAUDE.md` / `AGENTS.md`.
- **`seed/`** — seed data for local development.
- **`functions/`** — Supabase Edge Functions.

Nothing exists here yet — no schema has been designed. See
`docs/03-architecture/data-principles.md` for the principles the eventual schema must
respect, and `docs/08-delivery/implementation-plan.md` for current phase status.
