# Deployment Guide: Next.js App to GoDaddy cPanel

This guide will help you deploy your Next.js application to GoDaddy's cPanel hosting.

## Prerequisites
- A GoDaddy hosting account with cPanel access
- Node.js support in your hosting plan
- SSH access to your server (recommended)

## Deployment Steps

### 1. Create a Node.js Application in cPanel

1. Log in to your GoDaddy cPanel account
2. In the cPanel dashboard, look for the "Setup Node.js App" option (usually under "Software" or "Advanced")
3. Click on "Create Application"
4. Configure the application:
   - Application mode: Production
   - Node.js version: Choose the latest version compatible with your app (14.x or higher recommended)
   - Application URL: Choose your domain or subdomain
   - Application path: Choose where to install the application (e.g., `/nodejs`)
   - Application startup file: `server.js`
   - Create the application

### 2. Upload Your Next.js Application

#### Option 1: Using File Manager
1. In cPanel, open File Manager
2. Navigate to the application directory you created
3. Upload all your project files, especially:
   - `package.json`
   - `server.js`
   - `.next` directory (from your build)
   - `public` directory
   - `node_modules` (if needed, though it's better to install them on the server)

#### Option 2: Using FTP/SFTP (Recommended)
1. Use an FTP client (like FileZilla)
2. Connect to your server using your cPanel credentials
3. Navigate to the application directory
4. Upload all project files as mentioned above

### 3. Install Dependencies and Start the Application

1. In cPanel, go back to the Node.js app setup
2. Click on your application
3. Use the provided terminal to run:
   ```
   npm install --production
   ```
4. Restart the application using the controls provided in the Node.js app interface

### 4. Configure Domain and Application URL

1. Make sure your domain or subdomain points to the correct application path
2. If you're using a specific port, you may need to configure a proxy in cPanel

### Troubleshooting

- If you encounter "Application failed to start" errors, check the error logs in the Node.js app interface
- Ensure all environment variables are set correctly in the Node.js app configuration
- Check that your server.js file is properly configured to serve your Next.js application
- For API routes to work properly, ensure your server configuration is set up to handle these requests

### Notes on Environment Variables

For your application's environment variables (.env files), you'll need to set these in the Node.js app configuration in cPanel. Do not upload your .env files directly, as they contain sensitive information.

## Alternative Method: Static Export (If Node.js Support is Limited)

If your GoDaddy hosting plan has limited Node.js support, you can try deploying as a static website:

### 1. Enable Static Export in next.config.js

1. Edit your next.config.js file
2. Uncomment the line: `// output: process.env.STATIC_EXPORT === 'true' ? 'export' : undefined,`
3. Save the file

### 2. Generate Static Export

Run the following commands locally:

```bash
# Enable static export
export STATIC_EXPORT=true

# Build the project
yarn build

# The static files will be in the 'out' directory
```

### 3. Upload to cPanel

1. In cPanel, go to File Manager
2. Navigate to your domain's public directory (usually `public_html`)
3. Upload all files from the `out` directory

### 4. Configure .htaccess (Optional)

If you need to handle client-side routing, create a `.htaccess` file in the root directory with:

```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

Note: Static export has limitations - it won't support server-side rendering, API routes, or other server features. 