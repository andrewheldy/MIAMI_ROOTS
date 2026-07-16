import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { ActionLink } from "@/components/ui/action-link";
import { Badge } from "@/components/ui/badge";
import { CommunityCard } from "@/components/ui/community-card";
import { GroupLogo } from "@/components/ui/group-logo";
import { Notice } from "@/components/ui/notice";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  categoryLabels,
  getGroupBySlug,
  getPublishedGroups,
  getRelatedGroups,
} from "@/content/groups";

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

  return (
    <>
      {/* Group header */}
      <section className="bg-surface border-border border-b">
        <Container className="py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="mb-6">
            <Link
              href="/groups"
              className="text-muted hover:text-forest rounded-md text-sm font-medium"
            >
              ← All groups
            </Link>
          </nav>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <GroupLogo group={group} size="lg" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="neutral">{categoryLabels[group.category]}</Badge>
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
        </Container>
      </section>

      {/* About */}
      <Section aria-labelledby="about-heading">
        <SectionHeading id="about-heading" title="About this group" as="h2" />
        <p className="text-muted mt-4 max-w-2xl leading-relaxed text-pretty">
          {group.fullDescription}
        </p>
        {group.displayNameProvisional ? (
          <p className="text-muted mt-4 max-w-2xl text-sm">
            Note: this group&apos;s display name is provisional while its final
            name is confirmed.
            {group.logo?.wordmark
              ? ` Its logo currently reads “${group.logo.wordmark}.”`
              : ""}
          </p>
        ) : null}
      </Section>

      {/* What belongs / what doesn't */}
      <Section tone="surface" aria-labelledby="fit-heading">
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
      </Section>

      {/* Notices + etiquette + access */}
      <Section aria-labelledby="expectations-heading">
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

        {/* Honest access state — never a fake join link */}
        <div className="border-border bg-surface mt-8 max-w-2xl rounded-lg border p-5">
          <p className="text-forest font-semibold">Joining this group</p>
          <p className="text-muted mt-2 text-sm leading-relaxed">
            {accessCopy[group.access]}
          </p>
        </div>
      </Section>

      {/* Related groups */}
      {related.length > 0 ? (
        <Section tone="surface" aria-labelledby="related-heading">
          <SectionHeading id="related-heading" title="Related groups" as="h2" />
          <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((rel) => (
              <li key={rel.slug} className="h-full">
                <CommunityCard group={rel} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* Back to directory */}
      <Section aria-labelledby="back-heading">
        <SectionHeading
          id="back-heading"
          title="Keep exploring"
          as="h2"
          description="There are more communities to discover across Miami Roots."
        />
        <div className="mt-6">
          <ActionLink href="/groups">See all groups</ActionLink>
        </div>
      </Section>
    </>
  );
}
