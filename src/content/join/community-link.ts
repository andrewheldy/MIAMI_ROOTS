/**
 * The parent WhatsApp Community invite — the one destination the whole site
 * points at.
 *
 * This is deliberately a SEPARATE registry from `chat-links.ts`. Those entries
 * map a published community group to its own chat and still resolve their
 * destination from a server environment variable at request time. This one maps
 * nothing to a group at all: it is the front door to the WhatsApp Community that
 * contains every room, and it is the only WhatsApp destination the public UI
 * links to (owner decision 2026-08-16).
 *
 * **The destination is static, on purpose** (owner decision 2026-08-17). It used
 * to be read from a `WHATSAPP_COMMUNITY_URL` environment variable, which meant
 * that a deployment missing that variable showed an "unavailable" page instead
 * of opening the community. For the site's single call to action, a value that
 * can go missing in configuration is a worse failure than a value that lives in
 * Git. The seven per-chat links keep the environment-variable architecture,
 * which still buys them rotation without a deploy.
 *
 * What this costs, stated plainly so nobody has to rediscover it:
 *   - The community invite is public in this repository and in its history.
 *     It was already public on cards, flyers, and QR codes, so this widens the
 *     audience rather than creating exposure, but rotating it now means editing
 *     this file and deploying, and the old value stays in Git history.
 *
 * What still holds:
 *   - `redirectSlug` is a public contract. `/go/community` is printed on cards,
 *     encoded in QR codes, and pasted into messages, so it is permanent.
 *   - Every public call to action points at `/go/community`, never at
 *     `chat.whatsapp.com` directly, so the destination can be changed in one
 *     place without invalidating anything already in the world.
 *   - The URL below must stay an `https://` URL on an approved WhatsApp host.
 *     `tests/unit/community-link.test.ts` runs it through the same
 *     `resolveChatDestination` allowlist the per-chat links use, so a typo or a
 *     hostile edit fails the build rather than redirecting somebody off-site.
 */

/**
 * The canonical Miami Roots WhatsApp Community invite. Change it here and
 * nowhere else; every surface resolves through `/go/community`.
 */
export const MIAMI_ROOTS_COMMUNITY_URL =
  "https://chat.whatsapp.com/CmU2plRQshq9h9k11B6ywS";

export interface CommunityInvite {
  /** URL segment under `/go/` — the shareable, permanent redirect path. */
  readonly redirectSlug: string;
  /** The current WhatsApp Community destination. Known at build time. */
  readonly url: string;
}

export const communityInvite: CommunityInvite = {
  redirectSlug: "community",
  url: MIAMI_ROOTS_COMMUNITY_URL,
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
