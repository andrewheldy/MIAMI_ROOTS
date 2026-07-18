import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

interface BadgeProps {
  children: ReactNode;
  /** Visual tone. `neutral` for categories; `subtle` for provisional markers. */
  tone?: "brand" | "neutral" | "subtle";
  className?: string;
}

/**
 * Small inline pill for a category or status marker. Server Component. Purely
 * presentational — it never encodes meaning that isn't also in the text.
 */
export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tone === "brand" && "bg-forest text-background",
        tone === "neutral" && "bg-mint-100 text-forest",
        tone === "subtle" && "border-border text-muted border",
        className,
      )}
    >
      {children}
    </span>
  );
}
