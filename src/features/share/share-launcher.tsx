"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";

import { FullScreenQr } from "./full-screen-qr";
import { ShareCardModal } from "./share-card-modal";

/** A button that opens one of the two share views. */
export interface ShareTrigger {
  label: string;
  /** `card` opens the share modal; `fullscreen` opens the scan view directly. */
  target: "card" | "fullscreen";
  /** Visual treatment. `quiet` is the subtle inline text style. */
  variant?: "primary" | "secondary" | "quiet";
}

interface ShareLauncherProps {
  triggers: ShareTrigger[];
  className?: string;
}

type View = "none" | "card" | "fullscreen";

const VARIANTS: Record<NonNullable<ShareTrigger["variant"]>, string> = {
  primary:
    "bg-forest text-background hover:bg-forest-600 inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition-colors",
  secondary:
    "border-border text-forest hover:border-forest/40 hover:bg-surface inline-flex min-h-12 items-center justify-center gap-2 rounded-md border px-5 text-sm font-semibold transition-colors",
  quiet:
    "text-forest inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-semibold underline-offset-4 hover:underline",
};

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

/**
 * The single client island for the share feature. It renders the trigger
 * button(s) a page asks for and owns the open/close state of both share views,
 * so a page can drop in a share prompt without managing any modal state itself.
 */
export function ShareLauncher({ triggers, className }: ShareLauncherProps) {
  const [view, setView] = useState<View>("none");
  const close = () => setView("none");

  return (
    <>
      <div className={cn("flex flex-wrap items-center gap-3", className)}>
        {triggers.map((trigger) => {
          const variant = trigger.variant ?? "secondary";
          return (
            <button
              key={trigger.label}
              type="button"
              onClick={() => setView(trigger.target)}
              className={VARIANTS[variant]}
            >
              <ShareGlyph />
              {trigger.label}
            </button>
          );
        })}
      </div>

      <ShareCardModal
        open={view === "card"}
        onClose={close}
        onOpenFullScreen={() => setView("fullscreen")}
      />
      <FullScreenQr open={view === "fullscreen"} onClose={close} />
    </>
  );
}
