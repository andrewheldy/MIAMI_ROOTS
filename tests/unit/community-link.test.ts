import { describe, expect, it } from "vitest";

import { chatLinks } from "@/content/join/chat-links";
import {
  COMMUNITY_GO_PATH,
  communityInvite,
  isCommunityRedirectSlug,
  MIAMI_ROOTS_COMMUNITY_URL,
} from "@/content/join/community-link";
import { resolveChatDestination } from "@/lib/chat-redirect";

/**
 * The parent community invite is the site's single destination, so the rules
 * that keep it safe are worth failing a build over.
 *
 * Since 2026-08-17 the destination is a build-time constant rather than an
 * environment variable, which removes the failure mode that produced the "door
 * is being rekeyed" page in production. What replaces the env-var validation is
 * this file: the constant is checked against the same host allowlist the
 * per-chat links pass through, at test time instead of request time.
 */
describe("community invite link", () => {
  it("is an https URL on an approved WhatsApp host", () => {
    const destination = resolveChatDestination(MIAMI_ROOTS_COMMUNITY_URL);
    expect(destination).toEqual({ ok: true, url: MIAMI_ROOTS_COMMUNITY_URL });
  });

  it("is the canonical Miami Roots community invite", () => {
    expect(MIAMI_ROOTS_COMMUNITY_URL).toBe(
      "https://chat.whatsapp.com/CmU2plRQshq9h9k11B6ywS",
    );
  });

  it("is written down exactly once, and the registry reuses it", () => {
    expect(communityInvite.url).toBe(MIAMI_ROOTS_COMMUNITY_URL);
  });

  it("needs no environment variable", () => {
    // The registry carries a destination, not the name of a variable that a
    // deployment can forget to set.
    expect(communityInvite).not.toHaveProperty("envVar");
    expect(JSON.stringify(communityInvite)).not.toContain("WHATSAPP_");
  });

  it("keeps its public path stable, because it is printed and pasted", () => {
    expect(communityInvite.redirectSlug).toBe("community");
    expect(COMMUNITY_GO_PATH).toBe("/go/community");
  });

  it("does not collide with any per-chat redirect slug", () => {
    const chatSlugs = chatLinks.map((link) => link.redirectSlug);
    expect(chatSlugs).not.toContain(communityInvite.redirectSlug);
  });

  it("recognizes only its own slug as the community route", () => {
    expect(isCommunityRedirectSlug("community")).toBe(true);
    expect(isCommunityRedirectSlug("general-chat")).toBe(false);
    expect(isCommunityRedirectSlug("")).toBe(false);
  });
});
