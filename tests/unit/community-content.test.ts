import { describe, expect, it } from "vitest";

import { communityGroups, getCommunityGroup } from "@/features/groups/content";

describe("community content", () => {
  it("publishes exactly the six current communities", () => {
    expect(communityGroups).toHaveLength(6);
    expect(communityGroups.map((group) => group.slug)).not.toContain(
      "ticket-exchange",
    );
  });

  it("keeps canonical slugs unique and resolvable", () => {
    const slugs = communityGroups.map((group) => group.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(getCommunityGroup(slug)?.slug).toBe(slug);
    }
  });

  it("preserves the two group-specific safety statements", () => {
    const nightlife = getCommunityGroup("nightlife-and-event-marketing");
    const sober = getCommunityGroup("sober-social");

    expect(nightlife?.rules.join(" ").toLowerCase()).toContain(
      "no ticket reselling",
    );
    expect(sober?.fullDescription.toLowerCase()).toContain(
      "not a treatment or clinical recovery service",
    );
  });

  it("has complete public detail content for every community", () => {
    for (const group of communityGroups) {
      expect(group.shortDescription.length).toBeGreaterThan(20);
      expect(group.fullDescription.length).toBeGreaterThan(60);
      expect(group.whoItsFor).toHaveLength(3);
      expect(group.rules).toHaveLength(3);
    }
  });
});
