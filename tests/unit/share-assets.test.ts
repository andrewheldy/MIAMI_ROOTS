import { describe, expect, it } from "vitest";

import {
  SHARE_ASSETS,
  SQUARE_ASSET,
  STANDARD_QR_ASSET,
  STORY_ASSET,
} from "@/lib/share/assets";

describe("share asset specifications", () => {
  it("defines the standard square QR download", () => {
    expect(STANDARD_QR_ASSET).toMatchObject({
      key: "standard",
      width: 1024,
      height: 1024,
      filename: "miami-roots-qr.png",
    });
    // Square, high-resolution.
    expect(STANDARD_QR_ASSET.width).toBe(STANDARD_QR_ASSET.height);
    expect(STANDARD_QR_ASSET.width).toBeGreaterThanOrEqual(1000);
  });

  it("defines the 1080x1920 Instagram Story card with its copy", () => {
    expect(STORY_ASSET).toMatchObject({
      key: "story",
      width: 1080,
      height: 1920,
      filename: "miami-roots-story.png",
      headline: "Meet your people in Miami.",
      caption: "Scan to join Miami Roots.",
    });
  });

  it("defines the 1080x1080 square social card with its copy", () => {
    expect(SQUARE_ASSET).toMatchObject({
      key: "square",
      width: 1080,
      height: 1080,
      filename: "miami-roots-square.png",
      headline: "Put down roots with us.",
      caption: "Scan to join Miami Roots.",
    });
  });

  it("exposes all three assets with unique keys and .png filenames", () => {
    expect(SHARE_ASSETS).toHaveLength(3);
    const keys = SHARE_ASSETS.map((a) => a.key);
    expect(new Set(keys).size).toBe(3);
    for (const asset of SHARE_ASSETS) {
      expect(asset.filename).toMatch(/^miami-roots-[a-z]+\.png$/);
      expect(asset.width).toBeGreaterThan(0);
      expect(asset.height).toBeGreaterThan(0);
    }
  });

  it("keeps all card copy public-safe (no invite links or phone numbers)", () => {
    for (const asset of SHARE_ASSETS) {
      const copy = `${asset.headline ?? ""} ${asset.caption ?? ""}`;
      expect(copy).not.toContain("whatsapp");
      expect(copy).not.toMatch(/\+?\d[\d\s().-]{7,}/); // no phone-like sequences
    }
  });
});
