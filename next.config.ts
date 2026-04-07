import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["tw-animate-css"],
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
