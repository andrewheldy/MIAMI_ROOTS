import Link from "next/link";

import { Container } from "@/components/layout/container";
import { joinNavLink } from "@/config/navigation";
import { siteConfig } from "@/config/site";

const footerLinks = [
  { href: "/groups", label: "The rooms" },
  { href: "/invite", label: "Invite a friend" },
  { href: "/guidelines", label: "House rules" },
  { href: "/connectors", label: "Founding Connectors" },
] as const;

/**
 * Global site footer. Server-rendered, so the year is computed once at
 * render time with no client hydration mismatch. The join action appears here
 * as it does everywhere else: same label, same destination, plain anchor
 * because the route redirects out to WhatsApp.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-border bg-surface mt-auto border-t">
      <Container className="flex flex-col gap-8 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="text-muted flex flex-col gap-1 text-sm">
          <p className="text-forest font-medium">{siteConfig.name}</p>
          <p>Real people, real community, rooted in Miami.</p>
          <a
            href={joinNavLink.href}
            className="text-forest mt-3 inline-flex min-h-11 w-fit items-center font-semibold underline underline-offset-4 hover:no-underline"
          >
            {joinNavLink.label}
          </a>
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
                  className="hover:text-forest inline-flex min-h-11 items-center rounded-md transition-colors sm:min-h-0 sm:py-1.5"
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
