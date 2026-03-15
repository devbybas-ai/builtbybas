import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// In dev mode, webpack HMR requires 'unsafe-eval' for source maps and fast refresh.
// In production, eval is never needed and must stay blocked.
const scriptSrc = isDev
  ? "'self' 'unsafe-inline' 'unsafe-eval' https://analytics.builtbybas.com"
  : "'self' 'unsafe-inline' https://analytics.builtbybas.com";

// Dev mode also needs ws: for HMR websocket connections.
const connectSrc = isDev
  ? "'self' https://analytics.builtbybas.com ws://localhost:*"
  : "'self' https://analytics.builtbybas.com";

const csp = [
  "default-src 'self'",
  `script-src ${scriptSrc}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src ${connectSrc}`,
  "frame-ancestors 'none'",
].join("; ") + ";";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pg", "bcryptjs"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
          {
            key: "Content-Security-Policy",
            value: csp,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
