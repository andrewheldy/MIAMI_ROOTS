---
title: Research Backlog
type: research
status: active
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [research]
---

## Purpose

Tracks questions that need actual external research — not just internal product judgment —
before they can be safely decided.

## What belongs here

- Questions requiring investigation of external facts, rules, or precedent (legal,
  platform policy, technical feasibility)
- Why it matters and what depends on it

## What does not belong here

- Internal product/design opinions or preferences (see
  `docs/02-planning/open-questions.md`)
- Findings once research is actually done — summarize those in the relevant doc and cite
  the source in `docs/06-research/source-register.md`

## Known initial information

| # | Item | Why it matters |
|---|---|---|
| 1 | WhatsApp's terms of service / policy around automated invite-link handling and any programmatic group-membership verification (e.g. WhatsApp Business API). | Directly determines whether automated verified-join tracking is even feasible or compliant (`docs/02-planning/open-questions.md`, #3). |
| 2 | Data privacy obligations that apply to collecting member onboarding info (e.g. what's required for a Florida/US-based community app collecting name, contact info). | Needed before onboarding data collection is finalized; affects `docs/03-architecture/privacy-and-safety.md`. |
| 3 | Whether a formal terms-of-service / privacy-policy page is legally necessary before launch, and what it needs to contain. | Needed before public launch; currently unaddressed. |
| 4 | Best-practice patterns for referral-link/QR-code systems that avoid common abuse vectors (self-referral, link farming). | Informs the anti-gaming considerations noted in `docs/01-product/referral-and-rewards-concept.md`. |

None of these have been researched yet as of 2026-07-16.

## Relationship to other documents

- `docs/06-research/source-register.md` — where findings' sources get tracked
- `docs/02-planning/open-questions.md` — internal counterpart to this backlog
