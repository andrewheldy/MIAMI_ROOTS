import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { siteConfig } from "@/config/site";

/**
 * Global site header: the approved primary Miami Roots mark plus wordmark,
 * linking home. Kept intentionally minimal for the foundation shell — no
 * navigation targets exist yet, so none are invented.
 */
export function SiteHeader() {
  return (
    <header className="border-border bg-background border-b">
      <Container as="nav" className="flex items-center py-4">
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
      </Container>
    </header>
  );
}
