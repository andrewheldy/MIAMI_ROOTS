import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import HomePage from "@/app/(site)/page";
import GroupsPage from "@/app/(site)/groups/page";
import InvitePage from "@/app/(site)/invite/page";
import JoinPage from "@/app/join/page";
import { joinNavLink } from "@/config/navigation";
import { getPublishedGroups, getRoomClusters } from "@/content/groups";
import { COMMUNITY_GO_PATH } from "@/content/join/community-link";
import { chatLinks } from "@/content/join/chat-links";
import { JOIN_LINK_DISPLAY, JOIN_LINK_PLAIN } from "@/lib/share/destination";

/**
 * The community-first gateway (2026-08-16). These tests encode the four rules
 * the redesign exists to hold, so a future change cannot quietly undo them:
 * one call to action, no per-chat joining from the site, every room explained,
 * and an invite path that works with no account.
 *
 * They are rendered-markup tests rather than DOM tests because every assertion
 * here is about what ships in the server-rendered HTML.
 */

const pages = {
  home: renderToStaticMarkup(<HomePage />),
  join: renderToStaticMarkup(<JoinPage />),
  invite: renderToStaticMarkup(<InvitePage />),
  groups: renderToStaticMarkup(<GroupsPage />),
} as const;

/** React escapes text on render, so assertions compare escaped copy. */
function esc(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

/** Every `/go/...` destination in a page's markup. */
function goLinksIn(html: string): string[] {
  return [...html.matchAll(/href="(\/go\/[^"]*)"/g)].map((match) => match[1]!);
}

describe.each(Object.entries(pages))("%s page", (name, html) => {
  it("offers exactly one join destination, the parent community", () => {
    const destinations = new Set(goLinksIn(html));
    for (const destination of destinations) {
      expect(destination).toBe(COMMUNITY_GO_PATH);
    }
  });

  it("never links into an individual chat", () => {
    for (const chat of chatLinks) {
      expect(html).not.toContain(`/go/${chat.redirectSlug}`);
    }
  });

  it("renders exactly one h1", () => {
    expect(html.match(/<h1[\s>]/g)?.length).toBe(1);
  });

  it("ships no em-dashes or en-dashes in visible copy", () => {
    // An anti-slop rule the project adopted rather than excepted; see
    // docs/DESIGN_INTELLIGENCE.md §7. Hyphens and minus signs are fine.
    expect(html).not.toContain("—");
    expect(html).not.toContain("–");
  });

  it(`uses the one CTA label, "${joinNavLink.label}"`, () => {
    expect(html).toContain(joinNavLink.label);
    // The retired labels must not come back alongside it.
    expect(html).not.toContain("Join the community chats");
    expect(html).not.toContain("Join chat");
  });
});

describe("home page", () => {
  const html = pages.home;

  it("leads with the community, not a directory", () => {
    expect(html).toContain("Miami has a group chat.");
    expect(html).toContain(
      "One WhatsApp community, with a room for every part of life here,",
    );
  });

  it("says out loud that the action opens WhatsApp", () => {
    expect(html).toContain("Opens WhatsApp");
  });

  it("explains every published room, with who it is for and why it exists", () => {
    for (const group of getPublishedGroups()) {
      expect(html).toContain(esc(group.name));
      expect(html).toContain(esc(group.forYouIf));
      expect(html).toContain(esc(group.whyItExists));
    }
  });

  it("groups the rooms so seven of them read as a map, not a list", () => {
    for (const cluster of getRoomClusters()) {
      expect(html).toContain(esc(cluster.title));
      expect(html).toContain(esc(cluster.blurb));
    }
  });

  it("speaks to community leaders as a distinct audience", () => {
    expect(html).toContain("If you already run a community, bring it with you");
  });

  it("carries the invite tools: link, QR, and share", () => {
    expect(html).toContain(JOIN_LINK_DISPLAY);
    expect(html).toContain("The link to send them");
    expect(html).toContain("Send it to a friend");
    // The QR is generated at render, so the markup really contains one.
    expect(html).toMatch(/<svg[^>]*role="img"/);
  });

  it("teases rewards without promising or claiming to count anything", () => {
    expect(html).toContain("Nothing is counted yet");
    expect(html).not.toMatch(/\b(points|rewards) (?:balance|earned)\b/i);
  });
});

describe("join hub (the shared URL)", () => {
  const html = pages.join;

  it("keeps the one action above the room explanation", () => {
    expect(html.indexOf(joinNavLink.label)).toBeLessThan(
      html.indexOf("Seven rooms are waiting on the other side"),
    );
  });

  it("states the house rules before anybody knocks", () => {
    expect(html).toContain("Three things we ask of everybody");
    expect(html).toContain("Give before you take.");
  });

  it("lists each room with who it is for, and no way to open one", () => {
    for (const group of getPublishedGroups()) {
      expect(html).toContain(esc(group.forYouIf));
    }
    expect(html).not.toContain("Open the chat");
  });
});

describe("invite page", () => {
  const html = pages.invite;

  it("hands over a plain, pasteable link with no campaign parameters", () => {
    expect(html).toContain(JOIN_LINK_DISPLAY);
    expect(html).not.toContain("utm_medium=copy_link");
  });

  it("offers a message a member can send as-is", () => {
    expect(html).toContain("A message worth sending");
    expect(html).toContain(JOIN_LINK_PLAIN);
    expect(html).toContain(esc("Figured you'd fit right in"));
  });

  it("still lets someone who is not in yet join from here", () => {
    expect(html).toContain(joinNavLink.label);
  });
});

describe("rooms directory", () => {
  const html = pages.groups;

  it("shows every published room", () => {
    for (const group of getPublishedGroups()) {
      expect(html).toContain(esc(group.name));
      expect(html).toContain(esc(group.forYouIf));
    }
  });

  it("explains that rooms are not joined one by one", () => {
    expect(html).toContain("You do not join these one by one");
  });
});
