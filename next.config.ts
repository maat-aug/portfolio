import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.NODE_ENV === "production" ? { output: "export" } : {}),
  experimental: { globalNotFound: true },
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
