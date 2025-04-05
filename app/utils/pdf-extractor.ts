/**
 * PDF Text Extraction Utilities
 * 
 * This module provides functions for extracting text from PDF files,
 * with multiple approaches and fallback strategies optimized for serverless environments.
 */

import { PDFDocumentProxy, PDFPageProxy, TextContent, TextItem } from './pdf-types';
import { ExtractionResult } from './resume-types';

// Cache for PDF.js worker - keeping a reference helps with cold starts
let pdfWorkerLoaded = false;

/**
 * Helper function to merge text content with better formatting
 * Groups items by their vertical position for better paragraph detection
 */
export function mergeTextContent(textContent: TextContent): string {
  if (!textContent.items || textContent.items.length === 0) {
    return '';
  }
  
  let lastY: number | null = null;
  let text = '';
  
  // Group items by their vertical position for better paragraph detection
  for (const item of textContent.items) {
    if (!('str' in item) || typeof item.str !== 'string') {
      continue;
    }
    
    // Extract y position from transform
    const y = item.transform ? item.transform[5] : null;
    
    // Add newline if we're on a new line (y position changed significantly)
    if (lastY !== null && y !== null && Math.abs(y - lastY) > 5) {
      text += '\n';
    } else if (item.hasEOL) {
      text += '\n';
    } else if (text.length > 0 && !text.endsWith('\n') && !text.endsWith(' ')) {
      text += ' ';
    }
    
    text += item.str;
    lastY = y;
  }
  
  return text;
}

/**
 * Load PDF.js library with proper type assertions
 */
async function loadPdfJs() {
  // Use dynamic import with any type to avoid TypeScript errors
  const pdfjs = await import('pdfjs-dist') as any;
  return pdfjs;
}

/**
 * Function to preload PDF.js worker to improve cold start performance
 * Only needs to be called once per server instance
 */
export async function preloadPdfJsWorker(): Promise<void> {
  if (pdfWorkerLoaded) {
    return; // Already loaded
  }
  
  try {
    console.log('Preloading PDF.js worker...');
    
    // Import PDF.js
    const pdfjs = await loadPdfJs();
    
    // In production (serverless), configure PDF.js to use worker-free mode
    if (process.env.NODE_ENV === 'production') {
      console.log('Configuring PDF.js for worker-free operation in production');
      
      // If GlobalWorkerOptions exists, explicitly set it to empty
      if (pdfjs.GlobalWorkerOptions) {
        // Setting to empty string forces worker-free operation
        pdfjs.GlobalWorkerOptions.workerSrc = '';
        console.log('Set GlobalWorkerOptions.workerSrc to empty string to force worker-free mode');
      }
      
      // Mark as loaded so we don't try again
      pdfWorkerLoaded = true;
      return;
    }
    
    // For development environment only, try to use worker
    console.log('Development environment - configuring PDF.js worker');
    if (pdfjs.GlobalWorkerOptions) {
      const PDFJS_CDN = "https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js";
      pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_CDN;
      console.log(`Set worker source to: ${PDFJS_CDN} (development only)`);
      
      // Mark as loaded
      pdfWorkerLoaded = true;
      console.log('PDF.js worker source configured for development');
    } else {
      console.warn('GlobalWorkerOptions not available, forcing worker-free operation');
      pdfWorkerLoaded = true; // Mark as loaded anyway
    }
  } catch (e) {
    console.error('Error preloading PDF.js worker:', e);
    // Mark as loaded to avoid repeated attempts
    pdfWorkerLoaded = true;
  }
}

/**
 * Serverless-specific PDF extraction that doesn't rely on workers
 * Optimized for environments like Vercel
 */
export async function extractTextWithoutWorker(fileData: Uint8Array): Promise<string> {
  try {
    console.log('Using worker-free PDF.js extraction for serverless environment...');
    
    // Import PDF.js
    const pdfjs = await loadPdfJs();
    
    // Get document function with proper type handling
    const getDocument = pdfjs.getDocument || (pdfjs.default && pdfjs.default.getDocument);
    
    if (!getDocument) {
      console.error('PDF.js module structure:', Object.keys(pdfjs).join(', '));
      throw new Error('getDocument function not found in PDF.js');
    }
    
    // Create a document loading task with strict serverless-compatible settings
    const loadingTask = getDocument({
      data: fileData,
      // Disable features that might rely on workers or browser APIs
      disableFontFace: true,
      useSystemFonts: false,
      useWorkerFetch: false,
      isEvalSupported: false,
      disableAutoFetch: true,
      disableStream: true,
      disableRange: true,
      // If available in this version, explicitly disable the worker
      // @ts-ignore - intentionally using non-standard options
      disableWorker: true,
      // @ts-ignore
      disableRangeRequests: true,
      // Need to explicitly disable canvas-related features that won't work in serverless
      // @ts-ignore
      canvasFactory: null,
      // @ts-ignore
      styleElement: null,
      cMapPacked: false,
      // Keep Vercel request timeout in mind
      rangeChunkSize: 65536,
    });
    
    // Using a timeout appropriate for serverless environments
    const pdfDocumentPromise = Promise.race([
      loadingTask.promise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('PDF loading timed out (serverless timeout)')), 10000)
      )
    ]);
    
    // Load the document
    const pdfDocument = await pdfDocumentPromise as PDFDocumentProxy;
    console.log(`Worker-free PDF loaded with ${pdfDocument.numPages} pages`);
    
    // Extract text with a minimalist approach
    let fullText = '';
    const maxPages = Math.min(pdfDocument.numPages, 10); // Limit pages for serverless but allow more
    
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      try {
        const page = await pdfDocument.getPage(pageNum);
        
        // Get text content with minimal options
        const textContent = await page.getTextContent();
        
        // Process text content to preserve formatting
        if (textContent && textContent.items) {
          // Use our helper for proper text formatting
          const pageText = mergeTextContent(textContent);
          fullText += pageText + '\n\n';
        }
        
        // Clean up page resources
        try {
          page.cleanup();
        } catch (cleanupError) {
          // Ignore cleanup errors
        }
      } catch (pageError) {
        console.warn(`Error extracting text from page ${pageNum} in worker-free mode:`, pageError);
      }
    }
    
    // Clean up
    try {
      pdfDocument.destroy();
    } catch (e) {
      // Ignore cleanup errors
    }
    
    // Process the text
    const cleanedText = fullText
      .replace(/\s+/g, ' ')  // Normalize whitespace
      .trim();
    
    console.log(`Worker-free extraction completed with ${cleanedText.length} characters`);
    return cleanedText;
  } catch (error) {
    console.error('Error in worker-free extraction:', error);
    throw error; // Let the caller handle this
  }
}

/**
 * Fallback text extraction using pure text processing
 * Used when PDF.js approaches fail
 */
export async function fallbackExtraction(fileData: Uint8Array): Promise<string> {
  try {
    console.log('Using fallback text-based extraction...');
    const text = new TextDecoder().decode(fileData);
    
    // Extract text content using multiple regex patterns for more robust extraction
    let extractedText = '';
    
    // Try multiple extraction approaches
    const approaches = [
      // 1. Extract text between BT (Begin Text) and ET (End Text) markers
      () => {
        console.log('Trying BT/ET extraction...');
        const textMatches = text.match(/BT[\s\S]*?ET/g);
        if (!textMatches) return '';
        
        return textMatches
          .map(block => {
            // Extract text from Tj and TJ operators
            const textContent = block
              .replace(/BT|ET/g, '') // Remove BT/ET markers
              .replace(/Tj|TJ/g, '') // Remove Tj/TJ operators
              .replace(/[\(\)]/g, '') // Remove parentheses
              .trim();
            return textContent;
          })
          .join(' ')
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim();
      },
      
      // 2. Extract from parentheses directly (common in PDF text)
      () => {
        console.log('Trying parentheses extraction...');
        const fallbackMatches = text.match(/\(([^)]+)\)/g);
        if (!fallbackMatches) return '';
        
        return fallbackMatches
          .map(match => match.slice(1, -1))
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
      },
      
      // 3. Try to find plain text words (common in some PDFs)
      () => {
        console.log('Trying word pattern extraction...');
        // Extract blocks that look like words (3+ alpha characters)
        const wordMatches = text.match(/[a-zA-Z]{3,}[a-zA-Z\s\.\,\:\;\-\']{2,}/g);
        if (!wordMatches) return '';
        
        return wordMatches
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
      },
      
      // 4. Try to extract text directly from stream objects
      () => {
        console.log('Trying stream extraction...');
        const streamMatches = text.match(/stream([\s\S]*?)endstream/g);
        if (!streamMatches) return '';
        
        return streamMatches
          .map(stream => {
            return stream
              .replace(/stream|endstream/g, '')
              .replace(/[^a-zA-Z0-9\s\.\,\:\;\-\']/g, ' ')
              .replace(/\s+/g, ' ');
          })
          .join(' ')
          .trim();
      }
    ];
    
    // Try each approach until we get enough text
    for (const approach of approaches) {
      const result = approach();
      
      if (result && result.length > 100) {
        extractedText = result;
        break;
      } else if (result) {
        // If we got some text but not enough, append it
        extractedText += ' ' + result;
      }
    }
    
    console.log(`Fallback extraction got ${extractedText.length} characters`);
    
    // Try to clean up the text
    extractedText = extractedText
      .replace(/[^\x20-\x7E\r\n]/g, ' ') // Remove non-printable chars
      .replace(/\s+/g, ' ')              // Normalize whitespace
      .trim();
    
    return extractedText;
  } catch (error) {
    console.error('Error in fallback extraction:', error);
    return "Failed to extract text from PDF. The file may be corrupt or password protected.";
  }
}

/**
 * Helper function to get PDF.js version information
 */
export async function getPdfJsVersion(): Promise<string> {
  try {
    // Use our helper to load PDF.js
    const pdfjs = await loadPdfJs();
    
    // Try multiple ways to get the version
    const version = pdfjs.version || (pdfjs.default && pdfjs.default.version);
    
    if (version) {
      return version;
    }
    
    // If version isn't directly available, log the module structure
    return `Version not directly available. Available properties: ${Object.keys(pdfjs).join(', ')}`;
  } catch (e) {
    return `Error getting version: ${e instanceof Error ? e.message : 'Unknown error'}`;
  }
}

/**
 * Main extraction function that orchestrates the PDF extraction process
 * Tries multiple methods with fallbacks
 */
export async function extractTextFromPDF(fileData: Uint8Array): Promise<ExtractionResult> {
  const warnings: string[] = [];
  
  try {
    console.log('Extracting text using PDF.js with serverless compatibility...');
    console.log(`Environment: ${process.env.NODE_ENV}`);
    
    // Ensure worker is preloaded
    await preloadPdfJsWorker();
    
    // Try worker-free approach first in all environments
    console.log('Using worker-free approach as primary extraction method');
    let fullText = '';
    try {
      fullText = await extractTextWithoutWorker(fileData);
      
      // If we got enough text, use it directly
      if (fullText && fullText.trim().length > 100) {
        console.log(`Successfully extracted ${fullText.length} characters using worker-free approach`);
        return {
          text: fullText,
          method: 'worker-free'
        };
      } else {
        console.log('Worker-free extraction returned insufficient text, trying fallback method');
        warnings.push('Worker-free extraction returned insufficient text');
        fullText = ''; // Reset to try the fallback approach
      }
    } catch (workerFreeError) {
      console.warn('Worker-free extraction failed, trying fallback method:', workerFreeError);
      warnings.push(`Worker-free extraction error: ${workerFreeError instanceof Error ? workerFreeError.message : String(workerFreeError)}`);
    }
    
    // If worker-free approach failed, try the fallback approach
    console.log('Using fallback extraction as secondary method');
    const fallbackText = await fallbackExtraction(fileData);
    
    if (fallbackText && fallbackText.trim().length > 100) {
      console.log(`Successfully extracted ${fallbackText.length} characters of text with fallback method`);
      return {
        text: fallbackText,
        method: 'fallback',
        warnings
      };
    }
    
    // If we have at least some text from worker-free, return it
    if (fullText && fullText.trim().length > 0) {
      warnings.push('Using partial results from worker-free extraction');
      return {
        text: fullText,
        method: 'worker-free',
        warnings
      };
    }
    
    // If all extraction methods failed
    throw new Error('All extraction methods failed to extract sufficient text');
    
  } catch (error) {
    console.error('Error in PDF text extraction:', error);
    warnings.push(`Fatal extraction error: ${error instanceof Error ? error.message : String(error)}`);
    
    // Return empty result with error info
    return {
      text: "Failed to extract text from PDF. The file may be corrupt or password protected.",
      method: 'fallback',
      warnings
    };
  }
} 