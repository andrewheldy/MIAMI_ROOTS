/**
 * Render a QR matrix to a self-contained SVG string.
 *
 * SVG is the on-screen format for the share UI: it stays perfectly sharp at any
 * device pixel ratio (no raster blur on retina screens), scales without a second
 * network request, and — given a fixed-aspect container — introduces no layout
 * shift when it appears. The same string is rasterized onto canvas for the
 * downloadable PNG assets, so screen and download are guaranteed identical.
 */

import type { QrMatrix } from "./encode";

export interface QrSvgOptions {
  /** Light margin around the code, in modules. QR spec minimum is 4. */
  readonly quietZone?: number;
  /** Dark-module color. */
  readonly dark?: string;
  /** Background (quiet-zone) color. */
  readonly light?: string;
  /**
   * Optional accessible label. When provided the SVG carries `role="img"` and a
   * `<title>`; when omitted the SVG is marked `aria-hidden` (decorative — the
   * surrounding UI supplies the label and a visible URL).
   */
  readonly title?: string;
}

const DEFAULTS = {
  quietZone: 4,
  dark: "#003f2c",
  light: "#ffffff",
} as const;

/**
 * Build a `<path>` `d` string covering every dark module as a 1×1 rect at its
 * grid coordinate (offset by the quiet zone). One path for the whole code keeps
 * the SVG small and the render fast.
 */
export function qrToPathData(matrix: QrMatrix, quietZone: number): string {
  const parts: string[] = [];
  for (let y = 0; y < matrix.size; y++) {
    const cells = matrix.modules[y];
    if (!cells) {
      continue;
    }
    for (let x = 0; x < matrix.size; x++) {
      if (cells[x]) {
        parts.push(`M${x + quietZone} ${y + quietZone}h1v1h-1z`);
      }
    }
  }
  return parts.join("");
}

/** Full side length of the rendered SVG viewBox, in modules. */
export function qrViewBoxSize(matrix: QrMatrix, quietZone: number): number {
  return matrix.size + quietZone * 2;
}

/** Render a QR matrix to a complete, standalone SVG document string. */
export function qrToSvg(matrix: QrMatrix, options: QrSvgOptions = {}): string {
  const quietZone = options.quietZone ?? DEFAULTS.quietZone;
  const dark = options.dark ?? DEFAULTS.dark;
  const light = options.light ?? DEFAULTS.light;
  const dimension = qrViewBoxSize(matrix, quietZone);
  const path = qrToPathData(matrix, quietZone);

  const a11y = options.title
    ? `role="img" aria-label="${escapeXml(options.title)}"`
    : `aria-hidden="true"`;
  const titleEl = options.title
    ? `<title>${escapeXml(options.title)}</title>`
    : "";

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${dimension} ${dimension}" ` +
    `width="100%" height="100%" shape-rendering="crispEdges" ${a11y}>` +
    `${titleEl}` +
    `<rect width="${dimension}" height="${dimension}" fill="${light}"/>` +
    `<path d="${path}" fill="${dark}"/>` +
    `</svg>`
  );
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
