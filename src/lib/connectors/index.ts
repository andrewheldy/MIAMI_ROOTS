/**
 * Founding Connector logic. Import pure helpers from here; the server-only
 * modules (`scan-events`, `nomination-store`) are imported directly by server
 * code so their `server-only` guard is never laundered through a barrel that
 * shared UI might import.
 */
export {
  CONNECTOR_CODE_MAX_LENGTH,
  CONNECTOR_CODE_MIN_LENGTH,
  CONNECTOR_CODE_PATTERN,
  isIssuableConnectorCode,
  normalizeConnectorCode,
  RESERVED_CONNECTOR_CODES,
} from "./codes";
export {
  ALLOWED_CONNECTOR_PAGE_PATHS,
  buildConnectorLandingPath,
  CONNECTOR_ATTRIBUTION,
  parseScanSource,
  resolveConnectorLanding,
  resolveDestinationPath,
  SCAN_SOURCE_PARAM,
  type ConnectorResolution,
  type ScanSource,
} from "./destination";
export {
  CONTACT_METHODS,
  isHoneypotTripped,
  looksLikeEmail,
  NOMINATION_KINDS,
  NOMINATION_LIMITS,
  normalizeInstagramHandle,
  validateNomination,
  type ContactMethod,
  type Nomination,
  type NominationField,
  type NominationInput,
  type NominationKind,
  type NominationValidation,
} from "./nomination";
