"use client";

import { useRef } from "react";

import { QR_SHARE_URL } from "@/lib/share/destination";

import { QrImage } from "./qr-image";
import { useDialogA11y } from "./use-dialog-a11y";

interface FullScreenQrProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Distraction-free, full-screen QR for in-person scanning. Maximum practical QR
 * size on a plain white field (brightest, highest-contrast, and what scanners
 * expect), the join URL printed beneath it, and nothing else moving — there is
 * deliberately no animation behind the code. The overlay is a labelled modal
 * dialog with a single close control, and `overflow-hidden` on a full-viewport
 * box prevents any accidental horizontal scroll.
 */
export function FullScreenQr({ open, onClose }: FullScreenQrProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useDialogA11y(open, onClose, dialogRef, closeRef);

  if (!open) {
    return null;
  }

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Full-screen QR code for joining Miami Roots"
      className="fixed inset-0 z-50 flex w-full max-w-full flex-col items-center justify-center overflow-hidden bg-white px-5 py-6"
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close full-screen QR code"
        className="text-forest hover:bg-surface focus-visible:bg-surface absolute top-[max(1rem,env(safe-area-inset-top))] right-[max(1rem,env(safe-area-inset-right))] inline-flex h-12 w-12 items-center justify-center rounded-full border border-transparent transition-colors"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="h-6 w-6"
        >
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <div className="flex w-full max-w-full flex-col items-center gap-6">
        <p className="text-forest text-lg font-semibold tracking-tight">
          Scan to join Miami Roots
        </p>
        <div className="w-[min(86vw,64vh)] max-w-[560px]">
          <QrImage
            value={QR_SHARE_URL}
            ecc="M"
            title="QR code to join Miami Roots"
          />
        </div>
        <p className="text-muted max-w-full text-center text-sm break-words">
          miami-roots.vercel.app/join
        </p>
      </div>
    </div>
  );
}
