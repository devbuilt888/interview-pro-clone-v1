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
    // Improved handling for PDF.js ESM modules
    // Use proper handling for PDF.js
    config.resolve.alias.pdfjs = 'pdfjs-dist/build/pdf.mjs';
    
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
        'pdfjs-dist/build/pdf.worker.mjs': 'pdfjs-dist/build/pdf.worker.mjs',
      });
      
      // Complete exclusion of canvas package - don't even try to compile it
      config.externals.push(function(context, request, callback) {
        if (request === 'canvas' || request.includes('canvas/') || request.startsWith('canvas\\')) {
          return callback(null, 'commonjs ./canvas-mock.js');
        }
        
        // Also exclude various node-specific PDF.js utilities
        if (request.includes('pdfjs-dist/lib/display/node_')) {
          return callback(null, 'commonjs ' + request);
        }
        
        callback();
      });
    } else {
      // On client side, ensure the worker is properly included
      config.resolve.alias['pdfjs-dist/build/pdf.worker.mjs'] = 
        require.resolve('pdfjs-dist/build/pdf.worker.mjs');
        
      // Add canvas mock on client side too
      config.resolve.alias.canvas = require.resolve('./canvas-mock.js');
    }
    
    // Add special rule for PDF.js ESM modules
    config.module.rules.push({
      test: /\.mjs$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false
      }
    });
    
    // Add support for ESM modules
    config.resolve.extensionAlias = {
      '.js': ['.js', '.mjs', '.cjs'],
      '.mjs': ['.mjs', '.js', '.cjs'],
      '.cjs': ['.cjs', '.js', '.mjs']
    };
    
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
        source: '/(.*).worker.(min.js|mjs)$',
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
