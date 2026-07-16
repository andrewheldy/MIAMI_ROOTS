---
title: Implementation Plan
type: delivery
status: active
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [delivery, implementation]
---

## Purpose

States the current implementation phase precisely, so it's unambiguous what work is
in-bounds right now versus premature.

## What belongs here

- The current phase, stated plainly
- What "done" looks like for the current phase
- What comes immediately next

## What does not belong here

- Long-range roadmap (see `docs/02-planning/roadmap.md`)
- Testing approach (see `docs/08-delivery/testing-strategy.md`)
- Release/launch checklist (see `docs/08-delivery/release-checklist.md`)

## Known initial information

### Current phase: Repository foundation

**Scope:** Documentation, directory structure, brand context, repository hygiene. No
application code, dependencies, or database schema.

**Done when:**
- Required directory structure exists per the founding brief
- Every substantive doc has real starter content, not a blank template
- Root docs (`README.md`, `CLAUDE.md`, `AGENTS.md`, `LICENSE`, `.gitignore`,
  `.editorconfig`, `.env.example`) exist and are accurate
- No secrets, no malformed internal links, no generated/build artifacts committed
- Git history has one deliberate initial commit and a clean working tree

**Explicitly not in this phase:** scaffolding the Next.js app, installing any dependency,
designing the database schema, writing any application code.

### Next phase: Product scaffolding (not started)

Once explicitly authorized to proceed: initialize the Next.js + TypeScript + Tailwind app
under `src/`, wire up Supabase client libraries, and implement the initial gateway per
`docs/01-product/product-scope.md` — starting from resolving the open questions in
`docs/02-planning/open-questions.md` that block it (particularly auth model and onboarding
fields).

## Relationship to other documents

- `docs/02-planning/roadmap.md` — where this phase sits in the larger picture
- `CLAUDE.md` / `AGENTS.md` — the phase-discipline instruction this doc supports
