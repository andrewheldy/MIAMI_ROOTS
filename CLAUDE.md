# Instructions for Claude Code

This file governs how Claude Code (and equivalent coding agents) should work in this
repository. It is durable — it should stay true across many future sessions, not just the
current phase of work. Tool-agnostic instructions live in [`AGENTS.md`](AGENTS.md); this
file adds Claude-specific detail without repeating all of it.

## Before changing anything

- Read `docs/00-context/` and `docs/07-decisions/decision-log.md` before writing product
  code or making a product/architecture decision. Context you don't have yet is context you
  can get wrong.
- Check `docs/02-planning/open-questions.md` — if what you're about to build depends on an
  open question, don't silently resolve it in code.
- Check the current phase in `docs/08-delivery/implementation-plan.md`. Do not implement
  work that belongs to a later phase just because it seems related or convenient.

## Decision discipline

- **Do not invent product decisions silently.** If a requirement is ambiguous or missing,
  either ask, or record an explicit, labeled assumption in
  `docs/00-context/assumptions.md` and proceed cautiously — never bury a guessed decision
  inside code or a commit message as if it were settled.
- **Record material architectural decisions** in `docs/07-decisions/decision-log.md` when
  you make them (new dependency, schema shape, auth approach, third-party integration,
  etc.). A decision that only exists in a diff is a decision that will be silently reversed
  by the next person who doesn't know it was deliberate.
- Preserve the distinction between **facts** (verified, currently true), **assumptions**
  (unverified, stated as such), **proposals** (options under consideration), and
  **decisions** (made, with a reason and a date). Don't let language drift blur these — a
  proposal described in confident, factual language becomes a false decision in the next
  person's mind.

## How to work

- Prefer small, verifiable changes over large speculative ones. If a task naturally splits
  into independent pieces, land them separately rather than as one large diff.
- Do not implement work outside the assigned phase or task, even if you notice something
  else that "should" be done. Note it (in an open question, a decision-log entry, or by
  telling the user) instead of doing it unprompted.
- Validate your own work before reporting completion: run the relevant checks (lint, type
  check, tests, build) that exist at the time, and actually look at what changed. Do not
  report a task as done based on intent rather than verification.
- Update relevant documentation in the same change when behavior, scope, or decisions
  change. Docs that drift from reality are worse than no docs.

## Secrets and environment

- **Never expose secrets.** Never print, log, commit, or echo real credentials, API keys,
  tokens, or service-role keys — including into commit messages, docs, or chat output.
- Keep `.env.example` limited to variable **names** and safe, obviously-fake example values
  (or blank). Never add a real value to `.env.example`, even temporarily.
- If you ever encounter a real secret in the repo, history, or a message, treat it as
  compromised: flag it to the user immediately rather than working around it silently.

## Database

- **Do not edit migrations after they have been applied.** Once a migration has shipped
  (merged, run against any shared environment), write a new migration to change its effect
  instead of editing it in place. Only migrations that have never been applied anywhere are
  safe to edit.

## Scope for this current phase

**Milestone 2 (public branded gateway) is complete**, Milestone 2.5 (the `/join`
shareable hub) is merged (PR #7), and **Milestone 3's local half (database & security
foundation) is merged (PR #8)**: the six-table spine schema with
deny-by-default RLS lives in `supabase/migrations/`, the three Supabase client
boundaries in `src/lib/supabase/`, and CI replays migrations from zero with RLS tests
(see `docs/08-delivery/milestone-3-database-foundation.md`). M3's **remote half is
owner-gated**: hosted Supabase projects, `db push`, and Vercel keys do not exist yet.
**No public page reads the database** — the site renders from the typed in-code content
module (`src/content/groups/`), and moving content into the DB is Milestone 4. Do not
build M4 (DB-backed content), M5 (referral capture), or anything beyond unless
explicitly asked to move into that phase — check
`docs/08-delivery/implementation-plan.md` for the current phase before assuming
otherwise. Database rules that now apply: never edit an applied migration; every new
table ships with RLS enabled and minimum policies; the service-role key is read only by
`src/lib/supabase/service.ts`.

As of 2026-08-03 an owner-directed **Founding Connectors program** also landed out of
sequence: `/connectors`, the nomination intake flow, the `/r/<code>` tracked card redirect,
and a `connectors` + `connector_nominations` migration. **It is not Milestone 5** —
connector cards and member referral links are separate systems (see
`docs/08-delivery/founding-connectors-mvp.md` and the 2026-08-03 decision-log entry), and
this pass sets no attribution cookie and does not advance M4/M5/M6. Rules it adds: the card
registry in `src/content/connectors/` holds **no** contact details and only owner-approved
entries; connector codes are permanent and never reused; connector destinations stay a
closed union of *internal* targets, so `/r/` can never become an open redirect; and no
nomination or scan is ever reported as stored unless it really was.

As of 2026-08-16 an owner-directed **community-first redesign** rebuilt the public gateway
(see `docs/08-delivery/community-first-redesign.md` and the 2026-08-16 decision-log
entries). It is **not a milestone** and advances no database work. Rules it adds, all of
them load-bearing:

- **One call to action.** The site has exactly one: `joinNavLink` in `src/config/navigation.ts`,
  pointing at `/go/community`, rendered through `JoinAction`. Do not add a second "join"
  intent, a second label, or a second WhatsApp destination.
- **Never link into an individual chat.** The `/go/<chat>` routes stay alive for links
  already printed in the world, but no page may link to them. `tests/unit/gateway.test.tsx`
  enforces this; if you need to reverse it, that is an owner decision (Q#19), not a
  component change.
- **`WHATSAPP_COMMUNITY_URL` is a credential**, exactly like the seven chat variables.
  Server-only, validated against the approved hosts, never committed.
- **No em-dashes in user-facing copy.** Adopted from `taste-skill`, enforced by test on the
  gateway surfaces. Code comments and docs are unaffected.
- **Never claim points, credit, or tracking that does not exist.** The rewards line states
  intent and says plainly that nothing is counted. No points system is built.
- **Design work follows `docs/DESIGN_INTELLIGENCE.md`**: read it first, honor its exceptions
  §7, write a brief before building, and run the reviewers its §5 routing selects. Nothing
  from the canonical repository is installed, copied, or vendored here.

When extending the app: public group content lives in `src/content/groups/` (data-only,
separate from components) and must stay public-safe — never add invite links, phone
numbers, or other private community data. Design tokens are provisional and centralized in
`src/styles/globals.css` — change brand values there, not inline. All user-facing copy and
the mint/forest palette remain **provisional** pending an owner voice pass and palette
ratification (Q#9/Q#10).
