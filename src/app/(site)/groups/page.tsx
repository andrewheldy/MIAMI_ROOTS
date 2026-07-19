import type { Metadata } from "next";

import { MotionReveal } from "@/components/motion/motion-reveal";
import { StaggerReveal } from "@/components/motion/stagger-reveal";
import { CommunityCard } from "@/components/ui/community-card";
import { EmptyState } from "@/components/ui/empty-state";
import { ActionLink } from "@/components/ui/action-link";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublishedGroups } from "@/content/groups";

export const metadata: Metadata = {
  title: "Groups",
  description:
    "Explore the Miami Roots community groups — business, wellness, nightlife, events and tickets, volunteering, sober social, and everyday conversation.",
};

export default function GroupsPage() {
  const groups = getPublishedGroups();

  return (
    <Section aria-labelledby="groups-heading">
      <MotionReveal>
        <SectionHeading
          as="h1"
          id="groups-heading"
          eyebrow="Community directory"
          title="Explore the communities"
          description="Each Miami Roots group is a focused space with its own purpose and its own WhatsApp chat. Open a group to learn more, or jump straight into its chat."
        />
      </MotionReveal>

      {groups.length > 0 ? (
        <StaggerReveal
          as="ul"
          itemAs="li"
          className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          itemClassName="h-full"
          stagger={0.06}
        >
          {groups.map((group) => (
            <CommunityCard key={group.slug} group={group} />
          ))}
        </StaggerReveal>
      ) : (
        <div className="mt-10">
          <EmptyState
            title="No groups to show yet"
            description="The community directory is being prepared. Please check back soon."
          >
            <ActionLink href="/" variant="secondary">
              Back to home
            </ActionLink>
          </EmptyState>
        </div>
      )}
    </Section>
  );
}
