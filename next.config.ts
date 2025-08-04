import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.icons8.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-App-Name',
            value: 'Aethel AI',
          },
          {
            key: 'X-App-Description', 
            value: 'Next Generation AI Platform',
          },
        ],
      },
    ];
  },
  /* config options here */
};

export default nextConfig;
