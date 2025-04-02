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
};

module.exports = nextConfig
