/**
 * Public entry point for the Founding Connector registry. Import from
 * `@/content/connectors` rather than reaching into the individual files.
 */
export type {
  Connector,
  ConnectorCategory,
  ConnectorDestination,
  ConnectorStatus,
} from "./types";
export {
  connectors,
  DEFAULT_CONNECTOR_DESTINATION,
  getActiveConnectors,
  getConnectorByCode,
  getPubliclyRecognizedConnectors,
} from "./connectors";
