/**
 * Dependency-free QR Code encoder (byte mode) — Miami Roots share utility.
 *
 * A small, self-contained implementation of the QR Code Model 2 standard
 * (ISO/IEC 18004) sufficient for the community-share feature: it encodes a URL
 * (or any UTF-8 text) into a boolean module matrix that the render helpers draw
 * as crisp SVG on screen and rasterize onto canvas for downloadable assets.
 *
 * Scope, deliberately narrow: **byte (8-bit) segment mode only**. Every string
 * this app encodes is a mixed-case URL or sentence, which QR's numeric and
 * alphanumeric modes cannot represent anyway, so byte mode is both sufficient
 * and the correct choice. Versions 1–40 and all four error-correction levels
 * are supported, with automatic version selection and spec-compliant automatic
 * mask selection (lowest penalty score).
 *
 * The algorithm (Reed–Solomon over GF(2^8), block interleaving, masking, format
 * and version information) follows the standard; it is verified bit-for-bit
 * against an independent reference implementation in `tests/unit/qr.test.ts`.
 * No third-party code is bundled.
 */

export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export interface QrMatrix {
  /** Side length in modules (always `version * 4 + 17`). */
  readonly size: number;
  /** QR version 1–40 that was selected for the input. */
  readonly version: number;
  /** Mask pattern 0–7 that was applied. */
  readonly mask: number;
  /** `modules[y][x]` — `true` is a dark module. Row-major, size × size. */
  readonly modules: ReadonlyArray<ReadonlyArray<boolean>>;
}

const MIN_VERSION = 1;
const MAX_VERSION = 40;

/** Table index for each level (used by the ECC block tables below). */
const ECL_ORDINAL: Record<ErrorCorrectionLevel, number> = {
  L: 0,
  M: 1,
  Q: 2,
  H: 3,
};

/** The 2-bit value each level contributes to the format information. */
const ECL_FORMAT_BITS: Record<ErrorCorrectionLevel, number> = {
  L: 1,
  M: 0,
  Q: 3,
  H: 2,
};

// Number of error-correction codewords per block, indexed [ecl ordinal][version].
// Index 0 of each row is padding (unused). Source: ISO/IEC 18004.
// prettier-ignore
const ECC_CODEWORDS_PER_BLOCK: readonly (readonly number[])[] = [
  [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30], // L
  [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28], // M
  [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30], // Q
  [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30], // H
];

// Number of error-correction blocks, indexed [ecl ordinal][version].
// prettier-ignore
const NUM_ERROR_CORRECTION_BLOCKS: readonly (readonly number[])[] = [
  [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25], // L
  [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49], // M
  [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68], // Q
  [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81], // H
];

const PENALTY_N1 = 3;
const PENALTY_N2 = 3;
const PENALTY_N3 = 40;
const PENALTY_N4 = 10;

/** Read a table cell that is guaranteed present for a valid [ordinal][version]. */
function tableValue(
  table: readonly (readonly number[])[],
  ord: number,
  version: number,
): number {
  return (table[ord] as readonly number[])[version] as number;
}

/**
 * Encode `text` (UTF-8) into a QR module matrix at the given error-correction
 * level, choosing the smallest version that fits and the lowest-penalty mask.
 *
 * @throws if the text is too long to fit in a version-40 symbol at `ecl`.
 */
export function encodeQr(
  text: string,
  ecl: ErrorCorrectionLevel = "M",
): QrMatrix {
  const data = utf8Bytes(text);
  const version = selectVersion(data.length, ecl);
  const dataCodewords = buildDataCodewords(data, version, ecl);
  const codewords = addEccAndInterleave(dataCodewords, version, ecl);
  return renderMatrix(codewords, version, ecl);
}

function utf8Bytes(text: string): number[] {
  return Array.from(new TextEncoder().encode(text));
}

/** Byte-mode character-count-indicator width for a version. */
function byteModeCountBits(version: number): number {
  return version <= 9 ? 8 : 16;
}

function getNumRawDataModules(version: number): number {
  let result = (16 * version + 128) * version + 64;
  if (version >= 2) {
    const numAlign = Math.floor(version / 7) + 2;
    result -= (25 * numAlign - 10) * numAlign - 55;
    if (version >= 7) {
      result -= 36;
    }
  }
  return result;
}

function getNumDataCodewords(
  version: number,
  ecl: ErrorCorrectionLevel,
): number {
  const ord = ECL_ORDINAL[ecl];
  return (
    Math.floor(getNumRawDataModules(version) / 8) -
    tableValue(ECC_CODEWORDS_PER_BLOCK, ord, version) *
      tableValue(NUM_ERROR_CORRECTION_BLOCKS, ord, version)
  );
}

function selectVersion(numBytes: number, ecl: ErrorCorrectionLevel): number {
  for (let version = MIN_VERSION; version <= MAX_VERSION; version++) {
    const capacityBits = getNumDataCodewords(version, ecl) * 8;
    const usedBits = 4 + byteModeCountBits(version) + numBytes * 8;
    if (usedBits <= capacityBits) {
      return version;
    }
  }
  throw new RangeError(
    "QR encode: input is too long for a version-40 symbol at this error-correction level.",
  );
}

/** Assemble the padded data codeword bytes for a chosen version. */
function buildDataCodewords(
  data: readonly number[],
  version: number,
  ecl: ErrorCorrectionLevel,
): number[] {
  const bits: number[] = [];
  const appendBits = (value: number, length: number): void => {
    for (let i = length - 1; i >= 0; i--) {
      bits.push((value >>> i) & 1);
    }
  };

  appendBits(0x4, 4); // byte-mode indicator
  appendBits(data.length, byteModeCountBits(version));
  for (const byte of data) {
    appendBits(byte, 8);
  }

  const capacityBits = getNumDataCodewords(version, ecl) * 8;
  // Terminator, then pad to a byte boundary.
  appendBits(0, Math.min(4, capacityBits - bits.length));
  appendBits(0, (8 - (bits.length % 8)) % 8);

  const codewords: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) {
      byte = (byte << 1) | (bits[i + j] as number);
    }
    codewords.push(byte);
  }
  // Pad bytes alternate 0xEC / 0x11 until the capacity is filled.
  for (
    let pad = 0xec;
    codewords.length * 8 < capacityBits;
    pad ^= 0xec ^ 0x11
  ) {
    codewords.push(pad);
  }
  return codewords;
}

/* -------------------------------------------------------------------------- */
/* Reed–Solomon error correction over GF(2^8), reducing modulo 0x11D.          */
/* -------------------------------------------------------------------------- */

function reedSolomonMultiply(x: number, y: number): number {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z & 0xff;
}

function reedSolomonComputeDivisor(degree: number): number[] {
  const result = new Array<number>(degree).fill(0);
  result[degree - 1] = 1; // start as the monomial x^0
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < result.length; j++) {
      result[j] = reedSolomonMultiply(result[j] as number, root);
      if (j + 1 < result.length) {
        result[j] = (result[j] as number) ^ (result[j + 1] as number);
      }
    }
    root = reedSolomonMultiply(root, 0x02);
  }
  return result;
}

function reedSolomonComputeRemainder(
  data: readonly number[],
  divisor: readonly number[],
): number[] {
  const result = new Array<number>(divisor.length).fill(0);
  for (const byte of data) {
    const factor = byte ^ (result.shift() as number);
    result.push(0);
    divisor.forEach((coef, i) => {
      result[i] = (result[i] as number) ^ reedSolomonMultiply(coef, factor);
    });
  }
  return result;
}

/** Split into blocks, append ECC, and interleave into the final codeword run. */
function addEccAndInterleave(
  data: readonly number[],
  version: number,
  ecl: ErrorCorrectionLevel,
): number[] {
  const ord = ECL_ORDINAL[ecl];
  const numBlocks = tableValue(NUM_ERROR_CORRECTION_BLOCKS, ord, version);
  const blockEccLen = tableValue(ECC_CODEWORDS_PER_BLOCK, ord, version);
  const rawCodewords = Math.floor(getNumRawDataModules(version) / 8);
  const numShortBlocks = numBlocks - (rawCodewords % numBlocks);
  const shortBlockLen = Math.floor(rawCodewords / numBlocks);

  const rsDiv = reedSolomonComputeDivisor(blockEccLen);
  const blocks: number[][] = [];
  let offset = 0;
  for (let i = 0; i < numBlocks; i++) {
    const datLen = shortBlockLen - blockEccLen + (i < numShortBlocks ? 0 : 1);
    const dat = data.slice(offset, offset + datLen);
    offset += datLen;
    const ecc = reedSolomonComputeRemainder(dat, rsDiv);
    if (i < numShortBlocks) {
      dat.push(0); // placeholder so column indexing lines up during interleave
    }
    blocks.push(dat.concat(ecc));
  }

  const result: number[] = [];
  const columns = (blocks[0] as number[]).length;
  for (let i = 0; i < columns; i++) {
    blocks.forEach((block, j) => {
      // Skip the placeholder byte that pads short blocks.
      if (i !== shortBlockLen - blockEccLen || j >= numShortBlocks) {
        result.push(block[i] as number);
      }
    });
  }
  return result;
}

/* -------------------------------------------------------------------------- */
/* Matrix construction: function patterns, data placement, masking, format.    */
/* -------------------------------------------------------------------------- */

function getBit(value: number, index: number): boolean {
  return ((value >>> index) & 1) !== 0;
}

class Grid {
  readonly size: number;
  readonly modules: boolean[][];
  private readonly isFunction: boolean[][];

  constructor(readonly version: number) {
    this.size = version * 4 + 17;
    this.modules = Array.from({ length: this.size }, () =>
      new Array<boolean>(this.size).fill(false),
    );
    this.isFunction = Array.from({ length: this.size }, () =>
      new Array<boolean>(this.size).fill(false),
    );
  }

  /** Read a data module (bounds-guaranteed by callers). */
  private get(x: number, y: number): boolean {
    return (this.modules[y] as boolean[])[x] as boolean;
  }

  /** Write a data module without marking it as a function module. */
  private put(x: number, y: number, dark: boolean): void {
    (this.modules[y] as boolean[])[x] = dark;
  }

  private isReserved(x: number, y: number): boolean {
    return (this.isFunction[y] as boolean[])[x] as boolean;
  }

  private setFunction(x: number, y: number, dark: boolean): void {
    (this.modules[y] as boolean[])[x] = dark;
    (this.isFunction[y] as boolean[])[x] = true;
  }

  drawFunctionPatterns(ecl: ErrorCorrectionLevel): void {
    // Timing patterns.
    for (let i = 0; i < this.size; i++) {
      this.setFunction(6, i, i % 2 === 0);
      this.setFunction(i, 6, i % 2 === 0);
    }
    // Finder patterns (with separators) in three corners.
    this.drawFinder(3, 3);
    this.drawFinder(this.size - 4, 3);
    this.drawFinder(3, this.size - 4);
    // Alignment patterns.
    const positions = this.alignmentPatternPositions();
    const numAlign = positions.length;
    for (let i = 0; i < numAlign; i++) {
      for (let j = 0; j < numAlign; j++) {
        const isFinderCorner =
          (i === 0 && j === 0) ||
          (i === 0 && j === numAlign - 1) ||
          (i === numAlign - 1 && j === 0);
        if (!isFinderCorner) {
          this.drawAlignment(positions[i] as number, positions[j] as number);
        }
      }
    }
    // Reserve format and version areas (real values written later).
    this.drawFormatBits(ecl, 0);
    this.drawVersion();
  }

  private drawFinder(cx: number, cy: number): void {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        const x = cx + dx;
        const y = cy + dy;
        if (x >= 0 && x < this.size && y >= 0 && y < this.size) {
          this.setFunction(x, y, dist !== 2 && dist !== 4);
        }
      }
    }
  }

  private drawAlignment(cx: number, cy: number): void {
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        this.setFunction(
          cx + dx,
          cy + dy,
          Math.max(Math.abs(dx), Math.abs(dy)) !== 1,
        );
      }
    }
  }

  private alignmentPatternPositions(): number[] {
    if (this.version === 1) {
      return [];
    }
    const numAlign = Math.floor(this.version / 7) + 2;
    const step =
      Math.floor((this.version * 8 + numAlign * 3 + 5) / (numAlign * 4 - 4)) *
      2;
    const result = [6];
    for (let pos = this.size - 7; result.length < numAlign; pos -= step) {
      result.splice(1, 0, pos);
    }
    return result;
  }

  drawFormatBits(ecl: ErrorCorrectionLevel, mask: number): void {
    const data = (ECL_FORMAT_BITS[ecl] << 3) | mask; // 5 bits
    let rem = data;
    for (let i = 0; i < 10; i++) {
      rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    }
    const bits = ((data << 10) | rem) ^ 0x5412; // 15 bits, always non-zero

    for (let i = 0; i <= 5; i++) {
      this.setFunction(8, i, getBit(bits, i));
    }
    this.setFunction(8, 7, getBit(bits, 6));
    this.setFunction(8, 8, getBit(bits, 7));
    this.setFunction(7, 8, getBit(bits, 8));
    for (let i = 9; i < 15; i++) {
      this.setFunction(14 - i, 8, getBit(bits, i));
    }

    for (let i = 0; i < 8; i++) {
      this.setFunction(this.size - 1 - i, 8, getBit(bits, i));
    }
    for (let i = 8; i < 15; i++) {
      this.setFunction(8, this.size - 15 + i, getBit(bits, i));
    }
    this.setFunction(8, this.size - 8, true); // always-dark module
  }

  private drawVersion(): void {
    if (this.version < 7) {
      return;
    }
    let rem = this.version;
    for (let i = 0; i < 12; i++) {
      rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    }
    const bits = (this.version << 12) | rem; // 18 bits
    for (let i = 0; i < 18; i++) {
      const color = getBit(bits, i);
      const a = this.size - 11 + (i % 3);
      const b = Math.floor(i / 3);
      this.setFunction(a, b, color);
      this.setFunction(b, a, color);
    }
  }

  drawCodewords(data: readonly number[]): void {
    let i = 0; // bit index into data
    for (let right = this.size - 1; right >= 1; right -= 2) {
      if (right === 6) {
        right = 5; // skip the vertical timing column
      }
      for (let vert = 0; vert < this.size; vert++) {
        for (let j = 0; j < 2; j++) {
          const x = right - j;
          const upward = ((right + 1) & 2) === 0;
          const y = upward ? this.size - 1 - vert : vert;
          if (!this.isReserved(x, y) && i < data.length * 8) {
            this.put(x, y, getBit(data[i >>> 3] as number, 7 - (i & 7)));
            i++;
          }
        }
      }
    }
  }

  applyMask(mask: number): void {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.isReserved(x, y)) {
          continue;
        }
        let invert: boolean;
        switch (mask) {
          case 0:
            invert = (x + y) % 2 === 0;
            break;
          case 1:
            invert = y % 2 === 0;
            break;
          case 2:
            invert = x % 3 === 0;
            break;
          case 3:
            invert = (x + y) % 3 === 0;
            break;
          case 4:
            invert = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0;
            break;
          case 5:
            invert = ((x * y) % 2) + ((x * y) % 3) === 0;
            break;
          case 6:
            invert = (((x * y) % 2) + ((x * y) % 3)) % 2 === 0;
            break;
          case 7:
            invert = (((x + y) % 2) + ((x * y) % 3)) % 2 === 0;
            break;
          default:
            throw new RangeError("QR encode: mask value out of range.");
        }
        if (invert) {
          this.put(x, y, !this.get(x, y));
        }
      }
    }
  }

  penaltyScore(): number {
    let result = 0;

    // Rule 1 (rows) + finder-like patterns.
    for (let y = 0; y < this.size; y++) {
      let runColor = false;
      let runLen = 0;
      const history = [0, 0, 0, 0, 0, 0, 0];
      for (let x = 0; x < this.size; x++) {
        if (this.get(x, y) === runColor) {
          runLen++;
          if (runLen === 5) {
            result += PENALTY_N1;
          } else if (runLen > 5) {
            result++;
          }
        } else {
          this.finderAddHistory(runLen, history);
          if (!runColor) {
            result += this.finderCountPatterns(history) * PENALTY_N3;
          }
          runColor = this.get(x, y);
          runLen = 1;
        }
      }
      result +=
        this.finderTerminateAndCount(runColor, runLen, history) * PENALTY_N3;
    }
    // Rule 1 (columns) + finder-like patterns.
    for (let x = 0; x < this.size; x++) {
      let runColor = false;
      let runLen = 0;
      const history = [0, 0, 0, 0, 0, 0, 0];
      for (let y = 0; y < this.size; y++) {
        if (this.get(x, y) === runColor) {
          runLen++;
          if (runLen === 5) {
            result += PENALTY_N1;
          } else if (runLen > 5) {
            result++;
          }
        } else {
          this.finderAddHistory(runLen, history);
          if (!runColor) {
            result += this.finderCountPatterns(history) * PENALTY_N3;
          }
          runColor = this.get(x, y);
          runLen = 1;
        }
      }
      result +=
        this.finderTerminateAndCount(runColor, runLen, history) * PENALTY_N3;
    }

    // Rule 2: 2x2 blocks of one color.
    for (let y = 0; y < this.size - 1; y++) {
      for (let x = 0; x < this.size - 1; x++) {
        const color = this.get(x, y);
        if (
          color === this.get(x + 1, y) &&
          color === this.get(x, y + 1) &&
          color === this.get(x + 1, y + 1)
        ) {
          result += PENALTY_N2;
        }
      }
    }

    // Rule 4: dark/light balance.
    let dark = 0;
    for (const row of this.modules) {
      for (const cell of row) {
        if (cell) {
          dark++;
        }
      }
    }
    const total = this.size * this.size;
    const k = Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1;
    result += k * PENALTY_N4;
    return result;
  }

  private finderCountPatterns(history: readonly number[]): number {
    const n = history[1] as number;
    const core =
      n > 0 &&
      history[2] === n &&
      history[3] === n * 3 &&
      history[4] === n &&
      history[5] === n;
    return (
      (core && (history[0] as number) >= n * 4 && (history[6] as number) >= n
        ? 1
        : 0) +
      (core && (history[6] as number) >= n * 4 && (history[0] as number) >= n
        ? 1
        : 0)
    );
  }

  private finderTerminateAndCount(
    currentRunColor: boolean,
    currentRunLength: number,
    history: number[],
  ): number {
    let runLength = currentRunLength;
    if (currentRunColor) {
      this.finderAddHistory(runLength, history);
      runLength = 0;
    }
    runLength += this.size; // light border on the trailing side
    this.finderAddHistory(runLength, history);
    return this.finderCountPatterns(history);
  }

  private finderAddHistory(currentRunLength: number, history: number[]): void {
    let runLength = currentRunLength;
    if (history[0] === 0) {
      runLength += this.size; // light border on the leading side
    }
    history.pop();
    history.unshift(runLength);
  }
}

function renderMatrix(
  codewords: readonly number[],
  version: number,
  ecl: ErrorCorrectionLevel,
): QrMatrix {
  const grid = new Grid(version);
  grid.drawFunctionPatterns(ecl);
  grid.drawCodewords(codewords);

  // Choose the mask with the lowest penalty score.
  let bestMask = 0;
  let minPenalty = Infinity;
  for (let mask = 0; mask < 8; mask++) {
    grid.applyMask(mask);
    grid.drawFormatBits(ecl, mask);
    const penalty = grid.penaltyScore();
    if (penalty < minPenalty) {
      minPenalty = penalty;
      bestMask = mask;
    }
    grid.applyMask(mask); // undo (XOR is its own inverse)
  }
  grid.applyMask(bestMask);
  grid.drawFormatBits(ecl, bestMask);

  return {
    size: grid.size,
    version,
    mask: bestMask,
    modules: grid.modules,
  };
}
