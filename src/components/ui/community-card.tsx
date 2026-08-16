"use client";

import { m, LazyMotion, domAnimation, useReducedMotion } from "motion/react";
import Link from "next/link";

import { GroupLogo } from "@/components/ui/group-logo";
import { SafetyBadge } from "@/components/ui/safety-badge";
import { DURATION, EASE_OUT } from "@/components/motion/tokens";
import { type CommunityGroup } from "@/content/groups";

interface CommunityCardProps {
  group: CommunityGroup;
  /**
   * Heading level for the room name. Defaults to `h3`, which is right under a
   * section's own `h2`. The rooms directory renders the grid directly under its
   * `h1`, so it passes `h2` and keeps the document outline unbroken.
   */
  as?: "h2" | "h3";
}

/**
 * Directory card for one room. The whole card is a single stretched link to the
 * room's page, and that is the only action on it.
 *
 * It used to carry a second "Join chat" control routing to `/go/<slug>`. That
 * was removed on 2026-08-16 by owner decision: visitors join the parent
 * community, and find their rooms from inside it. One card, one destination,
 * no choice to make.
 *
 * Motion is restrained: a small hover lift and press feedback. Reduced motion
 * disables all of it. Client Component for the interaction only; its group data
 * comes from a server parent as a plain prop.
 */
export function CommunityCard({ group, as = "h3" }: CommunityCardProps) {
  const reduceMotion = useReducedMotion();
  const Heading = as;

  return (
    <LazyMotion features={domAnimation}>
      <m.article
        className="group border-border bg-background hover:border-forest/40 relative flex h-full flex-col rounded-xl border p-5 transition-colors"
        // Hover lift only. A `whileTap` here made Motion add `tabIndex={0}` to
        // the article, which put a focusable element with nothing to activate
        // in front of the card's own link on every keyboard pass.
        whileHover={reduceMotion ? undefined : { y: -3 }}
        transition={{ duration: DURATION.control, ease: EASE_OUT }}
      >
        <div className="flex items-center gap-4">
          <GroupLogo group={group} />
          <Heading className="text-forest group-hover:text-forest-600 min-w-0 text-lg font-semibold text-balance">
            <Link
              href={`/groups/${group.slug}`}
              className="rounded-md after:absolute after:inset-0 after:rounded-xl"
            >
              {group.name}
            </Link>
          </Heading>
        </div>

        <p className="text-forest-600 mt-4 font-medium text-pretty">
          {group.forYouIf}
        </p>
        <p className="text-muted mt-2 text-sm leading-relaxed">
          {group.shortDescription}
        </p>

        {group.safety ? (
          <div className="mt-4">
            <SafetyBadge label={group.safety.badge} />
          </div>
        ) : null}

        <span className="text-forest-600 mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold">
          Why this room exists
          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </span>
      </m.article>
    </LazyMotion>
  );
}
