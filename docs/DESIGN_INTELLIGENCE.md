# Design Intelligence — Project Connection Record

> This file is the project's contract with the canonical
> [`design-intelligence`](https://github.com/andrewheldy/design-intelligence) repository.
> It is read **first** by any agent doing design work here.
> It is owned by this project repository. It is not synchronized with anything.

## 1. Identity

| Field | Value |
|---|---|
| **Project name** | Miami Roots |
| **Project repository** | `https://github.com/andrewheldy/miami_roots` |
| **Product type** | `mixed` — the public gateway is a marketing surface; the member/admin product (M6 onward) is not built yet. Every task resolves to one surface type before a loadout is picked (contract §4.2). |
| **Primary surfaces** | Public gateway (`/`), shareable community hub (`/join`), invite hub (`/invite`), room explainer (`/groups`, `/groups/[slug]`), house rules (`/guidelines`), Founding Connectors (`/connectors`) |
| **Target users** | Miami locals looking for a real local community, and community leaders who bring their own groups in and connect people across them. Almost all arrive on a phone, from a WhatsApp message, a QR code, or an Instagram bio link. |
| **Project owner** | Andrew Heldy (repository owner; accountable for design and brand decisions here) |
| **Integration status** | `active` (integrated 2026-08-16; before that date the project was **not** integrated) |

## 2. Constraint envelope

| Field | Value |
|---|---|
| **Accessibility requirements** | WCAG 2.2 AA baseline. Additionally, in force since Milestone 2: visible focus on every interactive element via a single global `:focus-visible` rule, ≥44px touch targets on all primary actions (not just the 24px AA floor), and honest states instead of dead controls. No known open accessibility defects. |
| **Responsive requirements** | Mobile is the primary surface, not a fallback. 320–430px must survive with no horizontal scroll; 375×812 is the baseline review viewport; desktop ≥1280 is secondary; 200% zoom without horizontal scroll. Safe-area insets respected on full-bleed surfaces (`/join`, dialogs). |
| **Motion constraints** | Motion is restrained by standing decision (decision log 2026-07-19): opacity, translate, and scale only. No parallax, no looping, no scroll hijacking, no smooth-scroll library. Durations come from `src/components/motion/tokens.ts` (control 200ms, element 350ms, section 500ms); shared ease-out `cubic-bezier(0.22, 1, 0.36, 1)`. Every animation is either wrapped in `@media (prefers-reduced-motion: no-preference)` or gated by `useReducedMotion()`. |

**Non-overridable floor (do not edit):** `prefers-reduced-motion`, visible focus indicators, and WCAG AA contrast take precedence over every skill directive and every brand rule. An accessibility failure is never recorded as a permanent exception; it is recorded as an open defect with a remediation date.

## 3. Project-owned locations

| Field | Path (repo-relative) |
|---|---|
| **Brand-system location** | `src/styles/globals.css` (the implemented tokens, single definition point) plus `docs/04-design/brand-foundation.md` (provenance, sampled vs. stated values) and `docs/04-design/content-and-voice.md` (voice) |
| **Design-decision-log location** | `docs/07-decisions/decision-log.md` |
| **Reusable-findings location** | `docs/04-design/design-findings.md` |
| **Current design brief** | `docs/04-design/DESIGN_BRIEF.md` |

## 4. Canonical Design Intelligence link

| Field | Value |
|---|---|
| **Canonical repository URL** | `https://github.com/andrewheldy/design-intelligence` |
| **Canonical commit / release / version last reviewed** | `bf9b8b3b6997df3ab4d7958a9d1838d07c50470a` (registry version 2, updated 2026-07-26) |
| **Last review date** | 2026-08-16 |
| **Reviewed by** | Claude Code agent session, owner-directed. **Not yet confirmed by a human.** The ref above was read in full at that commit; the owner should confirm it at the next design pass. |

**Mechanism note (do not edit):** nothing is synchronized. This project does not pull, install, submodule, or vendor the canonical repository. Agents read it over the network at the ref above; a human updates the ref during a re-review.

## 5. Applicable Design Intelligence agents

- [x] `design-director` — **required** for any design task
- [x] `design-engineer` — **required** for any implementation
- [x] `accessibility-reviewer` — **always** runs on changed UI
- [x] `anti-slop-reviewer` — new or restyled visual surfaces
- [ ] `motion-reviewer` — only when the change contains animation (runs whenever a pass adds or alters motion; the 2026-08-16 pass added none)
- [x] `mobile-ux-reviewer` — only when a mobile/responsive surface changed (in practice: nearly always here)

## 6. Applicable registry entries

| Registry `id` | Status at last review | Why it applies here |
|---|---|---|
| `taste-skill` | approved | The opinion skill for the public gateway, which is a marketing surface. Used within its own stated scope (landing/marketing only), with the overrides in §7. |
| `emil-design-skills` | approved | Motion character authority. The project's motion tokens and restraint rules already encode its duration/easing/reduced-motion discipline. |
| `motion-intelligence` | approved (internal) | Entry point for any motion work, at `motion-director`. Owns engine choice, the motion spec, and browser verification. Read in place at the pinned ref; nothing installed. |
| `a11y-specialist-skills` | approved | Backs the Accessibility Reviewer (WCAG 2.2 + WAI-ARIA APG). |
| `motion` (library) | approved | Already a runtime dependency of this project (`motion@^12.42.2`, adopted 2026-07-19). Registered as a governance fact: MIT, tier 3, strongest reduced-motion primitives of the reviewed engines. |

All five entries carry `last_verified: 2026-07-26`, which is 21 days before this review. None is stale under the ~90-day rule (`AGENTS.md` rule 7).

**Nothing is installed.** No skill was installed into this repository, no install script was executed, and no registry content is copied here (contract §11). Third-party skill text was read at its canonical source and applied as guidance only.

**One-opinion-skill rule (do not edit):** never load more than one of `taste-skill`, Anthropic `frontend-design`, or `ui-ux-pro-max` for the same task. Marketing surfaces → `taste-skill`. Product UI → Anthropic `frontend-design`. `ui-ux-pro-max` is experimental and isolated-trial only. `emil-design-skills` is a motion authority, not an opinion skill, and may compose with any of them. A second opinion skill requires written justification in the brief naming which skill wins on each axis of conflict.

## 7. Current exceptions

| ID | Rule or recommendation overridden | Source | Reason | Approved by | Expires / review by | Status |
|---|---|---|---|---|---|---|
| EX-1 | "Avoid Inter/system stack as a default; rotate Geist, Outfit, Cabinet Grotesk, Satoshi" | `taste-skill` §4.1 | No typeface has been chosen or licensed for Miami Roots (open question #9). The app uses a neutral system stack from `src/styles/globals.css` by deliberate, documented interim decision. Hierarchy is carried by scale, weight, tracking, and case instead of by a display face. | owner (standing, via `docs/04-design/brand-foundation.md`) | Q#9 ratification | active |
| EX-2 | "No hand-rolled SVG icons; use Phosphor / HugeIcons / Radix / Tabler" | `taste-skill` §9 | The project ships no icon-library dependency and no decorative SVG. The few inline glyphs that exist are functional (share, close, arrow), single-purpose, and already shipped. Adding an icon package for a seven-glyph site is a dependency this brand does not need. | owner (repository dependency discipline, `CLAUDE.md`) | 2026-11-16 | active |
| EX-3 | "Dark mode tokens defined and tested in both modes" | `taste-skill` §14 pre-flight | The gateway deliberately locks `color-scheme: light`; the mint/forest identity is a light-ground identity and the palette is still provisional (open question #10). Shipping an unratified dark palette would create a second unratified brand. | owner (standing, `src/styles/globals.css`) | Q#10 ratification | active |
| EX-4 | "Use Picsum / Unsplash / generated placeholder imagery so no section is text-only" | `taste-skill` §4.8 | Miami Roots is a real community of real people. Stock or generated photos of invented "members" would misrepresent it, and no member photography has been cleared for public use. Only owner-supplied brand assets appear on the site. Sections carry weight through type, brand marks, and real generated QR codes instead. | owner (privacy and safety policy, `docs/03-architecture/privacy-and-safety.md`) | permanent | active |
| EX-5 | "Every section needs a real visual asset; pure text is incomplete work" | `taste-skill` §4.8 | Follows from EX-4. Enforced narrowly: the hero and the invite surface must carry a real visual (brand mark, hero media, live QR). Explanatory sections may be typographic. | owner | permanent | active |

*Scope note on the em-dash ban (`taste-skill` §9.G): it is **adopted, not excepted**, for all user-facing site copy. It is not applied to repository documentation, code comments, or commit messages, which are engineering artifacts and not design output.*

## 8. HeldyOS link (optional)

| Field | Value |
|---|---|
| **Obsidian note** | not recorded yet |

*Strategic reasoning, venture context, and portfolio priorities live in HeldyOS, not here. See the canonical repo's `docs/HELDYOS_BRIDGE.md`.*

---

## Required workflow

Follow in order. Do not skip steps to save time; the ordering is what keeps reviews cheap.

1. **Load project context.** Read this file in full — identity, constraint envelope, exceptions.
2. **Load project-specific design and brand rules.** Read the brand system at the path in §3, in full, not summarized.
3. **Read the canonical Design Intelligence integration contract** at the ref in §4: `AGENTS.md`, then `docs/INTEGRATION_CONTRACT.md`, then the `registry.yaml` entries listed in §6, then the agent specs listed in §5.
4. **Select no more than one opinionated design skill** (§6). More than one requires explicit written justification in the brief.
5. **Run the Design Director.** Output: `DESIGN_BRIEF.md` in this repository — design read, skill loadout with brand overrides stated, acceptance criteria.
6. **Produce the Design Engineer implementation plan** from the brief. Tokens before components; extend the existing system, never fork a parallel one.
7. **Implement within this project repository.** All code, tokens, and screenshots stay here.
8. **Run only the relevant reviewer agents** (§5 routing). A copy-only change does not need all four.
9. **Consolidate findings and remove duplicates.** Target-size and reflow overlaps between Mobile UX and Accessibility are reported once, under the Accessibility Reviewer's WCAG citation.
10. **Record accepted and rejected decisions** in the design decision log (§3). Every rejected recommendation gets: date, recommendation, source agent + registry entry, reason, decider. Recurring rejections are promoted to §7.
11. **Propose reusable lessons back to Design Intelligence.** Only findings that would hold for a different venture with a different brand. Stage them in the reusable-findings file (§3), then open a PR or issue against the canonical repo — a completed evaluation file for a new source, or a proposed diff plus evidence for an agent-spec refinement. Never commit directly to the canonical repo's `registry.yaml`, `agents/`, or `skills/` from a project workflow.

## If the canonical repository is unavailable

Network failure, unresolvable ref, or no access. Then:

- **State it explicitly at the top of the output** — which resource, which ref, what failed.
- Fall back only to material already in this repository: this file, the brand system, the decision log, prior briefs, and any `.claude/agents/` copies that record their source ref.
- Keep enforcing the accessibility floor (§2) and the one-opinion-skill rule (§6).
- Label all output **unverified loadout** and note in the brief that the registry was unreachable.
- Do **not**: install any skill, substitute a web-search result for a registry entry, reconstruct a registry entry or agent spec from memory, change §4, or propose anything upstream.
