---
title: Assumptions
type: context
status: active
owner: unassigned
created: 2026-07-16
updated: 2026-08-03
tags: [context, assumptions]
---

## Purpose

A single place to record assumptions made during repository foundation and early planning
— things treated as true for planning purposes but not actually confirmed by the project
owner. This exists specifically so assumptions don't get silently promoted to decisions.

## What belongs here

- Any assumption made to fill a gap in the source brief
- The date and reason an assumption was made
- Whether it has since been confirmed, changed, or superseded by a decision

## What does not belong here

- Confirmed facts (state those directly in the relevant doc)
- Settled decisions with a rationale (see `docs/07-decisions/decision-log.md`)
- Open questions that haven't even been provisionally answered (see
  `docs/02-planning/open-questions.md`)

## Known initial information

Assumptions made while establishing this repository (2026-07-16), pending confirmation:

1. **Group list is provisional.** The six community groups in
   `docs/00-context/community-groups.md` are treated as the current, real set, but exact
   names, count, and descriptions may change before or during build — this repo reflects
   what was provided at founding, not a locked spec.
2. **Brand assets are approved for production use, but no brand guide exists.**
   *(Updated 2026-07-16.)* The owner confirmed the supplied Miami Roots logos and subgroup
   assets are approved production assets (unless clearly screenshots, references, drafts,
   or alternates — none of the five supplied files were). Color values have since been
   measured by sampling the files (see `docs/04-design/brand-foundation.md`) but no
   ratified brand guide, canonical hex pair, or typeface decision exists yet.
3. **"Ticket Exchange" is a future group, not a current one.** A concept logo for it exists
   in the same asset drop as the current group logos, but the brief explicitly places
   ticket resale out of scope for the initial six groups. Treated as future-phase only.
4. **Points/rewards mechanics are undefined.** The brief specifies principles (append-only
   ledger, contribution-based, not click-only) but no concrete point values, reward catalog,
   or redemption flow. Nothing here should be read as specifying those.
5. **No legal/compliance review has happened.** Anything related to privacy, data
   retention, or messaging compliance (e.g. WhatsApp's own terms around automated invite
   handling) is unverified and should be treated as a research item, not a constraint
   that's already been checked (see `docs/06-research/research-backlog.md`).
6. **Single-market assumption.** Everything here assumes Miami-only scope for the
   foreseeable future; no multi-city expansion has been discussed.

Added during the MVP planning pass (2026-07-16):

7. **WhatsApp gives the app no dependable programmatic signals** (joins, membership,
   activity, invite attribution, webhooks). The architecture assumes the pessimistic
   case deliberately; validating any richer access is research backlog #1. If richer
   access exists, workflows relax — nothing breaks.
8. **Announced source material is treated as forthcoming, not present.** Group
   screenshots, a parent banner, and further assets were announced but not received as
   of 2026-07-16 (see `docs/00-context/source-material-register.md`); plans include
   fallbacks rather than waiting.
9. **Recommended defaults are not owner decisions.** The planning pass proposes defaults
   (auth model, onboarding fields, 30-day attribution / 14-day retention windows, point
   values, manual verification) labeled as such in
   `docs/02-planning/open-questions.md`; each needs ratification at its decision gate in
   `docs/08-delivery/implementation-plan.md` before it hardens.
10. **Admin capacity is small but sufficient for a manual verification loop** at current
    community scale. Unvalidated (no volume data); the funnel's admin-time-per-member is
    kept minimal by design, and this assumption is revisited with real queue metrics
    after launch.

Added during the Milestone 2.5 shareable-hub pass (2026-07-18):

11. **The hub brief's chat labels do not rename the groups.** The M2.5 task brief listed
    two chats under labels that differ from the content model's group names — "Daytime
    Events & Wellness" (group: *Daytime Events*) and "Sober Support" (group: *Sober
    Social*). The `/join` hub displays the existing content-model names, treating the
    brief's labels as descriptions of *which* chats to include, not as a resolution of
    naming open question #10. The `/go/` redirect slugs and env-var names, however, follow
    the brief verbatim (`/go/sober-support`, `WHATSAPP_SOBER_SUPPORT_URL`, `/go/nightlife-events`,
    `WHATSAPP_NIGHTLIFE_EVENTS_URL`) because those were specified as an explicit contract
    and are stable-once-shipped regardless of how Q#10 resolves. If the owner intends the
    brief's labels as actual renames, update `src/content/groups/groups.ts` and close Q#10.

Added during the Milestone 3 pass (2026-07-18):

12. **No hosted Supabase projects exist yet.** No staging/production project URL, anon
    key, service-role key, access token, or database URL was present in any environment
    at M3 implementation time, so the milestone's remote half (project creation,
    `db push`, Vercel env) is treated as not-yet-done owner work — see the owner
    checklist in `docs/08-delivery/milestone-3-database-foundation.md`. If projects do
    exist somewhere, nothing conflicts: the committed migrations are the source of truth
    and push cleanly onto an empty project.

Added during the community-share pass (2026-07-19):

13. **The stable share destination is `https://miami-roots.vercel.app/join`.** The
    share feature was directed to encode this exact production website URL into every QR
    and downloadable asset, hardcoded (not `siteConfig.url`, which is environment-derived).
    The assumption is that this Vercel URL is the durable public entry point; if a custom
    domain is later adopted, change `JOIN_DESTINATION_URL` in
    `src/lib/share/destination.ts` — but note any QR already printed/posted will still
    resolve only while the Vercel URL remains reachable, so a redirect from the old URL
    should be kept if the domain moves.
14. **Campaign attribution is non-personal and channel-tagged.** All shares carry
    `ref=community-share&utm_source=member_share&utm_campaign=miami_roots_growth`; only
    `utm_medium` varies by channel (`qr` for the printed/scanned codes exactly as briefed,
    `web_share` and `copy_link` for the other channels). No per-member referral identity is
    minted — that awaits the M5/M11 referral architecture. The captured first-touch value on
    `/join` is stored in `sessionStorage` (key `miami-roots:attribution`) as a foundation the
    analytics/referral layer can later read; nothing reads it yet.
15. **Downloadable-asset copy is provisional.** The Story ("Meet your people in Miami." /
    "Scan to join Miami Roots.") and square ("Put down roots with us." / "Scan to join Miami
    Roots.") card copy was supplied by the share brief and is treated like the rest of the
    gateway copy — provisional pending an owner voice pass (Q#9). It is public-safe (no
    invite links, phone numbers, or private data), enforced by test.

Added during the Founding Connectors pass (2026-08-03):

16. **Cards are printed with the domain `myroots.dev`.** The program brief specifies
    `myroots.dev/r/<code>` as the card URL. The site currently deploys to a Vercel URL, and
    no evidence in this repository confirms that `myroots.dev` is registered and pointed at
    the deployment. Everything is *specified* against `myroots.dev`; nothing is *printed*
    until the owner confirms it resolves. Note the tension with assumption 13, which
    hardcodes the Vercel URL for share assets — if the custom domain lands, both should
    move together and the old URL should keep redirecting.
17. **`?s=n` and `?s=q` are the NFC/QR discriminator.** The NFC chip and the printed QR
    encode the same `/r/<code>` URL with different `s` values, because nothing else can
    distinguish them without device fingerprinting (which the privacy design rules out).
    An absent or unrecognized value is recorded as `unknown`, never inferred.
18. **A disabled card still opens the community door, uncredited.** A `paused` or `retired`
    card redirects to the default destination with no `utm_content`, rather than 404ing.
    The reasoning: a real person may be standing in front of a real card, and a dead end
    punishes the wrong person. An *unissued* code still 404s. This is a program-behavior
    assumption, reversible in one place (`src/lib/connectors/destination.ts`) if the owner
    prefers a hard stop.
19. **Cohort size, benefits, retention windows, and review cadence are recommended
    defaults.** ~20–30 connectors, the benefits table, 12-month/6-month nomination
    retention, and monthly review all come from this design pass, not from an owner
    decision. They are implementable and owner-tunable.
20. **Connector cards are not member referral links.** The program treats `connectors` and
    the planned M5 `referral_links` as separate systems with separate lifecycles, on the
    reasoning in `docs/08-delivery/founding-connectors-mvp.md`. If the owner would rather
    a connector card *be* a member referral link, that is a real design change and should
    be decided before M5 is built.

21. **"Rooms" is the right public word for the seven WhatsApp groups.** The 2026-08-16
    redesign calls them rooms throughout, on the reasoning that a person joining one
    community with spaces inside it does not think in "groups", and that the word carries
    the walk-in-and-belong feeling the owner asked for. The underlying content model still
    calls them groups. Cheap to reverse in copy; do it everywhere at once if reversed.
22. **The parent community invite is stable enough to be the site's only destination.**
    Every page now depends on one WhatsApp link resolving. The assumption is that it is
    rotated deliberately, in hosting, and rarely. If it turns out to churn, the unavailable
    state becomes a much more visible surface than it is designed to be.
23. **A message a member can copy is worth more than a share button.** `/invite` ships a
    ready-to-send message on the assumption that "I don't know what to say" is a bigger
    barrier to inviting people than friction in the share sheet. Unverified; worth watching
    once there is any way to observe it.

## Relationship to other documents

When an assumption here is confirmed or changed, either update it in place (with an updated
`updated` date) or move it to `docs/07-decisions/decision-log.md` if it becomes a real
decision, and mark it superseded here.
