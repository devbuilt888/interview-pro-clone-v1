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
  // Add webpack configuration to handle PDF.js correctly
  webpack: (config, { isServer }) => {
    // Use proper handling for PDF.js
    config.resolve.alias.pdfjs = 'pdfjs-dist/build/pdf.min.mjs';
    
    // Resolve critical dependency issue
    config.module.exprContextCritical = false;
    
    // Add resolve fallbacks for ai/react
    config.resolve.alias['ai/react'] = require.resolve('ai/react');
    
    // Fix for serverless environments
    if (isServer) {
      const nodeBuiltins = ['fs', 'path', 'url', 'http', 'https', 'stream', 'zlib'];
      nodeBuiltins.forEach(builtin => {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          [builtin]: false,
        };
      });
    }
    
    return config;
  },
  // Transpile specific modules that might cause issues
  transpilePackages: ['ai', 'pdfjs-dist'],
  // Add server caching for PDF.js worker for better performance
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
      },
      {
        // Add specific caching for PDF.js worker
        source: '/pdf.worker.min.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache CDN resources
        source: '/(.*).worker.min.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Proper caching for standard fonts
        source: '/standard_fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Proper caching for CMap files
        source: '/cmaps/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  // Extend Next.js to support service worker for PDF.js worker caching
  experimental: {
    serviceworker: {
      register: true,
      scope: '/',
      cache: 'true',
    },
  },
};

module.exports = nextConfig
