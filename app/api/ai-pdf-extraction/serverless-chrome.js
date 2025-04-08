/**
 * Special helper for ensuring Chrome is available in serverless environments
 */

// Try importing the main libraries
let chromeAWSLambda;
try {
  chromeAWSLambda = require('chrome-aws-lambda');
} catch (e) {
  console.error('Failed to import chrome-aws-lambda:', e.message);
  chromeAWSLambda = null;
}

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
  executablePath: null,
  headless: true
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
      break;
    } catch (e) {
      // Path not found, try next
    }
  }
} catch (e) {
  console.warn('Could not locate puppeteer module:', e.message);
}

// Helper to get the correct Chrome path in various environments
async function getVercelChromePath() {
  // First, try chrome-aws-lambda if available
  if (chromeAWSLambda && chromeAWSLambda.executablePath) {
    try {
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
  
  console.warn('[serverless-chrome] No Chrome path found, will try to use default');
  return null;
}

// Enhance options with correct executablePath
async function getVercelChromeOptions() {
  const options = { ...vercelPuppeteerConfig };
  
  try {
    const executablePath = await getVercelChromePath();
    if (executablePath) {
      options.executablePath = executablePath;
    }
  } catch (e) {
    console.error('[serverless-chrome] Error getting chrome options:', e);
  }
  
  return options;
}

// Export the module
module.exports = {
  chromeAWSLambda,
  getVercelChromePath,
  getVercelChromeOptions,
  puppeteerPath
}; 