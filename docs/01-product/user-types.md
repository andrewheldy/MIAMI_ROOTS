---
title: User Types
type: product
status: draft
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [product, users]
---

## Purpose

Names the distinct kinds of people who interact with Miami Roots, so features and
permissions can be reasoned about per user type instead of a vague single "user."

## What belongs here

- Each user type, what they can see and do, at a conceptual level
- How a person moves from one type to another

## What does not belong here

- Detailed step-by-step flows (see `docs/01-product/user-journeys.md`)
- Authentication/authorization implementation (see `docs/03-architecture/`)
- Admin operational procedures (see `docs/05-operations/`)

## Known initial information

- **Visitor** — anyone landing on the gateway who hasn't submitted onboarding info yet.
  Can browse the introduction, ethos, and group list, and select groups of interest.
- **Referrer** — an existing member using their personal referral link/QR code to invite
  others. Every member is potentially a referrer; a referrer doesn't need any special
  permission beyond membership.
- **Prospective member (onboarding)** — a visitor who has submitted the lightweight
  onboarding form but is not yet a verified member.
- **Member** — someone verified as present in at least one Miami Roots WhatsApp group.
  Accrues points/contributions over time.
- **Administrator** — manages members, referral attribution, chat invite links,
  verification, and points/rewards. See `docs/05-operations/` for the operational
  procedures admins follow.
- **Owner** — an administrator who additionally manages who the administrators are, the
  rewards catalog, and group creation/archival.

Authentication per type (recommended default, 2026-07-16 — see
`docs/03-architecture/identity-and-authorization.md`): Visitors and prospective members
need no account; members gain an account via email magic link at **activation**, after
verification; admin/owner accounts are created by the owner. "Connector" is the
activated member exercising their referral capability — a capability, not a separate
user type.

## Relationship to other documents

- `docs/01-product/product-scope.md` — what each type can do, scoped to the initial product
- `docs/01-product/user-journeys.md` — concrete flows per type
- `docs/05-operations/membership-verification.md` — how Prospective member → Member happens
