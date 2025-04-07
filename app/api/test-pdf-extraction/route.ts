import { NextRequest, NextResponse } from 'next/server';
import { improveGibberishText } from '../../utils/pdf-pattern-translator';
import { extractTextFromPDF as mainExtractor, fallbackTextExtraction } from '../../utils/pdf-extractor';

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

// Add extraction result interface
interface ExtractedPdfResult {
  workerFreeText: string | null;
  workerBasedText: string | null;
  version: string;
  errors: string[];
  warnings: string[];
  method?: string;
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
    
    // First try using the main extraction method
    try {
      const extractionResult = await mainExtractor(fileData);
      if (extractionResult && extractionResult.text && extractionResult.text.length > 0) {
        console.log(`Using main pdf-extractor.ts with method: ${extractionResult.method}`);
        return extractionResult.text;
      }
    } catch (error) {
      console.log('Main extractor failed, falling back to local implementation');
    }
    
    // If that fails, use the imported fallbackTextExtraction
    return await fallbackTextExtraction(fileData, true);
  } catch (error) {
    console.error('Error in worker-free extraction:', error);
    throw error; // Let the caller handle this
  }
}

// Helper function to get PDF.js version information
async function getPdfJsVersion(): Promise<string> {
  try {
    return "Using optimized extraction with pattern translation";
  } catch (e) {
    return `Error getting version: ${e instanceof Error ? e.message : 'Unknown error'}`;
  }
}

// Main extraction function that tries multiple methods
async function extractTextFromPDF(fileData: Uint8Array): Promise<ExtractedPdfResult> {
  const result: ExtractedPdfResult = {
    workerFreeText: null,
    workerBasedText: null,
    version: await getPdfJsVersion(),
    errors: [],
    warnings: [],
    method: undefined
  };
  
  // Test worker-free extraction (primary for serverless)
  try {
    result.workerFreeText = await extractTextWithoutWorker(fileData);
    console.log(`Text extraction completed with ${result.workerFreeText?.length || 0} characters`);
    
    // Try to detect if pattern translation was used
    if (result.workerFreeText && 
        (result.workerFreeText.includes('EDUCATION:') || 
         result.workerFreeText.includes('SKILLS:') || 
         result.workerFreeText.includes('EXPERIENCE:')) &&
        !/[A-Z]\s[A-Z]\s[A-Z]\s[A-Z]/.test(result.workerFreeText)) {
      result.method = 'pattern-translated';
    } else {
      result.method = 'standard';
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    result.errors.push(`Text extraction error: ${message}`);
    console.error('Text extraction failed:', error);
  }
  
  // Skip worker-based extraction as it causes too many issues
  result.workerBasedText = "Worker-based extraction disabled to avoid build issues";
  
  return result;
}

export async function POST(request: NextRequest) {
  try {
    // Check content type
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Invalid content type. Expected multipart/form-data' },
        { status: 400 }
      );
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    const fileType = file.type;
    if (fileType !== 'application/pdf') {
      return NextResponse.json(
        { error: `Invalid file type: ${fileType}. Only PDF files are supported.` },
        { status: 400 }
      );
    }

    // Get file contents as array buffer
    const arrayBuffer = await file.arrayBuffer();
    const pdfData = new Uint8Array(arrayBuffer);

    // Extract text using enhanced extraction
    let extractedText = '';
    try {
      console.log('Starting text extraction process...');
      // Use maximum extraction to get as much text as possible
      extractedText = await fallbackTextExtraction(pdfData, true);
      
      // Check if the extraction worked properly
      if (!extractedText || extractedText.length < 100) {
        console.warn('Initial extraction produced insufficient text, trying fallback with pattern translation...');
        // Try one more time with raw extraction and manual pattern translation
        const rawText = new TextDecoder().decode(pdfData);
        extractedText = improveGibberishText(rawText);
      }
      
      // Final validation to ensure we're not returning raw PDF data
      if (extractedText.startsWith('%PDF-') || 
          extractedText.includes('endobj') ||
          extractedText.includes('/Type /Page')) {
        console.error('Extraction returned raw PDF data - running text filtering');
        // Run simple text extraction to get readable content
        extractedText = filterReadableText(extractedText);
      }

      console.log(`Extracted ${extractedText.length} characters from PDF`);
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      return NextResponse.json(
        { error: 'Failed to extract text from PDF', details: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Text extracted successfully',
      text: extractedText,
      charCount: extractedText.length,
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing the request', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

/**
 * Last resort function to filter out obvious PDF syntax and extract only readable text
 */
function filterReadableText(pdfText: string): string {
  // If we have a proper text extraction, return it
  if (!pdfText.includes('obj') && !pdfText.includes('endobj') && !pdfText.startsWith('%PDF-')) {
    return pdfText;
  }
  
  console.log('Using emergency text filtering for PDF syntax...');
  
  // Extract all text content that appears to be human-readable
  const textFragments: string[] = [];
  
  // Extract strings in parentheses that look like text
  const parenthesesRegex = /\(([^)]{3,})\)/g;
  let match;
  while ((match = parenthesesRegex.exec(pdfText)) !== null) {
    const content = match[1];
    // Only keep strings that look like actual text content
    if (content.length > 3 && 
        /[A-Za-z]{2,}/.test(content) && // Has at least 2 letters
        !/^[\d\s.,-]+$/.test(content) && // Not just numbers and separators
        !/obj|endobj|stream|endstream|xref|startxref/.test(content)) { // Not PDF syntax
      textFragments.push(content);
    }
  }
  
  // Extract words that might be human-readable text outside parentheses
  // (for certain PDF formats this works better)
  const words = pdfText.split(/\s+/);
  const textWords = words.filter(word => {
    // Keep words that look like real words
    return word.length > 3 && 
           /^[A-Za-z]+$/.test(word) && // Only letters
           !/obj|endobj|stream|xref|startxref|TJ|BT|ET/.test(word); // Not PDF operators
  });
  
  if (textWords.length > 50) {
    textFragments.push(textWords.join(' '));
  }
  
  // Look for lines that look like they might contain meaningful text
  const lines = pdfText.split('\n');
  for (const line of lines) {
    // Only consider lines with enough length and letter ratio to be text
    if (line.length > 20 && !/^[\d\s.,-\/%]+$/.test(line)) {
      const letterCount = (line.match(/[A-Za-z]/g) || []).length;
      const letterRatio = letterCount / line.length;
      
      // Lines with high letter ratio might be real text
      if (letterRatio > 0.5 && !/obj|endobj|stream|endstream|xref|startxref/.test(line)) {
        textFragments.push(line);
      }
    }
  }
  
  // Join all text fragments
  let filteredText = textFragments.join('\n');
  
  // Clean up the text
  filteredText = filteredText
    // Convert octal escapes (common in PDFs)
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
    // Remove other escape characters
    .replace(/\\\\/g, '\\')
    // Remove PDF operators sometimes mixed with text
    .replace(/(\s|^)(Tj|TJ|Tf|Td|TD|T\*|Tm|Tc|Tw|Tz|BT|ET|cm|gs)(\s|$)/g, ' ')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    // Fix common PDF formatting issues
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between lowercase and uppercase
    // Remove control characters
    .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim();
  
  // If we have enough text to be meaningful, return it
  if (filteredText.length > 100) {
    console.log(`Filtered ${filteredText.length} characters of readable text from PDF`);
    return filteredText;
  }
  
  // If we couldn't extract anything useful
  return "Could not extract readable text from this PDF. The file may contain scanned images or be corrupt.";
} 