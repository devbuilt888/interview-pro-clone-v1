/**
 * This file provides a safer way to import Puppeteer and chrome-aws-lambda
 * for use with Vercel deployments
 */

let puppeteer;
let chromium;

// Use a try-catch to handle import failures gracefully
try {
  // First try puppeteer-core which is more lightweight
  puppeteer = require('puppeteer-core');
} catch (e1) {
  try {
    // If that fails, try the full puppeteer package
    console.warn('Failed to import puppeteer-core, trying puppeteer');
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

try {
  // Try to import chrome-aws-lambda directly
  chromium = require('chrome-aws-lambda');
} catch (e) {
  console.warn('Failed to import chrome-aws-lambda, using fallback implementation');
  // Provide minimal implementation if import fails
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
 */
async function getChromePath() {
  try {
    // Check for Vercel environment using multiple indicators
    if (isVercelProduction) {
      console.log('Running in Vercel environment');
      
      // In Vercel, we want to use the default Chromium from chrome-aws-lambda if possible
      try {
        if (chromium.executablePath) {
          const chromePath = await chromium.executablePath;
          if (chromePath) {
            console.log('Using chrome-aws-lambda executable path');
            return chromePath;
          }
        }
      } catch (err) {
        console.warn('chrome-aws-lambda path not available:', err);
      }
      
      // If we can't get a path from chrome-aws-lambda, don't specify an executablePath
      return null;
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

// Export the modules
module.exports = {
  puppeteer,
  chromium,
  getChromePath,
  isVercelProduction
}; 