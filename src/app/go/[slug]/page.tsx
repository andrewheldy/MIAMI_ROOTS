import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getGroupBySlug } from "@/content/groups";
import {
  communityEntrance,
  getChatLinkByRedirectSlug,
} from "@/content/join/chat-links";
import { resolveChatDestination } from "@/lib/chat-redirect";

interface GoPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Controlled redirect gate for WhatsApp chat links. The destination lives only
 * in a server environment variable, resolved per-request so admins can rotate
 * an invite link without a rebuild — hence `force-dynamic`, never prerendered.
 *
 * Two kinds of slug resolve here, both from the canonical registry in
 * `src/content/join/chat-links.ts` (never from a query parameter):
 *   - a subgroup chat link (`/go/general-chat`, …), and
 *   - the main community entrance (`/go/community`).
 * Anything else is a real 404.
 */
export const dynamic = "force-dynamic";

/** Registry-resolved display info for a `/go` slug, or null for unknown slugs. */
function resolveGate(slug: string): {
  name: string;
  envVar: string;
} | null {
  if (slug === communityEntrance.redirectSlug) {
    return { name: communityEntrance.name, envVar: communityEntrance.envVar };
  }
  const chat = getChatLinkByRedirectSlug(slug);
  const group = chat && getGroupBySlug(chat.groupSlug);
  if (!chat || !group) {
    return null;
  }
  return { name: group.name, envVar: chat.envVar };
}

export async function generateMetadata({
  params,
}: GoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const gate = resolveGate(slug);
  return {
    title: gate ? `Opening ${gate.name}` : "Chat link",
    // Redirect gates carry no content worth indexing, and search results
    // pointing at them would outlive link rotations confusingly.
    robots: { index: false, follow: false },
  };
}

export default async function GoPage({ params }: GoPageProps) {
  const { slug } = await params;
  const gate = resolveGate(slug);
  if (!gate) {
    notFound();
  }

  const destination = resolveChatDestination(process.env[gate.envVar]);
  if (destination.ok) {
    redirect(destination.url);
  }

  // Never log the configured value itself — treat it as a credential even
  // when malformed. The reason is enough to diagnose configuration.
  if (destination.reason === "invalid") {
    console.warn(
      `Chat redirect "${slug}": ${gate.envVar} is set but is not an approved HTTPS WhatsApp URL; showing the unavailable state.`,
    );
  }

  // Offer the main community entrance as a working fallback — but only when
  // its own link actually resolves, and never from its own unavailable state.
  const communityFallbackAvailable =
    slug !== communityEntrance.redirectSlug &&
    resolveChatDestination(process.env[communityEntrance.envVar]).ok;

  return (
    <main
      id="main"
      className="bg-surface flex flex-1 items-center justify-center px-4 py-16"
    >
      <div className="border-border bg-background w-full max-w-md rounded-2xl border p-8 text-center">
        <Image
          src="/brand/logos/miami-roots-logo.png"
          alt=""
          width={64}
          height={64}
          className="mx-auto h-16 w-16 rounded-xl"
        />
        <h1 className="text-forest mt-5 text-2xl font-bold tracking-tight">
          {gate.name} isn&apos;t open right now
        </h1>
        <p className="text-muted mt-3 text-base leading-relaxed">
          This chat link is being updated. Check back soon — the rest of the
          Miami Roots communities are one tap away.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3">
          {communityFallbackAvailable ? (
            <a
              href={`/go/${communityEntrance.redirectSlug}`}
              className="bg-forest text-background hover:bg-forest-600 inline-flex min-h-12 w-full items-center justify-center rounded-lg px-5 text-sm font-semibold transition-colors"
            >
              Join the main Miami Roots community
            </a>
          ) : null}
          <Link
            href="/join"
            className={
              communityFallbackAvailable
                ? "border-border text-forest hover:border-forest/40 hover:bg-surface inline-flex min-h-12 w-full items-center justify-center rounded-lg border px-5 text-sm font-medium transition-colors"
                : "bg-forest text-background hover:bg-forest-600 inline-flex min-h-12 w-full items-center justify-center rounded-lg px-5 text-sm font-semibold transition-colors"
            }
          >
            See all the chats
          </Link>
          <Link
            href="/"
            className="border-border text-forest hover:border-forest/40 hover:bg-surface inline-flex min-h-12 w-full items-center justify-center rounded-lg border px-5 text-sm font-medium transition-colors"
          >
            Visit the full website
          </Link>
        </div>
      </div>
    </main>
  );
}
