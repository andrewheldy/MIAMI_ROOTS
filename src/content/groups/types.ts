/**
 * Typed public content model for Miami Roots community groups (Milestone 2).
 *
 * This module is the CANONICAL, in-code source of public group content for this
 * phase. It is a deliberate interim: Milestone 4 moves this same content into the
 * `community_groups` database table (see
 * `docs/01-product/community-content-requirements.md`). The field shape here mirrors
 * that planned row so the migration is a lift, not a redesign.
 *
 * Hard content rules enforced by convention here and by tests in
 * `tests/unit/groups.test.ts`:
 *   - PUBLIC-SAFE ONLY. No WhatsApp invite links, phone numbers, member/admin
 *     names, chat contents, member counts, or private screenshots. Ever.
 *   - Slugs are stable forever once public and must be unique.
 *   - Display names may be provisional where repository sources conflict
 *     (open question #10) — that provisional status lives on the data (see
 *     `displayNameProvisional`), not smeared across the UI.
 */

/** Editorial grouping used to organize the directory. Not a WhatsApp construct. */
export type GroupCategory =
  "everyday" | "business" | "nightlife" | "wellness" | "community" | "events";

/**
 * Lifecycle status. Only `active` groups are rendered publicly; `hidden` and
 * `archived` exist so a group can be pulled from the site without deleting its
 * stable slug/history. Mirrors the planned DB `status` enum.
 */
export type GroupStatus = "active" | "hidden" | "archived";

/**
 * How a visitor can currently reach the group. No real public destinations exist
 * yet (invite access is admin-managed and gated — see
 * `docs/03-architecture/privacy-and-safety.md`), so the UI renders an honest state
 * rather than a dead button or a fake link.
 *
 *   - `managed-by-admins`: invite access is handled by community administrators.
 *   - `coming-soon`: a public destination is planned but not available yet.
 */
export type GroupAccessState = "managed-by-admins" | "coming-soon";

/** An approved, repository-committed logo asset with its real intrinsic size. */
export interface GroupLogoAsset {
  /** Path under `public/`, e.g. `/group-logos/daytime-events-logo.png`. */
  readonly src: string;
  /** Intrinsic pixel width — prevents layout shift; must match the file. */
  readonly width: number;
  /** Intrinsic pixel height — prevents layout shift; must match the file. */
  readonly height: number;
  /**
   * The wordmark actually rendered inside the artwork, when it differs from the
   * group's operating name (open question #10). Recorded so the UI and reviewers
   * know the logo says "Daytime Roots" even though the group is "Daytime Events".
   */
  readonly wordmark?: string;
}

/** A short, self-contained safety or expectation notice shown on the group page. */
export interface GroupNotice {
  /** Panel heading, e.g. "A note on tickets". */
  readonly title: string;
  /** One or more plain-language lines. Kept practical, never alarmist. */
  readonly body: readonly string[];
  /** Visual tone. `info` for neutral context, `caution` for safety-relevant. */
  readonly tone: "info" | "caution";
}

/**
 * A concise, reusable safety treatment for a group whose activity carries
 * member-to-member risk (currently only Ticket Exchange's peer ticket trades).
 * Kept data-only and general so any future group can opt in without new UI:
 * cards render the `badge` + `summary`, the detail page renders the full
 * `points` checklist and the `disclaimer`.
 */
export interface GroupSafety {
  /** Restrained inline pill, e.g. "Buy & sell safely". */
  readonly badge: string;
  /** One short line for cards and previews — mobile-readable. */
  readonly summary: string;
  /** The practical checklist. Fuller version lives on the detail page. */
  readonly points: readonly string[];
  /** The Miami Roots non-guarantee line. Stated plainly, never over-lawyered. */
  readonly disclaimer: string;
}

/** Per-page SEO/social metadata. Kept provisional alongside the copy. */
export interface GroupMetadata {
  /** Page `<title>` (parent template appends " · Miami Roots"). */
  readonly title: string;
  /** `<meta name="description">` — concise, honest, no hype. */
  readonly description: string;
}

/**
 * The canonical public content for one community group. Presentation lives in
 * components; this stays data-only.
 */
export interface CommunityGroup {
  /** Stable, kebab-case internal identifier. URL segment. Never changes. */
  readonly slug: string;
  /** Public display name. */
  readonly name: string;
  /**
   * True when `name` is not yet reconciled against the real WhatsApp group /
   * logo wordmark (open question #10). Surfaced subtly (a small "provisional
   * name" badge), not as UI-wide noise.
   */
  readonly displayNameProvisional?: boolean;
  /** ≤140 chars. Directory-card summary. */
  readonly shortDescription: string;
  /** Longer public description for the detail page. */
  readonly fullDescription: string;
  /** Editorial category. */
  readonly category: GroupCategory;
  /** Lifecycle status; only `active` renders publicly. */
  readonly status: GroupStatus;
  /**
   * Approved logo asset, or `null` when none exists yet (three MVP groups have
   * no dedicated mark — the UI falls back to the parent mark, never a broken
   * image).
   */
  readonly logo: GroupLogoAsset | null;
  /** Current access state — drives the honest CTA. */
  readonly access: GroupAccessState;
  /** Integer sort key for the directory (owner-set). */
  readonly order: number;
  /** What kind of posts/behavior belong in the group. */
  readonly belongs: readonly string[];
  /** What does not belong (rules), e.g. the no-resale rule for Nightlife. */
  readonly doesNotBelong: readonly string[];
  /** Community etiquette lines specific/relevant to this group. */
  readonly etiquette: readonly string[];
  /** Optional safety/expectation notice(s). */
  readonly notices?: readonly GroupNotice[];
  /**
   * Optional concise safety treatment, surfaced on cards and the detail page
   * for groups whose activity carries member-to-member risk (Ticket Exchange).
   */
  readonly safety?: GroupSafety;
  /** Slugs of related groups to cross-link. Validated to exist. */
  readonly related?: readonly string[];
  /** Per-page metadata. */
  readonly metadata: GroupMetadata;
}
