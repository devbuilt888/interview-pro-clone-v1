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

/**
 * Specialized PDF text extraction with better Latin1 encoding handling
 */
async function extractTextWithLatinEncoding(pdfData: Uint8Array): Promise<string> {
  try {
    console.log('Using Latin1 encoding for PDF extraction (better for binary data)...');
    
    // Use Latin1 encoding to preserve byte values during decoding
    const rawPdfText = new TextDecoder('latin1').decode(pdfData);
    
    // Extract readable text content directly from the raw PDF data
    const extractedText = extractReadableTextFromPdf(rawPdfText);
    
    // Apply pattern translation to improve the extracted text
    if (extractedText && extractedText.length > 100) {
      try {
        console.log('Applying pattern translation to extracted text...');
        const translatedText = improveGibberishText(extractedText);
        
        if (translatedText && translatedText.length > 100) {
          return translatedText;
        }
      } catch (translationError) {
        console.warn('Pattern translation failed:', translationError);
      }
    }
    
    // Return the extracted text even if translation failed
    return extractedText;
  } catch (error) {
    console.error('Error in Latin1 extraction:', error);
    throw error;
  }
}

/**
 * Extract readable text content from raw PDF data
 */
function extractReadableTextFromPdf(pdfText: string): string {
  const textFragments: string[] = [];
  
  // STEP 1: Extract text from parentheses (most reliable for PDFs)
  const parenthesesPattern = /\(([^\\\(\)]{3,})\)/g;
  let match;
  
  while ((match = parenthesesPattern.exec(pdfText)) !== null) {
    const content = match[1];
    if (content.length > 3 && 
        /[a-zA-Z]{2,}/.test(content) && 
        !/^[\d\s.,-]+$/.test(content)) {
      textFragments.push(content.trim());
    }
  }
  
  // STEP 2: Extract text from text operators (BT/ET blocks)
  const btEtPattern = /BT\s*([\s\S]*?)\s*ET/g;
  
  while ((match = btEtPattern.exec(pdfText)) !== null) {
    const textBlock = match[1];
    
    // Look for Tj operators (simpler text placement)
    const tjPattern = /\(\s*([^\)]+)\s*\)\s*Tj/g;
    let tjMatch;
    
    while ((tjMatch = tjPattern.exec(textBlock)) !== null) {
      const content = tjMatch[1];
      if (content.length > 0 && /[a-zA-Z]{2,}/.test(content)) {
        textFragments.push(content.trim());
      }
    }
    
    // Look for TJ arrays (more complex text placement)
    const tjArrayPattern = /\[(.*?)\]\s*TJ/g;
    let tjArrayMatch;
    
    while ((tjArrayMatch = tjArrayPattern.exec(textBlock)) !== null) {
      const tjContent = tjArrayMatch[1];
      
      // Extract strings from the TJ array
      const stringPattern = /\(\s*([^\)]*)\s*\)/g;
      let stringMatch;
      
      const blockParts: string[] = [];
      
      while ((stringMatch = stringPattern.exec(tjContent)) !== null) {
        const content = stringMatch[1];
        if (content.length > 0 && !/^\d+$/.test(content)) {
          blockParts.push(content);
        }
      }
      
      if (blockParts.length > 0) {
        textFragments.push(blockParts.join(' '));
      }
    }
  }
  
  // STEP 3: Extract job titles and education keywords (these are likely to be real text)
  const jobTitlePattern = /(?:Senior|Lead|Principal|Staff|Junior|Developer|Engineer|Architect|Manager|Director)/gi;
  const jobMatches = pdfText.match(jobTitlePattern) || [];
  
  if (jobMatches.length > 5) {
    // If we find multiple job title keywords, extract surrounding text
    const jobContextPattern = /.{0,20}(?:Senior|Lead|Principal|Developer|Engineer|Architect).{0,20}/gi;
    let jobContextMatch;
    
    while ((jobContextMatch = jobContextPattern.exec(pdfText)) !== null) {
      const content = jobContextMatch[0];
      if (/[a-zA-Z]{5,}/.test(content)) {
        textFragments.push(content.trim());
      }
    }
  }
  
  // Join all text fragments and clean up
  let extractedText = textFragments.join(' ');
  
  // Clean up the text
  extractedText = extractedText
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
  
  return extractedText;
}

/**
 * Check if text contains binary data or raw PDF syntax
 */
function containsBinaryData(text: string): boolean {
  if (!text) return false;
  
  // Check for high concentration of non-printable characters
  const nonPrintableCount = (text.match(/[^\x20-\x7E\r\n\t]/g) || []).length;
  const binaryRatio = nonPrintableCount / text.length;
  
  // If more than 15% of characters are non-printable, it's likely binary
  if (binaryRatio > 0.15) return true;
  
  // Check for common PDF binary markers
  if (text.startsWith('%PDF-') && 
      (text.includes('stream') || 
       text.includes('endstream') || 
       text.includes('xref'))) {
    return true;
  }
  
  // Check for common PDF operators mixed with text
  const pdfOperatorCount = (text.match(/\/([A-Z][A-Za-z]*|[a-z]+)\s/g) || []).length;
  if (pdfOperatorCount > 50) return true;
  
  return false;
}

/**
 * Extract text directly from binary PDF data
 * This is an alternative approach to handling PDFs
 */
function extractTextFromBinaryPDF(pdfString: string): string {
  console.log('Using direct extraction from binary PDF data...');
  
  // Look for text between parentheses (common in PDFs)
  const textFragments: string[] = [];
  
  // 1. Extract strings in parentheses (most reliable for PDFs)
  const stringPattern = /\(([^\\\(\)]{3,})\)/g;
  let match;
  
  while ((match = stringPattern.exec(pdfString)) !== null) {
    const content = match[1];
    
    // Only keep strings that look like readable text
    if (content.length > 3 && 
        /[a-zA-Z]{2,}/.test(content) && 
        !/^[\d\s.,-]+$/.test(content)) {
      textFragments.push(content.trim());
    }
  }
  
  // 2. Extract text from BT/ET blocks (text operators)
  const btEtPattern = /BT\s*([\s\S]*?)\s*ET/g;
  
  while ((match = btEtPattern.exec(pdfString)) !== null) {
    const textBlock = match[1];
    
    // Extract strings from TJ operators
    const tjPattern = /\[(.*?)\]\s*TJ/g;
    let tjMatch;
    
    while ((tjMatch = tjPattern.exec(textBlock)) !== null) {
      const tjContent = tjMatch[1];
      
      // Extract strings from TJ content
      const blockStringPattern = /\(([^\\\(\)]*)\)/g;
      let stringMatch;
      
      const blockParts: string[] = [];
      
      while ((stringMatch = blockStringPattern.exec(tjContent)) !== null) {
        const content = stringMatch[1];
        
        // Skip empty or numeric-only strings
        if (content.length > 0 && !/^\d+$/.test(content)) {
          blockParts.push(content);
        }
      }
      
      if (blockParts.length > 0) {
        textFragments.push(blockParts.join(' '));
      }
    }
    
    // Also check for Tj operators (simpler text)
    const tjSinglePattern = /\(([^\\\(\)]*)\)\s*Tj/g;
    let tjSingleMatch;
    
    while ((tjSingleMatch = tjSinglePattern.exec(textBlock)) !== null) {
      const content = tjSingleMatch[1];
      
      // Skip empty or numeric-only strings
      if (content.length > 0 && !/^\d+$/.test(content)) {
        textFragments.push(content);
      }
    }
  }
  
  // Join all fragments
  let extractedText = textFragments.join(' ');
  
  // Basic cleanup
  extractedText = extractedText
    // Convert octal escapes
    .replace(/\\(\d{3})/g, (_, octal) => String.fromCharCode(parseInt(octal, 8)))
    // Remove PDF-specific sequences
    .replace(/\\[nrt]/g, ' ')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
  
  // If we have enough text to be meaningful, try to apply pattern translation
  if (extractedText.length > 100) {
    try {
      const translatedText = improveGibberishText(extractedText);
      if (translatedText && translatedText.length > 50) {
        return translatedText;
      }
    } catch (error) {
      console.warn('Pattern translation failed on binary extraction:', error);
    }
  }
  
  return extractedText;
}

/**
 * Last resort function to filter out obvious PDF syntax and extract only readable text
 */
function filterReadableText(pdfText: string): string {
  // If we have a proper text extraction without binary data, return it
  if (!containsBinaryData(pdfText)) {
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
        !/obj|endobj|stream|xref|startxref/.test(content)) { // Not PDF syntax
      textFragments.push(content);
    }
  }
  
  // Extract words that might be human-readable text outside parentheses
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
  
  // Join all text fragments
  let filteredText = textFragments.join(' ');
  
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
  
  // If we have enough text to be meaningful, try pattern translation
  if (filteredText.length > 100) {
    try {
      console.log(`Filtered ${filteredText.length} characters of readable text - attempting pattern translation`);
      const translatedText = improveGibberishText(filteredText);
      if (translatedText && translatedText.length > 50) {
        return translatedText;
      }
    } catch (error) {
      console.warn('Pattern translation failed on filtered text:', error);
    }
    return filteredText;
  }
  
  // If we couldn't extract anything useful
  return "Could not extract readable text from this PDF. The file may contain scanned images or be corrupt.";
}

/**
 * Extract and format tabular data from PDFs
 * This helps preserve structure of tables/lists in resumes
 */
function extractTabularData(pdfText: string): string[] {
  const tableRows: string[] = [];

  // Look for text that appears to be in tabular format
  // Common indicators: consistent indentation, date-like entries, bullet points
  
  // 1. Extract lines that appear to be date ranges (common in resumes)
  const dateRangePattern = /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\s*(?:-|to|–)\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|Present|Current)[a-z]*\s*\d{0,4}/gi;
  let match;
  
  while ((match = dateRangePattern.exec(pdfText)) !== null) {
    const dateRange = match[0];
    
    // Get surrounding context (likely job description)
    const startPos = Math.max(0, match.index - 100);
    const endPos = Math.min(pdfText.length, match.index + dateRange.length + 150);
    const context = pdfText.substring(startPos, endPos);
    
    // Format as structured data
    tableRows.push(`DATE: ${dateRange.trim()}`);
    
    // Try to extract company and title from surrounding context
    const companyMatch = /([A-Z][A-Za-z0-9\.\-&\s]{2,}?)(?:\s{2,}|\s+)(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i.exec(context);
    if (companyMatch && companyMatch[1]) {
      tableRows.push(`COMPANY: ${companyMatch[1].trim()}`);
    }
    
    const titleMatch = /(?:Senior|Lead|Staff|Principal|Junior|\w+)\s+(?:Developer|Engineer|Architect|Manager|Director|Designer)/i.exec(context);
    if (titleMatch) {
      tableRows.push(`POSITION: ${titleMatch[0].trim()}`);
    }
    
    tableRows.push(''); // Add a separator between entries
  }
  
  // 2. Extract bullet point lists (common in resume descriptions)
  const bulletPointPattern = /(?:^|\n)(?:\s*[\•\-\*\+\>\★]|\s*\d+\.)\s*([A-Z][^.\n]{10,}\.)/gm;
  
  while ((match = bulletPointPattern.exec(pdfText)) !== null) {
    if (match[1]) {
      tableRows.push(`• ${match[1].trim()}`);
    }
  }
  
  // 3. Look for education entries (school + degree)
  const educationPattern = /(?:University|College|Institute|School)[^,\n]{2,}(?:,|-)?\s*(?:[A-Za-z\s]{2,}|\d{4})/gi;
  
  while ((match = educationPattern.exec(pdfText)) !== null) {
    tableRows.push(`EDUCATION: ${match[0].trim()}`);
    
    // Try to find degree near the school name
    const degreePattern = /(?:Bachelor|Master|PhD|Doctor|BS|MS|BA|MBA|MD|JD|Ph\.D\.)[^,\n]{2,}(?:\d{4})?/i;
    const startPos = Math.max(0, match.index - 50);
    const endPos = Math.min(pdfText.length, match.index + match[0].length + 150);
    const context = pdfText.substring(startPos, endPos);
    
    const degreeMatch = degreePattern.exec(context);
    if (degreeMatch) {
      tableRows.push(`DEGREE: ${degreeMatch[0].trim()}`);
    }
    
    tableRows.push(''); // Add a separator
  }
  
  return tableRows;
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
    let structuredData: string[] = [];
    
    try {
      console.log('Starting text extraction process with Latin1 encoding...');
      
      // Try direct extraction with Latin1 encoding first
      // This works better for binary data than UTF-8
      const rawText = new TextDecoder('latin1').decode(pdfData);
      
      // Try to extract tabular/structured data first (for better resume parsing)
      structuredData = extractTabularData(rawText);
      
      // Extract text from parentheses (most common PDF text format)
      const textFragments: string[] = [];
      const parenthesesRegex = /\(([^)]{3,})\)/g;
      let match;
      
      while ((match = parenthesesRegex.exec(rawText)) !== null) {
        const content = match[1];
        // Only keep strings that look like actual text content
        if (content.length > 3 && 
            /[A-Za-z]{2,}/.test(content) && // Has at least 2 letters
            !/^[\d\s.,-]+$/.test(content) && // Not just numbers and separators
            !/obj|endobj|stream|endstream|xref|startxref/.test(content)) { // Not PDF syntax
          textFragments.push(content);
        }
      }
      
      // Extract text from BT/ET blocks (text operators)
      const btEtPattern = /BT\s*([\s\S]*?)\s*ET/g;
      while ((match = btEtPattern.exec(rawText)) !== null) {
        const textBlock = match[1];
        
        // Find text strings within the block
        const blockTextPattern = /\(([^)]+)\)/g;
        let blockMatch;
        
        while ((blockMatch = blockTextPattern.exec(textBlock)) !== null) {
          const content = blockMatch[1];
          if (content.length > 2 && /[A-Za-z]{2,}/.test(content)) {
            textFragments.push(content);
          }
        }
      }
      
      // If we found text, join it and clean it
      if (textFragments.length > 0) {
        let initialText = textFragments.join(' ');
        
        // Basic cleanup
        initialText = initialText
          // Convert octal escapes (common in PDFs)
          .replace(/\\(\d{3})/g, (_, octal) => String.fromCharCode(parseInt(octal, 8)))
          // Remove escape sequences
          .replace(/\\[\\'rnt]/g, ' ')
          // Normalize whitespace
          .replace(/\s+/g, ' ')
          .trim();
        
        // Try to apply pattern translation
        try {
          extractedText = improveGibberishText(initialText);
          console.log(`Latin1 extraction + pattern translation produced ${extractedText.length} characters`);
        } catch (translationError) {
          console.warn('Pattern translation failed, using basic extracted text');
          extractedText = initialText;
        }
      }
      
      // If direct extraction wasn't successful, try fallback
      if (!extractedText || extractedText.length < 100) {
        console.log('Latin1 extraction produced insufficient text, trying fallback...');
        extractedText = await fallbackTextExtraction(pdfData, true);
      }
      
      // Merge structured data with regular text if we found any
      if (structuredData.length > 0) {
        console.log(`Found ${structuredData.length} structured data elements`);
        extractedText = structuredData.join('\n') + '\n\n' + extractedText;
      }
      
      console.log(`Extracted ${extractedText?.length || 0} characters from PDF`);
      
      // If extraction failed completely, provide a helpful message
      if (!extractedText || extractedText.length < 50) {
        extractedText = "Could not extract readable text from this PDF. The file may be corrupt, password protected, or contain primarily scanned images.";
      }
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