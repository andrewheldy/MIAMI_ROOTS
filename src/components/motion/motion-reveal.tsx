"use client";

import { m, LazyMotion, domAnimation, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { DURATION, EASE_OUT, REVEAL_OFFSET, REVEAL_VIEWPORT } from "./tokens";
import { useMounted } from "./use-mounted";

interface MotionRevealProps {
  children: ReactNode;
  /** Seconds to wait after the element scrolls into view. */
  delay?: number;
  className?: string;
}

/**
 * A restrained scroll-into-view reveal for a major page section. Fades and lifts
 * its content once, the first time it enters the viewport. Content is always in
 * the DOM and readable — the animation only affects opacity/transform, so a
 * failed or reduced-motion render simply shows the finished state.
 *
 * When the visitor prefers reduced motion, it renders a plain `<div>` with no
 * transform at all (no replacement movement), satisfying the reduced-motion
 * contract. A thin client wrapper: it takes already server-rendered children,
 * so pages stay Server Components.
 */
export function MotionReveal({
  children,
  delay = 0,
  className,
}: MotionRevealProps) {
  const reduceMotion = useReducedMotion();
  const mounted = useMounted();

  // Server + first client render (and reduced motion): plain, visible markup —
  // never hidden before hydration, and readable with JS disabled.
  if (reduceMotion || !mounted) {
    return <div className={className}>{children}</div>;
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        className={className}
        initial={{ opacity: 0, y: REVEAL_OFFSET }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={REVEAL_VIEWPORT}
        transition={{ duration: DURATION.section, ease: EASE_OUT, delay }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
