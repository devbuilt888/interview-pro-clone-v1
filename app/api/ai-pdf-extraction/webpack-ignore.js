/**
 * This file provides a safer way to import Puppeteer and chrome-aws-lambda
 * for use with Vercel deployments
 */

// Import our serverless chrome helper first
const serverlessHelper = require('./serverless-chrome');

let puppeteer;
let chromium;

// Use a try-catch to handle import failures gracefully
try {
  // First try chromium from the serverless helper
  if (serverlessHelper.chromeAWSLambda) {
    console.log('Using chrome-aws-lambda from serverless helper');
    chromium = serverlessHelper.chromeAWSLambda;
    
    // If chrome-aws-lambda has puppeteer property, use it
    if (chromium.puppeteer) {
      console.log('Using bundled puppeteer from chrome-aws-lambda');
      puppeteer = chromium.puppeteer;
    }
  }
  
  // If we don't have puppeteer yet, try to import it directly
  if (!puppeteer) {
    // Try puppeteer-core first, then fallback to puppeteer
    try {
      console.log('Loading puppeteer-core directly');
      puppeteer = require('puppeteer-core');
    } catch (e1) {
      try {
        console.log('Loading full puppeteer package');
        puppeteer = require('puppeteer');
      } catch (e2) {
        console.warn('Failed to import puppeteer packages, using fallback implementation');
        // Provide minimal implementation if imports fail
        puppeteer = {
          launch: () => Promise.resolve({
            newPage: () => Promise.resolve({
              goto: () => Promise.resolve(),
              setViewport: () => Promise.resolve(),
              screenshot: () => Promise.resolve(),
              waitForTimeout: () => Promise.resolve(),
              close: () => Promise.resolve()
            }),
            close: () => Promise.resolve()
          })
        };
      }
    }
  }
  
  // If we don't have chromium yet, create a minimal implementation
  if (!chromium) {
    console.log('Creating minimal chromium implementation');
    chromium = {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ],
      executablePath: null,
      headless: true,
      puppeteer: puppeteer // Add reference to puppeteer
    };
  }
} catch (generalError) {
  console.error('Unexpected error initializing puppeteer/chromium:', generalError);
  // Create fallback implementations for both
  puppeteer = {
    launch: () => Promise.resolve({
      newPage: () => Promise.resolve({
        goto: () => Promise.resolve(),
        setViewport: () => Promise.resolve(),
        screenshot: () => Promise.resolve(),
        waitForTimeout: () => Promise.resolve(),
        close: () => Promise.resolve()
      }),
      close: () => Promise.resolve()
    })
  };
  
  chromium = {
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ],
    executablePath: null,
    headless: true
  };
}

/**
 * Enhanced check if we're in a Vercel environment
 * More reliable detection using multiple environment variables
 */
const isVercelProduction = process.env.VERCEL === '1' || 
                          !!process.env.VERCEL_URL || 
                          !!process.env.VERCEL_REGION ||
                          !!process.env.VERCEL_ENV ||
                          process.env.NODE_ENV === 'production';

/**
 * Get Chrome executable path based on the environment
 * Uses the serverless helper for better compatibility
 */
async function getChromePath() {
  try {
    // For Vercel environment, use our specialized helper
    if (isVercelProduction) {
      console.log('Getting Chrome path for Vercel environment');
      return await serverlessHelper.getVercelChromePath();
    }
    
    // For local development, use the system's Chrome installation
    if (process.platform === 'win32') {
      return 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    } else if (process.platform === 'linux') {
      // Check common Linux Chrome/Chromium locations
      const possiblePaths = [
        '/usr/bin/google-chrome',
        '/usr/bin/google-chrome-stable',
        '/usr/bin/chromium',
        '/usr/bin/chromium-browser'
      ];
      
      for (const path of possiblePaths) {
        try {
          if (require('fs').existsSync(path)) {
            return path;
          }
        } catch (e) {
          // Ignore error and continue
        }
      }
      
      return '/usr/bin/google-chrome'; // Default fallback
    } else {
      return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    }
  } catch (error) {
    console.error('Error determining Chrome path:', error);
    return null;
  }
}

/**
 * Get optimized browser options for the current environment
 */
async function getBrowserOptions() {
  if (isVercelProduction) {
    return await serverlessHelper.getVercelChromeOptions();
  }
  
  // Default options for local development
  return {
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ],
    headless: true,
    executablePath: await getChromePath()
  };
}

// Export the modules
module.exports = {
  puppeteer,
  chromium,
  getChromePath,
  getBrowserOptions,
  isVercelProduction
}; 