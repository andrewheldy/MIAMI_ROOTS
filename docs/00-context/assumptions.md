---
title: Assumptions
type: context
status: active
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [context, assumptions]
---

## Purpose

A single place to record assumptions made during repository foundation and early planning
— things treated as true for planning purposes but not actually confirmed by the project
owner. This exists specifically so assumptions don't get silently promoted to decisions.

## What belongs here

- Any assumption made to fill a gap in the source brief
- The date and reason an assumption was made
- Whether it has since been confirmed, changed, or superseded by a decision

## What does not belong here

- Confirmed facts (state those directly in the relevant doc)
- Settled decisions with a rationale (see `docs/07-decisions/decision-log.md`)
- Open questions that haven't even been provisionally answered (see
  `docs/02-planning/open-questions.md`)

## Known initial information

Assumptions made while establishing this repository (2026-07-16), pending confirmation:

1. **Group list is provisional.** The six community groups in
   `docs/00-context/community-groups.md` are treated as the current, real set, but exact
   names, count, and descriptions may change before or during build — this repo reflects
   what was provided at founding, not a locked spec.
2. **Brand assets are approved for production use, but no brand guide exists.**
   *(Updated 2026-07-16.)* The owner confirmed the supplied Miami Roots logos and subgroup
   assets are approved production assets (unless clearly screenshots, references, drafts,
   or alternates — none of the five supplied files were). Color values have since been
   measured by sampling the files (see `docs/04-design/brand-foundation.md`) but no
   ratified brand guide, canonical hex pair, or typeface decision exists yet.
3. **"Ticket Exchange" is a future group, not a current one.** A concept logo for it exists
   in the same asset drop as the current group logos, but the brief explicitly places
   ticket resale out of scope for the initial six groups. Treated as future-phase only.
4. **Points/rewards mechanics are undefined.** The brief specifies principles (append-only
   ledger, contribution-based, not click-only) but no concrete point values, reward catalog,
   or redemption flow. Nothing here should be read as specifying those.
5. **No legal/compliance review has happened.** Anything related to privacy, data
   retention, or messaging compliance (e.g. WhatsApp's own terms around automated invite
   handling) is unverified and should be treated as a research item, not a constraint
   that's already been checked (see `docs/06-research/research-backlog.md`).
6. **Single-market implementation, future multi-city model.** *(Superseded in part
   2026-07-17.)* The current product and all current claims remain Miami/South Florida
   specific. The owner has since confirmed the longer-term ambition for a parent Roots
   brand with locally operated city chapters; no expansion market, timeline, operating
   model, or legal structure is decided yet.

Added during the MVP planning pass (2026-07-16):

7. **WhatsApp gives the app no dependable programmatic signals** (joins, membership,
   activity, invite attribution, webhooks). The architecture assumes the pessimistic
   case deliberately; validating any richer access is research backlog #1. If richer
   access exists, workflows relax — nothing breaks.
8. **Announced source material is treated as forthcoming, not present.** Group
   screenshots, a parent banner, and further assets were announced but not received as
   of 2026-07-16 (see `docs/00-context/source-material-register.md`); plans include
   fallbacks rather than waiting.
9. **Recommended defaults are not owner decisions.** The planning pass proposes defaults
   (auth model, onboarding fields, 30-day attribution / 14-day retention windows, point
   values, manual verification) labeled as such in
   `docs/02-planning/open-questions.md`; each needs ratification at its decision gate in
   `docs/08-delivery/implementation-plan.md` before it hardens.
10. **Admin capacity is small but sufficient for a manual verification loop** at current
    community scale. Unvalidated (no volume data); the funnel's admin-time-per-member is
    kept minimal by design, and this assumption is revisited with real queue metrics
    after launch.

Added during the Milestone 2 public-gateway implementation (2026-07-16):

11. **Milestone 2 public copy and supporting UI colors are implementation drafts, not a
    brand ratification.** The attached redesign brief authorizes the public-gateway build
    and supplies its messaging direction, but it does not resolve open naming question
    #10, approve final member-facing copy, or ratify canonical brand colors. The six
    typed group records therefore keep the operating names from
    `community-groups.md`; all new copy is derived from approved repository purposes and
    rules; the gold/coral/sky/lime/lavender supporting tones are centralized provisional
    UI tokens; and the guidelines page is explicitly versioned
    `2026-07-16-draft.1`. No WhatsApp invite URL or live onboarding destination is
    exposed before the later gated milestones.

Added during the owner strategy interview and public-site expansion (2026-07-17):

12. **MyVerse and Sidequests are future product relationships, not live integrations.**
    The owner described MyVerse as a future distribution layer and Sidequests as a source
    of richer context/activity discovery. Their ownership, data flow, naming, routes, and
    technical integration remain undefined. The public site may label the intended
    relationship as future-facing but must not imply either integration works today.
13. **No direct public inquiry channel is confirmed.** A publication-safe email address,
    form endpoint, downloadable partnership brief, and operating entity are not yet
    confirmed. The contact experience therefore routes visitors to relevant information
    and uses an explicit prelaunch empty state instead of inventing a contact address or
    accepting data without an owner-controlled destination.

## Relationship to other documents

When an assumption here is confirmed or changed, either update it in place (with an updated
`updated` date) or move it to `docs/07-decisions/decision-log.md` if it becomes a real
decision, and mark it superseded here.
