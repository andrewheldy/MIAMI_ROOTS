/**
 * The `/join` hub's chat-link registry: which community chats are reachable
 * through the controlled `/go/<slug>` redirect routes, and which server-only
 * environment variable holds each destination.
 *
 * Hard rules (enforced by `tests/unit/chat-links.test.ts`):
 *   - NO invite URLs here, ever. This module maps names only; real WhatsApp
 *     invite links live exclusively in server environment variables so they
 *     stay out of Git history and can be rotated without a code change
 *     (see `docs/05-operations/chat-link-management.md`).
 *   - Ticket Exchange stays excluded (out of scope, `docs/01-product/out-of-scope.md`).
 *   - `redirectSlug` and `envVar` are a public contract (printed on flyers,
 *     configured in hosting) — stable once shipped, even where they differ
 *     from the content model's group slug (e.g. `sober-support` vs the
 *     `sober-social` group; open question #10 covers group naming).
 */

export interface ChatLink {
  /** URL segment under `/go/` — the shareable, permanent redirect path. */
  readonly redirectSlug: string;
  /** Slug of the group in `src/content/groups/` supplying name, copy, logo. */
  readonly groupSlug: string;
  /** Server-only environment variable holding the current invite URL. */
  readonly envVar: string;
  /** Marks the recommended starting chat, badged on the hub. */
  readonly featured?: boolean;
}

/** Hub display order. General Chat leads as the recommended starting point. */
export const chatLinks: readonly ChatLink[] = [
  {
    redirectSlug: "general-chat",
    groupSlug: "general-chat",
    envVar: "WHATSAPP_GENERAL_CHAT_URL",
    featured: true,
  },
  {
    redirectSlug: "business-connections",
    groupSlug: "business-and-connections",
    envVar: "WHATSAPP_BUSINESS_CONNECTIONS_URL",
  },
  {
    redirectSlug: "daytime-events",
    groupSlug: "daytime-events",
    envVar: "WHATSAPP_DAYTIME_EVENTS_URL",
  },
  {
    redirectSlug: "nightlife-events",
    groupSlug: "nightlife-and-event-marketing",
    envVar: "WHATSAPP_NIGHTLIFE_EVENTS_URL",
  },
  {
    redirectSlug: "community-organizing",
    groupSlug: "community-organizing",
    envVar: "WHATSAPP_COMMUNITY_ORGANIZING_URL",
  },
  {
    redirectSlug: "sober-support",
    groupSlug: "sober-social",
    envVar: "WHATSAPP_SOBER_SUPPORT_URL",
  },
];

/**
 * The main Miami Roots WhatsApp Community entrance — the front door that adds
 * a visitor to the community container itself rather than to one subgroup.
 * It is not a `ChatLink` (it has no group content record); it exists so the
 * site has exactly one canonical way to reach "the community as a whole":
 * flyers/QR codes point at `/go/community`, and the `/go` unavailable state
 * can offer it as a working fallback when a subgroup link is down.
 * The invite URL itself lives only in the server environment, like every
 * other destination in this module.
 */
export const communityEntrance = {
  /** Public display name for redirect-gate states. Not a WhatsApp transcript. */
  name: "Miami Roots Community",
  redirectSlug: "community",
  envVar: "WHATSAPP_COMMUNITY_URL",
} as const;

export type CommunityEntrance = typeof communityEntrance;

/** Look up a chat link by its `/go/` redirect slug. */
export function getChatLinkByRedirectSlug(slug: string): ChatLink | undefined {
  return chatLinks.find((link) => link.redirectSlug === slug);
}

/**
 * Look up the chat link serving a content-model group slug, for surfaces that
 * start from a group record (e.g. the `/groups/[slug]` join CTA) and need the
 * canonical `/go/` path. Returns undefined for groups with no public chat.
 */
export function getChatLinkByGroupSlug(
  groupSlug: string,
): ChatLink | undefined {
  return chatLinks.find((link) => link.groupSlug === groupSlug);
}
