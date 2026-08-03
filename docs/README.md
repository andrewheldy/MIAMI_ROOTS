---
title: Documentation Index
type: context
status: active
owner: unassigned
created: 2026-07-16
updated: 2026-08-03
tags: [context, index]
---

## Purpose

The entry point into Miami Roots documentation. Start here, then follow into the section
that matches what you're trying to do.

## What belongs here

- A map of every documentation section and what it's for
- Reading order guidance for new contributors (human or agent)

## What does not belong here

- Actual content — every section below owns its own content in its own files

## Documentation map

| Section | Purpose |
|---|---|
| [`00-context/`](00-context/) | Why the project exists: brief, ethos, community groups, glossary, assumptions |
| [`01-product/`](01-product/) | What the product does: scope, user types, journeys, referral/rewards concept, guidelines, out-of-scope |
| [`02-planning/`](02-planning/) | What's still unresolved and the rough future roadmap |
| [`03-architecture/`](03-architecture/) | System context, data principles, privacy/safety, integrations |
| [`04-design/`](04-design/) | Brand foundation, voice, information architecture, asset register |
| [`05-operations/`](05-operations/) | How the community and product are actually operated day to day |
| [`06-research/`](06-research/) | Open research questions and sources consulted |
| [`07-decisions/`](07-decisions/) | The durable record of material decisions made |
| [`08-delivery/`](08-delivery/) | Current implementation phase, testing strategy, release checklist |

## Cross-cutting programs

Some initiatives span several sections. Their documents are listed together here so the
full set is findable from one place.

| Program | Documents |
|---|---|
| **Founding Connectors** (NFC/QR card distribution program) | [`01-product/founding-connectors-program.md`](01-product/founding-connectors-program.md) (design, measurement, governance) · [`05-operations/founding-connectors-operations.md`](05-operations/founding-connectors-operations.md) (procedures, launch plan) · [`05-operations/founding-connectors-message-pack.md`](05-operations/founding-connectors-message-pack.md) (onboarding messages) · [`04-design/founding-connector-card-spec.md`](04-design/founding-connector-card-spec.md) (the physical card) · [`08-delivery/founding-connectors-mvp.md`](08-delivery/founding-connectors-mvp.md) (engineering record) |

## Suggested reading order for a new contributor

1. `00-context/project-brief.md` and `00-context/vision-and-ethos.md`
2. `01-product/product-scope.md`
3. `03-architecture/data-principles.md`
4. `07-decisions/decision-log.md`
5. `08-delivery/implementation-plan.md` — to see what phase is actually active right now

## Relationship to other documents

The root [`../README.md`](../README.md) is the project's front door; this file is the
front door to the docs specifically. [`../CLAUDE.md`](../CLAUDE.md) and
[`../AGENTS.md`](../AGENTS.md) state how agents should use this documentation when working
in the repository.
