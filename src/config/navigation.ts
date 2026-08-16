import { COMMUNITY_GO_PATH } from "@/content/join/community-link";

/**
 * The single source of truth for primary site navigation, shared by the desktop
 * header, the mobile menu, and the footer so the links can never drift apart.
 *
 * The join CTA is kept separate from the ordinary links because it is the site's
 * one conversion action. Since 2026-08-16 it points at `/go/community`, the
 * parent WhatsApp Community, and carries the same label everywhere it appears.
 * One intent, one label, one destination: the header, the hero, the close of
 * every page, and the mobile sheet all render this exact object.
 *
 * "Home" is mobile-only. On desktop the logo is the route home, so a redundant
 * Home link would only clutter the bar.
 */

export interface NavLink {
  /** Internal route. */
  readonly href: string;
  /** Label used in the mobile menu (and desktop, unless `desktopLabel` is set). */
  readonly label: string;
  /** Shorter label for the tighter desktop bar, when it differs. */
  readonly desktopLabel?: string;
  /** Whether the link appears in the horizontal desktop nav. Defaults to true. */
  readonly showOnDesktop?: boolean;
}

/** Ordinary navigation links, in display order. */
export const mainNavLinks: readonly NavLink[] = [
  { href: "/", label: "Home", showOnDesktop: false },
  { href: "/groups", label: "The rooms inside", desktopLabel: "The rooms" },
  { href: "/guidelines", label: "House rules" },
  { href: "/invite", label: "Invite a friend", desktopLabel: "Invite" },
];

/**
 * The one conversion CTA: the parent WhatsApp Community.
 *
 * `external` marks that following it leaves the site for WhatsApp, so surfaces
 * can say so honestly next to the button instead of surprising people.
 */
export const joinNavLink = {
  href: COMMUNITY_GO_PATH,
  label: "Join the community",
  external: true,
} as const;

/** Links shown inline in the desktop header (Home is mobile-only). */
export const desktopNavLinks: readonly NavLink[] = mainNavLinks.filter(
  (link) => link.showOnDesktop !== false,
);
