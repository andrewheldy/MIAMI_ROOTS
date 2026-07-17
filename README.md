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
- **`src/`** — the Next.js application (App Router, TypeScript) — **foundation shell built (M1)**
- **`public/`** — brand assets, community group logos, social share images, generated QR codes
- **`supabase/`** — database migrations, seed data, and edge functions — **not yet built**
- **`scripts/`** — operational and developer scripts — **not yet built**
- **`tests/`** — unit, integration, and end-to-end tests — **unit runner set up (M1); more added per milestone**

## Current project stage

**Milestone 2 public gateway implemented locally; acceptance and preview deployment are
open.** The repository now contains a branded, multi-page public experience for community
discovery, impact, partnerships, involvement, guidelines, and the future access model.
It remains deliberately database-free: no application data is captured, no authentication
or Supabase integration exists, and no WhatsApp invite link is public. Later MVP workflows
described in the docs are not live.

## Stack

Installed and in use as of Milestone 1:

- **Next.js 15** (App Router) with **TypeScript 5** (strict)
- **React 19**
- **Tailwind CSS 4** (CSS-first, provisional design tokens)
- **ESLint 9** (flat config) + **Prettier 3**
- **Vitest 3** — unit-test runner

Intended for later milestones (not yet installed or wired):

- **Supabase** — Postgres, authentication, storage, row-level security
- **Vercel** — deployment
- **WhatsApp** as the initial community communication layer

Mobile-first, responsive web application throughout.

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

## Local development

Requirements: **Node.js ≥ 18.18** and **npm**.

```bash
npm install                 # install dependencies
cp .env.example .env.local  # create local env (values are placeholders for now)
npm run dev                 # start the dev server at http://localhost:3000
```

### Available scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint over the project |
| `npm run typecheck` | TypeScript type check (`tsc --noEmit`) |
| `npm run test` | Run the Vitest unit suite once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run format` | Format app code with Prettier |
| `npm run format:check` | Verify formatting without writing |
| `npm run validate` | `format:check` → `lint` → `typecheck` → `test` → `build` |

### Environment variables

Copy [`.env.example`](.env.example) to `.env.local`. Only `NEXT_PUBLIC_SITE_URL` is used by
the current shell; the Supabase variables are placeholders reserved for the milestone that
introduces the database and are intentionally left blank. Never commit real secrets — see
[`CLAUDE.md`](CLAUDE.md).

### Project structure

```
src/
├── app/            App Router: public pages, layout, loading/error/not-found
├── components/
│   └── layout/     Header, footer, and the Container layout primitive
├── config/         Central site configuration (provisional copy)
├── lib/            Small shared utilities
├── styles/         Global stylesheet + provisional design tokens
├── features/       Community content, cards, homepage, and matching guide
└── types/          (empty) cross-feature shared types
tests/
└── unit/           Vitest unit tests
```

Design tokens (colors, typography, radii) live in
[`src/styles/globals.css`](src/styles/globals.css) as **provisional** values — the palette
is a strong candidate but is not yet a ratified brand decision (see
[`docs/04-design/brand-foundation.md`](docs/04-design/brand-foundation.md) and the decision
log). Change them there, in one place, rather than hard-coding colors in components.

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

- Only the application foundation shell exists (M1) — no product features yet.
- No database schema or migrations exist yet.
- Ticket resale/exchange is explicitly **out of scope** for the initial community groups
  (see [`docs/00-context/community-groups.md`](docs/00-context/community-groups.md)); it is
  noted as a possible future, separate group only.
- No clinical, treatment, or medical recovery services are offered — Sober Social is a
  peer social space, not a treatment program.
- No public member directory, events/RSVP system, or partner offers exist yet — these are
  future phases (see [`docs/02-planning/roadmap.md`](docs/02-planning/roadmap.md)).
