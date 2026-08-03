import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { resolveConnectorLanding } from "@/lib/connectors/destination";
import { recordConnectorScan } from "@/lib/connectors/scan-events";

interface ConnectorRedirectPageProps {
  params: Promise<{ code: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * The tracked Founding Connector redirect: the URL printed on every NFC card
 * and QR code (`myroots.dev/r/<code>`).
 *
 * Architecture notes, and why this file is nearly empty:
 *
 *  - **Miami Roots owns the link.** The card encodes this route, never a
 *    WhatsApp invite. That is what lets the destination change, links rotate,
 *    and campaigns re-point without touching a card already in someone's
 *    wallet.
 *  - **All decisions live in `@/lib/connectors/destination`**, which is pure
 *    and fully unit-tested (unknown codes, disabled cards, unsafe
 *    destinations, parameter handling). This file only executes the result —
 *    the same split `/go/[slug]` uses.
 *  - **Open redirects are impossible by construction:** the resolver returns
 *    an internal path assembled from a closed union of internal targets. No
 *    string from the request ever reaches the redirect target.
 *  - **Never prerendered.** `force-dynamic` because the destination is
 *    resolved per request (and, once the registry moves into the database, per
 *    row) so an owner can re-point a card without a rebuild.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Opening Miami Roots",
    // A redirect gate has nothing worth indexing, and an indexed connector
    // code would outlive the card it was printed on.
    robots: { index: false, follow: false },
  };
}

export default async function ConnectorRedirectPage({
  params,
  searchParams,
}: ConnectorRedirectPageProps) {
  const [{ code }, query] = await Promise.all([params, searchParams]);

  const incoming = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    const first = Array.isArray(value) ? value[0] : value;
    if (typeof first === "string") {
      incoming.set(key, first);
    }
  }

  const resolution = resolveConnectorLanding({ rawCode: code, incoming });

  if (resolution.outcome === "not_found") {
    // A code nobody issued gets the site's real 404. Inventing a landing page
    // for it would credit a fiction and make guessing codes look successful.
    notFound();
  }

  // Recorded before the redirect throws. Never throws, never blocks longer
  // than its own timeout, and no-ops entirely when no database is configured.
  await recordConnectorScan({
    code: resolution.code,
    source: resolution.source,
    credited: resolution.outcome === "credited",
    campaign: incoming.get("utm_campaign") ?? undefined,
  });

  // A paused or retired card still opens the community door — a real person is
  // standing there holding a real card — it simply credits nobody.
  redirect(resolution.landingPath);
}
