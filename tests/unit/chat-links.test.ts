import { describe, expect, it } from "vitest";

import { getGroupBySlug, getPublishedGroups } from "@/content/groups";
import {
  chatLinks,
  getChatLinkByGroupSlug,
  getChatLinkByRedirectSlug,
  getGoPath,
} from "@/content/join/chat-links";

/** The shipped redirect + env contract, in hub display order (Ticket Exchange
 * sits with the event-oriented communities, after Nightlife). */
const expectedContract = [
  ["general-chat", "WHATSAPP_GENERAL_CHAT_URL"],
  ["business-connections", "WHATSAPP_BUSINESS_CONNECTIONS_URL"],
  ["daytime-events", "WHATSAPP_DAYTIME_EVENTS_URL"],
  ["nightlife-events", "WHATSAPP_NIGHTLIFE_EVENTS_URL"],
  ["ticket-exchange", "WHATSAPP_TICKET_EXCHANGE_URL"],
  ["community-organizing", "WHATSAPP_COMMUNITY_ORGANIZING_URL"],
  ["sober-support", "WHATSAPP_SOBER_SUPPORT_URL"],
] as const;

describe("chat-link registry", () => {
  it("ships exactly the seven approved redirect slugs and env vars, in order", () => {
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

  it("includes Ticket Exchange mapped to its own redirect slug and env var", () => {
    const ticket = chatLinks.find((l) => l.groupSlug === "ticket-exchange");
    expect(ticket).toBeDefined();
    expect(ticket!.redirectSlug).toBe("ticket-exchange");
    expect(ticket!.envVar).toBe("WHATSAPP_TICKET_EXCHANGE_URL");
    expect(ticket!.featured).toBeFalsy();
  });

  it("gives every published group exactly one chat link", () => {
    const published = getPublishedGroups();
    expect(chatLinks).toHaveLength(published.length);
    for (const group of published) {
      const link = getChatLinkByGroupSlug(group.slug);
      expect(link, `chat link for ${group.slug}`).toBeDefined();
    }
  });

  it("keeps redirect slugs, group slugs, and env vars unique", () => {
    const redirectSlugs = chatLinks.map((l) => l.redirectSlug);
    const groupSlugs = chatLinks.map((l) => l.groupSlug);
    const envVars = chatLinks.map((l) => l.envVar);
    expect(new Set(redirectSlugs).size).toBe(redirectSlugs.length);
    expect(new Set(groupSlugs).size).toBe(groupSlugs.length);
    expect(new Set(envVars).size).toBe(envVars.length);
  });

  it("features exactly one recommended starting chat: General Chat", () => {
    const featured = chatLinks.filter((l) => l.featured);
    expect(featured).toHaveLength(1);
    expect(featured[0]!.groupSlug).toBe("general-chat");
  });

  it("keeps General Chat first — Ticket Exchange does not displace it", () => {
    expect(chatLinks[0]!.groupSlug).toBe("general-chat");
    const ticketIndex = chatLinks.findIndex(
      (l) => l.groupSlug === "ticket-exchange",
    );
    expect(ticketIndex).toBeGreaterThan(0);
  });

  it("never embeds a WhatsApp invite URL or any URL at all", () => {
    const serialized = JSON.stringify(chatLinks);
    expect(serialized).not.toMatch(/chat\.whatsapp\.com/i);
    expect(serialized).not.toMatch(/wa\.me/i);
    expect(serialized).not.toMatch(/https?:\/\//i);
  });
});

describe("getChatLinkByRedirectSlug", () => {
  it("returns the entry for a known redirect slug", () => {
    expect(getChatLinkByRedirectSlug("sober-support")?.groupSlug).toBe(
      "sober-social",
    );
    expect(getChatLinkByRedirectSlug("ticket-exchange")?.groupSlug).toBe(
      "ticket-exchange",
    );
  });

  it("returns undefined for unknown slugs (drives 404)", () => {
    expect(getChatLinkByRedirectSlug("does-not-exist")).toBeUndefined();
    // Group slugs that differ from the redirect contract are not valid paths.
    expect(getChatLinkByRedirectSlug("sober-social")).toBeUndefined();
    expect(
      getChatLinkByRedirectSlug("nightlife-and-event-marketing"),
    ).toBeUndefined();
  });
});

describe("getChatLinkByGroupSlug / getGoPath", () => {
  it("resolves a group slug to its chat link", () => {
    expect(
      getChatLinkByGroupSlug("nightlife-and-event-marketing")?.redirectSlug,
    ).toBe("nightlife-events");
  });

  it("builds the controlled /go path from a group slug", () => {
    expect(getGoPath("general-chat")).toBe("/go/general-chat");
    expect(getGoPath("sober-social")).toBe("/go/sober-support");
    expect(getGoPath("ticket-exchange")).toBe("/go/ticket-exchange");
  });

  it("returns undefined for a group with no chat mapping", () => {
    expect(getGoPath("does-not-exist")).toBeUndefined();
    expect(getChatLinkByGroupSlug("does-not-exist")).toBeUndefined();
  });
});
