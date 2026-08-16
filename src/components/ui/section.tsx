import type { ElementType, ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { cn } from "@/lib/cn";

interface SectionProps {
  children: ReactNode;
  /** Optional background treatment. `surface` tints the band; `default` is plain. */
  tone?: "default" | "surface";
  /** Semantic element for the outer band. Defaults to `<section>`. */
  as?: ElementType;
  /** Extra classes on the inner Container. */
  className?: string;
  /** Extra classes on the outer band (e.g. borders). */
  bandClassName?: string;
  /** Anchor target on the band, for in-page links like `#rooms`. */
  id?: string;
  /** Accessible label wiring for landmark sections. */
  "aria-labelledby"?: string;
  "aria-label"?: string;
}

/**
 * Vertical-rhythm band: a full-width region with consistent top/bottom padding,
 * wrapping its content in the shared `Container`. Pages compose these instead of
 * repeating padding and width utilities. Server Component.
 */
export function Section({
  children,
  tone = "default",
  as,
  className,
  bandClassName,
  id,
  ...landmark
}: SectionProps) {
  const Band = as ?? "section";
  return (
    <Band
      id={id}
      className={cn(
        "scroll-mt-20 py-12 sm:py-16",
        tone === "surface" && "bg-surface",
        bandClassName,
      )}
      {...landmark}
    >
      <Container className={className}>{children}</Container>
    </Band>
  );
}
