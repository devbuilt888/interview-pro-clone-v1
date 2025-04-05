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
 * Improved fallback text extraction for PDFs
 * Emulates key parts of pdfjs while being serverless compatible
 */
export async function fallbackExtraction(fileData: Uint8Array): Promise<string> {
  try {
    console.log('Using enhanced fallback extraction for PDF...');
    
    // Convert buffer to string for processing
    const text = new TextDecoder().decode(fileData);
    console.log(`Decoded ${text.length} characters for processing`);
    
    // Combined results array to store all extracted text fragments
    const textFragments: string[] = [];
    
    // PHASE 1: Extract text from PDF text objects (most reliable for readable text)
    console.log('Phase 1: Extracting text from PDF text objects...');
    
    // Find text objects with Tj and TJ operators (contain actual visible text)
    const textRe = /\[(.*?)(?:Tj|TJ)\]/g;
    let textMatch;
    while ((textMatch = textRe.exec(text)) !== null) {
      if (textMatch[1]) {
        // Clean up the text content, removing PDF escape sequences
        let fragment = textMatch[1]
          .replace(/\\(\d{3}|n|r|t|b|f|\\|\(|\))/g, ' ') // Handle escape sequences
          .replace(/\(/g, '')  // Remove opening parentheses
          .replace(/\)/g, '')  // Remove closing parentheses
          .replace(/\\$/g, '') // Remove trailing backslashes
          .trim();
        
        // PDF sometimes uses hex encoding for strings
        if (fragment.match(/^<[0-9A-Fa-f\s]+>$/)) {
          // Convert hex to ASCII
          fragment = fragment
            .replace(/[<>\s]/g, '')
            .match(/.{2}/g)
            ?.map(hex => String.fromCharCode(parseInt(hex, 16)))
            .join('') || '';
        }
        
        if (fragment.length > 0) {
          textFragments.push(fragment);
        }
      }
    }
    
    // PHASE 2: Extract text from parentheses (common in PDF text objects)
    console.log('Phase 2: Extracting text from parentheses...');
    const parenthesesRe = /\(([^)\\]*(?:\\.[^)\\]*)*)\)/g;
    let parenthesesMatch;
    while ((parenthesesMatch = parenthesesRe.exec(text)) !== null) {
      if (parenthesesMatch[1]) {
        // Clean up the content, removing PDF escape sequences
        let fragment = parenthesesMatch[1]
          .replace(/\\(\d{3}|n|r|t|b|f|\\|\(|\))/g, match => {
            // Convert octal escape sequences to characters
            if (/^\d{3}$/.test(match.substring(1))) {
              return String.fromCharCode(parseInt(match.substring(1), 8));
            }
            // Handle other escape sequences
            const escapeMap: {[key: string]: string} = {
              'n': '\n', 'r': '\r', 't': '\t', 'b': '\b', 'f': '\f', '\\': '\\', '(': '(', ')': ')'
            };
            return escapeMap[match.substring(1)] || ' ';
          })
          .trim();
        
        if (fragment.length > 0 && !/^[0-9.]+$/.test(fragment)) { // Skip numeric-only fragments
          textFragments.push(fragment);
        }
      }
    }
    
    // PHASE 3: Try to find structured content blocks (useful for resumes)
    console.log('Phase 3: Extracting structured content blocks...');
    
    // Look for content blocks (resume sections often have patterns)
    const contentBlockRe = /\/T[^(]*\(([^)]+)\)[^(]*\(([^)]+)\)/g;
    let contentMatch;
    while ((contentMatch = contentBlockRe.exec(text)) !== null) {
      if (contentMatch[1] && contentMatch[2]) {
        // These often represent label + content pairs in forms/resumes
        let label = contentMatch[1].trim();
        let content = contentMatch[2].trim();
        
        if (label.length > 0 && content.length > 0) {
          textFragments.push(`${label}: ${content}`);
        }
      }
    }
    
    // PHASE 4: Extract font-encoded text (handles PDF font mappings better)
    console.log('Phase 4: Extracting font-encoded text...');
    
    // Try to parse font encodings using more sophisticated regex
    const fontTextRe = /\/F\d+\s+[0-9.]+\s+Tf\s*\n?\r?([^]*?)(?:ET|BT)/g;
    let fontMatch;
    while ((fontMatch = fontTextRe.exec(text)) !== null) {
      if (fontMatch[1]) {
        // Extract text content from font blocks, removing operators
        const fontContent = fontMatch[1]
          .replace(/\s*(?:T[cdjmrs*]|Tm|Td|Tf|ET|BT)\s*/g, ' ')
          .replace(/[\[\]']/g, '')
          .trim();
        
        if (fontContent.length > 0 && !/^[\d\s.]+$/.test(fontContent)) {
          textFragments.push(fontContent);
        }
      }
    }
    
    // PHASE 5: Look for resume-specific patterns
    console.log('Phase 5: Detecting resume-specific content...');
    
    // Resume section headers (common in most resumes)
    const resumeSectionRe = /\b(Education|Experience|Skills|Work|Employment|Qualifications|Summary|Profile|Objective|Contact|References|Projects|Certifications|Languages|Interests|Activities)\b/gi;
    let sectionMatch;
    const sectionMatches: string[] = [];
    while ((sectionMatch = resumeSectionRe.exec(text)) !== null) {
      sectionMatches.push(sectionMatch[1]);
    }
    
    if (sectionMatches.length > 0) {
      console.log(`Detected resume sections: ${sectionMatches.join(', ')}`);
      textFragments.push(`Detected Resume Sections: ${sectionMatches.join(', ')}`);
    }
    
    // Combined approaches output
    let extractedText = '';
    
    if (textFragments.length > 0) {
      // Join text fragments intelligently
      extractedText = textFragments
        .filter(Boolean)
        .filter(fragment => fragment.length > 1)  // Remove single-character fragments
        .join('\n')
        .replace(/\s+/g, ' ')    // Normalize whitespace
        .replace(/(\S)\n(\S)/g, '$1 $2') // Join broken lines
        .replace(/\n{3,}/g, '\n\n'); // Remove excessive newlines
    } else {
      // Fallback if all else fails - try the original approaches
      console.log('Using original fallback extraction approaches...');
      
      // Original approach 1: Extract text between BT and ET markers
      const btEtMatches = text.match(/BT[\s\S]*?ET/g) || [];
      const btEtText = btEtMatches
        .map(block => block
          .replace(/BT|ET/g, '')
          .replace(/Tj|TJ/g, '')
          .replace(/[\(\)]/g, '')
          .trim())
        .join(' ');
      
      // Original approach 2: Extract from parentheses
      const parenthesesMatches = text.match(/\(([^)]+)\)/g) || [];
      const parenthesesText = parenthesesMatches
        .map(match => match.slice(1, -1))
        .join(' ');
      
      // Original approach 3: Find words
      const wordMatches = text.match(/[a-zA-Z]{3,}[a-zA-Z\s\.\,\:\;\-\']{2,}/g) || [];
      const wordText = wordMatches.join(' ');
      
      // Combine all approaches
      extractedText = [btEtText, parenthesesText, wordText]
        .filter(t => t.length > 0)
        .join('\n')
        .replace(/\s+/g, ' ')
        .trim();
    }
    
    console.log(`Enhanced extraction got ${extractedText.length} characters`);
    
    // Clean up the text
    extractedText = extractedText
      .replace(/[^\x20-\x7E\r\n]/g, ' ') // Remove non-printable chars
      .replace(/\s+/g, ' ')              // Normalize whitespace
      .replace(/(\D)(\d{3})(\d{3})(\d{4})/g, '$1$2-$3-$4') // Format phone numbers
      .replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi, '\nEmail: $1\n') // Highlight emails
      .trim();
    
    // Detect and format common resume patterns
    extractedText = formatResumeText(extractedText);
    
    return extractedText;
  } catch (error) {
    console.error('Error in enhanced fallback extraction:', error);
    return "Failed to extract text from PDF. The file may be corrupt or password protected.";
  }
}

/**
 * Format extracted text to better resemble resume structure
 */
function formatResumeText(text: string): string {
  // Look for common resume patterns and format accordingly
  
  // Format section headers
  const sectionHeaders = [
    'Education', 'Experience', 'Work Experience', 'Skills', 
    'Professional Experience', 'Employment', 'Qualifications',
    'Summary', 'Profile', 'Objective', 'Contact', 'References', 
    'Projects', 'Certifications', 'Languages', 'Interests'
  ];
  
  let formatted = text;
  
  // Format section headers
  sectionHeaders.forEach(header => {
    const headerRegex = new RegExp(`\\b${header}\\b`, 'gi');
    formatted = formatted.replace(headerRegex, `\n\n${header.toUpperCase()}:`);
  });
  
  // Format dates (common in resumes)
  formatted = formatted.replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}\s*(-|–|to)\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}\b/gi, '\n$&\n');
  formatted = formatted.replace(/\b\d{4}\s*(-|–|to)\s*\d{4}\b/g, '\n$&\n');
  formatted = formatted.replace(/\b\d{4}\s*(-|–|to)\s*(Present|Current)\b/gi, '\n$&\n');
  
  // Format job titles/education degrees (often in title case)
  formatted = formatted.replace(/\b([A-Z][a-z]+\s+)+(?:Engineer|Developer|Manager|Director|Specialist|Analyst|Consultant|Coordinator|Designer|Architect)\b/g, '\n$&\n');
  formatted = formatted.replace(/\b(?:Bachelor|Master|PhD|Doctor|Associate)[\s\w]+(?:Science|Arts|Engineering|Business|Administration|Technology)\b/g, '\n$&\n');
  
  // Format companies/schools (often appear with locations)
  formatted = formatted.replace(/\n([A-Z][a-zA-Z\s&,]+)\s*,\s*([A-Za-z\s]+,\s*[A-Z]{2})/g, '\n$1 - $2\n');
  
  // Format bullet points (common in resume descriptions)
  formatted = formatted.replace(/([.•·])\s*([A-Z])/g, '$1\n• $2');
  
  // Clean up potential duplicate newlines
  formatted = formatted.replace(/\n{3,}/g, '\n\n');
  
  return formatted;
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