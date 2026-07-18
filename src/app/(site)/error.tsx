"use client";

import { useEffect } from "react";

import { Container } from "@/components/layout/container";

/**
 * Route-level error boundary. A client component by requirement — it must catch
 * runtime rendering errors and offer a recovery action. User-facing copy stays
 * generic; diagnostic detail goes to logs, not the screen.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Structured logging/observability is wired up in a later milestone.
    console.error(error);
  }, [error]);

  return (
    <Container className="py-16 sm:py-24">
      <div className="max-w-xl space-y-4">
        <h1 className="text-forest text-3xl font-bold tracking-tight">
          Something went wrong
        </h1>
        <p className="text-muted text-base">
          An unexpected error occurred. Please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="bg-forest text-background hover:bg-forest-600 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium"
        >
          Try again
        </button>
      </div>
    </Container>
  );
}
