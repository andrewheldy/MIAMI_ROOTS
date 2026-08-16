"use client";

import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/cn";
import { copyToClipboard } from "@/lib/share/actions";
import { JOIN_LINK_DISPLAY, JOIN_LINK_PLAIN } from "@/lib/share/destination";

type State = "idle" | "copied" | "failed";

type Appearance = "light" | "dark";

interface CopyFieldProps {
  /** Visible label above the field. */
  label: string;
  /** What the visitor reads and what the button copies. Always the same text. */
  value: string;
  /** Optional shortened display text. Defaults to `value`. */
  display?: string;
  /** Render a multi-line box instead of a single-line input. */
  multiline?: boolean;
  /** Button label. */
  action?: string;
  /** Confirmation line after a successful copy. */
  copiedMessage?: string;
  /** `light` sits on the dark forest band; `dark` on white and mint grounds. */
  appearance?: Appearance;
  className?: string;
}

/**
 * A piece of text the visitor can copy with one tap, or select and copy by
 * hand if their browser blocks the clipboard.
 *
 * The field is a real focusable form control holding the exact text, not a
 * styled `<span>` with a button beside it, so it works on a locked-down
 * browser, an old phone, or an in-app webview. Focusing or tapping it selects
 * everything. What is displayed is always exactly what is copied.
 */
export function CopyField({
  label,
  value,
  display,
  multiline = false,
  action = "Copy",
  copiedMessage = "Copied.",
  appearance = "dark",
  className,
}: CopyFieldProps) {
  const [state, setState] = useState<State>("idle");
  const fieldRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = useId();
  const light = appearance === "light";

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  async function handleCopy() {
    const nav = typeof navigator !== "undefined" ? navigator : undefined;
    const ok = await copyToClipboard(nav, value);
    if (!ok) {
      // Select the text so the visitor can copy it with their own keyboard or
      // long-press menu. A dead button with an apology is not a fallback.
      fieldRef.current?.select();
    }
    setState(ok ? "copied" : "failed");
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setState("idle"), 4000);
  }

  const fieldClass = cn(
    "w-full flex-1 rounded-lg bg-transparent px-3 text-base leading-relaxed tracking-tight",
    light ? "text-white" : "text-forest",
  );

  return (
    <div className={cn("w-full", className)}>
      <label
        htmlFor={id}
        className={cn(
          "block text-sm font-semibold",
          light ? "text-white/80" : "text-muted",
        )}
      >
        {label}
      </label>
      <div
        className={cn(
          "mt-2 flex flex-col gap-2 rounded-xl border p-2",
          multiline ? "" : "sm:flex-row sm:items-center",
          light ? "border-white/25 bg-white/10" : "border-border bg-background",
        )}
      >
        {multiline ? (
          <textarea
            ref={fieldRef}
            id={id}
            readOnly
            rows={4}
            value={value}
            onFocus={(event) => event.currentTarget.select()}
            onClick={(event) => event.currentTarget.select()}
            className={cn(fieldClass, "resize-none py-2")}
          />
        ) : (
          <input
            ref={fieldRef}
            id={id}
            type="text"
            readOnly
            value={display ?? value}
            onFocus={(event) => event.currentTarget.select()}
            onClick={(event) => event.currentTarget.select()}
            className={cn(fieldClass, "min-h-11")}
          />
        )}
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            "inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg px-5 text-sm font-semibold transition-colors",
            multiline && "self-start",
            light
              ? "bg-mint text-forest hover:bg-white"
              : "bg-forest text-background hover:bg-forest-600",
          )}
        >
          {state === "copied" ? "Copied" : action}
        </button>
      </div>
      <p
        role="status"
        aria-live="polite"
        className={cn(
          "mt-2 min-h-5 text-sm",
          light ? "text-white/80" : "text-muted",
          state === "idle" && "sr-only",
        )}
      >
        {state === "copied" ? copiedMessage : null}
        {state === "failed"
          ? "Your browser blocked the copy. The text is selected now, so copy it by hand."
          : null}
      </p>
    </div>
  );
}

/**
 * The invite link, visible and hand-copyable.
 *
 * It shows and copies the **plain** join URL, with no campaign parameters, for
 * one reason: a person pastes this into a message to a friend, and a link
 * trailing four `utm_` parameters reads like marketing rather than an
 * invitation. The QR code and the native share sheet keep their attribution,
 * where nobody has to look at it (see `src/lib/share/destination.ts`).
 */
export function CopyLinkField({
  appearance = "dark",
  className,
}: {
  appearance?: Appearance;
  className?: string;
}) {
  return (
    <CopyField
      label="The link to send them"
      value={JOIN_LINK_PLAIN}
      display={JOIN_LINK_DISPLAY}
      action="Copy link"
      copiedMessage="Link copied. Go paste it to someone."
      appearance={appearance}
      className={className}
    />
  );
}
