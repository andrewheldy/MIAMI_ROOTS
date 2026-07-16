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
      className={cn("mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8", className)}
    >
      {children}
    </Component>
  );
}
