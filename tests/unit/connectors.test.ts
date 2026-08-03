import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  connectors,
  DEFAULT_CONNECTOR_DESTINATION,
  getActiveConnectors,
  getConnectorByCode,
  getPubliclyRecognizedConnectors,
} from "@/content/connectors";
import {
  isIssuableConnectorCode,
  normalizeConnectorCode,
} from "@/lib/connectors/codes";
import { resolveDestinationPath } from "@/lib/connectors/destination";

/**
 * Registry invariants. These are the guard rails on a file that a human will
 * edit by hand every time a card is issued, so the rules that matter — public
 * safety, code stability, resolvable destinations — are asserted rather than
 * trusted.
 */

const REGISTRY_PATH = join(
  process.cwd(),
  "src",
  "content",
  "connectors",
  "connectors.ts",
);

describe("connector registry", () => {
  it("issues only well-formed, non-reserved codes", () => {
    for (const connector of connectors) {
      expect(normalizeConnectorCode(connector.code), connector.code).toBe(
        connector.code,
      );
      expect(isIssuableConnectorCode(connector.code), connector.code).toBe(
        true,
      );
    }
  });

  it("never reuses a code", () => {
    const codes = connectors.map((connector) => connector.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("resolves every destination it names", () => {
    expect(
      resolveDestinationPath(DEFAULT_CONNECTOR_DESTINATION),
    ).not.toBeNull();
    for (const connector of connectors) {
      if (connector.destination) {
        expect(
          resolveDestinationPath(connector.destination),
          connector.code,
        ).not.toBeNull();
      }
    }
  });

  it("uses ISO dates for issue dates", () => {
    for (const connector of connectors) {
      if (connector.issuedOn) {
        expect(connector.issuedOn, connector.code).toMatch(
          /^\d{4}-\d{2}-\d{2}$/,
        );
      }
    }
  });

  it("ships only clearly-fictional entries — no real person is committed", () => {
    for (const connector of connectors) {
      expect(connector.fixture, connector.code).toBe(true);
    }
  });

  it("names nobody publicly without consent", () => {
    for (const connector of getPubliclyRecognizedConnectors()) {
      expect(connector.publicRecognitionConsent, connector.code).toBe(true);
    }
    // The fixtures deliberately consent to nothing, so the public list is empty
    // until a real, consenting connector is added.
    expect(getPubliclyRecognizedConnectors()).toHaveLength(0);
  });

  it("contains no contact details, invite links, or other private data", () => {
    const source = readFileSync(REGISTRY_PATH, "utf8");
    const forbidden = [
      /chat\.whatsapp\.com/i,
      /wa\.me/i,
      // An email address anywhere in the registry file.
      /[\w.+-]+@[\w-]+\.[\w.]{2,}/,
      // A phone number in any of the shapes people write them.
      /\+\d[\d\s().-]{7,}/,
      /\b\d{3}[\s.-]\d{3}[\s.-]\d{4}\b/,
    ];
    for (const pattern of forbidden) {
      expect(source, pattern.source).not.toMatch(pattern);
    }
  });

  it("looks a card up by its normalized code only", () => {
    expect(getConnectorByCode("fc001")?.code).toBe("fc001");
    // Callers normalize first; the map itself does no case folding.
    expect(getConnectorByCode("FC001")).toBeUndefined();
    expect(getConnectorByCode("never-issued")).toBeUndefined();
  });

  it("counts only active cards as active", () => {
    for (const connector of getActiveConnectors()) {
      expect(connector.status).toBe("active");
    }
    expect(getActiveConnectors().length).toBeLessThan(connectors.length);
  });
});
