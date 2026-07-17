import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";
import { ArrowRightIcon, ArrowUpRightIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Partners and funders",
  description:
    "The Miami Roots model, community outcomes, potential funding opportunities, and ways local organizations can help strengthen connection in Miami.",
};

const pathways = [
  {
    title: "Program sponsor",
    community: "Makes a specific gathering or initiative more accessible.",
    partner:
      "A defined role, shared activation plan, and responsible visibility tied to useful participation.",
  },
  {
    title: "Venue partner",
    community: "Creates welcoming places for people to gather in real life.",
    partner:
      "Thoughtful foot traffic, relevant programming, and a relationship with trusted organizers.",
  },
  {
    title: "Grant funder",
    community:
      "Builds capacity for leadership, access, coordination, and measurement.",
    partner:
      "A clear program thesis, ethical outcome framework, and transparent learning—not vanity metrics.",
  },
  {
    title: "Volunteer activation partner",
    community:
      "Connects residents with useful, well-scoped ways to contribute.",
    partner:
      "A prepared participant pathway and stronger local awareness around the work.",
  },
  {
    title: "Neighborhood expansion partner",
    community:
      "Helps community pathways reach more parts of Miami and South Florida.",
    partner:
      "Locally informed programming shaped with residents, not dropped into a neighborhood from outside.",
  },
  {
    title: "Research and technology partner",
    community:
      "Improves access, coordination, safety, and evidence without increasing surveillance.",
    partner:
      "A real-world learning environment with explicit privacy and governance boundaries.",
  },
] as const;

const opportunities = [
  "New to Miami welcome programming",
  "Community leader training",
  "Neighborhood gatherings",
  "Sober social experiences",
  "Volunteer activation days",
  "Local business discovery",
  "Accessible community participation",
  "Community storytelling",
  "Impact measurement and research",
] as const;

export default function PartnersPage() {
  return (
    <>
      <section className="bg-sun py-20 sm:py-28 lg:py-36">
        <Container className="max-w-7xl">
          <p className="text-forest/55 text-xs font-semibold tracking-[0.2em] uppercase">
            Partners and funders
          </p>
          <h1 className="font-display text-forest mt-8 max-w-6xl text-6xl leading-[0.88] font-semibold tracking-[-0.065em] text-balance sm:text-8xl lg:text-9xl">
            Fund the conditions for people to show up.
          </h1>
          <p className="text-forest/70 mt-9 max-w-2xl text-lg leading-relaxed">
            Miami Roots is building the connective layer between residents,
            organizers, local businesses, venues, and civic life. Partnership
            should make participation easier and local relationships
            stronger—not simply place a logo on an event.
          </p>
        </Container>
      </section>

      <section className="bg-cream py-24 sm:py-32 lg:py-40">
        <Container className="grid max-w-7xl gap-14 lg:grid-cols-3 lg:gap-6">
          {[
            [
              "The need",
              "Miami offers enormous energy, but people, opportunities, and local efforts often remain divided across separate networks. New residents and longtime locals alike can struggle to find a trusted way into the parts of city life they care about.",
            ],
            [
              "The model",
              "Focused communities make discovery easier. Approved organizers create gatherings and useful pathways. Digital coordination moves people toward real-world participation, contribution, and relationships that can continue.",
            ],
            [
              "The outcomes",
              "The intended result is not more messages. It is stronger belonging, repeat participation, useful introductions, supported community leaders, volunteer action, and wider access to local opportunity.",
            ],
          ].map(([title, body]) => (
            <article
              key={title}
              className="border-forest/10 bg-background rounded-[2rem] border p-8 sm:p-10"
            >
              <h2 className="font-display text-forest text-4xl font-semibold tracking-[-0.05em]">
                {title}
              </h2>
              <p className="text-muted mt-7 leading-relaxed">{body}</p>
            </article>
          ))}
        </Container>
      </section>

      <section className="bg-forest py-24 sm:py-32 lg:py-40">
        <Container className="max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <div>
              <p className="text-mint text-xs font-semibold tracking-[0.2em] uppercase">
                Ways to partner
              </p>
              <h2 className="font-display text-cream mt-7 max-w-4xl text-5xl leading-[0.96] font-semibold tracking-[-0.055em] sm:text-7xl">
                Every partnership needs a job beyond visibility.
              </h2>
            </div>
            <p className="text-cream/60 max-w-xl leading-relaxed">
              These are partnership pathways Miami Roots is prepared to explore.
              They are not claims of current sponsors, contracts, or funded
              programs.
            </p>
          </div>

          <div className="mt-16 grid gap-px overflow-hidden rounded-[2rem] bg-white/15 md:grid-cols-2">
            {pathways.map((pathway) => (
              <article key={pathway.title} className="bg-forest p-8 sm:p-10">
                <h3 className="font-display text-cream text-3xl font-semibold tracking-[-0.04em]">
                  {pathway.title}
                </h3>
                <dl className="mt-8 space-y-6">
                  <div>
                    <dt className="text-mint text-xs font-semibold tracking-[0.16em] uppercase">
                      Community value
                    </dt>
                    <dd className="text-cream/65 mt-2 text-sm leading-relaxed">
                      {pathway.community}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-mint text-xs font-semibold tracking-[0.16em] uppercase">
                      Partner value
                    </dt>
                    <dd className="text-cream/65 mt-2 text-sm leading-relaxed">
                      {pathway.partner}
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-mint-100 py-24 sm:py-32">
        <Container className="grid max-w-7xl gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div>
            <p className="text-forest/55 text-xs font-semibold tracking-[0.2em] uppercase">
              Potential funding opportunities
            </p>
            <h2 className="font-display text-forest mt-7 text-5xl leading-none font-semibold tracking-[-0.055em] sm:text-6xl">
              Programs ready to be scoped—not presented as launched.
            </h2>
          </div>
          <ul className="border-forest/15 border-t">
            {opportunities.map((opportunity) => (
              <li
                key={opportunity}
                className="border-forest/15 text-forest flex items-center justify-between gap-6 border-b py-5 text-lg font-medium"
              >
                {opportunity}
                <ArrowUpRightIcon className="text-forest/45 h-5 w-5" />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section id="brief" className="bg-background py-24 sm:py-32">
        <Container className="grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="text-forest/55 text-xs font-semibold tracking-[0.2em] uppercase">
              Partnership brief
            </p>
            <h2 className="font-display text-forest mt-7 max-w-4xl text-5xl leading-[0.96] font-semibold tracking-[-0.055em] sm:text-7xl">
              Start with fit, then build the activation.
            </h2>
            <p className="text-muted mt-7 max-w-2xl leading-relaxed">
              A downloadable brief will be published after the operating entity,
              contact channel, program budgets, and current proof are confirmed.
              Until then, the site keeps prospective partnership language
              honest.
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 lg:items-end">
            <ButtonLink href="/contact">
              View inquiry options
              <ArrowRightIcon className="h-4 w-4" />
            </ButtonLink>
            <Link
              href="/impact"
              className="text-forest text-sm font-semibold underline decoration-1 underline-offset-4"
            >
              Review the measurement approach
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
