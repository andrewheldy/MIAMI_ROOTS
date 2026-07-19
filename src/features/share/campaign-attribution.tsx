"use client";

import { useEffect } from "react";

import {
  ATTRIBUTION_STORAGE_KEY,
  extractCampaignParams,
} from "@/lib/share/attribution";

/**
 * Captures campaign attribution when a visitor lands on `/join` from a shared
 * QR or link, and preserves it for the rest of the session so the parameters
 * survive navigation through the hub. First-touch wins: an existing capture is
 * never overwritten, matching the referral design's first-touch precedence.
 *
 * Renders nothing and changes no layout — it is a pure side effect that runs in
 * an effect (never during render), so it is safe on the server and inert until
 * hydration. The stored data is non-personal (campaign parameters only) and is
 * the foundation the analytics/referral milestones will read from.
 */
export function CampaignAttribution() {
  useEffect(() => {
    try {
      const captured = extractCampaignParams(window.location.search);
      if (Object.keys(captured).length === 0) {
        return;
      }
      if (window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY)) {
        return; // first-touch precedence: keep the earliest capture
      }
      window.sessionStorage.setItem(
        ATTRIBUTION_STORAGE_KEY,
        JSON.stringify({ ...captured, landing_path: window.location.pathname }),
      );
    } catch {
      // Storage may be unavailable (private mode, disabled) — attribution is
      // best-effort and must never break the page.
    }
  }, []);

  return null;
}
