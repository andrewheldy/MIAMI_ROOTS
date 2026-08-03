/**
 * Typed content model for the Miami Roots Founding Connectors program.
 *
 * This module mirrors the `connectors` database table shape (see
 * `supabase/migrations/20260803120000_connectors.sql`) so moving the registry
 * into the database later is a lift, not a redesign — the same deliberate
 * interim the community-group content module uses (`src/content/groups/`).
 *
 * Hard content rules, enforced by `tests/unit/connectors.test.ts`:
 *   - PUBLIC-SAFE ONLY. Never a phone number, email, WhatsApp invite link,
 *     home address, or private note about a real person. The registry is
 *     committed to Git and rendered by a public route.
 *   - Real connectors are not committed until the owner explicitly approves
 *     each one; everything shipped here is clearly fictional pilot fixture
 *     data (`fixture: true`) so nobody mistakes it for a real cohort.
 *   - Codes are a public contract the moment a card is printed: stable
 *     forever, unique, and never transferred to a different person.
 *   - Destinations are internal by construction (see
 *     `src/lib/connectors/destination.ts`) — a connector destination can never
 *     be an arbitrary external URL, which is what makes `/r/<code>` immune to
 *     open-redirect abuse.
 */

/**
 * The kind of community role a connector plays. Editorial only — it shapes how
 * the cohort is balanced and reviewed, and never appears on the public site
 * unless the connector consented to public recognition.
 */
export type ConnectorCategory =
  | "wellness"
  | "music"
  | "events"
  | "hospitality"
  | "organizing"
  | "business"
  | "creative"
  | "neighborhood"
  | "civic";

/**
 * Lifecycle of an issued card.
 *
 *   - `active`   — issued, in good standing; scans are attributed to them.
 *   - `paused`   — temporarily out of the program (lost card, quiet period,
 *                  conduct review). The card still opens the community door,
 *                  but the scan is no longer credited.
 *   - `retired`  — permanently withdrawn (left the program, card replaced by a
 *                  new code). Same visitor-facing behavior as `paused`.
 *
 * A card is never "deleted": the code stays reserved so a physical card in the
 * wild can never start crediting a different person.
 */
export type ConnectorStatus = "active" | "paused" | "retired";

/**
 * Where a connector's card sends people. Deliberately a closed union of
 * *internal* targets rather than a URL string:
 *
 *   - `page`  — an internal Miami Roots route from a fixed allowlist
 *     (e.g. `/join`, the branded hub).
 *   - `group` — a community group's detail page, `/groups/<slug>`, validated
 *     against the group content module.
 *   - `chat`  — a controlled `/go/<redirectSlug>` chat gate, which itself
 *     resolves a server-only WhatsApp invite from an environment variable.
 *
 * Because no form can express an external origin, a mistyped or malicious
 * registry entry cannot turn `/r/<code>` into an open redirect. Changing a
 * destination is a content change (deploy), not a card reprint.
 */
export type ConnectorDestination =
  | { readonly kind: "page"; readonly path: string }
  | { readonly kind: "group"; readonly groupSlug: string }
  | { readonly kind: "chat"; readonly chatSlug: string };

export interface Connector {
  /**
   * The public code printed on the card and encoded in the NFC chip and QR:
   * `myroots.dev/r/<code>`. Lowercase, 2–30 chars of `[a-z0-9-]`. Stable
   * forever once a card is printed.
   */
  readonly code: string;
  /**
   * Human label used in internal ops surfaces and, only where
   * `publicRecognitionConsent` is true, on the public site. A first name or
   * stage name is sufficient — never a full contact identity.
   */
  readonly displayName: string;
  readonly category: ConnectorCategory;
  readonly status: ConnectorStatus;
  /**
   * Where this connector's card currently lands people. Omitted means the
   * program default (`DEFAULT_CONNECTOR_DESTINATION`) — which is what almost
   * every card should use, so a single edit re-points the whole cohort.
   */
  readonly destination?: ConnectorDestination;
  /** ISO date (YYYY-MM-DD) the physical card was handed over. */
  readonly issuedOn?: string;
  /**
   * Whether this person agreed to be named publicly as a Founding Connector.
   * Defaults to `false` in practice: recognition is opt-in, per the program's
   * privacy posture.
   */
  readonly publicRecognitionConsent: boolean;
  /**
   * Short, public-safe operational note (e.g. "pilot card, replaced FC001").
   * Never private information about a person.
   */
  readonly note?: string;
  /**
   * True for the clearly-invented entries shipped in this repository. Real
   * connectors are added only with owner approval, and this flag lets tests
   * and ops surfaces tell demonstration data from a real cohort at a glance.
   */
  readonly fixture: boolean;
}
