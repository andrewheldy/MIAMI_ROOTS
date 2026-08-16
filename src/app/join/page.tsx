import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { JoinAction } from "@/components/ui/join-action";
import { siteConfig } from "@/config/site";
import { getRoomClusters } from "@/content/groups";
import { CampaignAttribution, ShareButton } from "@/features/share";
import { buildJoinShareUrl } from "@/lib/share/destination";
import { getJoinHeroMedia } from "@/lib/join-media";

import { HeroMedia } from "./hero-media";

const joinTitle = "Join Miami Roots | Find Your Miami Community";
const joinDescription =
  "One WhatsApp community for Miami, with rooms for friendships, business, events, organizing, wellness, and sober social life.";

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

/** The three things a stranger should know before they knock. */
const houseRules = [
  "Give before you take. Share what you have before you ask for something.",
  "No cold pitching and no mass-DMing. These are neighbors, not leads.",
  "Be a real participant. Lurking is fine for a week, not forever.",
] as const;

/**
 * The shareable front door. This is the URL on every QR code, card, story, and
 * Instagram bio, so it is the page a stranger lands on knowing nothing.
 *
 * It carries one action, the same one as the rest of the site, and enough
 * explanation to make tapping it feel obvious rather than risky. It lives
 * outside the `(site)` route group so it renders standalone, with its own
 * compact footer.
 */
export default function JoinPage() {
  const heroMedia = getJoinHeroMedia();
  const clusters = getRoomClusters();

  return (
    <main id="main" className="flex-1">
      {/* Capture campaign attribution (?ref/&utm_*) so a member share is
          measurable; non-personal, renders nothing, preserves the layout. */}
      <CampaignAttribution />

      {/* Cinematic hero: poster always, video only when present + motion is ok. */}
      <section
        aria-labelledby="join-heading"
        className="bg-forest relative isolate flex min-h-[76svh] flex-col overflow-hidden sm:min-h-[70vh]"
      >
        <HeroMedia poster={heroMedia.poster} sources={heroMedia.sources} />
        {/* Scrim so the white hero text stays readable over any footage. */}
        <div
          aria-hidden="true"
          className="from-forest via-forest/85 to-forest/55 absolute inset-0 bg-gradient-to-t"
        />
        <div className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-8">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-3 rounded-lg"
            aria-label={`${siteConfig.name}, visit the full website`}
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
          <div className="join-rise mt-auto flex flex-col items-start gap-5 pt-16 pb-10 sm:pb-14">
            <p className="text-mint text-sm font-semibold tracking-[0.24em] uppercase">
              Miami Roots
            </p>
            <h1
              id="join-heading"
              className="text-display font-bold text-balance text-white"
            >
              Come find your people in Miami.
            </h1>
            <p className="text-lede max-w-[44ch] text-pretty text-white/85">
              One WhatsApp community, with a room for every part of life here.
              Join once, then find your rooms inside.
            </p>
            <div className="mt-1 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <JoinAction tone="onDark" block />
              <a
                href="#inside"
                className="text-mint inline-flex min-h-12 items-center text-base font-semibold underline-offset-4 hover:text-white hover:underline"
              >
                What is inside
              </a>
            </div>
            <p className="text-sm text-white/60">
              Opens WhatsApp. Free, and you can leave any time.
            </p>
          </div>
        </div>
      </section>

      {/* What is inside: the rooms, explained. No chat links; you find your
          rooms from within the community. */}
      <section
        id="inside"
        aria-labelledby="inside-heading"
        className="scroll-mt-2 py-12 sm:py-16"
      >
        <div className="mx-auto w-full max-w-2xl px-5 sm:px-8">
          <h2
            id="inside-heading"
            className="text-title text-forest font-bold text-balance"
          >
            Seven rooms are waiting on the other side
          </h2>
          <p className="text-muted mt-4 leading-relaxed">
            You join the community once. Inside it, these are the rooms you can
            walk into, whenever one of them sounds like you.
          </p>

          <div className="mt-9 flex flex-col gap-9">
            {clusters.map((cluster, index) => (
              <div
                key={cluster.id}
                className="join-rise border-forest/15 border-t pt-6"
                style={
                  { "--join-rise-delay": `${index * 70}ms` } as CSSProperties
                }
              >
                <h3 className="text-forest text-lg font-bold tracking-tight">
                  {cluster.title}
                </h3>
                <ul className="mt-4 flex flex-col gap-4">
                  {cluster.groups.map((group) => (
                    <li key={group.slug}>
                      <p className="text-forest font-semibold">{group.name}</p>
                      <p className="text-muted mt-0.5 text-sm leading-relaxed">
                        {group.forYouIf}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before you knock. The rules, stated plainly, before joining. */}
      <section
        aria-labelledby="rules-heading"
        className="bg-mint-100 py-12 sm:py-16"
      >
        <div className="mx-auto w-full max-w-2xl px-5 sm:px-8">
          <h2
            id="rules-heading"
            className="text-title text-forest font-bold text-balance"
          >
            Three things we ask of everybody
          </h2>
          <ul className="mt-6 flex flex-col gap-4">
            {houseRules.map((rule) => (
              <li
                key={rule}
                className="border-forest/20 text-forest border-l-2 pl-4 leading-relaxed"
              >
                {rule}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <JoinAction block />
            <Link
              href="/guidelines"
              className="text-forest inline-flex min-h-12 items-center text-base font-semibold underline underline-offset-4 hover:no-underline"
            >
              Read the full house rules
            </Link>
          </div>
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
            Real people, real community, rooted in Miami.
          </p>
          <ShareButton
            url={buildJoinShareUrl("web_share")}
            label="Send this to a friend"
            appearance="light"
          />
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
                  House rules
                </Link>
              </li>
              <li>
                <Link
                  href="/invite"
                  className="inline-flex min-h-11 items-center font-medium text-white/85 underline-offset-4 hover:text-white hover:underline"
                >
                  Invite a friend
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </footer>
    </main>
  );
}
