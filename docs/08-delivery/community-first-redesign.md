---
title: Community-First Redesign (owner-directed)
type: delivery
status: delivered
owner: unassigned
created: 2026-08-16
updated: 2026-08-16
tags: [delivery, frontend, design, whatsapp, sharing]
---

## Purpose

The delivery record for the 2026-08-16 owner-directed redesign of the public gateway: what
changed, what was decided, what was reviewed, and what the owner still has to do before it
works in production.

This pass is **not a milestone**. It does not advance M4 (database-backed content), M5
(referral capture), or M6 (onboarding), and it touches no database, migration, or RLS
policy. See [`implementation-plan.md`](implementation-plan.md) for the phase that is
actually current.

## What the owner asked for

Verbatim intent, recorded because every decision below traces to it:

- One big call to action to join the actual WhatsApp community.
- The website explains what the community is for, and what each chat is for, so people can
  find their people.
- It is also a way to reach across communities: leaders join to bring their people in and
  connect them with each other.
- Nobody joins individual chats from the site right now. They join the community, read the
  instructions, and invite their friends.
- The invite link must be copyable and shareable as a QR code, with clear calls to action
  to share.
- A points-for-invites program is likely, but undecided.

## What shipped

### One door

- `/go/community` is the single WhatsApp destination on the site, backed by the new
  server-only `WHATSAPP_COMMUNITY_URL` variable and the existing host allowlist. The
  registry lives in `src/content/join/community-link.ts` and, like the per-chat registry,
  contains no URL.
- One CTA component (`src/components/ui/join-action.tsx`), one label
  ("Join the community"), one destination, rendered by the header, the mobile sheet, every
  page close, and the footer. `src/config/navigation.ts` is the only place the label and
  href are written down.
- Every surface that follows it says "Opens WhatsApp. Free, and you can leave any time."
  next to the button rather than surprising people.

### No per-chat joining

- The "Join chat" control is gone from the room cards, the room detail pages, the home
  page, and `/join`. The site links to no individual chat anywhere.
- `/go/<chat>` routes still resolve. Those paths were printed on cards and pasted into
  messages before this pass, so breaking them would break real links in the world. Their
  unavailable state now points people at the community instead.
- `tests/unit/gateway.test.tsx` fails if any page ever links to a chat redirect again.

### The rooms, explained

- Two new fields on the content model, `forYouIf` and `whyItExists`, so each room is
  described by who belongs in it and why it was opened, not by what it contains.
- A new editorial grouping (`src/content/groups/clusters.ts`): "Where everybody lands",
  "Rooms for your week", "Rooms for what you are building". Seven flat rows read as a
  directory; three named clusters read as a map. Every published room must sit in exactly
  one cluster, enforced by test.
- All room copy was rewritten. It is still provisional pending an owner voice pass.

### Bringing people in

- `/invite` is new: the link, the QR, a message worth sending, and where invites actually
  land.
- `InvitePanel` (home and `/invite`) carries a live-generated QR, the plain copyable link,
  the native share sheet, the full-screen scan view, and the downloadable story and square
  cards.
- The visible, hand-copyable link is `https://miami-roots.vercel.app/join` with **no**
  campaign parameters. What is displayed is exactly what is copied. The QR and the native
  share sheet keep their existing campaign attribution, where nobody has to read it.
- The rewards line states intent, promises no mechanics, and says plainly that nothing is
  counted or tracked yet.

### Design system

- Three type roles (`--text-display`, `--text-title`, `--text-lede`) with fluid clamps and
  role-specific tracking, added to the existing token block in `src/styles/globals.css`.
  No branded typeface is licensed yet (open Q#9), so hierarchy is built from scale, weight,
  and tracking rather than from a display face.
- One new color, `--color-forest-900`, used only as the hero gradient floor.

## Design Intelligence

This pass also **integrated the project** with
[`design-intelligence`](https://github.com/andrewheldy/design-intelligence). Before it, the
project had no `docs/DESIGN_INTELLIGENCE.md`, which under that repository's integration
contract (§3) means it was not integrated and an agent had to say so rather than proceed as
if it were.

- Connection record: [`docs/DESIGN_INTELLIGENCE.md`](../DESIGN_INTELLIGENCE.md), pinned to
  commit `bf9b8b3b6997df3ab4d7958a9d1838d07c50470a` (registry v2, 2026-07-26).
- Brief: [`docs/04-design/DESIGN_BRIEF.md`](../04-design/DESIGN_BRIEF.md). Loadout:
  `taste-skill` as the single opinion skill (marketing surface), `emil-design-skills` and
  `motion-intelligence` for motion, `a11y-specialist-skills` behind the accessibility
  review. Dials 7 / 3 / 3, reasoned in the brief.
- Five standing exceptions recorded (EX-1 to EX-5): system font stack, no icon library, no
  dark theme, no stock or invented imagery, and typographic explanatory sections.
- Reusable-findings staging: [`docs/04-design/design-findings.md`](../04-design/design-findings.md).
- Nothing was installed. No skill, no script, no registry content copied into this
  repository.

## Motion

Entered at `motion-director`, step 1: what goes wrong for the user without new motion?
Nothing. **Outcome: `engine: none` for new motion.** No animation was added by this pass.
The existing approved patterns are reused unchanged (`join-rise` CSS entrance, the
`MotionReveal` and `StaggerReveal` islands, the mobile-nav sheet), each of which already
carries its own reduced-motion handling. No motion spec was produced because no motion was
specified, so the Motion Reviewer did not run.

One motion change was subtractive: `whileTap` was removed from the room card, because
Motion adds `tabIndex={0}` to an element carrying a tap gesture, which put a focusable
element with nothing to activate in front of the card's own link on every keyboard pass.

## Review

Reviewers were run per the connection record's routing. Evidence is browser-based, not
code-read: Chromium via Playwright against the production build.

### Accessibility Reviewer

**Verdict: no blockers.**

| Check | Result |
|---|---|
| axe-core (wcag2a/2aa/21a/21aa/22aa + best-practice), 6 routes × 2 viewports | **0 violations** after the two fixes below |
| Keyboard walk, home / rooms / invite / join | Every interactive element reachable and operable, order matches reading order, no traps, **visible focus ring on every stop** |
| Contrast | Mint on forest 7.1:1, white on forest 12:1, muted on white 6.2:1, muted on mint 5.5:1, white/60 disclosure on forest 5.3:1. All pass AA |
| Reduced motion | Captured at 375px with `prefers-reduced-motion: reduce`: all content rendered, static, fully visible |
| Target size (2.5.8) | Primary actions ≥48px. Room-name heading links are 21px tall and pass on the spacing exception; padding was added anyway to bring them to ~29px |

Two findings were raised and fixed in this pass:

1. **Heading order on `/groups`** (moderate): room cards rendered `h3` directly under the
   page `h1`. The card now takes a heading level, and the directory passes `h2`.
2. **Nested complementary landmark on `/guidelines`** (moderate): `Notice` rendered an
   `<aside>` inside a section, putting a landmark where assistive tech does not expect
   one. It is a `<div>` now; the notices are part of the section's argument, not asides.

### Mobile UX Reviewer

**Verdict: no blockers.** Tested at 320, 375, and 430 px.

- **Zero horizontal scroll** on all six routes at all three widths.
- Primary action is full-width and inside thumb reach on every page.
- The invite panel reorders on a phone so the QR sits directly under the share actions,
  which is the order somebody standing next to a friend actually needs; the rewards note
  moved below both columns so it never competes with the tools.
- Body text is ≥16px throughout, so iOS does not zoom on focus.
- Safe-area insets respected on `/join` and the dialogs.

### Anti-Slop Reviewer

**Verdict: DISTINCTIVE.** Checked against the tell list, with the brief's chosen
constraints excluded per the reviewer's own rule.

- No three-equal-card section anywhere. The old "how it works" trio is gone.
- Six layout families across seven sections on the home page: dark asymmetric hero,
  editorial prose, clustered room map, dark two-column band, editorial ordinal index,
  split invite panel, plain close.
- **Zero em-dashes** in every rendered page, enforced by test.
- One accent color used identically. One radius vocabulary. One theme.
- No decorative SVG, no invented people, no fabricated metrics or testimonials, no member
  counts.
- The swap-the-logo test: the copy names Miami, WhatsApp, run clubs at 7am, the ticket you
  need by 8pm, and a city that assumes a drink in your hand. It would not survive a logo
  swap, which is the point.

Two deliberate deviations from `taste-skill`, both recorded rather than hidden:

- **A line under the hero CTA.** The skill bans taglines below CTAs. "Opens WhatsApp.
  Free, and you can leave any time." stays because it discloses what the link does before
  somebody taps it, which matters more here than the rule it breaks.
- **Explanatory sections carry no imagery.** Follows from EX-4: this is a real community
  and no invented or stock photography may appear. The hero, the invite panel, and the
  room list carry the real assets the project owns.

## What the owner still has to do

1. **Set `WHATSAPP_COMMUNITY_URL` in hosting** to the parent WhatsApp Community invite. It
   is the only thing standing between this build and a working join button. Until it is
   set, the primary action renders its honest unavailable state on every page. The link
   must never be committed to this repository (see
   [`chat-link-management.md`](../05-operations/chat-link-management.md)).
2. **Read the copy back.** Every user-facing string on the redesigned surfaces is new and
   still provisional pending an owner voice pass (Q#9).
3. **Answer Q#18**: is "later this year" true for the rewards program? It is public copy
   now.

## Screenshots

`docs/08-delivery/screenshots/community-first/`, captured from the production build at
1440px and 375px, plus a 375px reduced-motion capture of the home page.

## Relationship to other documents

- [`../DESIGN_INTELLIGENCE.md`](../DESIGN_INTELLIGENCE.md) — the connection record this pass created
- [`../04-design/DESIGN_BRIEF.md`](../04-design/DESIGN_BRIEF.md) — the brief the work was built and accepted against
- [`../07-decisions/decision-log.md`](../07-decisions/decision-log.md) — the decisions recorded here
- [`milestone-2-5-shareable-hub.md`](milestone-2-5-shareable-hub.md) — the `/join` hub this pass rebuilt
- [`community-share-feature.md`](community-share-feature.md) — the share feature this pass extended
- [`../05-operations/chat-link-management.md`](../05-operations/chat-link-management.md) — the link rules the new variable obeys
