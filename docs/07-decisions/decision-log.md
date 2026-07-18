---
title: Decision Log
type: decisions
status: active
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [decisions]
---

## Purpose

The durable, append-only record of material product and architecture decisions: what was
decided, when, and why. Once an entry is added it should not be silently rewritten — if a
decision is reversed, add a new entry marking the old one superseded.

## What belongs here

- A decision, its date, its rationale, and its status
- A pointer to any decision it supersedes

## What does not belong here

- Open, undecided questions (see `docs/02-planning/open-questions.md`)
- Working assumptions not yet confirmed as decisions (see
  `docs/00-context/assumptions.md`)

## Known initial information

### 2026-07-16 — Repository structure and documentation system adopted

**Decision:** Establish the canonical `miami-roots` repository structure (docs, src,
public, supabase, scripts, tests, .github scaffolding) as specified at project founding,
with documentation-first content and no application code yet.

**Rationale:** Gives future implementation work (human or agent) a predictable, navigable
structure and enough context to avoid re-deciding settled things or silently inventing
unsettled ones.

**Status:** Active.

### 2026-07-16 — Proprietary "All Rights Reserved" license, not open source

**Decision:** License the repository under an all-rights-reserved proprietary notice
rather than an OSS license (MIT, Apache, etc.).

**Rationale:** Miami Roots is a private community product, not an open-source project, at
this stage. This can be revisited later if there's ever a reason to open-source part of
the codebase.

**Status:** Active.

### 2026-07-16 — Concept brand assets committed as provisional

**Decision:** Commit the primary Miami Roots mark and four group-concept marks (Sober
Social, Daytime Events, Nightlife & Event Marketing, and a future Ticket Exchange concept)
into `public/brand/` and `public/group-logos/`, and document them in
`docs/04-design/asset-register.md`, despite not being confirmed as final brand assets.

**Rationale:** These are the only concrete brand assets that exist; committing and
documenting them (marked clearly as provisional/unconfirmed) is more useful than omitting
them and leaves an honest trail for whoever finalizes the brand.

**Status:** Active. Superseding entry expected once a real brand guide is confirmed.

### 2026-07-16 — Canonical asset organization and private `inputs/` convention

**Decision:** Adopt the canonical asset layout `public/brand/logos/`,
`public/brand/banners/`, `public/group-logos/`, `public/group-banners/`, `public/social/`,
`public/qr/`, with lowercase kebab-case filenames ending in a role suffix
(`…-logo.<ext>`, `…-banner.<ext>`). The five founding assets were renamed accordingly via
`git mv` with pixel content untouched (`miami-roots-primary-logo.png` →
`brand/logos/miami-roots-logo.png`; group logos gained `-logo` suffixes;
`future-ticket-exchange.png` → `ticket-exchange-logo.png`, still future-scoped per
`docs/01-product/out-of-scope.md`). Additionally, a private `inputs/` tree
(`brand-assets/`, `whatsapp-exports/`, `screenshots/`) is excluded from Git
(`inputs/*` with only `inputs/README.md` tracked) and is the only permitted location for
WhatsApp screenshots, chat exports, and unapproved design sources.

**Rationale:** Stable, predictable asset paths before any application code references
them, and a hard structural boundary that keeps private community material (phone numbers,
invite links, conversations) out of Git history by default rather than by per-file
vigilance. Registers were added so both sides stay accounted for:
`docs/04-design/asset-register.md` (+ `subgroup-asset-inventory.md`) for public assets,
`docs/00-context/source-material-register.md` (+ `whatsapp-community-inventory.md`) for
private material.

**Status:** Active.

### 2026-07-16 — MVP architecture plan adopted as the planning baseline

**Decision:** Adopt the 2026-07-16 MVP architecture and implementation plan as the
baseline for Phase 1: the document set under `docs/03-architecture/` (identity &
authorization, data model, referral system, analytics & events, application
architecture, plus updated system context / data principles / privacy & safety /
integrations), the product specifications (`onboarding-specification.md`,
`community-content-requirements.md`, updated referral/rewards concept), the operational
workflows (`docs/05-operations/`), and the 16-milestone delivery plan
(`docs/08-delivery/implementation-plan.md`) with MVP boundary M1–M12 + M14–M15 and
reward *redemption* deliberately post-MVP.

**Rationale:** The plan is internally consistent, assumes the pessimistic WhatsApp
reality (no programmatic join signals; manual verification), keeps invite links
server-only with gated, audited reveal, and preserves the founding data principles
(append-only ledger, correctable attribution, deny-by-default RLS, manual operability).

**Explicitly NOT decided by this entry:** every item marked *recommended default* in
`docs/02-planning/open-questions.md` (auth model, onboarding fields, verification
procedure, point values, attribution/retention windows, analytics vendor, naming
question #10). Those remain proposals until the owner ratifies them at the decision
gates named in the implementation plan; this entry only establishes them as the working
baseline for planning and sequencing.

**Status:** Active. Implementation may not begin until the owner explicitly authorizes
Milestone 1.

### 2026-07-16 — Banner, moodboard, and artistic-logo concepts committed as classified references

**Decision:** Commit the three owner-supplied images of 2026-07-16 with the owner's
classifications: the horizontal community banner as a *parent-brand community banner
concept* (`public/brand/banners/miami-roots-community-banner.png`), the brand moodboard as
a *visual-direction reference* (`public/brand/moodboards/miami-roots-brand-moodboard.png`),
and the artistic tree illustration as a *secondary artistic logo concept*
(`public/brand/logos/concepts/miami-roots-artistic-tree-logo.png`) that does not replace
the approved primary logo. This extends the canonical asset layout with
`public/brand/moodboards/` and `public/brand/logos/concepts/`, and establishes the
convention that generated/exploratory artwork always lives in a `concepts/` subfolder (or
`moodboards/`), never alongside approved source assets — future banner concepts go in
`public/brand/banners/concepts/`, future moodboard explorations in
`public/brand/moodboards/concepts/` (created when first needed).

Two implementation notes: the files were committed **byte-identical** to the uploads
(checksums verified, no re-encoding), and the moodboard/artistic-logo filenames use
`.png` — not the `.jpg` the owner's instruction suggested — because the supplied files are
PNG and the standing rule is to preserve actual formats rather than convert.

**Rationale:** These are owner-classified official visual references; committing them with
their classification explicit (concept/reference vs. approved production) keeps the
distinction from eroding, and a hard folder boundary between approved assets and concepts
prevents accidental production use of unapproved artwork.

**Status:** Active. The palette stated on the moodboard (`#96D2C9` mint / `#003F2C`
forest green) remains **unratified** — see `docs/04-design/brand-foundation.md`; banner
production use awaits owner sign-off.

### 2026-07-16 — Milestone 1 stack ratified and application foundation bootstrapped

**Decision:** Ratify the Milestone 1 application stack and bootstrap the Next.js
application foundation at the repository root (App Router under `src/app`). Ratified
versions: **Next.js 15, React 19, TypeScript 5 (strict), Tailwind CSS 4, ESLint 9 (flat
config), Prettier 3**, with **npm** as the package manager. This resolves the M1 "ratify
stack versions" decision gate in `docs/08-delivery/implementation-plan.md`.

Two supporting choices worth recording:

- **Vitest** was selected as the unit-test runner. The testing strategy and implementation
  plan called for "a unit-test runner + one trivial test" at M1 but named no specific tool;
  Vitest was chosen for its speed, native ESM/TypeScript support, and minimal configuration.
  One smoke test covers the `cn` class-name utility.
- **ESLint is run directly** (`eslint .` via flat config), not through the deprecated
  `next lint` wrapper, keeping the setup forward-compatible with newer Next.js.

**Rationale:** These are the current mutually-compatible stable versions of exactly the
stack the founding brief and architecture docs already committed to — no framework or UI
library was added beyond it. Bootstrapping the shell (layout, homepage, header/footer,
`Container` primitive, loading/error/not-found foundations, design tokens, quality scripts)
gives later milestones a validated base without pre-building any product feature.

**Explicitly NOT decided by this entry:** the brand palette remains **unratified** — the
mint `#96D2C9` / forest `#003F2C` pair is used only as **provisional** design tokens
centralized in `src/styles/globals.css` (see open question #9 and the 2026-07-16
banner/moodboard entry above). No product feature, database schema, authentication, or
Supabase wiring was implemented. CI (`.github/workflows`) and the Vercel preview deploy
named in M1's acceptance criteria remain owner/infra tasks.

**Status:** Active.

### 2026-07-16 — Milestone 2 public gateway delivered on a typed in-code content model

**Decision:** Build the Milestone 2 public branded gateway — landing page, `/groups`
directory, statically generated `/groups/[slug]` detail pages, and a `/guidelines` page —
mobile-first, with public group content sourced from a **typed in-code content module**
(`src/content/groups/`) rather than a database. Add a small set of Server-Component UI
primitives (`src/components/ui/`: `Section`, `SectionHeading`, `Badge`, `Notice`,
`EmptyState`, `GroupLogo`, `CommunityCard`, `ActionLink`) and give the header/footer real
navigation. Also complete the two deferred M1 infrastructure items: a GitHub Actions CI
workflow (`.github/workflows/ci.yml`, running `npm run validate`) and Vercel readiness
(verified build with no config overrides; **no `vercel.json` added**). Full detail:
`docs/08-delivery/milestone-2-public-gateway.md`.

Content decisions worth recording:

- **Six MVP groups only; Ticket Exchange deliberately excluded** (out of scope per
  `docs/01-product/out-of-scope.md`), despite the prompt listing ticket exchange as a
  likely vertical — the repository is the source of truth. A test enforces its absence.
- **Three groups render a monogram fallback** (no logo asset yet); the card design never
  assumes a logo exists.
- **`dynamicParams = false`** on the group route so unknown slugs return real 404s.

**Rationale:** The content module is the deliberate interim named in the M2 plan; its field
shape mirrors the planned `community_groups` row so M4 is a data lift, not a redesign. CI
reuses the repo's own combined gate with no bespoke logic. Keeping components to justified
primitives avoids a component-library explosion.

**Explicitly NOT decided by this entry:** the brand palette (Q#9) and group display names
(Q#10) remain **provisional**; all gateway copy is provisional pending an owner voice pass;
no branded webfont was adopted (system stack retained); the site stays `noindex, nofollow`
and the indexed-vs-noindex launch choice remains open; the parent banner concept was **not**
adopted as production hero art. No database, authentication, Supabase, analytics, or private
WhatsApp data were introduced.

**Status:** Active.

## Relationship to other documents

- `docs/00-context/assumptions.md` — precursor to decisions recorded here
- `docs/02-planning/open-questions.md` — precursor questions that become decisions here
