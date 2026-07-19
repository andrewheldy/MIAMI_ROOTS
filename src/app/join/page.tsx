import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { Badge } from "@/components/ui/badge";
import { GroupLogo } from "@/components/ui/group-logo";
import { SafetyBadge } from "@/components/ui/safety-badge";
import { siteConfig } from "@/config/site";
import { getGroupBySlug, type CommunityGroup } from "@/content/groups";
import { chatLinks, type ChatLink } from "@/content/join/chat-links";
import { getJoinHeroMedia } from "@/lib/join-media";

import { HeroMedia } from "./hero-media";
import { ShareButton } from "./share-button";

const joinTitle = "Join Miami Roots | Find Your Miami Community";
const joinDescription =
  "Explore Miami Roots communities for friendships, business connections, events, organizing, wellness, and sober support.";

export const metadata: Metadata = {
  // The exact shareable title, opting out of the sitewide "· Miami Roots" template.
  title: { absolute: joinTitle },
  description: joinDescription,
  alternates: { canonical: "/join" },
  openGraph: {
    title: joinTitle,
    description: joinDescription,
    url: "/join",
    siteName: siteConfig.name,
    type: "website",
    // Best existing brand image until a route-specific OG image is produced.
    images: [
      {
        url: "/brand/banners/miami-roots-community-banner.png",
        width: 1376,
        height: 768,
      },
    ],
  },
};

/**
 * The shareable community hub — the primary link for Instagram bios, QR codes,
 * flyers, and WhatsApp messages. Lives outside the `(site)` route group so it
 * renders standalone: cinematic hero, stacked chat links, share control, and
 * its own compact footer.
 */
export default function JoinPage() {
  const heroMedia = getJoinHeroMedia();
  const joinUrl = `${siteConfig.url}/join`;
  const chats = chatLinks
    .map((link) => {
      const group = getGroupBySlug(link.groupSlug);
      return group ? { link, group } : null;
    })
    .filter((chat): chat is { link: ChatLink; group: CommunityGroup } =>
      Boolean(chat),
    );

  return (
    <main id="main" className="flex-1">
      {/* Cinematic hero: poster always, video only when present + motion is ok. */}
      <section
        aria-labelledby="join-heading"
        className="bg-forest relative isolate flex min-h-[72svh] flex-col overflow-hidden sm:min-h-[70vh]"
      >
        <HeroMedia poster={heroMedia.poster} sources={heroMedia.sources} />
        {/* Scrim so the white hero text stays readable over any footage. */}
        <div
          aria-hidden="true"
          className="from-forest via-forest/60 to-forest/30 absolute inset-0 bg-gradient-to-t"
        />
        <div className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-8">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-3 rounded-lg"
            aria-label={`${siteConfig.name} — visit the full website`}
          >
            <Image
              src="/brand/logos/miami-roots-logo.png"
              alt=""
              width={48}
              height={48}
              priority
              className="h-12 w-12 rounded-xl shadow-md"
            />
          </Link>
          <div className="join-rise mt-auto flex flex-col items-start gap-4 pt-16 pb-10 sm:pb-14">
            <p className="text-mint text-sm font-semibold tracking-[0.2em] uppercase">
              Miami Roots
            </p>
            <h1
              id="join-heading"
              className="text-4xl font-bold tracking-tight text-balance text-white sm:text-5xl"
            >
              Find your people in Miami.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-pretty text-white/90">
              Local communities for real friendships, shared opportunities,
              better events, and meaningful impact.
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <a
                href="#chats"
                className="bg-background text-forest hover:bg-cream inline-flex min-h-12 items-center justify-center rounded-lg px-6 text-sm font-semibold transition-colors"
              >
                Explore the chats
              </a>
              <Link
                href="/"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/40 px-6 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
              >
                Visit the full website
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The chats — the section itself is the "Explore the chats" anchor. */}
      <section
        id="chats"
        aria-labelledby="chats-heading"
        className="scroll-mt-2 py-12 sm:py-16"
      >
        <div className="mx-auto w-full max-w-2xl px-5 sm:px-8">
          <h2
            id="chats-heading"
            className="text-forest text-2xl font-bold tracking-tight sm:text-3xl"
          >
            Pick a chat and say hello
          </h2>
          <p className="text-muted mt-3 text-base leading-relaxed">
            Every community is a WhatsApp group with its own focus. Start where
            it feels natural — you can always join more than one.
          </p>
          <p className="text-muted mt-3 text-sm leading-relaxed">
            Miami Roots is built around real community, respect, and responsible
            participation. Please review our{" "}
            <Link
              href="/guidelines"
              className="text-forest font-medium underline decoration-2 underline-offset-2 hover:no-underline"
            >
              community guidelines
            </Link>{" "}
            before joining.
          </p>

          <ul className="mt-8 flex flex-col gap-4">
            {chats.map(({ link, group }, index) => (
              <li
                key={link.redirectSlug}
                className="join-rise"
                style={
                  { "--join-rise-delay": `${index * 70}ms` } as CSSProperties
                }
              >
                <a
                  href={`/go/${link.redirectSlug}`}
                  className="group border-border bg-background hover:border-forest/40 hover:shadow-forest/5 flex min-h-12 items-center gap-4 rounded-2xl border p-4 transition-[border-color,box-shadow,transform] hover:shadow-lg motion-safe:hover:-translate-y-0.5 sm:p-5"
                >
                  <GroupLogo group={group} />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-forest text-lg leading-snug font-semibold">
                        {group.name}
                      </span>
                      {link.featured ? (
                        <Badge tone="brand">Best place to start</Badge>
                      ) : null}
                      {group.safety ? (
                        <SafetyBadge label={group.safety.badge} />
                      ) : null}
                    </span>
                    <span className="text-muted mt-1 block text-sm leading-relaxed">
                      {group.shortDescription}
                    </span>
                    <span className="text-forest-600 mt-2 inline-flex items-center gap-1.5 text-sm font-semibold">
                      Open the chat
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3.5 w-3.5 transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
                      >
                        <path d="M4.5 11.5l7-7m0 0H6m5.5 0V10" />
                      </svg>
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Hub footer */}
      <footer className="bg-forest text-white">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-start gap-6 px-5 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:px-8">
          <div className="flex items-center gap-3">
            <Image
              src="/brand/logos/miami-roots-logo.png"
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 rounded-lg"
            />
            <span className="text-lg font-semibold tracking-tight">
              {siteConfig.name}
            </span>
          </div>
          <p className="text-base font-medium text-white/90">
            Real people. Real community. Rooted in Miami.
          </p>
          <ShareButton url={joinUrl} appearance="light" />
          <nav aria-label="Hub">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="inline-flex min-h-11 items-center font-medium text-white/85 underline-offset-4 hover:text-white hover:underline"
                >
                  Full website
                </Link>
              </li>
              <li>
                <Link
                  href="/guidelines"
                  className="inline-flex min-h-11 items-center font-medium text-white/85 underline-offset-4 hover:text-white hover:underline"
                >
                  Community guidelines
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </footer>
    </main>
  );
}
