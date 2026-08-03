"use client";

import {
  m,
  LazyMotion,
  domAnimation,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { Children, createElement, type ReactNode } from "react";

import { DURATION, EASE_OUT, REVEAL_OFFSET } from "./tokens";
import { useMounted } from "./use-mounted";

/** Container element tags this supports (kept small to keep the types simple). */
type ContainerTag = "div" | "ul" | "ol";
/** Item wrapper tags. */
type ItemTag = "div" | "li";

interface StaggerRevealProps {
  children: ReactNode;
  /** Container element. Defaults to `<div>`. */
  as?: ContainerTag;
  /** Element wrapped around each child. Defaults to `<div>`. */
  itemAs?: ItemTag;
  /** `mount` animates immediately (above-the-fold hero); `view` waits for scroll. */
  trigger?: "mount" | "view";
  /** Seconds between each child's entrance. */
  stagger?: number;
  /** Seconds to wait before the first child animates. */
  delayStart?: number;
  className?: string;
  itemClassName?: string;
}

const container = (stagger: number, delayStart: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delayStart } },
});

const item: Variants = {
  hidden: { opacity: 0, y: REVEAL_OFFSET },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.element, ease: EASE_OUT },
  },
};

/**
 * Reveals its children one after another with a small stagger — a coordinated
 * entrance for a hero, or a gentle cascade for a card grid. Each child is
 * wrapped in its own animated item.
 *
 * Reduced motion collapses to a plain render (all children visible, no
 * transform). A thin client wrapper around server-rendered children, so callers
 * stay Server Components.
 */
export function StaggerReveal({
  children,
  as = "div",
  itemAs = "div",
  trigger = "view",
  stagger = 0.08,
  delayStart = 0,
  className,
  itemClassName,
}: StaggerRevealProps) {
  const reduceMotion = useReducedMotion();
  const mounted = useMounted();
  const items = Children.toArray(children);

  // Server + first client render (and reduced motion): plain, visible markup —
  // never hidden before hydration, and readable with JS disabled.
  if (reduceMotion || !mounted) {
    return createElement(
      as,
      { className },
      items.map((child, i) =>
        createElement(itemAs, { key: i, className: itemClassName }, child),
      ),
    );
  }

  // Cast the dynamically chosen tag to a single motion component type so the
  // JSX type stays simple (indexing `m` by tag otherwise explodes the union).
  const MotionContainer = m[as] as typeof m.div;
  const MotionItem = m[itemAs] as typeof m.div;

  const activation =
    trigger === "mount"
      ? { animate: "show" as const }
      : {
          whileInView: "show" as const,
          viewport: { once: true, margin: "-60px 0px" },
        };

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionContainer
        className={className}
        variants={container(stagger, delayStart)}
        initial="hidden"
        {...activation}
      >
        {items.map((child, i) => (
          <MotionItem key={i} className={itemClassName} variants={item}>
            {child}
          </MotionItem>
        ))}
      </MotionContainer>
    </LazyMotion>
  );
}
