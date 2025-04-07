/**
 * PDF Text Extraction Utilities
 * 
 * This module provides functions for extracting text from PDF files,
 * with multiple approaches and fallback strategies optimized for serverless environments.
 */

import { PDFDocumentProxy, PDFPageProxy, TextContent, TextItem } from './pdf-types';
import { ExtractionResult } from './resume-types';
import { improveGibberishText, translateGibberishPatterns } from './pdf-pattern-translator';

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
    
    // Use text-based extraction instead since we're having issues with the module
    return await fallbackTextExtraction(fileData, true);
  } catch (error) {
    console.error('Error in worker-free extraction:', error);
    throw error; // Let the caller handle this
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
 * Binary Data Detection
 * Check if the provided string appears to be binary/raw data rather than text
 */
function isBinaryData(text: string): boolean {
  if (!text) return false;
  
  // Check for high concentration of non-printable characters
  const nonPrintableCount = (text.match(/[^\x20-\x7E\r\n\t]/g) || []).length;
  const binaryRatio = nonPrintableCount / text.length;
  
  // If more than 15% of characters are non-printable, it's likely binary
  if (binaryRatio > 0.15) return true;
  
  // Check for common PDF binary markers
  if (text.includes('stream') && 
      text.includes('endstream') && 
      text.includes('xref')) {
    return true;
  }
  
  // Check for other binary data patterns
  const binaryPatterns = [
    /^\%PDF/, // PDF header
    /^\x00\x01/, // Binary file headers
    /^\xFF\xD8\xFF/, // JPEG header
    /^\x89\x50\x4E\x47/ // PNG header
  ];
  
  for (const pattern of binaryPatterns) {
    if (pattern.test(text.slice(0, 10))) {
      return true;
    }
  }
  
  return false;
}

/**
 * Buffer handling for binary data
 * This converts binary strings back to proper Buffer for better handling
 */
function bufferToString(buffer: Uint8Array): string {
  return new TextDecoder("utf-8", { fatal: false }).decode(buffer);
}

/**
 * Improved fallback text extraction for PDFs with better handling of binary data
 */
export async function fallbackTextExtraction(fileData: Uint8Array, useMaxExtraction = false): Promise<string> {
  try {
    console.log('Using enhanced fallback text extraction with binary data detection...');
    
    // First try to decode using standard UTF-8
    let rawText = bufferToString(fileData);
    
    // Check if we're dealing with binary data
    const isProbablyBinary = isBinaryData(rawText);
    
    if (isProbablyBinary) {
      console.log('Detected binary data - attempting specialized extraction...');
      return await extractTextFromBinaryPDF(fileData);
    }
    
    // If we have readable text already, proceed with pattern translation
    try {
      const translatedText = improveGibberishText(rawText);
      if (translatedText && translatedText.length > 100) {
        console.log(`Successfully applied pattern translation with ${translatedText.length} characters`);
        return translatedText;
      }
    } catch (translationError) {
      console.warn('Pattern translation failed, continuing with regular extraction', translationError);
    }
    
    // If text looks partly readable but pattern translation failed,
    // try some basic cleanup and return what we have
    if (!isProbablyBinary && rawText.length > 100) {
      console.log('Using basic text cleanup for non-binary content');
      return cleanupExtractedText(rawText);
    }
    
    // Fallback to binary extraction as a last resort
    console.log('Falling back to binary PDF extraction...');
    return await extractTextFromBinaryPDF(fileData);
  } catch (error) {
    console.error('Error in enhanced fallback extraction:', error);
    return "Failed to extract text from PDF. The file may be corrupt or password protected.";
  }
}

/**
 * New specialized extraction for binary PDF data
 * Using PDF.js-inspired techniques to extract readable text from binary PDF data
 */
async function extractTextFromBinaryPDF(fileData: Uint8Array): Promise<string> {
  console.log('Starting specialized binary PDF extraction...');
  
  // Convert buffer to Uint8Array if needed
  const pdfData = fileData instanceof Uint8Array ? fileData : new Uint8Array(fileData);
  
  // Try different approaches for binary PDFs
  const extractionMethods = [
    extractTextFromStrings,
    extractTextFromStreams,
    extractTextFromObjStrings,
    extractTextFromFontMaps
  ];
  
  // Run all methods and collect their results
  const results: string[] = [];
  
  for (const method of extractionMethods) {
    try {
      const extractedText = await method(pdfData);
      if (extractedText && extractedText.length > 50) {
        results.push(extractedText);
      }
    } catch (error) {
      console.warn(`Extraction method failed: ${error}`);
      // Continue with next method
    }
  }
  
  // Combine all successful extraction results
  let combinedText = results.join('\n\n');
  
  // If we got at least some text, clean it and apply pattern translation
  if (combinedText.length > 100) {
    // First do basic cleaning
    combinedText = cleanupExtractedText(combinedText);
    
    // Then apply pattern translation for better results
    try {
      const translatedText = improveGibberishText(combinedText);
      if (translatedText && translatedText.length > combinedText.length * 0.5) {
        return translatedText;
      }
    } catch (error) {
      console.warn('Pattern translation after binary extraction failed:', error);
    }
    
    // Return the cleaned text if translation failed
    return combinedText;
  }
  
  // If all extraction methods failed or produced no useful text
  return "Could not extract readable text from this PDF. The file may contain encrypted content or be heavily image-based.";
}

/**
 * Extract readable strings from binary PDF data
 */
async function extractTextFromStrings(pdfData: Uint8Array): Promise<string> {
  // Convert the PDF data to a string for regex processing
  // Use Latin1 encoding for binary data to preserve byte values
  const pdfString = new TextDecoder('latin1').decode(pdfData);
  
  // Look for text between parentheses (common in PDFs)
  const stringPattern = /\(([^\\\(\)]{3,})\)/g;
  const results: string[] = [];
  let match;
  
  while ((match = stringPattern.exec(pdfString)) !== null) {
    const content = match[1];
    
    // Only keep strings that look like readable text
    if (/[a-zA-Z]{3,}/.test(content) && 
        !/^\d+$/.test(content) && 
        content.length > 3) {
      results.push(content.trim());
    }
  }
  
  // Join results and clean up
  let text = results.join(' ');
  
  // Basic cleanup
  text = text
    // Remove PDF-specific sequences
    .replace(/\\[nrt]/g, ' ')
    // Convert octal escapes
    .replace(/\\(\d{3})/g, (match, octal) => {
      return String.fromCharCode(parseInt(octal, 8));
    })
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
  
  return text;
}

/**
 * Extract text from stream objects in binary PDF data
 */
async function extractTextFromStreams(pdfData: Uint8Array): Promise<string> {
  // Use Latin1 encoding to preserve byte values
  const pdfString = new TextDecoder('latin1').decode(pdfData);
  
  // Pattern to find text streams
  const streamPattern = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g;
  const results: string[] = [];
  let match;
  
  while ((match = streamPattern.exec(pdfString)) !== null) {
    const content = match[1];
    
    // Skip binary streams that don't have readable content
    if (content.length < 10 || !/[a-zA-Z]{3,}/.test(content)) {
      continue;
    }
    
    // Extract readable text from stream
    const textMatches = content.match(/\(([^\\\(\)]{3,})\)/g);
    if (textMatches) {
      for (const textMatch of textMatches) {
        const text = textMatch.slice(1, -1);
        
        // Only keep strings that look like readable text
        if (/[a-zA-Z]{3,}/.test(text) && text.length > 3) {
          results.push(text);
        }
      }
    } else {
      // If no text in parentheses, try to extract words directly
      const words = content
        .replace(/[^a-zA-Z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 3 && /[a-zA-Z]{3,}/.test(word));
      
      if (words.length > 5) {
        results.push(words.join(' '));
      }
    }
  }
  
  return results.join(' ');
}

/**
 * Extract text from object strings in binary PDF data
 */
async function extractTextFromObjStrings(pdfData: Uint8Array): Promise<string> {
  // Use Latin1 encoding to preserve byte values
  const pdfString = new TextDecoder('latin1').decode(pdfData);
  
  // Pattern to find text within PDF objects
  const objPattern = /(\d+\s+\d+\s+obj[\s\S]*?endobj)/g;
  const results: string[] = [];
  let match;
  
  while ((match = objPattern.exec(pdfString)) !== null) {
    const objContent = match[1];
    
    // Look for text content within the object
    // Ignore objects without text content
    if (!objContent.includes('/Type /Page') && 
        !objContent.includes('/Contents') && 
        !objContent.includes('/Text')) {
      continue;
    }
    
    // Extract text strings from the object
    const stringPattern = /\(([^\\\(\)]{3,})\)/g;
    let stringMatch;
    
    while ((stringMatch = stringPattern.exec(objContent)) !== null) {
      const content = stringMatch[1];
      
      // Only keep strings that look like readable text
      if (/[a-zA-Z]{3,}/.test(content) && 
          !/^\d+$/.test(content) && 
          content.length > 3) {
        results.push(content.trim());
      }
    }
  }
  
  // Join results and clean up
  return results.join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract text using font mapping information in the PDF
 */
async function extractTextFromFontMaps(pdfData: Uint8Array): Promise<string> {
  // Use Latin1 encoding to preserve byte values
  const pdfString = new TextDecoder('latin1').decode(pdfData);
  
  // Look for text content in BT (Begin Text) and ET (End Text) sections
  const btEtPattern = /BT\s*([\s\S]*?)\s*ET/g;
  const results: string[] = [];
  let match;
  
  while ((match = btEtPattern.exec(pdfString)) !== null) {
    const textBlock = match[1];
    
    // Extract strings from TJ operators (most common for text)
    const tjPattern = /\[(.*?)\]\s*TJ/g;
    let tjMatch;
    
    while ((tjMatch = tjPattern.exec(textBlock)) !== null) {
      const tjContent = tjMatch[1];
      
      // Extract strings from TJ content
      const stringPattern = /\(([^\\\(\)]*)\)/g;
      let stringMatch;
      
      const blockParts: string[] = [];
      
      while ((stringMatch = stringPattern.exec(tjContent)) !== null) {
        const content = stringMatch[1];
        
        // Skip empty or numeric-only strings
        if (content.length === 0 || /^\d+$/.test(content)) {
          continue;
        }
        
        blockParts.push(content);
      }
      
      if (blockParts.length > 0) {
        results.push(blockParts.join(' '));
      }
    }
    
    // Also check for Tj operators (simpler text)
    const tjSinglePattern = /\(([^\\\(\)]*)\)\s*Tj/g;
    let tjSingleMatch;
    
    while ((tjSingleMatch = tjSinglePattern.exec(textBlock)) !== null) {
      const content = tjSingleMatch[1];
      
      // Skip empty or numeric-only strings
      if (content.length === 0 || /^\d+$/.test(content)) {
        continue;
      }
      
      results.push(content);
    }
  }
  
  // Look for ToUnicode maps for better character encoding
  // This is a simplified approach - full implementation would be much more complex
  const toUnicodePattern = /\/ToUnicode\s+(\d+\s+\d+\s+R)/g;
  if (toUnicodePattern.test(pdfString)) {
    console.log('ToUnicode maps found - more accurate text extraction may be possible');
  }
  
  // Join results and clean up
  return results.join(' ')
    // Convert octal escapes
    .replace(/\\(\d{3})/g, (match, octal) => {
      return String.fromCharCode(parseInt(octal, 8));
    })
    // Remove other escapes
    .replace(/\\[nrt]/g, ' ')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Cleans up extracted text by removing garbage characters and formatting issues
 */
function cleanupExtractedText(text: string): string {
  if (!text || text.length === 0) return "";
  
  return text
    // Convert octal escapes that are common in PDFs
    .replace(/\\(\d{3})/g, (_, octal) => String.fromCharCode(parseInt(octal, 8)))
    // Remove PDF-specific escape sequences
    .replace(/\\[\\'rnt]/g, match => {
      if (match === '\\r') return '\r';
      if (match === '\\n') return '\n';
      if (match === '\\t') return '\t';
      if (match === "\\'") return "'";
      if (match === '\\"') return '"';
      return '';
    })
    // Remove remaining escape characters
    .replace(/\\\\/g, '\\')
    // Remove PDF operators often mixed with text
    .replace(/(\s|^)(Tj|TJ|Tf|Td|TD|T\*|Tm|Tc|Tw|Tz|TL|Ts|BT|ET|cm|gs|re|f|q|Q|j|J|w|M|d|ri|sh)(\s|$)/g, ' ')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    // Fix common PDF formatting issues
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between lowercase and uppercase (camelCase fix)
    // Remove control characters
    .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Remove isolated single characters that are likely noise
    .replace(/(\s|^)([a-zA-Z])(\s|$)/g, ' ')
    // Remove empty parentheses and brackets that might remain
    .replace(/\(\s*\)|\[\s*\]/g, '')
    // Remove duplicated words
    .replace(/\b(\w+)(\s+\1\b)+/g, '$1')
    // Fix spacing after periods, commas, etc.
    .replace(/([.,:;!?])([a-zA-Z])/g, '$1 $2')
    // Remove too many consecutive newlines
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
    let method: 'worker-free' | 'fallback' | 'fallback-enhanced' | 'pattern-translated' = 'worker-free'; 
    
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
      
      // Check for gibberish in the extracted text
      const { format } = detectPdfFormat(extractedText);
      if (format === 'standard' && 
          /[A-Z]\s[A-Z]\s[A-Z]\s[A-Z]/.test(extractedText.slice(0, 100)) &&
          extractedText.length > 0) {
        console.log('Detected gibberish in extracted text, using enhanced extraction');
        
        // Try improved pattern translation first
        const rawText = new TextDecoder().decode(fileData);
        const translatedText = improveGibberishText(rawText);
        
        // If translation produced substantial text, use it
        if (translatedText && 
            translatedText.length > 100 && 
            (translatedText.match(/[a-zA-Z]{3,}/g) || []).length > 20) {
          extractedText = translatedText;
          method = 'pattern-translated';
          console.log('Successfully applied pattern translation to gibberish text');
        } else {
          // Otherwise fall back to the difficult PDF extraction
        extractedText = extractTextFromDifficultPDF(rawText);
        method = 'fallback-enhanced';
        }
        
        warnings.push('Used enhanced extraction due to detected gibberish');
      }
    } catch (error) {
      console.error('Error in primary extraction method:', error);
      warnings.push(`Extraction error: ${error instanceof Error ? error.message : String(error)}`);
      
      // If we failed completely, try the fallback as last resort
      console.log('Trying fallback extraction as last resort');
      extractedText = await fallbackTextExtraction(fileData, true);
      method = 'fallback';
    }
    
    // Validate we got enough text
    if (!extractedText || extractedText.trim().length < 50) {
      console.warn('Extraction returned insufficient text');
      warnings.push('Extraction returned insufficient text');
      
      // If both methods failed to get enough text, try pattern translation as last resort
      if (extractedText.trim().length < 50) {
        console.log('Trying pattern translation as last resort for minimal text');
        const rawText = new TextDecoder().decode(fileData);
        const translatedText = improveGibberishText(rawText);
        
        if (translatedText && translatedText.length > extractedText.length) {
          extractedText = translatedText;
          method = 'pattern-translated';
          console.log('Pattern translation improved minimal text extraction');
        }
      }
      
      // If still no usable text, throw error
      if (extractedText.trim().length === 0) {
        throw new Error('Failed to extract any usable text from PDF');
      }
    }
    
    // Return the results
    return {
      text: extractedText,
      method: method as 'worker-free' | 'fallback' | 'fallback-enhanced' | 'pattern-translated',
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

// Export the format detector for use in other modules
export { detectPdfFormat }; 

/**
 * Special extraction function for difficult PDFs that have gibberish or unusual formatting
 * This function will try multiple specialized approaches
 */
function extractTextFromDifficultPDF(rawText: string): string {
  console.log('Using specialized difficult PDF extraction...');
  
  // Start with an empty result
  let extractedText = '';
  
  // Try multiple extraction strategies
  const strategies = [
    // Strategy 1: Find repeating word patterns (like "Adobe Adobe Adobe")
    () => {
      console.log('Trying repeating word pattern extraction...');
      const repeatingMatches = rawText.match(/([A-Z][a-z]+)(\s+\1){2,}/g) || [];
      
      if (repeatingMatches.length === 0) return '';
      
      const uniqueWords = new Set<string>();
      repeatingMatches.forEach(match => {
        // Extract the repeated word
        const word = match.trim().split(/\s+/)[0];
        if (word && word.length > 2) {
          uniqueWords.add(word);
        }
      });
      
      return Array.from(uniqueWords).join('\n');
    },
    
    // Strategy 2: Extract sequences of words with spaces between them
    () => {
      console.log('Trying spaced word sequence extraction...');
      const wordSequences = rawText.match(/([A-Z][a-z]+)(?:\s+([A-Z][a-z]+)){2,}/g) || [];
      
      if (wordSequences.length === 0) return '';
      
      return wordSequences
        .filter(seq => seq.length > 10) // Only keep substantial sequences
        .join('\n');
    },
    
    // Strategy 3: Extract lines with likely job titles
    () => {
      console.log('Trying job title extraction...');
      const jobTitleKeywords = [
        'Senior', 'Lead', 'Software', 'Developer', 'Engineer', 'Full-stack',
        'Front-end', 'Back-end', 'React', 'Angular', 'Vue', 'Node', 'Python',
        'Java', 'C\\+\\+', 'Architect', 'Manager', 'Director', 'VP', 'Head',
        'Principal', 'Staff', 'Technical', 'Designer'
      ];
      
      const titleRegex = new RegExp(`((?:^|\\n)(?:[^\\n]{0,50})(?:${jobTitleKeywords.join('|')})(?:[^\\n]{0,50})(?:\\n|$))`, 'g');
      const titleMatches = rawText.match(titleRegex) || [];
      
      if (titleMatches.length === 0) return '';
      
      return titleMatches
        .map(m => m.trim())
        .filter(m => m.length > 5)
        .join('\n');
    },
    
    // Strategy 4: Look for PDF text operators like "Tj" and extract content
    () => {
      console.log('Trying PDF operator extraction...');
      const tjOperations = rawText.match(/\(([^)]{3,})\)\s*(?:Tj|TJ)/g) || [];
      
      if (tjOperations.length === 0) return '';
      
      return tjOperations
        .map(op => {
          // Extract content inside parentheses
          const match = op.match(/\(([^)]+)\)/);
          return match ? match[1] : '';
        })
        .filter(content => 
          content.length > 2 && 
          /[A-Za-z]{2,}/.test(content)
        )
        .join('\n');
    },
    
    // Strategy 5: Extract content from BT/ET blocks
    () => {
      console.log('Trying BT/ET block extraction...');
      const btEtBlocks = rawText.match(/BT[\s\S]*?ET/g) || [];
      
      if (btEtBlocks.length === 0) return '';
      
      return btEtBlocks
        .map(block => {
          // Find all text content within the BT/ET block
          const textMatches = block.match(/\(([^)]+)\)/g) || [];
          return textMatches
            .map(t => t.slice(1, -1)) // Remove parentheses
            .filter(t => t.length > 2 && /[A-Za-z]{2,}/.test(t))
            .join(' ');
        })
        .filter(blockText => blockText.length > 0)
        .join('\n');
    },
    
    // Strategy 6: Adobe-specific format extraction
    () => {
      console.log('Trying Adobe-specific extraction...');
      if (rawText.includes('Adobe') || rawText.includes('Acrobat')) {
        // Try to find product names
        const productMatches = rawText.match(/(?:Adobe|Microsoft)\s+[A-Z][a-z]+/g) || [];
        
        if (productMatches.length > 0) {
          return productMatches.join('\n');
        }
      }
      return '';
    },
    
    // Strategy 7: Use our improved gibberish text translator as a last resort
    () => {
      console.log('Applying pattern translation for difficult PDF...');
      try {
        return improveGibberishText(rawText);
      } catch (error) {
        console.warn('Pattern translation failed:', error);
        return '';
      }
    }
  ];
  
  // Try each strategy and combine the results
  for (const strategy of strategies) {
    try {
      const result = strategy();
      
      if (result && result.length > 10) {
        // If we get a substantial result, append it
        if (extractedText) extractedText += '\n\n';
        extractedText += result;
      }
    } catch (error) {
      console.warn('Strategy error:', error);
      // Continue to next strategy
    }
  }
  
  // Clean up the extracted text
  if (extractedText) {
    extractedText = extractedText
      // Remove duplicate lines
      .split('\n')
      .filter((line, index, self) => line.trim() && self.indexOf(line) === index)
      .join('\n')
      // Remove excessive whitespace
      .replace(/\s+/g, ' ')
      // Remove duplicate spaces
      .replace(/\s{2,}/g, ' ')
      // Clean up newlines
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
  
  return extractedText;
} 