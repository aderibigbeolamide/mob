import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['mongoose'],
  allowedDevOrigins: [
    '*.replit.dev',
    '*.repl.co',
    '*.replit.app',
    '127.0.0.1',
    'localhost',
  ],
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
};

export default nextConfig;
