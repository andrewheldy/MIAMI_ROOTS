import { describe, expect, it } from "vitest";

import { chatLinks } from "@/content/join/chat-links";
import {
  COMMUNITY_GO_PATH,
  communityInvite,
  isCommunityRedirectSlug,
} from "@/content/join/community-link";
import { APPROVED_REDIRECT_HOSTS } from "@/lib/chat-redirect";

/**
 * The parent community invite is the site's single destination, so the rules
 * that keep it safe are worth failing a build over.
 */
describe("community invite link", () => {
  it("contains no invite URL, only the name of an environment variable", () => {
    const source = JSON.stringify(communityInvite);
    expect(source).not.toMatch(/https?:\/\//);
    for (const host of APPROVED_REDIRECT_HOSTS) {
      expect(source).not.toContain(host);
    }
    expect(communityInvite.envVar).toBe("WHATSAPP_COMMUNITY_URL");
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

  it("reads its environment variable from the server-only namespace", () => {
    // A NEXT_PUBLIC_ prefix would ship the invite link in the client bundle.
    expect(communityInvite.envVar.startsWith("NEXT_PUBLIC_")).toBe(false);
  });
});
