import { NextRequest, NextResponse } from 'next/server';

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

// Serverless-specific PDF extraction that doesn't rely on workers
async function extractTextWithoutWorker(fileData: Uint8Array): Promise<string> {
  try {
    console.log('Using worker-free PDF.js extraction for serverless environment...');
    
    // Fixed import approach for PDF.js in ESM mode
    // Import specific functions rather than the whole module
    const pdfJsModule = await import('pdfjs-dist');
    
    // In ESM mode, we need to access the getDocument from the right property
    // Different versions of PDF.js have different export structures
    const pdfjsLib = pdfJsModule.default || pdfJsModule;
    
    // Log the structure to help debugging
    console.log('PDF.js module structure:', Object.keys(pdfJsModule));
    
    // Access getDocument from the right place
    const getDocument = pdfjsLib.getDocument || pdfJsModule.getDocument;
    
    if (typeof getDocument !== 'function') {
      throw new Error('getDocument function not found in PDF.js. Available properties: ' + 
        Object.keys(pdfjsLib).join(', '));
    }
    
    // Create a document loading task with strict non-worker settings
    const loadingTask = getDocument({
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

// Standard PDF.js extraction that attempts to use workers
async function extractTextWithWorker(fileData: Uint8Array): Promise<string> {
  try {
    console.log('Using standard PDF.js extraction with worker...');
    
    // Fixed import approach for PDF.js in ESM mode
    const pdfJsModule = await import('pdfjs-dist');
    
    // In ESM mode, we need to access the getDocument from the right property
    const pdfjsLib = pdfJsModule.default || pdfJsModule;
    
    // Access getDocument from the right place
    const getDocument = pdfjsLib.getDocument || pdfJsModule.getDocument;
    
    if (typeof getDocument !== 'function') {
      throw new Error('getDocument function not found in PDF.js');
    }
    
    // Attempt to set the worker source - this might need the GlobalWorkerOptions from the right place
    // Use unpkg CDN for the worker
    const PDFJS_CDN = "https://unpkg.com/pdfjs-dist@4.0.379/build/pdf.worker.min.js";
    
    // Safely set the worker source with error handling
    try {
      const GlobalWorkerOptions = pdfjsLib.GlobalWorkerOptions || pdfJsModule.GlobalWorkerOptions;
      if (GlobalWorkerOptions) {
        GlobalWorkerOptions.workerSrc = PDFJS_CDN;
        console.log(`Using PDF.js worker from: ${PDFJS_CDN}`);
      } else {
        console.warn('GlobalWorkerOptions not available, trying alternative approach');
        // In some environments, we might need to disable workers completely
      }
    } catch (workerError) {
      console.warn('Error setting worker source, proceeding without worker:', workerError);
    }
    
    // Create a document loading task with worker options
    const loadingTask = getDocument({
      data: fileData,
      disableFontFace: true,
      useSystemFonts: true,
      useWorkerFetch: false, // Important for serverless
      isEvalSupported: false, // Important for serverless
      // Workaround for serverless - use if GlobalWorkerOptions unavailable
      ...(typeof (pdfjsLib.GlobalWorkerOptions || pdfJsModule.GlobalWorkerOptions) === 'undefined' ? 
        { disableWorker: true } : {}),
      // CMap options
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
    
    return standardText.trim();
  } catch (error) {
    console.error('Error in worker-based extraction:', error);
    throw error;
  }
}

// Helper function to get PDF.js version information
async function getPdfJsVersion(): Promise<string> {
  try {
    const pdfJsModule = await import('pdfjs-dist');
    const pdfjsLib = pdfJsModule.default || pdfJsModule;
    
    // Try multiple ways to get the version
    const version = pdfjsLib.version || pdfJsModule.version;
    
    if (version) {
      return version;
    }
    
    // If version isn't directly available, log the structure to help debug
    return `Version not directly available. Available properties: ${Object.keys(pdfJsModule).join(', ')}`;
  } catch (e) {
    return `Error getting version: ${e instanceof Error ? e.message : 'Unknown error'}`;
  }
}

// Main extraction function that tries multiple methods
async function extractTextFromPDF(fileData: Uint8Array): Promise<{
  workerFreeText: string | null;
  workerBasedText: string | null;
  version: string;
  errors: string[];
}> {
  const result = {
    workerFreeText: null as string | null,
    workerBasedText: null as string | null,
    version: await getPdfJsVersion(),
    errors: [] as string[]
  };
  
  // Test worker-free extraction (primary for serverless)
  try {
    result.workerFreeText = await extractTextWithoutWorker(fileData);
    console.log(`Worker-free extraction completed with ${result.workerFreeText?.length || 0} characters`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    result.errors.push(`Worker-free extraction error: ${message}`);
    console.error('Worker-free extraction failed:', error);
  }
  
  // Test worker-based extraction
  try {
    result.workerBasedText = await extractTextWithWorker(fileData);
    console.log(`Worker-based extraction completed with ${result.workerBasedText?.length || 0} characters`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    result.errors.push(`Worker-based extraction error: ${message}`);
    console.error('Worker-based extraction failed:', error);
  }
  
  return result;
}

export async function POST(req: NextRequest) {
  try {
    console.log('PDF test extraction request received');
    
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

    // Log environment information
    console.log(`Node environment: ${process.env.NODE_ENV}`);
    console.log(`PDF.js version: ${await getPdfJsVersion()}`);

    const arrayBuffer = await file.arrayBuffer();
    const fileData = new Uint8Array(arrayBuffer);
    console.log(`File buffer created, length: ${fileData.length} bytes`);

    // Test both extraction methods
    console.log('Testing PDF.js extraction methods...');
    const extractionResults = await extractTextFromPDF(fileData);

    // Return detailed diagnostic information
    return new Response(JSON.stringify({
      status: 'ok',
      diagnostics: {
        environment: process.env.NODE_ENV,
        pdfjs_version: extractionResults.version,
        file_info: {
          name: file.name,
          size: file.size,
          type: file.type
        },
        worker_free_extraction: {
          success: !!extractionResults.workerFreeText,
          text_length: extractionResults.workerFreeText?.length || 0,
          text_sample: extractionResults.workerFreeText?.substring(0, 200) + '...' || ''
        },
        worker_based_extraction: {
          success: !!extractionResults.workerBasedText,
          text_length: extractionResults.workerBasedText?.length || 0,
          text_sample: extractionResults.workerBasedText?.substring(0, 200) + '...' || ''
        },
        errors: extractionResults.errors
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in PDF test extraction:', error);
    
    // Return error details
    return new Response(JSON.stringify({ 
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 