---
title: Miami Roots Founding Connectors — Program Design
type: product
status: proposed
owner: unassigned
created: 2026-08-03
updated: 2026-08-03
tags: [product, connectors, distribution, nfc, referrals, governance]
---

## Purpose

The product-level design of the **Miami Roots Founding Connectors** program: what it is,
who it's for, how someone joins it, what they get, what they must not do, and how it is
measured. This is the source of truth for the program; the public page at `/connectors`
renders a summary of it, and where the two disagree, this document wins and the page is
what gets fixed.

Operational procedure (how cards are made, issued, disabled, reviewed) lives in
[`../05-operations/founding-connectors-operations.md`](../05-operations/founding-connectors-operations.md).
The technical implementation is in
[`../08-delivery/founding-connectors-mvp.md`](../08-delivery/founding-connectors-mvp.md).

## What belongs here

- Positioning, selection criteria, cohort shape, benefits, expectations
- The measurement framework and what each metric may and may not be claimed to mean
- Governance, safeguards, and misuse policy
- Multi-city expansion posture

## What does not belong here

- Card artwork and copy hierarchy (see
  [`../04-design/founding-connector-card-spec.md`](../04-design/founding-connector-card-spec.md))
- The message templates sent to connectors (see
  [`../05-operations/founding-connectors-message-pack.md`](../05-operations/founding-connectors-message-pack.md))
- Points, rewards, and member referral links, which are a **different system** (see
  [`referral-and-rewards-concept.md`](referral-and-rewards-concept.md) and
  [`../03-architecture/referral-system.md`](../03-architecture/referral-system.md))

## Status of the statements below

**Decisions** are the founder decisions recorded as governing (listed in
[Founder decisions treated as governing](#founder-decisions-treated-as-governing)) plus
what the decision-log entry of 2026-08-03 ratifies. Everything else — cohort size within
the stated range, specific benefits, metric thresholds, review cadence — is a
**recommended default** from this design pass, implementable now and owner-tunable at any
time. Nothing here is a legal opinion; see [Legal review needed](#legal-review-needed).

## The program in one paragraph

Miami Roots grows the way anything real in Miami grows: someone you trust tells you to be
in it. **Founding Connectors** are twenty to thirty such people — chosen, not
recruited — who each carry a branded Miami Roots card with an NFC chip and a printed QR
code. Tapping or scanning it opens a Miami Roots URL we control, which lands on the
community hub and from there into the General Chat. The card is a physical object that
makes a personal invitation effortless; the tracked URL is what lets us change where it
points, keep it working, and understand what's happening — without ever printing a new
card.

## Positioning

**Founding Connector.** Not ambassador, affiliate, promoter, rep, street team, influencer,
or employee — those words all describe someone distributing on behalf of a brand. A
connector is someone who was already introducing people, and now has a better tool for it.

What the name should communicate: recognition, trust, local influence, community
stewardship, selective participation, and early involvement in something being built.

The distinction that governs every decision in this document:

| A Founding Connector is | A Founding Connector is not |
|---|---|
| Someone whose recommendation carries weight | Someone with a follower count |
| Trusted inside at least one real Miami community | A reach channel |
| Bringing people they'd personally vouch for | Hitting a number |
| An early participant in building Miami Roots | A contractor executing a campaign |

## The distribution loop

```
trusted connector
  → personal invitation (in person, in a DM, at their class/night/shop)
  → tap or scan a Miami Roots card
  → myroots.dev/r/<code>            ← Miami Roots owns this link
  → tracked landing on the community hub (/join)
  → General Chat — the one front door
  → events, relationships, opportunities, and later, specialized groups
```

Two properties of this loop are load-bearing:

1. **The card never encodes a WhatsApp invite.** It encodes a Miami Roots URL. That is
   what allows a destination change, an expired-link replacement, a city or campaign
   re-point, broken-destination detection, and attribution — all without touching a card
   already in someone's wallet.
2. **General Chat stays the front door.** New people go to one live room, not to five
   empty ones. Specialized chats emerge from demonstrated demand, not from anticipation.

## The initial cohort

**Target size: 20–30 Founding Connectors**, reached in stages (see the launch plan in the
operations guide). Small enough that the founder can personally onboard every one of them;
large enough to cover several distinct Miami scenes.

**Categories to draw from** (a picture of a balanced cohort, not a quota system):

| Category | Registry value | What they bring |
|---|---|---|
| Yoga, fitness, wellness practitioners | `wellness` | Recurring groups that already meet in person |
| DJs and music curators | `music` | Taste that moves rooms; cross-scene reach |
| Event organizers and promoters | `events` | Repeat gatherings with real attendance |
| Bartenders, hospitality, venue operators | `hospitality` | High-frequency contact with everyone |
| Community organizers | `organizing` | Trust in neighborhoods that don't respond to marketing |
| Founders and business owners | `business` | Opportunity flow; other builders |
| Artists and creatives | `creative` | Scenes that form around work |
| Realtors and neighborhood connectors | `neighborhood` | Deep knowledge of a few blocks; constant introductions |
| Nonprofit and civic leaders | `civic` | Credibility and civic depth |

**Balance target (recommended default):** no more than about a third of the cohort from
any one category, and at least five distinct neighborhoods represented. A cohort that is
all nightlife makes Miami Roots a nightlife brand by accident.

### Selection criteria

Ranked, and deliberately not weighted toward reach:

1. **Trust** — people take their recommendation seriously. The single strongest signal.
2. **Alignment** — they'd want the community to be good more than they'd want it to be big.
3. **Real-world activity** — they show up in physical rooms, regularly.
4. **Bridging** — they connect people who wouldn't otherwise meet, across scenes.
5. **Reciprocity** — they introduce people without expecting a return.
6. **Reach** — last, and only as a tiebreaker.

### Disqualifiers

Follower-count-first pitches; anyone who has to be paid to care; anyone with a pattern of
mass-DMing, spam, or transactional networking; anyone who wants the card mainly as a
credential; anyone who wouldn't hold themselves to the community guidelines.

## How someone gets in

- **Invitation (primary).** The founder identifies and invites. The first cohort is
  entirely invitation-led.
- **Nomination.** Anyone can nominate someone, or themselves, at `/connectors`. Nominations
  are read, not auto-approved, and a nomination is never an application that "should" be
  accepted.
- **Connector nomination (Phase 3).** Existing connectors nominate candidates. This is the
  healthiest source, because the nominator's own standing is implicitly attached.

**Admission is selective and never guaranteed.** The public page says so plainly, and every
decline message says so kindly — a no is usually a not-yet, and it costs nothing to say so.

### What a nomination collects, and what it deliberately does not

| Collected | Why |
|---|---|
| Name of the person being nominated | Identifying who this is about |
| Whether it's a self-nomination or about someone else | Changes how we follow up entirely |
| The **submitter's** name (when nominating someone else) | Somebody has to make the introduction |
| One contact method + value, for the **submitter** | The only way to reply |
| Instagram handle (optional) | Placing who is meant, not measuring reach |
| Neighborhood / area | Cohort balance |
| Community role | Cohort balance and fit |
| Why they'd be a strong connector | The part that actually decides it |
| How they heard about the program (optional) | Understanding what's working |
| Explicit consent to be contacted | Storing a contact detail without permission is the thing to avoid |

**Never collected:** the nominated person's phone number, email, or address when someone
else is filling in the form. A person who has not been asked has not consented to a
stranger entering their contact details into a database. The introduction comes back
through the nominator — which is also how a trust-based program should work.

**Retention (recommended default):** nominations that don't lead anywhere are deleted at
**12 months**; declined nominations at **6 months**; a nomination is deleted immediately on
request.

## Program mechanics

### 1. Curated invitations

Connectors invite people they genuinely believe belong. They must not mass-post the link,
add anyone without consent, buy traffic, misrepresent Miami Roots, promise access, perks,
employment, revenue, or status, scrape contacts, or spam unrelated group chats.

### 2. Quality over volume

There is **no public ranking by referral count**, and no leaderboard (consistent with the
standing default in open question #13). What the program recognizes as it matures:

- Introductions that turned into something real
- Showing up to and supporting Miami Roots events
- Contributions inside the community chats
- Partner referrals that worked out
- Members who are still active months later
- Collaboration across communities
- Hosting or supporting a Miami Roots experience

Most of these are observed by humans, not computed. That is deliberate: a metric that can
be gamed becomes the goal.

### 3. Editable destinations

Miami Roots can change where any card points without replacing the card. Today that is a
one-line change in the connector registry (a deploy); once the registry lives in the
database it becomes a row edit. Either way the physical card is untouched.

### 4. Privacy-conscious attribution

We record that a card was used, whether it was NFC or QR, whether the card was active, and
when. We do **not** record IP addresses (not even hashed), user agents, device
fingerprints, referrers, or location, and we do not link two scans to the same person. See
[Measurement framework](#measurement-framework) for exactly what each number does and does
not mean.

### 5. Human-centered onboarding

Every connector gets a real five-minute conversation, in person where possible. Nobody is
handed a card with a link to a page. The script is in the message pack.

## Connector benefits

The MVP benefits package deliberately costs little cash and promises nothing that would
have to be walked back.

| Benefit | Available | Notes |
|---|---|---|
| Recognition as an original Founding Connector | At launch | There is only one first cohort |
| Early invitations to Miami Roots events | At launch | Before public announcement |
| Priority access to capacity-limited experiences | At launch | Where capacity is genuinely limited |
| Website recognition | On request | **Opt-in only**, per-person consent, revocable |
| Connector-only gatherings | Phase 2 | The cohort meeting each other is a benefit in itself |
| A platform for their own events/communities | Phase 2–3 | Featured in the community, subject to fit |
| Input into Miami Roots programming | At launch | Genuine while the community is small |
| Partner perks | Phase 3 | As partnerships come together; never promised in advance |
| Occasional guest passes / community rewards | Phase 3 | Discretionary |
| Early access to future Roots city chapters | Phase 4 | Structural, not a promise of anything specific |

**Explicitly not offered during MVP:** equity, employment, commissions, revenue share,
permanent benefits, or any performance-based payout. Performance-based rewards are
considered only after the economics and rules are defined — and that is a separate decision
from this program.

**Say-nothing-you'd-have-to-retract rule.** If a benefit isn't in the table above with an
"available" date that has passed, no connector should be told it exists.

## Measurement framework

### The MVP scorecard

| Metric | Source | Confidence |
|---|---|---|
| Cards issued | Connector registry | Exact |
| Active connectors | Connector registry (`status = active`) | Exact |
| NFC or QR visits (scans) | `connector_link_visited` events | Exact, but counts **taps, not people** |
| Scans by source (NFC vs QR vs link) | Event `source` property | Exact where the card encodes `?s=`; `unknown` otherwise |
| Landing-page visits | Site analytics on `/join` with connector attribution | Approximate |
| Join-button clicks | `/go/<slug>` requests carrying connector attribution | Exact as a count of clicks |
| Confirmed community joins | **Not measurable today** | See below |
| Event registrations attributed | Manual, at the event | Approximate |
| Partner referrals attributed | Manual | Approximate |
| Connector participation | Human observation | Qualitative |
| Member retention / meaningful activity | Not measurable until membership tracking exists (M6–M9) | — |
| Reported misuse | Ops log | Exact |
| Broken or disabled cards | Connector registry (`paused`/`retired`) | Exact |

### The five states, and the honest gaps between them

1. **Scan** — a card was tapped or scanned. One person can produce several.
2. **Landing-page visit** — the Miami Roots page rendered. Lower than scans (people
   dismiss things).
3. **Join-button click** — someone chose a chat and clicked through to WhatsApp.
4. **Confirmed community join** — they are actually in the group. **We cannot see this
   today.** WhatsApp does not tell us, and the membership-verification workflow that would
   (M6–M8) does not exist yet.
5. **Active community member** — still there and participating weeks later. Also not
   measurable today.

**A click is not a join.** Nothing in this program's reporting may state or imply that a
click-through equals a WhatsApp membership. Until step 4 is verifiable, any statement
about joins is an estimate and must be labeled as one.

### Reporting cadence (recommended default)

Weekly during the pilot; monthly once the founding cohort is issued. Each review pairs the
numbers with one qualitative question: *what actually happened because of a connector this
month?*

## Governance and safeguards

These are the program's rules. Plain language on purpose.

1. **Miami Roots may deactivate any card or connector link at any time**, for any reason,
   including none.
2. **Participation is revocable** by either side, at any time, without penalty.
3. **Connectors cannot bind Miami Roots.** No connector may enter into agreements, make
   commitments, or accept obligations on behalf of Miami Roots.
4. **Connectors are not employees, contractors, agents, partners, or representatives.**
   They receive no wage, salary, or commission. Nothing in this program creates an
   employment or agency relationship.
5. **The community guidelines apply to everyone a connector invites, and to the connector.**
6. **No misleading promises.** Connectors may not promise access, perks, employment,
   income, status, or outcomes on Miami Roots' behalf.
7. **No discriminatory or exclusionary invitation practices.** Inviting selectively is the
   point; excluding people on the basis of who they are is not, and ends participation.
8. **No selling access.** Access to Miami Roots, its chats, its members, or its events may
   not be sold, traded, or bundled into anyone's paid offer.
9. **No unauthorized use of member data.** Member names, numbers, and chat contents are not
   a contact list. No scraping, exporting, or reuse.
10. **No copying or recreating the program's tracked assets.** Connector codes, card
    artwork, QR codes, and Miami Roots branding are not to be reproduced, imitated, or
    reused for anything else.

### Misuse response ladder

| Level | Example | Response |
|---|---|---|
| 1 — Clarify | Posted the link in one unrelated group chat | A direct message, no formality |
| 2 — Warn | Repeated mass-posting; overstated what Miami Roots offers | The written misuse warning (message pack), card stays active |
| 3 — Pause | Continued after a warning; a complaint from a member | Card set to `paused` — it still opens the door, credits nothing |
| 4 — Retire | Selling access, using member data, misrepresenting Miami Roots, discriminatory conduct | Card set to `retired`, graceful-removal message, code permanently reserved |

Level 4 does **not** require the ladder to be walked in order. Serious misuse goes straight
to retirement.

### Legal review needed

The following are drafted in plain language by non-lawyers and **must be reviewed by a
qualified attorney before any real-world commitment is made**, particularly before any
performance-based benefit is offered:

- The "not employees, not agents, cannot bind" language above and in the connector guide.
- Whether the benefits package could be construed as compensation in Florida.
- The consent and retention language on the nomination form, against applicable privacy law.
- Any future partner-perk arrangement where a third party gives something of value.

Nothing in this document is legal advice, and no part of it should be treated as legally
verified.

## Multi-city expansion posture

The model must be able to become NYC Roots, Austin Roots, and others without redesign — but
none of that is built now, and premature multi-city machinery would be waste.

**What has already been kept open by design:**

- Connector codes are opaque and city-agnostic (`fc001`, `djmarcus`), so a city prefix or a
  separate namespace can be introduced later without invalidating existing codes.
- Card destinations are a closed union of internal targets, so a card can be re-pointed at a
  city page the day one exists — including cards already printed.
- Card destinations are per-card, so a New York cohort can land somewhere different from
  the Miami cohort while sharing everything else.
- Scan events carry the card code, so per-city and per-cohort reporting is a query, not a
  schema change.
- Nothing in the schema or the URL structure assumes one city.

**What is deliberately not built:** city columns, city routing, per-city domains, traveler
pre-arrival flows, and cross-city connector recognition. Each becomes real when a second
city does.

**The one rule to preserve:** a card code must never be reused across cities. Codes are
globally unique, forever.

## Founder decisions treated as governing

Recorded here because the program is built on them:

1. The program is called **Miami Roots Founding Connectors**; participants are **Founding
   Connectors**.
2. The first cohort is **curated and invitation-led**.
3. NFC and QR lead through **Miami Roots-owned tracked links**, never a raw WhatsApp invite.
4. The **General Chat remains the primary initial destination**.
5. Specialized chats emerge from **demonstrated demand**.
6. The program values **meaningful connections over raw referral volume**.
7. **Trusted community leaders** are the initial distribution layer.
8. The system should eventually scale into a **multi-city Roots network**.
9. Referral attribution should support **future business and event partnerships**.
10. **Privacy must be preserved.**

## Relationship to other documents

- [`../05-operations/founding-connectors-operations.md`](../05-operations/founding-connectors-operations.md) — how the program is run
- [`../05-operations/founding-connectors-message-pack.md`](../05-operations/founding-connectors-message-pack.md) — the eight reusable messages
- [`../04-design/founding-connector-card-spec.md`](../04-design/founding-connector-card-spec.md) — the physical card
- [`../08-delivery/founding-connectors-mvp.md`](../08-delivery/founding-connectors-mvp.md) — what was built, and what is still owner-gated
- [`community-guidelines.md`](community-guidelines.md) — the rules every invited person agrees to
- [`referral-and-rewards-concept.md`](referral-and-rewards-concept.md) — the separate member points system
- [`../03-architecture/privacy-and-safety.md`](../03-architecture/privacy-and-safety.md) — why the tracking is this thin
