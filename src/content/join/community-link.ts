/**
 * The parent WhatsApp Community invite — the one destination the whole site
 * points at.
 *
 * This is deliberately a SEPARATE registry from `chat-links.ts`. Those entries
 * map a published community group to its own chat; this one maps nothing to a
 * group at all. It is the front door to the WhatsApp Community that contains
 * every room, and it is the only WhatsApp destination the public UI links to
 * (owner decision 2026-08-16: visitors join the community, not individual
 * chats).
 *
 * Hard rules, identical to the per-chat links and enforced by
 * `tests/unit/community-link.test.ts`:
 *   - NO invite URL here, ever. The real link lives only in the server-side
 *     `WHATSAPP_COMMUNITY_URL` environment variable so it stays out of Git
 *     history and can be rotated without a code change. See
 *     `docs/05-operations/chat-link-management.md`.
 *   - `redirectSlug` is a public contract. `/go/community` is printed on cards,
 *     encoded in QR codes, and pasted into messages, so it is permanent once
 *     shipped.
 *   - The value is validated against the approved WhatsApp hosts by
 *     `resolveChatDestination` before any redirect happens, exactly like the
 *     per-chat links. An unset or invalid value shows an honest unavailable
 *     state; it never sends a visitor somewhere unverified.
 */

export interface CommunityInvite {
  /** URL segment under `/go/` — the shareable, permanent redirect path. */
  readonly redirectSlug: string;
  /** Server-only environment variable holding the current invite URL. */
  readonly envVar: string;
}

export const communityInvite: CommunityInvite = {
  redirectSlug: "community",
  envVar: "WHATSAPP_COMMUNITY_URL",
};

/**
 * The canonical path for the site's single call to action. Every "join"
 * control resolves through here rather than hand-building the string, so the
 * destination can never drift between the header, the hero, and the footer.
 */
export const COMMUNITY_GO_PATH = `/go/${communityInvite.redirectSlug}`;

/** True when a `/go/<slug>` request is for the parent community, not a chat. */
export function isCommunityRedirectSlug(slug: string): boolean {
  return slug === communityInvite.redirectSlug;
}
