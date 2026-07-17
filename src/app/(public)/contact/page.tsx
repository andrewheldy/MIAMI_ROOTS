import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { ArrowRightIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Choose the right Miami Roots pathway for community, organizer, venue, funding, civic, or collaboration inquiries.",
};

const inquiryTypes = [
  [
    "Join a community",
    "Start by exploring the six public community pages.",
    "/groups",
  ],
  [
    "Lead or organize",
    "Review the planned organizer approval path.",
    "/join#organizers",
  ],
  [
    "Venue or event collaboration",
    "See how a partner can make gathering easier.",
    "/partners",
  ],
  [
    "Foundation or civic inquiry",
    "Review the model, outcomes, and funding pathways.",
    "/partners#brief",
  ],
] as const;

export default function ContactPage() {
  return (
    <>
      <section className="bg-lavender py-20 sm:py-28 lg:py-36">
        <Container className="max-w-7xl">
          <p className="text-forest/55 text-xs font-semibold tracking-[0.2em] uppercase">
            Contact and inquiries
          </p>
          <h1 className="font-display text-forest mt-8 max-w-6xl text-6xl leading-[0.88] font-semibold tracking-[-0.065em] text-balance sm:text-8xl lg:text-9xl">
            Start with what you want to make possible.
          </h1>
        </Container>
      </section>

      <section className="bg-background py-24 sm:py-32">
        <Container className="grid max-w-7xl gap-5 md:grid-cols-2">
          {inquiryTypes.map(([title, description, href]) => (
            <Link
              key={title}
              href={href}
              className="border-forest/10 bg-cream hover:bg-mint-100 group rounded-[2rem] border p-8 transition-colors sm:p-10"
            >
              <div className="flex items-start justify-between gap-6">
                <h2 className="font-display text-forest text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
                  {title}
                </h2>
                <ArrowRightIcon className="text-forest mt-2 h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
              </div>
              <p className="text-muted mt-6 leading-relaxed">{description}</p>
            </Link>
          ))}
        </Container>
      </section>

      <section className="bg-forest py-24 sm:py-32">
        <Container className="max-w-4xl text-center">
          <p className="text-mint text-xs font-semibold tracking-[0.2em] uppercase">
            Direct inquiry channel
          </p>
          <h2 className="font-display text-cream mt-7 text-5xl leading-[0.95] font-semibold tracking-[-0.055em] sm:text-7xl">
            Contact details are being finalized.
          </h2>
          <p className="text-cream/65 mx-auto mt-7 max-w-2xl text-lg leading-relaxed">
            No email address, form endpoint, or partnership brief has been
            confirmed for publication. This module will become the inquiry form
            once the operating team selects and owns that channel.
          </p>
        </Container>
      </section>
    </>
  );
}
