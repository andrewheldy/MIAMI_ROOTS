import "server-only";

import { createServiceRoleSupabaseClient } from "@/lib/supabase/service";

import type { ScanSource } from "./destination";

/**
 * Privacy-safe recording of Founding Connector card scans.
 *
 * What is recorded (and nothing else): which public card code was used,
 * whether the tap came from NFC / QR / a plain link, whether the scan was
 * credited, and when. That is enough to answer every question on the program
 * scorecard in `docs/01-product/founding-connectors-program.md`.
 *
 * What is deliberately NOT recorded: IP addresses (not even hashed — the
 * existing privacy design permits hashes only where an anti-abuse need is
 * documented, and a card scan has none), user agents, device or browser
 * fingerprints, referrers, geolocation, or any identifier that could link two
 * scans to the same person. A scan is a counter, not a profile.
 *
 * Writing goes through the service-role client because `events` is
 * deny-by-default with no client policies at all (M3 schema) — an anon visitor
 * has, and should have, no ability to write to it. This is one of the first
 * legitimate service-role call sites the M3 module comment anticipated.
 */

/** Canonical event name, added to the taxonomy in `analytics-and-events.md`. */
export const CONNECTOR_SCAN_EVENT = "connector_link_visited";

export type ScanRecordResult =
  /** The event reached the database. */
  | "recorded"
  /** No database is configured in this environment — nothing was written. */
  | "skipped_unconfigured"
  /** A database is configured but the write failed; the redirect proceeded. */
  | "failed";

/**
 * Whether a server-side event write path exists in this environment.
 *
 * Checked without touching `readServiceRoleKey()` because that function throws
 * by design; scan recording must degrade to a no-op, never break a redirect
 * someone is standing in front of a card waiting for. Returns false in every
 * environment where the owner has not yet provisioned Supabase — which is the
 * current state of the project (Milestone 3's remote half is owner-gated).
 */
export function isConnectorTelemetryConfigured(
  env: Record<string, string | undefined> = process.env,
): boolean {
  return Boolean(
    env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() &&
    env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
  );
}

/** Milliseconds a scan write may take before the redirect stops waiting. */
const WRITE_TIMEOUT_MS = 1_200;

export interface ConnectorScanInput {
  /** Normalized public card code. Public by nature — never a personal id. */
  readonly code: string;
  readonly source: ScanSource;
  /** False for a paused/retired card: the door opened, nobody was credited. */
  readonly credited: boolean;
  /** Campaign label riding along on the card URL, when one was supplied. */
  readonly campaign?: string;
}

/**
 * Record one card scan. Never throws and never rejects: a telemetry failure
 * must not become a visitor-facing failure. The result is returned for tests
 * and for the caller's optional logging.
 *
 * `connector_id` is intentionally left null for now. The card registry lives in
 * `src/content/connectors/` for this phase (mirroring how group content still
 * lives in code before Milestone 4), so there is no row to point at yet; the
 * column and its foreign key exist so the link becomes a backfill, not a
 * migration redesign. The public code in `properties` is the join key until
 * then.
 */
export async function recordConnectorScan(
  input: ConnectorScanInput,
): Promise<ScanRecordResult> {
  if (!isConnectorTelemetryConfigured()) {
    return "skipped_unconfigured";
  }

  try {
    // Service role required: `events` grants nothing to anon/authenticated by
    // design, and this write happens for an anonymous visitor mid-redirect.
    const supabase = createServiceRoleSupabaseClient();

    const write = supabase.from("events").insert({
      event_name: CONNECTOR_SCAN_EVENT,
      actor_kind: "anon",
      properties: {
        connector_code: input.code,
        source: input.source,
        credited: input.credited,
        ...(input.campaign ? { campaign: input.campaign } : {}),
      },
    });

    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<"timeout">((resolve) => {
      timer = setTimeout(() => resolve("timeout"), WRITE_TIMEOUT_MS);
    });

    try {
      const outcome = await Promise.race([write, timeout]);
      if (outcome === "timeout" || outcome.error) {
        return "failed";
      }
      return "recorded";
    } finally {
      clearTimeout(timer);
    }
  } catch {
    // Misconfiguration, network failure, or a schema that has not been pushed
    // to this environment yet. Swallowed on purpose — the visitor still lands.
    return "failed";
  }
}
