---
title: Founding Connectors MVP — Delivery Record
type: delivery
status: active
owner: unassigned
created: 2026-08-03
updated: 2026-08-03
tags: [delivery, connectors, redirects, nfc, qr, database]
---

## Purpose

What was actually built for the Miami Roots Founding Connectors program, how it works, what
is deliberately not built, what the owner must do to switch the remaining pieces on, and the
validation that was really run. The program's design lives in
[`../01-product/founding-connectors-program.md`](../01-product/founding-connectors-program.md);
this document is the engineering record.

## Scope and sequencing

This is an **owner-directed pass delivered out of milestone sequence**, the same shape as
the 2026-07-19 community-share feature. It overlaps the *territory* of Milestone 5
(referral capture) but is deliberately not M5:

| Milestone 5 (`referral_links`) | This pass (`connectors`) |
|---|---|
| Belongs to a **member** who completed onboarding and activation | Issued by the **owner** to a person who may never create an account |
| Sets a signed first-touch attribution cookie | Sets no cookie at all |
| Binds attribution at onboarding, feeds the points ledger | Credits nothing automatically; no ledger involvement |
| Depends on M6 onboarding, M10 ledger | Depends on nothing beyond what already exists |

They are separate tables and separate concepts. When M5 lands, a person may hold both, and
the join is a nullable `member_id` added to `connectors` **then**, with its foreign key —
not as a dangling column now. M4, M5, M6 and the rest of the plan are untouched by this
pass.

## What already existed, and was reused

Nothing here is a parallel system. The pass extends what the repository already had:

| Existing pattern | How it was reused |
|---|---|
| `/go/[slug]` controlled redirect (`src/lib/chat-redirect.ts` + a `force-dynamic` page) | `/r/[code]` is the same shape: pure resolver module, thin route, `notFound()`/`redirect()`, `robots: noindex` |
| Typed in-code content module (`src/content/groups/`) | `src/content/connectors/` mirrors its planned DB row shape, with test-enforced content rules |
| Chat-link registry (`src/content/join/chat-links.ts`) | A connector destination of kind `chat` resolves through it — connectors never re-derive `/go/…` paths |
| Campaign attribution keys (`src/lib/share/destination.ts`) | Connector landings emit the **same** `ref`/`utm_*` keys, so `/join`'s existing `CampaignAttribution` capture picks them up unchanged |
| Three Supabase client boundaries (`src/lib/supabase/`) | Both server writes go through `createServiceRoleSupabaseClient()` with justifying comments, as the M3 module comment anticipated |
| M3 migration conventions (deny-by-default RLS, `set_updated_at`, revoked client grants) | The new migration follows them line for line |
| M3 database test harness (`tests/db/`) | Extended, including the exhaustive table-list assertion |
| Design system (`Section`, `SectionHeading`, `Notice`, `Badge`, `ActionLink`, motion wrappers) | `/connectors` composes them; no new UI primitives were introduced |

## What was built

### A. Public `/connectors` page

`src/app/(site)/connectors/page.tsx` — a Server Component in the `(site)` group, so it
carries the standard header and footer. Covers what a Founding Connector is, why the
program exists, who it's for, how the card works, expectations and prohibited conduct, the
benefits package, that admission is selective, and how to put a name forward. Uses the
existing motion wrappers (reduced-motion safe), one `h1`, labelled landmark sections.

A `/connectors` link was added to the site footer. Primary navigation was deliberately left
alone: the program is invitation-led, and it does not compete with the join CTA.

### B. Interest / nomination flow

- `src/lib/connectors/nomination.ts` — pure validation and normalization (field bounds,
  enum checks, Instagram normalization, email shape, consent requirement, honeypot).
- `src/app/(site)/connectors/actions.ts` — the Server Action.
- `src/app/(site)/connectors/nomination-form.tsx` — a progressively-enhanced client form
  (works without JS; the client layer adds the conditional field, inline errors, pending
  state). Labels, `aria-describedby`, `aria-invalid`, a polite live region, ≥44px targets.
- `src/lib/connectors/nomination-store.ts` — the server-only write path.

**The honesty rule.** The flow never claims a submission was stored unless a row was
written. Because Milestone 3's hosted half is still owner-gated, no write path exists in
any environment today — so the page renders a direct-contact route instead of a form, and
says why. When Supabase is configured the real form renders and really writes. Both branches
are asserted by tests.

**Data minimization.** One person's contact details per submission: the submitter's.
Nominating someone else records that person's name and public handle only. The rationale is
in the program design.

### C. Tracked redirect system

`/r/<code>` — `src/app/r/[code]/page.tsx`, outside the `(site)` group, `force-dynamic`,
`noindex`.

All decisions live in `src/lib/connectors/destination.ts` (pure, fully unit-tested); the
route only executes the result.

| Requirement | How it is met |
|---|---|
| Validate connector codes | `normalizeConnectorCode` — lowercase, 2–30 chars, `[a-z0-9-]`, no leading/trailing/double hyphen. Case-insensitive and whitespace-tolerant; everything else rejected, not coerced |
| Resolve only active connectors | `status: active` is credited. `paused`/`retired` still open the community door but emit **no** `utm_content` and lose any destination override |
| Record a privacy-safe scan event | `recordConnectorScan` writes `connector_link_visited` with the public code, source, credited flag, campaign. No IP (not even hashed), no user agent, no fingerprint, no referrer |
| Distinguish QR vs NFC | Only via the printed `?s=` parameter: NFC writes `?s=n`, QR encodes `?s=q`. Unrecognized or absent → `unknown`, never guessed |
| Preserve campaign parameters | `utm_campaign` and `utm_term` pass through when present; `ref`, `utm_source`, `utm_medium`, `utm_content` are always set by us so a visitor cannot spoof them. Every other parameter is dropped |
| Redirect to an editable destination | Registry `destination`, else `DEFAULT_CONNECTOR_DESTINATION` (`/join`). Changing either re-points cards already in wallets |
| Fail safely | Unknown or malformed code → real 404. Disabled card → community door opens, uncredited. Unresolvable destination → falls back to the default |
| Never expose destination-management data | Nothing about the registry, admin notes, or WhatsApp invites reaches the browser; invites stay in server env vars behind `/go/<slug>` |
| Prevent open redirects | Destinations are a closed union of internal targets (allowlisted page, validated group slug, validated chat slug). No request string reaches the redirect target. The DB column additionally rejects absolute and protocol-relative values |
| Follow existing redirect architecture | Same structure as `/go/[slug]` |

**Opaque internal identifiers.** The public code is a readable slug, but every database
reference is the `connectors.id` UUID — the code is never an enumerable internal key.

### D. Database

`supabase/migrations/20260803120000_connectors.sql`:

- **`connectors`** — one row per issued card. Code (unique, format- and length-checked),
  display name, category, status (`active|paused|retired`), `destination_kind` +
  `destination_ref` (constrained to reject absolute and protocol-relative values),
  `issued_on`, `public_recognition_consent` (defaults false), `notes_admin`, timestamps with
  the `set_updated_at` trigger. RLS on, zero client grants, zero policies.
- **`connector_nominations`** — the intake table. Same server-only posture as
  `onboarding_submissions`: RLS on, no client grants, no policies. `consent_to_contact` is
  constrained true, so a contact detail cannot be stored without permission. A nomination
  about someone else cannot be stored without a nominator to follow up with.
- **`events.connector_id`** — nullable FK to `connectors`, `on delete set null`, indexed.
  Application writes leave it null while the registry lives in application content, so
  linking later is a backfill rather than a redesign. This follows the M3 precedent of
  adding a reference column only once its target table exists.

**No new environment variables were introduced.** The feature uses the Supabase variables
that already exist.

### E. Card registry

`src/content/connectors/` — the source of truth for issued cards in this phase, mirroring
the `connectors` row shape. Everything committed is clearly fictional fixture data
(`fixture: true`); real connectors are added one at a time with owner approval. Tests assert
code validity and uniqueness, resolvable destinations, ISO issue dates, that every entry is
a fixture, that nobody is publicly named without consent, and that the file contains no
email address, phone number, or WhatsApp link.

## What was deliberately not built

- **No connector dashboard.** Connectors have no login and no self-service surface. That is
  M11 territory and needs member identity.
- **No points, ledger, or payout.** Card scans credit nothing automatically.
- **No attribution cookie or first-touch binding.** That is M5, and it needs the onboarding
  flow to bind to.
- **No admin UI.** Cards are managed by editing the registry and deploying — appropriate at
  a 20–30 card scale, and the DB path exists for when it isn't.
- **No public connector directory.** No fixture consents to public recognition, and the
  page names nobody.
- **No multi-city machinery.** See the expansion posture in the program design.
- **No rate limiting on the nomination form beyond a honeypot.** Real rate limiting is a
  shared concern arriving with M6/M15; noted below as a risk.

## Enabling the pieces that are owner-gated

### Enabling nomination capture

Nominations are stored only where Supabase is configured. To switch it on:

1. Create the hosted Supabase project(s) — this is the still-open remote half of Milestone 3
   (see [`milestone-3-database-foundation.md`](milestone-3-database-foundation.md)).
2. Apply migrations to it (`npx supabase db push`), including
   `20260803120000_connectors.sql`.
3. Set in the hosting environment: `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
4. **Redeploy.** `/connectors` is statically rendered, so the form-vs-fallback branch is
   decided at build time. A redeploy is required for the change to take effect.
5. Verify: submit a test nomination and confirm the row exists in `connector_nominations`.
   Delete the test row.

Until step 5 passes, the page correctly shows the direct-contact route.

### Enabling scan telemetry

The same three variables enable `connector_link_visited` writes. Until then
`recordConnectorScan` returns `skipped_unconfigured` and the redirect is unaffected — a
deliberate no-op, not a silent failure. No redeploy is needed for this half, since `/r/`
is dynamic.

Verify with:

```sql
select event_name, properties, occurred_at
from public.events
where event_name = 'connector_link_visited'
order by occurred_at desc
limit 20;
```

### Issuing a real card

The procedure — code assignment, chip programming, QR generation, URL testing, the
pre-handoff checklist — is in
[`../05-operations/founding-connectors-operations.md`](../05-operations/founding-connectors-operations.md).

## Security posture

- **Open redirects are impossible by construction.** Destinations are a closed union of
  internal targets; nothing from the request reaches the redirect target; the DB column
  rejects absolute/protocol-relative values; all four properties are tested.
- **Query parameters are allowlisted.** Only known campaign keys survive the hop, and the
  four attribution keys we own are always overwritten.
- **No secret is exposed.** No WhatsApp invite, service key, or destination-management data
  reaches a client bundle; `npm run test:bundle` asserts it.
- **Both server writes are service-role, with justifying comments**, and both modules are
  `server-only`.
- **Deny-by-default RLS** on both new tables, asserted per verb and per client role.
- **Telemetry cannot break a redirect.** `recordConnectorScan` never throws and never
  rejects, and gives up after 1.2 seconds.
- **A person's contact details are never logged.** Insert failures log a Postgres error
  code only.

## Privacy posture

What a scan records: the public card code, `nfc|qr|link|unknown`, whether it was credited,
an optional campaign label, and a timestamp.

What it does not record: IP addresses (not even hashed), user agents, device or browser
fingerprints, referrers, geolocation, or anything that links two scans to the same person.

The existing privacy design permits hashed network metadata only where an anti-abuse need is
documented (`onboarding_submissions`). A card scan has no such need, so it stores none —
which is also why the reporting must speak in taps, not people.

## Tests

| File | Covers |
|---|---|
| `tests/unit/connector-codes.test.ts` | Code format, case folding, rejection of path traversal / URLs / unicode / over-length, reserved words |
| `tests/unit/connector-destination.test.ts` | Source parsing, destination resolution per kind, allowlist enforcement, attribution stamping, spoof resistance, parameter preservation and dropping, unknown codes, disabled cards, override suppression, internal-path invariant across the whole registry |
| `tests/unit/connectors.test.ts` | Registry invariants: validity, uniqueness, resolvable destinations, fixture-only, consent-gated naming, no contact details in the file |
| `tests/unit/connector-nomination.test.ts` | Validation matrix, normalization, consent requirement, honeypot, enum rejection, field bounds |
| `tests/unit/connector-capture.test.ts` | Configuration checks answer instead of throwing; scan recording no-ops when unconfigured and never rejects when the database is unreachable |
| `tests/unit/connectors-page.test.tsx` | Page copy obligations; form renders only when a write path exists; nobody named without consent |
| `tests/unit/connector-action-exports.test.ts` | Every `"use server"` module exports async functions only — see the regression note below |
| `tests/db/connectors.test.ts` | RLS deny-by-default per role and verb; service-role access; absolute-destination rejection; code format/uniqueness; enum constraints; consent constraint; nominator constraint; `updated_at` trigger; `events.connector_id` FK behavior |
| `tests/db/schema.test.ts` (updated) | Exhaustive table list, no-client-policy list, unique-index list extended for the new tables |

**Regression caught during browser verification.** The first implementation exported the
form's initial state object from the `"use server"` module. That builds and typechecks
cleanly, then fails at request time — the first real submission rendered the site's error
boundary instead of the form's validation errors. Fixed by moving the state type and
constant into `src/app/(site)/connectors/nomination-state.ts`, and guarded by
`tests/unit/connector-action-exports.test.ts`, which reads every `"use server"` module and
asserts each value export is an async function (verified to fail when the mistake is
reintroduced). Vitest does not apply Next.js's Server Actions rules, so the source-level
guard is the only cheap way to catch this class of bug before a visitor does.

`vitest.config.ts` gained a `server-only` alias pointing at `tests/stubs/server-only.ts`, so
server modules can be rendered under test. The real boundary is unaffected — Next.js
enforces it at build time, ESLint blocks privileged imports from shared UI, and
`npm run test:bundle` asserts no client chunk carries service-role material.

## Validation actually run

Recorded on 2026-08-03 in the development environment, against a local Postgres harness
(`npm run db:start`, port 55432). Every command below was executed and its result is
reported as observed.

| Command | Result |
|---|---|
| `npm ci` | Dependencies installed |
| `npm run format:check` | Pass |
| `npm run lint` | Pass, no warnings |
| `npm run typecheck` | Pass |
| `npm test` | Pass — 20 files, 181 tests |
| `npm run build` | Pass — `/connectors` static, `/r/[code]` dynamic |
| `npm run test:bundle` | Pass — 31 client chunks, no service-role material |
| `npm run validate` (the full gate, in one run) | **Exit 0** |
| `npm run db:reset` | Exit 0 — 8 migrations replayed from zero, seed applied |
| `npm run db:test` | Pass — 4 files, 50 tests |

**Live route verification** against the production build (`npm run start`):

| Request | Observed |
|---|---|
| `/r/fc001?s=n` | 307 → `/join?ref=founding-connector&utm_source=founding_connector&utm_medium=nfc&utm_campaign=founding_connectors&utm_content=fc001` |
| `/r/FC001?s=q&utm_campaign=art_basel&next=https%3A%2F%2Fevil.example` | 307 → `/join?…&utm_medium=qr&utm_campaign=art_basel&utm_content=fc001` — case folded, campaign preserved, `next` dropped |
| `/r/demo-dj?s=n` | 307 → `/go/nightlife-events?…&utm_content=demo-dj` — destination override honored |
| `/r/demo-retired?s=q` | 307 → `/join?…` with **no** `utm_content` — door open, credit withheld |
| `/r/never-issued` | 404 |
| `/r/dj_marcus` | 404 |
| `/connectors` | 200, renders the direct-contact fallback (no Supabase configured here) |

**Browser verification** (headless Chromium, 390×844 and 1440×900):

- `/connectors` renders with no horizontal overflow at either width, exactly one `h1`, and
  scroll reveals that resolve to fully visible content.
- With placeholder Supabase variables set at build time, the real form renders; the
  self/other toggle shows and hides the nominator field.
- Submitting an empty form returns inline field errors and a polite summary, with no crash.
- Submitting a **complete** form against an unreachable database shows "Something broke on
  our end — your nomination was not saved," and **never** the success state. This is the
  honesty rule verified end to end rather than asserted.

**Not verified in this environment:** behavior against a real hosted Supabase project (none
exists — the placeholder run only proves the failure path), a real NFC chip or printed QR
(no hardware), Lighthouse scores (no preview URL), and browsers other than Chromium. These
are owner-side steps in the operations playbook.

## Risks and follow-ups

**Blocking a real launch:**

1. **No hosted database.** Nomination capture and scan telemetry are both dark until
   Milestone 3's remote half is done by the owner.
2. **Palette and typeface unratified (Q#9).** Cards must not go to print before this — it is
   the most expensive place to discover an open brand decision.
3. **Legal review of the "not employees / cannot bind" language and the consent copy.**
   Drafted in plain language by non-lawyers.
4. **Production domain.** Everything is specified as `myroots.dev`; the current deployment
   is a Vercel URL. A card printed with the wrong domain is permanent breakage.

**Not blocking:**

5. **No rate limiting on nominations** beyond the honeypot. Fine at current traffic;
   should ride along with the shared rate-limiting work in M6/M15.
6. **`events.connector_id` is always null** until the registry moves into the database. The
   public code in `properties` is the join key until then.
7. **Enabling capture requires a redeploy**, because `/connectors` is statically rendered.
8. **The registry is a code edit**, so issuing or disabling a card requires a deploy.
   Acceptable at 20–30 cards; the DB table exists for when it isn't.

## Relationship to other documents

- [`../01-product/founding-connectors-program.md`](../01-product/founding-connectors-program.md) — program design, measurement, governance
- [`../05-operations/founding-connectors-operations.md`](../05-operations/founding-connectors-operations.md) — procedures and launch plan
- [`../05-operations/founding-connectors-message-pack.md`](../05-operations/founding-connectors-message-pack.md) — onboarding messages
- [`../04-design/founding-connector-card-spec.md`](../04-design/founding-connector-card-spec.md) — the physical card
- [`milestone-3-database-foundation.md`](milestone-3-database-foundation.md) — the owner-gated remote half this depends on
- [`implementation-plan.md`](implementation-plan.md) — where this sits relative to the milestones
