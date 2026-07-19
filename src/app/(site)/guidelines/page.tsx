import type { Metadata } from "next";

import { ActionLink } from "@/components/ui/action-link";
import { Notice } from "@/components/ui/notice";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

/**
 * Provisional guidelines version. Consent records will reference a version string
 * once onboarding exists (later milestone); the value lives in Git history so the
 * exact wording a member agreed to is always recoverable. Bump on any wording
 * change.
 */
const GUIDELINES_VERSION = "0.1-draft";
const GUIDELINES_UPDATED = "2026-07-16";

export const metadata: Metadata = {
  title: "Community guidelines",
  description:
    "How members of Miami Roots treat each other — the plain expectations that keep the community worth being part of.",
};

const expectations = [
  {
    title: "Be a real participant",
    body: "Share opportunities and contribute — don't just look to extract value. Lurking to take is not the spirit of the community.",
  },
  {
    title: "Collaboration over isolation",
    body: "Help other members grow rather than treating them as competition. People do better together than alone.",
  },
  {
    title: "No transactional networking",
    body: "No cold pitching, spam, or mass-DMing members. Real relationships come before any deal.",
  },
  {
    title: "Welcome people in",
    body: "The community grows by opening the door, not by gatekeeping. No exclusionary language or behavior.",
  },
  {
    title: "Be genuine",
    body: "Skip the forced positivity and performative engagement. Real relationships beat appearances.",
  },
];

export default function GuidelinesPage() {
  return (
    <>
      <Section aria-labelledby="guidelines-heading">
        <SectionHeading
          as="h1"
          id="guidelines-heading"
          eyebrow="Trust"
          title="Community guidelines"
          description="Miami Roots works because of how members treat each other. These expectations come straight from what the community is for — real relationships and real opportunities, together."
        />
        <p className="text-muted mt-4 text-sm">
          Version {GUIDELINES_VERSION} · Last updated {GUIDELINES_UPDATED} ·
          Provisional, pending an owner review.
        </p>

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {expectations.map((item) => (
            <li
              key={item.title}
              className="border-border bg-background rounded-xl border p-6"
            >
              <h2 className="text-forest text-lg font-semibold">
                {item.title}
              </h2>
              <p className="text-muted mt-2 text-sm leading-relaxed">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="surface" aria-labelledby="group-rules-heading">
        <SectionHeading
          id="group-rules-heading"
          title="A few group-specific rules"
          description="Most groups share the same norms. A few carry an extra rule worth calling out."
        />
        <div className="mt-8 grid gap-4 md:max-w-3xl">
          <Notice
            title="Nightlife & Event Marketing: no ticket reselling"
            tone="caution"
          >
            <p>
              That group is for promotion and collaboration, not resale.
              Reselling tickets there isn&apos;t allowed. If you buy or sell
              tickets anywhere in the wider community, treat it carefully:
              confirm a ticket is legitimate, confirm who you&apos;re dealing
              with when it matters, take extra care with events that require
              matching ID, and be skeptical of unknown or anonymous business
              profiles. Miami Roots is a community, not a marketplace — it
              doesn&apos;t vet sellers or guarantee any transaction.
            </p>
          </Notice>
          <Notice title="Ticket Exchange: verify before you pay" tone="caution">
            <p>
              Ticket Exchange is a peer-to-peer space between members — Miami
              Roots connects you, it doesn&apos;t vet tickets or hold funds.
              Verify the seller&apos;s identity and that they own the ticket,
              ask for proof of purchase with sensitive details hidden, confirm
              the ticket can be transferred through the original platform, and
              use a payment method with buyer protection where possible. Never
              share passwords or verification codes, and avoid deposits for
              tickets you can&apos;t independently verify. Miami Roots does not
              guarantee tickets, buyers, sellers, or transactions. Report
              anything suspicious to the admins.
            </p>
          </Notice>
          <Notice title="Sober Social: social, not clinical" tone="info">
            <p>
              Sober Social is a peer social space for enjoying Miami&apos;s
              social life sober. It is not a treatment, therapy, or recovery
              service, and isn&apos;t run or moderated as one.
            </p>
          </Notice>
        </div>
      </Section>

      <Section aria-labelledby="data-heading">
        <SectionHeading
          id="data-heading"
          title="How your data is treated"
          description="Miami Roots does not sell, rent, or share member data with partners. Any information you share serves the community's own operations — nothing else."
        />
        <div className="mt-6">
          <ActionLink href="/groups">Explore the community</ActionLink>
        </div>
      </Section>
    </>
  );
}
