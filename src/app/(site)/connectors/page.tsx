import type { Metadata } from "next";

import { MotionReveal } from "@/components/motion/motion-reveal";
import { StaggerReveal } from "@/components/motion/stagger-reveal";
import { ActionLink } from "@/components/ui/action-link";
import { Badge } from "@/components/ui/badge";
import { Notice } from "@/components/ui/notice";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { isNominationCaptureConfigured } from "@/lib/connectors/nomination-store";

import { NominationForm } from "./nomination-form";

/**
 * The public Founding Connectors page.
 *
 * All copy here is PROVISIONAL pending an owner voice pass — same standing as
 * the rest of the gateway. The program design it describes is in
 * `docs/01-product/founding-connectors-program.md`; if the two ever disagree,
 * that document is the source of truth and this page is the thing to fix.
 *
 * The nomination section is deliberately conditional: it renders a real form
 * only where nominations can really be stored, and an honest direct-contact
 * route otherwise. Nothing here ever accepts a submission it will drop.
 */

const title = "Founding Connectors";
const description =
  "A small, invited group of Miami people who bring others together — and carry a Miami Roots card to do it.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/connectors" },
};

/** The kinds of people the first cohort is being built from. */
const archetypes = [
  {
    label: "Instructors & practitioners",
    body: "The yoga teacher whose 7am class became a friend group. Trainers, run-club leaders, wellness practitioners.",
  },
  {
    label: "DJs & music curators",
    body: "People whose taste moves a room, and whose guest list is a real community rather than a mailing list.",
  },
  {
    label: "Organizers & promoters",
    body: "Anyone who has put on something in this city and had strangers leave as friends.",
  },
  {
    label: "Hospitality",
    body: "Bartenders, servers, venue and shop operators — the people who know everyone because everyone comes through.",
  },
  {
    label: "Founders & operators",
    body: "People building something here who introduce others without keeping score.",
  },
  {
    label: "Artists & creatives",
    body: "Studio, gallery, film, design — the people whose work pulls a scene around it.",
  },
  {
    label: "Realtors & neighborhood people",
    body: "The ones who know their few blocks properly and get asked “who should I talk to?” constantly.",
  },
  {
    label: "Nonprofit & civic leaders",
    body: "Organizers, mutual-aid people, board members — the quiet infrastructure of the city.",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "You get a card",
    body: "A Miami Roots card with an NFC chip and a printed QR code. It goes in a wallet or a phone case. It never runs out and never expires.",
  },
  {
    step: "02",
    title: "Someone taps it",
    body: "A phone touches the card or scans the code. It opens a Miami Roots page — the same one for both — no app, no download, no form in the way.",
  },
  {
    step: "03",
    title: "They land in the community",
    body: "From there it's one tap into the General Chat, where the rest of it happens: events, introductions, work, people who actually show up.",
  },
];

const benefits = [
  "Recognition as one of the original Founding Connectors — there is only one first cohort.",
  "First invitations to Miami Roots events, before anything is announced.",
  "Priority access when a gathering has a real capacity limit.",
  "Connector-only get-togethers — which is really the point: this cohort should know each other.",
  "Room to put your own events, classes, and projects in front of the community.",
  "A say in what Miami Roots programs next, while it's still small enough for that to mean something.",
  "Partner perks and occasional guest passes as they come together.",
  "Named on this site, if — and only if — you want to be.",
  "First access to Roots chapters in other cities when they open.",
];

export default function ConnectorsPage() {
  const captureConfigured = isNominationCaptureConfigured();

  return (
    <>
      <Section aria-labelledby="connectors-heading">
        <Badge tone="neutral">Invitation-led · ~20&ndash;30 people</Badge>
        <SectionHeading
          as="h1"
          id="connectors-heading"
          className="mt-4"
          title="Miami Roots Founding Connectors"
          description="Some people are the reason other people know each other. This is a small group of them, given a card that opens the door to Miami Roots in one tap."
        />
        <p className="text-muted mt-6 max-w-2xl text-base leading-relaxed">
          Miami Roots is a network of networks &mdash; communities, events,
          businesses, and the people who tie them together. It grows the way
          anything real in this city grows: someone you trust says{" "}
          <em>you should be in this</em>. Founding Connectors are the people
          doing the saying.
        </p>
        <p className="text-muted mt-6 text-sm">
          Provisional &mdash; program and copy pending an owner review. Joining
          is by invitation and nomination; admission is never guaranteed.
        </p>
      </Section>

      <Section tone="surface" aria-labelledby="what-heading">
        <SectionHeading
          id="what-heading"
          eyebrow="What it is"
          title="A connector, not an ambassador"
          description="This is not a promo team, an affiliate scheme, or a follower-count competition. Nobody is paid per head."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <MotionReveal className="border-border bg-background rounded-xl border p-6">
            <h3 className="text-forest text-lg font-semibold">
              What we&apos;re actually looking for
            </h3>
            <ul className="text-muted mt-3 space-y-2 text-sm leading-relaxed">
              <li>
                You introduce people to each other without being asked, and
                without needing anything back.
              </li>
              <li>
                People trust your recommendation &mdash; on a place, a person, a
                night out, a job.
              </li>
              <li>
                You&apos;re out in the city in real life, not just online about
                it.
              </li>
              <li>
                You&apos;d be comfortable if the people you invited met each
                other and talked about you.
              </li>
            </ul>
          </MotionReveal>
          <MotionReveal
            delay={0.08}
            className="border-border bg-background rounded-xl border p-6"
          >
            <h3 className="text-forest text-lg font-semibold">
              What it isn&apos;t
            </h3>
            <ul className="text-muted mt-3 space-y-2 text-sm leading-relaxed">
              <li>
                Not a job, and not a commission &mdash; nobody is paid per
                sign-up.
              </li>
              <li>
                Not a numbers race. We don&apos;t publish a referral
                leaderboard.
              </li>
              <li>
                Not a licence to speak for Miami Roots or promise anyone
                anything.
              </li>
              <li>
                Not permanent. It&apos;s a standing invitation, and either side
                can end it.
              </li>
            </ul>
          </MotionReveal>
        </div>
      </Section>

      <Section aria-labelledby="why-heading">
        <SectionHeading
          id="why-heading"
          eyebrow="Why it exists"
          title="Because a link in a bio doesn't tell you who to trust"
          description="Anyone can post a link. What actually gets someone to walk into a room full of strangers is a person they know saying it's worth it."
        />
        <p className="text-muted mt-6 max-w-2xl text-base leading-relaxed">
          Miami is a city of scenes that barely touch. The wellness people, the
          music people, the builders, the organizers, the neighborhood people
          &mdash; each one is dense inside and thin at the edges. Founding
          Connectors are the edges. Giving twenty or thirty of them one physical
          object that opens the door beats any amount of advertising, and it
          keeps the community made of people who were personally vouched for.
        </p>
      </Section>

      <Section tone="surface" aria-labelledby="who-heading">
        <SectionHeading
          id="who-heading"
          eyebrow="Who it's for"
          title="The first cohort, roughly"
          description="Not a checklist — a picture of the mix we're building. Trust and real-world activity count for more than reach."
        />
        <StaggerReveal
          as="ul"
          itemAs="li"
          className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          itemClassName="h-full"
        >
          {archetypes.map((archetype) => (
            <div
              key={archetype.label}
              className="border-border bg-background h-full rounded-xl border p-5"
            >
              <h3 className="text-forest font-semibold">{archetype.label}</h3>
              <p className="text-muted mt-2 text-sm leading-relaxed">
                {archetype.body}
              </p>
            </div>
          ))}
        </StaggerReveal>
      </Section>

      <Section aria-labelledby="card-heading">
        <SectionHeading
          id="card-heading"
          eyebrow="The card"
          title="Tap or scan. That's the whole interaction."
          description="One object, two ways in, and no explaining required at a loud bar."
        />
        <StaggerReveal
          as="ol"
          itemAs="li"
          className="mt-8 grid gap-5 md:grid-cols-3"
          itemClassName="h-full"
        >
          {howItWorks.map((item) => (
            <div
              key={item.step}
              className="border-border bg-background h-full rounded-xl border p-6"
            >
              <span className="text-mint bg-forest inline-flex size-9 items-center justify-center rounded-lg text-sm font-semibold">
                {item.step}
              </span>
              <h3 className="text-forest mt-4 text-lg font-semibold">
                {item.title}
              </h3>
              <p className="text-muted mt-2 text-sm leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </StaggerReveal>

        <Notice
          title="Why the card points at us and not straight at WhatsApp"
          className="mt-8 md:max-w-3xl"
        >
          <p>
            Your card carries a Miami Roots address, not a chat invite. That
            means we can fix a broken link, change where it lands, or point it
            at a city page later &mdash; and every card already in the wild
            keeps working. A card printed today does not expire because a group
            link rotated.
          </p>
          <p>
            It also means we count taps, not people. We record that a card was
            used, whether it was a tap or a scan, and when. We don&apos;t record
            who you are, where you were, or what device you used, and we
            don&apos;t follow you around afterwards.
          </p>
        </Notice>
      </Section>

      <Section tone="surface" aria-labelledby="expectations-heading">
        <SectionHeading
          id="expectations-heading"
          eyebrow="What we ask"
          title="Invite like it's your name on it"
          description="Because it is. Everyone you bring in is someone the rest of the community will meet."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="border-border bg-background rounded-xl border p-6">
            <h3 className="text-forest text-lg font-semibold">Do</h3>
            <ul className="text-muted mt-3 space-y-2 text-sm leading-relaxed">
              <li>Invite people you&apos;d personally vouch for.</li>
              <li>Tell them what Miami Roots actually is before they tap.</li>
              <li>
                Hold the same community guidelines you&apos;re asking them to.
              </li>
              <li>
                Tell us when something isn&apos;t working &mdash; a broken card,
                a bad actor, a chat that&apos;s off.
              </li>
            </ul>
          </div>
          <div className="border-forest/25 bg-mint-100 rounded-xl border p-6">
            <h3 className="text-forest text-lg font-semibold">Don&apos;t</h3>
            <ul className="text-muted mt-3 space-y-2 text-sm leading-relaxed">
              <li>
                Mass-post the link, buy traffic, or spam unrelated group chats.
              </li>
              <li>
                Add anyone who didn&apos;t say yes, or scrape contacts to do it.
              </li>
              <li>
                Promise access, perks, money, work, or status on our behalf.
              </li>
              <li>
                Sell access to the community, or use member information for
                anything else.
              </li>
              <li>Exclude people on any basis we&apos;d be ashamed of.</li>
            </ul>
          </div>
        </div>
        <p className="text-muted mt-6 max-w-2xl text-sm leading-relaxed">
          Miami Roots can pause or retire any card, and can end anyone&apos;s
          participation. Connectors aren&apos;t employees, agents, or
          representatives, and can&apos;t enter into anything on our behalf. The{" "}
          <a href="/guidelines" className="text-forest font-medium underline">
            community guidelines
          </a>{" "}
          apply to everyone you bring in, and to you.
        </p>
      </Section>

      <Section aria-labelledby="benefits-heading">
        <SectionHeading
          id="benefits-heading"
          eyebrow="What you get"
          title="Access, not commission"
          description="An honest list of what exists now. Anything performance-based comes later, if and when we can do it properly."
        />
        <ul className="text-muted mt-8 grid gap-3 sm:grid-cols-2 md:max-w-4xl">
          {benefits.map((benefit) => (
            <li
              key={benefit}
              className="border-border bg-background rounded-lg border p-4 text-sm leading-relaxed"
            >
              {benefit}
            </li>
          ))}
        </ul>
        <p className="text-muted mt-6 max-w-2xl text-sm leading-relaxed">
          What we are not offering: equity, employment, commissions, revenue
          share, or a permanent guarantee of any of the above. We&apos;d rather
          under-promise now than walk something back later.
        </p>
      </Section>

      <Section
        tone="surface"
        aria-labelledby="nominate-heading"
        bandClassName="border-border border-t"
      >
        <SectionHeading
          id="nominate-heading"
          eyebrow="Put a name forward"
          title="Nominate yourself, or someone better"
          description="The first cohort is invited, but the invitations have to come from somewhere. Tell us who should be holding a card."
        />
        <div className="mt-6 max-w-2xl">
          <p className="text-muted text-sm leading-relaxed">
            We read every one. We can&apos;t take everyone &mdash; the cohort is
            deliberately about twenty to thirty people, and a no now is often
            just a not-yet.
          </p>
          {captureConfigured ? (
            <NominationForm />
          ) : (
            <div className="border-border bg-background mt-8 rounded-xl border p-6">
              <h3 className="text-forest text-lg font-semibold">
                Nominations aren&apos;t open on this site yet
              </h3>
              <p className="text-muted mt-2 text-sm leading-relaxed">
                We&apos;d rather say that plainly than show you a form that
                quietly goes nowhere. Until it&apos;s switched on, the way in is
                the same as it&apos;s always been: come into the General Chat
                and say who you are, or tell whoever handed you a card.
              </p>
              <ActionLink href="/join" className="mt-5">
                Join the General Chat
              </ActionLink>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
