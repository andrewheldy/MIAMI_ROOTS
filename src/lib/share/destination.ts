/**
 * The stable share destination and its campaign attribution.
 *
 * Every shared QR code, link, and downloadable asset points people at the public
 * Miami Roots join experience. This URL is deliberately a **hardcoded, stable,
 * production website URL** — not `siteConfig.url` (which is environment-derived
 * and localhost in dev) and never a raw WhatsApp invite link. Printed and posted
 * QR codes outlive deploys and community-link rotations, so the entry point they
 * encode must never move: the underlying WhatsApp chats can be re-pointed behind
 * `/join` at any time without invalidating a single card already in the wild.
 *
 * Attribution is **campaign-level and non-personal** (assumption, not an
 * individual referral identity): the referral/points architecture that mints
 * per-member links is a later milestone (M5/M11), and the current database and
 * privacy design do not yet support personal referral codes. These UTM/`ref`
 * parameters simply mark traffic as coming from a member share so it can be
 * measured once analytics land — they identify no one.
 */

/** The stable public entry point every share points to. Never a WhatsApp link. */
export const JOIN_DESTINATION_URL = "https://miami-roots.vercel.app/join";

/**
 * The channel a share went out through. Only the medium varies per channel; the
 * campaign, source, and `ref` stay constant so all member-share traffic rolls up
 * together.
 */
export type ShareMedium = "qr" | "web_share" | "copy_link";

/** Attribution parameters shared by every channel (the medium is added per call). */
export const SHARE_ATTRIBUTION = {
  ref: "community-share",
  utm_source: "member_share",
  utm_campaign: "miami_roots_growth",
} as const;

/**
 * Build the join URL with campaign attribution for a given channel. Parameter
 * order is fixed (`ref`, `utm_source`, `utm_medium`, `utm_campaign`) so the
 * result is stable and testable; the QR/`"qr"` form is the canonical printed URL.
 *
 * @example
 * buildJoinShareUrl("qr")
 * // https://miami-roots.vercel.app/join?ref=community-share&utm_source=member_share&utm_medium=qr&utm_campaign=miami_roots_growth
 */
export function buildJoinShareUrl(medium: ShareMedium = "qr"): string {
  const params = new URLSearchParams();
  params.set("ref", SHARE_ATTRIBUTION.ref);
  params.set("utm_source", SHARE_ATTRIBUTION.utm_source);
  params.set("utm_medium", medium);
  params.set("utm_campaign", SHARE_ATTRIBUTION.utm_campaign);
  return `${JOIN_DESTINATION_URL}?${params.toString()}`;
}

/** The exact URL encoded into every QR code and downloadable asset. */
export const QR_SHARE_URL = buildJoinShareUrl("qr");

/** The set of campaign parameter names, for capture/preservation on `/join`. */
export const CAMPAIGN_PARAM_KEYS = [
  "ref",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;
