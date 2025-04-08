/**
 * This script ensures that the @sparticuz/chromium-min package is properly installed
 * It's run automatically in the postinstall hook
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  console.log('Setting up Chromium for serverless environments...');
  
  // Check if the @sparticuz/chromium-min is already installed
  const modulePath = path.join(process.cwd(), 'node_modules', '@sparticuz', 'chromium-min');
  
  if (fs.existsSync(modulePath)) {
    console.log('@sparticuz/chromium-min is installed');
    
    // Run the installation script if it exists
    const installScript = path.join(modulePath, 'install.js');
    
    if (fs.existsSync(installScript)) {
      console.log('Running Chromium installation script...');
      try {
        require(installScript);
        console.log('Chromium installation script completed successfully');
      } catch (error) {
        console.error('Failed to run Chromium installation script:', error);
      }
    }
  } else {
    console.log('@sparticuz/chromium-min is not installed, attempting to install...');
    try {
      execSync('npm install @sparticuz/chromium-min', { stdio: 'inherit' });
      console.log('@sparticuz/chromium-min installed successfully');
    } catch (error) {
      console.error('Failed to install @sparticuz/chromium-min:', error);
    }
  }
  
  console.log('Chromium setup completed');
} catch (error) {
  console.error('Error during Chromium setup:', error);
} 