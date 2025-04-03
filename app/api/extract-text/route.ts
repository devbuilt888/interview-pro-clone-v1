// import formidable from "formidable";
import { NextResponse, NextRequest } from 'next/server';
import { OpenAI } from 'openai';

// Define types for PDF.js since we're using dynamic import
interface PDFDocumentProxy {
  numPages: number;
  getPage(pageNum: number): Promise<PDFPageProxy>;
  destroy(): Promise<void>;
}

interface PDFPageProxy {
  getTextContent(params?: any): Promise<TextContent>;
  getOperatorList(): Promise<any>;
  getAnnotations(): Promise<any>;
  cleanup(): void;
}

interface TextContent {
  items: Array<TextItem>;
  styles?: {
    [key: string]: any;
  };
}

interface TextItem {
  str?: string;
  dir?: string;
  width?: number;
  height?: number;
  transform?: number[];
  fontName?: string;
  hasEOL?: boolean;
  [key: string]: any;
}

// Define Resume structure for better data organization
interface ResumeData {
  name: string | null;
  contactInfo: string[];
  education: string[];
  experience: string[];
  skills: string[];
  summary: string | null;
  rawText: string;
}

// Helper function to merge text content with better formatting
function mergeTextContent(textContent: TextContent) {
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

// Cache for PDF.js worker - keeping a reference helps with cold starts
let pdfWorkerLoaded = false;

// Function to preload PDF.js worker to improve cold start performance
async function preloadPdfJsWorker() {
  if (pdfWorkerLoaded) {
    return; // Already loaded
  }
  
  try {
    console.log('Preloading PDF.js worker...');
    const pdfjs = await import('pdfjs-dist');
    
    // Use unpkg CDN instead of cdnjs as it has the correct version
    const PDFJS_CDN = "https://unpkg.com/pdfjs-dist@4.0.379/build/pdf.worker.min.js";
    
    // Check if GlobalWorkerOptions exists before trying to set it
    if (pdfjs.GlobalWorkerOptions) {
      pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_CDN;
      console.log(`Set worker source to: ${PDFJS_CDN}`);
    } else {
      console.warn('GlobalWorkerOptions not available, using workerPort approach');
      // Some versions might use a different approach for workers
      // We'll handle this in the extraction function
    }
    
    // Create a minimal PDF to initialize the worker
    const minimalPdf = new Uint8Array([
      0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34, 0x0a, 0x31, 0x20, 0x30,
      0x20, 0x6f, 0x62, 0x6a, 0x0a, 0x3c, 0x3c, 0x2f, 0x54, 0x79, 0x70, 0x65,
      0x2f, 0x43, 0x61, 0x74, 0x61, 0x6c, 0x6f, 0x67, 0x2f, 0x50, 0x61, 0x67,
      0x65, 0x73, 0x20, 0x32, 0x20, 0x30, 0x20, 0x52, 0x3e, 0x3e, 0x0a, 0x65,
      0x6e, 0x64, 0x6f, 0x62, 0x6a, 0x0a, 0x32, 0x20, 0x30, 0x20, 0x6f, 0x62,
      0x6a, 0x0a, 0x3c, 0x3c, 0x2f, 0x54, 0x79, 0x70, 0x65, 0x2f, 0x50, 0x61,
      0x67, 0x65, 0x73, 0x2f, 0x43, 0x6f, 0x75, 0x6e, 0x74, 0x20, 0x31, 0x2f,
      0x4b, 0x69, 0x64, 0x73, 0x5b, 0x33, 0x20, 0x30, 0x20, 0x52, 0x5d, 0x3e,
      0x3e, 0x0a, 0x65, 0x6e, 0x64, 0x6f, 0x62, 0x6a, 0x0a, 0x33, 0x20, 0x30,
      0x20, 0x6f, 0x62, 0x6a, 0x0a, 0x3c, 0x3c, 0x2f, 0x54, 0x79, 0x70, 0x65,
      0x2f, 0x50, 0x61, 0x67, 0x65, 0x2f, 0x50, 0x61, 0x72, 0x65, 0x6e, 0x74,
      0x20, 0x32, 0x20, 0x30, 0x20, 0x52, 0x2f, 0x43, 0x6f, 0x6e, 0x74, 0x65,
      0x6e, 0x74, 0x73, 0x20, 0x34, 0x20, 0x30, 0x20, 0x52, 0x3e, 0x3e, 0x0a,
      0x65, 0x6e, 0x64, 0x6f, 0x62, 0x6a, 0x0a, 0x34, 0x20, 0x30, 0x20, 0x6f,
      0x62, 0x6a, 0x0a, 0x3c, 0x3c, 0x2f, 0x4c, 0x65, 0x6e, 0x67, 0x74, 0x68,
      0x20, 0x38, 0x3e, 0x3e, 0x0a, 0x73, 0x74, 0x72, 0x65, 0x61, 0x6d, 0x0a,
      0x42, 0x54, 0x0a, 0x45, 0x54, 0x0a, 0x0a, 0x65, 0x6e, 0x64, 0x73, 0x74,
      0x72, 0x65, 0x61, 0x6d, 0x0a, 0x65, 0x6e, 0x64, 0x6f, 0x62, 0x6a, 0x0a,
      0x78, 0x72, 0x65, 0x66, 0x0a, 0x30, 0x20, 0x35, 0x0a, 0x30, 0x30, 0x30,
      0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x20, 0x36, 0x35, 0x35, 0x33,
      0x35, 0x20, 0x66, 0x0a, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30,
      0x31, 0x30, 0x20, 0x30, 0x30, 0x30, 0x30, 0x30, 0x20, 0x6e, 0x0a, 0x30,
      0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x37, 0x39, 0x20, 0x30, 0x30,
      0x30, 0x30, 0x30, 0x20, 0x6e, 0x0a, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30,
      0x30, 0x31, 0x37, 0x33, 0x20, 0x30, 0x30, 0x30, 0x30, 0x30, 0x20, 0x6e,
      0x0a, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x33, 0x30, 0x31, 0x20,
      0x30, 0x30, 0x30, 0x30, 0x30, 0x20, 0x6e, 0x0a, 0x74, 0x72, 0x61, 0x69,
      0x6c, 0x65, 0x72, 0x0a, 0x3c, 0x3c, 0x2f, 0x53, 0x69, 0x7a, 0x65, 0x20,
      0x35, 0x2f, 0x52, 0x6f, 0x6f, 0x74, 0x20, 0x31, 0x20, 0x30, 0x20, 0x52,
      0x3e, 0x3e, 0x0a, 0x73, 0x74, 0x61, 0x72, 0x74, 0x78, 0x72, 0x65, 0x66,
      0x0a, 0x34, 0x30, 0x36, 0x0a, 0x25, 0x25, 0x45, 0x4f, 0x46
    ]);
    
    // Load a tiny PDF just to initialize the worker
    try {
      const task = pdfjs.getDocument({
        data: minimalPdf,
        useWorkerFetch: false,
        isEvalSupported: false,
        disableFontFace: true,
      });
      
      // Set a short timeout for this preloading task
      const doc = await Promise.race([
        task.promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Worker preload timeout')), 5000))
      ]) as PDFDocumentProxy;
      
      if (doc) {
        await doc.destroy();
      }
      
      pdfWorkerLoaded = true;
      console.log('PDF.js worker preloaded successfully');
    } catch (e) {
      console.warn('PDF.js worker preload failed, will initialize on first PDF:', e);
    }
  } catch (e) {
    console.error('Error preloading PDF.js worker:', e);
  }
}

// Attempt to preload the worker
preloadPdfJsWorker();

// Serverless-specific PDF extraction that doesn't rely on workers
async function extractTextWithoutWorker(fileData: Uint8Array): Promise<string> {
  try {
    console.log('Using worker-free PDF.js extraction for serverless environment...');
    
    // Import PDF.js but don't configure the worker
    const pdfjs = await import('pdfjs-dist');
    
    // Create a document loading task with strict non-worker settings
    const loadingTask = pdfjs.getDocument({
      data: fileData,
      disableFontFace: true,
      useSystemFonts: false,
      useWorkerFetch: false,
      isEvalSupported: false,
      // If available in this version, explicitly disable the worker
      // TypeScript doesn't know about this property, but it's supported in some versions
      // @ts-ignore - intentionally using non-standard option
      disableWorker: true,
      // Disable advanced features that might require a worker
      // @ts-ignore - intentionally using non-standard options
      disableRangeRequests: true,
      // @ts-ignore
      disableAutoFetch: true,
      // @ts-ignore
      disableStream: true,
      cMapPacked: false,
    });
    
    // Using a shorter timeout for serverless
    const pdfDocumentPromise = Promise.race([
      loadingTask.promise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('PDF loading timed out')), 15000)
      )
    ]);
    
    // Load the document
    const pdfDocument = await pdfDocumentPromise as PDFDocumentProxy;
    console.log(`Worker-free PDF loaded with ${pdfDocument.numPages} pages`);
    
    // Extract text with a minimalist approach
    let fullText = '';
    const maxPages = Math.min(pdfDocument.numPages, 5); // Limit to 5 pages for serverless
    
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      try {
        const page = await pdfDocument.getPage(pageNum);
        
        // Get text content with minimal options
        const textContent = await page.getTextContent();
        
        // Basic text extraction
        if (textContent && textContent.items) {
          const pageText = textContent.items
            .filter(item => 'str' in item && typeof item.str === 'string')
            .map(item => (item as TextItem).str)
            .join(' ');
          
          fullText += pageText + '\n\n';
        }
        
        page.cleanup();
      } catch (pageError) {
        console.warn(`Error extracting text from page ${pageNum} in worker-free mode:`, pageError);
      }
    }
    
    // Clean up
    try {
      pdfDocument.destroy();
    } catch (e) {
      console.warn('Error cleaning up PDF document in worker-free mode:', e);
    }
    
    return fullText.trim();
  } catch (error) {
    console.error('Error in worker-free extraction:', error);
    throw error; // Let the caller handle this
  }
}

// Update the main extractTextFromPDF function to use the fallback if needed
async function extractTextFromPDF(fileData: Uint8Array): Promise<string> {
  try {
    console.log('Extracting text using PDF.js with serverless compatibility...');
    
    // First try the worker-free approach for serverless
    let fullText = '';
    try {
      fullText = await extractTextWithoutWorker(fileData);
      
      // If we got enough text, use it directly
      if (fullText && fullText.trim().length > 200) {
        console.log('Successfully extracted text using worker-free approach');
        // Continue with the same processing
      } else {
        console.log('Worker-free extraction returned insufficient text, trying standard approach');
        fullText = ''; // Reset to try the standard approach
      }
    } catch (workerFreeError) {
      console.warn('Worker-free extraction failed, trying standard approach:', workerFreeError);
    }
    
    // If the worker-free approach failed or returned insufficient text, try the standard approach
    if (!fullText || fullText.trim().length < 200) {
      try {
        // Dynamic import of PDF.js to avoid build-time issues
        const pdfjs = await import('pdfjs-dist');
        
        // Use unpkg CDN instead of cdnjs as it has the correct version
        const PDFJS_CDN = "https://unpkg.com/pdfjs-dist@4.0.379/build/pdf.worker.min.js";
        
        // Safely set the worker source with error handling
        try {
          if (pdfjs.GlobalWorkerOptions) {
            pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_CDN;
            console.log(`Using PDF.js worker from: ${PDFJS_CDN}`);
          } else {
            console.warn('GlobalWorkerOptions not available, trying alternative approach');
            // In some environments, we might need to disable workers completely
          }
        } catch (workerError) {
          console.warn('Error setting worker source, proceeding without worker:', workerError);
        }
        
        // Create a document loading task with improved options and fallbacks
        const loadingTask = pdfjs.getDocument({
          data: fileData,
          disableFontFace: true,
          useSystemFonts: true,
          useWorkerFetch: false, // Important for serverless
          isEvalSupported: false, // Important for serverless
          // Workaround for serverless - we'll handle this differently
          // disableWorker: true is not a standard option but it works in some PDF.js versions
          ...(typeof pdfjs.GlobalWorkerOptions === 'undefined' ? { disableWorker: true } : {}),
          // CMap options - using unpkg instead of self-hosted
          cMapUrl: 'https://unpkg.com/pdfjs-dist@4.0.379/cmaps/',
          cMapPacked: true,
          // Standard font data
          standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@4.0.379/standard_fonts/',
        });
        
        // Using a timeout to prevent hanging in case of worker issues
        const pdfDocumentPromise = Promise.race([
          loadingTask.promise,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('PDF loading timed out')), 30000)
          )
        ]);
        
        // Load the document
        const pdfDocument = await pdfDocumentPromise as PDFDocumentProxy;
        console.log(`PDF document loaded with ${pdfDocument.numPages} pages`);
        
        // Extract text from each page with improved handling
        let standardText = '';
        const maxPages = Math.min(pdfDocument.numPages, 10); // Limit to 10 pages
        
        for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
          try {
            const page = await pdfDocument.getPage(pageNum);
            
            // Try to get annotations (like form fields) that might contain text
            let annotationText = '';
            try {
              const annotations = await page.getAnnotations();
              if (annotations && annotations.length > 0) {
                for (const annot of annotations) {
                  if (annot.fieldValue && typeof annot.fieldValue === 'string') {
                    annotationText += annot.fieldValue + '\n';
                  }
                  if (annot.contents && typeof annot.contents === 'string') {
                    annotationText += annot.contents + '\n';
                  }
                }
              }
            } catch (annotError) {
              console.warn(`Error extracting annotations from page ${pageNum}:`, annotError);
            }
            
            // Get text content with enhanced options
            const textContent = await page.getTextContent({
              // Request more detailed text content for better formatting
              includeMarkedContent: true,
              disableCombineTextItems: false,
              // Adds support for expanded character and feature sets
              normalizeWhitespace: true,
            });
            
            // Use improved text content merger for better formatting
            const pageText = mergeTextContent(textContent);
            
            // Combine annotation text and page text
            standardText += pageText + (annotationText ? '\n' + annotationText : '') + '\n\n';
            
            page.cleanup();
          } catch (pageError) {
            console.warn(`Error extracting text from page ${pageNum}:`, pageError);
          }
        }
        
        // Clean up the PDF document
        try {
          pdfDocument.destroy();
        } catch (e) {
          console.warn('Error destroying PDF document:', e);
        }
        
        // If we got useful text from the standard approach, use it
        if (standardText && standardText.trim().length > 200) {
          fullText = standardText;
          console.log('Successfully extracted text using standard PDF.js approach');
        }
      } catch (standardError) {
        console.error('Error using standard PDF.js approach:', standardError);
        // If we have some text from the worker-free approach, use it even if it's not ideal
        if (fullText && fullText.trim().length > 0) {
          console.log('Using partial results from worker-free extraction');
        } else {
          // Otherwise fall back to regex method
          return await fallbackExtraction(fileData);
        }
      }
    }
    
    // If we successfully extracted text
    if (fullText && fullText.trim().length > 100) {
      console.log(`Successfully extracted ${fullText.length} characters of text with PDF.js`);
      
      // Parse the extracted text into structured resume data
      const resumeData = parseResumeText(fullText);
      
      // Generate formatted resume text with sections
      let extractedText = formatResumeData(resumeData);
      
      // Log what will be sent to OpenAI for better debugging
      console.log(`Extracted resume data sections: ${Object.keys(resumeData).filter(k => k !== 'rawText').join(', ')}`);
      if (resumeData.name) {
        console.log(`Extracted name: ${resumeData.name}`);
      }
      
      // Add section markers for better OpenAI context understanding
      extractedText = "--- RESUME START ---\n" + extractedText + "\n--- RESUME END ---";
      
      // Limit the text to avoid token limits
      const maxLength = 7500;
      const finalText = extractedText.length > maxLength 
        ? extractedText.substring(0, maxLength) + '...' 
        : extractedText;
        
      return finalText;
    }
    
    // If pdf.js extraction fails, try regex method
    console.log('PDF.js extraction returned insufficient text, trying fallback method...');
    return await fallbackExtraction(fileData);
    
  } catch (error) {
    console.error('Error using PDF.js for text extraction:', error);
    // Fall back to regex method
    return await fallbackExtraction(fileData);
  }
}

// Parse extracted text into structured resume data
function parseResumeText(text: string): ResumeData {
  const resumeData: ResumeData = {
    name: null,
    contactInfo: [],
    education: [],
    experience: [],
    skills: [],
    summary: null,
    rawText: text,
  };
  
  // Extract name
  resumeData.name = extractNameFromText(text);
  
  // Split text into lines for processing
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Extract contact information (email, phone, LinkedIn)
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const phoneRegex = /\b(?:\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/;
  const linkedinRegex = /(?:linkedin\.com\/in\/[a-zA-Z0-9_-]+)/i;
  
  for (const line of lines) {
    if (emailRegex.test(line)) {
      resumeData.contactInfo.push(line);
    }
    if (phoneRegex.test(line)) {
      resumeData.contactInfo.push(line);
    }
    if (linkedinRegex.test(line)) {
      resumeData.contactInfo.push(line);
    }
  }
  
  // Find sections with common headers
  const sections: { [key: string]: number[] } = {};
  const sectionHeaders = [
    { name: 'education', patterns: ['education', 'academic', 'degree', 'university', 'college'] },
    { name: 'experience', patterns: ['experience', 'employment', 'work history', 'professional experience', 'work experience'] },
    { name: 'skills', patterns: ['skills', 'technologies', 'technical skills', 'core competencies', 'proficiencies'] },
    { name: 'summary', patterns: ['summary', 'profile', 'objective', 'about me', 'professional summary'] },
  ];
  
  // Identify section start points
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    
    for (const section of sectionHeaders) {
      if (section.patterns.some(pattern => line.includes(pattern) && line.length < 50)) {
        if (!sections[section.name]) {
          sections[section.name] = [];
        }
        sections[section.name].push(i);
      }
    }
  }
  
  // Extract content from identified sections
  for (const [sectionName, indices] of Object.entries(sections)) {
    if (indices.length === 0) continue;
    
    indices.sort((a, b) => a - b);
    
    // For each section start, find where to stop (next section or end)
    for (let i = 0; i < indices.length; i++) {
      const startIdx = indices[i] + 1; // Skip header
      let endIdx = lines.length;
      
      // Find the next section start
      for (const [otherSection, otherIndices] of Object.entries(sections)) {
        for (const idx of otherIndices) {
          if (idx > startIdx && idx < endIdx) {
            endIdx = idx;
          }
        }
      }
      
      // Extract section content
      const sectionLines = lines.slice(startIdx, endIdx).join('\n');
      
      if (sectionName === 'summary' && !resumeData.summary) {
        resumeData.summary = sectionLines;
      } else if (sectionName === 'education') {
        resumeData.education.push(sectionLines);
      } else if (sectionName === 'experience') {
        resumeData.experience.push(sectionLines);
      } else if (sectionName === 'skills') {
        resumeData.skills.push(sectionLines);
      }
    }
  }
  
  return resumeData;
}

// Format resume data into a structured text
function formatResumeData(resumeData: ResumeData): string {
  let formattedText = '';
  
  // Add name if found
  if (resumeData.name) {
    formattedText += `Name: ${resumeData.name}\n\n`;
  }
  
  // Add contact info
  if (resumeData.contactInfo.length > 0) {
    formattedText += `Contact Information:\n${resumeData.contactInfo.join('\n')}\n\n`;
  }
  
  // Add summary if found
  if (resumeData.summary) {
    formattedText += `Summary:\n${resumeData.summary}\n\n`;
  }
  
  // Add experience
  if (resumeData.experience.length > 0) {
    formattedText += `Experience:\n${resumeData.experience.join('\n\n')}\n\n`;
  }
  
  // Add education
  if (resumeData.education.length > 0) {
    formattedText += `Education:\n${resumeData.education.join('\n\n')}\n\n`;
  }
  
  // Add skills
  if (resumeData.skills.length > 0) {
    formattedText += `Skills:\n${resumeData.skills.join('\n\n')}\n\n`;
  }
  
  // If no structured data was extracted, use the raw text
  if (formattedText.trim().length < 100) {
    formattedText = resumeData.rawText;
  }
  
  return formattedText;
}

// Enhanced regex-based fallback extraction
async function fallbackExtraction(fileData: Uint8Array): Promise<string> {
  try {
    console.log('Using fallback regex-based PDF extraction...');
    const text = new TextDecoder().decode(fileData);
    
    // Extract sections
    const sections: {[key: string]: string} = {};
    
    // Extract name
    const nameInfo = extractNameFromText(text);
    if (nameInfo) {
      sections.name = nameInfo;
    }
    
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
    
    // Parse the extracted text into structured resume data
    try {
      const resumeData = parseResumeText(extractedText);
      extractedText = formatResumeData(resumeData);
    } catch (parseError) {
      console.error('Error parsing extracted text:', parseError);
      // If parsing fails, just use the extracted text with the name
      if (sections.name && !extractedText.includes(sections.name)) {
        extractedText = `Name: ${sections.name}\n\n${extractedText}`;
      }
    }
    
    // If we still couldn't extract meaningful text, return fallback
    if (!extractedText || extractedText.length < 100) {
      console.log('Fallback extraction failed, returning default text');
      return getFallbackText();
    }
    
    // Add section markers for OpenAI
    extractedText = "--- RESUME START (FALLBACK EXTRACTION) ---\n" + extractedText + "\n--- RESUME END ---";
    
    // Limit the text to avoid token limits
    const maxLength = 7500;
    return extractedText.length > maxLength 
      ? extractedText.substring(0, maxLength) + '...' 
      : extractedText;
      
  } catch (error) {
    console.error('Error in fallback extraction:', error);
    return getFallbackText();
  }
}

// Function to extract name from text with multiple patterns
function extractNameFromText(text: string): string | null {
  // Try first 10000 characters for efficiency
  const searchText = text.substring(0, 10000);
  
  // Set of patterns to try
  const patterns = [
    // Pattern 1: Common format for name at top of resume
    /^\s*([A-Z][a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð'-]+(?:\s+[A-Z][a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð'-]+){1,4})\s*$/m,
    
    // Pattern 2: Name followed by contact information
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})\s*[\n\r]+\s*(?:Email|Phone|Address|Tel|Mobile|LinkedIn|https?:\/\/)/i,
    
    // Pattern 3: Resume/CV header with name
    /(?:Resume|CV|Curriculum\s+Vitae)(?:\s+of|\s+for|\s*[:|-])?\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/i,
    
    // Pattern 4: Name with professional title
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})\s*(?:\||–|-)\s*(?:[A-Za-z]+\s*)+/,
    
    // Pattern 5: Simple capitalized name (least reliable, used last)
    /^([A-Z][a-z]+\s+[A-Z][a-z]+)$/m
  ];
  
  // Try each pattern in order
  for (const pattern of patterns) {
    const match = searchText.match(pattern);
    if (match && match[1]) {
      const candidateName = match[1].trim();
      
      // Validate the name
      if (candidateName.length > 3 && 
          candidateName.length < 40 && 
          /[A-Z][a-z]/.test(candidateName) &&
          !/education|experience|skills|objective|summary|history|projects|certification/i.test(candidateName)) {
        return candidateName;
      }
    }
  }
  
  return null;
}

// Function to get fallback text
function getFallbackText(): string {
  return `John Doe
Software Engineer
5+ years of experience in full-stack development
Skills: JavaScript, TypeScript, React, Node.js, Python
Experience: Senior Developer at Tech Corp (2020-present)
Education: BS Computer Science, University of Technology (2019)`;
}

// Function to fetch OpenAI response
async function fetchOpenAIResponse(extractedText: string): Promise<string> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    console.log('Sending extracted text to OpenAI API...');
    
    // Log what's being sent to OpenAI (but keep it short for logs)
    const firstLines = extractedText.split('\n').slice(0, 5).join('\n');
    console.log(`Resume data first few lines: "${firstLines}..."`);
    
    // Also log detected sections for better debugging
    const sections = ['Name:', 'Contact Information:', 'Summary:', 'Experience:', 'Education:', 'Skills:']
      .filter(section => extractedText.includes(section));
    console.log(`Detected ${sections.length} resume sections: ${sections.join(', ')}`);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are Bob, an AI interviewer. Greet the candidate in a friendly manner. Address the candidate by their name from the resume if available. Keep responses concise and suitable for text-to-speech. Format your response as a brief introduction followed by ONE question to start the interview. DO NOT list multiple questions."
        },
        {
          role: "user",
          content: `Here is the resume text: ${extractedText}`
        }
      ],
    });

    return completion.choices[0].message.content || 
      "Hello, I am Bob the Interviewer. I'll be reviewing your resume and asking you some questions today. Could you tell me more about your experience?";
  } catch (error) {
    console.error('OpenAI API error:', error);
    return "Hello, I am Bob the Interviewer. I'll be reviewing your resume and asking you some questions today. Could you tell me more about your experience?";
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('PDF extraction request received');
    
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    console.log(`File received: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);

    // Log environment information to help with debugging
    console.log(`Node environment: ${process.env.NODE_ENV}`);
    console.log(`PDF.js version: ${await getPdfJsVersion()}`);

    const arrayBuffer = await file.arrayBuffer();
    const fileData = new Uint8Array(arrayBuffer);
    console.log(`File buffer created, length: ${fileData.length} bytes`);

    console.log('Extracting text from PDF...');
    const extractedText = await extractTextFromPDF(fileData);
    console.log(`Extracted text length: ${extractedText.length} characters`);

    console.log('Sending extracted text to OpenAI');
    const initialMessage = await fetchOpenAIResponse(extractedText);
    console.log('Received response from OpenAI');

    // Return the response in the format expected by ResumeUploader
    return new Response(JSON.stringify({ 
      status: 'ok',
      text: initialMessage 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    // Enhanced error logging with full stack trace and details
    console.error('Error in PDF extraction:', error);
    if (error instanceof Error) {
      console.error(`Error name: ${error.name}`);
      console.error(`Error message: ${error.message}`);
      console.error(`Error stack: ${error.stack}`);
      
      // For TypeErrors, log more details
      if (error.name === 'TypeError') {
        console.error('TypeScript TypeError detected - likely related to PDF.js Worker configuration');
        console.error('This may be a serverless compatibility issue with PDF.js workers');
      }
    }

    return new Response(JSON.stringify({ 
      status: 'error',
      error: 'Failed to process PDF',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// Helper function to get PDF.js version information
async function getPdfJsVersion(): Promise<string> {
  try {
    const pdfjs = await import('pdfjs-dist');
    return pdfjs.version || 'Version not available';
  } catch (e) {
    return `Error getting version: ${e instanceof Error ? e.message : 'Unknown error'}`;
  }
}