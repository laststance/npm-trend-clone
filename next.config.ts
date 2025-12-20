import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Enable standalone output for Docker deployments.
   * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/output
   */
  output: "standalone",

  /**
   * Configure headers for CORS and security.
   * @see https://nextjs.org/docs/app/api-reference/next-config-js/headers
   */
  async headers() {
    return [
      {
        // Apply CORS headers to API routes
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
          {
            key: "Access-Control-Max-Age",
            value: "86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
