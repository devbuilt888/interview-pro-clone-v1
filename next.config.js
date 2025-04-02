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
  webpack: (config) => {
    // Use proper handling for PDF.js
    config.resolve.alias.pdfjs = 'pdfjs-dist/build/pdf.min.mjs';
    
    // Resolve critical dependency issue
    config.module.exprContextCritical = false;
    
    // Add resolve fallbacks for ai/react
    config.resolve.alias['ai/react'] = require.resolve('ai/react');
    
    return config;
  },
  // Transpile specific modules that might cause issues
  transpilePackages: ['ai'],
};

module.exports = nextConfig
