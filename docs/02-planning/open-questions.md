---
title: Open Questions
type: planning
status: active
owner: unassigned
created: 2026-07-16
updated: 2026-08-03
tags: [planning, open-questions]
---

## Purpose

Tracks questions that are genuinely unresolved — not yet answered by the founding brief,
an assumption, or a decision — so nobody has to silently guess an answer while
implementing.

## What belongs here

- A specific, answerable question
- Why it matters / what it blocks
- Status (open / answered, and where the answer landed)

## What does not belong here

- Assumptions someone has already made to move forward (see
  `docs/00-context/assumptions.md`)
- Settled decisions (see `docs/07-decisions/decision-log.md`)

## Known initial information

Status legend: **Open** — no answer proposed. **Recommended default** — the 2026-07-16
planning pass proposed an answer (linked); implementation may proceed on it, but it is
*not* an owner decision until ratified in the decision log.

| # | Question | Why it matters | Status |
|---|---|---|---|
| 1 | Does a Visitor/Member need an authenticated account, or can onboarding and referral-link retrieval work without login (e.g. magic link only when needed)? | Shapes the entire auth architecture and Supabase RLS design. | **Recommended default:** anonymous onboarding, staged magic-link activation after verification — `docs/03-architecture/identity-and-authorization.md` |
| 2 | What lightweight onboarding fields are actually required (name, phone, email, interests, group selection — what's mandatory vs. optional)? | Directly defines the onboarding form and initial schema. | **Recommended default:** field-by-field spec in `docs/01-product/onboarding-specification.md` |
| 3 | How is a "verified join" actually confirmed in practice — manual admin check against WhatsApp group membership, a WhatsApp Business API integration, or something else? | Major architectural and operational decision; affects feasibility and admin workload. | **Recommended default:** manual admin check against participant list, product-assisted — `docs/05-operations/membership-verification.md`; API integration future-only |
| 4 | What specific actions earn points, and how many? | Needed before rewards can be implemented at all. | **Recommended default (values need owner ratification before member visibility, gate at M11):** `docs/01-product/referral-and-rewards-concept.md` |
| 5 | What do rewards actually consist of (discounts, merch, access, recognition)? | Needed before a redemption flow can be designed. | Open — gates M13 (redemption deliberately post-MVP) |
| 6 | How are WhatsApp invite links kept current without leaking or going stale — manual admin rotation, or something automated? | Directly affects `docs/05-operations/chat-link-management.md` and trust/safety. | **Recommended default:** manual rotation with server-only storage, gated reveal, audit, quarterly + incident rotation — `docs/05-operations/chat-link-management.md` |
| 7 | What's the retention definition — active in the group, active on the site, or something else? | Needed before retention can be tracked or rewarded. | **Recommended default (interim):** still present in the group at +14 days, admin-confirmed; richer definition deferred to Phase 2 |
| 8 | Who are the actual initial administrators, and what's the expected admin tooling access model (dashboard in-app vs. spreadsheet-first while manual)? | Shapes whether an admin UI is even in the first build. | Partially open — **recommended default:** Supabase dashboard until M8, then in-app admin UI; *who* the admins are remains an owner decision needed by M8 |
| 9 | Is there an existing brand guide beyond the concept logos already in this repo (exact colors, type, spacing)? | Needed to finalize `docs/04-design/brand-foundation.md`. | Open (sampled values recorded, not ratified) |
| 10 | Two supplied logos display sub-brand names that differ from group operating names ("Daytime Roots" vs Daytime Events; "Nightlife Roots" vs Nightlife & Event Marketing) — which naming should the gateway display, and do the WhatsApp groups themselves use the "… Roots" names? | Affects group display names, slugs, copy, and whether logos or names get revised. See `docs/00-context/whatsapp-community-inventory.md`. | Open — owner decision, ideally by M2 |
| 11 | Should the attribution window (30 days) and maturation retention window (14 days) stay at the recommended defaults? | Tunes fairness vs. gaming; cheap to change pre-launch, disruptive after. | **Recommended default:** 30/14 — `docs/03-architecture/referral-system.md` |
| 12 | Is third-party product analytics enabled at launch, or first-party only? | Privacy posture and script weight vs. convenience. | Open — decision gate at M14; first-party events are canonical either way |
| 13 | Public/opt-in connector leaderboard — ever, and if so when? | Motivation vs. privacy and volume-gaming pressure. | Open — **default is no leaderboard**; revisit post-MVP with real data. Reaffirmed by the Founding Connectors program design (2026-08-03) |

Added during the Founding Connectors pass (2026-08-03):

| # | Question | Why it matters | Status |
|---|---|---|---|
| 14 | Is `myroots.dev` registered and pointed at this deployment? | Card URLs are specified as `myroots.dev/r/<code>`. A card printed with the wrong domain is permanently broken — this blocks printing, not building. | Open — **blocking a print run**; see assumption 16 |
| 15 | Should a Founding Connector card and a member referral link (`/r/<slug>`, M5) eventually be the same identity, or stay separate? | They currently share the `/r/` prefix but are separate systems. If they should converge, that shapes M5's design. | Open — **default is separate**; decide before M5 is built. See assumption 20 |
| 16 | Do connector benefits (early access, priority, perks, guest passes) create any compensation or tax exposure in Florida? | Determines whether the benefits table can stand as written, and gates any future performance-based reward. | Open — **needs an attorney**, not an internal answer |
| 17 | Cohort size, benefits list, nomination retention windows (12 mo / 6 mo declined), and review cadence — keep the recommended defaults? | Cheap to change now; disruptive once connectors have been told. | **Recommended default:** as specified in `docs/01-product/founding-connectors-program.md` |

Added during the community-first redesign (2026-08-16):

| # | Question | Why it matters | Status |
|---|---|---|---|
| 18 | The site now says a way to credit people who bring others in is coming "later this year". Is that a commitment, and roughly when? | It is public copy on the home and invite pages. If the answer is "not this year", the line has to come down before it becomes a broken promise. The mechanics themselves are Q#4 and Q#5; this question is only about the public statement. | Open — **owner decision**. Nothing is tracked or accrued today, and the copy deliberately says so. |
| 19 | Do the seven rooms stay unreachable from the website permanently, or only until the community is bigger? | `/go/<chat>` routes still resolve for links already in the world, but nothing on the site points at them. If per-room joining ever returns, it returns as a decision, not by a component quietly regaining a button. | Open — **default is permanent**; the redesign is built on it (decision log 2026-08-16). |
| 20 | Should `/invite` stay open to anybody, or eventually require being a member? | Today it hands out a public link with no gate, which is honest because there is no account system. Once M6 onboarding exists, gating it becomes possible, and the question is whether it is worth the friction. | Open — **default is stay open**; revisit at M6. |

## Relationship to other documents

Answering a question here should either update `docs/00-context/assumptions.md` (if it's a
working assumption for now) or `docs/07-decisions/decision-log.md` (if it's a real,
committed decision) — and then be marked answered here with a pointer.
