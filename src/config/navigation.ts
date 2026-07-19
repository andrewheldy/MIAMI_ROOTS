/**
 * The single source of truth for primary site navigation, shared by the desktop
 * header, the mobile menu, and the footer so the links can never drift apart.
 *
 * The join CTA is kept separate from the ordinary links because it is the site's
 * dominant conversion action and is styled as the one filled control everywhere
 * it appears. "Home" is mobile-only — on desktop the logo is the route home, so
 * a redundant Home link would only clutter the bar.
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
  { href: "/groups", label: "Explore the groups", desktopLabel: "Groups" },
  { href: "/guidelines", label: "Community guidelines" },
];

/** The dominant conversion CTA — the shareable community hub. */
export const joinNavLink = {
  href: "/join",
  label: "Join the community chats",
} as const;

/** Links shown inline in the desktop header (Home is mobile-only). */
export const desktopNavLinks: readonly NavLink[] = mainNavLinks.filter(
  (link) => link.showOnDesktop !== false,
);
