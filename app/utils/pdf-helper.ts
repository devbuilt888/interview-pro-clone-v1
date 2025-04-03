/**
 * PDF.js Helper for Serverless Environments
 * This module provides utilities to initialize and work with PDF.js
 * in both client and server contexts, with special handling for serverless.
 */

// Track if we've already set up the worker
let isWorkerInitialized = false;

/**
 * Initialize PDF.js with proper worker configuration
 * This should be called before any PDF.js operations
 */
export async function initPdfJs() {
  // Skip if already initialized
  if (isWorkerInitialized) {
    return;
  }

  try {
    console.log('Initializing PDF.js...');
    
    // Import the PDF.js library
    // We use the legacy build which is more compatible with Next.js and serverless
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.js');
    
    // Determine if we're running in a browser or serverless environment
    const isBrowser = typeof window !== 'undefined';
    
    if (isBrowser) {
      console.log('Browser environment detected, configuring PDF.js worker...');
      
      // Define multiple CDN sources for the worker as fallbacks
      const workerSources = [
        'https://unpkg.com/pdfjs-dist@4.0.379/legacy/build/pdf.worker.js',
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/legacy/build/pdf.worker.js',
        'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379/legacy/build/pdf.worker.js'
      ];
      
      // Check if the worker is available from any source
      const checkWorkerAvailability = async (url: string): Promise<boolean> => {
        try {
          const response = await fetch(url, { method: 'HEAD' });
          return response.ok;
        } catch (e) {
          return false;
        }
      };
      
      // Try each worker source until one works
      for (const workerSrc of workerSources) {
        if (await checkWorkerAvailability(workerSrc)) {
          pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
          console.log(`PDF.js worker configured from: ${workerSrc}`);
          isWorkerInitialized = true;
          break;
        }
      }
      
      // If no worker could be loaded, use a fallback approach
      if (!isWorkerInitialized) {
        console.warn('Could not load PDF.js worker from CDN, using fallback configuration');
        // This configuration will disable worker but still allow most features
        pdfjs.GlobalWorkerOptions.workerSrc = '';
        // @ts-ignore - custom property
        pdfjs.disableWorker = true;
        isWorkerInitialized = true;
      }
    } else {
      console.log('Server/serverless environment detected, configuring PDF.js for workerless operation');
      // In serverless, we don't use workers
      // @ts-ignore - custom property
      pdfjs.disableWorker = true;
      isWorkerInitialized = true;
    }
    
    return pdfjs;
  } catch (error) {
    console.error('Error initializing PDF.js:', error);
    throw error;
  }
}

/**
 * Get PDF.js configuration for serverless environments
 * This provides settings optimized for worker-free operation
 */
export function getServerlessConfig() {
  return {
    disableFontFace: true,
    useSystemFonts: false,
    useWorkerFetch: false,
    isEvalSupported: false,
    disableWorker: true,
    disableRangeRequests: true,
    disableAutoFetch: true,
    disableStream: true,
    cMapPacked: false,
  };
}

/**
 * Get PDF version information
 */
export async function getPdfJsVersion(): Promise<string> {
  try {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.js');
    return pdfjs.version || 'Version not available';
  } catch (e) {
    return `Error getting version: ${e instanceof Error ? e.message : 'Unknown error'}`;
  }
} 