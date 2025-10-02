import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    '*.replit.dev',
    '*.repl.co', 
    '*.replit.app',
    'localhost',
    '127.0.0.1'
  ],
};

export default nextConfig;
