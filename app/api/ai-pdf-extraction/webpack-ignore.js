/**
 * This file provides a safer way to import Puppeteer and chrome-aws-lambda
 * for use with Vercel deployments
 */

let puppeteer;
let chromium;

// Use a try-catch to handle import failures gracefully
try {
  // Try to import puppeteer-core directly
  puppeteer = require('puppeteer-core');
} catch (e) {
  console.warn('Failed to import puppeteer-core, using fallback empty implementation');
  // Provide minimal implementation if import fails
  puppeteer = {
    launch: () => Promise.resolve({
      newPage: () => Promise.resolve({
        goto: () => Promise.resolve(),
        waitForTimeout: () => Promise.resolve(),
        screenshot: () => Promise.resolve(),
        close: () => Promise.resolve()
      }),
      close: () => Promise.resolve()
    })
  };
}

try {
  // Try to import chrome-aws-lambda directly
  chromium = require('chrome-aws-lambda');
} catch (e) {
  console.warn('Failed to import chrome-aws-lambda, using fallback implementation');
  // Provide minimal implementation if import fails
  chromium = {
    args: [
      '--autoplay-policy=user-gesture-required',
      '--disable-background-networking',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-breakpad',
      '--disable-client-side-phishing-detection',
      '--disable-component-update',
      '--disable-default-apps',
      '--disable-dev-shm-usage',
      '--disable-domain-reliability',
      '--disable-extensions',
      '--disable-features=AudioServiceOutOfProcess',
      '--disable-hang-monitor',
      '--disable-ipc-flooding-protection',
      '--disable-notifications',
      '--disable-offer-store-unmasked-wallet-cards',
      '--disable-popup-blocking',
      '--disable-print-preview',
      '--disable-prompt-on-repost',
      '--disable-renderer-backgrounding',
      '--disable-setuid-sandbox',
      '--disable-speech-api',
      '--disable-sync',
      '--disk-cache-size=33554432',
      '--hide-scrollbars',
      '--ignore-gpu-blacklist',
      '--metrics-recording-only',
      '--mute-audio',
      '--no-default-browser-check',
      '--no-first-run',
      '--no-pings',
      '--no-sandbox',
      '--no-zygote',
      '--password-store=basic',
      '--use-gl=swiftshader',
      '--use-mock-keychain',
      '--single-process'
    ],
    executablePath: null,
    headless: true
  };
}

/**
 * Check if we're in a Vercel production environment
 */
const isVercelProduction = !!process.env.VERCEL && process.env.NODE_ENV === 'production';

/**
 * Get Chrome executable path based on the environment
 */
async function getChromePath() {
  // Check if we're in a serverless environment like Vercel
  if (process.env.AWS_REGION || process.env.VERCEL) {
    try {
      // If we're in Vercel production, we must use the browser endpoint instead
      if (isVercelProduction) {
        // Return null to force using the args without executablePath
        // This signals to Puppeteer to use the remote browser
        return null;
      }
      
      // Try to use chrome-aws-lambda's path for other serverless environments
      return await chromium.executablePath;
    } catch (e) {
      console.error('Error getting chrome-aws-lambda executablePath:', e);
      // Return null to force using browserless.io
      return null;
    }
  }
  
  // For local development
  if (process.platform === 'win32') {
    return 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  } else if (process.platform === 'linux') {
    return '/usr/bin/google-chrome';
  } else {
    return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  }
}

// Export the modules
module.exports = {
  puppeteer,
  chromium,
  getChromePath,
  isVercelProduction
}; 