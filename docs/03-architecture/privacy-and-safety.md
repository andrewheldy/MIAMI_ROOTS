---
title: Privacy and Safety
type: architecture
status: draft
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [architecture, privacy, safety]
---

## Purpose

Names the privacy, consent, moderation, spam-prevention, and invite-link-leakage concerns
that need intentional design before the product handles real member data — flagged early so
they aren't bolted on after the fact.

## What belongs here

- Concerns and constraints, stated plainly
- Where a concern is genuinely unresolved, a pointer to the open question

## What does not belong here

- A finished privacy policy or terms of service (not started — would be a research/legal
  item, see `docs/06-research/research-backlog.md`)
- Moderation SOPs (see `docs/05-operations/moderation.md`)

## Known initial information

Per the founding brief, these must be **designed intentionally**, not left implicit:

- **Member privacy.** Onboarding captures personal info (name, contact details, interests
  at minimum — exact fields TBD, see `docs/02-planning/open-questions.md`). This data
  should be handled with real row-level security (Supabase RLS) so members and admins see
  only what they should.
- **Consent.** Members should knowingly agree to how their information is used (e.g.
  referral attribution being visible to admins, points/contribution data being tracked).
- **Moderation.** The community groups need moderation norms and a way to act on
  violations (see `docs/01-product/community-guidelines.md` and
  `docs/05-operations/moderation.md`).
- **Spam prevention.** Both the onboarding form and referral link generation are potential
  spam/abuse vectors (e.g. fake submissions to farm referral credit) and need basic
  safeguards.
- **Invite-link leakage.** Because raw WhatsApp invite links are not meant to be permanent
  public assets (see `docs/03-architecture/data-principles.md`), the system needs to guard
  against them being scraped, cached publicly, or shared outside the intended flow.

None of these have concrete mitigations designed yet — this document exists to make sure
that work doesn't get skipped, not to claim it's done.

## Relationship to other documents

- `docs/03-architecture/data-principles.md` — the data-shape side of these concerns
- `docs/05-operations/chat-link-management.md` — invite-link leakage in operational terms
- `docs/05-operations/moderation.md` — moderation in operational terms
- `docs/06-research/research-backlog.md` — where legal/compliance research would be tracked
