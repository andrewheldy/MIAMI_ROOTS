---
title: Founding Connectors — Operations Playbook
type: operations
status: proposed
owner: unassigned
created: 2026-08-03
updated: 2026-08-03
tags: [operations, connectors, nfc, qr, cards, launch]
---

## Purpose

How the Founding Connectors program is actually run: selecting people, making and
programming cards, verifying them before handoff, onboarding connectors, disabling lost
cards, changing destinations, reviewing performance, handling misuse, and expanding beyond
Miami. This is the procedural companion to
[`../01-product/founding-connectors-program.md`](../01-product/founding-connectors-program.md),
which holds the *why*.

## What belongs here

- Step-by-step procedures an admin follows
- The pre-handoff checklist
- The phased launch plan and review cadence

## What does not belong here

- Program rationale, benefits, governance policy (see the program design doc)
- Message wording (see
  [`founding-connectors-message-pack.md`](founding-connectors-message-pack.md))
- Card artwork specification (see
  [`../04-design/founding-connector-card-spec.md`](../04-design/founding-connector-card-spec.md))

## Roles

| Role | Who | Responsible for |
|---|---|---|
| Program owner | The founder | Selection, invitations, onboarding conversations, final call on misuse |
| Card admin | Owner or a trusted admin | Programming chips, verification, registry edits, deploys |
| Reviewer | Owner + admins | The monthly review |

At the pilot scale, all three are the same person. The separation matters later, not now.

## 1. Selecting candidates

1. **Build the longlist.** Sources: people the founder already knows; nominations from
   `/connectors`; suggestions from existing connectors (Phase 3 onward). Keep it in a
   private working document — **never in this repository**.
2. **Score against the criteria** in the program design (trust, alignment, real-world
   activity, bridging, reciprocity, then reach). No spreadsheet formula; a judgment call
   written down in a sentence.
3. **Check cohort balance** — category mix and neighborhood spread. If two candidates are
   equally strong and one fills a gap, take the gap.
4. **Sanity-check the disqualifiers.** Anyone whose first question is "what do I get" is a
   no, kindly.
5. **Decide, and write the reason down.** One line per person. It makes the next cohort
   easier and keeps the standard honest.

**Never commit a real candidate's name, contact, or notes to this repository.** The
connector registry in `src/content/connectors/` is public Git history. Real entries are
added only after the owner approves each one, and even then hold only a display name,
category, status, destination, and issue date.

## 2. Assigning a card and its code

1. **Pick a code.** Two acceptable styles: a readable slug from the person's name or handle
   (`maya`, `djmarcus`) or a sequential card code (`fc001`). Readable codes are better —
   a person can say theirs out loud.
2. **Validate it.** Lowercase, 2–30 characters of `a–z`, `0–9`, and single hyphens, no
   leading or trailing hyphen. Not a reserved word (`admin`, `join`, `official`, `roots`,
   … — the list is `RESERVED_CONNECTOR_CODES` in `src/lib/connectors/codes.ts`).
3. **Check it has never been used.** Codes are permanent and are never reassigned, even
   after a card is retired. A card in the wild must never start crediting a different
   person.
4. **Add the registry entry** in `src/content/connectors/connectors.ts`:

   ```ts
   {
     code: "maya",
     displayName: "Maya",              // first name or stage name is enough
     category: "wellness",
     status: "active",
     issuedOn: "2026-08-15",
     publicRecognitionConsent: false,  // true ONLY with explicit permission
     fixture: false,
   }
   ```

   Omit `destination` unless this card should land somewhere other than the program
   default. Open a pull request; the tests assert code validity, uniqueness, resolvable
   destinations, and that no contact details crept in.
5. **Deploy.** The code is live once the deploy completes — verify before printing anything.

## 3. Programming the NFC chip

Any NFC-writing app that produces an **NDEF URI record** works (NFC Tools on Android or
iOS, or a desktop encoder for batches).

1. Write a single NDEF **URI record**: `https://myroots.dev/r/<code>?s=n`
   - `?s=n` marks the tap as NFC. It is the only reason NFC and QR are distinguishable.
   - Use the production domain, never a preview URL. A preview URL on a physical card is
     permanent breakage.
2. **Do not** write a WhatsApp link, a text record, an app-launch record, or multiple
   records. One URI record, nothing else.
3. **Lock the tag** after verification, if the card stock supports it. An unlocked tag can
   be silently rewritten by anyone who taps it with a writer app — which would turn a
   Miami Roots card into someone else's link.
4. Verify (step 5) **before** locking, because locking is irreversible.

## 4. Generating the QR code

1. Encode exactly: `https://myroots.dev/r/<code>?s=q`
   - `?s=q` marks the scan as QR.
2. Error correction level **Q (25%)**, quiet zone of at least 4 modules, printed at
   **minimum 20mm square** (25mm preferred). See the card spec for placement and contrast.
3. Generate the code with any generator that produces a static QR — the repository already
   contains a dependency-free encoder (`src/lib/qr/`) if a scripted batch is wanted. Never
   use a third-party "dynamic QR" service: it would insert someone else's redirect between
   the card and Miami Roots, which is exactly the control this program is built to keep.
4. **No logo overlay in the center** unless it is re-tested at level Q with the overlay in
   place. A pretty code that fails at a dark bar is a broken card.

## 5. Testing URLs before printing

Run these for **every** code, against production:

| Check | Expected |
|---|---|
| `GET /r/<code>` | 307 redirect to `/join?...utm_content=<code>` |
| `GET /r/<code>?s=n` | Redirect contains `utm_medium=nfc` |
| `GET /r/<code>?s=q` | Redirect contains `utm_medium=qr` |
| Follow the redirect | The community hub renders; General Chat is present and works |
| `GET /r/<wrong-code>` | 404 — no accidental catch-all |
| Case variation (`/r/<CODE>`) | Resolves identically |

Command form:

```bash
curl -sI "https://myroots.dev/r/maya?s=q" | grep -i '^location'
```

## 6. Pre-handoff checklist

**Every card, every time. A card that fails any line does not get handed over.**

- [ ] **NFC destination works** — tapped with a real phone; it opens the Miami Roots page,
      not a browser error, not WhatsApp directly.
- [ ] **QR scans on iPhone** — native camera app, arm's length, indoor lighting.
- [ ] **QR scans on Android** — native camera app, same conditions.
- [ ] **QR scans in bad light** — dim bar lighting or equivalent; this is where cards fail.
- [ ] **Public code matches the assigned connector** — the code on this card belongs to the
      person receiving this card. Check the registry, not memory.
- [ ] **Redirect analytics register correctly** — a test scan appears as a
      `connector_link_visited` event with the right code and source (skip only if telemetry
      is not yet enabled — and note that it was skipped).
- [ ] **Final destination is current** — the chat behind the destination actually opens.
- [ ] **Card has no typo** — name, code, URL, and call to action all read correctly. Read
      the URL character by character.
- [ ] **Tag is locked** (if supported) after all of the above.
- [ ] **Connector has received the conduct guidelines** — the one-page guide, in their
      hands or their inbox, before or at handoff.

Record the date and who verified it. A card issued without this checklist is the single
most likely cause of a dead card in a wallet.

## 7. Handing cards out

- **In person, one to one, wherever possible.** The card is a prop for a conversation, not
  a mailer.
- Explain it in under five minutes using the onboarding script in the message pack.
- **Watch them tap it themselves, on their own phone.** This is the moment problems
  surface, and it is also what makes them comfortable doing it in front of someone else.
- Give them one sentence they can say when they hand it over — in their own words, not
  ours.
- Confirm the recognition question explicitly: *may we name you publicly as a Founding
  Connector?* Default is no. Record the answer.

## 8. Onboarding a connector

1. The founder's personal invitation (message 1) — sent individually, never bulk.
2. Acceptance message (message 2) once they say yes.
3. The five-minute conversation (message 3 script) at handoff.
4. The one-page guide (message 4) left with them.
5. The handoff checklist (§6) completed by the admin.
6. Follow-up about a week later (message 6) — the highest-value message in the whole pack,
   because it catches friction while it's still fixable.

## 9. Disabling a lost or compromised card

**Target: within one hour of being told.**

1. Set `status: "paused"` in the registry (or `"retired"` if the card is gone for good).
2. Deploy.
3. Verify: `GET /r/<code>` still redirects to `/join`, and the redirect **no longer
   contains `utm_content`**. The door stays open; the credit stops.
4. If the card was stolen rather than lost, retire the code and issue a **new code** on a
   new card. Never reuse the old one.
5. Note it in the ops log with the date and reason.

**Why a disabled card still opens the door:** a real person may be standing in front of a
real card. Sending them to a 404 punishes the wrong person. Attribution stops; access
doesn't.

## 10. Changing a destination

- **One card:** set `destination` on that registry entry.
- **The whole cohort:** change `DEFAULT_CONNECTOR_DESTINATION` in
  `src/content/connectors/connectors.ts`. Every card that doesn't override it follows.
- Destinations are internal only — an allowlisted page, a group page, or a `/go/<slug>`
  chat gate. An external URL cannot be configured, by design.
- **After every destination change:** re-run the URL tests in §5 for at least one affected
  card, and confirm the chat behind it opens.

**Rotating a WhatsApp invite does not require a destination change at all** — the invite
lives in a server environment variable behind `/go/<slug>`. See
[`chat-link-management.md`](chat-link-management.md).

## 11. Reviewing performance

**Monthly** (weekly during the pilot). Half an hour, two halves:

*The numbers* — cards issued, active connectors, scans by connector and by source, clicks
into chats, disabled cards, reported misuse. Read them as taps, not people (see the
measurement framework).

*The question the numbers can't answer* — what actually happened because of a connector
this month? Who did they bring? Did those people stay? What did they say about how they
found us?

**What not to do:** rank connectors publicly by scan count, or tell a connector their
number is low. Both convert a trust program into a sales quota within one cycle.

## 12. Handling inactive connectors

A quiet connector is not a failing connector. Somebody who makes two perfect introductions
a year is doing the job.

1. **At 90 days with no activity and no contact:** a friendly check-in, not a
   performance note. Often the answer is "I lost the card" or "I've been travelling."
2. **At 6 months:** ask directly whether they still want to be part of it. Some will say
   no, and that's a good outcome — it frees a place in the cohort.
3. **If they want out:** the graceful-removal message (message 8), card set to `retired`,
   and they keep the recognition of having been in the first cohort. That was true and
   stays true.

## 13. Handling misuse

Follow the response ladder in the program design (clarify → warn → pause → retire). In
every case:

1. **Talk to them first.** Most Level 1–2 issues are misunderstandings about what the
   program is.
2. **Write down what happened**, in the ops log, with dates. Not in this repository.
3. **Act on the card, not just the conversation.** A warning with no state change is a
   warning that will be repeated.
4. **Tell the community nothing.** Removing someone is not an announcement.
5. **Serious misuse skips the ladder** — selling access, using member data, discriminatory
   conduct, or misrepresenting Miami Roots goes straight to retirement.

## 14. Launch plan

### Phase 0 — Internal preparation

- [ ] Finalize program rules (owner reads and approves the program design doc)
- [ ] Approve the public `/connectors` copy
- [ ] Confirm the redirect system works in production (§5, against the real domain)
- [ ] Decide the card vendor and order **test cards first** — never a full batch
- [ ] Program and verify the test cards end to end (§3–§6)
- [ ] Draft the first connector list (5 pilot names, 20–30 longlist)
- [ ] Prepare onboarding materials (message pack printed/saved and ready to send)
- [ ] Establish the baseline: zero cards, zero scans, and a note of what is not yet
      measurable

### Phase 1 — Private pilot (~5 cards)

- [ ] Issue **about five** cards, deliberately across different archetypes — e.g. one
      wellness, one music, one hospitality, one organizer, one business
- [ ] Sit with each one and watch how *they* explain Miami Roots — their words are the
      product's real copy
- [ ] Test NFC and QR behavior on their actual phones, in their actual venues
- [ ] Collect qualitative feedback at ~1 week (message 6)
- [ ] Fix the friction found before anything is promoted publicly
- **Exit criteria:** five cards verified in the field, no broken destinations, and at least
  three connectors able to explain Miami Roots in one sentence without prompting.

### Phase 2 — Founding cohort (20–30 connectors)

- [ ] Expand to the full cohort, balancing categories and neighborhoods
- [ ] Host **one small handoff gathering** — or personal handoffs where a gathering doesn't
      fit someone's life
- [ ] Introduce connectors to each other; this is the benefit they will value most
- [ ] Begin the monthly review

### Phase 3 — Community activation

- [ ] Connector-supported gatherings (they host or co-host)
- [ ] Open connector nominations for additional candidates
- [ ] Recognize meaningful contributions — specifically, publicly where consented, and
      never as a ranking
- [ ] Begin partner attribution experiments (a partner, a campaign parameter, a real
      question to answer)

### Phase 4 — Roots network expansion

Not built, and not to be built until a second city is real. Preserve: globally unique codes,
per-card destinations, city-agnostic URLs. Add when needed: city grouping, per-city
destinations and reporting, traveler pre-arrival flows, cross-city recognition. See the
expansion posture in the program design.

## 15. Ops log

Keep a simple private log (spreadsheet or notes doc — **not this repository**) with one row
per event: date, card code, what happened (issued, paused, retired, destination changed,
misuse reported, checklist verified), and who did it. It is the only thing that makes a
review, an audit, or a handover to another admin possible.

## Relationship to other documents

- [`../01-product/founding-connectors-program.md`](../01-product/founding-connectors-program.md) — the program's design and rules
- [`founding-connectors-message-pack.md`](founding-connectors-message-pack.md) — the messages referenced throughout
- [`../04-design/founding-connector-card-spec.md`](../04-design/founding-connector-card-spec.md) — what goes on the card
- [`chat-link-management.md`](chat-link-management.md) — rotating the WhatsApp invites behind `/go/<slug>`
- [`moderation.md`](moderation.md) — community-side enforcement
- [`../08-delivery/founding-connectors-mvp.md`](../08-delivery/founding-connectors-mvp.md) — the implementation these procedures drive
