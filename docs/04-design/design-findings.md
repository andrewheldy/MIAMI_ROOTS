---
title: Design Findings (staging for Design Intelligence)
type: design
status: active
owner: unassigned
created: 2026-08-16
updated: 2026-08-16
tags: [design, design-intelligence, findings]
---

## Purpose

Staging area for design lessons learned in Miami Roots that might be **reusable** by another
venture with a different brand. Required by the Design Intelligence integration contract
(§3, §9) at the ref pinned in [`docs/DESIGN_INTELLIGENCE.md`](../DESIGN_INTELLIGENCE.md).

A finding belongs here only if it would still be true for a different product with a
different brand. Everything project-specific stays in
[`docs/07-decisions/decision-log.md`](../07-decisions/decision-log.md) instead.

Nothing here is submitted upstream automatically. Promotion happens by opening a pull
request or issue against `andrewheldy/design-intelligence` with the evidence, per contract
§9. Never commit to that repository's `registry.yaml`, `agents/`, or `skills/` from this
project.

## Candidate findings

### 2026-08-16 — A privacy-bound product cannot satisfy the "real images" rule as written

**Evidence.** Miami Roots is a real WhatsApp community of real people. `taste-skill` §4.8
requires every section to carry a real visual and offers Picsum/Unsplash placeholders as the
second-best option. Both branches are unavailable here: stock photos of invented "members"
would misrepresent a real community, and no member photography is cleared for public use.
Recorded as exceptions EX-4/EX-5 rather than silently ignored.

**Why it may generalize.** Any community, health, legal, recovery, or minors-facing product
hits the same wall. The rule's underlying intent (pure-text pages read as unfinished work) is
sound; the prescribed remedies assume a product that may show invented people.

**Proposed shape if promoted.** A note in the Anti-Slop Reviewer spec: when a project's
exceptions bar invented or stock imagery, "text-only section" stops being a tell on its own,
and the reviewer should test instead for whether *some* real asset the project genuinely owns
(brand marks, generated codes, owned photography, real data visualizations) carries the page.

**Status:** candidate. Not yet proposed upstream. Needs a second venture's evidence before it
is worth a spec diff.

### 2026-08-16 — "One design-opinion skill" needs a companion rule for one conversion action

**Evidence.** The strongest structural improvement in this pass was not typographic: it was
collapsing four competing calls to action ("Join the community chats", "Explore the groups",
"Join chat" per group, "Share Miami Roots") into a single labelled action repeated verbatim.
`taste-skill` has NO DUPLICATE CTA INTENT, which catches two labels for one intent, but not
the inverse failure this project had: several genuinely different intents competing at equal
visual weight on the same screen.

**Why it may generalize.** The failure is structural, not stylistic, and is common on
pre-launch marketing sites where every surface was built in a different milestone.

**Proposed shape if promoted.** A check in the Anti-Slop or Design Director spec: count the
distinct actions offered above the fold and at the close of the page; more than one primary
action per page needs an articulated reason in the brief.

**Status:** candidate. Not yet proposed upstream.
