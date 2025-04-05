/** @type {import('next').NextConfig} */
const path = require('path');

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
    
    // Handle canvas dependency for PDF.js
    config.resolve.alias.canvas = path.resolve(__dirname, './canvas-pkg/index.js');
    
    // Fix for serverless environments - more explicit node builtin handling
    const nodeBuiltins = ['fs', 'path', 'url', 'http', 'https', 'stream', 'zlib'];
    nodeBuiltins.forEach(builtin => {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        [builtin]: false,
      };
    });
    
    // Completely ignore canvas dependency
    config.externals.push(function(context, request, callback) {
      if (/canvas$/.test(request)) {
        return callback(null, 'commonjs ' + path.resolve(__dirname, './canvas-pkg/index.js'));
      }
      // Ignore PDF.js worker imports in serverless environment
      if (/pdfjs-dist\/build\/pdf\.worker/.test(request)) {
        return callback(null, '{}');
      }
      callback();
    });
    
    // Fix for pdfjs-dist in webpack 5
    config.module.rules.push({
      test: /pdf\.worker\.(min\.)?js/,
      type: 'asset/resource',
      generator: {
        filename: 'static/chunks/[name].[hash][ext]',
      },
    });
    
    return config;
  },
  // Transpile specific modules that might cause issues
  transpilePackages: ['ai', 'pdfjs-dist'],
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
