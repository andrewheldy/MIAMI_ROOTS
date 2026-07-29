import { describe, expect, it, vi } from "vitest";

import {
  canNativeShare,
  copyToClipboard,
  shareOrCopy,
} from "@/lib/share/actions";
import type { ShareCapableNavigator } from "@/lib/share/actions";

const payload = {
  url: "https://miami-roots.vercel.app/join?ref=community-share",
  title: "Miami Roots",
  text: "Meet your people in Miami.",
};

describe("canNativeShare", () => {
  it("is true only when navigator.share is a function", () => {
    expect(canNativeShare({ share: async () => {} })).toBe(true);
    expect(canNativeShare({})).toBe(false);
    expect(canNativeShare(undefined)).toBe(false);
  });
});

describe("shareOrCopy — native share available", () => {
  it("uses the Web Share API and reports 'shared'", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    const nav: ShareCapableNavigator = { share };
    const outcome = await shareOrCopy(nav, payload);
    expect(outcome).toBe("shared");
    expect(share).toHaveBeenCalledWith({
      title: payload.title,
      text: payload.text,
      url: payload.url,
    });
  });

  it("reports 'dismissed' (not an error) when the user cancels the sheet", async () => {
    const abort = Object.assign(new Error("cancelled"), { name: "AbortError" });
    const nav: ShareCapableNavigator = {
      share: vi.fn().mockRejectedValue(abort),
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    };
    expect(await shareOrCopy(nav, payload)).toBe("dismissed");
    expect(nav.clipboard?.writeText).not.toHaveBeenCalled();
  });

  it("falls back to copying when a share fails for a non-dismissal reason", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const nav: ShareCapableNavigator = {
      share: vi.fn().mockRejectedValue(new Error("boom")),
      clipboard: { writeText },
    };
    expect(await shareOrCopy(nav, payload)).toBe("copied");
    expect(writeText).toHaveBeenCalledWith(payload.url);
  });
});

describe("shareOrCopy — no native share (fallback path)", () => {
  it("copies the URL and reports 'copied'", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const nav: ShareCapableNavigator = { clipboard: { writeText } };
    expect(await shareOrCopy(nav, payload)).toBe("copied");
    expect(writeText).toHaveBeenCalledWith(payload.url);
  });

  it("reports 'error' when neither sharing nor copying is possible", async () => {
    expect(await shareOrCopy({}, payload)).toBe("error");
    expect(await shareOrCopy(undefined, payload)).toBe("error");
  });

  it("reports 'error' when the clipboard write rejects", async () => {
    const nav: ShareCapableNavigator = {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
    };
    expect(await shareOrCopy(nav, payload)).toBe("error");
  });
});

describe("copyToClipboard", () => {
  it("resolves true on success and false when unavailable or failing", async () => {
    expect(
      await copyToClipboard(
        { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } },
        "x",
      ),
    ).toBe(true);
    expect(await copyToClipboard({}, "x")).toBe(false);
    expect(
      await copyToClipboard(
        { clipboard: { writeText: vi.fn().mockRejectedValue(new Error()) } },
        "x",
      ),
    ).toBe(false);
  });
});
