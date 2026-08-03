/**
 * Founding Connector code rules — the format printed on a physical card, and
 * therefore the one thing in this system that can never change after the fact.
 *
 * Pure logic with no I/O so the rules are unit-testable and usable from both
 * the redirect route and any future admin tooling.
 */

/**
 * Lowercase, 2–30 characters of `[a-z0-9-]`, no leading/trailing hyphen and no
 * doubled hyphens. Long enough for `djmarcus`, short enough to print legibly,
 * and restrictive enough that a code can be read aloud over a loud bar.
 *
 * Mirrors the slug shape in `docs/03-architecture/referral-system.md` while
 * also permitting sequential card codes like `fc001`.
 */
export const CONNECTOR_CODE_PATTERN =
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/ as Readonly<RegExp>;

export const CONNECTOR_CODE_MIN_LENGTH = 2;
export const CONNECTOR_CODE_MAX_LENGTH = 30;

/**
 * Codes that must never be issued. Two reasons: the first block would make a
 * card look like an official Miami Roots surface (`/r/admin`, `/r/official`),
 * and the second block collides with real route names, so a printed card
 * carrying one would be permanently confusing if the URL shape ever changes.
 *
 * This list is checked when *issuing* a code, not when resolving one — an
 * unissued code simply isn't in the registry and 404s either way.
 */
export const RESERVED_CONNECTOR_CODES: readonly string[] = [
  "admin",
  "api",
  "connectors",
  "go",
  "groups",
  "guidelines",
  "join",
  "me",
  "miami",
  "miami-roots",
  "official",
  "r",
  "root",
  "roots",
  "staff",
  "support",
  "team",
];

/**
 * Normalize a raw path segment into a canonical connector code, or `null` if
 * it could never be a valid code.
 *
 * Resolution is deliberately case-insensitive and whitespace-tolerant: a code
 * gets typed by hand from a card under bad lighting, so `/r/DJMarcus` and
 * `/r/ djmarcus ` should both resolve. Everything else — slashes, dots,
 * percent-encoding leftovers, unicode lookalikes — is rejected rather than
 * coerced, because a code that "almost" matches must never silently credit
 * someone.
 */
export function normalizeConnectorCode(raw: string | undefined): string | null {
  if (typeof raw !== "string") {
    return null;
  }
  const candidate = raw.trim().toLowerCase();
  if (
    candidate.length < CONNECTOR_CODE_MIN_LENGTH ||
    candidate.length > CONNECTOR_CODE_MAX_LENGTH
  ) {
    return null;
  }
  if (!CONNECTOR_CODE_PATTERN.test(candidate)) {
    return null;
  }
  return candidate;
}

/** Whether a code is available to issue (valid shape and not reserved). */
export function isIssuableConnectorCode(raw: string | undefined): boolean {
  const normalized = normalizeConnectorCode(raw);
  return normalized !== null && !RESERVED_CONNECTOR_CODES.includes(normalized);
}
