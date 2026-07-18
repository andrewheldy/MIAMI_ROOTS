import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { siteConfig } from "@/config/site";

import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  icons: {
    icon: "/brand/logos/miami-roots-logo.png",
  },
  // The public gateway is not live yet; keep the foundation shell out of
  // search indexes until the real launch (revisit at the launch milestone).
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  // Provisional brand color — see src/styles/globals.css for token status.
  themeColor: "#003f2c",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground flex min-h-dvh flex-col antialiased">
        <a
          href="#main"
          className="bg-forest text-background sr-only rounded-md px-4 py-2 focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
