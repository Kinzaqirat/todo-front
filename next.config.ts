import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  productionBrowserSourceMaps: false, // prevents production sourcemaps

  // Enable standalone output for optimized Docker builds
  output: 'standalone',
};

export default nextConfig;
