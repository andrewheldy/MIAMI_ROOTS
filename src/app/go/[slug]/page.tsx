import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { SafetyBadge } from "@/components/ui/safety-badge";
import { getGroupBySlug } from "@/content/groups";
import { getChatLinkByRedirectSlug } from "@/content/join/chat-links";
import {
  communityInvite,
  isCommunityRedirectSlug,
} from "@/content/join/community-link";
import { resolveChatDestination } from "@/lib/chat-redirect";

interface GoPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Controlled redirect gate for WhatsApp links. The destination lives only in a
 * server environment variable, resolved per-request so admins can rotate an
 * invite link without a rebuild, hence `force-dynamic`, never prerendered.
 *
 * Two kinds of link pass through here:
 *   - `/go/community` sends visitors to the parent WhatsApp Community. This is
 *     the site's one call to action and the only one the UI links to.
 *   - `/go/<chat>` still resolves every per-chat link, because those paths were
 *     printed on cards and pasted into messages before the 2026-08-16 redesign
 *     and must keep working. Nothing on the site points at them any more.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: GoPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (isCommunityRedirectSlug(slug)) {
    return {
      title: "Opening the Miami Roots community",
      robots: { index: false, follow: false },
    };
  }
  const chat = getChatLinkByRedirectSlug(slug);
  const group = chat && getGroupBySlug(chat.groupSlug);
  return {
    title: group ? `Opening ${group.name}` : "Chat link",
    // Redirect gates carry no content worth indexing, and search results
    // pointing at them would outlive link rotations confusingly.
    robots: { index: false, follow: false },
  };
}

/**
 * Never log the configured value itself. Treat it as a credential even when
 * malformed; the reason is enough to diagnose configuration.
 */
function warnInvalid(label: string, envVar: string) {
  console.warn(
    `Redirect "${label}": ${envVar} is set but is not an approved HTTPS WhatsApp URL; showing the unavailable state.`,
  );
}

export default async function GoPage({ params }: GoPageProps) {
  const { slug } = await params;

  if (isCommunityRedirectSlug(slug)) {
    const destination = resolveChatDestination(
      process.env[communityInvite.envVar],
    );
    if (destination.ok) {
      redirect(destination.url);
    }
    if (destination.reason === "invalid") {
      warnInvalid(communityInvite.redirectSlug, communityInvite.envVar);
    }
    return (
      <UnavailableShell
        heading="The door is being rekeyed"
        body="The invite link for the Miami Roots community is being refreshed right now. Try again shortly, or read what the community is about while you wait."
      />
    );
  }

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
  if (destination.reason === "invalid") {
    warnInvalid(chat.redirectSlug, chat.envVar);
  }

  return (
    <UnavailableShell
      heading={`${group.name} isn't open right now`}
      body="This chat link is being updated. Everyone joins through the main Miami Roots community now, and every room lives inside it."
      safety={
        group.safety ? (
          <div className="border-forest/15 bg-surface mt-5 rounded-xl border p-4 text-left">
            <SafetyBadge label={group.safety.badge} />
            <p className="text-muted mt-2 text-sm leading-relaxed">
              {group.safety.summary} Miami Roots does not guarantee tickets,
              buyers, sellers, or transactions.
            </p>
          </div>
        ) : null
      }
    />
  );
}

/**
 * The honest unavailable state, shared by both link kinds. It never pretends a
 * link exists and always offers two real ways forward.
 */
function UnavailableShell({
  heading,
  body,
  safety,
}: {
  heading: string;
  body: string;
  safety?: React.ReactNode;
}) {
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
          {heading}
        </h1>
        <p className="text-muted mt-3 text-base leading-relaxed">{body}</p>
        {safety}
        <div className="mt-6 flex flex-col items-center gap-3">
          <Link
            href="/join"
            className="bg-forest text-background hover:bg-forest-600 inline-flex min-h-12 w-full items-center justify-center rounded-lg px-5 text-sm font-semibold transition-colors"
          >
            Back to the front door
          </Link>
          <Link
            href="/"
            className="border-border text-forest hover:border-forest/40 hover:bg-surface inline-flex min-h-12 w-full items-center justify-center rounded-lg border px-5 text-sm font-medium transition-colors"
          >
            What Miami Roots is
          </Link>
        </div>
      </div>
    </main>
  );
}
