/**
 * The chat-link registry and the single, centralized resolver from a public
 * group to its controlled `/go/<slug>` redirect route. This is the one place
 * that maps a community group to the server-only environment variable holding
 * its WhatsApp invite — group cards, detail pages, the homepage, `/join`, and
 * the tests all resolve routes through here rather than each keeping its own map.
 *
 * Hard rules (enforced by `tests/unit/chat-links.test.ts`):
 *   - NO invite URLs here, ever. This module maps names only; real WhatsApp
 *     invite links live exclusively in server environment variables so they
 *     stay out of Git history and can be rotated without a code change
 *     (see `docs/05-operations/chat-link-management.md`).
 *   - Every published group must have exactly one chat link (Ticket Exchange
 *     was approved as the seventh community — decision log 2026-07-19).
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

/**
 * Hub display order. General Chat leads as the recommended starting point;
 * Ticket Exchange sits with the event-oriented communities (after Nightlife),
 * never displacing General Chat as the front door.
 */
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
    redirectSlug: "ticket-exchange",
    groupSlug: "ticket-exchange",
    envVar: "WHATSAPP_TICKET_EXCHANGE_URL",
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

/** group slug → chat link, built once. Group slugs are unique, so is this map. */
const byGroupSlug: ReadonlyMap<string, ChatLink> = new Map(
  chatLinks.map((link) => [link.groupSlug, link]),
);

/** Look up a chat link by its `/go/` redirect slug. */
export function getChatLinkByRedirectSlug(slug: string): ChatLink | undefined {
  return chatLinks.find((link) => link.redirectSlug === slug);
}

/** Look up the chat link for a content-model group slug. */
export function getChatLinkByGroupSlug(
  groupSlug: string,
): ChatLink | undefined {
  return byGroupSlug.get(groupSlug);
}

/**
 * The controlled `/go/<slug>` path for a group, or `undefined` when the group
 * has no chat mapping. This is the canonical way UI resolves a group's chat
 * route — never hand-build `/go/...` strings elsewhere.
 */
export function getGoPath(groupSlug: string): string | undefined {
  const link = byGroupSlug.get(groupSlug);
  return link ? `/go/${link.redirectSlug}` : undefined;
}
