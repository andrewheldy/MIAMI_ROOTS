import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Server-side discovery of the `/join` hero media. The production assets
 * (`public/media/miami-roots-hero.{mp4,webm}` + poster) are owner-supplied and
 * not committed yet — see `docs/04-design/join-hero-media.md` — so the page
 * checks the filesystem at render time and only advertises files that exist.
 * Missing video ⇒ the hero renders the poster alone; missing poster ⇒ it falls
 * back to the committed community banner. No broken media states either way.
 */

export interface HeroVideoSource {
  /** Public URL path, e.g. `/media/miami-roots-hero.webm`. */
  readonly src: string;
  /** MIME type for the `<source>` element. */
  readonly type: string;
}

export interface JoinHeroMedia {
  /** Poster/fallback image path (always resolvable). */
  readonly poster: string;
  /** Video sources that actually exist on disk, best format first. */
  readonly sources: readonly HeroVideoSource[];
}

const HERO_POSTER = "/media/miami-roots-hero-poster.webp";
const FALLBACK_POSTER = "/brand/banners/miami-roots-community-banner.png";

/** WebM first (better compression where supported); MP4 covers Safari. */
const HERO_VIDEOS: readonly HeroVideoSource[] = [
  { src: "/media/miami-roots-hero.webm", type: "video/webm" },
  { src: "/media/miami-roots-hero.mp4", type: "video/mp4" },
];

function existsInPublic(publicPath: string): boolean {
  return existsSync(path.join(process.cwd(), "public", publicPath));
}

export function getJoinHeroMedia(): JoinHeroMedia {
  return {
    poster: existsInPublic(HERO_POSTER) ? HERO_POSTER : FALLBACK_POSTER,
    sources: HERO_VIDEOS.filter((video) => existsInPublic(video.src)),
  };
}
