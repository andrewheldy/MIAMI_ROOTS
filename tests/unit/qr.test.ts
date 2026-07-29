import { describe, expect, it } from "vitest";

import { encodeQr } from "@/lib/qr/encode";
import type { ErrorCorrectionLevel } from "@/lib/qr/encode";
import { qrToSvg, qrToPathData, qrViewBoxSize } from "@/lib/qr/svg";
import { QR_SHARE_URL } from "@/lib/share/destination";

import referenceVectors from "./qr-reference-vectors.json";

/**
 * Known-answer vectors for the QR encoder. Each was produced independently by
 * Project Nayuki's canonical MIT-licensed QR generator (byte mode, deterministic
 * settings) and captured as its exact module matrix. Reproducing them bit-for-
 * bit proves our from-scratch encoder implements the standard correctly —
 * version selection, Reed–Solomon ECC, block interleaving, masking, and format
 * information — including the exact URL this feature shares.
 */
interface ReferenceVector {
  text: string;
  ecl: string;
  size: number;
  version: number;
  mask: number;
  rows: string[];
}

function matrixToRows(text: string, ecl: ErrorCorrectionLevel): string[] {
  const matrix = encodeQr(text, ecl);
  return matrix.modules.map((row) => row.map((c) => (c ? "1" : "0")).join(""));
}

describe("encodeQr — known-answer vectors", () => {
  for (const vector of referenceVectors as ReferenceVector[]) {
    it(`reproduces the reference matrix for ${vector.ecl} "${vector.text.slice(0, 24)}"`, () => {
      const matrix = encodeQr(vector.text, vector.ecl as ErrorCorrectionLevel);
      expect(matrix.size).toBe(vector.size);
      expect(matrix.version).toBe(vector.version);
      expect(matrix.mask).toBe(vector.mask);
      expect(
        matrixToRows(vector.text, vector.ecl as ErrorCorrectionLevel),
      ).toEqual(vector.rows);
    });
  }
});

describe("encodeQr — structure", () => {
  it("produces an odd square whose size is version*4+17", () => {
    const matrix = encodeQr("https://miami-roots.vercel.app/join", "M");
    expect(matrix.size).toBe(matrix.version * 4 + 17);
    expect(matrix.modules).toHaveLength(matrix.size);
    for (const row of matrix.modules) {
      expect(row).toHaveLength(matrix.size);
    }
  });

  it("draws the three finder patterns (dark 7x7 corners)", () => {
    const { modules, size } = encodeQr("test", "M");
    const corners = [
      [0, 0],
      [size - 7, 0],
      [0, size - 7],
    ];
    for (const [ox, oy] of corners) {
      // Finder pattern: dark border ring around a light ring around a dark core.
      expect(modules[oy!]![ox!]).toBe(true);
      expect(modules[oy! + 1]![ox! + 1]).toBe(false);
      expect(modules[oy! + 3]![ox! + 3]).toBe(true);
    }
  });

  it("is deterministic for the same input", () => {
    const a = matrixToRows(QR_SHARE_URL, "M");
    const b = matrixToRows(QR_SHARE_URL, "M");
    expect(a).toEqual(b);
  });

  it("throws when the input cannot fit in any version", () => {
    expect(() => encodeQr("x".repeat(3000), "H")).toThrow(/too long/i);
  });
});

describe("qrToSvg", () => {
  it("includes a quiet zone in the viewBox and reserves a square", () => {
    const matrix = encodeQr(QR_SHARE_URL, "M");
    const quietZone = 4;
    const svg = qrToSvg(matrix, { quietZone });
    const expected = matrix.size + quietZone * 2;
    expect(qrViewBoxSize(matrix, quietZone)).toBe(expected);
    expect(svg).toContain(`viewBox="0 0 ${expected} ${expected}"`);
  });

  it("renders a labelled, accessible image when given a title", () => {
    const matrix = encodeQr(QR_SHARE_URL, "M");
    const svg = qrToSvg(matrix, { title: "Join Miami Roots" });
    expect(svg).toContain('role="img"');
    expect(svg).toContain('aria-label="Join Miami Roots"');
    expect(svg).toContain("<title>Join Miami Roots</title>");
  });

  it("escapes special characters in the title", () => {
    const matrix = encodeQr("test", "M");
    const svg = qrToSvg(matrix, { title: 'A & B "C" <D>' });
    expect(svg).toContain("A &amp; B &quot;C&quot; &lt;D&gt;");
    expect(svg).not.toContain("<D>");
  });

  it("emits one path rectangle per dark module", () => {
    const matrix = encodeQr("test", "M");
    const darkCount = matrix.modules.reduce(
      (sum, row) => sum + row.filter(Boolean).length,
      0,
    );
    const path = qrToPathData(matrix, 4);
    expect(path.match(/M/g)?.length).toBe(darkCount);
  });
});
