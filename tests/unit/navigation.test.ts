import { describe, expect, it } from "vitest";

import {
  desktopNavLinks,
  joinNavLink,
  mainNavLinks,
} from "@/config/navigation";
import { COMMUNITY_GO_PATH } from "@/content/join/community-link";

describe("navigation configuration", () => {
  it("exposes the expected primary links in order", () => {
    expect(mainNavLinks.map((l) => l.href)).toEqual([
      "/",
      "/groups",
      "/guidelines",
      "/invite",
    ]);
  });

  it("routes the one CTA to the parent community redirect", () => {
    expect(joinNavLink.href).toBe(COMMUNITY_GO_PATH);
    expect(joinNavLink.href).toBe("/go/community");
    expect(joinNavLink.label).toBe("Join the community");
    // Following it leaves the site for WhatsApp; surfaces say so out loud.
    expect(joinNavLink.external).toBe(true);
  });

  it("hides Home from the desktop bar (the logo is the route home)", () => {
    expect(desktopNavLinks.map((l) => l.href)).toEqual([
      "/groups",
      "/guidelines",
      "/invite",
    ]);
    expect(desktopNavLinks.some((l) => l.href === "/")).toBe(false);
  });

  it("keeps the CTA out of the ordinary link lists", () => {
    expect(mainNavLinks.some((l) => l.href === joinNavLink.href)).toBe(false);
    expect(desktopNavLinks.some((l) => l.href === joinNavLink.href)).toBe(
      false,
    );
  });

  it("never links a visitor into an individual chat", () => {
    for (const link of [...mainNavLinks, joinNavLink]) {
      expect(link.href.startsWith("/go/")).toBe(
        link.href === COMMUNITY_GO_PATH,
      );
    }
  });

  it("gives every link a non-empty label and internal href", () => {
    for (const link of [...mainNavLinks, joinNavLink]) {
      expect(link.label.trim().length).toBeGreaterThan(0);
      expect(link.href.startsWith("/")).toBe(true);
    }
  });
});
