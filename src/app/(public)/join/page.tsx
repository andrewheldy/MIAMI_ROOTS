import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Join Miami Roots",
  description:
    "How approved access, member referrals, community leadership, and future Miami Roots participation are intended to work.",
};

const accessSteps = [
  [
    "Explore publicly",
    "Read about every current community before choosing where to begin.",
  ],
  [
    "Request or receive a referral",
    "Access is intended to come through a trusted member or a short request reviewed by an organizer.",
  ],
  [
    "Organizer review",
    "A community lead checks fit and protects the group from spam, scams, and unsolicited promotion.",
  ],
  [
    "Join with context",
    "Approved members receive the current private access path and enter with the community rules already clear.",
  ],
] as const;

export default function JoinPage() {
  return (
    <>
      <section className="bg-forest py-20 sm:py-28 lg:py-36">
        <Container className="max-w-7xl">
          <p className="text-mint text-xs font-semibold tracking-[0.2em] uppercase">
            Join Miami Roots
          </p>
          <h1 className="font-display text-cream mt-8 max-w-6xl text-6xl leading-[0.88] font-semibold tracking-[-0.065em] text-balance sm:text-8xl lg:text-9xl">
            Open to explore. Curated with care.
          </h1>
          <p className="text-cream/65 mt-9 max-w-2xl text-lg leading-relaxed">
            Anyone can learn what Miami Roots is building. Entry to private
            community spaces is intended for adults 18+ through member referral
            or organizer approval.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/groups" variant="light">
              Explore communities
              <ArrowRightIcon className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink
              href="/find-your-people"
              variant="outline"
              className="text-cream hover:bg-cream hover:text-forest border-white/25"
            >
              Find your people
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section className="bg-cream py-24 sm:py-32 lg:py-40">
        <Container className="max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
            <div>
              <p className="text-forest/55 text-xs font-semibold tracking-[0.2em] uppercase">
                The access model
              </p>
              <h2 className="font-display text-forest mt-7 text-5xl leading-none font-semibold tracking-[-0.055em] sm:text-6xl">
                A deliberate first hello.
              </h2>
            </div>
            <ol className="border-forest/15 border-t">
              {accessSteps.map(([title, body], index) => (
                <li
                  key={title}
                  className="border-forest/15 grid gap-4 border-b py-7 sm:grid-cols-[3rem_1fr]"
                >
                  <span className="text-forest/40 font-mono text-xs">
                    0{index + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-forest text-2xl font-semibold tracking-[-0.035em]">
                      {title}
                    </h3>
                    <p className="text-muted mt-3 max-w-2xl leading-relaxed">
                      {body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <section className="bg-mint-100 py-24 sm:py-32">
        <Container className="grid max-w-7xl gap-10 lg:grid-cols-2">
          <article className="border-forest/10 bg-background rounded-[2rem] border p-8 sm:p-10">
            <p className="text-forest/55 text-xs font-semibold tracking-[0.18em] uppercase">
              Member requests
            </p>
            <h2 className="font-display text-forest mt-7 text-4xl font-semibold tracking-[-0.05em]">
              Applications are not live yet.
            </h2>
            <p className="text-muted mt-5 leading-relaxed">
              The site does not collect applications or expose WhatsApp invite
              links today. When the review workflow is ready, this page will
              become the stable entry point.
            </p>
            <ButtonLink href="/groups" className="mt-8">
              Choose a community first
              <ArrowRightIcon className="h-4 w-4" />
            </ButtonLink>
          </article>

          <article
            id="organizers"
            className="bg-sun rounded-[2rem] p-8 sm:p-10"
          >
            <p className="text-forest/55 text-xs font-semibold tracking-[0.18em] uppercase">
              Organizer path
            </p>
            <h2 className="font-display text-forest mt-7 text-4xl font-semibold tracking-[-0.05em]">
              Help shape the room.
            </h2>
            <ul className="text-forest/75 mt-7 space-y-4">
              {[
                "Apply to lead an existing community",
                "Propose a focused new community",
                "Submit an event for organizer approval",
                "Agree to moderation and reporting responsibilities",
              ].map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed">
                  <CheckIcon className="mt-1 h-5 w-5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-forest/60 mt-8 text-sm leading-relaxed">
              Organizer applications and paid professional tools are future
              workflows, not currently available services.
            </p>
          </article>
        </Container>
      </section>

      <section className="bg-background py-24 sm:py-32">
        <Container className="grid max-w-7xl gap-12 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="text-forest/55 text-xs font-semibold tracking-[0.2em] uppercase">
              Future distribution layer
            </p>
            <h2 className="font-display text-forest mt-7 text-5xl leading-[0.96] font-semibold tracking-[-0.055em] sm:text-7xl">
              Designed to connect with MyVerse and Sidequests later.
            </h2>
          </div>
          <p className="text-muted max-w-xl leading-relaxed">
            The intended relationship is future-facing: MyVerse can support
            distribution, while Sidequests can add richer ways to discover and
            act on plans. Neither integration is represented as live in this
            website release.
          </p>
        </Container>
      </section>
    </>
  );
}
