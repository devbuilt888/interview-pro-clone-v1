# Testing PDF.js Extraction on Vercel

This document provides instructions for testing the PDF.js extraction functionality specifically on Vercel's serverless environment.

## Deployment Instructions

1. **Deploy to Vercel**:
   - Push the latest code to GitHub
   - Connect to Vercel and deploy from the GitHub repository
   - Alternatively, use the Vercel CLI: `vercel --prod`

2. **Verify Environment Variables**:
   - Make sure your Vercel project has the necessary environment variables set
   - API keys (if needed) should be configured in the Vercel dashboard

## Testing the PDF Extraction

1. **Access the Test Page**:
   - Once deployed, navigate to `/test-pdf-extraction` on your Vercel domain
   - For example: `https://your-project.vercel.app/test-pdf-extraction`

2. **Upload a PDF**:
   - Use the file upload form to select a PDF resume
   - Click "Test PDF Extraction" to start the test

3. **Review the Results**:
   - The page will display diagnostic information for both extraction methods:
     - Worker-free extraction (optimized for serverless)
     - Worker-based extraction (standard method)
   - Check which method succeeded and the amount of text extracted
   - Review any error messages

## Interpreting the Results

### Successful Testing

If the worker-free extraction succeeds, your application should work correctly in a serverless environment without modifications. The test results will show:

- ✅ **Worker-Free Extraction**:
  - Status: Success
  - Text sample visible
  - Reasonable text length (>100 characters)

- Worker-Based Extraction:
  - May succeed or fail depending on the environment
  - Less important for serverless compatibility

### Common Issues

1. **404 Errors for Worker Files**:
   - If the worker-based extraction fails with 404 errors, but worker-free extraction succeeds, your application is still compatible with serverless environments
   - The worker-free approach is specifically designed to avoid these 404 errors

2. **Memory or Timeout Errors**:
   - If both methods fail with memory or timeout errors, your PDF might be too large or complex
   - Try a smaller or simpler PDF file

3. **No Text Extracted**:
   - If extraction succeeds but no text is found, the PDF might be:
     - An image-only PDF
     - Password protected
     - Using non-standard font encoding

## Next Steps

Based on the test results:

1. **If Worker-Free Extraction Works**:
   - Your application is ready for serverless environments
   - Make sure the main application is using this extraction method

2. **If Both Methods Fail**:
   - Check PDF.js version compatibility
   - Verify webpack configuration in `next.config.js`
   - Consider adding the fallback regex-based extraction methods

3. **For Production Use**:
   - Implement proper error handling and user feedback
   - Add retry mechanisms for failed extractions
   - Consider pre-processing PDFs to optimize extraction

## Service Worker Registration

PDF.js worker files can be cached using a service worker for improved performance:

1. **Automatic Registration**:
   - The service worker (`public/sw.js`) is automatically registered by Next.js
   - It handles caching of PDF.js workers from multiple CDNs

2. **Manual Testing**:
   - Check browser developer tools → Application → Service Workers
   - Verify the service worker is active
   - Check the Cache Storage for cached PDF.js files 