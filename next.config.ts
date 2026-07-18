import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        // Chat redirect gates: keep them out of search indexes at the HTTP
        // layer (the 307 redirect response has no <meta> tags), and send no
        // referrer onward so the /go URL a visitor came from isn't shared
        // with WhatsApp or anything after it.
        source: "/go/:slug",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
    ];
  },
};

export default nextConfig;
