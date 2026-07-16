---
title: Open Questions
type: planning
status: active
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
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

| # | Question | Why it matters | Status |
|---|---|---|---|
| 1 | Does a Visitor/Member need an authenticated account, or can onboarding and referral-link retrieval work without login (e.g. magic link only when needed)? | Shapes the entire auth architecture and Supabase RLS design. | Open |
| 2 | What lightweight onboarding fields are actually required (name, phone, email, interests, group selection — what's mandatory vs. optional)? | Directly defines the onboarding form and initial schema. | Open |
| 3 | How is a "verified join" actually confirmed in practice — manual admin check against WhatsApp group membership, a WhatsApp Business API integration, or something else? | Major architectural and operational decision; affects feasibility and admin workload. | Open |
| 4 | What specific actions earn points, and how many? | Needed before rewards can be implemented at all. | Open |
| 5 | What do rewards actually consist of (discounts, merch, access, recognition)? | Needed before a redemption flow can be designed. | Open |
| 6 | How are WhatsApp invite links kept current without leaking or going stale — manual admin rotation, or something automated? | Directly affects `docs/05-operations/chat-link-management.md` and trust/safety. | Open |
| 7 | What's the retention definition — active in the group, active on the site, or something else? | Needed before retention can be tracked or rewarded. | Open |
| 8 | Who are the actual initial administrators, and what's the expected admin tooling access model (dashboard in-app vs. spreadsheet-first while manual)? | Shapes whether an admin UI is even in the first build. | Open |
| 9 | Is there an existing brand guide beyond the concept logos already in this repo (exact colors, type, spacing)? | Needed to finalize `docs/04-design/brand-foundation.md`. | Open |

## Relationship to other documents

Answering a question here should either update `docs/00-context/assumptions.md` (if it's a
working assumption for now) or `docs/07-decisions/decision-log.md` (if it's a real,
committed decision) — and then be marked answered here with a pointer.
