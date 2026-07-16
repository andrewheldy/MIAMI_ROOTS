---
title: Project Brief
type: context
status: active
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [context, overview]
---

## Purpose

A one-page orientation to what Miami Roots is and why this repository exists. This is the
first document a new contributor (human or agent) should read.

## What belongs here

- A concise statement of what Miami Roots is and who it's for
- The initial digital product concept (community gateway) at a high level
- The expected production stack, stated as intent, not current state
- Pointers to deeper documents rather than duplicated detail

## What does not belong here

- Detailed product requirements (see `docs/01-product/`)
- Architecture or data model detail (see `docs/03-architecture/`)
- Brand voice or visual detail (see `docs/04-design/`)
- Anything that should be tracked as a decision (see `docs/07-decisions/decision-log.md`)

## Known initial information

Miami Roots is a private, community-oriented network based in Miami, connecting people
across business, nightlife, wellness, volunteering, sober socializing, hobbies, and local
community activities. The community currently organizes primarily through WhatsApp.

The first digital product is a **branded community gateway**: a mobile-first web app that
introduces Miami Roots, displays its WhatsApp chats, lets visitors select relevant chats,
captures lightweight onboarding information, attributes new members to whoever invited
them, issues personal referral links and QR codes, and tracks the referral and engagement
funnel (clicks, submissions, invite-link clicks, verified joins, retention, contributions,
points, rewards). Administrators need tooling to manage members, referrals, chat invite
links, verification, points, and rewards.

Later phases are expected to add events, RSVPs, attendance tracking, partner offers,
community projects, and a member directory — none of that is in scope for the initial
build.

Expected production stack: Next.js (App Router, TypeScript), Tailwind CSS, Supabase
(Postgres, auth, storage, RLS), Vercel, GitHub, mobile-first responsive web. WhatsApp
remains the initial communication layer; the web app coordinates access to it rather than
replacing it.

## Current project stage

Repository foundation only, as of 2026-07-16. No application code, database schema, or
dependencies exist yet. See `docs/08-delivery/implementation-plan.md` for phasing.

## Relationship to other documents

- `docs/00-context/vision-and-ethos.md` — the "why" behind the project in more depth
- `docs/00-context/community-groups.md` — the current WhatsApp chat structure
- `docs/01-product/product-scope.md` — what the initial product does and does not do
- `docs/02-planning/roadmap.md` — phase sequencing
