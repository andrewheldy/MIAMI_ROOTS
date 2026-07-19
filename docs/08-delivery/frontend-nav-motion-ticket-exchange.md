---
title: Frontend Pass — Navigation, Motion, Community Chat Access & Ticket Exchange
type: delivery
status: active
owner: unassigned
created: 2026-07-19
updated: 2026-07-19
tags: [delivery, frontend, navigation, motion, whatsapp, ticket-exchange]
---

## Purpose

Record of a focused frontend experience pass on top of Milestones 2, 2.5, and 3: a
responsive hamburger navigation, a restrained Framer Motion (`motion` package) interaction
system, a centralized group→chat resolver, homepage/visual-rhythm refinements, and the
addition of **Ticket Exchange** as the approved seventh community. No Supabase schema,
migrations, RLS, auth, service-role boundaries, or other-milestone work were touched.

Decision records: decision-log entries **2026-07-19** (Ticket Exchange approved; Framer
Motion adopted).

## What shipped

### Responsive navigation

- **`src/config/navigation.ts`** — one source of truth for nav links + the dominant
  "Join the community chats" CTA, shared by the desktop header, mobile menu, and footer.
- **`site-header.tsx`** is now a lightweight sticky client header: a clean horizontal
  desktop bar (Groups · Community guidelines · **Join the community chats**) at `lg+`, and
  logo + wordmark + hamburger below `lg` (covers phones and tablets). It gains a subtle
  bottom border/shadow after scroll (no heavy glassmorphism) and honors the top safe area.
- **`mobile-nav.tsx`** — a branded sheet that drops from the header with a dimmed backdrop.
  The hamburger morphs to a close icon; links stagger in; the Join CTA is the dominant
  action. Closes on link select, Escape, backdrop (outside) click, route change, and resize
  to desktop; locks body scroll while open; moves focus into the panel and restores it to
  the button on close; traps Tab within the panel; full `aria-expanded`/`aria-controls`
  wiring and ≥44px targets.

### Motion system (`motion`, `motion/react`)

- **`src/components/motion/`** — shared easing/duration tokens plus `MotionReveal`
  (viewport reveal) and `StaggerReveal` (staggered children) client wrappers. Applied to
  the hero entrance, section reveals, card grids, the mobile menu, and the Ticket Exchange
  safety reveal. `CommunityCard` gained a small hover lift + press feedback; `ActionLink`
  gained a CSS-only press scale.
- **Reduced motion:** every wrapper checks `useReducedMotion()` and renders the finished
  state immediately with no transform (no replacement movement). Durations stay in the
  160–600ms bands; opacity/translate/scale only.
- **Boundaries:** pages stay Server Components; motion lives in narrow client wrappers that
  receive already server-rendered children. No public content fetching or server env access
  moved into client code.

### Group → chat resolution (unchanged security model)

- **`src/content/join/chat-links.ts`** is the single centralized resolver:
  `getChatLinkByRedirectSlug`, `getChatLinkByGroupSlug`, and `getGoPath(groupSlug)`
  (group → `/go/<slug>`). Group cards, detail pages, the homepage, `/join`, and the tests
  all resolve through it — no duplicated lookup maps.
- Invite links remain **server-only** `WHATSAPP_*_URL` variables behind validated
  `/go/<slug>` redirects (`resolveChatDestination`). The registry holds names only — no
  URLs — enforced by tests. Missing/invalid config still shows the branded unavailable
  state.

### Ticket Exchange — the seventh community

- Added to the content model (`ticket-exchange`, existing logo asset, new `events`
  category) and the chat registry (`/go/ticket-exchange` ←
  `WHATSAPP_TICKET_EXCHANGE_URL`), positioned with the event-oriented communities so it
  never displaces General Chat. It appears in the groups directory, homepage preview,
  `/join`, and its own detail page.
- **Peer-to-peer framing + safety:** a typed `safety` block (badge "Buy & sell safely",
  one-line summary, verification checklist, non-guarantee disclaimer) surfaces concisely on
  the group card, homepage preview, `/join` card, and the `/go/ticket-exchange` unavailable
  state; the detail page carries the fuller checklist, the disclaimer, and a prominent link
  to the community guidelines (which also gained a Ticket Exchange safety note). Miami Roots
  is never presented as seller, broker, guarantor, escrow, or payment processor.

### Homepage & visual rhythm

- Hero tightened for mobile (smaller logo, one supporting paragraph, CTAs near the top of
  the first viewport) with a coordinated entrance. Primary CTA **Join the community chats**
  → `/join`; secondary **Explore the groups** → `/groups`. Closing CTA copy matched.
- Community preview cards now carry two distinct, touch-friendly actions (whole-card →
  detail via a stretched link, plus a separate **Join chat** → `/go`). Brand message
  preserved (community rooted in Miami, real relationships, shared opportunities, business,
  wellness, nightlife, volunteering, everyday life, "we rise together").

## Owner actions

1. Set **`WHATSAPP_TICKET_EXCHANGE_URL`** in the production and preview environments
   (Vercel → Project → Environment Variables) to the approved Ticket Exchange WhatsApp
   invite URL. Until set, `/go/ticket-exchange` shows the branded unavailable state. Do not
   commit the value — it is server-only, like the other six.
2. Voice-pass remains open on all provisional copy (Q#9/Q#10 unchanged).

## Explicitly not in this pass

Supabase schema/migrations/RLS/auth/service-role boundaries; the palette (Q#9) and group
display names (Q#10); the site's `noindex` status; any Milestone 4+ (DB-backed content),
M5 (referral capture), or later work. No raw WhatsApp invite URL entered code, client
bundles, source maps, or Git history.
