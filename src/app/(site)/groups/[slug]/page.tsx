import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { MotionReveal } from "@/components/motion/motion-reveal";
import { StaggerReveal } from "@/components/motion/stagger-reveal";
import { ActionLink } from "@/components/ui/action-link";
import { Badge } from "@/components/ui/badge";
import { CommunityCard } from "@/components/ui/community-card";
import { GroupLogo } from "@/components/ui/group-logo";
import { Notice } from "@/components/ui/notice";
import { SafetyBadge } from "@/components/ui/safety-badge";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  categoryLabels,
  getGroupBySlug,
  getPublishedGroups,
  getRelatedGroups,
} from "@/content/groups";
import { getGoPath } from "@/content/join/chat-links";

interface GroupPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * The group set is a fixed, in-code content module, so every valid page is known
 * at build time. Disabling on-demand params means any unknown slug returns a
 * genuine 404 (not a soft-rendered page) without running the component.
 */
export const dynamicParams = false;

/** Statically generate one page per published group at build time. */
export function generateStaticParams(): { slug: string }[] {
  return getPublishedGroups().map((group) => ({ slug: group.slug }));
}

export async function generateMetadata({
  params,
}: GroupPageProps): Promise<Metadata> {
  const { slug } = await params;
  const group = getGroupBySlug(slug);
  if (!group) {
    return { title: "Group not found" };
  }
  return {
    title: group.metadata.title,
    description: group.metadata.description,
  };
}

const accessCopy: Record<string, string> = {
  "managed-by-admins":
    "Invite access is currently managed by community administrators. Explore the group here — joining details are coming soon.",
  "coming-soon":
    "A public way to join this group is coming soon. In the meantime, here's what it's about.",
};

export default async function GroupDetailPage({ params }: GroupPageProps) {
  const { slug } = await params;
  const group = getGroupBySlug(slug);

  if (!group) {
    notFound();
  }

  const related = getRelatedGroups(group);
  const goPath = getGoPath(group.slug);
  const joinLabel =
    group.slug === "ticket-exchange"
      ? "Join Ticket Exchange"
      : "Join this chat";

  return (
    <>
      {/* Group header */}
      <section className="bg-surface border-border border-b">
        <Container className="py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="mb-4">
            <Link
              href="/groups"
              className="text-muted hover:text-forest -ml-1 inline-flex min-h-11 items-center rounded-md px-1 text-sm font-medium"
            >
              ← All groups
            </Link>
          </nav>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <GroupLogo group={group} size="lg" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="neutral">{categoryLabels[group.category]}</Badge>
                {group.safety ? (
                  <SafetyBadge label={group.safety.badge} />
                ) : null}
                {group.displayNameProvisional ? (
                  <Badge tone="subtle">Provisional name</Badge>
                ) : null}
              </div>
              <h1 className="text-forest mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                {group.name}
              </h1>
              <p className="text-muted mt-2 max-w-2xl leading-relaxed">
                {group.shortDescription}
              </p>
            </div>
          </div>

          {/* Primary action + secondary navigation */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {goPath ? <ActionLink href={goPath}>{joinLabel}</ActionLink> : null}
            <ActionLink href="/groups" variant="secondary">
              All groups
            </ActionLink>
            <ActionLink href="/guidelines" variant="secondary">
              Community guidelines
            </ActionLink>
          </div>
          {!goPath ? (
            <p className="text-muted mt-4 max-w-2xl text-sm leading-relaxed">
              {accessCopy[group.access]}
            </p>
          ) : null}
        </Container>
      </section>

      {/* About */}
      <Section aria-labelledby="about-heading">
        <MotionReveal>
          <SectionHeading id="about-heading" title="About this group" as="h2" />
          <p className="text-muted mt-4 max-w-2xl leading-relaxed text-pretty">
            {group.fullDescription}
          </p>
          {group.displayNameProvisional ? (
            <p className="text-muted mt-4 max-w-2xl text-sm">
              Note: this group&apos;s display name is provisional while its
              final name is confirmed.
              {group.logo?.wordmark
                ? ` Its logo currently reads “${group.logo.wordmark}.”`
                : ""}
            </p>
          ) : null}
        </MotionReveal>
      </Section>

      {/* Ticket safety — the fuller, peer-to-peer treatment for groups that
          carry member-to-member risk. A ticket-style clipped reveal, restrained. */}
      {group.safety ? (
        <Section tone="surface" aria-labelledby="safety-heading">
          <MotionReveal className="border-forest/20 bg-background relative max-w-2xl overflow-hidden rounded-2xl border p-6 sm:p-8">
            {/* Decorative ticket perforation down the left edge. */}
            <span
              aria-hidden="true"
              className="border-forest/15 absolute inset-y-4 left-3 hidden border-l-2 border-dashed sm:block"
            />
            <div className="sm:pl-6">
              <div className="flex flex-wrap items-center gap-3">
                <SafetyBadge label={group.safety.badge} />
              </div>
              <h2
                id="safety-heading"
                className="text-forest mt-4 text-2xl font-bold tracking-tight"
              >
                Buy and sell tickets safely
              </h2>
              <p className="text-muted mt-3 leading-relaxed">
                {group.safety.summary} A few habits keep every trade safe:
              </p>
              <ul className="mt-4 space-y-2">
                {group.safety.points.map((point) => (
                  <li
                    key={point}
                    className="text-muted flex gap-2 text-sm leading-relaxed"
                  >
                    <span aria-hidden="true" className="text-forest mt-0.5">
                      ✓
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <div className="border-forest/15 text-muted mt-5 border-t pt-4 text-sm leading-relaxed">
                {group.safety.disclaimer}
              </div>
              <div className="mt-5">
                <ActionLink href="/guidelines" variant="secondary">
                  Read the community guidelines
                </ActionLink>
              </div>
            </div>
          </MotionReveal>
        </Section>
      ) : null}

      {/* What belongs / what doesn't */}
      <Section
        tone={group.safety ? "default" : "surface"}
        aria-labelledby="fit-heading"
      >
        <MotionReveal>
          <SectionHeading id="fit-heading" title="What belongs here" as="h2" />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="border-border bg-background rounded-xl border p-6">
              <h3 className="text-forest font-semibold">A good fit</h3>
              <ul className="mt-3 space-y-2">
                {group.belongs.map((item) => (
                  <li
                    key={item}
                    className="text-muted flex gap-2 text-sm leading-relaxed"
                  >
                    <span aria-hidden="true" className="text-forest">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-border bg-background rounded-xl border p-6">
              <h3 className="text-forest font-semibold">Not for this group</h3>
              <ul className="mt-3 space-y-2">
                {group.doesNotBelong.map((item) => (
                  <li
                    key={item}
                    className="text-muted flex gap-2 text-sm leading-relaxed"
                  >
                    <span aria-hidden="true" className="text-muted">
                      ✕
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </MotionReveal>
      </Section>

      {/* Notices + etiquette */}
      <Section
        tone={group.safety ? "surface" : "default"}
        aria-labelledby="expectations-heading"
      >
        <MotionReveal>
          <SectionHeading
            id="expectations-heading"
            title="Community etiquette"
            as="h2"
          />
          <ul className="mt-4 max-w-2xl space-y-2">
            {group.etiquette.map((item) => (
              <li
                key={item}
                className="text-muted flex gap-2 text-sm leading-relaxed"
              >
                <span aria-hidden="true" className="text-forest">
                  •
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {group.notices && group.notices.length > 0 ? (
            <div className="mt-8 grid gap-4 md:max-w-2xl">
              {group.notices.map((notice) => (
                <Notice
                  key={notice.title}
                  title={notice.title}
                  tone={notice.tone}
                >
                  {notice.body.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </Notice>
              ))}
            </div>
          ) : null}
        </MotionReveal>
      </Section>

      {/* Related groups */}
      {related.length > 0 ? (
        <Section
          tone={group.safety ? "default" : "surface"}
          aria-labelledby="related-heading"
        >
          <MotionReveal>
            <SectionHeading
              id="related-heading"
              title="Related groups"
              as="h2"
            />
          </MotionReveal>
          <StaggerReveal
            as="ul"
            itemAs="li"
            className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            itemClassName="h-full"
            stagger={0.06}
          >
            {related.map((rel) => (
              <CommunityCard key={rel.slug} group={rel} />
            ))}
          </StaggerReveal>
        </Section>
      ) : null}

      {/* Back to directory */}
      <Section aria-labelledby="back-heading">
        <MotionReveal>
          <SectionHeading
            id="back-heading"
            title="Keep exploring"
            as="h2"
            description="There are more communities to discover across Miami Roots."
          />
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ActionLink href="/join">Join the community chats</ActionLink>
            <ActionLink href="/groups" variant="secondary">
              See all groups
            </ActionLink>
          </div>
        </MotionReveal>
      </Section>
    </>
  );
}
