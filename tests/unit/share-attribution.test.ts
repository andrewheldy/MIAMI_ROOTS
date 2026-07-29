import { describe, expect, it } from "vitest";

import {
  extractCampaignParams,
  hasCampaignParams,
  ATTRIBUTION_STORAGE_KEY,
} from "@/lib/share/attribution";
import { buildJoinShareUrl } from "@/lib/share/destination";

describe("extractCampaignParams", () => {
  it("captures the campaign parameters from the shared join URL", () => {
    const search = new URL(buildJoinShareUrl("qr")).search;
    expect(extractCampaignParams(search)).toEqual({
      ref: "community-share",
      utm_source: "member_share",
      utm_medium: "qr",
      utm_campaign: "miami_roots_growth",
    });
  });

  it("tolerates a query string with or without the leading '?'", () => {
    expect(extractCampaignParams("?ref=community-share")).toEqual({
      ref: "community-share",
    });
    expect(extractCampaignParams("ref=community-share")).toEqual({
      ref: "community-share",
    });
  });

  it("ignores unknown parameters and empty values", () => {
    expect(
      extractCampaignParams("?ref=x&foo=bar&utm_source=&utm_medium=qr"),
    ).toEqual({ ref: "x", utm_medium: "qr" });
  });

  it("returns an empty object when there is no attribution", () => {
    expect(extractCampaignParams("")).toEqual({});
    expect(extractCampaignParams("?a=1&b=2")).toEqual({});
  });
});

describe("hasCampaignParams", () => {
  it("detects the presence of any campaign attribution", () => {
    expect(hasCampaignParams(new URL(buildJoinShareUrl()).search)).toBe(true);
    expect(hasCampaignParams("?utm_content=story")).toBe(true);
    expect(hasCampaignParams("?unrelated=1")).toBe(false);
    expect(hasCampaignParams("")).toBe(false);
  });
});

describe("ATTRIBUTION_STORAGE_KEY", () => {
  it("is a stable namespaced key", () => {
    expect(ATTRIBUTION_STORAGE_KEY).toBe("miami-roots:attribution");
  });
});
