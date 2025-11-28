import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  headers: async () => [
    {
      source: '/vorschau/:path*',
      headers: [
        { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate, max-age=0' },
        { key: 'Pragma', value: 'no-cache' },
        { key: 'Expires', value: '0' },
      ],
    },
  ],
  experimental: {
    serverComponentsExternalPackages: ["child_process"],
  },
  turbopack: {
     root: path.resolve(__dirname),
  },
};

export default nextConfig;
