import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'scontent-hou1-1.cdninstagram.com',
      'scontent-atl3-1.cdninstagram.com',
      'scontent-lax3-1.cdninstagram.com',
      // Add more Instagram CDN subdomains as needed
    ],
  },
};

export default nextConfig;
