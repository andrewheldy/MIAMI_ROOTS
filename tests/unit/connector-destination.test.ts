import { describe, expect, it } from "vitest";

import { connectors } from "@/content/connectors";
import {
  ALLOWED_CONNECTOR_PAGE_PATHS,
  buildConnectorLandingPath,
  parseScanSource,
  resolveConnectorLanding,
  resolveDestinationPath,
} from "@/lib/connectors/destination";

/**
 * The security- and correctness-critical half of the Founding Connector
 * redirect. Everything `/r/<code>` does is decided here, so these tests are the
 * real coverage for unknown codes, disabled cards, unsafe destinations, and
 * parameter handling — the route file only executes the result.
 */

const query = (search: string) => new URLSearchParams(search);

describe("parseScanSource", () => {
  it("reads the short forms actually encoded on cards", () => {
    expect(parseScanSource("n")).toBe("nfc");
    expect(parseScanSource("q")).toBe("qr");
    expect(parseScanSource("l")).toBe("link");
  });

  it("reads the spelled-out forms and ignores case and padding", () => {
    expect(parseScanSource("NFC")).toBe("nfc");
    expect(parseScanSource(" qr ")).toBe("qr");
    expect(parseScanSource("Link")).toBe("link");
  });

  it("never guesses: anything unrecognized is unknown", () => {
    for (const input of [undefined, "", "  ", "x", "nfc-ish", "1"]) {
      expect(parseScanSource(input), String(input)).toBe("unknown");
    }
  });

  it("takes the first value when a parameter is repeated", () => {
    expect(parseScanSource(["q", "n"])).toBe("qr");
  });
});

describe("resolveDestinationPath", () => {
  it("resolves each internal destination kind", () => {
    expect(resolveDestinationPath({ kind: "page", path: "/join" })).toBe(
      "/join",
    );
    expect(
      resolveDestinationPath({ kind: "group", groupSlug: "general-chat" }),
    ).toBe("/groups/general-chat");
    expect(
      resolveDestinationPath({ kind: "chat", chatSlug: "general-chat" }),
    ).toBe("/go/general-chat");
  });

  it("refuses a page path that is not on the allowlist", () => {
    expect(resolveDestinationPath({ kind: "page", path: "/admin" })).toBeNull();
    expect(
      resolveDestinationPath({ kind: "page", path: "/join/../admin" }),
    ).toBeNull();
  });

  it("refuses unknown groups and unknown chat slugs", () => {
    expect(
      resolveDestinationPath({ kind: "group", groupSlug: "not-a-group" }),
    ).toBeNull();
    expect(
      resolveDestinationPath({ kind: "chat", chatSlug: "not-a-chat" }),
    ).toBeNull();
  });

  it("cannot express an external destination at all", () => {
    // The type system forbids a URL destination; this asserts the runtime
    // guard too, since registry data could arrive from a database later.
    expect(
      resolveDestinationPath({
        kind: "page",
        path: "https://evil.example",
      } as never),
    ).toBeNull();
    expect(
      resolveDestinationPath({ kind: "page", path: "//evil.example" } as never),
    ).toBeNull();
  });

  it("every allowlisted page path is a single-slash internal path", () => {
    for (const path of ALLOWED_CONNECTOR_PAGE_PATHS) {
      expect(path.startsWith("/"), path).toBe(true);
      expect(path.startsWith("//"), path).toBe(false);
    }
  });
});

describe("buildConnectorLandingPath", () => {
  it("stamps attribution the visitor cannot spoof", () => {
    expect(
      buildConnectorLandingPath({
        path: "/join",
        source: "nfc",
        creditedCode: "maya",
        // A crafted URL claiming a different source and a different connector.
        incoming: query("utm_source=someone_else&utm_medium=email&ref=fake"),
      }),
    ).toBe(
      "/join?ref=founding-connector&utm_source=founding_connector&utm_medium=nfc&utm_campaign=founding_connectors&utm_content=maya",
    );
  });

  it("omits utm_content entirely when nothing is credited", () => {
    const path = buildConnectorLandingPath({
      path: "/join",
      source: "qr",
      creditedCode: null,
    });
    expect(path).not.toContain("utm_content");
    expect(path).toContain("utm_medium=qr");
  });

  it("labels an unknown source as card rather than inventing one", () => {
    expect(
      buildConnectorLandingPath({
        path: "/join",
        source: "unknown",
        creditedCode: "maya",
      }),
    ).toContain("utm_medium=card");
  });

  it("preserves a campaign and term riding along on the card URL", () => {
    const path = buildConnectorLandingPath({
      path: "/join",
      source: "qr",
      creditedCode: "maya",
      incoming: query("utm_campaign=art_basel&utm_term=vip"),
    });
    expect(path).toContain("utm_campaign=art_basel");
    expect(path).toContain("utm_term=vip");
  });

  it("drops every parameter outside the known campaign keys", () => {
    const path = buildConnectorLandingPath({
      path: "/join",
      source: "qr",
      creditedCode: "maya",
      incoming: query(
        "next=https%3A%2F%2Fevil.example&redirect=/admin&callback=x&fbclid=y",
      ),
    });
    for (const dropped of ["next", "redirect", "callback", "fbclid"]) {
      expect(path, dropped).not.toContain(dropped);
    }
  });

  it("ignores blank campaign values instead of emitting empty parameters", () => {
    const path = buildConnectorLandingPath({
      path: "/join",
      source: "qr",
      creditedCode: "maya",
      incoming: query("utm_campaign=%20%20&utm_term="),
    });
    expect(path).toContain("utm_campaign=founding_connectors");
    expect(path).not.toContain("utm_term");
  });
});

describe("resolveConnectorLanding", () => {
  it("404s a malformed code without inventing a landing", () => {
    expect(resolveConnectorLanding({ rawCode: "not a code" })).toEqual({
      outcome: "not_found",
      code: null,
    });
  });

  it("404s a well-formed code that was never issued", () => {
    const result = resolveConnectorLanding({ rawCode: "never-issued" });
    expect(result.outcome).toBe("not_found");
  });

  it("credits an active card and lands it on the program default", () => {
    const result = resolveConnectorLanding({
      rawCode: "FC001",
      incoming: query("s=n"),
    });
    expect(result.outcome).toBe("credited");
    if (result.outcome === "not_found") {
      throw new Error("expected a credited resolution");
    }
    expect(result.code).toBe("fc001");
    expect(result.source).toBe("nfc");
    expect(result.landingPath).toBe(
      "/join?ref=founding-connector&utm_source=founding_connector&utm_medium=nfc&utm_campaign=founding_connectors&utm_content=fc001",
    );
  });

  it("honors an active card's own destination override", () => {
    const result = resolveConnectorLanding({
      rawCode: "demo-dj",
      incoming: query("s=q"),
    });
    if (result.outcome !== "credited") {
      throw new Error("expected a credited resolution");
    }
    expect(result.landingPath.startsWith("/go/nightlife-events?")).toBe(true);
    expect(result.landingPath).toContain("utm_content=demo-dj");
  });

  it("keeps the door open for a retired card but credits nobody", () => {
    const result = resolveConnectorLanding({
      rawCode: "demo-retired",
      incoming: query("s=q"),
    });
    expect(result.outcome).toBe("uncredited");
    if (result.outcome === "not_found") {
      throw new Error("expected an uncredited resolution");
    }
    expect(result.landingPath.startsWith("/join?")).toBe(true);
    expect(result.landingPath).not.toContain("utm_content");
  });

  it("ignores a disabled card's destination override", () => {
    // Guards the rule that an override is a privilege of an active card: a
    // retired connector must not keep steering traffic anywhere special.
    const result = resolveConnectorLanding({ rawCode: "demo-retired" });
    if (result.outcome === "not_found") {
      throw new Error("expected a resolution");
    }
    expect(result.landingPath.startsWith("/join?")).toBe(true);
  });

  it("never produces anything but an internal path, for any registry entry", () => {
    for (const connector of connectors) {
      const result = resolveConnectorLanding({
        rawCode: connector.code,
        incoming: query("next=https://evil.example&s=q"),
      });
      if (result.outcome === "not_found") {
        throw new Error(`registry entry ${connector.code} did not resolve`);
      }
      expect(result.landingPath.startsWith("/"), connector.code).toBe(true);
      expect(result.landingPath.startsWith("//"), connector.code).toBe(false);
      expect(result.landingPath).not.toMatch(/^\/?\w+:/);
      expect(result.landingPath).not.toContain("evil.example");
    }
  });
});
