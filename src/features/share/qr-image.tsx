"use client";

import { useMemo } from "react";

import { cn } from "@/lib/cn";
import { encodeQr, qrToSvg } from "@/lib/qr";
import type { ErrorCorrectionLevel } from "@/lib/qr";

interface QrImageProps {
  /** The URL (or text) to encode. */
  value: string;
  /** Error-correction level; defaults to M (good balance for URLs). */
  ecc?: ErrorCorrectionLevel;
  /** Accessible label for the code. */
  title?: string;
  /** Dark-module color (defaults to forest brand token value). */
  dark?: string;
  /** Background color (defaults to white for maximum scan contrast). */
  light?: string;
  className?: string;
}

/**
 * Renders a QR code as inline SVG inside a fixed-aspect square. The square
 * reserves its space before the SVG is computed, so the code appearing causes
 * **no layout shift**, and SVG keeps it crisp at any device pixel ratio. If
 * encoding ever fails, a labelled error state is shown instead of a broken box.
 */
export function QrImage({
  value,
  ecc = "M",
  title,
  dark,
  light,
  className,
}: QrImageProps) {
  const svg = useMemo(() => {
    try {
      const matrix = encodeQr(value, ecc);
      return qrToSvg(matrix, { dark, light, title });
    } catch {
      return null;
    }
  }, [value, ecc, dark, light, title]);

  if (!svg) {
    return (
      <div
        role="img"
        aria-label="QR code could not be generated"
        className={cn(
          "bg-surface text-muted flex aspect-square w-full items-center justify-center rounded-xl p-6 text-center text-sm",
          className,
        )}
      >
        <span>
          We couldn&apos;t generate the QR code. Use the join link instead.
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn("aspect-square w-full", className)}
      // The SVG is self-describing (role/aria-label come from qrToSvg); this
      // wrapper only reserves the square so there is no layout shift.
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
