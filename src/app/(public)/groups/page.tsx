import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { CommunityCard } from "@/features/groups/community-card";
import { communityGroups } from "@/features/groups/content";

export const metadata: Metadata = {
  title: "Communities",
  description:
    "Explore the six Miami Roots communities for conversation, business, nightlife, wellness, volunteering, and sober socializing.",
};

export default function GroupsPage() {
  return (
    <>
      <section className="bg-mint-100 py-20 sm:py-28 lg:py-36">
        <Container className="max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="text-forest/55 text-xs font-semibold tracking-[0.2em] uppercase">
                Explore communities
              </p>
              <h1 className="font-display text-forest mt-7 text-6xl leading-[0.88] font-semibold tracking-[-0.065em] text-balance sm:text-8xl lg:text-9xl">
                Your way into Miami.
              </h1>
            </div>
            <p className="text-forest/70 max-w-xl text-lg leading-relaxed lg:pb-2">
              Start with the thing you already care about. Each community has
              its own rhythm, purpose, and people ready to make the city feel a
              little smaller.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-background py-20 sm:py-28 lg:py-32">
        <Container className="max-w-7xl">
          <div className="grid gap-5 md:grid-cols-2">
            {communityGroups.map((group) => (
              <CommunityCard key={group.slug} group={group} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-forest py-20 sm:py-24">
        <Container className="flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-mint text-xs font-semibold tracking-[0.18em] uppercase">
              Not sure where to begin?
            </p>
            <p className="font-display text-cream mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
              General Chat is the open table.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/find-your-people" variant="light">
              Find your people
              <ArrowRightIcon className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink
              href="/groups/general-chat"
              variant="outline"
              className="text-cream hover:bg-cream hover:text-forest border-white/25"
            >
              Start with General
              <ArrowRightIcon className="h-4 w-4" />
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
