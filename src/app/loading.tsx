import { Container } from "@/components/layout/container";

/**
 * Route-level loading fallback. Minimal and text-based to avoid layout shift;
 * richer skeletons arrive with the data-backed pages they belong to.
 */
export default function Loading() {
  return (
    <Container className="py-16">
      <p className="text-muted text-sm" role="status" aria-live="polite">
        Loading…
      </p>
    </Container>
  );
}
