import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { ArrowUpRightIcon, MenuIcon } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";

const mobileNavLinks = [
  ["Communities", "/groups"],
  ["Find your people", "/find-your-people"],
  ["Impact", "/impact"],
  ["Partners", "/partners"],
  ["About", "/about"],
  ["Get involved", "/get-involved"],
  ["Join", "/join"],
  ["Community guidelines", "/guidelines"],
] as const;

const desktopNavLinks = [
  ["Communities", "/groups"],
  ["Impact", "/impact"],
  ["Partners", "/partners"],
  ["About", "/about"],
] as const;

/**
 * Global public navigation. The disclosure-based mobile menu stays functional
 * without client-side JavaScript.
 */
export function SiteHeader() {
  return (
    <header className="border-forest/10 bg-background/90 sticky top-0 z-50 border-b backdrop-blur-xl">
      <Container
        as="nav"
        className="flex h-20 items-center justify-between gap-8"
      >
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-md"
          aria-label={`${siteConfig.name} — home`}
        >
          <Image
            src="/brand/logos/miami-roots-logo.png"
            alt=""
            width={40}
            height={40}
            priority
            className="h-10 w-10 rounded-xl transition-transform duration-300 group-hover:-rotate-3"
          />
          <span className="font-display text-forest text-lg font-semibold tracking-[-0.03em]">
            {siteConfig.name}
          </span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {desktopNavLinks.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="text-forest/65 hover:text-forest text-sm font-medium transition-colors"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/join"
            className="bg-forest text-cream hover:bg-forest-600 inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors"
          >
            Join
            <ArrowUpRightIcon className="h-4 w-4" />
          </Link>
        </div>

        <details className="mobile-menu relative lg:hidden">
          <summary className="border-forest/15 text-forest grid h-11 w-11 cursor-pointer list-none place-items-center rounded-full border [&::-webkit-details-marker]:hidden">
            <span className="sr-only">Open navigation</span>
            <MenuIcon className="h-5 w-5" />
          </summary>
          <div className="border-forest/10 bg-cream absolute top-14 right-0 w-[min(20rem,calc(100vw-2.5rem))] rounded-3xl border p-3 shadow-2xl">
            {mobileNavLinks.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="text-forest hover:bg-mint-100 flex items-center justify-between rounded-2xl px-4 py-3 text-base font-medium transition-colors"
              >
                {label}
                <ArrowUpRightIcon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </details>
      </Container>
    </header>
  );
}
