import { Container } from "@/components/layout/container";
import { siteConfig } from "@/config/site";

/**
 * Global site footer. Server-rendered, so the year is computed once at
 * render time with no client hydration mismatch.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-border bg-surface mt-auto border-t">
      <Container className="text-muted flex flex-col gap-1 py-8 text-sm">
        <p className="text-forest font-medium">{siteConfig.name}</p>
        <p>A private, community-oriented network in Miami.</p>
        <p className="mt-2 text-xs">
          &copy; {year} {siteConfig.name}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
