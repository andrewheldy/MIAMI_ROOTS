import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { MotionReveal } from "@/components/motion/motion-reveal";
import { GroupLogo } from "@/components/ui/group-logo";
import { JoinAction } from "@/components/ui/join-action";
import { Section } from "@/components/ui/section";
import { getRoomClusters } from "@/content/groups";
import { InvitePanel } from "@/features/share";

/**
 * The public gateway.
 *
 * One job, in this order: say what this is, offer the one door, explain the
 * rooms behind it well enough that a stranger can tell whether their people are
 * inside, and hand every member an easy way to bring somebody else. Nothing on
 * this page links into an individual chat (owner decision, 2026-08-16): people
 * join the community, and find their rooms from inside it.
 */

interface FirstMove {
  readonly ordinal: string;
  readonly title: string;
  readonly body: string;
  readonly link?: { readonly href: string; readonly label: string };
}

/** What to do once you are in. The heading is the instruction; there are no
 *  "Step 1" labels, because the step is its own label. */
const firstMoves: readonly FirstMove[] = [
  {
    ordinal: "01",
    title: "Say hello in General Chat",
    body: "One line is enough. Your name, what part of town you are in, and what you are into. People answer.",
  },
  {
    ordinal: "02",
    title: "Read the house rules",
    body: "Short and unsurprising. Give before you take, no cold pitching, treat people like neighbors rather than leads.",
    link: { href: "/guidelines", label: "Read them" },
  },
  {
    ordinal: "03",
    title: "Bring one person with you",
    body: "The community is only as good as the people in it, and you know somebody who belongs here. Send them the link.",
    link: { href: "/invite", label: "Get the link and QR" },
  },
];

export default function HomePage() {
  const clusters = getRoomClusters();

  return (
    <>
      {/* ── Hero. Dark brand ground, off-axis: the words carry the left, the
          mark holds the right. One action. ─────────────────────────────── */}
      <section
        aria-labelledby="hero-heading"
        className="from-forest to-forest-900 relative overflow-hidden bg-gradient-to-b"
      >
        <Container className="relative max-w-6xl py-14 sm:py-20 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
            <div className="join-rise max-w-[38rem]">
              <p className="text-mint text-sm font-semibold tracking-[0.24em] uppercase">
                Miami Roots
              </p>
              <h1
                id="hero-heading"
                className="text-display mt-5 font-bold text-balance text-white"
              >
                Miami has a group chat.
              </h1>
              <p className="text-lede mt-6 max-w-[46ch] text-pretty text-white/85">
                This is the door in. One WhatsApp community, with a room for
                every part of life here, and your people already inside.
              </p>
              <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <JoinAction tone="onDark" block />
                <a
                  href="#rooms"
                  className="text-mint inline-flex min-h-12 items-center text-base font-semibold underline-offset-4 hover:text-white hover:underline"
                >
                  See what is inside
                </a>
              </div>
              <p className="mt-4 text-sm text-white/60">
                Opens WhatsApp. Free, and you can leave any time.
              </p>
            </div>

            {/* The mark, given room to be a poster rather than a favicon. */}
            <div className="hidden lg:flex lg:justify-end">
              <div className="bg-mint-100/95 rounded-[2rem] p-8 shadow-2xl shadow-black/25">
                <Image
                  src="/brand/logos/miami-roots-logo.png"
                  alt="Miami Roots logo: a palm tree growing out of a WhatsApp speech bubble, rooted into the ground"
                  width={280}
                  height={280}
                  priority
                  className="h-56 w-56 rounded-2xl object-contain"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── What this is. Plain prose, wide measure, no ornament. ───────── */}
      <Section aria-labelledby="what-heading">
        <MotionReveal className="max-w-3xl">
          <h2
            id="what-heading"
            className="text-title text-forest font-bold text-balance"
          >
            It is one community, not seven group chats you have to chase down.
          </h2>
          <p className="text-muted mt-6 max-w-[62ch] text-lg leading-relaxed">
            Miami Roots lives on WhatsApp as a single community with separate
            rooms inside it. You join the community once. From there you walk
            into whichever rooms match your life: mornings on the beach, work
            you are building, nights out, or the Saturday you spend cleaning up
            a park. Nobody has to hunt down seven separate invite links, and
            nobody gets dropped into a room they never asked for.
          </p>
        </MotionReveal>
        <MotionReveal className="border-border mt-12 grid max-w-4xl gap-8 border-t pt-10 md:grid-cols-2 md:gap-12">
          <div>
            <h3 className="text-forest text-lg font-semibold">
              Built for finding people, not collecting them
            </h3>
            <p className="text-muted mt-2 leading-relaxed">
              Every room has a stated purpose so the conversation you walk into
              is already relevant to you. That is the whole trick to meeting
              people as an adult: be in the right room, more than once.
            </p>
          </div>
          <div>
            <h3 className="text-forest text-lg font-semibold">
              A doorway between communities
            </h3>
            <p className="text-muted mt-2 leading-relaxed">
              A lot of the people here already run communities of their own.
              They came to bring their people in, meet the organizers doing the
              same thing, and pass members back and forth instead of quietly
              competing for them.
            </p>
          </div>
        </MotionReveal>
      </Section>

      {/* ── The rooms. Grouped by what they are for, explained, not linked
          into. Long lists get structure; seven flat rows would read as a
          directory. ─────────────────────────────────────────────────────── */}
      <Section id="rooms" tone="surface" aria-labelledby="rooms-heading">
        <MotionReveal className="max-w-2xl">
          <h2
            id="rooms-heading"
            className="text-title text-forest font-bold text-balance"
          >
            Seven rooms, and who each one is for
          </h2>
          <p className="text-muted mt-4 text-lg leading-relaxed">
            You do not pick rooms from this page. Read them, find the one or two
            that sound like you, and go straight there once you are inside.
          </p>
        </MotionReveal>

        <div className="mt-12 flex flex-col gap-14">
          {clusters.map((cluster) => (
            <MotionReveal key={cluster.id}>
              <div className="border-forest/15 flex flex-col gap-2 border-t pt-6 md:flex-row md:gap-10">
                <div className="md:w-64 md:shrink-0">
                  <h3 className="text-forest text-xl font-bold tracking-tight">
                    {cluster.title}
                  </h3>
                  <p className="text-muted mt-2 text-sm leading-relaxed">
                    {cluster.blurb}
                  </p>
                </div>
                <ul className="flex min-w-0 flex-1 flex-col gap-8 md:gap-9">
                  {cluster.groups.map((group) => (
                    <li key={group.slug} className="flex gap-4 sm:gap-5">
                      <GroupLogo group={group} className="mt-1" />
                      <div className="min-w-0">
                        <h4 className="text-forest text-lg font-semibold">
                          <Link
                            href={`/groups/${group.slug}`}
                            className="inline-block rounded-md py-1 underline-offset-4 hover:underline"
                          >
                            {group.name}
                          </Link>
                        </h4>
                        <p className="text-forest-600 mt-1 font-medium text-pretty">
                          {group.forYouIf}
                        </p>
                        <p className="text-muted mt-2 leading-relaxed text-pretty">
                          {group.whyItExists}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </MotionReveal>
          ))}
        </div>
      </Section>

      {/* ── Community leaders. A different audience, so a different ground. */}
      <section
        aria-labelledby="leaders-heading"
        className="bg-forest py-14 sm:py-20"
      >
        <Container>
          <MotionReveal className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end">
            <div>
              <h2
                id="leaders-heading"
                className="text-title font-bold text-balance text-white"
              >
                If you already run a community, bring it with you
              </h2>
              <p className="mt-5 max-w-[54ch] text-lg leading-relaxed text-white/80">
                Run-clubs, supper clubs, coworking floors, sports leagues,
                neighborhood groups. Miami Roots works best as the place those
                organizers meet each other. Invite your people in, meet the
                people running the group across town, and send members toward
                each other instead of guarding them.
              </p>
            </div>
            <ul className="flex flex-col gap-4 text-white/80">
              <li className="border-l-2 border-white/25 pl-4 leading-relaxed">
                Your group keeps its own chat, its own rules, and its own
                identity. Nothing merges.
              </li>
              <li className="border-l-2 border-white/25 pl-4 leading-relaxed">
                Your members get access to everything else here, which makes
                your community more useful, not less.
              </li>
              <li className="border-l-2 border-white/25 pl-4 leading-relaxed">
                You get a direct line to the other people doing this in Miami.
              </li>
            </ul>
          </MotionReveal>
          <MotionReveal className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <JoinAction tone="onDark" block />
            <Link
              href="/connectors"
              className="text-mint inline-flex min-h-12 items-center text-base font-semibold underline-offset-4 hover:text-white hover:underline"
            >
              About Founding Connectors
            </Link>
          </MotionReveal>
        </Container>
      </section>

      {/* ── First five minutes. An editorial index: the heading is the step. */}
      <Section aria-labelledby="first-heading">
        <MotionReveal className="max-w-2xl">
          <h2
            id="first-heading"
            className="text-title text-forest font-bold text-balance"
          >
            What to do in your first five minutes
          </h2>
        </MotionReveal>
        <ol className="mt-10 flex flex-col">
          {firstMoves.map((move) => (
            <li key={move.ordinal}>
              <MotionReveal className="border-border flex flex-col gap-2 border-t py-7 sm:flex-row sm:gap-8">
                <span
                  aria-hidden="true"
                  className="text-forest/30 text-3xl leading-none font-bold tracking-tight sm:w-16 sm:shrink-0 sm:text-4xl"
                >
                  {move.ordinal}
                </span>
                <div className="max-w-[58ch]">
                  <h3 className="text-forest text-xl font-semibold">
                    {move.title}
                  </h3>
                  <p className="text-muted mt-2 leading-relaxed">{move.body}</p>
                  {move.link ? (
                    <Link
                      href={move.link.href}
                      className="text-forest-600 mt-3 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4 hover:no-underline"
                    >
                      {move.link.label}
                    </Link>
                  ) : null}
                </div>
              </MotionReveal>
            </li>
          ))}
        </ol>
      </Section>

      {/* ── Invite. The member's own tools, on the page they already trust. */}
      <Section tone="surface" aria-labelledby="invite-heading">
        <MotionReveal>
          <InvitePanel
            heading="Miami gets better when you bring somebody"
            headingId="invite-heading"
            body="Send the link, or let them scan the code off your screen. It opens the same front door you came through."
            tone="mint"
            withRewardsNote
          />
        </MotionReveal>
      </Section>

      {/* ── Close. One line, the same action, nothing else competing. ───── */}
      <Section aria-labelledby="close-heading">
        <MotionReveal className="max-w-3xl">
          <h2
            id="close-heading"
            className="text-title text-forest font-bold text-balance"
          >
            Your people are already in there.
          </h2>
          <p className="text-muted mt-4 max-w-[52ch] text-lg leading-relaxed">
            Come in, say hello, and see who you run into.
          </p>
          <div className="mt-8">
            <JoinAction withNote block />
          </div>
        </MotionReveal>
      </Section>
    </>
  );
}
