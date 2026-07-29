"use client";

import { useId, useRef, useState } from "react";

import { cn } from "@/lib/cn";
import {
  SQUARE_ASSET,
  STANDARD_QR_ASSET,
  STORY_ASSET,
} from "@/lib/share/assets";
import { buildJoinShareUrl, QR_SHARE_URL } from "@/lib/share/destination";
import { copyToClipboard, shareOrCopy } from "@/lib/share/actions";
import type { ShareAssetSpec } from "@/lib/share/assets";

import { downloadShareAsset } from "./download";
import { QrImage } from "./qr-image";
import { useDialogA11y } from "./use-dialog-a11y";

interface ShareCardModalProps {
  open: boolean;
  onClose: () => void;
  /** Switch to the distraction-free full-screen scan view. */
  onOpenFullScreen: () => void;
}

type Feedback = { tone: "success" | "error"; message: string } | null;

const JOIN_LINK_DISPLAY = "miami-roots.vercel.app/join";

function currentNavigator() {
  return typeof navigator !== "undefined" ? navigator : undefined;
}

/**
 * The share experience: a large scannable QR, the wordmark placed above (well
 * outside the code's quiet zone — never over the functional modules), a clear
 * title and instruction, and the share/download actions. Uses the Web Share API
 * where available and copies the link where it is not. Every action reports a
 * result through a polite live region, and asset generation failures surface a
 * readable error rather than failing silently.
 */
export function ShareCardModal({
  open,
  onClose,
  onOpenFullScreen,
}: ShareCardModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descId = useId();
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [busy, setBusy] = useState(false);

  useDialogA11y(open, onClose, dialogRef, closeRef);

  if (!open) {
    return null;
  }

  async function handleShare() {
    const outcome = await shareOrCopy(currentNavigator(), {
      url: buildJoinShareUrl("web_share"),
      title: "Miami Roots",
      text: "Meet your people in Miami — join Miami Roots.",
    });
    if (outcome === "shared") {
      setFeedback(null);
    } else if (outcome === "copied") {
      setFeedback({
        tone: "success",
        message: "Join link copied to clipboard.",
      });
    } else if (outcome === "error") {
      setFeedback({
        tone: "error",
        message: "Sharing isn't available — copy the link below instead.",
      });
    }
  }

  async function handleCopy() {
    const ok = await copyToClipboard(
      currentNavigator(),
      buildJoinShareUrl("copy_link"),
    );
    setFeedback(
      ok
        ? { tone: "success", message: "Join link copied to clipboard." }
        : {
            tone: "error",
            message: `Copy didn't work — the link is ${JOIN_LINK_DISPLAY}`,
          },
    );
  }

  async function handleDownload(spec: ShareAssetSpec) {
    setBusy(true);
    try {
      await downloadShareAsset(spec);
      setFeedback({
        tone: "success",
        message: `Saved ${spec.label} to your device.`,
      });
    } catch {
      setFeedback({
        tone: "error",
        message: "We couldn't create that image. Please try again.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="share-backdrop fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/50 p-0 sm:items-center sm:p-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="share-panel bg-background relative flex w-full max-w-md flex-col rounded-t-2xl px-5 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-xl sm:rounded-2xl sm:pb-6"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close share card"
          className="text-muted hover:bg-surface hover:text-forest focus-visible:bg-surface absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-5 w-5"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {/* Wordmark — deliberately above and outside the QR quiet zone. */}
        <div className="flex items-center gap-2.5">
          {/* Plain img (not next/image): this is chrome, not content, and keeps
              the component trivially server-renderable for tests. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logos/miami-roots-logo.png"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 rounded-lg"
          />
          <span className="text-forest text-sm font-semibold tracking-tight">
            Miami Roots
          </span>
        </div>

        <h2
          id={titleId}
          className="text-forest mt-4 text-2xl font-bold tracking-tight text-balance"
        >
          Bring someone into the community
        </h2>
        <p id={descId} className="text-muted mt-2 text-sm leading-relaxed">
          Let them scan this code or send them the link.
        </p>

        <div className="border-border bg-background mx-auto mt-5 w-full max-w-[280px] rounded-2xl border p-4">
          <QrImage
            value={QR_SHARE_URL}
            ecc="M"
            title="QR code to join Miami Roots"
          />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-2.5">
          <button
            type="button"
            onClick={() => handleDownload(STANDARD_QR_ASSET)}
            disabled={busy}
            className="bg-forest text-background hover:bg-forest-600 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition-colors disabled:opacity-60"
          >
            Download to Phone
          </button>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleShare}
              className="border-border text-forest hover:border-forest/40 hover:bg-surface inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-colors"
            >
              Share with a Friend
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="border-border text-forest hover:border-forest/40 hover:bg-surface inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-colors"
            >
              Copy Join Link
            </button>
          </div>
          <button
            type="button"
            onClick={onOpenFullScreen}
            className="border-border text-forest hover:border-forest/40 hover:bg-surface inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-colors"
          >
            Show Full-Screen QR
          </button>
        </div>

        <div className="mt-4">
          <p className="text-muted text-xs font-semibold tracking-wide uppercase">
            Share cards
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleDownload(STORY_ASSET)}
              disabled={busy}
              className="border-border text-forest hover:border-forest/40 hover:bg-surface inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors disabled:opacity-60"
            >
              Instagram Story
            </button>
            <button
              type="button"
              onClick={() => handleDownload(SQUARE_ASSET)}
              disabled={busy}
              className="border-border text-forest hover:border-forest/40 hover:bg-surface inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors disabled:opacity-60"
            >
              Square card
            </button>
          </div>
        </div>

        <p
          role="status"
          aria-live="polite"
          className={cn(
            "mt-4 min-h-5 text-center text-sm font-medium",
            feedback?.tone === "success" && "text-forest-600",
            feedback?.tone === "error" && "text-red-600",
            !feedback && "sr-only",
          )}
        >
          {feedback?.message}
        </p>
      </div>
    </div>
  );
}
