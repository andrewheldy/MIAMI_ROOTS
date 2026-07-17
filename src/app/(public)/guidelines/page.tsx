import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { CheckIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Community guidelines",
  description:
    "The shared expectations that help Miami Roots stay welcoming, genuine, and useful.",
};

const guidelineVersion = "2026-07-16-draft.1";

const guidelines = [
  {
    title: "Be a real participant",
    body: "Share opportunities and contribute to the room. Miami Roots works when people give as well as receive.",
  },
  {
    title: "Help people grow",
    body: "Choose collaboration over isolation. Treat other members as people to support, not competition to work around.",
  },
  {
    title: "Keep it human",
    body: "No cold pitching, spam, mass direct messages, or transactional networking behavior. Build a relationship before making an ask.",
  },
  {
    title: "Welcome people in",
    body: "Exclusionary language and gatekeeping do not belong here. Make room for people who are finding their footing.",
  },
  {
    title: "Be genuine",
    body: "Real relationships matter more than appearances. Forced positivity and performative engagement do not build trust.",
  },
  {
    title: "Protect the room",
    body: "Scams, harassment, threats, impersonation, hate, and unsafe behavior can lead to removal. Members should report concerns to a moderator rather than escalating publicly.",
  },
  {
    title: "Respect privacy",
    body: "Do not repost private conversations, contact members without context, or use community access to build marketing lists. Miami Roots will not sell member data.",
  },
] as const;

export default function GuidelinesPage() {
  return (
    <>
      <section className="bg-mint-100 py-20 sm:py-28 lg:py-36">
        <Container className="max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="text-forest/55 text-xs font-semibold tracking-[0.2em] uppercase">
                Community guidelines
              </p>
              <h1 className="font-display text-forest mt-7 text-6xl leading-[0.9] font-semibold tracking-[-0.065em] text-balance sm:text-8xl lg:text-9xl">
                Make the room better.
              </h1>
            </div>
            <div>
              <p className="text-forest/70 text-lg leading-relaxed">
                A strong community is something members create together. These
                shared expectations protect the warmth, trust, and usefulness of
                Miami Roots.
              </p>
              <p className="text-forest/45 mt-6 font-mono text-xs tracking-wide">
                Version {guidelineVersion}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-cream py-24 sm:py-32">
        <Container className="max-w-5xl">
          <div className="space-y-4">
            {guidelines.map((guideline) => (
              <article
                key={guideline.title}
                className="border-forest/10 bg-background grid gap-6 rounded-3xl border p-7 sm:grid-cols-[auto_1fr] sm:p-10"
              >
                <span className="bg-mint-100 text-forest grid h-10 w-10 place-items-center rounded-full">
                  <CheckIcon className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-display text-forest text-3xl font-semibold tracking-[-0.04em]">
                    {guideline.title}
                  </h2>
                  <p className="text-muted mt-4 max-w-2xl leading-relaxed">
                    {guideline.body}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="bg-sun mt-16 rounded-[2rem] p-8 sm:p-12">
            <p className="text-forest/55 text-xs font-semibold tracking-[0.18em] uppercase">
              Trust and moderation baseline
            </p>
            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              <div>
                <h2 className="font-display text-forest text-3xl font-semibold tracking-[-0.04em]">
                  Adults 18+ only
                </h2>
                <p className="text-forest/70 mt-4 leading-relaxed">
                  Miami Roots community access and events are intended for
                  adults. Organizer approval and member referrals help reduce
                  scams and unsolicited access.
                </p>
              </div>
              <div>
                <h2 className="font-display text-forest text-3xl font-semibold tracking-[-0.04em]">
                  Report, review, decide
                </h2>
                <p className="text-forest/70 mt-4 leading-relaxed">
                  Named moderators will review reports and decide whether a
                  warning, restriction, or removal is appropriate. The final
                  reporting channel is not live yet.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-forest mt-6 rounded-[2rem] p-8 sm:p-12">
            <p className="text-mint text-xs font-semibold tracking-[0.18em] uppercase">
              Group-specific expectations
            </p>
            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              <div>
                <h2 className="font-display text-cream text-3xl font-semibold tracking-[-0.04em]">
                  Nightlife & Event Marketing
                </h2>
                <p className="text-cream/65 mt-4 leading-relaxed">
                  No ticket reselling. Ticket resale is not part of this group.
                </p>
              </div>
              <div>
                <h2 className="font-display text-cream text-3xl font-semibold tracking-[-0.04em]">
                  Sober Social
                </h2>
                <p className="text-cream/65 mt-4 leading-relaxed">
                  This is a peer social space, not a treatment or clinical
                  recovery service.
                </p>
              </div>
              <div>
                <h2 className="font-display text-cream text-3xl font-semibold tracking-[-0.04em]">
                  Event clarity and access
                </h2>
                <p className="text-cream/65 mt-4 leading-relaxed">
                  Hosts should identify alcohol-centered settings, known costs,
                  physical accessibility information, and participation
                  expectations whenever those details are available.
                </p>
              </div>
            </div>
          </div>

          <p className="text-muted mt-10 text-sm leading-relaxed">
            This is a draft member-facing version derived from the
            project&apos;s current community principles. It is not a legal
            terms-of-service document and will receive an owner review before
            consent is collected against it.
          </p>
        </Container>
      </section>
    </>
  );
}
