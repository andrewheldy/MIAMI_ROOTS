import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

/**
 * Layout for the main site: global header, content region, global footer.
 * The `/join` shareable hub and `/go` redirect routes live outside this group
 * and provide their own minimal chrome, so the hub can be a full-bleed,
 * standalone page without stacking two footers.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
