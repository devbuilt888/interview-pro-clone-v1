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
    const { isServer } = options;
    
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
    
    // Add additional fallbacks for browser APIs
    config.resolve.fallback = {
      ...config.resolve.fallback,
      child_process: false,
      crypto: false,
      os: false,
      http2: false,
      net: false,
      tls: false,
      dns: false
    };
    
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
    
    // Explicitly handle chrome-aws-lambda and puppeteer source maps and dependencies
    config.module.rules.push({
      test: /\.map$/,
      use: 'ignore-loader',
      include: [
        /node_modules[\\/]chrome-aws-lambda/,
        /node_modules[\\/]puppeteer/,
        /node_modules[\\/]puppeteer-core/
      ]
    });
    
    // Handle problematic files in puppeteer packages
    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
    });
    
    // Provide specific modules for chrome-aws-lambda
    config.plugins.push(
      new options.webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      })
    );
    
    // Avoid bundling chrome-aws-lambda on the client
    if (!isServer) {
      config.resolve.alias['chrome-aws-lambda'] = path.resolve(__dirname, './app/api/ai-pdf-extraction/client-shim.js');
      config.resolve.alias['puppeteer'] = path.resolve(__dirname, './app/api/ai-pdf-extraction/client-shim.js');
      config.resolve.alias['puppeteer-core'] = path.resolve(__dirname, './app/api/ai-pdf-extraction/client-shim.js');
    }
    
    // For server-side, ensure these modules are bundled correctly
    if (isServer) {
      // Filter out chrome-aws-lambda and puppeteer from externals
      if (Array.isArray(config.externals)) {
        config.externals = config.externals.filter(external => {
          if (typeof external === 'function') {
            const externalString = external.toString();
            return !(
              externalString.includes('chrome-aws-lambda') || 
              externalString.includes('puppeteer-core') ||
              externalString.includes('puppeteer')
            );
          }
          return true;
        });
      }
      
      // Add critical dependencies to output as modules
      config.output = {
        ...config.output,
        strictModuleExceptionHandling: true
      };
    }
    
    return config;
  },
  // Transpile specific modules that might cause issues
  transpilePackages: ['ai', 'pdfjs-dist', 'chrome-aws-lambda', 'puppeteer-core'],
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
  },
  // Disable output file tracing for the API routes with Puppeteer
  experimental: {
    outputFileTracingExcludes: {
      '/api/ai-pdf-extraction/**': [
        '**/node_modules/puppeteer/**',
        '**/node_modules/puppeteer-core/**',
        '**/node_modules/chrome-aws-lambda/**'
      ]
    }
  }
};

module.exports = nextConfig
