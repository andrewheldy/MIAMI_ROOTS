import Link from "next/link";

import { Container } from "@/components/layout/container";
import { siteConfig } from "@/config/site";

const footerLinks = [
  { href: "/groups", label: "Groups" },
  { href: "/guidelines", label: "Community guidelines" },
] as const;

/**
 * Global site footer. Server-rendered, so the year is computed once at
 * render time with no client hydration mismatch.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-border bg-surface mt-auto border-t">
      <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="text-muted flex flex-col gap-1 text-sm">
          <p className="text-forest font-medium">{siteConfig.name}</p>
          <p>A private, community-oriented network in Miami.</p>
          <p className="mt-2 text-xs">
            &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="text-muted flex flex-col gap-2 text-sm sm:items-end">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-forest rounded-md transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </footer>
  );
}
