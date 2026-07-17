import Link from "next/link";

import { RootNetwork } from "@/components/brand/root-network";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  SparkIcon,
} from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { CommunityCard } from "@/features/groups/community-card";
import { communityGroups } from "@/features/groups/content";

const initiativeTypes = [
  {
    title: "Care for our coast",
    description: "Beach cleanups and neighborhood projects.",
    marker: "Coast",
  },
  {
    title: "Show up for animals",
    description: "Dog-adoption days and volunteer support.",
    marker: "Care",
  },
  {
    title: "Lift up local",
    description: "Small-business support and shared opportunity.",
    marker: "Local",
  },
  {
    title: "Gather with purpose",
    description: "Charity drives, group outings, and good ideas.",
    marker: "Action",
  },
] as const;

const involvementPaths = [
  {
    title: "Join Miami Roots",
    description:
      "Explore publicly, then enter through referral or organizer approval.",
    href: "/join",
    status: "Start here",
  },
  {
    title: "Volunteer",
    description: "Turn care for Miami into something useful and shared.",
    href: "/groups/community-organizing",
    status: "Find your place",
  },
  {
    title: "Attend an event",
    description: "Discover daytime, wellness, and social gatherings.",
    href: "/groups/daytime-events",
    status: "See the community",
  },
  {
    title: "Partner with us",
    description: "Help a growing local community create more good.",
    href: "/partners",
    status: "Build together",
  },
  {
    title: "Support local",
    description: "Share opportunity and help Miami ideas move forward.",
    href: "/groups/business-and-connections",
    status: "Keep it local",
  },
  {
    title: "Start something good",
    description: "Bring an idea, find your people, and make it real.",
    href: "/groups/community-organizing",
    status: "Make a first move",
  },
] as const;

const modelSteps = [
  {
    title: "Explore openly",
    description:
      "See what each community is for, what is happening, and how it feels before requesting access.",
  },
  {
    title: "Enter with trust",
    description:
      "Adults 18+ join private spaces through a member referral or organizer approval—not an exposed public invite link.",
  },
  {
    title: "Turn interest into plans",
    description:
      "Approved organizers and members create reasons to meet, contribute, collaborate, and keep showing up.",
  },
] as const;

export function HomePage() {
  return (
    <>
      <section className="hero-shell relative isolate min-h-[44rem] overflow-hidden sm:min-h-[48rem] lg:min-h-[calc(100svh-5rem)]">
        <Container className="relative z-10 grid min-h-[44rem] items-center gap-10 py-16 sm:min-h-[48rem] lg:min-h-[calc(100svh-5rem)] lg:grid-cols-[1.08fr_0.92fr] lg:py-20">
          <div className="max-w-3xl">
            <p className="hero-enter text-forest/65 mb-7 flex items-center gap-3 text-xs font-semibold tracking-[0.2em] uppercase">
              <SparkIcon className="h-4 w-4" /> Miami&apos;s community-powered
              city guide
            </p>
            <h1 className="font-display text-forest text-[clamp(4rem,10vw,8.5rem)] leading-[0.82] font-semibold tracking-[-0.07em] text-balance">
              Explore Miami.
              <br /> Find your people.
            </h1>
            <p className="hero-enter hero-enter--delay-2 text-forest/78 mt-8 max-w-xl text-lg leading-relaxed sm:text-xl">
              Find communities, plans, collaborators, and useful ways into local
              life—curated by people who want Miami to feel more connected.
            </p>
            <div className="hero-enter hero-enter--delay-3 mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/groups">
                Explore communities
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </ButtonLink>
              <ButtonLink href="/find-your-people" variant="outline">
                Find your people
              </ButtonLink>
            </div>
            <Link
              href="/join#organizers"
              className="hero-enter hero-enter--delay-3 text-forest/65 hover:text-forest mt-6 inline-flex items-center gap-2 text-sm font-semibold"
            >
              Organize something worth joining
              <ArrowUpRightIcon className="h-4 w-4" />
            </Link>
          </div>

          <div className="hero-enter hero-enter--delay-2 relative min-h-[25rem] lg:min-h-[42rem]">
            <RootNetwork />
            <div className="absolute right-0 bottom-3 max-w-[15rem] text-right sm:right-6 lg:bottom-8">
              <p className="text-forest font-display text-2xl leading-tight font-semibold tracking-[-0.03em]">
                Rooted here.
                <br />
                Connected everywhere.
              </p>
            </div>
          </div>
        </Container>
        <div className="hero-ticker" aria-hidden="true">
          <div>
            <span>Friendship</span>
            <span>Local action</span>
            <span>Wellness</span>
            <span>Collaboration</span>
            <span>Belonging</span>
            <span>Friendship</span>
            <span>Local action</span>
            <span>Wellness</span>
            <span>Collaboration</span>
            <span>Belonging</span>
          </div>
        </div>
      </section>

      <section id="why" className="bg-cream py-24 sm:py-32 lg:py-44">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24">
            <div className="scroll-reveal lg:sticky lg:top-32 lg:self-start">
              <p className="text-forest/55 text-xs font-semibold tracking-[0.2em] uppercase">
                Why Miami Roots exists
              </p>
            </div>
            <div className="space-y-24 sm:space-y-32">
              <div className="scroll-reveal">
                <p className="font-display text-forest text-5xl leading-[0.98] font-semibold tracking-[-0.05em] sm:text-7xl lg:text-8xl">
                  People move here every day.
                </p>
                <p className="text-muted mt-7 max-w-xl text-lg leading-relaxed">
                  It is exciting, ambitious, and full of possibility. It can
                  also be surprisingly lonely.
                </p>
              </div>
              <div className="scroll-reveal">
                <p className="font-display text-forest text-5xl leading-[0.98] font-semibold tracking-[-0.05em] sm:text-7xl lg:text-8xl">
                  Finding community should not be difficult.
                </p>
                <p className="text-muted mt-7 max-w-xl text-lg leading-relaxed">
                  Miami Roots makes the first hello easier—and gives people
                  places to keep showing up after that.
                </p>
              </div>
              <div className="scroll-reveal border-forest/15 border-t pt-10">
                <p className="font-display text-forest text-3xl leading-tight font-semibold tracking-[-0.04em] sm:text-5xl">
                  The mission is simple:
                  <br />
                  help people find their people.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section
        id="communities"
        className="bg-background py-24 sm:py-32 lg:py-40"
      >
        <Container className="max-w-7xl">
          <div className="scroll-reveal flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Explore communities"
              title={
                <>
                  Start with what
                  <br />
                  brings you alive.
                </>
              }
              description="Six communities, each with a clear purpose—and room for your next friendship, collaboration, or good idea."
            />
            <ButtonLink href="/groups" variant="outline">
              View all communities
              <ArrowUpRightIcon className="h-4 w-4" />
            </ButtonLink>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-2">
            {communityGroups.map((group, index) => (
              <div key={group.slug} className="scroll-reveal">
                <CommunityCard group={group} featured={index === 0} />
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-mint-100 py-24 sm:py-32">
        <Container className="max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
            <div>
              <p className="text-forest/55 text-xs font-semibold tracking-[0.2em] uppercase">
                How Miami Roots works
              </p>
              <h2 className="font-display text-forest mt-7 text-5xl leading-none font-semibold tracking-[-0.055em] sm:text-6xl">
                Digital discovery. Real-world participation.
              </h2>
            </div>
            <ol className="border-forest/15 border-t">
              {modelSteps.map((step, index) => (
                <li
                  key={step.title}
                  className="border-forest/15 grid gap-4 border-b py-7 sm:grid-cols-[3rem_1fr]"
                >
                  <span className="text-forest/40 font-mono text-xs">
                    0{index + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-forest text-2xl font-semibold tracking-[-0.04em]">
                      {step.title}
                    </h3>
                    <p className="text-muted mt-3 max-w-2xl leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <section
        id="initiatives"
        className="bg-forest overflow-hidden py-24 sm:py-32 lg:py-40"
      >
        <Container className="max-w-7xl">
          <div className="scroll-reveal grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <SectionHeading
              eyebrow="Community in action"
              title="Belonging grows when we do something together."
              description="Miami Roots is being shaped to support the local efforts that turn a group of people into a community."
              light
            />
            <p className="text-mint/75 max-w-md text-sm leading-relaxed lg:justify-self-end">
              These initiative areas are a direction for growth, not a claim of
              completed impact. Real projects and participation will take their
              place here as the community builds them.
            </p>
          </div>

          <div className="mt-16 grid border-t border-white/15 sm:grid-cols-2 lg:grid-cols-4">
            {initiativeTypes.map((initiative, index) => (
              <article
                key={initiative.title}
                className="initiative-card scroll-reveal border-b border-white/15 py-8 sm:px-6 sm:nth-[2n]:border-l lg:border-b-0 lg:border-l lg:first:border-l-0"
              >
                <div className="text-mint mb-20 flex items-center justify-between text-xs tracking-[0.18em] uppercase">
                  <span>{initiative.marker}</span>
                  <span aria-hidden="true">0{index + 1}</span>
                </div>
                <h3 className="font-display text-cream text-3xl leading-tight font-semibold tracking-[-0.04em]">
                  {initiative.title}
                </h3>
                <p className="text-cream/60 mt-4 text-sm leading-relaxed">
                  {initiative.description}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section id="stories" className="bg-mint-100 py-24 sm:py-32 lg:py-40">
        <Container className="max-w-7xl">
          <div className="scroll-reveal grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <SectionHeading
              eyebrow="Stories worth sharing"
              title="The people will tell the story."
              description="Community spotlights, volunteer stories, local businesses, and new Miami beginnings will live here as they happen."
            />

            <div className="story-placeholder relative min-h-[34rem] overflow-hidden rounded-[2rem] p-7 sm:p-10">
              <div className="relative z-10 flex h-full min-h-[28rem] flex-col justify-between">
                <p className="text-forest/60 text-xs font-semibold tracking-[0.18em] uppercase">
                  Humans of Miami Roots
                </p>
                <div>
                  <p className="font-display text-forest max-w-xl text-4xl leading-[1.02] font-semibold tracking-[-0.045em] sm:text-6xl">
                    No stock stories. No invented impact.
                  </p>
                  <p className="text-forest/70 mt-6 max-w-lg leading-relaxed">
                    This space is ready for real voices from the community when
                    they are available and approved to share.
                  </p>
                </div>
              </div>
              <div className="story-placeholder__rings" aria-hidden="true" />
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-cream py-24 sm:py-32 lg:py-44">
        <Container className="max-w-7xl">
          <div className="scroll-reveal mx-auto max-w-5xl text-center">
            <p className="text-forest/55 text-xs font-semibold tracking-[0.2em] uppercase">
              Our impact
            </p>
            <p className="font-display text-forest mt-8 text-5xl leading-[0.98] font-semibold tracking-[-0.055em] sm:text-7xl lg:text-8xl">
              Measure what helps a city feel more connected.
            </p>
          </div>
          <div className="bg-forest/10 mt-20 grid gap-px overflow-hidden rounded-[2rem] md:grid-cols-3">
            {[
              ["Communities", "Places with clear purpose and room to belong."],
              [
                "Participation",
                "People who show up, contribute, and keep showing up.",
              ],
              ["Civic energy", "Local care turned into useful, shared action."],
            ].map(([title, description]) => (
              <div
                key={title}
                className="scroll-reveal bg-background p-8 sm:p-10"
              >
                <p className="font-display text-forest text-3xl font-semibold tracking-[-0.04em]">
                  {title}
                </p>
                <p className="text-muted mt-4 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <ButtonLink href="/impact" variant="outline">
              See the impact framework
              <ArrowRightIcon className="h-4 w-4" />
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section className="bg-background py-24 sm:py-32 lg:py-40">
        <Container className="grid max-w-7xl gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="text-forest/55 text-xs font-semibold tracking-[0.2em] uppercase">
              Partners and funders
            </p>
            <h2 className="font-display text-forest mt-7 max-w-4xl text-5xl leading-[0.96] font-semibold tracking-[-0.055em] sm:text-7xl">
              Help build the connective layer Miami is missing.
            </h2>
            <p className="text-muted mt-7 max-w-2xl text-lg leading-relaxed">
              Venues, businesses, nonprofits, foundations, and civic partners
              can help turn trusted discovery into welcoming places, supported
              organizers, accessible programs, and useful local action.
            </p>
          </div>
          <div className="border-forest/15 border-t pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
            <p className="text-muted leading-relaxed">
              Miami Roots is an informal emerging project. No sponsors, funded
              programs, nonprofit status, or institutional partnerships are
              implied here.
            </p>
            <ButtonLink href="/partners" className="mt-8">
              Explore partnership paths
              <ArrowRightIcon className="h-4 w-4" />
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section id="get-involved" className="bg-sun py-24 sm:py-32 lg:py-40">
        <Container className="max-w-7xl">
          <div className="scroll-reveal flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Get involved"
              title="There is more than one way in."
              description="Come as you are. Start with the part that feels natural, and let the rest grow from there."
            />
            <p className="text-forest/60 max-w-sm text-sm leading-relaxed">
              The public site is open to explore. Private community entry will
              use member referral or organizer approval when applications open.
            </p>
          </div>

          <div className="border-forest/20 mt-16 grid border-t md:grid-cols-2 lg:grid-cols-3">
            {involvementPaths.map((path) => (
              <Link
                key={path.title}
                href={path.href}
                className="scroll-reveal group border-forest/20 hover:bg-cream/30 border-b p-7 transition-colors md:nth-[2n]:border-l lg:border-l lg:first:border-l-0 lg:nth-[4]:border-l-0"
              >
                <div className="flex items-start justify-between gap-5">
                  <p className="text-forest/55 text-xs font-semibold tracking-[0.16em] uppercase">
                    {path.status}
                  </p>
                  <ArrowUpRightIcon className="text-forest h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
                <h3 className="font-display text-forest mt-16 text-3xl font-semibold tracking-[-0.04em]">
                  {path.title}
                </h3>
                <p className="text-forest/65 mt-4 text-sm leading-relaxed">
                  {path.description}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
