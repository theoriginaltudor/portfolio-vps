import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Disable image optimization for all images
  },
  experimental: {
    viewTransition: true,
  },
  /* config options here */
};

export default nextConfig;
