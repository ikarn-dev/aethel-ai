import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
