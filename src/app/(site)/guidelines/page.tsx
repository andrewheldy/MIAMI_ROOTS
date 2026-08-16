import type { Metadata } from "next";
import Link from "next/link";

import { MotionReveal } from "@/components/motion/motion-reveal";
import { JoinAction } from "@/components/ui/join-action";
import { Notice } from "@/components/ui/notice";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

/**
 * Provisional guidelines version. Consent records will reference a version string
 * once onboarding exists (later milestone); the value lives in Git history so the
 * exact wording a member agreed to is always recoverable. Bump on any wording
 * change. 0.2-draft is the community-first rewrite of 2026-08-16: the rules
 * themselves are unchanged in substance, the wording is plainer.
 */
const GUIDELINES_VERSION = "0.2-draft";
const GUIDELINES_UPDATED = "2026-08-16";

export const metadata: Metadata = {
  title: "House rules",
  description:
    "How members of Miami Roots treat each other. The plain expectations that keep this community worth being part of.",
};

const expectations = [
  {
    title: "Be a real participant",
    body: "Share things, answer things, show up. Reading quietly for a while is fine. Only ever taking is not.",
  },
  {
    title: "Collaboration over isolation",
    body: "Help other members grow instead of treating them as competition. Everybody here does better with company.",
  },
  {
    title: "No transactional networking",
    body: "No cold pitching, no spam, no mass-DMing members. The relationship comes before the deal, every time.",
  },
  {
    title: "Welcome people in",
    body: "This grows by opening the door, not by guarding it. No exclusionary language, no gatekeeping.",
  },
  {
    title: "Be genuine",
    body: "Skip the forced positivity and the performance. People can tell, and the real version works better anyway.",
  },
];

export default function GuidelinesPage() {
  return (
    <>
      <Section aria-labelledby="guidelines-heading">
        <MotionReveal className="max-w-2xl">
          <h1
            id="guidelines-heading"
            className="text-display text-forest font-bold text-balance"
          >
            House rules
          </h1>
          <p className="text-lede text-muted mt-6 max-w-[54ch] text-pretty">
            Five of them, and none will surprise you. They exist because this
            only works if people treat each other like neighbors rather than
            like an audience.
          </p>
          <p className="text-muted mt-4 text-sm">
            Version {GUIDELINES_VERSION} · Last updated {GUIDELINES_UPDATED} ·
            Provisional, pending an owner review.
          </p>
        </MotionReveal>

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
        <MotionReveal>
          <SectionHeading
            id="group-rules-heading"
            title="Three rooms carry an extra rule"
            description="Most rooms share the same norms. These three have one more worth reading before you post."
          />
        </MotionReveal>
        <div className="mt-8 grid gap-4 md:max-w-3xl">
          <Notice
            title="Nightlife & Event Marketing: no ticket reselling"
            tone="caution"
          >
            <p>
              That room is for promotion and collaboration, not resale.
              Reselling tickets there is not allowed. If you buy or sell tickets
              anywhere in the wider community, treat it carefully: confirm a
              ticket is legitimate, confirm who you are dealing with when it
              matters, take extra care with events that require matching ID, and
              be skeptical of unknown or anonymous business profiles. Miami
              Roots is a community, not a marketplace, and it does not vet
              sellers or guarantee any transaction.
            </p>
          </Notice>
          <Notice title="Ticket Exchange: verify before you pay" tone="caution">
            <p>
              Ticket Exchange is a peer-to-peer space between members. Miami
              Roots connects you and nothing more: it does not vet tickets or
              hold funds. Verify the seller&apos;s identity and that they own
              the ticket, ask for proof of purchase with sensitive details
              hidden, confirm the ticket can be transferred through the original
              platform, and use a payment method with buyer protection where
              possible. Never share passwords or verification codes, and avoid
              deposits for tickets you cannot independently verify. Miami Roots
              does not guarantee tickets, buyers, sellers, or transactions.
              Report anything suspicious to the admins.
            </p>
          </Notice>
          <Notice title="Sober Social: social, not clinical" tone="info">
            <p>
              Sober Social is a peer social space for enjoying Miami&apos;s
              social life sober. It is not a treatment, therapy, or recovery
              service, and is not run or moderated as one.
            </p>
          </Notice>
        </div>
      </Section>

      <Section aria-labelledby="data-heading">
        <MotionReveal className="max-w-2xl">
          <h2
            id="data-heading"
            className="text-title text-forest font-bold text-balance"
          >
            What happens with your information
          </h2>
          <p className="text-muted mt-4 leading-relaxed">
            Miami Roots does not sell, rent, or share member data with partners.
            Anything you share serves the running of this community and nothing
            else.
          </p>
          <div className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <JoinAction block />
            <Link
              href="/groups"
              className="text-forest inline-flex min-h-12 items-center text-base font-semibold underline underline-offset-4 hover:no-underline"
            >
              See the rooms first
            </Link>
          </div>
        </MotionReveal>
      </Section>
    </>
  );
}
