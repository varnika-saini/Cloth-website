/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  images: {
    // Optimization ON → Next.js auto-resizes & serves AVIF/WebP, so the
    // store stays light and loads smoothly on phones / low data.
    formats: ["image/avif", "image/webp"],
    // Quality values used across the app (next/image requires each to be listed).
    qualities: [65, 70, 75],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Only remote host still used: review avatars.
    remotePatterns: [{ protocol: "https", hostname: "i.pravatar.cc" }],
  },
  experimental: {
    optimizePackageImports: ["react-icons"],
  },
};

export default nextConfig;
