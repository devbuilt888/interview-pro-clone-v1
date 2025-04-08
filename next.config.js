/** @type {import('next').NextConfig} */
const path = require('path');
const fs = require('fs');

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
  webpack: (config, options) => {
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
    
    // Add rule to ignore source map files in chrome-aws-lambda
    config.module.rules.push({
      test: /\.map$/,
      loader: 'ignore-loader',
      include: /node_modules[\\/]chrome-aws-lambda/,
    });
    
    // Prevent chrome-aws-lambda from being bundled on the client side
    if (!options.isServer) {
      if (!config.resolve) {
        config.resolve = { alias: {} };
      }
      
      if (!config.resolve.alias) {
        config.resolve.alias = {};
      }
      
      config.resolve.alias['chrome-aws-lambda'] = false;
    }
    
    // Configure server-side bundling for chrome-aws-lambda and puppeteer-core
    if (options.isServer) {
      if (!config.externals) {
        config.externals = [];
      }
      
      // Ensure the packages are bundled properly on the server
      const includes = ['chrome-aws-lambda', 'puppeteer-core'];
      const filteredExternals = config.externals.filter(external => {
        if (typeof external !== 'function') return true;
        // Keep the external if it's not for the packages we want to bundle
        return !includes.some(include => 
          external.toString().includes(include));
      });
      
      config.externals = filteredExternals;
    }
    
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
