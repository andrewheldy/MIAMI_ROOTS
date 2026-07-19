---
title: Milestone 2.5 — Shareable Community Hub
type: delivery
status: active
owner: unassigned
created: 2026-07-18
updated: 2026-07-18
tags: [delivery, milestone-2.5, join-hub, whatsapp]
---

## Purpose

Record of the Milestone 2.5 delivery: the `/join` shareable hub — the primary link for
Instagram bios, QR codes, flyers, events, and partner outreach — and the `/go/<slug>`
controlled redirects that put real WhatsApp joining behind rotating server configuration.
Decision record: decision-log entry "Milestone 2.5 shareable hub" (2026-07-18).

## What shipped

### `/join` — the hub

A standalone, mobile-first page outside the `(site)` route group (no global header/footer):

- **Cinematic hero** — full-bleed media area with autoplaying, muted, looping,
  `playsInline` video when `public/media/miami-roots-hero.{webm,mp4}` exist; the poster
  (`…-poster.webp`, falling back to the committed community banner) covers loading,
  no-JS, reduced-motion, and missing-file states. Dark forest scrim keeps text readable.
  See [`../04-design/join-hero-media.md`](../04-design/join-hero-media.md) for how the
  owner supplies real footage.
- **Chat links** — six stacked, thumb-friendly cards (General Chat first, badged "Best
  place to start"; Ticket Exchange excluded), each reusing the group content module for
  name, description, and logo/monogram, linking to its `/go/` route.
  _Update 2026-07-19: Ticket Exchange was later approved as the seventh community and added
  to the hub (now seven cards; General Chat still first, Ticket Exchange with the
  event-oriented communities carrying a "Buy & sell safely" indicator). See the
  decision-log entry 2026-07-19 and `docs/08-delivery/frontend-nav-motion-ticket-exchange.md`._
- **Share control** — "Share Miami Roots": Web Share API where available, clipboard copy
  with visible "Link copied" feedback otherwise. No dependency added.
- **Trust note** — short, non-alarming pointer to `/guidelines` beside the chat list.
- **Hub footer** — logo/name, tagline, share, full-website and guidelines links.
- **Metadata** — route-specific title/description/canonical/OG image (community banner);
  sitewide `noindex` unchanged.
- **Motion** — gentle hero entrance and small card stagger, fully disabled under
  `prefers-reduced-motion`.

### `/go/<slug>` — controlled redirects

| Route                    | Group (content model)         | Env variable                       |
| ------------------------ | ----------------------------- | ---------------------------------- |
| `/go/general-chat`       | General Chat                  | `WHATSAPP_GENERAL_CHAT_URL`        |
| `/go/business-connections` | Business & Connections      | `WHATSAPP_BUSINESS_CONNECTIONS_URL` |
| `/go/daytime-events`     | Daytime Events                | `WHATSAPP_DAYTIME_EVENTS_URL`      |
| `/go/nightlife-events`   | Nightlife & Event Marketing   | `WHATSAPP_NIGHTLIFE_EVENTS_URL`    |
| `/go/community-organizing` | Community Organizing        | `WHATSAPP_COMMUNITY_ORGANIZING_URL` |
| `/go/sober-support`      | Sober Social                  | `WHATSAPP_SOBER_SUPPORT_URL`       |

Behavior: destination read from the server-only env var **per request**
(`force-dynamic`); accepted only if it is a well-formed `https://` URL whose exact
hostname is an approved WhatsApp domain (`chat.whatsapp.com`, `wa.me`, `whatsapp.com`,
`www.whatsapp.com`); otherwise a branded "isn't open right now" page renders instead of
a broken redirect. `/go` responses send `X-Robots-Tag: noindex, nofollow` and
`Referrer-Policy: no-referrer`. Unknown slugs 404. Invite URLs never appear in the
repository; tests enforce that the registry contains no URLs at all.

### Site wiring

- Header gained a filled **"Join the chats"** action; footer links to `/join`; the
  landing page's closing CTA now points at the hub (its "joining details are coming
  soon" copy was superseded by this milestone).
- App directory restructured into a `(site)` route group holding the existing pages'
  chrome; root 404 composes the chrome directly. No public URL changed.

## Verification

`npm run validate` (format → lint → typecheck → tests → build) plus focused unit tests:
`tests/unit/chat-links.test.ts` (registry contract, group resolution, exclusions, no
embedded URLs) and `tests/unit/chat-redirect.test.ts` (allowlist, scheme, lookalike-host
and userinfo tricks, missing/invalid handling). Runtime behavior — redirects, unavailable
states, reduced motion, poster fallback, mobile layouts — verified against a production
build.

## Owner actions

1. Set the `WHATSAPP_*_URL` variables in hosting (Vercel → Project → Environment
   Variables). Unset variables show that chat's unavailable state — safe to roll out
   gradually. _As of 2026-07-19 there are seven, including the added
   `WHATSAPP_TICKET_EXCHANGE_URL`._
2. Supply real hero footage per
   [`../04-design/join-hero-media.md`](../04-design/join-hero-media.md).
3. Voice-pass the hub copy (provisional, like all gateway copy — Q#9/Q#10 unchanged).

## Explicitly not in this milestone

No database, authentication, Supabase, analytics, QR generation, referral capture, or
the M3+ gated invite-reveal architecture. The env-var mechanism is the deliberate interim
until that ships.
