"use client";

/**
 * Client-side generation of the downloadable share assets. Each asset is drawn
 * onto an offscreen canvas from the same stable QR (`QR_SHARE_URL`) and exported
 * as a PNG, so nothing is fetched from a server and the codes always point at the
 * stable join URL. Rendering failures reject so the UI can show an error state.
 */

import { drawQrOnCanvas } from "@/lib/qr/canvas";
import { encodeQr } from "@/lib/qr/encode";
import type { QrMatrix } from "@/lib/qr/encode";
import {
  SQUARE_ASSET,
  STANDARD_QR_ASSET,
  STORY_ASSET,
} from "@/lib/share/assets";
import type { ShareAssetSpec } from "@/lib/share/assets";
import { QR_SHARE_URL } from "@/lib/share/destination";

const FOREST = "#003f2c";
const MINT = "#96d2c9";
const WHITE = "#ffffff";
const LOGO_SRC = "/brand/logos/miami-roots-logo.png";
const DISPLAY_URL = "miami-roots.vercel.app/join";
const FONT_STACK =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null); // graceful: assets still render without the logo
    img.src = src;
  });
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
): void {
  const r = Math.min(radius, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawWordmark(
  ctx: CanvasRenderingContext2D,
  logo: HTMLImageElement | null,
  centerX: number,
  y: number,
  logoSize: number,
): void {
  if (logo) {
    const radius = logoSize * 0.22;
    ctx.save();
    roundedRect(ctx, centerX - logoSize / 2, y, logoSize, logoSize, radius);
    ctx.clip();
    ctx.drawImage(logo, centerX - logoSize / 2, y, logoSize, logoSize);
    ctx.restore();
  }
  ctx.fillStyle = MINT;
  ctx.font = `700 ${Math.round(logoSize * 0.42)}px ${FONT_STACK}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("MIAMI ROOTS", centerX, y + logoSize + logoSize * 0.5);
}

function drawCenteredText(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  y: number,
  fontSize: number,
  color: string,
  weight = 700,
): void {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${fontSize}px ${FONT_STACK}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(text, centerX, y);
}

function drawQrCard(
  ctx: CanvasRenderingContext2D,
  matrix: QrMatrix,
  centerX: number,
  top: number,
  cardSize: number,
): void {
  const cardX = centerX - cardSize / 2;
  ctx.save();
  ctx.fillStyle = WHITE;
  roundedRect(ctx, cardX, top, cardSize, cardSize, cardSize * 0.06);
  ctx.fill();
  ctx.restore();
  const pad = cardSize * 0.08;
  drawQrOnCanvas(ctx, matrix, {
    x: cardX + pad,
    y: top + pad,
    size: cardSize - pad * 2,
    dark: FOREST,
    light: WHITE,
  });
}

function createCanvas(spec: ShareAssetSpec): {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
} {
  const canvas = document.createElement("canvas");
  canvas.width = spec.width;
  canvas.height = spec.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 2D context is unavailable in this browser.");
  }
  return { canvas, ctx };
}

function renderStandard(matrix: QrMatrix): HTMLCanvasElement {
  const { canvas, ctx } = createCanvas(STANDARD_QR_ASSET);
  drawQrOnCanvas(ctx, matrix, {
    x: 0,
    y: 0,
    size: STANDARD_QR_ASSET.width,
    dark: FOREST,
    light: WHITE,
  });
  return canvas;
}

function renderStory(
  matrix: QrMatrix,
  logo: HTMLImageElement | null,
): HTMLCanvasElement {
  const { canvas, ctx } = createCanvas(STORY_ASSET);
  const cx = STORY_ASSET.width / 2;
  ctx.fillStyle = FOREST;
  ctx.fillRect(0, 0, STORY_ASSET.width, STORY_ASSET.height);
  // Wordmark sits well below the Story profile overlay at the top.
  drawWordmark(ctx, logo, cx, 300, 132);
  drawCenteredText(ctx, STORY_ASSET.headline ?? "", cx, 640, 62, WHITE);
  // QR is centered vertically, clear of both the top and bottom Story overlays.
  drawQrCard(ctx, matrix, cx, 740, 760);
  drawCenteredText(ctx, STORY_ASSET.caption ?? "", cx, 1640, 48, MINT);
  drawCenteredText(
    ctx,
    DISPLAY_URL,
    cx,
    1700,
    34,
    "rgba(255,255,255,0.75)",
    500,
  );
  return canvas;
}

function renderSquare(
  matrix: QrMatrix,
  logo: HTMLImageElement | null,
): HTMLCanvasElement {
  const { canvas, ctx } = createCanvas(SQUARE_ASSET);
  const cx = SQUARE_ASSET.width / 2;
  ctx.fillStyle = FOREST;
  ctx.fillRect(0, 0, SQUARE_ASSET.width, SQUARE_ASSET.height);
  drawWordmark(ctx, logo, cx, 96, 104);
  drawCenteredText(ctx, SQUARE_ASSET.headline ?? "", cx, 372, 58, WHITE);
  drawQrCard(ctx, matrix, cx, 424, 500);
  drawCenteredText(ctx, SQUARE_ASSET.caption ?? "", cx, 1000, 44, MINT);
  return canvas;
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Could not export the image."));
      }
    }, "image/png");
  });
}

function saveBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Render the requested asset and start a download. The `standard` asset needs no
 * logo and skips the image load; the branded cards load the wordmark but render
 * fine without it if it fails.
 */
export async function downloadShareAsset(spec: ShareAssetSpec): Promise<void> {
  const matrix = encodeQr(QR_SHARE_URL, "M");
  let canvas: HTMLCanvasElement;
  if (spec.key === "standard") {
    canvas = renderStandard(matrix);
  } else {
    const logo = await loadImage(LOGO_SRC);
    canvas =
      spec.key === "story"
        ? renderStory(matrix, logo)
        : renderSquare(matrix, logo);
  }
  const blob = await canvasToBlob(canvas);
  saveBlob(blob, spec.filename);
}
