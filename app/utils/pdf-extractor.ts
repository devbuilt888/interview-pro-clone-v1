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
  try {
    // In production, need to prevent automatic worker loading before import
    if (process.env.NODE_ENV === 'production') {
      // Create a global mock for the worker
      if (typeof global !== 'undefined') {
        // @ts-ignore - intentionally creating a global mock
        global.PDFWorker = {
          _setupFakeWorker: () => Promise.resolve()
        };
      }
    }
    
    // Use dynamic import with any type to avoid TypeScript errors
    const pdfjs = await import('pdfjs-dist') as any;
    return pdfjs;
  } catch (error) {
    console.error('Error loading PDF.js:', error);
    throw error;
  }
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
    console.log('PDF.js worker configuration...');
    
    // In production, skip the worker entirely
    if (process.env.NODE_ENV === 'production') {
      console.log('Production environment - skipping worker setup entirely');
      pdfWorkerLoaded = true;
      return;
    }
    
    // In development, try to configure worker
    console.log('Development environment - attempting to configure PDF.js worker');
    
    // Import PDF.js - only in development
    const pdfjs = await loadPdfJs();
    
    if (pdfjs.GlobalWorkerOptions) {
      // For development, use CDN
      const PDFJS_CDN = "https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js";
      pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_CDN;
      console.log(`Set worker source to: ${PDFJS_CDN} (development only)`);
    } else {
      console.warn('GlobalWorkerOptions not available - worker functionality will be limited');
    }
    
    // Mark as loaded to avoid repeated attempts
    pdfWorkerLoaded = true;
  } catch (e) {
    console.error('Error configuring PDF.js worker:', e);
    // Still mark as loaded to avoid retrying
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
    
    // For serverless environments, we need to intercept potential worker loading
    // Use fallback extraction as a reliable method if we're in production
    if (process.env.NODE_ENV === 'production') {
      try {
        console.log('Production environment detected, using direct PDF processing');
        return await fallbackExtraction(fileData);
      } catch (fallbackError) {
        console.error('Fallback extraction failed in production:', fallbackError);
        throw fallbackError;
      }
    }
    
    // For development, try the worker-free approach
    console.log('Development environment, attempting worker-free PDF.js extraction');
    
    // Import PDF.js - this won't be reached in production
    const pdfjs = await loadPdfJs();
    
    // Get document function
    const getDocument = pdfjs.getDocument || (pdfjs.default && pdfjs.default.getDocument);
    
    if (!getDocument) {
      throw new Error('getDocument function not found in PDF.js');
    }
    
    // Create document loading task with worker disabled
    const loadingTask = getDocument({
      data: fileData,
      disableFontFace: true,
      useSystemFonts: false,
      useWorkerFetch: false,
      isEvalSupported: false,
      disableAutoFetch: true,
      disableStream: true,
      disableRange: true,
      // @ts-ignore
      disableWorker: true,
      // @ts-ignore
      disableRangeRequests: true,
      // @ts-ignore
      canvasFactory: null,
      // @ts-ignore
      styleElement: null,
      cMapPacked: false,
      rangeChunkSize: 65536,
    });
    
    // Process document with timeout
    const pdfDocument = await Promise.race([
      loadingTask.promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('PDF loading timed out')), 10000))
    ]) as PDFDocumentProxy;
    
    // Rest of processing code...
    let fullText = '';
    const maxPages = Math.min(pdfDocument.numPages, 10);
    
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      try {
        const page = await pdfDocument.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        if (textContent && textContent.items) {
          const pageText = mergeTextContent(textContent);
          fullText += pageText + '\n\n';
        }
        
        try { page.cleanup(); } catch (e) { /* ignore */ }
      } catch (pageError) {
        console.warn(`Error processing page ${pageNum}:`, pageError);
      }
    }
    
    try { pdfDocument.destroy(); } catch (e) { /* ignore */ }
    
    const cleanedText = fullText.replace(/\s+/g, ' ').trim();
    return cleanedText;
  } catch (error) {
    console.error('Error in worker-free extraction:', error);
    // In case of any error, use the fallback method
    console.log('Worker-free extraction failed, falling back to direct extraction');
    return await fallbackExtraction(fileData);
  }
}

/**
 * Helper function to check if we're running in a serverless environment
 */
function isServerless(): boolean {
  // Check for Vercel serverless environment 
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return true;
  }
  
  // Check for typical serverless paths
  if (typeof process !== 'undefined' && process.cwd) {
    const cwd = process.cwd();
    if (cwd.includes('/var/task') || cwd.includes('/.netlify/functions/')) {
      return true;
    }
  }
  
  // Default to checking NODE_ENV as fallback
  return process.env.NODE_ENV === 'production';
}

/**
 * Fallback text extraction using pure text processing
 * Used when PDF.js approaches fail
 */
export async function fallbackExtraction(fileData: Uint8Array): Promise<string> {
  try {
    console.log('Using fallback text-based extraction...');
    
    // Convert buffer to string for processing
    const text = new TextDecoder().decode(fileData);
    
    console.log(`Decoded ${text.length} characters for fallback extraction`);
    
    // Extract text content using multiple regex patterns for more robust extraction
    let extractedText = '';
    
    // Try each approach
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
    // In serverless environments, don't even try to load PDF.js version
    if (isServerless()) {
      return "2.16.105 (Serverless Mode)";
    }
    
    // Only try to load PDF.js in development
    const pdfjs = await loadPdfJs();
    
    // Try multiple ways to get the version
    const version = pdfjs.version || (pdfjs.default && pdfjs.default.version);
    
    if (version) {
      return version;
    }
    
    return `Version not directly available`;
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
    
    // Ensure worker is preloaded (in development only - production skips)
    await preloadPdfJsWorker();
    
    // Try extraction - worker-free will auto-use fallback in production
    console.log('Starting PDF text extraction...');
    let extractedText = '';
    let method: 'worker-free' | 'fallback' = 'worker-free'; 
    
    try {
      extractedText = await extractTextWithoutWorker(fileData);
      
      // In production, the worker-free function actually returns fallback extraction results
      if (process.env.NODE_ENV === 'production') {
        method = 'fallback'; 
        console.log('Using fallback method in production environment');
      } else {
        console.log('Using worker-free method in development environment');
      }
      
      console.log(`Successfully extracted ${extractedText.length} characters`);
    } catch (error) {
      console.error('Error in primary extraction method:', error);
      warnings.push(`Extraction error: ${error instanceof Error ? error.message : String(error)}`);
      
      // If we failed completely, try the fallback as last resort
      console.log('Trying fallback extraction as last resort');
      extractedText = await fallbackExtraction(fileData);
      method = 'fallback';
    }
    
    // Validate we got enough text
    if (!extractedText || extractedText.trim().length < 50) {
      console.warn('Extraction returned insufficient text');
      warnings.push('Extraction returned insufficient text');
      
      // If both methods failed to get enough text, throw error
      if (extractedText.trim().length === 0) {
        throw new Error('Failed to extract any usable text from PDF');
      }
    }
    
    // Return the results
    return {
      text: extractedText,
      method,
      warnings: warnings.length > 0 ? warnings : undefined
    };
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