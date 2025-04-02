const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create deployment directory
const deployDir = path.join(__dirname, 'deployment');
if (fs.existsSync(deployDir)) {
  fs.rmSync(deployDir, { recursive: true, force: true });
}
fs.mkdirSync(deployDir, { recursive: true });

// Copy necessary files for Node.js deployment
const filesToCopy = [
  '.next',
  'public',
  'package.json',
  'server.js',
  '.htaccess',
  'next.config.js'
];

console.log('Preparing deployment package...');

filesToCopy.forEach(file => {
  const sourcePath = path.join(__dirname, file);
  const destPath = path.join(deployDir, file);
  
  if (fs.existsSync(sourcePath)) {
    if (fs.lstatSync(sourcePath).isDirectory()) {
      console.log(`Copying directory: ${file}`);
      execSync(`xcopy "${sourcePath}" "${destPath}" /E /I /H`);
    } else {
      console.log(`Copying file: ${file}`);
      fs.copyFileSync(sourcePath, destPath);
    }
  } else {
    console.log(`Warning: ${file} not found, skipping`);
  }
});

// Create a production-only package.json without dev dependencies
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  delete packageJson.devDependencies;
  packageJson.scripts = {
    start: packageJson.scripts.start
  };
  fs.writeFileSync(
    path.join(deployDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  console.log('Created production package.json');
} catch (error) {
  console.error('Error creating production package.json:', error);
}

console.log(`\nDeployment package prepared in ${deployDir}`);
console.log('Upload the contents of this directory to your GoDaddy cPanel Node.js application directory');
console.log('After uploading, install dependencies with: npm install --production');
console.log('More details in DEPLOYMENT.md'); 