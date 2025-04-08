/**
 * This is a workaround for issues with chrome-aws-lambda source maps
 * It exports the same functionality but ensures Webpack can process it correctly
 */

import puppeteerCore from 'puppeteer-core';
import chromeAwsLambda from 'chrome-aws-lambda';

// Reexport these for use in the route handler
export const chromium = chromeAwsLambda;
export const puppeteer = puppeteerCore;

// Helper function for getting Chrome executable path
export async function getChromePath() {
  // Check if we're in a serverless environment (Vercel or AWS Lambda)
  if (process.env.AWS_REGION || process.env.VERCEL) {
    // Use chrome-aws-lambda's path
    return await chromeAwsLambda.executablePath;
  }
  
  // For local development, detect the installed Chrome path based on OS
  if (process.platform === 'win32') {
    return 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  } else if (process.platform === 'linux') {
    return '/usr/bin/google-chrome';
  } else {
    return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  }
} 