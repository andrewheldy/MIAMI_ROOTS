import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  categoryLabels,
  communityGroups,
  getGroupBySlug,
  getPublishedGroups,
  getRelatedGroups,
} from "@/content/groups";

/** Read a PNG's intrinsic dimensions from its IHDR chunk (no image deps). */
function readPngSize(absPath: string): { width: number; height: number } {
  const buf = readFileSync(absPath);
  // PNG signature is 8 bytes; IHDR width/height are big-endian uint32 at 16/20.
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function publicPath(src: string): string {
  return fileURLToPath(new URL(`../../public${src}`, import.meta.url));
}

describe("community group content integrity", () => {
  it("exposes the six MVP groups and excludes out-of-scope Ticket Exchange", () => {
    const slugs = communityGroups.map((g) => g.slug);
    expect(slugs).toHaveLength(6);
    expect(slugs).not.toContain("ticket-exchange");
    expect(new Set(slugs).size).toBe(slugs.length); // no duplicates
  });

  it("uses only kebab-case slugs", () => {
    for (const group of communityGroups) {
      expect(group.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it("keeps short descriptions within the card budget (<=140 chars)", () => {
    for (const group of communityGroups) {
      expect(group.shortDescription.length).toBeLessThanOrEqual(140);
      expect(group.shortDescription.length).toBeGreaterThan(0);
    }
  });

  it("gives every group non-empty required content and a valid category", () => {
    for (const group of communityGroups) {
      expect(group.name.trim()).not.toBe("");
      expect(group.fullDescription.trim().length).toBeGreaterThan(0);
      expect(group.belongs.length).toBeGreaterThan(0);
      expect(group.doesNotBelong.length).toBeGreaterThan(0);
      expect(group.etiquette.length).toBeGreaterThan(0);
      expect(group.metadata.title.trim()).not.toBe("");
      expect(group.metadata.description.trim()).not.toBe("");
      expect(Object.keys(categoryLabels)).toContain(group.category);
      expect(group.order).toBeGreaterThan(0);
    }
  });

  it("never embeds a WhatsApp invite link or raw phone number", () => {
    const serialized = JSON.stringify(communityGroups);
    expect(serialized).not.toMatch(/chat\.whatsapp\.com/i);
    expect(serialized).not.toMatch(/wa\.me/i);
    // No obvious phone-number-looking runs of digits in public copy.
    expect(serialized).not.toMatch(/\+?\d[\d ()-]{8,}\d/);
  });

  it("points every declared logo at a real asset with matching dimensions", () => {
    for (const group of communityGroups) {
      if (!group.logo) continue;
      const abs = publicPath(group.logo.src);
      expect(existsSync(abs), `${group.logo.src} should exist`).toBe(true);
      const { width, height } = readPngSize(abs);
      expect(width).toBe(group.logo.width);
      expect(height).toBe(group.logo.height);
    }
  });

  it("resolves every related slug to a published group", () => {
    for (const group of communityGroups) {
      for (const slug of group.related ?? []) {
        expect(getGroupBySlug(slug), `related slug ${slug}`).toBeDefined();
      }
    }
  });
});

describe("getPublishedGroups", () => {
  it("returns only active groups, sorted by display order", () => {
    const published = getPublishedGroups();
    expect(published.every((g) => g.status === "active")).toBe(true);
    const orders = published.map((g) => g.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });
});

describe("getGroupBySlug", () => {
  it("returns the group for a valid, published slug", () => {
    const group = getGroupBySlug("daytime-events");
    expect(group?.name).toBe("Daytime Events");
  });

  it("returns undefined for an unknown slug (drives 404)", () => {
    expect(getGroupBySlug("does-not-exist")).toBeUndefined();
    expect(getGroupBySlug("ticket-exchange")).toBeUndefined();
  });

  it("is case-sensitive on the canonical slug", () => {
    expect(getGroupBySlug("Daytime-Events")).toBeUndefined();
  });
});

describe("getRelatedGroups", () => {
  it("returns published, order-sorted related groups", () => {
    const group = getGroupBySlug("daytime-events");
    expect(group).toBeDefined();
    const related = getRelatedGroups(group!);
    expect(related.length).toBeGreaterThan(0);
    expect(related.every((g) => g.status === "active")).toBe(true);
    expect(related.map((g) => g.slug)).not.toContain(group!.slug);
  });
});
