/**
 * Central, provisional site configuration for the Miami Roots gateway shell.
 *
 * Copy here is intentionally minimal and PROVISIONAL — it has not been through
 * an owner voice/ratification pass (that lands with the real gateway in a later
 * milestone). It deliberately avoids presenting unratified brand copy (e.g. the
 * "Together We Rise" tagline on the banner concept) as finalized.
 */
export const siteConfig = {
  name: "Miami Roots",
  /** Short, factual description grounded in docs/00-context/project-brief.md. */
  description:
    "A private, community-oriented network in Miami — helping people build real relationships and share real opportunities.",
  /** Canonical public URL; falls back to localhost for local development. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export type SiteConfig = typeof siteConfig;
