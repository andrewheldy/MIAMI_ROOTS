import Image from "next/image";

import { Container } from "@/components/layout/container";
import { MotionReveal } from "@/components/motion/motion-reveal";
import { StaggerReveal } from "@/components/motion/stagger-reveal";
import { ActionLink } from "@/components/ui/action-link";
import { CommunityCard } from "@/components/ui/community-card";
import { GroupLogo } from "@/components/ui/group-logo";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { getGroupBySlug, getPublishedGroups } from "@/content/groups";
import { getGoPath } from "@/content/join/chat-links";
import { ShareLauncher, ShareSection } from "@/features/share";

const howItWorks = [
  {
    title: "Explore the communities",
    body: "Browse the WhatsApp groups that make up Miami Roots — business and wellness, nightlife, volunteering, and everyday conversation.",
  },
  {
    title: "Find your people",
    body: "Pick the groups that fit your life. Each has a clear purpose, so you land where the conversation is already relevant to you.",
  },
  {
    title: "Show up and contribute",
    body: "Give before you take. The community gets better for everyone when members share opportunities and help each other grow.",
  },
];

export default function HomePage() {
  const groups = getPublishedGroups();
  const featured = getGroupBySlug("general-chat");
  const featuredGoPath = featured ? getGoPath(featured.slug) : undefined;

  return (
    <>
      {/* Hero — brand-colored band with the approved parent mark and a
          coordinated entrance. Tightened for mobile so the primary action sits
          near the top of the first viewport. */}
      <section className="bg-surface border-border border-b">
        <Container className="py-12 sm:py-20">
          <StaggerReveal
            trigger="mount"
            className="flex max-w-3xl flex-col items-start gap-5"
            stagger={0.09}
          >
            <Image
              src="/brand/logos/miami-roots-logo.png"
              alt="Miami Roots logo: a palm tree growing from a WhatsApp speech bubble, rooted into the ground"
              width={112}
              height={112}
              priority
              className="h-16 w-16 rounded-2xl sm:h-20 sm:w-20"
            />
            <h1 className="text-forest text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              A community rooted in Miami
            </h1>
            <p className="text-muted max-w-2xl text-lg leading-relaxed text-pretty">
              Miami Roots connects neighbors across business, wellness,
              nightlife, volunteering, and everyday life — real relationships
              and shared opportunities, built in a set of WhatsApp groups. We
              rise together.
            </p>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
              <ActionLink href="/join" className="w-full sm:w-auto">
                Join the community chats
              </ActionLink>
              <ActionLink
                href="/groups"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Explore the groups
              </ActionLink>
            </div>
          </StaggerReveal>
        </Container>
      </section>

      {/* What the network is */}
      <Section aria-labelledby="how-heading">
        <MotionReveal>
          <SectionHeading
            id="how-heading"
            eyebrow="How it works"
            title="One community, many rooms"
            description="Miami Roots is a network of focused WhatsApp groups under one roof. Each group is a room for a different part of life in the city — together they make a community greater than the sum of its parts."
          />
        </MotionReveal>
        <StaggerReveal
          as="ol"
          itemAs="li"
          className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3"
          itemClassName="h-full"
          stagger={0.1}
        >
          {howItWorks.map((step, index) => (
            <div key={step.title} className="flex h-full flex-col">
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
            </div>
          ))}
        </StaggerReveal>
      </Section>

      {/* Featured community — General Chat is the recommended first stop */}
      {featured ? (
        <Section tone="surface" aria-labelledby="featured-heading">
          <MotionReveal>
            <SectionHeading
              id="featured-heading"
              eyebrow="New here?"
              title="Start in General Chat"
            />
            <div className="border-border bg-background mt-8 flex flex-col gap-5 rounded-2xl border p-6 sm:flex-row sm:items-center">
              <GroupLogo group={featured} size="lg" />
              <div className="flex-1">
                <p className="text-muted leading-relaxed">
                  {featured.fullDescription}
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  {featuredGoPath ? (
                    <ActionLink href={featuredGoPath}>
                      Join General Chat
                    </ActionLink>
                  ) : null}
                  <ActionLink
                    href={`/groups/${featured.slug}`}
                    variant="secondary"
                  >
                    About General Chat
                  </ActionLink>
                </div>
              </div>
            </div>
          </MotionReveal>
        </Section>
      ) : null}

      {/* Full directory preview — every community, each with its own chat */}
      <Section aria-labelledby="directory-heading">
        <MotionReveal>
          <SectionHeading
            id="directory-heading"
            eyebrow="The groups"
            title="Explore the communities"
            description="Every group has a clear purpose and a WhatsApp chat behind it. Open a group to learn more, or jump straight into its chat."
          />
        </MotionReveal>
        <StaggerReveal
          as="ul"
          itemAs="li"
          className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          itemClassName="h-full"
          stagger={0.06}
        >
          {groups.map((group) => (
            <CommunityCard key={group.slug} group={group} />
          ))}
        </StaggerReveal>
        <div className="mt-8">
          <ActionLink href="/groups" variant="secondary">
            See the full directory
          </ActionLink>
        </div>
      </Section>

      {/* Trust & guidelines */}
      <Section tone="surface" aria-labelledby="trust-heading">
        <MotionReveal className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-start">
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
        </MotionReveal>
      </Section>

      {/* Grow the roots — the community-share prompt */}
      <ShareSection />

      {/* Closing CTA — the shareable hub is the way in */}
      <Section aria-labelledby="cta-heading">
        <MotionReveal className="border-border bg-surface rounded-2xl border px-6 py-10 text-center sm:px-12">
          <SectionHeading
            id="cta-heading"
            title="Ready to find your people?"
            className="mx-auto text-center"
          />
          <p className="text-muted mx-auto mt-4 max-w-xl text-base leading-relaxed">
            The community lives in a set of WhatsApp chats. Pick the ones that
            fit your life and say hello.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <ActionLink href="/join">Join the community chats</ActionLink>
            <ActionLink href="/groups" variant="secondary">
              Explore the groups
            </ActionLink>
          </div>
          <div className="mt-6 flex justify-center">
            <ShareLauncher
              triggers={[
                {
                  label: "Share Miami Roots",
                  target: "card",
                  variant: "quiet",
                },
              ]}
            />
          </div>
        </MotionReveal>
      </Section>
    </>
  );
}
