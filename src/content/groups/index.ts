import { communityGroups } from "./groups";
import type { CommunityGroup, GroupCategory } from "./types";

export type { CommunityGroup, GroupCategory, GroupStatus } from "./types";
export { communityGroups } from "./groups";

/** Human-readable labels for editorial categories. */
export const categoryLabels: Record<GroupCategory, string> = {
  everyday: "Everyday",
  business: "Business",
  nightlife: "Nightlife",
  wellness: "Wellness",
  community: "Community",
  events: "Events",
};

/**
 * Build a slug → group index once, and fail loudly on a duplicate slug. Slugs are
 * the public, permanent identity of a group; a duplicate is a content bug that
 * must never reach a page, so we reject it at module load (which means at build).
 */
const bySlug: ReadonlyMap<string, CommunityGroup> = (() => {
  const map = new Map<string, CommunityGroup>();
  for (const group of communityGroups) {
    if (map.has(group.slug)) {
      throw new Error(
        `Duplicate community group slug "${group.slug}" — slugs must be unique.`,
      );
    }
    map.set(group.slug, group);
  }
  return map;
})();

/** All publicly visible groups (status `active`), sorted by display order. */
export function getPublishedGroups(): CommunityGroup[] {
  return communityGroups
    .filter((group) => group.status === "active")
    .sort((a, b) => a.order - b.order);
}

/**
 * Look up a single published group by slug. Returns `undefined` for unknown slugs
 * and for non-active groups, so callers can render a 404 without leaking hidden
 * or archived content.
 */
export function getGroupBySlug(slug: string): CommunityGroup | undefined {
  const group = bySlug.get(slug);
  return group && group.status === "active" ? group : undefined;
}

/** Published groups the given group links to, in display order. */
export function getRelatedGroups(group: CommunityGroup): CommunityGroup[] {
  if (!group.related) return [];
  return group.related
    .map((slug) => getGroupBySlug(slug))
    .filter((g): g is CommunityGroup => g !== undefined)
    .sort((a, b) => a.order - b.order);
}
