import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site (every route is static/SSG) — export to `out/` for
  // hosting on Cloudflare Pages. `images.unoptimized` is required by export.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
