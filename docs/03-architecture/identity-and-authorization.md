---
title: Identity and Authorization
type: architecture
status: proposed
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [architecture, auth, authorization, roles]
---

## Purpose

Defines how people are identified and what each role may do in the Miami Roots gateway:
the authentication approach for each stage of the member journey, the role model, and the
deny-by-default authorization matrix that Supabase RLS policies and application
boundaries must implement. Everything here is a **recommended default** from the 2026-07-16
planning pass unless labeled otherwise — see `docs/07-decisions/decision-log.md` for what
the owner has actually ratified.

## What belongs here

- Authentication options compared, and the recommended MVP approach
- The role model and per-role authorization matrix
- Staged account activation and its rationale

## What does not belong here

- Onboarding form fields (see [`../01-product/onboarding-specification.md`](../01-product/onboarding-specification.md))
- Table-level RLS notes (see [`data-model.md`](data-model.md))
- Route-by-route access requirements (see [`application-architecture.md`](application-architecture.md))

## Authentication options considered

| Option | Friction | Security | Cost/complexity | Verdict |
|---|---|---|---|---|
| **No authentication during initial onboarding** | Lowest — no account wall before a person has any reason to want an account | Acceptable: onboarding creates a *request*, not access; nothing sensitive is readable back | None | ✅ **Recommended for the visitor/applicant stage** |
| Magic-link (email) authentication | Low — one email round-trip, no password | Good; Supabase-native | Low | ✅ **Recommended for member/admin sign-in, deferred to activation** (below) |
| Email one-time passcode (OTP) | Low, slightly clunkier than magic link on mobile | Equivalent to magic link | Low | Acceptable fallback where mail clients break magic links; same Supabase machinery — treat as a delivery detail, not a separate architecture |
| Phone-based identity (SMS OTP) | Low for a WhatsApp-centric audience | Good, and matches the phone-is-identity reality | **SMS provider cost + fraud surface (SMS pumping) + another vendor** | ❌ Not for MVP. Phone is collected and verified *operationally* (the admin sees the number join the group); paying for SMS auth duplicates that. Revisit post-MVP if email proves weak |
| Admin-created accounts | n/a for members (doesn't scale socially) | Fine for the handful of admins | Trivial | ✅ **Recommended for administrators/owner only** |
| Staged account activation after membership approval | Adds a step *after* value is delivered, not before | Strong: accounts exist only for real, verified members | Low | ✅ **Recommended as the core pattern** (below) |

### Recommended MVP approach (recommended default)

**Anonymous onboarding, staged activation, magic-link sign-in, admin-created admin
accounts.**

1. **Visitor → Applicant: no authentication.** The onboarding form is submitted
   anonymously (server-validated, rate-limited, consent-recorded). No Supabase Auth user
   is created. An applicant cannot read anything back, so there is nothing an account
   would protect yet.
2. **Applicant → Member: verification precedes identity.** When an admin verifies that
   the person actually joined a WhatsApp group (see
   [`../05-operations/membership-verification.md`](../05-operations/membership-verification.md)),
   the member record becomes eligible for activation.
3. **Member activation: email magic link.** If the member provided an email, the admin
   triggers (or the system sends, once automated) an invitation; signing in via magic
   link creates the Supabase Auth user and links it to the existing member record
   (`members.auth_user_id`). Members without an email can be invited to add one via
   WhatsApp conversation — a manual, human step, consistent with the community's manual
   operating model. Activation is what unlocks the Connector dashboard, referral link
   management, and points visibility.
4. **Admins/owner: pre-created accounts.** Created directly in Supabase Auth by the
   owner, flagged in `members.role`. No self-serve admin signup path exists at all.

Why this is the lowest-friction secure option: the public funnel (the thing that must
convert) has zero auth friction; accounts only exist for people who have already proven
membership, which shrinks the attack surface (no credential-stuffing target of value, no
bot-created accounts); and everything uses Supabase Auth primitives already in the
expected stack — no new vendor, no passwords to store, no SMS spend.

Failure mode acknowledged: email is optional at onboarding, so some verified members will
be un-activatable until they supply one. This is accepted for MVP — their membership,
attribution, and points accrue correctly regardless; activation only gates *seeing* the
dashboard. See [`../01-product/onboarding-specification.md`](../01-product/onboarding-specification.md).

## Role model

Roles evaluated: Visitor, Applicant, Member, Connector, Moderator, Administrator, Owner.

**Recommended consolidation (recommended default):**

- **Visitor** and **Applicant** are unauthenticated states, not stored roles — an
  applicant is simply a visitor with a submitted onboarding record.
- **Connector** is a *capability of Member*, not a separate role: every activated member
  gets a referral link and dashboard. A separate connector role adds a permission tier the
  MVP doesn't need. (If the owner later wants invitation to be a privilege, it becomes a
  flag, not a role.)
- **Moderator** is **deferred post-MVP**: moderation happens inside WhatsApp today
  (see [`../05-operations/moderation.md`](../05-operations/moderation.md)); the gateway has
  no member-generated content to moderate in MVP.
- Stored roles in MVP: **`member`**, **`admin`**, **`owner`** (a column on `members`,
  mirrored into JWT claims for RLS).

### Authorization matrix (deny by default)

Anything not listed is **denied**. "Own" means rows linked to the authenticated member.

| Role | May read | May create | May update | Never |
|---|---|---|---|---|
| **Visitor / Applicant** (anon) | Public group content (name, slug, descriptions, rules, CTA, logo/banner paths) of `active` groups; legal pages; own just-submitted confirmation state via one-time token | Onboarding submission (rate-limited); referral-visit event (server-recorded) | Nothing | Invite links; any member/referral/points data; other submissions; admin surfaces |
| **Member** (activated) | Own member record; own group memberships and their statuses; own referral link + slug; own attributions (who they referred: display name + status only); own points ledger and balance; public group content | Referral-slug change request (if allowed); reward redemption request (post-MVP) | Own limited profile fields (display name, Instagram, email) | Other members' contact info; anyone else's ledger; invite links (except via the gated reveal flow for groups they're approved to join); audit log; admin queues |
| **Admin** | All members, submissions, memberships, attributions, ledger entries, events, audit log; invite links | Verifications, corrections, manual point adjustments, invite-link rotations, member invitations | Membership/attribution/ledger state via defined transitions (all audited) | Deleting audit rows; editing ledger rows in place (append-only corrections only); reading Supabase service credentials from the app |
| **Owner** | Everything an admin reads | Admin accounts; rewards catalog; group create/archive | Admin role assignments; global settings | Same immutability limits as admin — the append-only rules bind the owner too |

Enforcement layers, in order: Supabase RLS (primary, table-level — see
[`data-model.md`](data-model.md)), server-side route/action guards (admin routes check
role before rendering or acting), and the client never receiving fields it shouldn't
render. The service-role key is used only in server-only code paths that need to bypass
RLS deliberately (e.g. anonymous onboarding writes), each one individually justified —
see [`application-architecture.md`](application-architecture.md).

## Relationship to other documents

- [`../01-product/onboarding-specification.md`](../01-product/onboarding-specification.md) — what the anonymous stage collects
- [`data-model.md`](data-model.md) — tables and RLS these rules bind to
- [`application-architecture.md`](application-architecture.md) — route-level access map
- [`../07-decisions/decision-log.md`](../07-decisions/decision-log.md) — ratification status
