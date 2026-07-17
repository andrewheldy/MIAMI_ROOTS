import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { CommunityFinder } from "@/features/matching/community-finder";

export const metadata: Metadata = {
  title: "Find your people",
  description:
    "Answer three quick questions to find a Miami Roots community worth exploring first.",
};

export default function FindYourPeoplePage() {
  return (
    <>
      <section className="bg-sun py-20 sm:py-28 lg:py-32">
        <Container className="max-w-7xl">
          <p className="text-forest/55 text-xs font-semibold tracking-[0.2em] uppercase">
            Find your people
          </p>
          <h1 className="font-display text-forest mt-7 max-w-6xl text-6xl leading-[0.88] font-semibold tracking-[-0.065em] text-balance sm:text-8xl lg:text-9xl">
            Start with the energy you want more of.
          </h1>
          <p className="text-forest/70 mt-8 max-w-2xl text-lg leading-relaxed">
            Three questions. No account, no email, and no data saved—just a
            thoughtful way to choose your first community.
          </p>
        </Container>
      </section>

      <section className="bg-cream py-20 sm:py-28 lg:py-32">
        <Container className="max-w-5xl">
          <CommunityFinder />
        </Container>
      </section>
    </>
  );
}
