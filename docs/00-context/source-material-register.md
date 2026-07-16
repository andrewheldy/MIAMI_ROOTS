---
title: Source Material Register
type: context
status: active
owner: unassigned
created: 2026-07-16
updated: 2026-07-16
tags: [context, source-material, privacy]
---

## Purpose

A tracked register of the **private source material** received for this project — what
files exist under the untracked `inputs/` tree, when they arrived, and what they show — so
the material is accounted for without any of its content entering Git. This is the
private-material counterpart of [`../04-design/asset-register.md`](../04-design/asset-register.md)
(which covers public production assets) and of
[`../06-research/source-register.md`](../06-research/source-register.md) (which covers
external research sources).

## What belongs here

- One row per received source file or batch: local path under `inputs/`, date received,
  type, subject, and a **non-sensitive** one-line description
- Whether the file has been reviewed and what tracked document its findings landed in

## What does not belong here

- The files themselves or their contents — `inputs/*` is excluded from Git
  (`.gitignore`), and phone numbers, invite links, conversations, and member/admin
  identities never enter tracked files
- Public production assets (see [`../04-design/asset-register.md`](../04-design/asset-register.md))

## Register

**As of 2026-07-16 no private source material has been received.** The owner announced
WhatsApp group screenshots (names/bios/descriptions), a Miami Roots banner, and possibly
additional subgroup assets and banner variants; none were present when the asset
organization pass ran. The `inputs/` directory structure is prepared and its Git exclusion
is verified (`inputs/*` ignored, only `inputs/README.md` tracked).

Later on 2026-07-16 the announced **Miami Roots banner arrived** — along with a brand
moodboard and an artistic tree-logo concept — as owner-classified public reference assets,
not private material, so they live under `public/brand/` and are registered in
[`../04-design/asset-register.md`](../04-design/asset-register.md). The WhatsApp group
screenshots remain outstanding and will be registered here when they arrive.

| Received | Local path (untracked) | Type | Subject | Reviewed? | Findings recorded in |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

The five logo files supplied at project founding are **not** registered here because they
were confirmed as approved production assets and live under `public/` — see
[`../04-design/asset-register.md`](../04-design/asset-register.md).

## Handling procedure for incoming material

1. Drop files under the matching `inputs/` subdirectory (see `inputs/README.md` for the
   layout). Screenshots that can't be matched to a group go to
   `inputs/screenshots/group-bios/unidentified/`.
2. Verify the file is ignored: `git status` must not list it; `git check-ignore -v <path>`
   must match the `inputs/*` rule.
3. Add a row here (non-sensitive description only).
4. Review the material and record findings in the appropriate tracked doc
   ([`whatsapp-community-inventory.md`](whatsapp-community-inventory.md) for group
   screenshots), applying the privacy rules stated there.
5. If a private file is ever found tracked: preserve the local file, `git rm --cached` it,
   confirm it is ignored, flag the incident — and treat any exposed invite link as
   compromised (rotate it per
   [`../05-operations/chat-link-management.md`](../05-operations/chat-link-management.md)).

## Relationship to other documents

- `inputs/README.md` — layout and handling rules for the untracked tree itself
- [`whatsapp-community-inventory.md`](whatsapp-community-inventory.md) — where reviewed
  screenshot findings land
- [`../04-design/asset-register.md`](../04-design/asset-register.md) — public production
  assets
