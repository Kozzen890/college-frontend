import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  // assetPrefix: 'https://college.youthmultiply.com',
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
