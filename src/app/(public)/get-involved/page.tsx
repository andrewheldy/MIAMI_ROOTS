import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";
import { ArrowRightIcon, ArrowUpRightIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Get involved",
  description:
    "Explore Miami Roots as a member, community leader, volunteer, host, business, or civic partner.",
};

const paths = [
  {
    title: "Explore as a member",
    description:
      "Browse every community publicly, find the one that fits, and prepare to request approved access.",
    href: "/groups",
    cta: "Explore communities",
    tone: "mint",
  },
  {
    title: "Lead a community",
    description:
      "Apply to help guide an existing space or propose a focused new community with a clear purpose.",
    href: "/join#organizers",
    cta: "See the organizer path",
    tone: "sun",
  },
  {
    title: "Submit an event",
    description:
      "Approved members and organizers will be able to propose plans for review before they appear publicly.",
    href: "/join#organizers",
    cta: "Understand approval",
    tone: "coral",
  },
  {
    title: "Volunteer",
    description:
      "Find community-led ways to contribute through organizing, cleanups, service, and shared local projects.",
    href: "/groups/community-organizing",
    cta: "Explore organizing",
    tone: "lime",
  },
  {
    title: "Host or collaborate",
    description:
      "Help create a welcoming place, useful activity, or responsible community experience.",
    href: "/partners",
    cta: "Explore partnerships",
    tone: "sky",
  },
  {
    title: "Fund local connection",
    description:
      "Support leadership, accessibility, programming, coordination, or ethical impact measurement.",
    href: "/partners#brief",
    cta: "View funding pathways",
    tone: "lavender",
  },
] as const;

export default function GetInvolvedPage() {
  return (
    <>
      <section className="bg-mint-100 py-20 sm:py-28 lg:py-36">
        <Container className="max-w-7xl">
          <p className="text-forest/55 text-xs font-semibold tracking-[0.2em] uppercase">
            Get involved
          </p>
          <h1 className="font-display text-forest mt-8 max-w-6xl text-6xl leading-[0.88] font-semibold tracking-[-0.065em] text-balance sm:text-8xl lg:text-9xl">
            Come for what interests you. Stay for who you meet.
          </h1>
          <p className="text-forest/70 mt-9 max-w-2xl text-lg leading-relaxed">
            There is no single kind of Miami Roots member. Explore, organize,
            volunteer, host, fund, or simply make the first plan.
          </p>
        </Container>
      </section>

      <section className="bg-background py-24 sm:py-32">
        <Container className="grid max-w-7xl gap-5 md:grid-cols-2">
          {paths.map((path) => (
            <Link
              key={path.title}
              href={path.href}
              className={`community-card--${path.tone} group flex min-h-[25rem] flex-col rounded-[2rem] p-7 transition-transform duration-300 hover:-translate-y-1 sm:p-9`}
            >
              <ArrowUpRightIcon className="text-forest ml-auto h-6 w-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              <div className="mt-auto">
                <h2 className="font-display text-forest text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
                  {path.title}
                </h2>
                <p className="text-forest/70 mt-5 max-w-xl leading-relaxed">
                  {path.description}
                </p>
                <p className="text-forest mt-7 text-sm font-semibold">
                  {path.cta}
                </p>
              </div>
            </Link>
          ))}
        </Container>
      </section>

      <section className="bg-forest py-20 sm:py-24">
        <Container className="flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-mint text-xs font-semibold tracking-[0.18em] uppercase">
              Not sure where to begin?
            </p>
            <p className="font-display text-cream mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Let three questions point you toward a starting place.
            </p>
          </div>
          <ButtonLink href="/find-your-people" variant="light">
            Find your people
            <ArrowRightIcon className="h-4 w-4" />
          </ButtonLink>
        </Container>
      </section>
    </>
  );
}
