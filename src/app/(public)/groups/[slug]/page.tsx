import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/icons";
import { CommunityCard } from "@/features/groups/community-card";
import { CommunityIcon } from "@/features/groups/community-icon";
import { communityGroups, getCommunityGroup } from "@/features/groups/content";

interface GroupPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return communityGroups.map((group) => ({ slug: group.slug }));
}

export async function generateMetadata({
  params,
}: GroupPageProps): Promise<Metadata> {
  const { slug } = await params;
  const group = getCommunityGroup(slug);

  if (!group) return {};

  return {
    title: group.name,
    description: group.shortDescription,
  };
}

export default async function GroupPage({ params }: GroupPageProps) {
  const { slug } = await params;
  const group = getCommunityGroup(slug);

  if (!group) notFound();

  const currentIndex = communityGroups.findIndex(
    (community) => community.slug === group.slug,
  );
  const relatedGroups = [1, 2]
    .map(
      (offset) =>
        communityGroups[(currentIndex + offset) % communityGroups.length],
    )
    .filter((community) => community !== undefined);

  return (
    <>
      <section
        className={`community-hero community-hero--${group.tone} overflow-hidden`}
      >
        <Container className="grid min-h-[42rem] max-w-7xl gap-12 py-16 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-24">
          <div>
            <Link
              href="/groups"
              className="text-forest/60 hover:text-forest inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] uppercase transition-colors"
            >
              <span aria-hidden="true">←</span> All communities
            </Link>
            <p className="text-forest/60 mt-16 text-xs font-semibold tracking-[0.18em] uppercase">
              {group.eyebrow}
            </p>
            <h1 className="font-display text-forest mt-6 text-6xl leading-[0.88] font-semibold tracking-[-0.065em] text-balance sm:text-8xl lg:text-[7.5rem]">
              {group.name}
            </h1>
            <p className="text-forest/75 mt-8 max-w-2xl text-lg leading-relaxed sm:text-xl">
              {group.shortDescription}
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="#join">
                Join this community
                <ArrowRightIcon className="h-4 w-4" />
              </ButtonLink>
              <Link
                href="/guidelines"
                className="text-forest hover:text-forest-600 px-5 py-3 text-sm font-semibold transition-colors"
              >
                Read community guidelines
              </Link>
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-lg">
            <div className="border-forest/15 bg-cream/35 absolute inset-0 rotate-3 rounded-[3rem] border" />
            <div className="border-forest/15 bg-cream/65 relative grid h-full place-items-center overflow-hidden rounded-[3rem] border shadow-[0_35px_80px_rgba(0,63,44,0.12)] backdrop-blur-sm">
              {group.logo ? (
                <Image
                  src={group.logo}
                  alt={`${group.name} community mark`}
                  width={1024}
                  height={1024}
                  priority
                  sizes="(max-width: 768px) 90vw, 512px"
                  className="h-full w-full object-cover"
                />
              ) : (
                <CommunityIcon
                  name={group.icon}
                  className="text-forest h-1/2 w-1/2"
                />
              )}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-cream py-24 sm:py-32 lg:py-40">
        <Container className="grid max-w-7xl gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div>
            <p className="text-forest/55 text-xs font-semibold tracking-[0.2em] uppercase">
              Why it exists
            </p>
            <p className="font-display text-forest mt-6 text-3xl leading-tight font-semibold tracking-[-0.04em] sm:text-5xl">
              {group.purpose}
            </p>
          </div>
          <div>
            <p className="text-muted text-xl leading-relaxed sm:text-2xl">
              {group.fullDescription}
            </p>
            <div className="border-forest/15 mt-14 border-t pt-8">
              <p className="text-forest text-sm font-semibold">Who it is for</p>
              <ul className="mt-6 grid gap-4 sm:grid-cols-3">
                {group.whoItsFor.map((person) => (
                  <li
                    key={person}
                    className="border-forest/10 bg-background text-forest rounded-2xl border p-5 text-sm leading-relaxed"
                  >
                    {person}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-forest py-20 sm:py-24">
        <Container className="grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-mint text-xs font-semibold tracking-[0.18em] uppercase">
              What&apos;s happening
            </p>
            <h2 className="font-display text-cream mt-5 text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
              {group.eventPreview?.title ?? "No public event confirmed yet."}
            </h2>
          </div>
          <div className="lg:justify-self-end">
            <p className="text-cream/65 max-w-xl leading-relaxed">
              {group.eventPreview?.location ??
                "Approved community plans will appear here with the host, location, cost, accessibility details, and what participants should expect."}
            </p>
            <Link
              href="/join#organizers"
              className="text-mint mt-6 inline-flex items-center gap-2 text-sm font-semibold"
            >
              Learn about proposing an event
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>

      <section className="bg-background py-24 sm:py-32">
        <Container className="grid max-w-7xl gap-14 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="text-forest/55 text-xs font-semibold tracking-[0.2em] uppercase">
              Community guidelines
            </p>
            <h2 className="font-display text-forest mt-6 text-5xl leading-none font-semibold tracking-[-0.05em] sm:text-6xl">
              A good room is made by everyone in it.
            </h2>
          </div>
          <div>
            <ul className="space-y-5">
              {group.rules.map((rule) => (
                <li
                  key={rule}
                  className="border-forest/15 flex gap-4 border-b pb-5"
                >
                  <span className="bg-mint-100 text-forest mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full">
                    <CheckIcon className="h-4 w-4" />
                  </span>
                  <span className="text-muted leading-relaxed">{rule}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/guidelines"
              className="text-forest mt-8 inline-flex items-center gap-2 text-sm font-semibold"
            >
              Read the full guidelines
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>

      <section className="bg-mint-100 py-24 sm:py-32">
        <Container className="max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-forest/55 text-xs font-semibold tracking-[0.2em] uppercase">
                Community moments
              </p>
              <h2 className="font-display text-forest mt-6 text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
                Made to hold real stories.
              </h2>
              <p className="text-muted mt-6 max-w-md leading-relaxed">
                Gallery support is ready for approved community images as they
                become available. No stock photography stands in for the people
                who make this space real.
              </p>
            </div>
            <div className="grid min-h-[28rem] grid-cols-2 gap-4">
              <div className="border-forest/10 bg-cream/65 row-span-2 grid place-items-center rounded-[2rem] border">
                <CommunityIcon
                  name={group.icon}
                  className="text-forest/15 h-24 w-24"
                />
              </div>
              <div className="border-forest/10 bg-sun/35 rounded-[2rem] border" />
              <div className="border-forest/10 bg-background rounded-[2rem] border" />
            </div>
          </div>
        </Container>
      </section>

      <section id="join" className="bg-forest py-24 sm:py-32">
        <Container className="max-w-5xl text-center">
          <p className="text-mint text-xs font-semibold tracking-[0.2em] uppercase">
            Ready when you are
          </p>
          <h2 className="font-display text-cream mt-7 text-5xl leading-[0.95] font-semibold tracking-[-0.055em] sm:text-7xl">
            Make your first connection.
          </h2>
          <p className="text-cream/65 mx-auto mt-7 max-w-2xl text-lg leading-relaxed">
            Community applications are opening soon. Miami Roots currently
            gathers on WhatsApp, but every community keeps a stable home here as
            the platform grows.
          </p>
          <ButtonLink href="/join" variant="light" className="mt-10">
            See how joining will work
            <ArrowRightIcon className="h-4 w-4" />
          </ButtonLink>
        </Container>
      </section>

      <section className="bg-background py-24 sm:py-32">
        <Container className="max-w-7xl">
          <div className="mb-12 flex items-end justify-between gap-8">
            <div>
              <p className="text-forest/55 text-xs font-semibold tracking-[0.2em] uppercase">
                Keep exploring
              </p>
              <h2 className="font-display text-forest mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                Related communities
              </h2>
            </div>
            <Link
              href="/groups"
              className="text-forest hidden items-center gap-2 text-sm font-semibold sm:flex"
            >
              View all <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {relatedGroups.map((related) => (
              <CommunityCard key={related.slug} group={related} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
