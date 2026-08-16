import type { Metadata } from "next";
import Link from "next/link";

import { MotionReveal } from "@/components/motion/motion-reveal";
import { JoinAction } from "@/components/ui/join-action";
import { Section } from "@/components/ui/section";
import { CopyField, InvitePanel } from "@/features/share";
import { JOIN_LINK_PLAIN } from "@/lib/share/destination";

export const metadata: Metadata = {
  title: "Invite a friend",
  description:
    "The link, the QR code, and a message worth sending. Everything you need to bring somebody into Miami Roots.",
};

/**
 * The member's toolkit. Someone who is already in comes here to get the link,
 * show a QR across a table, or grab a card for their story.
 *
 * Deliberately not gated: there is no account system yet, and a page that asks
 * a member to prove membership before it will hand them a public link would be
 * theatre. Nothing here is private; the link it hands out is the same one on
 * every card.
 */

/** A message that sounds like a person, ready to paste. */
const SUGGESTED_MESSAGE = `I'm in a WhatsApp community called Miami Roots. It's local people, split into rooms for stuff like run clubs, going out, work, and volunteering. Figured you'd fit right in. Here's the door: ${JOIN_LINK_PLAIN}`;

const placements = [
  {
    title: "One person at a time",
    body: "The invite that works is the one with a name on it. Think of the person who moved here recently and keeps saying they need to meet people, and send it to them.",
  },
  {
    title: "In the group chats you are already in",
    body: "Your run club, your building, your coworkers. Those are whole communities that would make this one better, and their organizers are exactly who we want in here.",
  },
  {
    title: "In person, off your screen",
    body: "Open the QR full screen and let somebody scan it across a table. It beats spelling out a URL in a loud bar.",
  },
] as const;

export default function InvitePage() {
  return (
    <>
      <Section aria-labelledby="invite-heading" bandClassName="pt-14 sm:pt-20">
        <MotionReveal className="max-w-2xl">
          <h1
            id="invite-heading"
            className="text-display text-forest font-bold text-balance"
          >
            Bring somebody in
          </h1>
          <p className="text-lede text-muted mt-6 max-w-[52ch] text-pretty">
            This community grows one introduction at a time. Here is the link,
            the code, and something to say.
          </p>
        </MotionReveal>
      </Section>

      <Section aria-labelledby="tools-heading" className="pb-4">
        <MotionReveal>
          <InvitePanel
            heading="Everything you need, in one place"
            headingId="tools-heading"
            body="Copy the link, send it through your phone's share sheet, or let somebody scan the code. All three land on the same front door."
            tone="dark"
            withRewardsNote
          />
        </MotionReveal>
      </Section>

      <Section aria-labelledby="message-heading">
        <MotionReveal className="max-w-2xl">
          <h2
            id="message-heading"
            className="text-title text-forest font-bold text-balance"
          >
            If you are not sure what to say
          </h2>
          <p className="text-muted mt-4 leading-relaxed">
            Take this and make it sound like you. The part that matters is
            telling them why you thought of them.
          </p>
          <CopyField
            label="A message worth sending"
            value={SUGGESTED_MESSAGE}
            multiline
            action="Copy message"
            copiedMessage="Message copied. Change it so it sounds like you."
            className="mt-6"
          />
        </MotionReveal>
      </Section>

      <Section tone="surface" aria-labelledby="where-heading">
        <MotionReveal className="max-w-2xl">
          <h2
            id="where-heading"
            className="text-title text-forest font-bold text-balance"
          >
            Where an invite actually lands
          </h2>
        </MotionReveal>
        <dl className="mt-8 flex max-w-4xl flex-col">
          {placements.map((placement) => (
            <MotionReveal
              key={placement.title}
              className="border-forest/15 flex flex-col gap-2 border-t py-6 md:flex-row md:gap-10"
            >
              <dt className="text-forest text-lg font-semibold md:w-72 md:shrink-0">
                {placement.title}
              </dt>
              <dd className="text-muted max-w-[58ch] leading-relaxed">
                {placement.body}
              </dd>
            </MotionReveal>
          ))}
        </dl>
      </Section>

      <Section aria-labelledby="not-in-heading">
        <MotionReveal className="max-w-2xl">
          <h2
            id="not-in-heading"
            className="text-title text-forest font-bold text-balance"
          >
            Not in yet yourself?
          </h2>
          <p className="text-muted mt-4 leading-relaxed">
            This page works for anybody, but it is a lot more fun once you are
            on the inside of it.
          </p>
          <div className="mt-8">
            <JoinAction withNote block />
          </div>
          <p className="text-muted mt-8 text-sm">
            Curious what the rooms are first?{" "}
            <Link
              href="/groups"
              className="text-forest font-semibold underline underline-offset-4 hover:no-underline"
            >
              Read through them here
            </Link>
            .
          </p>
        </MotionReveal>
      </Section>
    </>
  );
}
