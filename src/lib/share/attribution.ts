/**
 * Campaign attribution capture for the join flow.
 *
 * When someone arrives on `/join` from a shared QR or link, the campaign
 * parameters (`ref`, `utm_*`) identify the traffic as a member share. This
 * module holds the pure logic for reading those parameters so it can be tested
 * without a browser; the `CampaignAttribution` client component persists the
 * first-touch capture into session storage so it survives navigation within the
 * hub and is available to the analytics/referral layer that lands in a later
 * milestone. The capture is entirely non-personal — it identifies a campaign,
 * never an individual.
 */

import { CAMPAIGN_PARAM_KEYS } from "./destination";

/** Session-storage key under which the first-touch capture is kept. */
export const ATTRIBUTION_STORAGE_KEY = "miami-roots:attribution";

/**
 * Extract the known campaign parameters from a URL query string. Unknown
 * parameters are ignored, and empty values are dropped, so the result contains
 * only meaningful attribution data.
 *
 * @param search a query string, with or without the leading `?`
 */
export function extractCampaignParams(search: string): Record<string, string> {
  const params = new URLSearchParams(
    search.startsWith("?") ? search.slice(1) : search,
  );
  const captured: Record<string, string> = {};
  for (const key of CAMPAIGN_PARAM_KEYS) {
    const value = params.get(key);
    if (value) {
      captured[key] = value;
    }
  }
  return captured;
}

/** Whether a query string carries any campaign attribution worth capturing. */
export function hasCampaignParams(search: string): boolean {
  return Object.keys(extractCampaignParams(search)).length > 0;
}
