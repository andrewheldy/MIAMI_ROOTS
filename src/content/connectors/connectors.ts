import type { Connector, ConnectorDestination } from "./types";

/**
 * The Founding Connector registry — the canonical list of issued cards for this
 * phase, and the single place a destination is changed without reprinting a
 * card.
 *
 * **Everything in this file today is fictional pilot fixture data.** Real
 * Founding Connectors are added one at a time, only after the owner has
 * selected them and the card has been programmed and verified against the
 * pre-handoff checklist in
 * `docs/05-operations/founding-connectors-operations.md`.
 */

/**
 * Where a card lands people unless it names its own destination.
 *
 * `/join` is the branded community hub: it leads with General Chat as the
 * recommended front door while keeping the visitor on a Miami Roots page
 * first, which is exactly the briefed loop (connector → tracked Miami Roots
 * page → General Chat). Re-pointing the entire cohort — to a city page, a
 * campaign page, a different chat — is a one-line change here.
 */
export const DEFAULT_CONNECTOR_DESTINATION: ConnectorDestination = {
  kind: "page",
  path: "/join",
};

/**
 * Issued cards, newest last. Codes are permanent once printed.
 *
 * The fixtures below deliberately cover the three shapes the redirect must
 * handle — an active card on the default destination, an active card with an
 * overridden destination, and a card that has been taken out of service — so
 * the behavior is demonstrable end-to-end before a single real card exists.
 */
export const connectors: readonly Connector[] = [
  {
    code: "fc001",
    displayName: "Pilot Card 001",
    category: "wellness",
    status: "active",
    issuedOn: "2026-08-03",
    publicRecognitionConsent: false,
    note: "Fictional pilot fixture — default destination, sequential-code style.",
    fixture: true,
  },
  {
    code: "demo-dj",
    displayName: "Pilot Card — DJ archetype",
    category: "music",
    status: "active",
    destination: { kind: "chat", chatSlug: "nightlife-events" },
    issuedOn: "2026-08-03",
    publicRecognitionConsent: false,
    note: "Fictional pilot fixture — demonstrates a per-card destination override.",
    fixture: true,
  },
  {
    code: "demo-retired",
    displayName: "Pilot Card — retired",
    category: "events",
    status: "retired",
    issuedOn: "2026-08-03",
    publicRecognitionConsent: false,
    note: "Fictional pilot fixture — demonstrates a disabled card still opening the door, uncredited.",
    fixture: true,
  },
];

/** code → connector, built once. Codes are unique (asserted by tests). */
const byCode: ReadonlyMap<string, Connector> = new Map(
  connectors.map((connector) => [connector.code, connector]),
);

/**
 * Look up an issued card by its already-normalized public code. Returns
 * `undefined` for anything not in the registry — including codes that were
 * never issued and codes someone guessed.
 *
 * Callers must normalize first (`normalizeConnectorCode`); this function does
 * no case folding of its own so the lookup stays a pure, exact map hit.
 */
export function getConnectorByCode(code: string): Connector | undefined {
  return byCode.get(code);
}

/** Connectors currently credited for scans. */
export function getActiveConnectors(): readonly Connector[] {
  return connectors.filter((connector) => connector.status === "active");
}

/**
 * Connectors who agreed to be named publicly. The public site renders nobody
 * without this, and there is no other consent-free path to a name.
 */
export function getPubliclyRecognizedConnectors(): readonly Connector[] {
  return connectors.filter(
    (connector) =>
      connector.publicRecognitionConsent && connector.status === "active",
  );
}
