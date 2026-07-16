# Miami Roots

Miami Roots is a private, community-oriented network based in Miami. It connects people
across business, nightlife, wellness, volunteering, sober socializing, hobbies, and local
community activities — organized primarily through a set of WhatsApp chats.

This repository is the canonical source for the Miami Roots product: its documentation,
its future codebase, and the operational context an engineer, designer, or agent needs to
work on it responsibly.

## What Miami Roots is

Miami Roots exists to help people in Miami build **real relationships** and **real
opportunities** through community — not through transactional networking. The guiding idea
is "together we rise": members are greater together than the sum of their parts, and a
stronger community should make life better for everyone in it, not just its founders.

See [`docs/00-context/vision-and-ethos.md`](docs/00-context/vision-and-ethos.md) for the
full framing and [`docs/00-context/community-groups.md`](docs/00-context/community-groups.md)
for the current chat structure.

## What this repository will contain

- **`docs/`** — product, design, architecture, operations, and decision documentation
- **`src/`** — the Next.js application (App Router, TypeScript) — **not yet built**
- **`public/`** — brand assets, community group logos, social share images, generated QR codes
- **`supabase/`** — database migrations, seed data, and edge functions — **not yet built**
- **`scripts/`** — operational and developer scripts — **not yet built**
- **`tests/`** — unit, integration, and end-to-end tests — **not yet built**

## Current project stage

**Repository foundation only.** This repository currently contains project documentation,
brand context, and a directory structure intended to make future implementation work
predictable for both human contributors and coding agents. **No application code, database
schema, or dependencies have been installed or written yet.** Do not assume any part of the
product described in these docs is live.

## Expected stack

- **Next.js** (App Router) with **TypeScript**
- **Tailwind CSS**
- **Supabase** — Postgres, authentication, storage, row-level security
- **Vercel** — deployment
- **GitHub** — source control
- Mobile-first, responsive web application
- **WhatsApp** as the initial community communication layer

Nothing here is installed yet — this section documents intent, not current state.

## Documentation map

Start at [`docs/README.md`](docs/README.md) for the full documentation index. Rough shape:

| Section | Contents |
|---|---|
| `docs/00-context/` | Why the project exists, its ethos, the community groups, glossary, assumptions |
| `docs/01-product/` | Product scope, user types, journeys, referral/rewards concept, guidelines |
| `docs/02-planning/` | Open questions and roadmap |
| `docs/03-architecture/` | System context, data principles, privacy/safety, integrations |
| `docs/04-design/` | Brand foundation, voice, information architecture, asset register |
| `docs/05-operations/` | Onboarding, verification, chat link management, moderation, rewards ops |
| `docs/06-research/` | Open research questions and source register |
| `docs/07-decisions/` | Architectural/product decision log |
| `docs/08-delivery/` | Implementation plan, testing strategy, release checklist |

## Future development setup (placeholder)

The application has not been scaffolded yet. Once it exists, this section will document
how to install dependencies, configure `.env.local` from [`.env.example`](.env.example),
run the dev server, and run tests. For now there is nothing to install or run.

## Contribution expectations

- Read the relevant docs before changing code or making product decisions — see
  [`CLAUDE.md`](CLAUDE.md) and [`AGENTS.md`](AGENTS.md).
- Prefer small, verifiable, reviewable changes over large speculative ones.
- Record material product or architecture decisions in
  [`docs/07-decisions/decision-log.md`](docs/07-decisions/decision-log.md).
- Never commit secrets. Keep [`.env.example`](.env.example) limited to variable names and
  safe placeholder values.
- Keep documentation and code in sync — if behavior changes, update the relevant doc in the
  same change.

## Current non-goals

- No application code exists yet — this is not a working product.
- No database schema or migrations exist yet.
- Ticket resale/exchange is explicitly **out of scope** for the initial community groups
  (see [`docs/00-context/community-groups.md`](docs/00-context/community-groups.md)); it is
  noted as a possible future, separate group only.
- No clinical, treatment, or medical recovery services are offered — Sober Social is a
  peer social space, not a treatment program.
- No public member directory, events/RSVP system, or partner offers exist yet — these are
  future phases (see [`docs/02-planning/roadmap.md`](docs/02-planning/roadmap.md)).
