import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['mongoose'],
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
  experimental: {
    serverActions: {
      allowedOrigins: process.env.NODE_ENV === 'development' ? ['*'] : [],
    },
  },
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'bottom-right',
  },
  allowedDevOrigins: ['*'],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
        ],
      },
    ];
  },
};

export default nextConfig;
