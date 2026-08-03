# Instructions for coding agents

These are tool-agnostic working instructions for any coding agent (Claude Code, Codex,
Cursor, or otherwise) operating in this repository. Claude Code should also read
[`CLAUDE.md`](CLAUDE.md) for tool-specific elaboration — the two files should stay
aligned; this one is the shorter, portable version.

## Ground rules

1. **Read before you write.** Check `docs/00-context/` and
   `docs/07-decisions/decision-log.md` before making product or architecture decisions.
2. **Don't invent decisions silently.** Ambiguity gets flagged as a question or recorded as
   a labeled assumption in `docs/00-context/assumptions.md` — never guessed and shipped as
   if settled.
3. **Record material decisions** in `docs/07-decisions/decision-log.md` as you make them.
4. **Keep changes small and verifiable.** Prefer several small, reviewable changes to one
   large speculative one.
5. **Never expose secrets.** No real credentials in code, docs, commit messages, or output.
   `.env.example` holds variable names and safe placeholders only.
6. **Do not edit applied migrations.** Once a migration has run anywhere shared, change
   behavior with a new migration, not an edit to the old one.
7. **Validate before reporting done.** Run whatever checks exist (lint, types, tests,
   build) and actually inspect the result — don't report success from intent alone.
8. **Update docs alongside behavior changes.** A change that alters behavior without a
   matching doc update is incomplete.
9. **Stay inside the assigned phase or task.** See
   `docs/08-delivery/implementation-plan.md` for current phase. Noticing adjacent work is
   useful — doing it unprompted is not.
10. **Keep facts, assumptions, proposals, and decisions distinct** in anything you write.
    Confident phrasing on an unresolved question misleads the next reader (human or agent).

## Current phase

Milestone 2 (public branded gateway) and Milestone 2.5 (`/join` hub, `/go/<slug>` chat
redirects) are complete; **Milestone 3's local half** is delivered — the six-table spine
schema with deny-by-default RLS in `supabase/migrations/`, the three Supabase client
boundaries in `src/lib/supabase/`, and CI that replays migrations from zero. M3's **remote
half is owner-gated**: no hosted Supabase project, key, or database URL exists in any
environment. **No public page reads the database** — the site renders from the typed in-code
content module (`src/content/groups/`); moving content into the DB is Milestone 4.

Two owner-directed features landed outside the milestone sequence: the **community-share**
feature (2026-07-19) and the **Founding Connectors program** (2026-08-03 — `/connectors`,
the nomination flow, the `/r/<code>` card redirect, and a `connectors` +
`connector_nominations` migration). Neither is a licence to start M4/M5/M6. Do not begin
later-milestone work without explicit instruction. See
`docs/08-delivery/implementation-plan.md` for the authoritative current phase.
