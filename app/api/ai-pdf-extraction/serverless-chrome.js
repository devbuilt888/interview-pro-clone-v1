/**
 * Special helper for ensuring Chrome is available in serverless environments
 */

// Try importing the main libraries
let chromeAWSLambda;
try {
  chromeAWSLambda = require('chrome-aws-lambda');
  console.log('Successfully loaded chrome-aws-lambda');
} catch (e) {
  console.error('Failed to import chrome-aws-lambda:', e.message);
  chromeAWSLambda = null;
}

// Try to detect if we're in a Vercel environment
const isVercel = process.env.VERCEL === '1' || 
                !!process.env.VERCEL_URL || 
                !!process.env.VERCEL_REGION ||
                !!process.env.VERCEL_ENV;

console.log('Environment detection - isVercel:', isVercel);
console.log('Vercel environment variables:', {
  VERCEL: process.env.VERCEL,
  VERCEL_URL: process.env.VERCEL_URL,
  VERCEL_REGION: process.env.VERCEL_REGION,
  VERCEL_ENV: process.env.VERCEL_ENV,
  NODE_ENV: process.env.NODE_ENV,
  PUPPETEER_SKIP_CHROMIUM_DOWNLOAD: process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD
});

// Fallback mechanism to emulate chrome-aws-lambda for Vercel
const vercelPuppeteerConfig = {
  // Configuration specifically for Vercel serverless functions
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--single-process',
    '--disable-gpu',
    '--disable-infobars',
    '--ignore-certificate-errors',
    '--allow-running-insecure-content',
    '--disable-extensions',
    '--disable-sync',
    '--disable-background-networking',
    '--hide-scrollbars',
    '--metrics-recording-only',
    '--mute-audio',
    '--disable-web-security'
  ],
  defaultViewport: {
    width: 1600,
    height: 1200,
    deviceScaleFactor: 2,
    isMobile: false,
    hasTouch: false,
    isLandscape: true
  },
  // Important: Use 'new' for Puppeteer versions >1.7
  headless: isVercel ? 'new' : true,
  ignoreHTTPSErrors: true,
  dumpio: isVercel, // Log stdout/stderr in Vercel for debugging
  executablePath: null, // Will be set dynamically
  timeout: 30000 // Increase timeout for slower environments
};

// Try to detect Puppeteer installations
let puppeteerPath;
try {
  // Try to locate where Puppeteer is installed
  const possiblePaths = [
    './node_modules/puppeteer',
    './node_modules/puppeteer-core',
    '../node_modules/puppeteer',
    '../node_modules/puppeteer-core',
    '../../node_modules/puppeteer',
    '../../node_modules/puppeteer-core'
  ];
  
  for (const p of possiblePaths) {
    try {
      require.resolve(p);
      puppeteerPath = p;
      console.log('Found puppeteer at:', p);
      break;
    } catch (e) {
      // Path not found, try next
    }
  }
  
  if (!puppeteerPath) {
    console.warn('Could not locate puppeteer module in common paths');
  }
} catch (e) {
  console.warn('Error while searching for puppeteer module:', e.message);
}

// Helper to get the correct Chrome path in various environments
async function getVercelChromePath() {
  console.log('[serverless-chrome] Determining Chrome path for environment');
  
  // First, try chrome-aws-lambda if available
  if (chromeAWSLambda && chromeAWSLambda.executablePath) {
    try {
      console.log('[serverless-chrome] Trying chrome-aws-lambda executablePath');
      const path = await chromeAWSLambda.executablePath;
      console.log('[serverless-chrome] Found chrome-aws-lambda path:', path);
      return path;
    } catch (e) {
      console.error('[serverless-chrome] Failed to get chrome-aws-lambda path:', e);
    }
  }
  
  // If that fails, check if puppeteer is installed and try to use its path
  if (puppeteerPath) {
    try {
      console.log('[serverless-chrome] Trying puppeteer executable path');
      const puppeteer = require(puppeteerPath);
      if (puppeteer.executablePath) {
        const path = puppeteer.executablePath();
        console.log('[serverless-chrome] Using puppeteer executable path:', path);
        return path;
      }
    } catch (e) {
      console.error('[serverless-chrome] Error getting puppeteer executable path:', e);
    }
  }
  
  // For Vercel, if all else fails, try some common Chrome paths
  if (isVercel) {
    console.log('[serverless-chrome] Trying fallback Chrome paths for Vercel');
    const vercelChromePaths = [
      '/tmp/chromium',
      '/tmp/chrome',
      '/var/task/node_modules/chromium/lib/chromium/chrome-linux/chrome',
      '/var/task/node_modules/chrome-aws-lambda/bin/chromium',
      process.env.CHROME_PATH
    ];
    
    const fs = require('fs');
    for (const chromePath of vercelChromePaths) {
      if (chromePath && fs.existsSync(chromePath)) {
        console.log('[serverless-chrome] Found existing Chrome at:', chromePath);
        return chromePath;
      }
    }
  }
  
  console.warn('[serverless-chrome] No Chrome path found, will try to use default');
  return null;
}

// Enhanced browser options for Vercel
async function getVercelChromeOptions() {
  console.log('[serverless-chrome] Getting optimized Chrome options for Vercel');
  
  const options = { ...vercelPuppeteerConfig };
  
  try {
    // For Vercel we specifically need to modify the browser options
    if (isVercel) {
      // In Vercel, it's critical to use chrome-aws-lambda's args
      if (chromeAWSLambda && chromeAWSLambda.args) {
        options.args = chromeAWSLambda.args;
      }
      
      // Get the executable path
      const executablePath = await getVercelChromePath();
      if (executablePath) {
        options.executablePath = executablePath;
      } else if (chromeAWSLambda) {
        // If we couldn't get a specific path but have chrome-aws-lambda,
        // let it determine the path at runtime
        delete options.executablePath;
      }
      
      // Check if '/tmp' is writable, which is important in Lambda/Vercel
      try {
        const fs = require('fs');
        const testFile = '/tmp/chrome-test-' + Date.now();
        fs.writeFileSync(testFile, 'test');
        fs.unlinkSync(testFile);
        console.log('[serverless-chrome] /tmp is writable');
      } catch (e) {
        console.error('[serverless-chrome] /tmp is not writable, may cause issues:', e);
      }
    } else {
      // For non-Vercel environments, get a regular Chrome path
      const executablePath = await getVercelChromePath();
      if (executablePath) {
        options.executablePath = executablePath;
      }
    }
  } catch (e) {
    console.error('[serverless-chrome] Error getting chrome options:', e);
  }
  
  console.log('[serverless-chrome] Final Chrome options:', JSON.stringify(options, null, 2));
  return options;
}

// Export the module
module.exports = {
  chromeAWSLambda,
  getVercelChromePath,
  getVercelChromeOptions,
  puppeteerPath,
  isVercel
}; 