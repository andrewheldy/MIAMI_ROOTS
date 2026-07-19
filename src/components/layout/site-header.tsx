"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Container } from "@/components/layout/container";
import { MobileNav } from "@/components/layout/mobile-nav";
import { cn } from "@/lib/cn";
import { desktopNavLinks, joinNavLink } from "@/config/navigation";
import { siteConfig } from "@/config/site";

/**
 * Global site header. A sticky bar that stays lightweight: the approved parent
 * mark + wordmark linking home, a clean horizontal nav on desktop, and a
 * hamburger-driven sheet (`MobileNav`) on mobile and tablet. It picks up a
 * subtle bottom border and shadow once the page scrolls, so it reads as layered
 * over content without heavy glassmorphism.
 *
 * Client Component only for the scroll state and menu interaction — it renders
 * static config and reaches no server data.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "bg-background/85 sticky top-0 z-50 pt-[env(safe-area-inset-top)] backdrop-blur-sm transition-shadow",
        scrolled
          ? "border-border border-b shadow-sm"
          : "border-b border-transparent",
      )}
    >
      <Container
        as="nav"
        className="flex items-center justify-between gap-3 py-3"
        aria-label="Primary"
      >
        <Link
          href="/"
          className="group relative z-50 flex min-w-0 items-center gap-2.5 rounded-md sm:gap-3"
          aria-label={`${siteConfig.name} — home`}
        >
          <Image
            src="/brand/logos/miami-roots-logo.png"
            alt=""
            width={40}
            height={40}
            priority
            className="h-9 w-9 rounded-md sm:h-10 sm:w-10"
          />
          <span className="text-forest truncate text-base font-semibold tracking-tight sm:text-lg">
            {siteConfig.name}
          </span>
        </Link>

        {/* Desktop navigation — hidden on mobile/tablet, where MobileNav owns it. */}
        <ul className="hidden items-center gap-1 lg:flex">
          {desktopNavLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-muted hover:text-forest hover:bg-surface inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors"
              >
                {link.desktopLabel ?? link.label}
              </Link>
            </li>
          ))}
          <li className="ml-1">
            <Link
              href={joinNavLink.href}
              className="bg-forest text-background hover:bg-forest-600 inline-flex min-h-11 items-center rounded-lg px-4 text-sm font-semibold whitespace-nowrap transition-colors"
            >
              {joinNavLink.label}
            </Link>
          </li>
        </ul>

        <MobileNav />
      </Container>
    </header>
  );
}
