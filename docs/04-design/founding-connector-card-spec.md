---
title: Founding Connector Card — Content Specification
type: design
status: proposed
owner: unassigned
created: 2026-08-03
updated: 2026-08-03
tags: [design, connectors, nfc, qr, print, card]
---

## Purpose

What goes on the physical Miami Roots Founding Connector card: the copy, the hierarchy, the
QR requirements that keep it scannable in a dark bar, and the constraints that keep it from
looking like a coupon. This is a **content and requirements specification**, not artwork —
the artwork is a design task for the owner or a designer, and this is what it has to
satisfy.

## What belongs here

- Card copy and its hierarchy
- QR, NFC, material, and legibility requirements
- What the card must not look like or contain

## What does not belong here

- How chips are programmed and cards verified (see
  [`../05-operations/founding-connectors-operations.md`](../05-operations/founding-connectors-operations.md))
- Brand palette and type decisions (see [`brand-foundation.md`](brand-foundation.md) —
  still unratified, open question #9)

## Status

All copy below is **provisional**, pending an owner voice pass. The palette and typeface
are **not ratified** (Q#9), so the card cannot go to print until they are — printing is the
most expensive place to discover a brand decision was still open.

## Front — copy hierarchy

Exactly four lines of content, in this order of visual weight:

```
MIAMI ROOTS                     ← wordmark / logo, dominant
Tap or scan to join             ← the instruction, second
People. Events. Opportunities.  ← what it is, third
MYROOTS.DEV                     ← the domain, smallest but legible
```

**Why this order.** Someone is handed a small object in a loud room. They need to know
whose it is (1), what to do (2), and why they'd bother (3), in that sequence. The domain is
there so the card still works when the phone is dead — it is a fallback, not a call to
action.

**Line-by-line requirements:**

| Line | Requirement |
|---|---|
| `MIAMI ROOTS` | The wordmark or logo. Must be recognizable at a glance from ~1m. |
| `Tap or scan to join` | Sentence case. "Tap **or** scan" matters — most people don't know a card can be tapped. |
| `People. Events. Opportunities.` | Three words, full stops, no verbs. This is the whole value proposition and it should never grow. |
| `MYROOTS.DEV` | Uppercase, no `https://`, no `www.`. Must be readable without glasses at arm's length. |

**Do not add:** a tagline, a QR caption ("scan me!"), social handles, an offer, a discount,
a date, a hashtag, or an explanation of NFC. Every addition costs the QR quiet zone and the
card's composure.

## Back — QR and identification

```
[ QR CODE ]                     ← minimum 20mm square, 25mm preferred
/r/<code>                       ← the code, small, human-readable
{{Connector name}} (optional)   ← first name or stage name only
Founding Connector (optional)   ← the role, if used
```

**The printed code matters.** If the QR is scratched or the chip fails, someone can still
type `myroots.dev/r/maya`. Print it. It is also what a connector says out loud when they
don't have the card on them.

**Connector name is optional and per-person.** Some will want their name on it; some
won't. Both are correct. If names are used, first name or stage name only — never a full
legal name, never a phone number, never an email, never an Instagram handle. A card is
lost more often than any other object in this program.

## QR requirements

These are not aesthetic preferences. A QR that fails at a bar is a card that does nothing.

| Requirement | Value | Why |
|---|---|---|
| Encoded URL | `https://myroots.dev/r/<code>?s=q` | `?s=q` is what distinguishes a scan from a tap |
| Error correction | **Level Q (25%)** | Survives scuffing in a wallet |
| Printed size | **≥ 20mm**, 25mm preferred | Below 20mm, phone cameras struggle at arm's length |
| Quiet zone | ≥ 4 modules of clear space on all sides | The most common cause of a QR that "sometimes" works |
| Contrast | Dark modules on a light background, ≥ 7:1 | Forest on cream is fine. **Light-on-dark is not** — many camera apps fail on inverted codes |
| Finish | **Matte** in the QR area | Gloss and spot-UV throw glare that kills scans under a spotlight |
| Logo overlay | Avoid. If used, re-test at level Q with the overlay in place, on two phones, in dim light | A center logo eats exactly the modules error correction was there to protect |
| Curvature / rounded modules | Avoid | Stylized modules reduce read reliability for marginal returns |

**Test before the full print run, on printed stock, not on a screen.** Screens are easier to
scan than paper and will hide a failing design.

## NFC requirements

| Requirement | Value |
|---|---|
| Record type | A single NDEF **URI record** |
| URL | `https://myroots.dev/r/<code>?s=n` |
| Chip | NTAG213 or better (NTAG215/216 fine; 213's ~144 bytes is ample) |
| Tag lock | Lock after verification, where supported |
| Placement | Antenna clear of any metallic foil or metal-core stock |

**One record. Nothing else.** No text record, no app-launch record, no vCard, no WhatsApp
link. Anything beyond a single URI record makes behavior phone-dependent.

**Metal cards are a trap.** Metal core blocks NFC unless the card is specifically built with
an NFC window, and the premium feel is not worth a chip that works on some phones and not
others. PVC or thick coated card stock is the safe choice.

## Material and format

| Property | Recommendation |
|---|---|
| Format | Standard credit-card size, 85.6 × 54mm |
| Thickness | 0.76mm (standard card) — thick enough to feel intentional, thin enough for a wallet |
| Stock | PVC or PVC-alternative with an embedded NFC inlay |
| Finish | Matte overall, or matte on the QR side at minimum |
| Corners | Rounded, standard radius |

## What the card must not feel like

The card is the entire physical expression of Miami Roots. These are the four failure modes
to design against, named so a reviewer can point at one:

| Not this | Which means avoiding |
|---|---|
| **A coupon** | Percentages, "free", offers, dashed borders, expiry dates, starbursts |
| **A nightclub flyer** | Neon, glow, dark-with-loud-accent, event dates, DJ names, guest-list language |
| **A corporate loyalty card** | Barcodes, membership numbers as the hero, terms and conditions text, a bank-card look |
| **An MLM invitation** | "Opportunity", "join my team", income language, rank or tier markers, a person's photo |

**What it should feel like:** local, warm, and quietly confident. Closer to a good
restaurant's card than to anything promotional. Someone should be able to leave it on a bar
top without it looking like litter.

## Accessibility and legibility

- Minimum type size **7pt** for the domain and code; 8pt preferred.
- Text contrast ≥ 4.5:1 against its background; QR area ≥ 7:1.
- Do not rely on color alone to distinguish any element.
- Test the card in three lights: daylight, indoor warm light, and dim bar light.

## Proofing checklist before a print run

- [ ] Palette and typeface are ratified (Q#9) — not provisional
- [ ] Copy approved by the owner, word for word
- [ ] QR printed on the real stock scans on iPhone and Android, in dim light, at arm's
      length
- [ ] Quiet zone intact after trimming — check a trimmed proof, not the artwork file
- [ ] Domain reads correctly without glasses at arm's length
- [ ] NFC inlay verified in a sample card, tapped on both an iPhone and an Android
- [ ] The URL on the proof is the **production** domain, character by character
- [ ] The card does not resemble any of the four failure modes above
- [ ] A small test batch was ordered and field-tested before the full run

## Relationship to other documents

- [`../05-operations/founding-connectors-operations.md`](../05-operations/founding-connectors-operations.md) — programming, verification, handoff
- [`../01-product/founding-connectors-program.md`](../01-product/founding-connectors-program.md) — why the card points at a Miami Roots URL
- [`brand-foundation.md`](brand-foundation.md) — palette and type, still unratified
- [`asset-implementation-plan.md`](asset-implementation-plan.md) — the wider asset pipeline
