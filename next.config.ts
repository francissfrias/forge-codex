import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.dota2.com',
        pathname: '/apps/dota2/images/**',
      },
    ],
  },
};

export default nextConfig;
