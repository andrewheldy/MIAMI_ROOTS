import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/cn";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /** Semantic element to render as. Defaults to a plain <div>. */
  as?: ElementType;
}

/**
 * The single horizontal-rhythm primitive: centers content, caps its width, and
 * applies responsive gutters. Layout regions compose this instead of repeating
 * width/padding utilities.
 */
export function Container({ children, className, as }: ContainerProps) {
  const Component = as ?? "div";
  return (
    <Component
      className={cn(
        "mx-auto w-full max-w-7xl px-5 sm:px-7 lg:px-10",
        className,
      )}
    >
      {children}
    </Component>
  );
}
