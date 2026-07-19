import { describe, expect, it } from "vitest";

import { getGroupBySlug } from "@/content/groups";
import {
  chatLinks,
  communityEntrance,
  getChatLinkByGroupSlug,
  getChatLinkByRedirectSlug,
} from "@/content/join/chat-links";

/** The shipped redirect + env contract, in hub display order. */
const expectedContract = [
  ["general-chat", "WHATSAPP_GENERAL_CHAT_URL"],
  ["business-connections", "WHATSAPP_BUSINESS_CONNECTIONS_URL"],
  ["daytime-events", "WHATSAPP_DAYTIME_EVENTS_URL"],
  ["nightlife-events", "WHATSAPP_NIGHTLIFE_EVENTS_URL"],
  ["community-organizing", "WHATSAPP_COMMUNITY_ORGANIZING_URL"],
  ["sober-support", "WHATSAPP_SOBER_SUPPORT_URL"],
] as const;

describe("chat-link registry", () => {
  it("ships exactly the six approved redirect slugs and env vars, in order", () => {
    expect(chatLinks.map((l) => [l.redirectSlug, l.envVar])).toEqual(
      expectedContract.map((pair) => [...pair]),
    );
  });

  it("resolves every entry to a published community group", () => {
    for (const link of chatLinks) {
      expect(
        getGroupBySlug(link.groupSlug),
        `group slug ${link.groupSlug}`,
      ).toBeDefined();
    }
  });

  it("excludes Ticket Exchange", () => {
    expect(chatLinks.map((l) => l.groupSlug)).not.toContain("ticket-exchange");
    expect(chatLinks.map((l) => l.redirectSlug)).not.toContain(
      "ticket-exchange",
    );
  });

  it("keeps redirect slugs and env vars unique", () => {
    const slugs = chatLinks.map((l) => l.redirectSlug);
    const envVars = chatLinks.map((l) => l.envVar);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(envVars).size).toBe(envVars.length);
  });

  it("features exactly one recommended starting chat: General Chat", () => {
    const featured = chatLinks.filter((l) => l.featured);
    expect(featured).toHaveLength(1);
    expect(featured[0]!.groupSlug).toBe("general-chat");
  });

  it("never embeds a WhatsApp invite URL or any URL at all", () => {
    const serialized = JSON.stringify([chatLinks, communityEntrance]);
    expect(serialized).not.toMatch(/chat\.whatsapp\.com/i);
    expect(serialized).not.toMatch(/wa\.me/i);
    expect(serialized).not.toMatch(/https?:\/\//i);
  });
});

describe("community entrance", () => {
  it("ships the main-community redirect contract", () => {
    expect(communityEntrance.redirectSlug).toBe("community");
    expect(communityEntrance.envVar).toBe("WHATSAPP_COMMUNITY_URL");
  });

  it("does not collide with any subgroup redirect slug or env var", () => {
    expect(chatLinks.map((l) => l.redirectSlug)).not.toContain(
      communityEntrance.redirectSlug,
    );
    expect(chatLinks.map((l) => l.envVar)).not.toContain(
      communityEntrance.envVar,
    );
  });

  it("is not reachable through the subgroup lookup (the /go route handles it explicitly)", () => {
    expect(getChatLinkByRedirectSlug("community")).toBeUndefined();
  });
});

describe("getChatLinkByGroupSlug", () => {
  it("maps every published chat-linked group back to its canonical /go slug", () => {
    expect(getChatLinkByGroupSlug("sober-social")?.redirectSlug).toBe(
      "sober-support",
    );
    expect(
      getChatLinkByGroupSlug("nightlife-and-event-marketing")?.redirectSlug,
    ).toBe("nightlife-events");
    for (const link of chatLinks) {
      expect(getChatLinkByGroupSlug(link.groupSlug)).toBe(link);
    }
  });

  it("returns undefined for groups without a public chat", () => {
    expect(getChatLinkByGroupSlug("ticket-exchange")).toBeUndefined();
    expect(getChatLinkByGroupSlug("does-not-exist")).toBeUndefined();
  });
});

describe("getChatLinkByRedirectSlug", () => {
  it("returns the entry for a known redirect slug", () => {
    expect(getChatLinkByRedirectSlug("sober-support")?.groupSlug).toBe(
      "sober-social",
    );
  });

  it("returns undefined for unknown slugs (drives 404)", () => {
    expect(getChatLinkByRedirectSlug("ticket-exchange")).toBeUndefined();
    expect(getChatLinkByRedirectSlug("does-not-exist")).toBeUndefined();
    // Group slugs that differ from the redirect contract are not valid paths.
    expect(getChatLinkByRedirectSlug("sober-social")).toBeUndefined();
    expect(
      getChatLinkByRedirectSlug("nightlife-and-event-marketing"),
    ).toBeUndefined();
  });
});
