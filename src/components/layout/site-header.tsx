import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { siteConfig } from "@/config/site";

const navLinks = [
  { href: "/groups", label: "Groups" },
  { href: "/guidelines", label: "Community guidelines" },
] as const;

/**
 * Global site header: the approved primary Miami Roots mark plus wordmark linking
 * home, and navigation to the real public destinations that now exist (the group
 * directory and the community guidelines). Server Component — no client state.
 */
export function SiteHeader() {
  return (
    <header className="border-border bg-background border-b">
      <Container
        as="nav"
        className="flex items-center justify-between gap-4 py-4"
        aria-label="Primary"
      >
        <Link
          href="/"
          className="flex items-center gap-3 rounded-md"
          aria-label={`${siteConfig.name} — home`}
        >
          <Image
            src="/brand/logos/miami-roots-logo.png"
            alt=""
            width={40}
            height={40}
            priority
            className="h-10 w-10 rounded-md"
          />
          <span className="text-forest text-lg font-semibold tracking-tight">
            {siteConfig.name}
          </span>
        </Link>
        <ul className="flex items-center gap-4 sm:gap-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-muted hover:text-forest inline-flex min-h-11 items-center rounded-md text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
          {/* The shareable hub is the site's primary conversion path — styled
              as the one filled action in the nav. */}
          <li>
            <Link
              href="/join"
              className="bg-forest text-background hover:bg-forest-600 inline-flex min-h-11 items-center rounded-lg px-4 text-sm font-semibold transition-colors"
            >
              Join the chats
            </Link>
          </li>
        </ul>
      </Container>
    </header>
  );
}
