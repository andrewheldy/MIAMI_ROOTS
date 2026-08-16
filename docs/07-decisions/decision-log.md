---
title: Decision Log
type: decisions
status: active
owner: unassigned
created: 2026-07-16
updated: 2026-08-03
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

### 2026-07-18 — Milestone 2.5 shareable hub: `/join` page and env-based `/go` redirects

**Decision:** Ship a "Milestone 2.5" shareable community hub at `/join` — a standalone,
mobile-first, link-in-bio-style page (cinematic hero, stacked chat links, Web Share/copy
control, guidelines note, compact footer) — plus controlled redirect routes
`/go/<slug>` for six chats (`general-chat`, `business-connections`, `daytime-events`,
`nightlife-events`, `community-organizing`, `sober-support`; Ticket Exchange stays
excluded). Key mechanics:

- **Invite links live only in server environment variables**
  (`WHATSAPP_*_URL`, one per chat), read per-request (`force-dynamic`) so rotation is a
  hosting-config change with no rebuild and nothing in Git history — consistent with the
  interim posture in `docs/05-operations/chat-link-management.md` (the full
  server-store + audited reveal design remains Milestone 3+).
- **Redirects are validated** (HTTPS only, exact-hostname allowlist of WhatsApp domains)
  and fall back to a branded "unavailable" page when a variable is missing or invalid;
  `/go` responses carry `X-Robots-Tag: noindex` and `Referrer-Policy: no-referrer`.
- **The registry is data-only** (`src/content/join/chat-links.ts`): redirect slug → group
  slug → env-var name, no URLs, enforced by tests. Hub cards reuse the existing group
  content module — no duplicated copy.
- **App restructured into a `(site)` route group** so `/join` and `/go` render without
  the global header/footer while every existing page keeps its chrome and URL.
- **Hero media is owner-suppliable, never fabricated:** the page probes for
  `public/media/miami-roots-hero.{mp4,webm}` and `…-poster.webp` at render time; absent
  video ⇒ poster only; absent poster ⇒ the committed community banner is used as the
  **interim** still. This is a deliberate, narrow production use of the banner concept on
  this one page until real footage arrives (see `docs/04-design/join-hero-media.md`) —
  it does not ratify the banner as general hero art.
- **Redirect slugs/env names follow the owner brief verbatim** even where they differ
  from group slugs (`sober-support` ↔ *Sober Social*, `nightlife-events` ↔ *Nightlife &
  Event Marketing*); display names stay the content model's (assumption #11, Q#10 open).

**Rationale:** The community needs one shareable, premium link now, before the M3+
database/auth foundation exists. Env-var-held links deliver the two properties that
matter at this scale — out of Git, easy rotation — without pulling any M3 scope forward.

**Explicitly NOT decided by this entry:** palette (Q#9) and group names (Q#10) remain
provisional; the site stays `noindex`; no database, auth, Supabase, or analytics; the
gated invite-reveal architecture of M3+ is unchanged and still pending.

**Status:** Active.

### 2026-07-18 — Milestone 3 database & security foundation (local scaffolding delivered)

**Decision:** Implement the M3 database foundation as owner-directed: versioned SQL
migrations for the six-table spine (`members`, `community_groups`,
`onboarding_submissions`, `consent_events`, `audit_log`, `events`) exactly as specified
by `docs/03-architecture/data-model.md`, with deny-by-default RLS per
`identity-and-authorization.md`; the three Supabase client configurations
(`src/lib/supabase/{browser,server,service}.ts`) per `application-architecture.md`;
environment validation that names variables without echoing values; a behavior-level
database security test suite; and a CI job that replays migrations from zero against a
disposable Postgres and runs the RLS matrix tests. Full detail:
`docs/08-delivery/milestone-3-database-foundation.md`.

Supporting choices worth recording:

- **Dependencies added (minimum required by the milestone):** `@supabase/supabase-js`,
  `@supabase/ssr`, `server-only` (runtime deps); `pg` + `@types/pg` (dev, test harness).
- **Plain-Postgres test harness alongside the Supabase CLI:** CI and Docker-less
  environments run migrations/tests against bare Postgres 16 via
  `scripts/db/supabase-shim.sql`, which recreates the platform baseline (roles,
  `auth.uid()`, default privileges). The shim is a test fixture, never a migration;
  owner machines use `npx supabase start` / `db reset` as designed.
- **Append-only is mechanical:** UPDATE/DELETE/TRUNCATE revoked on `consent_events`
  and `audit_log` for every app role *including* `service_role`.
- **Service-role confinement is triple-layered:** `server-only` import guard,
  ESLint `no-restricted-imports` for shared UI/content code, and a post-build client
  bundle scan (`npm run test:bundle`) wired into `validate` and CI.

**Deviations from the planning docs, deliberate and narrow** (full rationale in the
delivery record): `events.referral_link_id` lands in M5 with `referral_links` so column
and FK arrive together; role checks use `SECURITY DEFINER` helpers rather than JWT claim
mirroring (which needs per-project auth-hook configuration — semantics identical,
reversible); admin reads of `consent_events` and of `members.notes_admin` happen via
privileged server paths, not client-role policies.

**Explicitly NOT done (blocked on owner, recorded as the remote half of M3):** creating
the hosted staging/production Supabase projects, pushing migrations to them, and placing
real keys into Vercel env. No credentials existed in this environment; none were
fabricated, and no placeholder secrets were committed. **No user-visible change:** the
public site still renders from `src/content/groups/` (M4 moves content into the DB).

**Status:** Active.

### 2026-07-19 — Ticket Exchange approved as the seventh public community

**Decision:** Add **Ticket Exchange** as a first-class seventh Miami Roots
community, reversing its earlier out-of-scope status. It ships with group slug
`ticket-exchange`, the existing `public/group-logos/ticket-exchange-logo.png`
asset, a new `events` editorial category, and the controlled chat route
`/go/ticket-exchange` backed by the server-only `WHATSAPP_TICKET_EXCHANGE_URL`
variable — the same env-var-held, validated-redirect architecture as the other
six chats (2026-07-18 Milestone 2.5 entry). It appears everywhere the other
published communities do (groups directory, homepage preview, `/join`, its own
detail page), positioned with the event-oriented communities (after Nightlife &
Event Marketing) so it never displaces **General Chat** as the recommended front
door.

**Positioning & safety:** Ticket Exchange is a **peer-to-peer** space for members
to buy, sell, and exchange event tickets. Miami Roots is explicitly **not** a
ticket seller, broker, guarantor, escrow, or payment processor, and is not a
party to any transaction. A concise, reusable safety treatment (typed `safety`
block on the content model: a "Buy & sell safely" badge, a one-line summary, a
verification checklist, and a non-guarantee disclaimer) surfaces on the group
card, homepage preview, detail page, `/join` card, and the `/go/ticket-exchange`
unavailable state; the detail page carries the fuller version and a prominent
route to the community guidelines.

**Supersedes:** the 2026-07-16 Milestone 2 note "Six MVP groups only; Ticket
Exchange deliberately excluded" and the Ticket Exchange line in
`docs/01-product/out-of-scope.md`, both of which accurately described the prior
scope. This entry is the deliberate future decision those records anticipated.

**Rationale:** The community owner approved Ticket Exchange as an acquisition and
utility channel. It fills a real member need (last-minute tickets, passing on
tickets you can't use) that the standing "no ticket reselling" rule in Nightlife
& Event Marketing had no home for, while the safety treatment keeps Miami Roots'
"community, not a marketplace" posture intact.

**Explicitly NOT changed:** the Supabase schema, migrations, RLS, auth, and
service-role boundaries (this was a frontend/content pass); the palette (Q#9) and
provisional group display names (Q#10); the site's `noindex` status. Invite links
remain server-only — no raw WhatsApp URL entered code, client bundles, or Git.
The real `WHATSAPP_TICKET_EXCHANGE_URL` value is an owner/hosting task.

**Status:** Active.

### 2026-07-19 — Framer Motion (the `motion` package) adopted for restrained interaction

**Decision:** Add the official **`motion`** package (v12, `motion/react` imports —
React 19 compatible) as the site's one animation dependency, and build a small,
centralized motion system: shared easing/duration tokens
(`src/components/motion/tokens.ts`) and reusable `MotionReveal` / `StaggerReveal`
client wrappers, plus a client `MobileNav` and an animated `CommunityCard`. Motion
is confined to narrow client wrappers around server-rendered children so pages
stay Server Components; all of it respects `prefers-reduced-motion` (content
renders immediately with no replacement movement). Durations stay in the
160–600ms bands and use opacity/translate/scale only — no parallax, looping, or
decorative background motion.

**Rationale:** The navigation refactor and hierarchy improvements needed real
interaction feedback (menu open/close, hamburger morph, staggered entrances,
viewport reveals). One small, current library with first-class reduced-motion
support delivers that without a heavier framework, and centralizing the tokens
keeps the motion coherent instead of scattered.

**Status:** Active.

### 2026-07-19 — Community-share feature (owner-directed, DB-free QR/share)

**Decision:** Ship an owner-directed "Share Miami Roots" community-growth feature: a
homepage share prompt ("Grow the roots"), a polished accessible share modal, a
distraction-free full-screen scan view, and client-side downloadable assets (standard QR
PNG, 1080×1920 Instagram Story card, 1080×1080 square card). Every QR, link, and asset
points at the **stable, hardcoded production URL** `https://miami-roots.vercel.app/join`
with **non-personal campaign attribution** — never a raw WhatsApp invite link. Full detail:
[`docs/08-delivery/community-share-feature.md`](../08-delivery/community-share-feature.md).

Choices worth recording:

- **Scope pulled forward deliberately, without pulling M12's dependencies.** QR/sharing is
  nominally Milestone 12 (which depends on M11's per-member referral identities). Only the
  DB-free, non-personal half was built, on explicit owner request. It touches **no** Supabase
  schema, migration, RLS, environment variable, or WhatsApp link, so it does not enter M4/M5+
  scope or alter the gated-invite architecture. Per-member referral codes remain deferred to
  M5/M11 (the current DB/privacy design does not support them yet).
- **Zero-runtime-dependency QR encoder, written in-repo.** Rather than add an npm QR
  dependency, a small byte-mode QR encoder (ISO/IEC 18004) lives in `src/lib/qr/`. It is
  verified **bit-for-bit** against Project Nayuki's canonical MIT-licensed generator across
  eight known-answer vectors (multiple versions, ECC levels, and UTF-8), and the rendered
  PNGs were confirmed to decode back to the exact share URL. No third-party code is bundled;
  the reference implementation was used only to generate test fixtures. This matches the
  repo's established minimal-dependency posture.
- **Channel-tagged, non-personal attribution.** All shares carry
  `ref=community-share&utm_source=member_share&utm_campaign=miami_roots_growth`; `utm_medium`
  is `qr` for the codes (exactly as briefed), `web_share`/`copy_link` for the other channels.
  First-touch attribution landing on `/join` is captured to `sessionStorage` as a foundation
  the M5/M14 analytics-and-referral layer can later read — nothing reads it yet.
- **Stable website URL, never a WhatsApp link, in downloaded assets.** So printed/posted QR
  codes survive community-link rotations and deploys — the underlying chats can be re-pointed
  behind `/join` without invalidating a single card already in the wild.
- **Native Web Share with copy fallback; full a11y.** Uses the Web Share API where present and
  copies the link where not. Dialogs are focus-trapped with focus restoration, Escape-to-close,
  labelled controls, a polite live region for feedback, reduced-motion-safe animation, ≥44px
  touch targets, and no layout shift (SVG in a fixed-aspect box). Verified live in Chromium
  across desktop and mobile viewports.

**Explicitly NOT decided by this entry:** palette (Q#9) and group names (Q#10) remain
provisional; all share copy is provisional pending an owner voice pass; the site stays
`noindex`; no database, auth, Supabase, analytics vendor, or private WhatsApp data were
introduced; per-member referral identities remain deferred to M5/M11.

**Status:** Active.

### 2026-08-03 — Miami Roots Founding Connectors program (owner-directed)

**Decision:** Build the **Miami Roots Founding Connectors** program — an
invitation-led cohort of roughly 20–30 trusted Miami community members, each issued a
branded NFC + QR card pointing at a Miami Roots-owned tracked URL. Delivered as design
documentation plus a working MVP: the public `/connectors` page, a nomination intake flow,
the `/r/<code>` tracked redirect, and a `connectors` + `connector_nominations` migration.
Full engineering record:
[`docs/08-delivery/founding-connectors-mvp.md`](../08-delivery/founding-connectors-mvp.md);
program design:
[`docs/01-product/founding-connectors-program.md`](../01-product/founding-connectors-program.md).

Choices worth recording:

- **Connector cards are a separate system from M5 member referral links.** `referral_links`
  belongs to an onboarded, activated member and feeds the points ledger; a connector card is
  issued by the owner to a person who may never create an account and credits nothing
  automatically. Two tables, two lifecycles. When M5 arrives, a person may hold both, and
  the join is a nullable `member_id` added to `connectors` **then**, with its foreign key —
  the same discipline the M3 `events` migration applied to `referral_link_id`. This pass
  sets no attribution cookie and does not advance M4/M5/M6.
- **Open redirects are prevented by construction, not by validation.** A connector
  destination is a closed union of *internal* targets — an allowlisted page path, a
  validated group slug, or a validated `/go/<slug>` chat gate. No string from the request
  reaches the redirect target, and the database column additionally rejects absolute and
  protocol-relative values. Incoming query parameters are allowlisted to the known campaign
  keys; the four attribution keys Miami Roots owns are always overwritten, so a visitor
  cannot spoof how they arrived or who gets credit.
- **A disabled card still opens the community door, uncredited.** `paused`/`retired` cards
  redirect to the default destination with no `utm_content` and lose any per-card
  destination override; an *unissued* code 404s. Reasoning: a real person may be holding a
  real card, and a dead end punishes the wrong person — but a withdrawn connector must stop
  accruing credit. Codes are never reused, so a card in the wild can never begin crediting
  someone else.
- **NFC and QR are distinguished only by a printed parameter.** The chip writes
  `?s=n`, the printed code encodes `?s=q`; anything absent or unrecognized is recorded as
  `unknown`. Nothing is inferred from headers, and no fingerprinting is used.
- **Scan telemetry is deliberately thinner than the existing privacy floor allows.** A scan
  records the public card code, the source, whether it was credited, an optional campaign
  label, and a timestamp — and nothing else. No IP address (not even hashed), user agent,
  fingerprint, referrer, or geolocation. The existing design permits hashed network metadata
  only where an anti-abuse need is documented; a card scan has none. Consequently all
  reporting speaks in **taps, not people**, and a click may never be reported as a confirmed
  WhatsApp join.
- **The nomination flow never claims a submission it cannot store.** Because M3's hosted
  half is still owner-gated, no write path exists in any environment today, so `/connectors`
  renders an honest direct-contact route instead of a form. Where Supabase is configured the
  real form renders and really writes. Both branches are covered by tests.
- **A nomination collects exactly one person's contact details: the submitter's.**
  Nominating someone else records their name and public handle only — never a phone number
  or email for a person who has not been asked. `consent_to_contact` is constrained true at
  the database level, so a contact detail cannot be stored without permission.
- **No leaderboard, no public ranking by referral count**, consistent with the standing
  default in open question #13. Recognition is qualitative and human-observed, and public
  naming of a connector is opt-in per person and revocable.
- **The card registry lives in application content for now** (`src/content/connectors/`),
  mirroring the `connectors` row shape exactly, the same interim the group content module
  uses before M4. Everything committed is clearly fictional fixture data; real connectors are
  added one at a time with owner approval and hold no contact details, enforced by test.
- **Multi-city is kept possible without being built.** Codes are globally unique and
  city-agnostic, destinations are per-card and internal, and scan events carry the code — so
  a second city is a content and reporting change, not a redesign. No city columns, routing,
  or cross-city recognition were built.

**Explicitly NOT decided by this entry:** palette (Q#9), group names (Q#10), and all copy
remain provisional; no legal review has happened, and the "not employees / cannot bind"
language and consent copy are flagged as needing an attorney; the site stays `noindex`; no
hosted Supabase project, environment variable, WhatsApp link, analytics vendor, or real
personal data was introduced; cohort size, benefits, retention windows, and review cadence
are recommended defaults (assumptions 19), not owner decisions; whether `myroots.dev`
resolves to this deployment is unverified (assumption 16) and cards must not be printed
until it does.

**Status:** Active.

### 2026-08-16 — Community-first gateway: one door, no per-chat joining (owner-directed)

**Decision:** Rebuild the public gateway around a single call to action, the parent
WhatsApp **Community**, and turn the website into an explanation of what the community is
for rather than a directory of chats to click. Delivered as a full redesign of `/`,
`/join`, `/groups`, `/groups/[slug]`, `/guidelines`, plus a new `/invite` page. Full
engineering record:
[`docs/08-delivery/community-first-redesign.md`](../08-delivery/community-first-redesign.md).

**Context:** Owner direction, given as a spoken brief. The site had four competing calls to
action (join the community chats, explore the groups, join a specific chat, share Miami
Roots) and treated the seven WhatsApp groups as separately joinable products. The owner
wants people to join the community once, read the instructions, and invite their friends;
community leaders in particular join to bring their own people in and to reach each
other's.

**What this decides:**

1. **One destination.** `/go/community`, backed by the new server-only
   `WHATSAPP_COMMUNITY_URL` variable, is the only WhatsApp link the site points at. One CTA
   component, one label ("Join the community"), rendered by the header, the mobile sheet,
   every page close, and the footer.
2. **No per-chat joining from the site.** Every "Join chat" control was removed. The
   `/go/<chat>` routes stay alive because those paths were printed and pasted before this
   pass, but nothing on the site links to them, and a test fails if that ever changes.
   Reversing this is a decision, not a component quietly regaining a button (Q#19).
3. **Rooms are explained, not sold.** Two new content fields (`forYouIf`, `whyItExists`)
   and an editorial three-cluster grouping. Room copy rewritten throughout.
4. **The invite path is public and account-free.** New `/invite` page plus an invite panel
   on the home page: a live-generated QR, the plain link, a native share, a ready-to-send
   message, and the existing downloadable cards.
5. **The visible copyable link carries no campaign parameters.** What is displayed is
   exactly what is copied, because a member pastes it into a message by hand and four
   `utm_` parameters read like an ad. The QR and the native share sheet keep their existing
   campaign attribution, where it stays invisible. This narrows measurement slightly and
   does so knowingly.
6. **Rewards are stated as intent only.** The site says a way to credit people who bring
   others in is being worked out, says plainly that nothing is counted or tracked yet, and
   promises no mechanics, rates, or rewards. No points system was built, and M5/M10/M11 are
   unmoved. The public wording itself is now Q#18.
7. **The em-dash ban applies to user-facing copy.** Adopted from `taste-skill` rather than
   excepted, enforced by test on the redesigned surfaces. It does not apply to repository
   documentation, code comments, or commit messages.

**Explicitly NOT decided by this entry:** palette (Q#9), typeface (Q#9), and group names
(Q#10) remain provisional, and all copy remains provisional pending an owner voice pass; no
database, migration, RLS policy, hosted project, analytics vendor, or private WhatsApp data
was touched; M4, M5, and M6 are not advanced; the Founding Connectors program is unchanged;
the site stays `noindex`; and **no WhatsApp invite link entered this repository** — the
community link is read from hosting configuration at request time, exactly like the seven
chat links.

**Consequence the owner must act on:** until `WHATSAPP_COMMUNITY_URL` is set in hosting,
the site's one call to action renders its honest unavailable state on every page.

**Status:** Active.

### 2026-08-16 — Design Intelligence integration (project connection record)

**Decision:** Integrate this repository with the canonical
[`design-intelligence`](https://github.com/andrewheldy/design-intelligence) repository by
adding the required connection record at
[`docs/DESIGN_INTELLIGENCE.md`](../DESIGN_INTELLIGENCE.md), pinned to commit
`bf9b8b3b6997df3ab4d7958a9d1838d07c50470a` (registry v2, 2026-07-26), and to run design
work here through its workflow: brief, then build, then the reviewers its routing selects.

**Context:** The project had none of the four files that repository's integration contract
requires (§3), which means it was **not integrated**, and an agent doing design work here
was obliged to say so rather than proceed as if it were. The 2026-08-16 redesign was the
first design task large enough to make that worth fixing properly.

**What this decides:**

1. **Loadout.** `taste-skill` is the single opinion skill for the public gateway, which is
   a marketing surface and within that skill's own stated scope. `emil-design-skills` and
   the internal `motion-intelligence` family cover motion; `a11y-specialist-skills` backs
   the accessibility review. Never more than one opinion skill per task.
2. **Nothing is installed, synchronized, vendored, or submoduled.** The canonical
   repository is read over the network at the pinned ref. A human bumps the ref on
   re-review. No registry content is copied into this repository.
3. **Five standing exceptions** where this project's brand beats a skill directive: the
   system font stack (no typeface licensed, Q#9), no icon-library dependency, light theme
   only (palette unratified, Q#10), no stock or invented imagery on a site about real
   people, and typographic explanatory sections as a consequence of that. Recorded in the
   connection record §7 with review dates, so reviewers stop re-litigating them.
4. **The accessibility floor is not overridable** by brand or by any skill directive, and
   an accessibility failure is never recorded as a permanent exception.
5. **Reusable lessons travel back by pull request**, staged first in
   [`docs/04-design/design-findings.md`](../04-design/design-findings.md). This project
   never commits to the canonical repository's `registry.yaml`, `agents/`, or `skills/`.

**Explicitly NOT decided by this entry:** no design skill was installed into this
repository; no third-party skill text was copied here; the pinned ref has not yet been
confirmed by a human, which the connection record says out loud; and none of the exceptions
change the accessibility floor.

**Status:** Active.

## Relationship to other documents

- `docs/00-context/assumptions.md` — precursor to decisions recorded here
- `docs/02-planning/open-questions.md` — precursor questions that become decisions here
