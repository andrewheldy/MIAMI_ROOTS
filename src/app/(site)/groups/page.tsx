import type { Metadata } from "next";

import { MotionReveal } from "@/components/motion/motion-reveal";
import { StaggerReveal } from "@/components/motion/stagger-reveal";
import { CommunityCard } from "@/components/ui/community-card";
import { EmptyState } from "@/components/ui/empty-state";
import { ActionLink } from "@/components/ui/action-link";
import { JoinAction } from "@/components/ui/join-action";
import { Section } from "@/components/ui/section";
import { getPublishedGroups } from "@/content/groups";

export const metadata: Metadata = {
  title: "The rooms",
  description:
    "The seven rooms inside the Miami Roots community: everyday conversation, business, wellness mornings, nightlife, tickets, volunteering, and sober social life.",
};

export default function GroupsPage() {
  const groups = getPublishedGroups();

  return (
    <>
      <Section aria-labelledby="groups-heading">
        <MotionReveal className="max-w-2xl">
          <h1
            id="groups-heading"
            className="text-display text-forest font-bold text-balance"
          >
            The rooms inside
          </h1>
          <p className="text-lede text-muted mt-6 max-w-[54ch] text-pretty">
            Miami Roots is one WhatsApp community, divided into rooms with
            stated purposes. Read them here, then walk into whichever ones are
            yours once you are in.
          </p>
        </MotionReveal>

        {groups.length > 0 ? (
          <StaggerReveal
            as="ul"
            itemAs="li"
            className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            itemClassName="h-full"
            stagger={0.06}
          >
            {groups.map((group) => (
              <CommunityCard key={group.slug} group={group} as="h2" />
            ))}
          </StaggerReveal>
        ) : (
          <div className="mt-10">
            <EmptyState
              title="No rooms to show yet"
              description="The room list is being prepared. Please check back soon."
            >
              <ActionLink href="/" variant="secondary">
                Back to home
              </ActionLink>
            </EmptyState>
          </div>
        )}
      </Section>

      <Section tone="surface" aria-labelledby="groups-cta-heading">
        <MotionReveal className="max-w-2xl">
          <h2
            id="groups-cta-heading"
            className="text-title text-forest font-bold text-balance"
          >
            You do not join these one by one
          </h2>
          <p className="text-muted mt-4 max-w-[54ch] leading-relaxed">
            Join the community once and every room above is on the other side of
            that one door. Nobody adds you to anything you did not open
            yourself.
          </p>
          <div className="mt-8">
            <JoinAction withNote block />
          </div>
        </MotionReveal>
      </Section>
    </>
  );
}
