---
title: Community-Share Feature
type: delivery
status: active
owner: unassigned
created: 2026-07-19
updated: 2026-07-19
tags: [delivery, sharing, qr, growth]
---

## Purpose

The delivery record for the owner-directed "Share Miami Roots" community-growth feature:
what it is, how it is built, what it deliberately does not touch, and what still needs an
owner decision. The material decision is recorded in
[`../07-decisions/decision-log.md`](../07-decisions/decision-log.md) (2026-07-19); the
provisional assumptions in [`../00-context/assumptions.md`](../00-context/assumptions.md)
(#13–#15).

## What it is

A tasteful way for any member or visitor to display, download, copy, or share a QR code
that sends someone to the Miami Roots join experience — framed as a community growth tool,
not a technical QR generator.

Surfaces:

- **Homepage share prompt** ("Grow the roots") between the trust section and the closing
  CTA — eyebrow, headline, body, and two actions (*Get Your Share Card*, *Show My QR
  Code*). A small, quiet *Share Miami Roots* action also sits by the closing CTA. The hero
  is untouched.
- **Share card modal** — the wordmark (above and outside the QR quiet zone, never over the
  modules), the title *Bring someone into the community*, the instruction *Let them scan
  this code or send them the link.*, a large scannable QR, and the actions: *Download to
  Phone*, *Share with a Friend*, *Copy Join Link*, *Show Full-Screen QR*, plus *Instagram
  Story* and *Square card* downloads. Every action reports through a polite live region.
- **Full-screen scan mode** — maximum-size QR on plain white, the join URL beneath, a
  single labelled close control, no animation behind the code, and no horizontal scroll.
- **Downloadable assets**, generated client-side onto canvas from the same stable QR:
  | Asset | Size | Filename | Copy |
  |---|---|---|---|
  | Standard QR | 1024×1024 | `miami-roots-qr.png` | — (white field, strong quiet zone) |
  | Instagram Story | 1080×1920 | `miami-roots-story.png` | "Meet your people in Miami." / "Scan to join Miami Roots." |
  | Square social | 1080×1080 | `miami-roots-square.png` | "Put down roots with us." / "Scan to join Miami Roots." |

## Destination and attribution

- **Destination:** every QR/link/asset points at the stable, hardcoded production URL
  `https://miami-roots.vercel.app/join` — never a raw WhatsApp invite link, so printed and
  posted codes survive community-link rotations and deploys.
- **Attribution (non-personal, campaign-level):**
  `?ref=community-share&utm_source=member_share&utm_medium=<channel>&utm_campaign=miami_roots_growth`.
  `utm_medium` is `qr` for the codes (exactly as briefed), `web_share`/`copy_link` for the
  other channels. No per-member referral identity is minted.
- **Survival through the flow:** `CampaignAttribution` on `/join` captures the first-touch
  campaign parameters into `sessionStorage` (`miami-roots:attribution`) so they persist for
  the session; the analytics/referral milestones (M5/M14) will read them. Nothing reads
  them yet.

## Architecture

- `src/lib/qr/` — a dependency-free byte-mode QR encoder (`encode.ts`), SVG renderer
  (`svg.ts`, crisp at any DPR, quiet zone included, no layout shift), and canvas rasterizer
  (`canvas.ts`). Verified bit-for-bit against Project Nayuki's MIT reference across eight
  known-answer vectors; rendered PNGs decode back to the exact share URL.
- `src/lib/share/` — data-only, browser-free logic: `destination.ts` (stable URL +
  attribution builder), `actions.ts` (Web Share / clipboard fallback), `assets.ts` (asset
  specs), `attribution.ts` (campaign-param parsing).
- `src/features/share/` — the client UI island: `share-launcher.tsx` (triggers + dialog
  state), `share-card-modal.tsx`, `full-screen-qr.tsx`, `qr-image.tsx`, `download.ts`,
  `use-dialog-a11y.ts` (focus trap/restore, Escape, scroll lock), `campaign-attribution.tsx`,
  and the server `share-section.tsx`.

## Accessibility and quality

Keyboard accessible with focus trapping and restoration (verified live), Escape-to-close,
labelled controls, a polite live region for success/error feedback, reduced-motion-safe
animation, ≥44px touch targets, no layout shift (fixed-aspect SVG), retina-sharp SVG, an
error state when generation fails, and a graceful copy fallback when native sharing is
unavailable. Verified in Chromium at desktop (1440) and mobile (390) widths.

## What it deliberately does not touch

No Supabase schema, migration, RLS, environment variable, or WhatsApp link. No per-member
referral identities (deferred to M5/M11). No analytics vendor. The public site still
renders from the in-code content module. The site stays `noindex`.

## Tests

`tests/unit/`: `qr.test.ts` (known-answer vectors + structure + SVG), `share-destination`,
`share-actions`, `share-attribution`, `share-assets`, `share-experience.tsx` (dialog a11y
via static render), `homepage-share.tsx` (share section copy/CTAs + homepage integrity).
The full `npm run validate` gate (format, lint, typecheck, tests, build, client-bundle
scan) passes.

## Owner decisions still open

- Ratify the share/asset copy in the owner voice pass (Q#9), same as the rest of the
  gateway.
- Confirm `https://miami-roots.vercel.app/join` as the durable destination, or supply a
  custom domain (and keep a redirect from the Vercel URL if it moves), per assumption #13.
- Palette (Q#9) and group-name (Q#10) ratification still pending, as elsewhere.
