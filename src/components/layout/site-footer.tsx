import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { siteConfig } from "@/config/site";

/**
 * Global site footer. Server-rendered, so the year is computed once at
 * render time with no client hydration mismatch.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-forest">
      <Container className="max-w-7xl py-16 sm:py-20">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3"
              aria-label={`${siteConfig.name} — home`}
            >
              <Image
                src="/brand/logos/miami-roots-logo.png"
                alt=""
                width={48}
                height={48}
                className="h-12 w-12 rounded-xl"
              />
              <span className="font-display text-cream text-xl font-semibold tracking-[-0.03em]">
                {siteConfig.name}
              </span>
            </Link>
            <p className="font-display text-cream mt-10 max-w-2xl text-4xl leading-[1.02] font-semibold tracking-[-0.045em] sm:text-6xl">
              Help people find their people.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:justify-self-end">
            <FooterColumn
              title="Explore"
              links={[
                ["Communities", "/groups"],
                ["Find your people", "/find-your-people"],
                ["Join", "/join"],
              ]}
            />
            <FooterColumn
              title="Miami Roots"
              links={[
                ["About", "/about"],
                ["Impact", "/impact"],
                ["Get involved", "/get-involved"],
                ["Guidelines", "/guidelines"],
              ]}
            />
            <div>
              <FooterColumn
                title="Build with us"
                links={[
                  ["Partners", "/partners"],
                  ["Contact", "/contact"],
                ]}
              />
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-white/15 pt-7 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
          <p>
            An emerging 18+ community network. Applications are not yet live.
          </p>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<readonly [string, string]>;
}) {
  return (
    <div>
      <p className="text-mint text-xs font-semibold tracking-[0.16em] uppercase">
        {title}
      </p>
      <ul className="mt-5 space-y-3">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link
              href={href}
              className="text-cream/60 hover:text-cream text-sm transition-colors"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
