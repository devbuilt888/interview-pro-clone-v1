/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Simplified webpack configuration for Vercel
  webpack: (config, { isServer }) => {
    // Resolve critical dependency issue
    config.module.exprContextCritical = false;
    
    // Add resolve fallbacks for ai/react
    config.resolve.alias['ai/react'] = require.resolve('ai/react');
    
    // Fix for serverless environments - more explicit node builtin handling
    if (isServer) {
      const nodeBuiltins = ['fs', 'path', 'url', 'http', 'https', 'stream', 'zlib'];
      nodeBuiltins.forEach(builtin => {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          [builtin]: false,
        };
      });
      
      // Completely ignore canvas dependency
      config.externals.push(function(context, request, callback) {
        if (/canvas/.test(request)) {
          return callback(null, 'commonjs ./empty-canvas-shim.js');
        }
        callback();
      });
    }
    
    return config;
  },
  // Transpile specific modules that might cause issues
  transpilePackages: ['ai'],
  // Add server caching for static resources
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      }
    ];
  }
};

module.exports = nextConfig
