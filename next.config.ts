import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  allowedDevOrigins: [
    '*.replit.dev',
    '*.janeway.replit.dev',
    '*.spock.replit.dev',
    process.env.REPLIT_DOMAINS || '',
  ].filter(Boolean),
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['src/app', 'src/components', 'src/lib', 'src/hooks'],
  },
  serverExternalPackages: ['mongoose', 'bcryptjs'],
  productionBrowserSourceMaps: false,
  devIndicators: {
    buildActivityPosition: 'bottom-right',
  },
  experimental: {
    serverActions: {
      allowedOrigins: process.env.NODE_ENV === 'development' ? ['*'] : [],
    },
    webpackMemoryOptimizations: true,
    webpackBuildWorker: true,
    optimizePackageImports: [
      '@fortawesome/fontawesome-free',
      '@ant-design/icons',
      'antd',
      'react-bootstrap',
      'bootstrap',
      '@fullcalendar/react',
      '@fullcalendar/core',
      'react-icons',
    ],
  },
  transpilePackages: [
    'antd',
    '@ant-design/icons',
    'rc-util',
    'rc-pagination',
    'rc-picker',
  ],
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
      };
    }
    
    if (isServer) {
      config.externals.push('mongoose', 'bcryptjs', '@node-rs/bcrypt');
    }
    
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      })
    );
    
    return config;
  },
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
