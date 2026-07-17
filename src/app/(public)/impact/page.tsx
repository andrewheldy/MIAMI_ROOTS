import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Our impact",
  description:
    "How Miami Roots intends to measure belonging, participation, opportunity, and local action without turning people into engagement metrics.",
};

const outcomeAreas = [
  [
    "Belonging",
    "Whether people form relationships they want to maintain—not simply whether they entered a chat.",
  ],
  [
    "Participation",
    "Whether members return, attend, contribute, and find more than one way into local life.",
  ],
  [
    "Opportunity access",
    "Whether useful introductions, collaborations, resources, and local discoveries reach people across disconnected circles.",
  ],
  [
    "Community leadership",
    "Whether trusted members gain the support and confidence to organize responsibly.",
  ],
  [
    "Local action",
    "Whether volunteer projects and civic participation move from intention to completed work.",
  ],
  [
    "Wellness and sober connection",
    "Whether people can build vibrant social routines through daytime and alcohol-free experiences.",
  ],
] as const;

const measures = [
  {
    label: "Leading indicators",
    items: [
      "Approved members entering a relevant community",
      "First-event participation and repeat attendance",
      "Organizer applications and approved community ideas",
      "Volunteer sign-ups and completed activations",
    ],
  },
  {
    label: "Lagging indicators",
    items: [
      "Sustained sense of belonging reported over time",
      "Relationships and collaborations maintained beyond one event",
      "Community leaders retained and supported",
      "Completed projects with documented local outcomes",
    ],
  },
] as const;

export default function ImpactPage() {
  return (
    <>
      <section className="bg-forest overflow-hidden py-20 sm:py-28 lg:py-36">
        <Container className="max-w-7xl">
          <p className="text-mint text-xs font-semibold tracking-[0.2em] uppercase">
            Our impact
          </p>
          <h1 className="font-display text-cream mt-8 max-w-6xl text-6xl leading-[0.88] font-semibold tracking-[-0.065em] text-balance sm:text-8xl lg:text-9xl">
            Measure the strength of the roots—not the noise above them.
          </h1>
          <p className="text-cream/65 mt-9 max-w-2xl text-lg leading-relaxed">
            Miami Roots is early. We will not fill that gap with inflated
            counters. The first job is to define what meaningful connection
            looks like, collect only what helps, and publish proof as it becomes
            real.
          </p>
        </Container>
      </section>

      <section className="bg-mint-100 py-20 sm:py-28 lg:py-32">
        <Container className="grid max-w-7xl gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24">
          <div>
            <p className="text-forest/55 text-xs font-semibold tracking-[0.2em] uppercase">
              What is true today
            </p>
          </div>
          <div>
            <p className="font-display text-forest text-4xl leading-[1.02] font-semibold tracking-[-0.05em] sm:text-6xl">
              Six community pathways. One emerging model. No published impact
              claims yet.
            </p>
            <p className="text-muted mt-8 max-w-2xl text-lg leading-relaxed">
              The current proof is structural: focused communities exist across
              conversation, business, nightlife, daytime wellness, organizing,
              and sober social life. Member counts, event totals, volunteer
              hours, testimonials, and partner results have not been verified
              for publication.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-background py-24 sm:py-32 lg:py-40">
        <Container className="max-w-7xl">
          <div className="max-w-4xl">
            <p className="text-forest/55 text-xs font-semibold tracking-[0.2em] uppercase">
              Outcome framework
            </p>
            <h2 className="font-display text-forest mt-7 text-5xl leading-[0.96] font-semibold tracking-[-0.055em] sm:text-7xl">
              What stronger local relationships can unlock.
            </h2>
          </div>
          <div className="border-forest/15 mt-16 grid border-t md:grid-cols-2 lg:grid-cols-3">
            {outcomeAreas.map(([title, description]) => (
              <article
                key={title}
                className="border-forest/15 border-b py-9 md:px-8 md:nth-[2n]:border-l lg:border-l lg:first:border-l-0 lg:nth-[4]:border-l-0"
              >
                <h3 className="font-display text-forest text-3xl font-semibold tracking-[-0.04em]">
                  {title}
                </h3>
                <p className="text-muted mt-4 text-sm leading-relaxed">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-cream py-24 sm:py-32">
        <Container className="grid max-w-7xl gap-10 lg:grid-cols-2">
          {measures.map((measure) => (
            <article
              key={measure.label}
              className="border-forest/10 bg-background rounded-[2rem] border p-8 sm:p-10"
            >
              <p className="text-forest/55 text-xs font-semibold tracking-[0.18em] uppercase">
                {measure.label}
              </p>
              <ul className="mt-8 space-y-5">
                {measure.items.map((item) => (
                  <li
                    key={item}
                    className="text-muted flex gap-4 leading-relaxed"
                  >
                    <CheckIcon className="text-forest mt-1 h-5 w-5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </Container>
      </section>

      <section className="bg-sun py-24 sm:py-32">
        <Container className="grid max-w-7xl gap-14 lg:grid-cols-[1fr_1fr] lg:gap-24">
          <div>
            <p className="text-forest/55 text-xs font-semibold tracking-[0.2em] uppercase">
              Ethical measurement
            </p>
            <h2 className="font-display text-forest mt-7 text-5xl leading-none font-semibold tracking-[-0.055em] sm:text-7xl">
              Learn without surveilling.
            </h2>
          </div>
          <div className="text-forest/75 space-y-7 leading-relaxed">
            <p>
              Collect the minimum information required to understand whether the
              model works. Favor voluntary pulse surveys, aggregate event
              participation, completed-project records, and consented stories.
            </p>
            <p>
              Do not score friendships, read private conversations, sell member
              data, rank people by popularity, or treat message volume as proof
              of belonging. Report small samples and uncertainty honestly.
            </p>
            <p className="border-forest/20 border-t pt-7 text-sm">
              A public dashboard can be added only after definitions, collection
              methods, privacy rules, and review ownership are in place.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-forest py-20 sm:py-24">
        <Container className="flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-mint text-xs font-semibold tracking-[0.18em] uppercase">
              Research and measurement partners
            </p>
            <p className="font-display text-cream mt-4 max-w-3xl text-4xl leading-tight font-semibold tracking-[-0.045em] sm:text-5xl">
              Help build evidence the community can trust.
            </p>
          </div>
          <ButtonLink href="/partners" variant="light">
            Explore partnerships
            <ArrowRightIcon className="h-4 w-4" />
          </ButtonLink>
        </Container>
      </section>
    </>
  );
}
