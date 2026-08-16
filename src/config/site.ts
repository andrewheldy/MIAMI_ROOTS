/**
 * Central, provisional site configuration for the Miami Roots gateway.
 *
 * Copy here is PROVISIONAL. It has not been through an owner voice pass
 * (open question #9), and it deliberately avoids presenting unratified brand
 * copy (such as the "Together We Rise" tagline on the banner concept) as
 * finalized. Rewritten 2026-08-16 for the community-first pass: the site's
 * subject is now the one community, not a directory of chats.
 */
export const siteConfig = {
  name: "Miami Roots",
  /** Short, factual description grounded in docs/00-context/project-brief.md. */
  description:
    "One WhatsApp community for Miami, with a room for every part of life in the city. Join once, find your people, bring a friend.",
  /** Canonical public URL; falls back to localhost for local development. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export type SiteConfig = typeof siteConfig;
