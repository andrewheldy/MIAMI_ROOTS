/**
 * Server-side resolution of where a Founding Connector card sends a visitor.
 *
 * Pure logic, deliberately kept out of the route file so every rule — code
 * validation, disabled cards, open-redirect prevention, campaign-parameter
 * handling — is unit-testable without a request. This mirrors the existing
 * controlled-redirect architecture used by `/go/<slug>`
 * (`src/lib/chat-redirect.ts`): the route decides *nothing*, it just executes
 * what this module returns.
 *
 * The security property that matters: a connector destination is a closed union
 * of *internal* targets, and every branch below produces a path beginning with
 * a single `/`. There is no code path from registry data to an external origin,
 * so `/r/<code>` cannot be turned into an open redirect — not by a typo, not by
 * a malicious registry edit, and not by a crafted query string.
 */

import {
  DEFAULT_CONNECTOR_DESTINATION,
  getConnectorByCode,
  type Connector,
  type ConnectorDestination,
} from "@/content/connectors";
import { getGroupBySlug } from "@/content/groups";
import { getChatLinkByRedirectSlug } from "@/content/join/chat-links";
import { CAMPAIGN_PARAM_KEYS } from "@/lib/share/destination";

import { normalizeConnectorCode } from "./codes";

/**
 * How the visitor reached the link, when we can tell. The NFC chip and the
 * printed QR encode the same `/r/<code>` URL with different `s` values, which
 * is the only reason the two are distinguishable at all — nothing is inferred
 * from headers or fingerprinting.
 */
export type ScanSource = "nfc" | "qr" | "link" | "unknown";

/** Query parameter carrying the scan source. Short, because it is printed. */
export const SCAN_SOURCE_PARAM = "s";

/**
 * Internal routes a card may point at directly. An explicit allowlist rather
 * than "any string starting with /" so a registry typo fails loudly in tests
 * instead of shipping a card that lands on a 404.
 */
export const ALLOWED_CONNECTOR_PAGE_PATHS: readonly string[] = [
  "/",
  "/join",
  "/groups",
  "/guidelines",
  "/connectors",
];

/** Attribution parameters every connector landing carries. */
export const CONNECTOR_ATTRIBUTION = {
  ref: "founding-connector",
  utmSource: "founding_connector",
  utmCampaign: "founding_connectors",
} as const;

/**
 * Parse the `s` parameter. Accepts the one-letter forms actually encoded on
 * cards (`n`, `q`, `l`) and their spelled-out equivalents; anything else —
 * absent, empty, garbage, or an array of repeated params — is `unknown`. An
 * unrecognized value is never guessed at, because a wrong source label is
 * worse than an honest "we don't know".
 */
export function parseScanSource(
  value: string | string[] | undefined,
): ScanSource {
  // Repeated query parameters arrive as an array; take the first and ignore
  // the rest rather than concatenating them into nonsense.
  const raw = Array.isArray(value) ? value[0] : value;
  switch (raw?.trim().toLowerCase()) {
    case "n":
    case "nfc":
      return "nfc";
    case "q":
    case "qr":
      return "qr";
    case "l":
    case "link":
      return "link";
    default:
      return "unknown";
  }
}

/** The `utm_medium` label for a scan source. */
function mediumForSource(source: ScanSource): string {
  return source === "unknown" ? "card" : source;
}

/**
 * Turn a destination into an internal path, or `null` when it does not resolve
 * (unknown chat slug, unknown group, path not on the allowlist). A `null` here
 * is a configuration bug, and the caller falls back to the program default
 * rather than sending anyone nowhere.
 */
export function resolveDestinationPath(
  destination: ConnectorDestination,
): string | null {
  switch (destination.kind) {
    case "page":
      return ALLOWED_CONNECTOR_PAGE_PATHS.includes(destination.path)
        ? destination.path
        : null;
    case "group":
      return getGroupBySlug(destination.groupSlug)
        ? `/groups/${destination.groupSlug}`
        : null;
    case "chat":
      return getChatLinkByRedirectSlug(destination.chatSlug)
        ? `/go/${destination.chatSlug}`
        : null;
  }
}

/**
 * Append attribution and preserved campaign parameters to an internal path.
 *
 * Parameter policy, in order of precedence:
 *   1. `ref`, `utm_source`, `utm_medium` are always set by us — a visitor
 *      cannot spoof how they arrived.
 *   2. `utm_content` carries the connector code, and **only when the scan is
 *      credited**. A paused or retired card contributes no code, so a
 *      withdrawn connector cannot keep accruing attribution.
 *   3. `utm_campaign` and `utm_term` are preserved from the incoming URL when
 *      present, so a card can ride a specific campaign
 *      (`/r/maya?s=q&utm_campaign=art_basel`) without a reprint; otherwise the
 *      program default applies.
 *   4. Everything else is dropped. Only the known campaign keys survive, which
 *      keeps arbitrary attacker-controlled parameters out of the destination.
 */
export function buildConnectorLandingPath(options: {
  readonly path: string;
  readonly source: ScanSource;
  /** The code to credit, or `null` for an uncredited landing. */
  readonly creditedCode: string | null;
  /** Incoming query parameters from the `/r/<code>` request. */
  readonly incoming?: URLSearchParams;
}): string {
  const { path, source, creditedCode, incoming } = options;

  const preserved = (key: string): string | undefined => {
    if (
      !incoming ||
      !(CAMPAIGN_PARAM_KEYS as readonly string[]).includes(key)
    ) {
      return undefined;
    }
    return incoming.get(key)?.trim() || undefined;
  };

  const params = new URLSearchParams();
  params.set("ref", CONNECTOR_ATTRIBUTION.ref);
  params.set("utm_source", CONNECTOR_ATTRIBUTION.utmSource);
  params.set("utm_medium", mediumForSource(source));
  params.set(
    "utm_campaign",
    preserved("utm_campaign") ?? CONNECTOR_ATTRIBUTION.utmCampaign,
  );
  if (creditedCode) {
    params.set("utm_content", creditedCode);
  }
  const term = preserved("utm_term");
  if (term) {
    params.set("utm_term", term);
  }

  return `${path}?${params.toString()}`;
}

/**
 * What `/r/<code>` should do with a request.
 *
 *   - `not_found` — the code is malformed or was never issued. The route 404s:
 *     inventing a landing for a code nobody issued would credit a fiction and
 *     make guessing codes look successful.
 *   - `credited`  — an active card. Redirect with full attribution.
 *   - `uncredited` — a paused or retired card. The community door still opens
 *     (a real person is standing there holding a real card), but nothing is
 *     credited and the connector's own destination override is ignored in
 *     favor of the program default.
 */
export type ConnectorResolution =
  | { readonly outcome: "not_found"; readonly code: string | null }
  | {
      readonly outcome: "credited" | "uncredited";
      readonly code: string;
      readonly connector: Connector;
      readonly source: ScanSource;
      /** Fully-built internal path, attribution included. Always starts `/`. */
      readonly landingPath: string;
    };

/**
 * Resolve an incoming `/r/<code>` request end to end. The only entry point the
 * route needs.
 */
export function resolveConnectorLanding(options: {
  readonly rawCode: string | undefined;
  readonly incoming?: URLSearchParams;
}): ConnectorResolution {
  const { rawCode, incoming } = options;

  const code = normalizeConnectorCode(rawCode);
  if (!code) {
    return { outcome: "not_found", code: null };
  }

  const connector = getConnectorByCode(code);
  if (!connector) {
    return { outcome: "not_found", code };
  }

  const source = parseScanSource(incoming?.get(SCAN_SOURCE_PARAM) ?? undefined);
  const credited = connector.status === "active";

  // A card that is out of service falls back to the program default even if it
  // names its own destination — an override is a privilege of an active card.
  const destination = credited
    ? (connector.destination ?? DEFAULT_CONNECTOR_DESTINATION)
    : DEFAULT_CONNECTOR_DESTINATION;

  const path =
    resolveDestinationPath(destination) ??
    resolveDestinationPath(DEFAULT_CONNECTOR_DESTINATION) ??
    "/join";

  return {
    outcome: credited ? "credited" : "uncredited",
    code,
    connector,
    source,
    landingPath: buildConnectorLandingPath({
      path,
      source,
      creditedCode: credited ? code : null,
      incoming,
    }),
  };
}
