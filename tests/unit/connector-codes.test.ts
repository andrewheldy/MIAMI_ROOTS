import { describe, expect, it } from "vitest";

import {
  CONNECTOR_CODE_MAX_LENGTH,
  isIssuableConnectorCode,
  normalizeConnectorCode,
  RESERVED_CONNECTOR_CODES,
} from "@/lib/connectors/codes";

describe("normalizeConnectorCode", () => {
  it("accepts the code shapes actually printed on cards", () => {
    expect(normalizeConnectorCode("fc001")).toBe("fc001");
    expect(normalizeConnectorCode("maya")).toBe("maya");
    expect(normalizeConnectorCode("djmarcus")).toBe("djmarcus");
    expect(normalizeConnectorCode("dj-marcus")).toBe("dj-marcus");
  });

  it("folds case and trims, so a hand-typed code from a card still resolves", () => {
    expect(normalizeConnectorCode("DJMarcus")).toBe("djmarcus");
    expect(normalizeConnectorCode("  FC001  ")).toBe("fc001");
  });

  it("rejects anything that is not a code, rather than coercing it", () => {
    for (const input of [
      "",
      "a",
      "-maya",
      "maya-",
      "dj--marcus",
      "dj marcus",
      "dj_marcus",
      "dj.marcus",
      "maya/../admin",
      "maya?utm_source=x",
      "https://evil.example",
      "..",
      "%2e%2e",
      "djmarcús",
      "dj\nmarcus",
      "x".repeat(CONNECTOR_CODE_MAX_LENGTH + 1),
    ]) {
      expect(normalizeConnectorCode(input), input).toBeNull();
    }
  });

  it("rejects non-strings", () => {
    expect(normalizeConnectorCode(undefined)).toBeNull();
  });
});

describe("isIssuableConnectorCode", () => {
  it("blocks reserved codes that would impersonate an official surface", () => {
    for (const reserved of RESERVED_CONNECTOR_CODES) {
      expect(isIssuableConnectorCode(reserved), reserved).toBe(false);
      expect(isIssuableConnectorCode(reserved.toUpperCase()), reserved).toBe(
        false,
      );
    }
  });

  it("allows ordinary connector codes", () => {
    expect(isIssuableConnectorCode("maya")).toBe(true);
    expect(isIssuableConnectorCode("fc001")).toBe(true);
  });

  it("blocks malformed codes", () => {
    expect(isIssuableConnectorCode("not a code")).toBe(false);
  });
});
