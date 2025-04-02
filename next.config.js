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
    
    return config;
  },
};

module.exports = nextConfig
