/**
 * This module helps debug browser issues in various environments
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

/**
 * Examine the environment and browser state
 */
function debugEnvironment() {
  try {
    // Capture platform info
    const environmentInfo = {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      env: process.env.NODE_ENV,
      isVercel: !!process.env.VERCEL,
      vercelRegion: process.env.VERCEL_REGION,
      tempDir: os.tmpdir(),
      cwd: process.cwd()
    };
    
    console.log('Environment Debug Info:', JSON.stringify(environmentInfo, null, 2));
    
    // Check tmp directory permission
    try {
      const testTmpFile = path.join(os.tmpdir(), `debug-check-${Date.now()}.txt`);
      fs.writeFileSync(testTmpFile, 'test');
      fs.unlinkSync(testTmpFile);
      console.log('✅ Temp directory is writable');
    } catch (e) {
      console.error('❌ Temp directory is NOT writable:', e.message);
    }
    
    // Check for Chrome/Chromium related executables
    const chromeLocations = [
      '/usr/bin/google-chrome',
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
      '/tmp/chromium',
      '/tmp/chrome',
      path.join(process.cwd(), 'node_modules/puppeteer/.local-chromium'),
      path.join(process.cwd(), 'node_modules/chrome-aws-lambda'),
      process.env.CHROME_PATH
    ];
    
    for (const location of chromeLocations) {
      if (location && fs.existsSync(location)) {
        console.log(`✅ Chrome/Chromium found at: ${location}`);
        // Try to get file stats
        try {
          const stats = fs.statSync(location);
          console.log(`   - File type: ${stats.isFile() ? 'File' : stats.isDirectory() ? 'Directory' : 'Other'}`);
          console.log(`   - Permissions: ${stats.mode.toString(8)}`);
          console.log(`   - Size: ${stats.size} bytes`);
        } catch (e) {
          console.log(`   - Error getting stats: ${e.message}`);
        }
      } else if (location) {
        console.log(`❌ No Chrome/Chromium at: ${location}`);
      }
    }
    
    // Check Puppeteer related modules
    const puppeteerLocations = [
      'puppeteer',
      'puppeteer-core',
      'chrome-aws-lambda'
    ];
    
    for (const pkg of puppeteerLocations) {
      try {
        const pkgPath = require.resolve(pkg);
        console.log(`✅ Found ${pkg} at: ${pkgPath}`);
        // Try to get the version
        try {
          const pkgJson = require(`${pkg}/package.json`);
          console.log(`   - Version: ${pkgJson.version}`);
        } catch (e) {
          console.log(`   - Error getting version: ${e.message}`);
        }
      } catch (e) {
        console.log(`❌ Could not resolve ${pkg}: ${e.message}`);
      }
    }
    
    return environmentInfo;
  } catch (error) {
    console.error('Error in debugEnvironment:', error);
    return { error: error.message };
  }
}

/**
 * Log useful information about browser configuration
 */
function logBrowserConfig(options) {
  console.log('Browser Configuration:');
  
  // Safe stringify the options to avoid circular references
  const safeOptions = { ...options };
  if (safeOptions.args && Array.isArray(safeOptions.args)) {
    safeOptions.args = [...safeOptions.args];
  }
  
  console.log(JSON.stringify(safeOptions, null, 2));
  
  // Check for important flags
  if (safeOptions.args && Array.isArray(safeOptions.args)) {
    const hasSandbox = !safeOptions.args.includes('--no-sandbox');
    const hasSetuidSandbox = !safeOptions.args.includes('--disable-setuid-sandbox');
    
    if (hasSandbox) {
      console.warn('⚠️ Warning: --no-sandbox flag is not set, which may cause issues in serverless environments');
    }
    
    if (hasSetuidSandbox) {
      console.warn('⚠️ Warning: --disable-setuid-sandbox flag is not set, which may cause issues in serverless environments');
    }
  }
  
  // Check executable path
  if (safeOptions.executablePath) {
    console.log(`Executable path: ${safeOptions.executablePath}`);
    // Check if the executable actually exists
    try {
      if (fs.existsSync(safeOptions.executablePath)) {
        console.log('✅ Executable file exists');
        // Check permissions
        try {
          const stats = fs.statSync(safeOptions.executablePath);
          const isExecutable = !!(stats.mode & 0o111);
          console.log(`${isExecutable ? '✅' : '❌'} File is ${isExecutable ? '' : 'not '}executable`);
        } catch (e) {
          console.error('Error checking executable permissions:', e.message);
        }
      } else {
        console.log('❌ Executable file does NOT exist');
      }
    } catch (e) {
      console.error('Error checking executable path:', e.message);
    }
  } else {
    console.log('No executable path specified, will use default');
  }
}

module.exports = {
  debugEnvironment,
  logBrowserConfig
}; 