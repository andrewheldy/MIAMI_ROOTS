import { describe, expect, it } from "vitest";

import {
  buildJoinShareUrl,
  JOIN_DESTINATION_URL,
  QR_SHARE_URL,
  SHARE_ATTRIBUTION,
} from "@/lib/share/destination";

describe("JOIN_DESTINATION_URL", () => {
  it("is the stable, public https website URL — never a WhatsApp link", () => {
    expect(JOIN_DESTINATION_URL).toBe("https://miami-roots.vercel.app/join");
    const url = new URL(JOIN_DESTINATION_URL);
    expect(url.protocol).toBe("https:");
    expect(url.hostname).toBe("miami-roots.vercel.app");
    expect(url.pathname).toBe("/join");
    expect(url.search).toBe(""); // no attribution baked into the bare destination
    expect(JOIN_DESTINATION_URL).not.toContain("whatsapp");
    expect(JOIN_DESTINATION_URL).not.toContain("chat.whatsapp.com");
  });
});

describe("buildJoinShareUrl — campaign attribution", () => {
  it("builds the canonical QR URL exactly as specified", () => {
    expect(buildJoinShareUrl("qr")).toBe(
      "https://miami-roots.vercel.app/join?ref=community-share&utm_source=member_share&utm_medium=qr&utm_campaign=miami_roots_growth",
    );
  });

  it("defaults to the qr medium", () => {
    expect(buildJoinShareUrl()).toBe(buildJoinShareUrl("qr"));
  });

  it("varies only utm_medium per channel, keeping ref/source/campaign constant", () => {
    for (const medium of ["qr", "web_share", "copy_link"] as const) {
      const params = new URL(buildJoinShareUrl(medium)).searchParams;
      expect(params.get("ref")).toBe(SHARE_ATTRIBUTION.ref);
      expect(params.get("utm_source")).toBe(SHARE_ATTRIBUTION.utm_source);
      expect(params.get("utm_campaign")).toBe(SHARE_ATTRIBUTION.utm_campaign);
      expect(params.get("utm_medium")).toBe(medium);
    }
  });

  it("keeps parameter order stable (ref, source, medium, campaign)", () => {
    const query = buildJoinShareUrl("qr").split("?")[1];
    expect(query).toBe(
      "ref=community-share&utm_source=member_share&utm_medium=qr&utm_campaign=miami_roots_growth",
    );
  });

  it("uses only non-personal, campaign-level attribution (no individual identity)", () => {
    const params = new URL(buildJoinShareUrl("qr")).searchParams;
    // The referral ref is a fixed campaign token, not a per-member code.
    expect(params.get("ref")).toBe("community-share");
    // No user/member identifiers are present.
    for (const key of ["uid", "member", "member_id", "user", "code"]) {
      expect(params.has(key)).toBe(false);
    }
  });

  it("resolves against the stable destination", () => {
    expect(QR_SHARE_URL.startsWith(`${JOIN_DESTINATION_URL}?`)).toBe(true);
  });
});
