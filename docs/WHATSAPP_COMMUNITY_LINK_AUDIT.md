---
title: WhatsApp Community Link Audit
type: audit
status: active
owner: unassigned
created: 2026-07-19
updated: 2026-07-19
tags: [audit, whatsapp, links, redirects]
---

# WhatsApp Community Link Audit — 2026-07-19

An owner-authorized, metadata-only audit of how the Miami Roots website reaches
the Miami Roots WhatsApp Community, and the integration work done from it.
Scope covered: community/group names, descriptions, invite-link *status*, and
website link wiring. **No member data, message content, phone numbers, join
requests, or admin identities were collected, inspected, or committed** — see
[Privacy confirmation](#privacy-confirmation).

## Community source

- **Main community:** the owner supplied the main Miami Roots Community invite
  link on 2026-07-19 as part of the audit authorization. Per the standing rule
  that invite links are credentials and never enter Git
  ([`05-operations/chat-link-management.md`](05-operations/chat-link-management.md)),
  the URL itself is **not** reproduced here — it belongs in the hosting
  environment as `WHATSAPP_COMMUNITY_URL`.
- **Verification method and its limits:** this audit ran in a sandboxed
  environment whose network policy blocks both `myroots.dev` and
  `*.whatsapp.com` (only package registries and GitHub are reachable). The
  live-site crawl and WhatsApp-side metadata retrieval (exact group names,
  descriptions, per-subgroup invite validity) therefore **could not be
  performed** in this session. The website-side audit below is static — taken
  from the repository this site deploys from — and is authoritative for link
  wiring. Everything WhatsApp-side is marked `needs-owner-review` rather than
  guessed. The intake procedure for real WhatsApp evidence already exists:
  [`00-context/whatsapp-community-inventory.md`](00-context/whatsapp-community-inventory.md).

## Verified public groups

Status meanings follow the audit schema: `verified` = invite link confirmed
working against WhatsApp; `missing-invite` = no link configured;
`needs-owner-review` = cannot be confirmed from this environment.

| Website slug (`/go/`) | WhatsApp name | Website name | Destination status | Public |
| --- | --- | --- | --- | --- |
| `community` (new) | needs-owner-review | Miami Roots Community | needs-owner-review — set `WHATSAPP_COMMUNITY_URL` from the owner-supplied invite | yes |
| `general-chat` | needs-owner-review | General Chat | needs-owner-review — env-held, validity not confirmable from this environment | yes |
| `business-connections` | needs-owner-review | Business & Connections | needs-owner-review | yes |
| `daytime-events` | needs-owner-review | Daytime Events (logo reads "Daytime Roots") | needs-owner-review | yes |
| `nightlife-events` | needs-owner-review | Nightlife & Event Marketing (logo reads "Nightlife Roots") | needs-owner-review | yes |
| `community-organizing` | needs-owner-review | Community Organizing | needs-owner-review | yes |
| `sober-support` | needs-owner-review | Sober Social | needs-owner-review | yes |
| — (none) | Ticket Exchange (existence unverified) | not published | excluded — out of scope per [`01-product/out-of-scope.md`](01-product/out-of-scope.md); enforced by tests | no |

No subgroup beyond these is known to this repository. Whether additional
subgroups exist inside the WhatsApp Community (announcements, geographic or
specialty chats, admin/moderation rooms) **must be established by the owner
walk-through** below; none were invented here.

## Website-link audit

Every clickable destination on the site, from the repository the production
site deploys from. "OK" = correct canonical destination, no change needed.

| Page/component | Previous destination | New canonical destination | Result |
| --- | --- | --- | --- |
| Header (all pages): "Groups", "Community guidelines", "Join the chats" | `/groups`, `/guidelines`, `/join` | unchanged | OK |
| Footer (all pages): same three | `/join`, `/groups`, `/guidelines` | unchanged | OK |
| Homepage hero primary CTA | `/groups` ("Explore the community"); no join path above the fold | `/join` ("Join the chats"), with `/groups` demoted to secondary | **Fixed** |
| Homepage hero guidelines link | `/guidelines` | removed from hero (still in trust section, header, footer, `/join`) | Changed |
| Homepage "About General Chat", group cards, directory links | `/groups/[slug]` | unchanged | OK |
| Homepage closing CTA "Join the chats" | `/join` | unchanged | OK |
| `/groups` directory cards | `/groups/[slug]` | unchanged | OK |
| `/groups/[slug]` "Joining this group" box | **dead end** — static "joining details are coming soon" text, no link, stale since `/go` shipped | "Open *group* in WhatsApp" CTA → `/go/<redirect-slug>` via the canonical registry | **Fixed** |
| `/join` chat cards (six) | `/go/<redirect-slug>` | unchanged — already registry-driven | OK |
| `/join` share button | shares `/join` absolute URL (stable, link-rotation-proof) | unchanged | OK |
| `/go/<slug>` unavailable state | `/join` and `/` only; no way into the community itself | adds "Join the main Miami Roots community" → `/go/community`, rendered only when that link actually resolves server-side | **Fixed** |
| `/go/community` | did not exist | main community entrance via `WHATSAPP_COMMUNITY_URL` | **New** |
| `/go/<unknown>` | 404 | unchanged (registry lookup, `notFound()`) | OK |
| QR codes (`public/qr/`) | none exist yet | when produced, point at `https://myroots.dev/join` or `/go/<slug>` — both stable across invite rotation | OK (nothing to fix) |
| Placeholder `#` links, raw WhatsApp URLs, dead buttons | none found anywhere in `src/` | — (now enforced by `tests/unit/no-raw-invite-links.test.ts`) | OK |

## Redirect architecture (unchanged in kind, extended)

- One canonical registry: [`src/content/join/chat-links.ts`](../src/content/join/chat-links.ts)
  maps `/go/<slug>` → server env var. Components reference slugs, never URLs.
- Invite URLs live **only** in server environment variables, read per-request
  (`force-dynamic`) — rotation is a hosting-config change, no rebuild, nothing
  in Git. Destinations must be HTTPS on an exact-match WhatsApp hostname
  allowlist; anything else shows the branded unavailable state. No query
  parameter can influence the destination (no open-redirect surface).
- `redirect()` issues Next's default **307 temporary redirect** — deliberately
  never permanent/cached, because invite links rotate.
- `/go` responses carry `X-Robots-Tag: noindex, nofollow` and
  `Referrer-Policy: no-referrer` (`next.config.ts`).

## Naming and description differences

Unchanged from the standing record (nothing new could be verified this session):

- "Daytime Events" vs. logo wordmark **"Daytime Roots"**; "Nightlife & Event
  Marketing" vs. **"Nightlife Roots"** — open question #10, surfaced on the
  site as provisional-name badges.
- `/go/sober-support` serves the group displayed as **Sober Social**;
  `/go/nightlife-events` serves **Nightlife & Event Marketing** — deliberate,
  shipped slug contract (decision log, 2026-07-18).
- Exact WhatsApp group names/descriptions remain unverified against the real
  community ([`00-context/whatsapp-community-inventory.md`](00-context/whatsapp-community-inventory.md)).

## Owner actions

1. **Set `WHATSAPP_COMMUNITY_URL`** in Vercel (production + preview) to the
   main community invite link supplied with this audit, enabling
   `/go/community` and the unavailable-state fallback.
2. **Verify the six subgroup env vars** (`WHATSAPP_*_URL`) are set in Vercel
   and that each opens the *intended* group: from a phone, visit each
   `/go/<slug>` on the production site and confirm the WhatsApp preview shows
   the matching group name. This is the only step that can truly verify a
   link, and it requires no admin action in WhatsApp.
3. **Walk the Community info panel** (owner device, read-only) and supply, per
   the intake procedure in `whatsapp-community-inventory.md`: exact subgroup
   names and descriptions, which subgroups are public-facing, and whether any
   exist beyond the six (e.g. announcements, Ticket Exchange). That unblocks
   the content reconciliation this session could not perform.
4. **Decide open question #10** ("… Roots" naming) — it gates removing the
   provisional-name badges.

## Privacy confirmation

- No WhatsApp session was created or used; no login QR code was displayed,
  captured, or stored.
- No member names, phone numbers, profile photos, message contents, join
  requests, or admin identities were accessed, collected, or committed.
- No invite URL was committed to the repository (enforced by
  `tests/unit/chat-links.test.ts` and `tests/unit/no-raw-invite-links.test.ts`);
  the owner-supplied main community link is referenced only by its env var name.
- No WhatsApp settings, links, memberships, or messages were viewed or
  modified; nothing was sent, joined, revoked, or regenerated.
