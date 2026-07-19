/**
 * Specifications for the downloadable share assets: exact pixel dimensions,
 * download filenames, and on-card copy. The rendering (canvas drawing) lives in
 * the client component; this data-only module is what the tests pin so the
 * filenames and dimensions can never silently drift.
 *
 * All copy here is PROVISIONAL, consistent with the rest of the gateway pending
 * an owner voice pass, and is public-safe (no invite links, phone numbers, or
 * private community data).
 */

export interface ShareAssetSpec {
  /** Stable key used by the UI and downloads. */
  readonly key: "standard" | "story" | "square";
  /** Human label for the download control. */
  readonly label: string;
  /** Output width in pixels. */
  readonly width: number;
  /** Output height in pixels. */
  readonly height: number;
  /** Download filename (kept stable — people re-share saved files). */
  readonly filename: string;
  /** Large headline drawn on the card (branded assets only). */
  readonly headline?: string;
  /** Supporting scan instruction drawn on the card. */
  readonly caption?: string;
}

/**
 * Standard square QR image — high resolution, white background, strong quiet
 * zone. The everyday "save to my phone" asset.
 */
export const STANDARD_QR_ASSET: ShareAssetSpec = {
  key: "standard",
  label: "Standard QR",
  width: 1024,
  height: 1024,
  filename: "miami-roots-qr.png",
};

/** Instagram Story card — 1080×1920, branded, QR kept clear of story overlays. */
export const STORY_ASSET: ShareAssetSpec = {
  key: "story",
  label: "Instagram Story",
  width: 1080,
  height: 1920,
  filename: "miami-roots-story.png",
  headline: "Meet your people in Miami.",
  caption: "Scan to join Miami Roots.",
};

/** Square social card — 1080×1080, branded. */
export const SQUARE_ASSET: ShareAssetSpec = {
  key: "square",
  label: "Square card",
  width: 1080,
  height: 1080,
  filename: "miami-roots-square.png",
  headline: "Put down roots with us.",
  caption: "Scan to join Miami Roots.",
};

export const SHARE_ASSETS: readonly ShareAssetSpec[] = [
  STANDARD_QR_ASSET,
  STORY_ASSET,
  SQUARE_ASSET,
];
