import Image from "next/image";

import { Container } from "@/components/layout/container";

export default function HomePage() {
  return (
    <Container className="py-16 sm:py-24">
      <div className="flex flex-col items-start gap-8">
        <Image
          src="/brand/logos/miami-roots-logo.png"
          alt="Miami Roots logo: a palm tree growing from a WhatsApp speech bubble, rooted into the ground"
          width={112}
          height={112}
          priority
          className="h-24 w-24 rounded-2xl sm:h-28 sm:w-28"
        />

        <div className="max-w-2xl space-y-5">
          <h1 className="text-forest text-4xl font-bold tracking-tight sm:text-5xl">
            A community rooted in Miami
          </h1>
          <p className="text-muted text-lg leading-relaxed">
            Miami Roots connects people across business, nightlife, wellness,
            volunteering, sober socializing, and everyday life — helping
            neighbors build real relationships and share real opportunities.
          </p>
          <p className="text-muted text-base leading-relaxed">
            The community currently comes together through WhatsApp. This is the
            beginning of its home on the web.
          </p>
        </div>

        <p className="border-border bg-surface text-muted rounded-lg border px-4 py-3 text-sm">
          Membership and the community directory are coming soon.
        </p>
      </div>
    </Container>
  );
}
