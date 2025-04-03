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
    // Use proper handling for PDF.js legacy bundle
    config.resolve.alias.pdfjs = 'pdfjs-dist/legacy/build/pdf.js';
    
    // Resolve critical dependency issue
    config.module.exprContextCritical = false;
    
    // Add resolve fallbacks for ai/react
    config.resolve.alias['ai/react'] = require.resolve('ai/react');
    
    // Fix for serverless environments - more explicit worker handling
    if (isServer) {
      const nodeBuiltins = ['fs', 'path', 'url', 'http', 'https', 'stream', 'zlib'];
      nodeBuiltins.forEach(builtin => {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          [builtin]: false,
        };
      });
      
      // Add specific handling for PDF.js worker in serverless
      config.externals.push({
        'pdfjs-dist/legacy/build/pdf.worker.js': 'pdfjs-dist/legacy/build/pdf.worker.js',
      });
    } else {
      // On client side, ensure the worker is properly included
      config.resolve.alias['pdfjs-dist/legacy/build/pdf.worker.js'] = 
        require.resolve('pdfjs-dist/legacy/build/pdf.worker.js');
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
        source: '/pdf.worker.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache CDN resources
        source: '/(.*).worker.js',
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
