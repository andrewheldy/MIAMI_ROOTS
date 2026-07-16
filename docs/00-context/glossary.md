---
title: Glossary
type: context
status: active
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [context, reference]
---

## Purpose

Defines terms used consistently across Miami Roots documentation, so "member," "referral,"
and "verified join" mean the same thing in every document and in the eventual data model.

## What belongs here

- Short, precise definitions of domain terms used in more than one document
- Terms likely to be ambiguous or overloaded (e.g. "referral" vs. "invite")

## What does not belong here

- Full data model detail (see `docs/03-architecture/`)
- Long explanations better suited to a dedicated doc — link out instead

## Known initial information

| Term | Definition |
|---|---|
| **Visitor** | Anyone landing on the Miami Roots gateway who has not yet submitted onboarding info. |
| **Referrer** | An existing member whose personal referral link or QR code brought a visitor to the gateway. |
| **Referral attribution** | The recorded link between a new member and the referrer credited with inviting them. A distinct event from membership verification — see below. |
| **Referral click** | A visit to the gateway via a specific referral link, before any onboarding submission. |
| **Onboarding submission** | A visitor completing the lightweight onboarding form (capturing basic info and group selection). |
| **Invite-link click** | A click on a WhatsApp group invite link surfaced by the gateway, whether or not the person subsequently joins. |
| **Verified join** | Confirmation (by an admin or an automated check) that a person who clicked an invite link actually joined and is present in the relevant WhatsApp group. Distinct from, and later than, referral attribution and invite-link click. |
| **Member** | Someone who has been verified as present in at least one Miami Roots WhatsApp group. |
| **Retention** | Continued presence/participation of a member over time, as distinct from a one-time verified join. |
| **Contribution** | A member action considered valuable to the community beyond simply joining (e.g. referring others, participating in events, positive moderation signals) — the concrete definition is still open, see `docs/02-planning/open-questions.md`. |
| **Points** | A numeric representation of a member's tracked contributions and participation, intended to eventually be backed by an append-only ledger rather than only a mutable total. |
| **Reward** | Something a member can redeem or receive as a result of accumulated points or specific verified actions — mechanics not yet decided. |
| **Chat / Group** | A WhatsApp group that is part of the Miami Roots network (see `docs/00-context/community-groups.md`). |
| **Invite link** | The raw WhatsApp-generated URL that adds a joiner to a group. Treated as a rotatable, non-permanent asset — see `docs/05-operations/chat-link-management.md`. |
| **Gateway** | The Miami Roots web application itself — the "branded community gateway" described in the project brief. |
| **Applicant** | A visitor who has submitted onboarding but is not yet a verified member. (Same as "prospective member".) |
| **Connector** | An activated member acting through their personal referral link and dashboard. A capability of membership, not a separate permission tier — see `docs/03-architecture/identity-and-authorization.md`. |
| **Activation** | The moment a verified member gains an authenticated account (email magic link) and access to the connector dashboard. Distinct from, and later than, verification. |
| **Invite reveal** | The gated, audited display of a group's actual WhatsApp invite link to an approved applicant — see `docs/03-architecture/privacy-and-safety.md`. |
| **Attribution window** | How long a referral cookie stays valid before a visit no longer credits the referrer (recommended default: 30 days). |
| **Maturation** | A referral attribution reaching its final earned state: the referred person verified **and** retained (+14 days). Points post only at maturation. |
| **Pending points** | Points a connector can expect from referrals that are verified but not yet matured — a derived projection, not ledger entries. |
| **Available points** | The member's actual balance: the sum of their append-only points-ledger entries. |
| **Reversal** | A compensating (negative) ledger entry or audited state transition that undoes an earlier effect without deleting history. |

## Relationship to other documents

Every document under `docs/` should use these terms consistently. If a document needs a
term not yet defined here, add it here rather than defining it locally.
