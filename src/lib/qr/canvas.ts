/**
 * Draw a QR matrix onto a 2D canvas context at crisp, integer module
 * boundaries. Used to rasterize the downloadable PNG assets (standard code,
 * Instagram Story card, square social card). Kept separate from the encoder and
 * SVG helpers so the drawing math is reusable and side-effect free apart from
 * the canvas writes the caller asked for.
 */

import type { QrMatrix } from "./encode";

/** The subset of `CanvasRenderingContext2D` this helper touches. */
export interface QrCanvasContext {
  fillStyle: string | CanvasGradient | CanvasPattern;
  fillRect(x: number, y: number, w: number, h: number): void;
}

export interface DrawQrOptions {
  /** Top-left x of the QR block (including its quiet zone), in device pixels. */
  readonly x: number;
  /** Top-left y of the QR block (including its quiet zone), in device pixels. */
  readonly y: number;
  /** Side length of the whole block (code + quiet zone), in device pixels. */
  readonly size: number;
  /** Quiet-zone width in modules (default 4, the QR spec minimum). */
  readonly quietZone?: number;
  readonly dark?: string;
  readonly light?: string;
}

/**
 * Fill a `size × size` square with the QR code (light quiet zone included) at
 * `(x, y)`. Module coordinates are rounded so edges land on whole pixels and the
 * code scans reliably regardless of the chosen size.
 */
export function drawQrOnCanvas(
  ctx: QrCanvasContext,
  matrix: QrMatrix,
  options: DrawQrOptions,
): void {
  const quietZone = options.quietZone ?? 4;
  const dark = options.dark ?? "#003f2c";
  const light = options.light ?? "#ffffff";
  const modules = matrix.size + quietZone * 2;
  const scale = options.size / modules;

  ctx.fillStyle = light;
  ctx.fillRect(options.x, options.y, options.size, options.size);

  ctx.fillStyle = dark;
  for (let row = 0; row < matrix.size; row++) {
    const cells = matrix.modules[row];
    if (!cells) {
      continue;
    }
    for (let col = 0; col < matrix.size; col++) {
      if (!cells[col]) {
        continue;
      }
      const px = options.x + Math.round((col + quietZone) * scale);
      const py = options.y + Math.round((row + quietZone) * scale);
      const pxEnd = options.x + Math.round((col + quietZone + 1) * scale);
      const pyEnd = options.y + Math.round((row + quietZone + 1) * scale);
      ctx.fillRect(px, py, pxEnd - px, pyEnd - py);
    }
  }
}
