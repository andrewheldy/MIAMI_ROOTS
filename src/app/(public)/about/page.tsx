import type { Metadata } from "next";
import Image from "next/image";

import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";
import { ArrowRightIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why Miami Roots exists and how a circle of friendships grew into a larger vision for community in Miami.",
};

const principles = [
  [
    "Belonging before features",
    "Technology should make a first hello easier, then get out of the way.",
  ],
  [
    "Communities over group chats",
    "WhatsApp is where people gather today; the relationships are what matter.",
  ],
  [
    "Action over claims",
    "Trust grows through showing up, contributing, and doing useful things together.",
  ],
  [
    "Growth with care",
    "A bigger community should also become a stronger, more generous one.",
  ],
] as const;

export default function AboutPage() {
  return (
    <>
      <section className="bg-forest overflow-hidden py-20 sm:py-28 lg:py-36">
        <Container className="relative max-w-7xl">
          <div className="relative z-10 max-w-5xl">
            <p className="text-mint text-xs font-semibold tracking-[0.2em] uppercase">
              About Miami Roots
            </p>
            <h1 className="font-display text-cream mt-8 text-6xl leading-[0.9] font-semibold tracking-[-0.065em] text-balance sm:text-8xl lg:text-[8.5rem]">
              A city becomes home through people.
            </h1>
          </div>
          <div className="about-orbit" aria-hidden="true" />
        </Container>
      </section>

      <section className="bg-cream py-24 sm:py-32 lg:py-40">
        <Container className="grid max-w-7xl gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
          <div>
            <p className="text-forest/55 text-xs font-semibold tracking-[0.2em] uppercase">
              The beginning
            </p>
          </div>
          <div>
            <p className="font-display text-forest text-4xl leading-[1.04] font-semibold tracking-[-0.045em] sm:text-6xl">
              Miami Roots grew from friendships into a larger idea: finding your
              people should not be left to chance.
            </p>
            <div className="text-muted mt-12 grid gap-7 text-lg leading-relaxed sm:grid-cols-2">
              <p>
                It started with a simple act: helping one person find another.
                What began through real introductions became a vision for a
                warmer, more useful kind of local network.
              </p>
              <p>
                The goal is not to collect contacts. It is to help people build
                genuine friendships, share opportunities, contribute locally,
                and make Miami feel like a place where they belong.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-mint-100 py-24 sm:py-32">
        <Container className="grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-center lg:gap-24">
          <div className="relative mx-auto aspect-square w-full max-w-lg overflow-hidden rounded-[3rem] shadow-[0_35px_90px_rgba(0,63,44,0.14)]">
            <Image
              src="/brand/logos/miami-roots-logo.png"
              alt="Miami Roots palm tree and roots mark"
              fill
              sizes="(max-width: 768px) 90vw, 512px"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-forest/55 text-xs font-semibold tracking-[0.2em] uppercase">
              The larger vision
            </p>
            <h2 className="font-display text-forest mt-7 text-5xl leading-[0.98] font-semibold tracking-[-0.05em] sm:text-7xl">
              Simple today. Built to grow with the community.
            </h2>
            <p className="text-muted mt-8 max-w-xl text-lg leading-relaxed">
              Miami Roots currently gathers through focused WhatsApp
              communities. Over time, the ecosystem can make room for local
              stories, volunteer action, events, partnerships, and more ways to
              strengthen Miami together. The longer-range model is a parent
              Roots network with locally operated city chapters; Miami remains
              the place where the model is being shaped first.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-background py-24 sm:py-32 lg:py-40">
        <Container className="max-w-7xl">
          <p className="text-forest/55 text-xs font-semibold tracking-[0.2em] uppercase">
            How we build
          </p>
          <div className="border-forest/15 mt-10 grid border-t md:grid-cols-2">
            {principles.map(([title, description], index) => (
              <article
                key={title}
                className="border-forest/15 border-b py-10 md:px-8 md:nth-[2n]:border-l"
              >
                <p className="text-forest/40 text-xs font-semibold tracking-[0.16em] uppercase">
                  0{index + 1}
                </p>
                <h2 className="font-display text-forest mt-12 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                  {title}
                </h2>
                <p className="text-muted mt-5 max-w-lg leading-relaxed">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section id="partner" className="bg-sun py-24 sm:py-32">
        <Container className="flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-forest/55 text-xs font-semibold tracking-[0.2em] uppercase">
              Build with us
            </p>
            <h2 className="font-display text-forest mt-7 max-w-4xl text-5xl leading-[0.98] font-semibold tracking-[-0.05em] sm:text-7xl">
              The most meaningful version of this is made together.
            </h2>
          </div>
          <ButtonLink href="/partners">
            Explore partnerships
            <ArrowRightIcon className="h-4 w-4" />
          </ButtonLink>
        </Container>
      </section>
    </>
  );
}
