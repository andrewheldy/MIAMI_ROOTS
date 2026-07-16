import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  /** Small label above the title. */
  eyebrow?: string;
  /** The heading text. */
  title: ReactNode;
  /** Optional supporting line(s) below the title. */
  description?: ReactNode;
  /** Heading level — keeps one logical h1 per page; sections use h2 by default. */
  as?: "h1" | "h2" | "h3";
  /** ID for aria-labelledby wiring from a Section landmark. */
  id?: string;
  className?: string;
}

/**
 * Consistent section header: optional eyebrow, a heading at the requested level,
 * and an optional description. Server Component.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  as: Heading = "h2",
  id,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow ? (
        <p className="text-muted mb-2 text-sm font-semibold tracking-wide uppercase">
          {eyebrow}
        </p>
      ) : null}
      <Heading
        id={id}
        className={cn(
          "text-forest font-bold tracking-tight text-balance",
          Heading === "h1" ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl",
        )}
      >
        {title}
      </Heading>
      {description ? (
        <p className="text-muted mt-4 text-lg leading-relaxed text-pretty">
          {description}
        </p>
      ) : null}
    </div>
  );
}
