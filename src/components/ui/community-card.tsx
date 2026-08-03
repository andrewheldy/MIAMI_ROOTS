"use client";

import { m, LazyMotion, domAnimation, useReducedMotion } from "motion/react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { GroupLogo } from "@/components/ui/group-logo";
import { SafetyBadge } from "@/components/ui/safety-badge";
import { DURATION, EASE_OUT } from "@/components/motion/tokens";
import { categoryLabels, type CommunityGroup } from "@/content/groups";
import { getGoPath } from "@/content/join/chat-links";

interface CommunityCardProps {
  group: CommunityGroup;
}

/**
 * Directory card for one community group with two distinct, touch-friendly
 * actions: the whole card is a stretched link to the group's detail page, and a
 * separate "Join chat" control routes to the controlled `/go/<slug>` redirect.
 * The two are siblings (not nested links), so both are real, independent tab
 * stops that work on touch — no hidden hover-only affordances.
 *
 * Motion is restrained: a small hover lift and press feedback, with the arrow
 * nudging on hover to reinforce the action. Reduced motion disables all of it.
 * Client Component for the interaction only; its group data comes from a server
 * parent as a plain prop.
 */
export function CommunityCard({ group }: CommunityCardProps) {
  const reduceMotion = useReducedMotion();
  const goPath = getGoPath(group.slug);

  return (
    <LazyMotion features={domAnimation}>
      <m.article
        className="group border-border bg-background hover:border-forest/40 relative flex h-full flex-col rounded-xl border p-5 transition-colors"
        whileHover={reduceMotion ? undefined : { y: -3 }}
        whileTap={reduceMotion ? undefined : { scale: 0.99 }}
        transition={{ duration: DURATION.control, ease: EASE_OUT }}
      >
        <div className="flex items-center gap-4">
          <GroupLogo group={group} />
          <div className="min-w-0">
            <h3 className="text-forest group-hover:text-forest-600 text-lg font-semibold text-balance">
              <Link
                href={`/groups/${group.slug}`}
                className="rounded-md after:absolute after:inset-0 after:rounded-xl"
              >
                {group.name}
              </Link>
            </h3>
            <Badge tone="neutral" className="mt-1">
              {categoryLabels[group.category]}
            </Badge>
          </div>
        </div>

        <p className="text-muted mt-4 text-sm leading-relaxed">
          {group.shortDescription}
        </p>

        {group.safety ? (
          <div className="mt-4">
            <SafetyBadge label={group.safety.badge} />
            <p className="text-muted mt-2 text-xs leading-relaxed">
              {group.safety.summary}
            </p>
          </div>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="text-forest-600 inline-flex items-center gap-1 text-sm font-medium">
            Explore
            <span
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </span>
          {goPath ? (
            <Link
              href={goPath}
              aria-label={`Join the ${group.name} chat`}
              className="text-forest border-border hover:border-forest/40 hover:bg-surface relative z-10 inline-flex min-h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-semibold transition-colors"
            >
              Join chat
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
              >
                <path d="M4.5 11.5l7-7m0 0H6m5.5 0V10" />
              </svg>
            </Link>
          ) : null}
        </div>
      </m.article>
    </LazyMotion>
  );
}
