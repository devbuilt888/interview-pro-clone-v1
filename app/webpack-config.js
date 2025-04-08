/**
 * This file is used by next.config.js to help configure webpack
 * for proper handling of chrome-aws-lambda and source map files
 */

// Helper function to configure webpack to ignore source map files
export function ignoreSourceMaps(config) {
  if (!config.module) {
    config.module = { rules: [] };
  }
  
  if (!config.module.rules) {
    config.module.rules = [];
  }
  
  // Exclude source map (.map) files from being processed
  config.module.rules.push({
    test: /\.map$/,
    loader: 'ignore-loader',
    include: /node_modules[\\/]chrome-aws-lambda/,
  });
  
  return config;
}

// Helper to exclude chrome-aws-lambda from client-side bundles
export function excludeChromiumFromClient(config, { isServer }) {
  if (!isServer) {
    if (!config.resolve) {
      config.resolve = { alias: {} };
    }
    
    if (!config.resolve.alias) {
      config.resolve.alias = {};
    }
    
    // Prevent chrome-aws-lambda from being bundled on the client
    config.resolve.alias['chrome-aws-lambda'] = false;
  }
  
  return config;
}

// Configure specific libraries to be properly bundled on the server side
export function configureServerBundles(config, { isServer }) {
  if (isServer) {
    // Make sure these libraries are properly bundled on the server
    if (!config.externals) {
      config.externals = [];
    }
    
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
} 