import Link from "next/link";

import { Container } from "@/components/layout/container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

/**
 * Global 404. Lives at the app root (outside the `(site)` route group) so it
 * catches unknown URLs anywhere, and composes the site chrome directly since
 * the root layout no longer renders it.
 */
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <Container className="py-16 sm:py-24">
          <div className="max-w-xl space-y-4">
            <p className="text-muted text-sm font-semibold">404</p>
            <h1 className="text-forest text-3xl font-bold tracking-tight">
              Page not found
            </h1>
            <p className="text-muted text-base">
              The page you were looking for doesn&apos;t exist or has moved.
            </p>
            <Link
              href="/"
              className="bg-forest text-background hover:bg-forest-600 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium"
            >
              Back to home
            </Link>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
