/**
 * This file provides a safer way to import Puppeteer and chrome-aws-lambda
 * for use with Vercel deployments
 */

// Import our serverless chrome helper first
const serverlessHelper = require('./serverless-chrome');
console.log('Loaded serverless-chrome helper');

// Import debug tools
const browserDebug = require('./browser-debug');
console.log('Loaded browser-debug helper');

// Run environment diagnostics
console.log('Running environment diagnostics...');
browserDebug.debugEnvironment();

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
      headless: serverlessHelper.isVercel ? 'new' : true,
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
    headless: serverlessHelper.isVercel ? 'new' : true
  };
}

/**
 * Enhanced check if we're in a Vercel environment
 * More reliable detection using multiple environment variables
 */
const isVercelProduction = serverlessHelper.isVercel || 
                          process.env.NODE_ENV === 'production';

// Log environment information for debugging
console.log('Environment detection from webpack-ignore:', {
  isVercelProduction,
  isServerlessHelperVercel: serverlessHelper.isVercel,
  NODE_ENV: process.env.NODE_ENV
});

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
  console.log('Getting browser options for environment type:', isVercelProduction ? 'Vercel' : 'Local');
  
  let options;
  if (isVercelProduction) {
    options = await serverlessHelper.getVercelChromeOptions();
  } else {
    // Default options for local development
    options = {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ],
      headless: true,
      executablePath: await getChromePath()
    };
  }
  
  // Use debug helper to log browser configuration
  browserDebug.logBrowserConfig(options);
  
  return options;
}

/**
 * Launch a browser with enhanced error handling and fallbacks
 */
async function launchBrowser(options = null) {
  console.log('Attempting to launch browser');
  let browser = null;
  
  // Get options if not provided
  options = options || await getBrowserOptions();
  
  try {
    // Special handling for Vercel
    if (isVercelProduction) {
      console.log('Vercel environment detected, using direct Puppeteer launch');
      
      // We try to ensure Puppeteer uses the right binary in Vercel
      const puppeteerPkg = require('puppeteer');
      console.log('Using direct Puppeteer package, version detected:', puppeteerPkg.version || 'unknown');
      
      if (options && options.executablePath) {
        console.log(`Launching with specified executablePath: ${options.executablePath}`);
      } else {
        console.log('No executablePath specified, using puppeteer default');
        // Let's add a special case for headless mode in newer Puppeteer versions
        if (typeof options.headless === 'boolean' && options.headless) {
          options.headless = 'new';
          console.log('Updated headless mode to "new" for compatibility with newer Puppeteer');
        }
      }
      
      try {
        browser = await puppeteerPkg.launch(options);
        console.log('Browser launched successfully with Puppeteer');
        return browser;
      } catch (vercelError) {
        console.error('Failed to launch with Puppeteer in Vercel:', vercelError);
        // No fallback, just rethrow
        throw vercelError;
      }
    }
    
    // For non-Vercel environments, try all the different methods
    
    // First try: use chrome-aws-lambda's puppeteer if available
    if (chromium && chromium.puppeteer) {
      console.log('Trying to launch with chrome-aws-lambda puppeteer');
      try {
        browser = await chromium.puppeteer.launch(options);
        console.log('Successfully launched browser with chrome-aws-lambda puppeteer');
        return browser;
      } catch (e) {
        console.error('Failed to launch with chrome-aws-lambda puppeteer:', e);
        // Continue to next approach
      }
    }
    
    // Second try: use standard puppeteer
    if (!browser) {
      console.log('Trying to launch with standard puppeteer');
      try {
        browser = await puppeteer.launch(options);
        console.log('Successfully launched browser with standard puppeteer');
        return browser;
      } catch (e) {
        console.error('Failed to launch with standard puppeteer:', e);
        // Continue to fallback
      }
    }
    
    // Final fallback with minimal options
    if (!browser) {
      console.log('Trying minimal fallback options');
      const fallbackOptions = {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: isVercelProduction ? 'new' : true,
        ignoreHTTPSErrors: true
      };
      
      // Keep executable path if it exists
      if (options.executablePath) {
        fallbackOptions.executablePath = options.executablePath;
      }
      
      // Try with chrome-aws-lambda first, then regular puppeteer
      try {
        if (chromium && chromium.puppeteer) {
          browser = await chromium.puppeteer.launch(fallbackOptions);
        } else {
          browser = await puppeteer.launch(fallbackOptions);
        }
        console.log('Successfully launched browser with fallback options');
        return browser;
      } catch (finalError) {
        console.error('All browser launch attempts failed:', finalError);
        throw new Error('Failed to launch browser after multiple attempts: ' + finalError.message);
      }
    }
  } catch (error) {
    console.error('Error in launchBrowser:', error);
    throw error;
  }
}

// Export the modules
module.exports = {
  puppeteer,
  chromium,
  getChromePath,
  getBrowserOptions,
  launchBrowser,
  isVercelProduction
}; 