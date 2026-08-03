---
title: Referral System
type: architecture
status: proposed
owner: unassigned
created: 2026-07-16
updated: 2026-08-03
tags: [architecture, referrals, attribution, qr]
---

## Purpose

Specifies how personal referral URLs, attribution, and referral QR/sharing assets work in
the MVP: slug format, attribution rules, browser-storage behavior, edge cases, fraud
posture, and idempotency. All values are **recommended defaults** from the 2026-07-16
planning pass unless marked otherwise.

## What belongs here

- Referral slug and URL rules
- Attribution capture, precedence, window, and correction rules
- Edge-case and abuse handling; QR and sharing behavior

## What does not belong here

- Table shapes (see [`data-model.md`](data-model.md) — `referral_links`,
  `referral_attributions`)
- Points policy (see [`../01-product/referral-and-rewards-concept.md`](../01-product/referral-and-rewards-concept.md))
- Sharing-asset design (see [`../04-design/asset-implementation-plan.md`](../04-design/asset-implementation-plan.md))

## Namespace note — `/r/` is now shared (2026-08-03)

The `/r/` prefix this document reserves for member referral links is **already serving
Founding Connector cards** (`/r/<code>`, resolved by `src/lib/connectors/`), on an explicit
founder decision that the printed card URL is `myroots.dev/r/<code>`. The two systems are
separate (see the decision-log entry of 2026-08-03) but they share **one code space**, and a
physical card cannot be reprinted.

Consequences that M5 must honor:

1. **Connector codes win any collision.** They are printed on objects in the world; member
   slugs are chosen in a browser and can be re-chosen.
2. **Slug selection at member activation must reject any code already issued to a
   connector**, in addition to the reserved-word list.
3. **Resolution order:** connector codes first, then member slugs — never the reverse.
4. Whether the two should converge into one identity is open question #15; the default is
   that they stay separate.

## Referral URLs and slugs

- **Format:** `https://<site>/r/<slug>`; slug is lowercase kebab-case, `[a-z0-9-]`,
  3–30 characters, no leading/trailing/double hyphens. Resolution is case-insensitive
  (`/r/Heldy` → `heldy`).
- **Chosen, not generated:** members pick a human slug (e.g. `/r/heldy`) at activation,
  with a suggested default from their first name; uniqueness enforced; a **reserved-word
  list** (admin, join, groups, miami-roots, api, official, plus profanity screening)
  blocks misleading slugs.
- **One active slug per member.** Renames are allowed but rare (audited; the old slug is
  held reserved for 90 days and 404s rather than transferring to someone else — QR codes
  in the wild must never start crediting a different person).
- **The referral URL is the only referral identifier.** No parallel numeric codes, no
  per-campaign codes in MVP — UTM parameters may ride along for *analytics* but never
  drive attribution (avoids competing identifiers).

## Attribution capture

`/r/<slug>` is handled server-side (route handler): validate slug → record a
`referral_link_visited` event → set the attribution cookie → redirect to `/`
(or `/join` when the CTA context says so). The visitor never sees a bare tracking page.

- **Cookie:** first-party, `httpOnly`, `Secure`, `SameSite=Lax`, name e.g. `mr_ref`,
  value = signed payload `{slug, first_touch_at}`, **30-day expiry** (recommended
  default; owner-tunable).
- **First-touch wins:** if a valid unexpired `mr_ref` cookie already exists, a later
  `/r/<other>` visit does **not** overwrite it (the event is still recorded for
  analytics). Rationale: the person who actually opened the door gets credit; last-touch
  invites link-spamming at the moment of signup.
- **Manual code entry beats the cookie:** the onboarding form has an optional "referral
  code" field. An explicit, validated slug entered by the applicant overrides the cookie
  (explicit human statement > passive tracking). Source is recorded
  (`cookie|manual_code|admin`) so precedence is auditable.
- **Direct visits:** no cookie, no manual code → no attribution row. The flow must work
  identically (see journey 2 in [`../01-product/user-journeys.md`](../01-product/user-journeys.md));
  absence of a referrer is a fully supported path, recorded as `referral_source=none`.
- **Cookies disabled / storage cleared:** attribution degrades gracefully to the manual
  code field. No localStorage/fingerprint fallback in MVP — data minimization beats
  attribution completeness (see [`privacy-and-safety.md`](privacy-and-safety.md)).

## Binding at onboarding (attribution row creation)

Attribution becomes durable only when an onboarding submission is processed:

1. Resolve the claim (manual code, else cookie, else none) to an active `referral_link`.
2. **Self-referral check:** if the submission's normalized phone (or email) matches the
   referring member → no attribution, flagged event (`self_referral_blocked`).
3. **Existing-member check:** if the phone already belongs to a verified member → no new
   attribution (existing members can't be "re-referred"); surfaced to admin as a
   re-engagement signal instead.
4. **One attribution per referred member, ever:** `referred_member_id` is unique among
   active rows. A duplicate submission (same phone) reuses the member and **keeps the
   original attribution** — first submission locks credit. Changes after that are
   admin-only corrections.
5. **Shared devices:** the cookie is cleared on successful submission, so the next person
   on the same phone/browser doesn't inherit the previous visitor's referrer. (A fresh
   `/r/…` visit by the next person re-sets it — correct behavior.)
6. **Multiple connectors claiming one person:** resolved by the precedence rules above
   (explicit code > first cookie). Disputes are an admin correction with both parties'
   claims visible in events; there is no automatic split-credit in MVP.

**Idempotency:** binding is keyed on the member — retrying a submission process job can
never create a second attribution (unique constraint), and maturation can never post
points twice (ledger unique reference, see [`data-model.md`](data-model.md)).

## Corrections and reversals

- **Admin reassignment:** creates a new attribution row (`source=admin`), marks the old
  one `superseded` with a pointer — full history retained, nothing overwritten.
- **Reversal:** fraud or un-verification moves the attribution to `reversed`; if points
  already posted, a compensating ledger entry is written (never row deletion).
- **Window:** an attribution that hasn't reached `verified` within **90 days** of binding
  expires (recommended default) — stale credit doesn't linger forever.

## Fraud indicators (MVP posture: detect and surface, don't over-automate)

Signals recorded for admin review rather than auto-punished: bursts of submissions from
one IP hash/user-agent against one slug; submissions with sequential/invalid phone
patterns; self-referral attempts; attributions that never progress past `attributed`
at unusual rates for one connector. Rewards maturing only after verification + retention
(see machine 4 in [`data-model.md`](data-model.md)) is itself the primary anti-gaming
control — clicks and submissions alone never pay out.

## QR codes and sharing

- **QR encodes the stable referral URL** (`/r/<slug>`) — nothing else. Because the URL is
  stable and the invite links behind the gateway rotate independently, printed/saved QR
  codes never go stale. This makes QR codes effectively **static** while behaving
  dynamically (recommended default; no third-party dynamic-QR service).
- **Generated server-side on demand** (route `GET /api/qr/<slug>.png`) with caching; not
  stored in the repo (`public/qr/` stays empty) and regenerable at any time — losing a
  generated file loses nothing.
- **Story-sized sharing card** (1080×1920) and square card composed at runtime from brand
  assets + the member's QR/slug — see
  [`../04-design/asset-implementation-plan.md`](../04-design/asset-implementation-plan.md).
  Download/share via the member dashboard using the Web Share API where available, plain
  download otherwise.
- **Link previews:** `/r/<slug>` and public pages carry Open Graph tags with Miami Roots
  branding (generic parent OG asset until per-connector cards are warranted — no member
  personal data in OG images).
- **UTM:** shared URLs may append `utm_source/medium/campaign` for analytics; UTM never
  affects attribution.

## Relationship to other documents

- [`data-model.md`](data-model.md) — `referral_links`, `referral_attributions`, ledger
  idempotency
- [`analytics-and-events.md`](analytics-and-events.md) — referral event definitions
- [`privacy-and-safety.md`](privacy-and-safety.md) — why no fingerprinting/localStorage
- [`../01-product/referral-and-rewards-concept.md`](../01-product/referral-and-rewards-concept.md) — what matured referrals earn
