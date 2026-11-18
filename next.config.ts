import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Phones open the dev server by LAN IP or a .local name, not "localhost".
  // Next blocks those origins from loading dev JavaScript, so the page stays
  // on the server-rendered loading screen and never starts.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.*.*.*", "*.local"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
