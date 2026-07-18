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
 * Notice / safety panel: a visually distinct, semantic region for expectations or
 * safety guidance (e.g. the no-resale rule, the "not clinical" framing). Server
 * Component. Uses <aside> so assistive tech treats it as complementary content.
 */
export function Notice({
  title,
  children,
  tone = "info",
  className,
}: NoticeProps) {
  return (
    <aside
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
    </aside>
  );
}
