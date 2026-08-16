# DESIGN_BRIEF — Community-first gateway

**Date:** 2026-08-16 · **Surface type:** marketing · **Redesign mode:** overhaul of layout, IA and copy; **preserve** brand (mark, mint/forest palette, motion language)
**Owner request (verbatim intent):** one big call to action to join the WhatsApp community; the site explains what the community is for and why each chat exists so people find their people; it is also a way for community leaders to reach each other's people; nobody joins individual chats from the site right now; after joining, members read the rules and invite friends; the invite link must be copyable and shareable as a QR code; a points-for-invites program may follow.

## Design read

This is a doorway, not a directory. The visitor is standing on a Miami sidewalk holding a phone, one tap from a room full of people they have not met yet, and the only feeling the page has to produce is *walk in, you are already welcome*. Everything else on the page exists to answer the two questions someone asks in the four seconds before they tap: what is this, and will my people be in there. Density stays low and mobile-first; motion stays near-silent because the audience is arriving over cell data with one thumb; quality here means the page feels like it was written by a person who actually runs this community, not assembled from a template.

**Design read (one line):** Reading this as a mobile-first community landing page for Miami locals and community leaders, with a warm, plainspoken, sunlight-and-shade language, leaning toward editorial rather than SaaS.

## Skill loadout

| Loaded | Role |
|---|---|
| `taste-skill` (registry: approved) | The single opinion skill. Correct by rule 3: this is a marketing surface, which is also the skill's own stated scope. |
| `emil-design-skills` (approved) | Motion character authority. Composes; not an opinion skill. |
| `motion-intelligence` (approved, internal) | Entered at `motion-director` for the motion decision. Outcome recorded below. |
| `a11y-specialist-skills` (approved) | Backs the Accessibility Reviewer. |

Anthropic `frontend-design` and `ui-ux-pro-max` are **not** loaded (rule 3, one opinion skill). Nothing was installed; all sources were read at their canonical locations.

**Dials:** `DESIGN_VARIANCE 7` · `MOTION_INTENSITY 3` · `VISUAL_DENSITY 3`.
Reasoned, not baseline. Variance 7 (not the 8 default) because trust is part of the value proposition and a community for strangers cannot look like an experiment; asymmetry is expressed through off-axis layout and section rhythm rather than through novelty. Motion 3 is a deliberate reduction from the 6 default: the audience is on phones and cell data, the project has a standing restraint decision, and at 3 the skill's "motion claimed, motion shown" obligation does not apply, so the page ships clean and static rather than half-animated. Density 3 because a doorway with one action does not need a cockpit.

## Brand overrides (brand beats skill)

Recorded in full in `docs/DESIGN_INTELLIGENCE.md` §7 as EX-1 to EX-5. Summary of what displaces a skill directive here:

1. **Type:** system stack stays (EX-1). No typeface is licensed yet (open Q#9), so hierarchy is built from scale, weight, tracking, and case.
2. **Icons:** no icon-library dependency, no decorative SVG (EX-2). Existing functional glyphs only.
3. **Theme:** light only (EX-3). The palette is provisional (Q#10) and a second unratified palette is worse than none.
4. **Imagery:** owner-supplied assets only. No stock photography, no invented people, no fabricated testimonials or member counts (EX-4/EX-5). This is a real community.
5. **Copy:** the em-dash ban is **adopted**, not overridden, for every user-facing string on the site.

## Motion decision (`motion-director`, step 1)

**Objective test:** what goes wrong for the user without new motion? Nothing. The page has one action and no state that needs spatial explanation. **Outcome: `engine: none` for new motion.** No animation is added by this pass. The existing, already-approved patterns are reused unchanged (`join-rise` CSS entrance, the `MotionReveal` / `StaggerReveal` islands, the mobile-nav sheet), each of which already carries its reduced-motion handling. No motion spec is produced because no motion is specified; the Motion Reviewer therefore does not run (contract §5 routing). If a later pass adds motion, it enters at `motion-director` first.

## Acceptance criteria

1. One dominant call to action, one label, one destination, present in the header, the hero, and the close of every public page; no competing "join" intent anywhere on the site.
2. No route in the public UI links a visitor into an individual WhatsApp chat. The `/go/<slug>` routes keep working for links already printed in the world, but nothing on the site points at them.
3. Every room is explained in terms of who it is for and why it exists, readable without joining anything.
4. The invite path works with no account and no database: a real scannable QR, a link that can be selected and copied by hand as well as by button, a native share, and downloadable cards.
5. Passes the Anti-Slop review at **DISTINCTIVE**, with zero em-dashes, no three-equal-card section, no repeated section layout family, and eyebrow count within `ceil(sections / 3)`.
6. Passes the Accessibility review with zero blockers, verified by keyboard walk, contrast check, and a reduced-motion pass, at 375px and desktop.
7. Passes the Mobile UX review at 320px, 375px, and 430px with no horizontal scroll and every primary action inside thumb reach.

## Open questions

- **Rewards.** The owner has said a points-for-invites program is likely but undecided. The site states intent in the softest honest form and promises no mechanics, no rates, and no rewards. Nothing is tracked or accrued. Escalates open question O#12 (see `docs/02-planning/open-questions.md`).
- ~~**The community invite URL is not configured.**~~ Resolved 2026-08-17: the destination is a build-time constant and the route needs no environment variable. The unavailable state on that path is gone (decision log 2026-08-17).
- **Voice.** All copy on this pass is still provisional pending the owner voice pass (Q#9/Q#10). It is closer to the owner's spoken brief than the previous copy, but it has not been read back by the owner.
