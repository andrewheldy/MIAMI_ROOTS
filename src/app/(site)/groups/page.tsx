import type { Metadata } from "next";

import { CommunityCard } from "@/components/ui/community-card";
import { EmptyState } from "@/components/ui/empty-state";
import { ActionLink } from "@/components/ui/action-link";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublishedGroups } from "@/content/groups";

export const metadata: Metadata = {
  title: "Groups",
  description:
    "Explore the Miami Roots community groups — business, wellness, nightlife, volunteering, sober social, and everyday conversation.",
};

export default function GroupsPage() {
  const groups = getPublishedGroups();

  return (
    <Section aria-labelledby="groups-heading">
      <SectionHeading
        as="h1"
        id="groups-heading"
        eyebrow="Community directory"
        title="Explore the communities"
        description="Each Miami Roots group is a focused space with its own purpose and norms. Find the ones that fit your life in the city."
      />

      {groups.length > 0 ? (
        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <li key={group.slug} className="h-full">
              <CommunityCard group={group} />
            </li>
          ))}
        </ul>
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
