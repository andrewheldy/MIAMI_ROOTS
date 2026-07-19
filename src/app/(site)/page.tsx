import Image from "next/image";

import { Container } from "@/components/layout/container";
import { ActionLink } from "@/components/ui/action-link";
import { CommunityCard } from "@/components/ui/community-card";
import { GroupLogo } from "@/components/ui/group-logo";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { getGroupBySlug, getPublishedGroups } from "@/content/groups";

const howItWorks = [
  {
    title: "Explore the communities",
    body: "Browse the WhatsApp groups that make up Miami Roots — from business and wellness to nightlife, volunteering, and everyday conversation.",
  },
  {
    title: "Find your people",
    body: "Pick the groups that fit your life. Each one has a clear purpose, so you land somewhere the conversation is already relevant to you.",
  },
  {
    title: "Show up and contribute",
    body: "Give before you take. The community gets better for everyone when members share opportunities and help each other grow.",
  },
];

export default function HomePage() {
  const groups = getPublishedGroups();
  const featured = getGroupBySlug("general-chat");

  return (
    <>
      {/* Hero — brand-colored band with the approved parent mark. The unratified
          banner concept is deliberately not used as production art here. */}
      <section className="bg-surface border-border border-b">
        <Container className="py-16 sm:py-24">
          <div className="flex max-w-3xl flex-col items-start gap-6">
            <Image
              src="/brand/logos/miami-roots-logo.png"
              alt="Miami Roots logo: a palm tree growing from a WhatsApp speech bubble, rooted into the ground"
              width={112}
              height={112}
              priority
              className="h-20 w-20 rounded-2xl sm:h-24 sm:w-24"
            />
            <h1 className="text-forest text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              A community rooted in Miami
            </h1>
            <p className="text-muted text-lg leading-relaxed text-pretty">
              Miami Roots connects neighbors across business, wellness,
              nightlife, volunteering, and everyday life — helping people build
              real relationships and share real opportunities. We rise together.
            </p>
            <p className="text-muted text-base leading-relaxed">
              The community comes together through a set of WhatsApp groups.
              This is its home on the web — start by exploring what&apos;s here.
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <ActionLink href="/join">Join the chats</ActionLink>
              <ActionLink href="/groups" variant="secondary">
                Explore the community
              </ActionLink>
            </div>
          </div>
        </Container>
      </section>

      {/* What the network is */}
      <Section aria-labelledby="how-heading">
        <SectionHeading
          id="how-heading"
          eyebrow="How it works"
          title="One community, many rooms"
          description="Miami Roots is a network of focused WhatsApp groups under one roof. Each group is a room for a different part of life in the city — together they make a community that's greater than the sum of its parts."
        />
        <ol className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {howItWorks.map((step, index) => (
            <li
              key={step.title}
              className="border-border bg-background rounded-xl border p-6"
            >
              <span
                aria-hidden="true"
                className="bg-mint-100 text-forest flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
              >
                {index + 1}
              </span>
              <h3 className="text-forest mt-4 text-lg font-semibold">
                {step.title}
              </h3>
              <p className="text-muted mt-2 text-sm leading-relaxed">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Featured community */}
      {featured ? (
        <Section tone="surface" aria-labelledby="featured-heading">
          <SectionHeading
            id="featured-heading"
            eyebrow="New here?"
            title="Start in General Chat"
          />
          <div className="border-border bg-background mt-8 flex flex-col gap-5 rounded-xl border p-6 sm:flex-row sm:items-center">
            <GroupLogo group={featured} size="lg" />
            <div className="flex-1">
              <p className="text-muted leading-relaxed">
                {featured.fullDescription}
              </p>
              <div className="mt-4">
                <ActionLink
                  href={`/groups/${featured.slug}`}
                  variant="secondary"
                >
                  About General Chat
                </ActionLink>
              </div>
            </div>
          </div>
        </Section>
      ) : null}

      {/* Full directory preview */}
      <Section aria-labelledby="directory-heading">
        <SectionHeading
          id="directory-heading"
          eyebrow="The groups"
          title="Explore the communities"
          description="Every group has a clear purpose and its own norms. Browse them all, then find the ones that fit your life in Miami."
        />
        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <li key={group.slug} className="h-full">
              <CommunityCard group={group} />
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <ActionLink href="/groups">See the full directory</ActionLink>
        </div>
      </Section>

      {/* Trust & guidelines */}
      <Section tone="surface" aria-labelledby="trust-heading">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-start">
          <div>
            <SectionHeading
              id="trust-heading"
              eyebrow="Trust"
              title="A community that stays worth being part of"
              description="Miami Roots grows by welcoming people in — not by gatekeeping, and not by turning members into leads. A few plain expectations keep it that way."
            />
            <div className="mt-6">
              <ActionLink href="/guidelines" variant="secondary">
                Read the community guidelines
              </ActionLink>
            </div>
          </div>
          <ul className="text-muted space-y-3 text-sm leading-relaxed">
            <li className="border-border bg-background rounded-lg border px-4 py-3">
              Be a real participant — share and contribute, don&apos;t just
              extract.
            </li>
            <li className="border-border bg-background rounded-lg border px-4 py-3">
              Collaboration over isolation — help members grow, don&apos;t
              compete with them.
            </li>
            <li className="border-border bg-background rounded-lg border px-4 py-3">
              No spam, cold pitching, or mass-messaging. Real relationships
              first.
            </li>
            <li className="border-border bg-background rounded-lg border px-4 py-3">
              Your data serves the community&apos;s operations — it is never
              sold or shared with partners.
            </li>
          </ul>
        </div>
      </Section>

      {/* Closing CTA — the shareable hub is the way in */}
      <Section aria-labelledby="cta-heading">
        <div className="border-border bg-surface rounded-2xl border px-6 py-10 text-center sm:px-12">
          <SectionHeading
            id="cta-heading"
            title="Ready to find your people?"
            className="mx-auto text-center"
          />
          <p className="text-muted mx-auto mt-4 max-w-xl text-base leading-relaxed">
            The community lives in a set of WhatsApp chats. Pick the ones that
            fit your life and say hello.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <ActionLink href="/join">Join the chats</ActionLink>
            <ActionLink href="/groups" variant="secondary">
              Explore the community
            </ActionLink>
          </div>
        </div>
      </Section>
    </>
  );
}
