---
title: System Context
type: architecture
status: proposed
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [architecture, system-context, whatsapp]
---

## Purpose

Describes how the Miami Roots gateway relates to WhatsApp and to the people using it —
the system boundary, what the app can and cannot know, and the funnel of observable
events the whole architecture is built around. Updated 2026-07-16 with the MVP planning
pass; statements about WhatsApp's capabilities are **assumptions requiring validation**
against current WhatsApp behavior (see `docs/06-research/research-backlog.md` #1) held
pessimistically on purpose.

## What belongs here

- Actors, systems, and the boundary between them
- The WhatsApp reality: what the app can observe vs. must be told
- The canonical funnel chain

## What does not belong here

- Table design (see [`data-model.md`](data-model.md))
- Integration specifics (see [`integrations.md`](integrations.md))

## System boundary

```
Visitor / Applicant / Member (mobile browser)
        │
        ▼
Miami Roots Gateway (Next.js on Vercel)
        │ ├─ Supabase Postgres: members, groups, memberships, referrals,
        │ │   points ledger, consent, events, audit (RLS everywhere)
        │ ├─ Supabase Auth: magic-link sessions for activated members + admins
        │ └─ generates: referral URLs, QR codes, sharing cards, OG images
        │
        ▼  (controlled, audited reveal — one gated hop)
WhatsApp invite links (WhatsApp-owned, rotatable, stored server-only)
        │
        ▼
WhatsApp Community & Groups  ←— Admins (humans) observe reality here
  General Chat · Business & Connections · Nightlife & Event Marketing
  Daytime Events · Community Organizing · Sober Social
```

**The community lives in WhatsApp; the gateway is the front door and the ledger of
record around it.** The gateway never controls WhatsApp membership — it controls access
to invite links and records what it can observe plus what admins attest.

## The WhatsApp reality (planning constraint)

The ordinary WhatsApp Community used by Miami Roots gives this application **no
dependable automatic access** to: member joins or join confirmations, group activity,
invite-link attribution, member retention, chat contents, or participant webhooks. The
architecture therefore assumes:

- The app's **last directly observable event** is the invite-link click-through
  (`/out/[membershipId]` redirect). Everything after that happens inside WhatsApp,
  invisible to the app.
- **Humans re-enter the loop as sensors:** an admin looking at the WhatsApp participant
  list is the verification mechanism. The product's job is to make that manual step
  cheap (phone number to match, one-tap verify, a queue).
- **Nothing may depend on WhatsApp pushing data to us.** Any future WhatsApp Business
  API integration is an optimization documented in
  [`integrations.md`](integrations.md) — explicitly **not** an MVP requirement or
  assumption.

## The canonical funnel chain

Every feature hangs off this observable/attested chain (states in
[`data-model.md`](data-model.md), events in
[`analytics-and-events.md`](analytics-and-events.md)):

```
referral landing-page visit          (observed: /r/<slug>)
  → attribution captured             (cookie / manual code)
  → onboarding started               (observed)
  → onboarding submitted             (observed, consent recorded)
  → subgroup selected                (observed, part of submission)
  → invite link revealed             (observed, gated + audited)
  → invite link clicked              (observed, last automatic signal)
  → membership manually verified     (attested by admin against WhatsApp)
  → membership retained (+14d)       (attested by admin)
  → referral matured                 (derived from verified + retained)
  → points made available            (ledger entry, idempotent)
```

The seam between **observed** and **attested** (invite click → verified) is the
architectural center of gravity: it is where manual workflow, audit, reversal, and
anti-gaming all concentrate.

## Stable URLs vs rotating links

The public Miami Roots URL space (`/`, `/groups/<slug>`, `/r/<slug>`, printed QR codes)
is permanent; WhatsApp invite links behind it rotate freely (see
[`../05-operations/chat-link-management.md`](../05-operations/chat-link-management.md)).
Nothing public ever embeds a raw invite link.

## Relationship to other documents

- [`data-model.md`](data-model.md) — the state machines behind the chain
- [`identity-and-authorization.md`](identity-and-authorization.md) — who the actors are
- [`integrations.md`](integrations.md) — WhatsApp/Supabase/Vercel specifics
- [`../05-operations/membership-verification.md`](../05-operations/membership-verification.md) — the human verification workflow
