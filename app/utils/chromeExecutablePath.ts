import chromium from '@sparticuz/chromium-min';

/**
 * Get the Chrome executable path for the current environment (local or serverless)
 */
export async function getChromeExecutablePath(): Promise<string> {
  // Check if we're in a serverless environment (Vercel, AWS Lambda, etc.)
  if (process.env.AWS_REGION || process.env.VERCEL) {
    return await chromium.executablePath();
  }

  // For local development, use the installed Chrome
  if (process.platform === 'win32') {
    return 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  } else if (process.platform === 'linux') {
    // Common Linux paths
    return '/usr/bin/google-chrome';
  } else {
    // macOS
    return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  }
} 