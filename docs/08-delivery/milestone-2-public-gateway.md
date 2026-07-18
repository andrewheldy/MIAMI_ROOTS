---
title: Milestone 2 — Public Branded Gateway
type: delivery
status: active
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [delivery, milestone, gateway, content, brand]
---

## Purpose

Records what Milestone 2 delivered: the public branded gateway (landing page, group
directory, group detail pages, community guidelines), the typed in-code content model that
backs it, the reusable UI primitives, and the two Milestone 1 infrastructure-tail items
(CI and Vercel readiness). This is the implementation-facing companion to the milestone
entry in [`implementation-plan.md`](implementation-plan.md).

## Milestone status

**M2 delivered.** The gateway renders the parent brand and all six MVP groups from a typed
content module, mobile-first, with no database, authentication, Supabase, analytics, or
private WhatsApp data. Copy and the brand palette remain **provisional** (see owner
decisions below). Next authorized milestone is **M3** (database and security foundation).

## Infrastructure tail (was deferred from M1)

- **GitHub Actions CI** — `.github/workflows/ci.yml`. Runs on pull requests and pushes to
  `main`, on Node 20 (satisfies `package.json` `engines >=18.18`), with `actions/setup-node`
  npm caching, `npm ci`, then the repo's own `npm run validate` (format → lint → typecheck
  → test → build). No deployment logic, no third-party actions beyond checkout/setup-node.
- **Vercel readiness** — the app is a standard root Next.js App Router project and builds
  clean with **zero Vercel-specific config**; deliberately no `vercel.json` was added so
  Vercel's defaults are not overridden. Preview deployments are safe to expose: the site is
  `noindex, nofollow` (see brand/robots below) and serves no private data. **Owner action
  still required** (cannot be done from this repo without account access): create/connect
  the Vercel project, and set `NEXT_PUBLIC_SITE_URL` to the canonical URL per environment
  (documented in `.env.example`; all Supabase vars stay blank until M3). No account IDs,
  tokens, or domains were invented.

## Route structure

| Route | Rendering | Purpose |
|---|---|---|
| `/` | Static | Landing gateway: hero, how-it-works, featured group, full directory preview, trust/guidelines, honest closing CTA |
| `/groups` | Static | Full community directory, rendered from the content module |
| `/groups/[slug]` | SSG (`generateStaticParams`, `dynamicParams = false`) | Per-group detail: identity, about, what belongs / doesn't, etiquette, safety notices, honest access state, related groups, dynamic metadata |
| `/guidelines` | Static | Community guidelines with a version string; group-specific rules; data-use posture |

Unknown group slugs return a genuine **404** (verified) because `dynamicParams = false` and
the content set is fixed in code.

## Public content model

Canonical source: **`src/content/groups/`** (`types.ts`, `groups.ts`, `index.ts`).

- Strict TypeScript types; content is data-only and separated from presentation.
- Fields per group: stable `slug`, `name` (+ `displayNameProvisional`), `shortDescription`
  (≤140), `fullDescription`, `category`, `status`, `logo` (nullable asset with intrinsic
  dimensions + `wordmark`), `access` state, `order`, `belongs`, `doesNotBelong`,
  `etiquette`, optional `notices`, `related`, and per-page `metadata`.
- Accessors: `getPublishedGroups()` (active, order-sorted), `getGroupBySlug()`
  (undefined for unknown/non-active → drives 404), `getRelatedGroups()`.
- **Duplicate slugs are rejected at module load** (throws at build).
- This is a deliberate interim. The field shape mirrors the planned `community_groups` DB
  row (`docs/01-product/community-content-requirements.md`) so **M4** is a data lift.

### Groups included (the six MVP groups)

`general-chat`, `business-and-connections`, `daytime-events`,
`nightlife-and-event-marketing`, `community-organizing`, `sober-social`.

- **Ticket Exchange is deliberately excluded** — out of scope for the initial product
  (`docs/01-product/out-of-scope.md`), even though a concept logo exists. A test asserts it
  is absent.
- **Logos:** Daytime Events, Nightlife & Event Marketing, and Sober Social use their
  approved marks; General Chat, Business & Connections, and Community Organizing have no
  mark yet and render a **brand-tinted monogram tile** fallback (never a broken image). A
  test verifies every declared logo path exists with matching intrinsic dimensions.
- **Provisional names (open Q#10):** Daytime Events and Nightlife & Event Marketing carry
  logo wordmarks ("Daytime Roots", "Nightlife Roots") that differ from their operating
  names. The operating names are displayed; the divergence is marked on the data
  (`displayNameProvisional`) and surfaced subtly on the detail page only — not throughout
  the UI.

## Content provenance and privacy rules

- Copy is **provisional**, grounded in `docs/00-context/community-groups.md` and the voice
  guide (`docs/04-design/content-and-voice.md`); it has not had an owner voice pass.
- **No private community data** is present or permitted: no WhatsApp invite links, phone
  numbers, member/admin names, chat contents, member counts, or private screenshots. A test
  scans the serialized content for invite-link patterns and phone-number-shaped strings.
- **No fake destinations.** There are no invented WhatsApp/Instagram/application/membership
  links. Access is communicated honestly ("Invite access is currently managed by community
  administrators", "joining details are coming soon").
- **Ticket safety** (from approved guidance) is surfaced where it is relevant and supported:
  on Nightlife & Event Marketing (which bans resale) and on the guidelines page — verify
  legitimacy, confirm identity when appropriate, extra caution for matching-ID venues, be
  skeptical of anonymous business profiles, and Miami Roots never guarantees a transaction.

## Components

- **Kept:** `Container` (unchanged).
- **Evolved:** `SiteHeader` and `SiteFooter` gained real navigation (Groups, Community
  guidelines) now that those destinations exist.
- **New primitives (`src/components/ui/`, all Server Components, semantic HTML):** `Section`,
  `SectionHeading`, `Badge`, `Notice` (info/caution safety panel, `<aside>`), `EmptyState`,
  `GroupLogo` (real logo or monogram fallback, fixed box → no layout shift), `CommunityCard`
  (whole-card link, one tab stop), `ActionLink` (the single CTA primitive — always a real
  destination). No client components were added; no component-library sprawl.

## Brand implementation (provisional vs ratified)

- The **mint `#96D2C9` / forest `#003F2C`** palette remains **provisional** — unchanged from
  M1, centralized in `src/styles/globals.css`. Not presented anywhere as ratified (open
  **Q#9**).
- **No branded webfont** was introduced (none is approved); the neutral system-font stack
  continues.
- The **parent banner concept is deliberately not used as production hero art** (it is a
  concept with unratified copy); the hero is a brand-colored band with the approved parent
  mark, per `docs/04-design/asset-implementation-plan.md`.
- The site stays **`noindex, nofollow`** (M1 default retained) — launching indexed vs.
  noindex is an open owner decision.

## Accessibility and quality

- One logical `h1` per page (verified across all routes at 375×812, 768×1024, 1440×900).
- No horizontal overflow at any of the three viewports (verified).
- Landmark sections use `aria-labelledby`; header/footer nav are labelled; the skip link
  is retained; visible focus states via the global `:focus-visible` rule; whole-card links
  give single, keyboard-reachable tab stops with focus rings.
- Images carry intrinsic dimensions (no layout shift); decorative marks are `aria-hidden`.
- 404 behavior correct (real 404 status for unknown slugs).

## Tests added

`tests/unit/groups.test.ts` — content integrity (six groups, Ticket Exchange excluded,
kebab-case slugs, ≤140-char summaries, required fields, no invite links / phone numbers,
logo files exist with matching dimensions, related slugs resolve), directory mapping
(`getPublishedGroups` active + order), valid/invalid slug behavior (`getGroupBySlug`),
and related-group resolution.

## Owner decisions still open (do not treat as resolved)

- **Q#9** — final palette ratification (still provisional).
- **Q#10** — final display names for Daytime Events / Nightlife & Event Marketing.
- Owner copy and voice pass (all gateway copy is provisional).
- Branded typography / webfont selection (none approved; system stack in use).
- Which groups get public join links at launch (all currently admin-managed).
- Launch indexed vs. `noindex` (currently `noindex`).
- Vercel project creation + `NEXT_PUBLIC_SITE_URL` per environment.
- Parent banner production sign-off (concept only; not used as hero).

## Relationship to other documents

- [`implementation-plan.md`](implementation-plan.md) — milestone sequencing and M2 status
- [`../01-product/community-content-requirements.md`](../01-product/community-content-requirements.md) — the content model this interim mirrors
- [`../04-design/asset-implementation-plan.md`](../04-design/asset-implementation-plan.md) — asset→surface mapping and fallbacks
- [`../07-decisions/decision-log.md`](../07-decisions/decision-log.md) — the M2 decision entry
- [`../02-planning/open-questions.md`](../02-planning/open-questions.md) — Q#9, Q#10, and the other open gates
