---
title: Implementation Plan
type: delivery
status: active
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [delivery, implementation, milestones]
---

## Purpose

The authoritative statement of the current phase and the milestone-by-milestone plan for
building the MVP gateway. Work outside the active milestone is out of bounds per
`CLAUDE.md`/`AGENTS.md`.

## Current phase: Milestone 1 complete — Milestone 2 not started

As of 2026-07-16 the repository contains foundation + organized assets + the
architecture/implementation plan, **and the Milestone 1 application foundation** (a
bootstrapped Next.js App Router app with quality tooling and a minimal branded shell).
**No product features, database, or Supabase wiring exist** beyond the pre-existing env
name scaffolding. The next authorized work is **Milestone 2**, and it requires explicit
owner go-ahead.

### Milestone 1 — delivered

> **M1 — Bootstrap the Next.js application and quality tooling, without implementing any
> product feature or any part of the Supabase domain schema.** ✅

Ratified stack (this pass): **Next.js 15, React 19, TypeScript 5 (strict), Tailwind CSS 4,
ESLint 9 (flat config), Prettier 3, Vitest 3**, npm. See the decision log entry
"Milestone 1 stack ratified and application foundation bootstrapped" (2026-07-16). Local
scripts: `dev`, `build`, `start`, `lint`, `typecheck`, `test`, `format`, `format:check`,
`validate`. CI wiring (`.github/workflows`) and the Vercel preview deploy remain to be set
up by the owner — see M1 **Human** / **Deferred** below.

Nothing beyond M1's acceptance criteria was built — no product content beyond a minimal
placeholder shell, no database, no Supabase project wiring beyond the pre-existing env
name scaffolding.

## MVP boundary (summary)

**In MVP:** M1–M12, M14, M15 — public gateway, referral capture, onboarding, gated
invite access, admin verification, maturation, points **earning**, connector dashboard,
QR/sharing, analytics, hardening.
**Immediately post-MVP:** M13 (reward redemption), M16 (expansion).
**Excluded regardless:** Ticket Exchange group, events/RSVPs, partner offers, member
directory, moderation tooling, WhatsApp API automation (see
`docs/01-product/out-of-scope.md` and `docs/02-planning/roadmap.md`).

## Milestones

Format per milestone: **Goal · Outcome** (user-visible) · **Deps** · **Areas** (repo) ·
**DB** · **Security** · **Tests** · **Accept** (acceptance criteria) · **Demo** ·
**Risks** · **Human** (actions needed from owner/admins) · **Deferred** (explicitly not
in this milestone).

### M1 — Application and quality-tooling bootstrap 〔critical path〕 — ✅ delivered 2026-07-16

- **Status:** App shell, tooling, and local quality gates delivered and passing
  (`format:check`, `lint`, `typecheck`, `test`, `build`). **Still owner/infra work:** the
  `.github/workflows` CI pipeline and the Vercel project/preview deploy (the two **Human**
  items below).
- **Goal:** A running, deployable, empty Next.js app with quality gates.
- **Outcome:** Placeholder page renders locally and on a Vercel preview.
- **Deps:** Owner go-ahead. **Decision gate:** ratify stack versions (Next.js/TS/Tailwind
  current stable).
- **Areas:** `src/app`, root configs, `.github/workflows`, `package.json`.
- **DB:** None (explicitly).
- **Security:** `.env.example` kept authoritative; dependency lockfile; no secrets in CI.
- **Tests:** Unit-test runner + one trivial test; lint/typecheck/build in CI.
- **Accept:** `lint`, `typecheck`, `test`, `build` all pass in CI on a PR; preview deploy
  works; README dev-setup section updated.
- **Demo:** Open preview URL → placeholder with parent logo.
- **Risks:** Tooling sprawl — keep to the brief's stack, nothing extra.
- **Human:** Create Vercel project; connect repo.
- **Deferred:** All product UI, Supabase, analytics.
- **Claude Code suitable:** Yes, entirely.

### M2 — Public branded gateway 〔critical path〕

- **Goal:** The real landing + group directory + group detail pages, mobile-first,
  content from a typed in-code content module (deliberate interim before M4).
- **Outcome:** A visitor can read about Miami Roots and each MVP group.
- **Deps:** M1. Content copy needs an owner voice pass (**human**).
- **Areas:** `src/app/(public)`, `src/features/groups`, `src/components`, `public/`.
- **DB:** None yet.
- **Security:** No dynamic input; CSP/security headers baseline.
- **Tests:** Component render tests; accessibility smoke (axe) on the three page types;
  mobile viewport snapshots.
- **Accept:** All six groups render with logo-fallback handling (three have no logo);
  Ticket Exchange absent; guidelines page with version string; Lighthouse mobile ≥ 90.
- **Demo:** Phone-width walkthrough of landing → group detail.
- **Risks:** Banner still missing → hero fallback per
  `docs/04-design/asset-implementation-plan.md`; naming discrepancy (open Q#10) —
  display names are one owner decision away, kept in one content module.
- **Human:** Copy review; naming decision (Q#10) ideally lands here.
- **Deferred:** Any data capture, referral handling.

### M3 — Database and security foundation 〔critical path〕

- **Goal:** Supabase projects (staging + prod), migration tooling, RLS-on-by-default
  pattern, Supabase client wiring (anon/user/service per
  `docs/03-architecture/application-architecture.md`).
- **Outcome:** None user-visible; CI runs migrations + RLS tests.
- **Deps:** M1. **Decision gate:** owner creates Supabase org/projects (**human**).
- **Areas:** `supabase/migrations`, `src/lib/supabase`, CI.
- **DB:** Baseline schema: `members`, `community_groups`, `onboarding_submissions`,
  `consent_events`, `audit_log`, `events` — the identity/content/audit spine only.
- **Security:** RLS enabled on every table from creation; deny-by-default verified by
  test; service-role key confined to server module with lint rule.
- **Tests:** Migration up on clean DB in CI; RLS matrix tests (anon/member/admin) for the
  spine tables; append-only enforcement tests.
- **Accept:** Fresh `supabase db reset` + seed works; RLS tests green; no client bundle
  contains service key (build assertion).
- **Demo:** CI run + dashboard walkthrough.
- **Risks:** Schema churn later — mitigated by planning doc; migrations are append-only
  once applied.
- **Human:** Supabase account/projects, keys into Vercel env.
- **Deferred:** Referral/membership/points tables (arrive with their features).

### M4 — Community-group content in DB 〔parallelizable after M3〕

- **Goal:** Move group content from the M2 code module into `community_groups` +
  public-safe seed; dashboard-editing becomes the content workflow.
- **Outcome:** Same pages, now DB-backed; content edits without deploys.
- **Deps:** M2 + M3.
- **DB:** `community_groups` full content model
  (`docs/01-product/community-content-requirements.md`).
- **Security:** Anon read policy limited to active+public rows; **seed contains no
  invite links** (checked by test + review).
- **Tests:** Seed idempotency; RLS (anon sees only active/public); rendering parity with
  M2 snapshot.
- **Accept:** Code content module deleted; pages render from DB; hidden/archived rows
  invisible.
- **Demo:** Edit a description in dashboard → page updates.
- **Risks:** Copy drift between docs and DB → governance loop
  (`docs/05-operations/whatsapp-content-governance.md`).
- **Human:** None new.
- **Deferred:** Admin content UI (post-MVP entirely).

### M5 — Referral capture 〔critical path〕

- **Goal:** `/r/<slug>` capture: slug resolution, signed first-touch cookie, canonical
  events.
- **Outcome:** A connector's link lands a visitor on the branded gateway; the visit is
  recorded.
- **Deps:** M3 (events table), M2. `referral_links` table arrives here; a few
  hand-created rows for testing.
- **Areas:** `src/features/referrals`, route handler, `src/lib` (cookie signing, rate
  limit).
- **DB:** `referral_links`; `events` writes.
- **Security:** httpOnly signed cookie; rate limiting; invalid slugs → 404 without
  side effects; no third-party scripts on the path.
- **Tests:** First-touch precedence (existing cookie not overwritten); expiry; bad-slug
  handling; event dedup; cookie-disabled path still renders.
- **Accept:** Visit via `/r/test` sets cookie + event exactly once per visit; direct
  visits unaffected.
- **Demo:** Two different referral links in two browsers; inspect events.
- **Risks:** Cookie/privacy copy must exist by launch (M15 checklist).
- **Human:** None.
- **Deferred:** Binding to submissions (M6), dashboards (M11).

### M6 — Lightweight onboarding 〔critical path〕

- **Goal:** The `/join` flow per `docs/01-product/onboarding-specification.md`:
  validation, consent recording, duplicate handling, attribution binding
  (cookie/manual-code precedence, self-referral block).
- **Outcome:** A visitor applies in under a minute; admins see submissions (dashboard).
- **Deps:** M4 (groups from DB), M5 (attribution context).
- **DB:** `group_memberships`, `referral_attributions`; submission processing writes.
- **Security:** Server-only writes (service role); rate limit + honeypot; consent
  versioning; E.164 normalization single helper.
- **Tests:** Field validation matrix; duplicate-phone merge; attribution precedence
  (manual > cookie), self-referral block, shared-device cookie clearing; immutability of
  submissions; concurrent double-submit.
- **Accept:** Full journey referral-visit → submission produces exactly: 1 member, N
  membership rows, ≤1 attribution, consent rows, events — idempotently under retry.
- **Demo:** Submit on a phone; show resulting rows.
- **Risks:** Spam once public — mitigations in place, CAPTCHA is the decision-gate
  fallback.
- **Human:** Guidelines/consent copy owner-approved before public exposure.
- **Deferred:** Any reveal of invite links.

### M7 — Controlled WhatsApp-link access 〔critical path〕

- **Goal:** Server-only `group_invite_links` + gated reveal (`/invite/[membershipId]`)
  + click-through redirect (`/out/…`), per the protection design. Approvals happen via
  dashboard until M8.
- **Outcome:** An approved applicant reveals and uses a real invite link; nobody else
  can.
- **Deps:** M6.
- **DB:** `group_invite_links` (no client policies); reveal/click events.
- **Security:** The heart of it — no-store headers, single-purpose expiring tokens,
  audit twin rows, log redaction, links absent from bundles/seeds (build+test
  assertions).
- **Tests:** Reveal authorization matrix (wrong person/group/state → denied); token
  expiry; **leak hunt test:** crawl rendered public HTML + client JS bundle + seed for
  `chat.whatsapp.com` (must be absent); rotation mid-flight (old reveal page re-render
  shows current active link).
- **Accept:** Unauthorized access impossible by test; every reveal audited; rotation
  invisible to public URLs.
- **Demo:** Approve a test applicant in dashboard → reveal → redirect into a sandbox
  WhatsApp group.
- **Risks:** THE trust-critical feature; extra review — **human security review
  required** before merge.
- **Human:** Real invite links entered manually (staging uses a sandbox group's link).
- **Deferred:** Admin UI for approvals (M8), rotation UI (M8).

### M8 — Administrator verification workflow 〔critical path〕

- **Goal:** Admin auth (magic link + role gate) and the queues: review/approve/reject,
  verify (with evidence), retain, revoke, link rotation UI.
- **Outcome:** Admins run the entire workflow from `/admin` on a phone.
- **Deps:** M7. Admin accounts exist (**human:** owner creates + assigns roles).
- **DB:** Transition guards; audit writes on all actions.
- **Security:** Layout-level role gate + per-action re-check; admin surfaces
  server-rendered/no-store; concurrency guards; no privilege escalation path from
  member role (tested).
- **Tests:** Role-gate matrix; guarded-transition concurrency (two admins, one wins
  informatively); reversal cascades; audit completeness (every transition has an entry).
- **Accept:** End-to-end: submission → approve → reveal → verify → retain entirely via
  admin UI, all audited.
- **Demo:** Two-phone demo — applicant and admin.
- **Risks:** Admin UX debt makes ops slow — queue design reviewed with the actual
  admins (**human review**).
- **Deferred:** Points (M10), correction UI (M9 includes attribution corrections).

### M9 — Referral maturation 〔critical path〕

- **Goal:** Attribution lifecycle completion: verified → matured on retention,
  expiry job, admin corrections (supersede/reverse).
- **Outcome:** Referrals visibly progress for admins; corrections have UI.
- **Deps:** M8.
- **DB:** Attribution transitions; scheduled jobs (Vercel Cron): 90-day expiry, 14-day
  retention reminders.
- **Security:** Jobs authenticated; idempotent; audited as system actor.
- **Tests:** Maturation exactly-once under concurrent triggers; expiry; correction
  supersede-chain integrity; reversal of matured attribution.
- **Accept:** State machine 3/4 fully covered by tests; cron dry-runs clean.
- **Demo:** Time-travel a staging attribution through the lifecycle.
- **Risks:** Clock/window edge cases — property-test the windows.
- **Human:** None.
- **Deferred:** Points posting (M10 — maturation emits the event, M10 consumes).

### M10 — Points ledger 〔critical path〕

- **Goal:** Append-only ledger + maturation payout + manual adjustments + balance
  projection.
- **Outcome:** Admins grant contribution points; balances exist (not yet member-visible).
- **Deps:** M9.
- **DB:** `points_ledger` with revoked UPDATE/DELETE; unique payout constraints.
- **Security:** Append-only enforced mechanically and tested; adjustment requires
  reason; admin self-adjustment socially barred (audit surfaces it).
- **Tests:** Double-payout impossibility; reversal arithmetic; projection rebuild
  equals sum; adjustment audit.
- **Accept:** Machine 5 semantics hold under concurrent maturation + reversal.
- **Demo:** Ledger walkthrough for a test member.
- **Risks:** Low — design is deliberately boring.
- **Human:** Ratify point values (Q#4) — **decision gate** before member visibility
  (M11).
- **Deferred:** Redemption (M13), member-facing display (M11).

### M11 — Connector dashboard 〔critical path — last MVP-blocking build〕

- **Goal:** Member activation (magic link, linking `auth_user_id`) + `/me`: referral
  link + slug chooser, referred-people statuses, points balance/ledger.
- **Outcome:** A verified member becomes a connector with a live dashboard.
- **Deps:** M10 (to show points), M8 (activation trigger).
- **DB:** Member-scope RLS policies exercised for real.
- **Security:** Activation only for verified members; account enumeration resistant;
  member sees names+statuses of referred people, never contact data (tested).
- **Tests:** Activation matrix (unverified/no-email/already-linked); RLS leakage tests
  (member A cannot read member B anything); slug rules (reserved words, rename hold).
- **Accept:** Full loop demoable: connector shares link → applicant → verify → mature →
  points visible on connector's phone.
- **Demo:** The whole point of the product, live.
- **Risks:** Email deliverability of magic links (**human:** DNS/SPF setup at launch).
- **Deferred:** QR/sharing (M12), leaderboards (post-MVP decision).

### M12 — QR and sharing assets 〔parallelizable after M11〕

- **Goal:** `/api/qr/<slug>.png`, story/square sharing cards, OG images, share/download
  UX per `docs/04-design/asset-implementation-plan.md`.
- **Outcome:** Connectors share printable/postable assets.
- **Deps:** M11.
- **Security:** QR only for active slugs; rate-limited generation; assets contain no
  personal data beyond slug.
- **Tests:** QR decodes to exactly the stable URL; card rendering snapshot; OG tags on
  public routes.
- **Accept:** Scanning a printed QR lands attribution correctly end-to-end.
- **Demo:** Print a card, scan with a phone.
- **Risks:** None significant.
- **Human:** If the parent banner has arrived, hero/OG upgrade rides along.
- **Deferred:** Per-group OG variants.

### M13 — Rewards (redemption) 〔post-MVP by recommended default〕

- **Goal:** Catalog + redemption workflow (machine 6) + fulfillment ops.
- **Deps:** M10; **decision gate:** owner ratifies catalog (Q#5) — this gate is why it's
  post-MVP.
- **Security/Tests:** Idempotent debit; concurrent double-redeem; cancel/credit paths.
- **Accept/Demo:** Redemption end-to-end with an admin fulfilling.
- **Deferred:** Inventory automation, partner-provided rewards.

### M14 — Analytics and observability 〔parallelizable; start after M6〕

- **Goal:** Complete the canonical event coverage
  (`docs/03-architecture/analytics-and-events.md`), funnel views for admins, optional
  flag-gated product analytics, structured logging + alert hooks.
- **Outcome:** `/admin` shows the funnel; owner sees weekly numbers without SQL.
- **Deps:** M6+ (events accumulate per feature as built; this milestone closes gaps and
  adds the read side).
- **Security:** Redaction rules tested (no PII/invite URLs in events/logs).
- **Tests:** Event emission per journey step; dedup keys; funnel view math against
  fixtures.
- **Accept:** Every canonical event in the taxonomy is emitted and queryable; derived
  metrics rebuildable.
- **Human:** Choose whether third-party analytics is on at launch.

### M15 — Launch hardening 〔critical path; gate to launch〕

- **Goal:** Execute `docs/08-delivery/release-checklist.md`: security pass, rate-limit
  tuning, backup/restore rehearsal, legal pages, seed of real content, invite links
  entered, admin onboarding, smoke tests.
- **Outcome:** Production launch.
- **Deps:** M1–M12, M14. **Human review required:** security review (invite paths, RLS),
  legal review of privacy/consent copy (research backlog #2–3), owner content sign-off.
- **Accept:** Checklist fully green; production smoke test passes; rollback rehearsed.
- **Risks:** Legal review timing — start it during M8–M11, not at M15.

### M16 — Post-MVP expansion 〔not planned in detail; sequenced in roadmap〕

M13 activation, retention definition refinement, moderation tooling, leaderboard
decision, events/RSVPs (roadmap phase 3), directory/partners (phase 4), Ticket Exchange
(requires explicit owner decision), WhatsApp API exploration (requires research #1).

## Sequencing view

- **Critical path:** M1 → M2 → M3 → M5 → M6 → M7 → M8 → M9 → M10 → M11 → M15.
- **Parallelizable:** M4 (after M3, alongside M5); M12 (after M11); M14 (incrementally
  after M6); content/copy writing and legal review run alongside all mid-milestones.
- **Decision gates:** stack ratification (M1), Supabase account (M3), naming Q#10
  (ideally M2), point values Q#4 (before M11 visibility), catalog Q#5 (M13), third-party
  analytics (M14), launch go/no-go (M15).
- **External dependencies:** Vercel + Supabase accounts, domain/DNS, email
  deliverability (SPF/DKIM), real invite links, the announced banner/screenshots.
- **Human review required:** M7 security review; M8 admin-UX review with real admins;
  M15 security + legal + owner sign-off.
- **Claude Code suitability:** M1–M12, M14 are largely agent-suitable with human review
  at the gates above; M15's checklist execution is human-led with agent assistance;
  copywriting and all owner decisions are human.

## Relationship to other documents

- `docs/02-planning/roadmap.md` — where MVP sits in the larger arc
- `docs/08-delivery/testing-strategy.md` — the test plan the milestones reference
- `docs/08-delivery/release-checklist.md` — M15's content
- `docs/07-decisions/decision-log.md` — gates get recorded there as they're decided
