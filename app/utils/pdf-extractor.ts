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
 * Special handler for extracting text from Apache FOP generated PDFs 
 * (which are often used by LinkedIn resume exports)
 */
function extractApacheFopContent(pdfText: string): string {
  console.log('Using specialized Apache FOP extractor for LinkedIn resumes');
  
  // Output text fragments
  const textFragments: string[] = [];
  
  // Extract name (often found in specific patterns)
  const namePattern = /\/(Title|Name)\s*\(\s*([A-Za-z][A-Za-z\s\.\-,']+)\s*\)/;
  const nameMatch = pdfText.match(namePattern);
  if (nameMatch && nameMatch[2] && nameMatch[2].length > 3) {
    textFragments.push(nameMatch[2].trim());
  }
  
  // Extract section headers (Education, Experience, etc.)
  const sectionPattern = /\/(T|Tag|Topic)\s*\(\s*(Summary|Experience|Education|Skills|Languages|Interests|Projects|Certifications|Volunteer|Awards|Publications)\s*\)/gi;
  const sections: string[] = [];
  let sectionMatch;
  while ((sectionMatch = sectionPattern.exec(pdfText)) !== null) {
    if (sectionMatch[2]) {
      const sectionName = sectionMatch[2].trim();
      sections.push(sectionName);
      textFragments.push(`\n\n${sectionName.toUpperCase()}:\n`);
    }
  }
  
  // Extract text content using more reliable patterns
  
  // 1. Look for readable text in TJ operations (common in Apache FOP)
  const tjPattern = /\/(F\d+)\s+[0-9.]+\s+Tf\s*\[(([^[\]]*?))\]\s*TJ/g;
  let tjMatch;
  while ((tjMatch = tjPattern.exec(pdfText)) !== null) {
    if (tjMatch[2]) {
      // Clean the text content
      let content = tjMatch[2]
        .replace(/\(|\)/g, '') // Remove parentheses
        .replace(/'/g, '') // Remove quotes
        .replace(/\\(\d{3})/g, (_, octal) => String.fromCharCode(parseInt(octal, 8))) // Convert octal escapes
        .replace(/-?\d+(\.\d+)?/g, ' ') // Remove positioning numbers
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
      
      // Only keep if it looks like actual text
      if (content.length > 2 && /[A-Za-z]/.test(content) && !/^[^a-zA-Z]+$/.test(content)) {
        textFragments.push(content);
      }
    }
  }
  
  // 2. Get text from stream blocks
  const streamPattern = /stream\s+([\s\S]*?)\s+endstream/g;
  let streamMatch;
  while ((streamMatch = streamPattern.exec(pdfText)) !== null) {
    if (streamMatch[1]) {
      // Extract only readable text from streams
      const readableText = streamMatch[1].replace(/[^\x20-\x7E\r\n]/g, ' ');
      
      // Find words and phrases in the stream
      const wordPattern = /[A-Za-z][A-Za-z .,;:!?'\-]{4,}/g;
      const words = readableText.match(wordPattern);
      
      if (words && words.length > 0) {
        textFragments.push(words.join(' '));
      }
    }
  }
  
  // 3. Extract content from LinkedIn-specific text blocks
  const linkedinTextPattern = /BT\s+\/[A-Za-z0-9]+\s+[0-9.]+\s+Tf\s+[0-9.\-]+\s+[0-9.\-]+\s+Td\s+\(\s*([^)]+)\s*\)\s+Tj\s+ET/g;
  let linkedinMatch;
  while ((linkedinMatch = linkedinTextPattern.exec(pdfText)) !== null) {
    if (linkedinMatch[1]) {
      const content = linkedinMatch[1].trim();
      if (content.length > 2 && /[A-Za-z]/.test(content)) {
        textFragments.push(content);
      }
    }
  }
  
  // Filter out redundant entries or gibberish
  const filteredText = textFragments
    .filter(fragment => {
      // Must have letters to be valid text
      const letters = (fragment.match(/[A-Za-z]/g) || []).length;
      const total = fragment.length;
      
      // Keep fragments with a good ratio of letters to total characters
      return letters > 2 && letters / total > 0.3;
    })
    .join('\n')
    .replace(/\s+/g, ' ')
    .replace(/(\S)\n(\S)/g, '$1 $2')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  
  console.log(`Apache FOP extraction found ${filteredText.length} characters`);
  return filteredText;
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
    
    // Check if this is a LinkedIn resume with Apache FOP
    const isLinkedIn = text.includes('urn:li:memberResume:');
    const isApacheFOP = text.includes('Apache FOP Version');
    
    if (isLinkedIn || isApacheFOP) {
      console.log('LinkedIn/Apache FOP PDF detected, using specialized extraction');
      return extractStructuredContent(text);
    }
    
    // For other PDF types, use the general extraction approach
    return extractGenericPDFContent(text);
    
  } catch (error) {
    console.error('Error in enhanced fallback extraction:', error);
    return "Failed to extract text from PDF. The file may be corrupt or password protected.";
  }
}

/**
 * Extract text from structured content (LinkedIn/Adobe FOP)
 */
function extractStructuredContent(pdfText: string): string {
  // Output text fragments
  const textFragments: string[] = [];
  
  // Extract name (common in resumes)
  const namePattern = /\/([A-Za-z]+)\s*\(\s*([A-Za-z][A-Za-z\s\.\-,']{3,})\s*\)/;
  const nameMatch = pdfText.match(namePattern);
  if (nameMatch && nameMatch[2] && nameMatch[2].length > 3) {
    textFragments.push(nameMatch[2].trim());
  }
  
  // Process section headers (Education, Experience, etc.)
  const sectionHeaders = ["Experience", "Education", "Skills", "Summary", "Work", 
    "Volunteer", "Projects", "Certificates", "Awards", "Languages", "Interests"];
  
  const sectionPattern = new RegExp(`\\/(T|Tx|Title|Heading)\\s*\\(\\s*(${sectionHeaders.join('|')})\\s*\\)`, 'gi');
  let sectionMatch;
  
  while ((sectionMatch = sectionPattern.exec(pdfText)) !== null) {
    if (sectionMatch[2]) {
      const sectionName = sectionMatch[2].trim();
      textFragments.push(`\n\n${sectionName.toUpperCase()}:\n`);
    }
  }
  
  // Extract actual text content from PDF operators
  
  // Extract from text operators (common in PDFs)
  extractFromTextOperators(pdfText, textFragments);
  
  // Extract from TJ operations (common in Apache FOP)
  extractFromTJOperations(pdfText, textFragments);
  
  // Extract from streams (when other methods fail)
  extractFromStreams(pdfText, textFragments);
  
  // Filter and process the text
  return processTextFragments(textFragments);
}

/**
 * Extract text from text operators (Tj)
 */
function extractFromTextOperators(text: string, fragments: string[]): void {
  const tjPattern = /\(([^)\\]*(?:\\.[^)\\]*)*)\)\s*(?:Tj|TJ)/g;
  let match;
  
  while ((match = tjPattern.exec(text)) !== null) {
    if (match[1] && match[1].length > 0) {
      // Clean the text content
      const content = cleanPDFString(match[1]);
      
      // Only add meaningful text
      if (content.length > 2 && hasActualText(content)) {
        fragments.push(content);
      }
    }
  }
}

/**
 * Extract text from TJ operations (array-based text)
 */
function extractFromTJOperations(text: string, fragments: string[]): void {
  // Look for text arrays with TJ operator
  const tjArrayPattern = /\[((?:[^[\]]*?))\]\s*TJ/g;
  let match;
  
  while ((match = tjArrayPattern.exec(text)) !== null) {
    if (match[1]) {
      // Extract text parts (skip numbers which are spacing adjustments)
      const textParts: string[] = [];
      
      // Match all text strings in parentheses
      const partPattern = /\(([^)]+)\)/g;
      let partMatch;
      
      while ((partMatch = partPattern.exec(match[1])) !== null) {
        if (partMatch[1]) {
          textParts.push(cleanPDFString(partMatch[1]));
        }
      }
      
      // Join parts with spaces and add to fragments
      const content = textParts.join(' ').trim();
      if (content.length > 2 && hasActualText(content)) {
        fragments.push(content);
      }
    }
  }
}

/**
 * Extract text from stream blocks
 */
function extractFromStreams(text: string, fragments: string[]): void {
  const streamPattern = /stream\s+([\s\S]*?)\s+endstream/g;
  let match;
  
  while ((match = streamPattern.exec(text)) !== null) {
    if (match[1] && match[1].length > 10) {
      // Get readable text only
      const cleanText = match[1].replace(/[^\x20-\x7E\r\n]/g, ' ').trim();
      
      // Find word patterns
      const wordPattern = /[A-Za-z][a-zA-Z]{2,}[a-zA-Z\s.,;:?!-]{2,}/g;
      const words = cleanText.match(wordPattern);
      
      if (words && words.length > 3) {
        fragments.push(words.join(' '));
      }
    }
  }
}

/**
 * Clean a PDF string (handle escapes, etc.)
 */
function cleanPDFString(str: string): string {
  return str
    // Handle octal escapes
    .replace(/\\(\d{3})/g, (_, octal) => 
      String.fromCharCode(parseInt(octal, 8)))
    // Handle standard escapes  
    .replace(/\\([nrtbf\\()])/g, (_, escape) => {
      const escapeMap: {[key: string]: string} = {
        'n': '\n', 'r': '\r', 't': '\t', 
        'b': '\b', 'f': '\f', '\\': '\\',
        '(': '(', ')': ')'
      };
      return escapeMap[escape] || ' ';
    })
    // Handle positional numbers
    .replace(/-?\d+(\.\d+)?/g, ' ')
    // Normalize spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Process text fragments into a cohesive document
 */
function processTextFragments(fragments: string[]): string {
  if (fragments.length === 0) {
    return '';
  }

  // Filter out gibberish/binary fragments
  const filteredFragments = fragments.filter(fragment => {
    // Skip very short fragments
    if (fragment.length < 2) return false;
    
    // Count letters and characters
    const letters = (fragment.match(/[A-Za-z]/g) || []).length;
    const total = fragment.length;
    
    // Keep if good letter ratio
    return letters > 2 && letters / total > 0.3;
  });
  
  // Join fragments
  let text = filteredFragments.join('\n');
  
  // Clean up text
  text = text
    // Remove metadata
    .replace(/Apache FOP Version \d+\.\d+/g, '')
    .replace(/urn:li:memberResume:\d+/g, '')
    .replace(/D:\d{14}Z/g, '')
    // Clean up formatting
    .replace(/\s+/g, ' ')
    .replace(/(\S)\n(\S)/g, '$1 $2')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  
  // Format it as a resume
  return formatResumeText(text);
}

/**
 * Extract text from generic PDFs (not LinkedIn/Apache FOP)
 */
function extractGenericPDFContent(text: string): string {
  // Output fragments
  const fragments: string[] = [];
  
  // Extract from text operators
  extractFromTextOperators(text, fragments);
  
  // Extract text from parentheses
  const parensPattern = /\(([^)]+)\)/g;
  let match;
  
  while ((match = parensPattern.exec(text)) !== null) {
    if (match[1] && match[1].length > 2) {
      const content = cleanPDFString(match[1]);
      if (hasActualText(content)) {
        fragments.push(content);
      }
    }
  }
  
  // Extract from streams
  extractFromStreams(text, fragments);
  
  // As last resort, just get any words
  if (fragments.length === 0) {
    const wordMatches = text.match(/[a-zA-Z]{3,}[a-zA-Z\s\.\,\:\;\-\']{2,}/g) || [];
    if (wordMatches.length > 0) {
      fragments.push(wordMatches.join(' '));
    }
  }
  
  // Process the text
  return processTextFragments(fragments);
}

/**
 * Check if a string contains actual text (vs binary/gibberish)
 */
function hasActualText(str: string): boolean {
  if (!str || str.length < 2) return false;
  
  // Count letters
  const letters = (str.match(/[A-Za-z]/g) || []).length;
  
  // Need reasonable letter count
  return letters > 2 && /[A-Za-z]/.test(str);
}

/**
 * Clean up extracted text to remove gibberish and improve structure
 */
function cleanupExtractedText(text: string): string {
  if (!text) return '';
  
  return text
    // Remove non-printable and control characters
    .replace(/[^\x20-\x7E\r\n]/g, ' ')
    
    // Handle common PDF artifacts
    .replace(/[`~@#$%^&*_=+|<>{}[\]]/g, ' ')
    
    // Remove isolated special characters
    .replace(/(\s)[.,;:!?]+(\s)/g, '$1$2')
    
    // Format email addresses
    .replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi, '\nEmail: $1\n')
    
    // Format phone numbers
    .replace(/(\D)(\d{3})(\d{3})(\d{4})/g, '$1$2-$3-$4')
    
    // Format URLs
    .replace(/(https?:\/\/[a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=%-]+)/gi, '\nWebsite: $1\n')
    
    // Remove consecutive spaces
    .replace(/\s+/g, ' ')
    
    // Clean up line breaks
    .replace(/\n{3,}/g, '\n\n')
    
    .trim();
}

/**
 * Format extracted text to better resemble resume structure
 */
function formatResumeText(text: string): string {
  if (!text) return '';
  
  // Format section headers with more comprehensive matching
  const sectionHeaderMap: {[key: string]: string} = {
    // Education section variations
    'education': 'EDUCATION',
    'academic background': 'EDUCATION',
    'educational background': 'EDUCATION',
    'academic history': 'EDUCATION',
    'degrees': 'EDUCATION',
    'schools': 'EDUCATION',
    'universities': 'EDUCATION',
    'academics': 'EDUCATION',
    
    // Experience section variations
    'experience': 'EXPERIENCE',
    'work experience': 'WORK EXPERIENCE',
    'employment': 'EMPLOYMENT HISTORY',
    'employment history': 'EMPLOYMENT HISTORY',
    'professional experience': 'PROFESSIONAL EXPERIENCE',
    'work history': 'WORK HISTORY',
    'career history': 'CAREER HISTORY',
    'positions': 'POSITIONS HELD',
    'jobs': 'EMPLOYMENT HISTORY',
    
    // Skills section variations
    'skills': 'SKILLS',
    'expertise': 'EXPERTISE',
    'technical skills': 'TECHNICAL SKILLS',
    'core competencies': 'CORE COMPETENCIES',
    'proficiencies': 'PROFICIENCIES',
    'key skills': 'KEY SKILLS',
    'abilities': 'ABILITIES',
    'qualifications': 'QUALIFICATIONS',
    
    // Summary section variations
    'summary': 'SUMMARY',
    'professional summary': 'PROFESSIONAL SUMMARY',
    'executive summary': 'EXECUTIVE SUMMARY',
    'profile': 'PROFILE',
    'professional profile': 'PROFESSIONAL PROFILE',
    'career objective': 'CAREER OBJECTIVE',
    'objective': 'OBJECTIVE',
    'about': 'ABOUT',
    
    // Other common sections
    'contact': 'CONTACT INFORMATION',
    'contact information': 'CONTACT INFORMATION',
    'personal information': 'PERSONAL INFORMATION',
    'personal details': 'PERSONAL DETAILS',
    'publications': 'PUBLICATIONS',
    'certifications': 'CERTIFICATIONS',
    'certificates': 'CERTIFICATIONS',
    'honors': 'HONORS & AWARDS',
    'awards': 'HONORS & AWARDS',
    'projects': 'PROJECTS',
    'languages': 'LANGUAGES',
    'interests': 'INTERESTS',
    'hobbies': 'HOBBIES & INTERESTS',
    'activities': 'ACTIVITIES',
    'volunteer': 'VOLUNTEER EXPERIENCE',
    'volunteer experience': 'VOLUNTEER EXPERIENCE',
    'references': 'REFERENCES',
    'courses': 'COURSES',
    'training': 'TRAINING'
  };
  
  let formatted = text;
  
  // Format section headers
  Object.entries(sectionHeaderMap).forEach(([key, value]) => {
    const pattern = new RegExp(`(?:^|\\n|\\b)${key}(?:\\s*:|\\s*$|\\b)`, 'gi');
    formatted = formatted.replace(pattern, `\n\n${value}:\n`);
  });
  
  // Detect and format personal information with improved patterns
  
  // Name detection - look for prominent name formats at beginning of resume
  const namePatterns = [
    /^([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)(?:\s|$)/,  // First Last format
    /^([A-Z]{2,}\s+[A-Z]{2,}(?:\s+[A-Z]{2,})?)(?:\s|$)/,        // FIRST LAST format
  ];
  
  for (const pattern of namePatterns) {
    const match = formatted.match(pattern);
    if (match && match[1] && match[1].length > 4) {
      const name = match[1].trim();
      formatted = formatted.replace(match[0], `${name}\n\n`);
      break;
    }
  }
  
  // Contact information - make prominent
  const contactPatterns = [
    // Email - make prominent
    {
      regex: /(?:\b|\s)([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})(?:\b|\s)/g,
      format: '\nEmail: $1\n'
    },
    // Phone - recognize various formats
    {
      regex: /(?:\b|\s)((?:\+\d{1,3}[-\s]?)?(?:\(?\d{3}\)?[-\s.]?\d{3}[-\s.]?\d{4}))(?:\b|\s)/g,
      format: '\nPhone: $1\n'
    },
    // LinkedIn - extract username
    {
      regex: /(?:\b|\s)((?:linkedin\.com\/in\/|linkedin:)([A-Za-z0-9_-]+))(?:\b|\s)/g,
      format: '\nLinkedIn: $1\n'
    },
    // Website/portfolio
    {
      regex: /(?:\b|\s)((?:https?:\/\/)?(?:www\.)?[A-Za-z0-9][-A-Za-z0-9.]*\.[A-Za-z]{2,}(?:\/[-A-Za-z0-9+&@#/%=~_|]*)?)(?:\b|\s)/g,
      format: '\nWebsite: $1\n'
    },
    // Location/address
    {
      regex: /(?:\b|\s)([A-Za-z ]+,\s*[A-Z]{2}(?:\s+\d{5})?)(?:\b|\s)/g,
      format: '\nLocation: $1\n'
    }
  ];
  
  // Apply contact patterns
  contactPatterns.forEach(({ regex, format }) => {
    formatted = formatted.replace(regex, format);
  });
  
  // Format dates (common in resumes) with improved patterns
  const datePatterns = [
    // Month Year - Month Year format
    {
      regex: /\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t)?(?:ember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)[.\s]+(\d{4})\s*([-–—]|to)\s*(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t)?(?:ember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)[.\s]+(\d{4})\b/gi,
      format: '\n$1 $2 $3 $4 $5\n'
    },
    // Year - Year format
    {
      regex: /\b(\d{4})\s*([-–—]|to)\s*(\d{4}|\bPresent\b|\bCurrent\b)\b/gi,
      format: '\n$1 $2 $3\n'
    },
    // Year - Present format
    {
      regex: /\b(\d{4})\s*([-–—]|to)\s*(Present|Current|Now)\b/gi,
      format: '\n$1 $2 $3\n'
    }
  ];
  
  // Apply date patterns
  datePatterns.forEach(({ regex, format }) => {
    formatted = formatted.replace(regex, format);
  });
  
  // Detect job titles and employers (typically in proximity to dates)
  const companyRolePattern = /\n([A-Z][A-Za-z\s&,]*)\s*[|•]\s*([A-Z][A-Za-z\s&,]*)\b/g;
  formatted = formatted.replace(companyRolePattern, '\n$1 | $2\n');
  
  // Format job titles (often in title case before dates)
  const jobTitles = [
    'Software Engineer', 'Software Developer', 'Web Developer', 'Front End', 'Back End', 'Full Stack', 
    'Data Scientist', 'Data Analyst', 'Data Engineer', 'Product Manager', 'Project Manager', 'UX Designer', 
    'UI Developer', 'Graphic Designer', 'DevOps Engineer', 'System Administrator', 'Network Engineer', 
    'QA Engineer', 'Quality Assurance', 'Tester', 'Technical Writer', 'IT Support', 'IT Specialist', 
    'Director', 'Vice President', 'Manager', 'Lead', 'Senior', 'Junior', 'Intern', 'Consultant', 
    'Coordinator', 'Specialist', 'Analyst', 'Administrator', 'Assistant', 'Associate', 'Executive'
  ];
  
  // Match job titles
  const jobTitleRegex = new RegExp(`\\b(${jobTitles.join('|')})\\b`, 'g');
  formatted = formatted.replace(jobTitleRegex, '\n$1\n');
  
  // Format education degrees
  const educationRegex = /\b(Bachelor|Master|PhD|Doctor|Associate|B\.?S\.?|M\.?S\.?|B\.?A\.?|M\.?A\.?|Ph\.?D\.?|M\.?B\.?A\.?|B\.?B\.?A\.?)[\s\.]+(?:of|in)?\s+([A-Za-z\s]+)/gi;
  formatted = formatted.replace(educationRegex, '\n$1 in $2\n');
  
  // Format bullet points (common in resume descriptions)
  formatted = formatted.replace(/[•·■⦿◦●○◆◇▪▫-]\s*([A-Z][a-z])/g, '\n• $1');
  
  // Convert sequences of whitespace with at least one line break to exactly two line breaks
  formatted = formatted.replace(/\s*\n\s*/g, '\n\n');
  
  // Remove excessive newlines
  formatted = formatted.replace(/\n{3,}/g, '\n\n');
  
  // Fix spacing around punctuation
  formatted = formatted
    .replace(/\s+([.,;:!?])/g, '$1')
    .replace(/([.,;:!?])([A-Za-z])/g, '$1 $2');
  
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

// Add a PDF format detector function to help with specific formats
function detectPdfFormat(text: string): { format: string; confidence: number } {
  // Default format
  let format = 'standard';
  let confidence = 0;
  
  // Check for LinkedIn resume markers
  if (text.includes('urn:li:memberResume:')) {
    format = 'linkedin';
    confidence = 0.9;
  }
  // Check for Apache FOP marker
  else if (text.includes('Apache FOP Version')) {
    format = 'apache-fop';
    confidence = 0.8;
  }
  // Check for other common resume builder formats
  else if (text.includes('Indeed Resume') || text.includes('generated by Indeed')) {
    format = 'indeed';
    confidence = 0.7;
  }
  else if (text.includes('Zety') || text.includes('Resume Genius')) {
    format = 'resume-builder';
    confidence = 0.7;
  }
  
  return { format, confidence };
}

// Add LinkedIn-specific extraction logic with improvements
if (detectedFormat.format === 'linkedin') {
  console.log('LinkedIn resume detected, applying specific extraction rules');
  
  // Look for specific patterns in LinkedIn resumes
  const linkedinPatterns = [
    // LinkedIn section headers (with improved pattern)
    /\/T\s*\(\s*(Summary|Experience|Education|Skills|Languages|Interests|Certifications|Endorsements|Recommendations|Additional|Volunteer|Projects|Awards|Publications|Test Scores|Courses|Patents)\s*\)/g,
    
    // LinkedIn text blocks (with improved pattern)
    /\/Tx\s*\[\s*\(\s*([^)]{10,})\s*\)\s*\]/g,
    
    // LinkedIn form fields (with improved pattern)
    /\/T[tf]\s*\(\s*([^)]{3,})\s*\)/g,
    
    // LinkedIn content blocks (additional pattern)
    /\/Contents\s*\[\s*\(\s*([^)]{3,})\s*\)\s*\]/g,
    
    // Additional LinkedIn patterns
    /<text[^>]*>([^<]+)<\/text>/g,
    /\/Contents\s*\(\s*([^)]{3,})\s*\)/g,
    /\/Title\s*\(\s*([^)]{3,})\s*\)/g,
    
    // LinkedIn profile information
    /Profile\s*Information(?:[\s\S]*?)(?:Name|Location|Title|Industry):\s*([^\n]+)/g
  ];
  
  // Process each LinkedIn pattern
  linkedinPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      if (match[1] && match[1].trim().length > 0) {
        const content = match[1].trim();
        if (/[A-Za-z]/.test(content)) {
          // Add section headers with formatting
          if (/Summary|Experience|Education|Skills|Languages|Interests|Certifications/.test(content)) {
            textFragments.push(`\n\n${content.toUpperCase()}:\n`);
          } else {
            // Clean up the content before adding
            const cleanContent = content
              .replace(/\\(\d{3})/g, (_, octal) => String.fromCharCode(parseInt(octal, 8)))
              .replace(/\\n/g, '\n')
              .trim();
              
            if (cleanContent.length > 1) {
              textFragments.push(cleanContent);
            }
          }
        }
      }
    }
  });
  
  // Look for profile name (LinkedIn usually has this at the top)
  const profileNameMatch = text.match(/\/Name\s*\(\s*([^)]{3,})\s*\)/);
  if (profileNameMatch && profileNameMatch[1]) {
    const name = profileNameMatch[1].trim();
    if (name.length > 3 && /[A-Za-z]/.test(name)) {
      // Add name at the beginning
      textFragments.unshift(`\n${name}\n`);
    }
  }
} 