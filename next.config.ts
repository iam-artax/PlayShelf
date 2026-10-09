import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.rawg.io",
      },
    ],
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.wasm$/,
      type: "asset/resource",
    });

    return config;
  },
};

export default nextConfig;