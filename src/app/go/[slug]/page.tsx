import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { SafetyBadge } from "@/components/ui/safety-badge";
import { getGroupBySlug } from "@/content/groups";
import { getChatLinkByRedirectSlug } from "@/content/join/chat-links";
import { resolveChatDestination } from "@/lib/chat-redirect";

interface GoPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Controlled redirect gate for WhatsApp chat links. The destination lives only
 * in a server environment variable, resolved per-request so admins can rotate
 * an invite link without a rebuild — hence `force-dynamic`, never prerendered.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: GoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const chat = getChatLinkByRedirectSlug(slug);
  const group = chat && getGroupBySlug(chat.groupSlug);
  return {
    title: group ? `Opening ${group.name}` : "Chat link",
    // Redirect gates carry no content worth indexing, and search results
    // pointing at them would outlive link rotations confusingly.
    robots: { index: false, follow: false },
  };
}

export default async function GoPage({ params }: GoPageProps) {
  const { slug } = await params;
  const chat = getChatLinkByRedirectSlug(slug);
  if (!chat) {
    notFound();
  }
  const group = getGroupBySlug(chat.groupSlug);
  if (!group) {
    notFound();
  }

  const destination = resolveChatDestination(process.env[chat.envVar]);
  if (destination.ok) {
    redirect(destination.url);
  }

  // Never log the configured value itself — treat it as a credential even
  // when malformed. The reason is enough to diagnose configuration.
  if (destination.reason === "invalid") {
    console.warn(
      `Chat redirect "${chat.redirectSlug}": ${chat.envVar} is set but is not an approved HTTPS WhatsApp URL; showing the unavailable state.`,
    );
  }

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
          {group.name} isn&apos;t open right now
        </h1>
        <p className="text-muted mt-3 text-base leading-relaxed">
          This chat link is being updated. Check back soon — the rest of the
          Miami Roots communities are one tap away.
        </p>
        {group.safety ? (
          <div className="border-forest/15 bg-surface mt-5 rounded-xl border p-4 text-left">
            <SafetyBadge label={group.safety.badge} />
            <p className="text-muted mt-2 text-sm leading-relaxed">
              {group.safety.summary} Miami Roots does not guarantee tickets,
              buyers, sellers, or transactions.
            </p>
          </div>
        ) : null}
        <div className="mt-6 flex flex-col items-center gap-3">
          <Link
            href="/join"
            className="bg-forest text-background hover:bg-forest-600 inline-flex min-h-12 w-full items-center justify-center rounded-lg px-5 text-sm font-semibold transition-colors"
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
