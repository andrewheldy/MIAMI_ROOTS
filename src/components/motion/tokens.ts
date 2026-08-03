/**
 * The single source of motion truth for Miami Roots. Every animated component
 * imports its easing and durations from here so the site moves as one system
 * rather than a scatter of hand-tuned values. Kept deliberately small and
 * restrained (see the motion standards in the delivery record): opacity,
 * translate, and scale only — no springy overshoot, no looping, no parallax.
 *
 * Duration bands (seconds):
 *   - control  — buttons, hamburger, small controls        (~160–250ms)
 *   - element  — menu links, cards, entrance items         (~250–450ms)
 *   - section  — larger viewport reveals                    (~350–600ms)
 */

/** Shared ease-out curve — matches the `/join` hub's existing `join-rise`. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  control: 0.2,
  element: 0.35,
  section: 0.5,
} as const;

/** Default viewport trigger for scroll reveals: fire once, a little early. */
export const REVEAL_VIEWPORT = { once: true, margin: "-80px 0px" } as const;

/** How far reveal/stagger items translate in before settling (px). */
export const REVEAL_OFFSET = 16;
