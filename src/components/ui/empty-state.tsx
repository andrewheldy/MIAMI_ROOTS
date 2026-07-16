import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  /** Optional action (e.g. a link back to the directory). */
  children?: ReactNode;
}

/**
 * Neutral, honest empty state for when a list has nothing to show. Server
 * Component. Communicates the absence plainly rather than looking broken.
 */
export function EmptyState({ title, description, children }: EmptyStateProps) {
  return (
    <div className="border-border rounded-lg border border-dashed px-6 py-12 text-center">
      <p className="text-forest text-lg font-semibold">{title}</p>
      {description ? (
        <p className="text-muted mx-auto mt-2 max-w-md text-sm leading-relaxed">
          {description}
        </p>
      ) : null}
      {children ? <div className="mt-6">{children}</div> : null}
    </div>
  );
}
