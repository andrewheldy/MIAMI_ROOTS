---
title: Join Hub Hero Media
type: design
status: active
owner: unassigned
created: 2026-07-18
updated: 2026-07-18
tags: [design, assets, join-hub, video]
---

## Purpose

How to supply and replace the cinematic hero media on the `/join` shareable hub.
The page ships **without** final footage: it looks for the files below at render
time and falls back gracefully, so dropping the real assets in is a pure file
add — no code change.

## Exact filenames

Place all three files in `public/media/` with exactly these names:

| File                           | Role                                    |
| ------------------------------ | --------------------------------------- |
| `miami-roots-hero.mp4`         | Primary video (H.264 MP4 — Safari/iOS)  |
| `miami-roots-hero.webm`        | Companion video (WebM — Chrome/Firefox) |
| `miami-roots-hero-poster.webp` | Poster / still fallback image           |

## Recommended specs

- **Dimensions:** 1920×1080 (16:9). The hero crops with `object-cover`, so keep
  the visual center of interest near the middle of the frame — edges are
  trimmed on tall phone screens.
- **Duration:** 6–12 seconds, seamless loop (last frame should cut cleanly back
  to the first).
- **Size budget:** ideally **under 10 MB per video file**; under 5 MB is better
  for mobile. The poster should be well under 300 KB.
- **No audio track** — the video plays muted; stripping audio saves real bytes
  (`-an` in ffmpeg).

## Compression guidance

Example ffmpeg commands from an edited master (`master.mov`):

```sh
# H.264 MP4 — broad compatibility. CRF 23–28: raise until quality suffers.
ffmpeg -i master.mov -an -vf "scale=1920:-2" -c:v libx264 -crf 26 \
  -preset slow -movflags +faststart public/media/miami-roots-hero.mp4

# WebM (VP9) — usually ~30% smaller at the same quality.
ffmpeg -i master.mov -an -vf "scale=1920:-2" -c:v libvpx-vp9 -crf 34 -b:v 0 \
  public/media/miami-roots-hero.webm
```

`-movflags +faststart` matters: it lets the MP4 begin playing before it has
fully downloaded.

## Poster frame

The poster is what visitors see **while the video loads**, on very slow
connections, when JavaScript is unavailable, and — importantly — as the
permanent image for visitors with **reduced motion** enabled. Choose a frame
that stands entirely on its own:

```sh
# Grab a representative frame (here at 2s) as the WebP poster.
ffmpeg -i master.mov -ss 2 -frames:v 1 -vf "scale=1920:-2" \
  -quality 80 public/media/miami-roots-hero-poster.webp
```

Text on the hero is white over a dark green scrim, so mid-to-dark footage with
some texture works best; avoid frames with large very bright areas behind the
headline (lower left).

## How the fallbacks work (current behavior)

- **All three files present:** poster shows instantly, video fades in over it
  once it can play. No layout shift — the media box is fixed-height.
- **Videos absent (current repository state):** the page detects this
  server-side and renders the poster only. Nothing is broken; nothing 404s.
- **Poster absent too:** the committed community banner
  (`public/brand/banners/miami-roots-community-banner.png`) is used as the
  still image. This is the state the repo ships in today.
- **Reduced motion (`prefers-reduced-motion: reduce`):** the video is never
  mounted; the visitor sees the poster. This also reacts live if the OS
  setting changes while the page is open.

Because the check happens at render time, **redeploy after adding the files**
(any Vercel deployment picks them up automatically; a local `npm run dev`
restart is enough in development).

## Rules

- Real footage only — no stock passed off as Miami Roots, no fabricated
  community imagery. Until real footage exists, the banner fallback stands.
- Nothing private in frame: no phone numbers, invite QR codes, chat screenshots,
  or identifiable members without consent (see
  `docs/05-operations/whatsapp-content-governance.md`).
