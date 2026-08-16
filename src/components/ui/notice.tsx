import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

interface NoticeProps {
  /** Panel heading. */
  title: string;
  children: ReactNode;
  /** `info` for neutral context; `caution` for safety-relevant guidance. */
  tone?: "info" | "caution";
  className?: string;
}

/**
 * Notice / safety panel: a visually distinct block for expectations or safety
 * guidance (the no-resale rule, the "not clinical" framing). Server Component.
 *
 * A plain <div>, not an <aside>. These notices sit inside the section they
 * belong to and are part of its argument, not complementary asides; nesting a
 * complementary landmark inside a section also puts a landmark where assistive
 * tech does not expect one (axe: landmark-complementary-is-top-level).
 */
export function Notice({
  title,
  children,
  tone = "info",
  className,
}: NoticeProps) {
  return (
    <div
      className={cn(
        "rounded-lg border p-5",
        tone === "info" && "border-border bg-surface",
        tone === "caution" && "border-forest/25 bg-mint-100",
        className,
      )}
    >
      <p className="text-forest font-semibold">{title}</p>
      <div className="text-muted mt-2 space-y-2 text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
}
