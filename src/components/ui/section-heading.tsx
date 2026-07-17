import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  className?: string;
  light?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  light = false,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <p
        className={cn(
          "mb-6 text-xs font-semibold tracking-[0.2em] uppercase",
          light ? "text-mint" : "text-forest/60",
        )}
      >
        {eyebrow}
      </p>
      <h2
        className={cn(
          "font-display text-4xl leading-[0.98] font-semibold tracking-[-0.045em] text-balance sm:text-5xl lg:text-7xl",
          light ? "text-cream" : "text-forest",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-7 max-w-2xl text-lg leading-relaxed",
            light ? "text-cream/70" : "text-muted",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
