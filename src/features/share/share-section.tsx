import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";

import { ShareLauncher } from "./share-launcher";

/**
 * The homepage "grow the roots" prompt: an invitation to share Miami Roots that
 * sits in the emotional flow after the trust section and before the final CTA,
 * without competing with the hero. A mint-tinted panel keeps it native to the
 * brand palette; its two actions open the share card and the full-screen QR.
 * Server Component — only the small `ShareLauncher` island is client code.
 */
export function ShareSection() {
  return (
    <section aria-labelledby="share-heading" className="py-12 sm:py-16">
      <Container>
        <div className="border-mint/50 bg-mint-100 rounded-2xl border px-6 py-10 sm:px-12">
          <SectionHeading
            id="share-heading"
            eyebrow="Grow the roots"
            title="Miami is better when your people are here."
            description="Know someone who should be part of Miami Roots? Save your personal share card, post it to your story, or let someone scan your screen."
          />
          <ShareLauncher
            className="mt-6"
            triggers={[
              {
                label: "Get Your Share Card",
                target: "card",
                variant: "primary",
              },
              {
                label: "Show My QR Code",
                target: "fullscreen",
                variant: "secondary",
              },
            ]}
          />
        </div>
      </Container>
    </section>
  );
}
