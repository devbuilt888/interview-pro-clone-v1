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
    
    // Use text-based extraction instead since we're having issues with the module
    return await fallbackTextExtraction(fileData);
  } catch (error) {
    console.error('Error in worker-free extraction:', error);
    throw error; // Let the caller handle this
  }
}

// Fallback text extraction using pure text processing
async function fallbackTextExtraction(fileData: Uint8Array): Promise<string> {
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

// Helper function to get PDF.js version information
async function getPdfJsVersion(): Promise<string> {
  try {
    return "Using fallback text extraction - PDF.js disabled";
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
    console.log(`Text extraction completed with ${result.workerFreeText?.length || 0} characters`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    result.errors.push(`Text extraction error: ${message}`);
    console.error('Text extraction failed:', error);
  }
  
  // Skip worker-based extraction as it causes too many issues
  result.workerBasedText = "Worker-based extraction disabled to avoid build issues";
  
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
    console.log(`Using fallback extraction`);

    const arrayBuffer = await file.arrayBuffer();
    const fileData = new Uint8Array(arrayBuffer);
    console.log(`File buffer created, length: ${fileData.length} bytes`);

    // Test text extraction methods
    console.log('Testing text extraction methods...');
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
          success: false,
          text_length: 0,
          text_sample: "Worker-based extraction disabled to avoid build issues"
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