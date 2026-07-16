---
title: Privacy and Safety
type: architecture
status: proposed
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [architecture, privacy, safety, trust]
---

## Purpose

The privacy, consent, safety, and trust design for the MVP — expanded 2026-07-16 from a
list of concerns into concrete positions. Positions are **recommended defaults** unless
recorded as decisions; legal review remains an open research item
(`docs/06-research/research-backlog.md` #2–3) and nothing here is legal advice.

## What belongs here

- Data-handling positions: minimization, consent, retention, deletion
- Invite-link protection design
- Moderation, spam, harassment, and sensitive-group considerations
- What member trust requires the product to never do

## What does not belong here

- A finished privacy policy / ToS (legal work item)
- Moderation SOPs (see `docs/05-operations/moderation.md`)
- Table-level mechanics (see [`data-model.md`](data-model.md))

## Data minimization and consent

- **Collected at onboarding (and why):** see
  [`../01-product/onboarding-specification.md`](../01-product/onboarding-specification.md)
  — first name + phone (verification matching), optional email (account activation),
  optional Instagram (community connection), group selections, guideline acceptance.
  Deliberately **not** collected: DOB, address, gender, photos, employer, and anything
  health-related.
- **Sober Social sensitivity (hard rule):** selecting Sober Social is stored and treated
  as *interest in a group*, never as a sobriety, recovery, or health attribute. No copy,
  field name, analytics property, or admin note may characterize a member's sobriety
  status. The group's copy stays social, never clinical (see
  `docs/01-product/community-guidelines.md`).
- **Consent is versioned and logged:** guideline acceptance records the document version
  in append-only `consent_events`; consent copy states plainly what is tracked (referral
  attribution visible to admins and the referrer as name+status; participation/points
  tracking) — no dark patterns, no pre-ticked boxes.
- **Phone numbers** are the highest-sensitivity routine field: stored E.164 in `members`
  only, never in events/logs/analytics (masked last-4 where an admin UI needs a hint),
  never shown to other members (a referrer sees name + status, never contact info).
- **Instagram handles** are optional, member-editable, and shown only where the member
  can expect it (admin review; future member-directory is out of scope).

## Referral visibility and leaderboards

Referrers see the display name and funnel status of people they referred — this is
disclosed in consent copy. **Public leaderboards are not in MVP** (recommended default):
they create pressure toward volume-gaming and expose participation publicly. Any future
leaderboard is opt-in and shows connector names only, by explicit owner decision.

## Deletion, withdrawal, and retention

- **Deletion request** (via any channel while small; `member_deletion_requested`
  recorded): personal fields in `members`/`onboarding_submissions` are irreversibly
  anonymized; the UUID survives so the points ledger, audit log, and attribution history
  stay internally consistent without identifying anyone. WhatsApp-side departure is the
  member's own action; admins remove them from groups on request.
- **Consent withdrawal** short of deletion (e.g. contact consent): recorded in
  `consent_events`, honored in operations.
- **Retention defaults:** unverified submissions purge at 90 days; hashed network
  metadata at 30 days; consent and audit records persist (they are the proof of proper
  handling). Full per-table rules in [`data-model.md`](data-model.md).

## Invite-link protection (design summary)

Threat: invite links leaking → spam/abuse influx into the real community — the single
worst trust failure available to this product.

- **Storage:** server-only `group_invite_links` table; zero client-role policies; reads
  only inside the server-side reveal path; never in seed files, client bundles, tracked
  docs, logs, analytics properties, or error reports.
- **Reveal authorization:** a link is revealed only to a person whose membership request
  for *that group* an admin approved, via a single-purpose expiring token / session
  (route `/invite/[membershipId]`), with `Cache-Control: no-store` and every reveal
  audited (`invite_revealed` + audit twin).
- **Rotation & revocation:** versioned link rows; rotation replaces without touching any
  public URL; leak response = revoke in WhatsApp, rotate in DB, review reveal audit for
  the exposure window (runbook in
  [`../05-operations/chat-link-management.md`](../05-operations/chat-link-management.md)).
- **Redaction:** the reveal/redirect endpoints never log the destination URL; audit
  metadata carries link-version IDs, not URLs.
- **Permissions:** admins reveal/rotate; only owner changes who is an admin.

## Spam, abuse, and harassment

- **Onboarding spam:** rate limits per IP-hash, honeypot field, server validation,
  phone normalization + uniqueness, and a human approval gate before anything sensitive
  (the invite link) is disclosed — the approval step is the real firewall.
- **Referral gaming:** points only on matured (verified + retained) referrals;
  self-referral blocked; fraud signals surfaced to admins
  ([`referral-system.md`](referral-system.md)).
- **Harassment/moderation:** conduct moderation happens in WhatsApp
  (`docs/05-operations/moderation.md`); the gateway's obligations are: don't expose
  member data that enables harassment (no public member lists, no contact info anywhere
  member-facing), and give admins a member-notes/flag surface tied to the member record
  post-MVP.

## Administrator access and auditability

Admins see full PII by role; every privileged action writes the append-only audit log
(actor, entity, from→to, reason). Admin surfaces are server-rendered, never cached, and
deny-by-default. The owner reviews admin actions via `/admin/audit`; nothing offers
silent edits — corrections are visible corrections.

## Partner data sharing and the appearance of data exploitation

**Recommended default, stated bluntly: Miami Roots does not sell, rent, or share member
data with partners.** Future partner offers (roadmap phase 4) are presented *to* members
without transferring member data to partners. Copy throughout the product should make
the model obvious: data serves community operations, nothing else. This posture is
load-bearing for trust in a community whose ethos is anti-transactional.

## Exported WhatsApp source material

Screenshots/exports live only under untracked `inputs/` (see
`docs/00-context/source-material-register.md`); tracked docs carry only non-sensitive
transcriptions per the rules in
`docs/00-context/whatsapp-community-inventory.md`. Phone numbers, invite links, member
identities, and conversations never enter Git, the database seed, or analytics.

## Relationship to other documents

- [`../01-product/onboarding-specification.md`](../01-product/onboarding-specification.md) — field-by-field minimization
- [`data-model.md`](data-model.md) — retention, RLS, append-only mechanics
- [`../05-operations/chat-link-management.md`](../05-operations/chat-link-management.md) — leak runbook
- `docs/06-research/research-backlog.md` — pending legal/privacy research
