import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.2dgalleries.com",
        pathname: "/planches/**",
      },
    ],
  },
};

export default nextConfig;
