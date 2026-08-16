"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";
import { JOIN_LINK_DISPLAY } from "@/lib/share/destination";

interface ShareButtonProps {
  /** Absolute URL to share. */
  url: string;
  /** Button label. Defaults to the community-wide phrasing. */
  label?: string;
  /** `light` for use on the dark hero/footer, `dark` for light surfaces. */
  appearance?: "light" | "dark";
  className?: string;
}

type ShareState = "idle" | "copied" | "failed";

/**
 * Hands the invite to whatever the visitor already uses: the native share sheet
 * where the Web Share API exists (which on a phone means WhatsApp is one tap
 * away), clipboard copy with visible feedback everywhere else. No dependency;
 * the platform APIs are enough.
 */
export function ShareButton({
  url,
  label = "Send it to a friend",
  appearance = "dark",
  className,
}: ShareButtonProps) {
  const [state, setState] = useState<ShareState>("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  function flash(next: ShareState) {
    setState(next);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setState("idle"), 2500);
  }

  async function handleShare() {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: "Miami Roots",
          text: "Come find your people in Miami.",
          url,
        });
      } catch {
        // Visitor dismissed the share sheet. Nothing to report.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      flash("copied");
    } catch {
      flash("failed");
    }
  }

  return (
    <span className={cn("inline-flex flex-col items-start gap-1", className)}>
      <button
        type="button"
        onClick={handleShare}
        className={cn(
          "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-colors",
          appearance === "light" &&
            "border border-white/40 text-white hover:border-white hover:bg-white/10",
          appearance === "dark" &&
            "border-border text-forest hover:border-forest/40 hover:bg-surface border",
        )}
      >
        <ShareGlyph />
        {label}
      </button>
      <span
        role="status"
        aria-live="polite"
        className={cn(
          "min-h-5 text-xs font-medium",
          appearance === "light" ? "text-white/90" : "text-muted",
          state === "idle" && "invisible",
        )}
      >
        {state === "copied" && "Link copied"}
        {state === "failed" &&
          `Copy didn't work. The link is ${JOIN_LINK_DISPLAY}`}
      </span>
    </span>
  );
}

/** The one functional share glyph, already shipped. Decorative here. */
function ShareGlyph() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M10 12.5v-9m0 0L6.8 6.7M10 3.5l3.2 3.2" />
      <path d="M4.5 10.5v4.6a1.4 1.4 0 0 0 1.4 1.4h8.2a1.4 1.4 0 0 0 1.4-1.4v-4.6" />
    </svg>
  );
}
