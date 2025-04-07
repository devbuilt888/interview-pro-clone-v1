import { NextRequest, NextResponse } from 'next/server';
import { improveGibberishText } from '../../utils/pdf-pattern-translator';
import { extractTextFromPDF as mainExtractor } from '../../utils/pdf-extractor';

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
    
    // If that fails, use our local fallback
    return await fallbackTextExtraction(fileData);
  } catch (error) {
    console.error('Error in worker-free extraction:', error);
    throw error; // Let the caller handle this
  }
}

// Fallback text extraction using pure text processing
async function fallbackTextExtraction(fileData: Uint8Array): Promise<string> {
  try {
    console.log('Using enhanced fallback text extraction with NO truncation...');
    const text = new TextDecoder().decode(fileData);
    
    // First try to improve the text using pattern translation
    try {
      const translatedText = improveGibberishText(text);
      if (translatedText && translatedText.length > 100) {
        console.log(`Successfully applied pattern translation in fallback extraction with ${translatedText.length} characters`);
        return translatedText;
      }
    } catch (translationError) {
      console.warn('Pattern translation failed, continuing with regular extraction', translationError);
    }
    
    // Extract text content using multiple regex patterns for more robust extraction
    const extractedTexts: string[] = [];
    
    // Try multiple extraction approaches and COMBINE results
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
      },
      
      // 5. Special extractor for Adobe repeated word patterns
      () => {
        console.log('Trying repeated word pattern extraction...');
        const repeatedWordMatches = text.match(/([A-Z][a-z]+)(?:\s+\1){2,}/g);
        if (!repeatedWordMatches || repeatedWordMatches.length === 0) return '';
        
        const detectedWords = new Set<string>();
        repeatedWordMatches.forEach(match => {
          const word = match.trim().split(/\s+/)[0];
          if (word && word.length > 2) {
            detectedWords.add(word);
          }
        });
        
        return Array.from(detectedWords).join('\n');
      },
      
      // 6. Extract lines with likely job titles
      () => {
        console.log('Trying job title extraction...');
        const jobTitleKeywords = [
          'Senior', 'Lead', 'Software', 'Developer', 'Engineer', 'Full-stack',
          'Front-end', 'Back-end', 'React', 'Angular', 'Vue', 'Node', 'Python',
          'Java', 'C\\+\\+', 'Architect', 'Manager', 'Director', 'VP', 'Head',
          'Principal', 'Staff', 'Technical', 'Designer'
        ];
        
        const titleRegex = new RegExp(`((?:^|\\n)(?:[^\\n]{0,50})(?:${jobTitleKeywords.join('|')})(?:[^\\n]{0,50})(?:\\n|$))`, 'g');
        const titleMatches = text.match(titleRegex);
        if (!titleMatches) return '';
        
        return titleMatches
          .map(m => m.trim())
          .filter(m => m.length > 5)
          .join('\n');
      }
    ];
    
    // Run ALL approaches and combine their results for maximum extraction
    console.log('Combining results from all extraction methods for maximum text coverage');
    for (const approach of approaches) {
      try {
        const result = approach();
        if (result && result.length > 10) {
          extractedTexts.push(result);
        }
      } catch (error) {
        console.warn('Extraction approach error:', error);
        // Continue with next approach
      }
    }
    
    const combinedText = extractedTexts.join('\n\n');
    console.log(`Combined fallback extraction got ${combinedText.length} characters`);
    
    // Try to clean up the text
    let extractedText = combinedText
      .replace(/[^\x20-\x7E\r\n]/g, ' ') // Remove non-printable chars
      .replace(/\s+/g, ' ')              // Normalize whitespace
      .trim();
    
    // If we got text but still have repeated patterns, try pattern translation again
    if (extractedText.length > 10 && /([A-Z][a-z]+)(?:\s+\1){2,}/g.test(extractedText)) {
      console.log('Detected repeated words pattern in extracted text, applying pattern translation');
      try {
        const translatedText = improveGibberishText(extractedText);
        if (translatedText && translatedText.length > extractedText.length * 0.7) {
          extractedText = translatedText;
        }
      } catch (error) {
        console.warn('Final pattern translation failed:', error);
      }
    }
    
    return extractedText;
  } catch (error) {
    console.error('Error in fallback extraction:', error);
    return "Failed to extract text from PDF. The file may be corrupt or password protected.";
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
    console.log(`Using enhanced extraction with pattern translation`);

    const arrayBuffer = await file.arrayBuffer();
    const fileData = new Uint8Array(arrayBuffer);
    console.log(`File buffer created, length: ${fileData.length} bytes`);

    // Test text extraction methods
    console.log('Testing text extraction methods...');
    const extractionResults = await extractTextFromPDF(fileData);

    // Get information about pattern translation if used
    const patternTranslationInfo = extractionResults.method === 'pattern-translated' 
      ? {
          used: true,
          description: "Enhanced pattern translation was applied to convert gibberish to meaningful text."
        }
      : { 
          used: false 
        };

    // Determine how much text to show in the sample
    // Return the complete extracted text without truncation
    const fullText = extractionResults.workerFreeText || '';

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
          text_sample: fullText,
          method: extractionResults.method || 'standard',
          pattern_translation: patternTranslationInfo
        },
        worker_based_extraction: {
          success: false,
          text_length: 0,
          text_sample: "Worker-based extraction disabled to avoid build issues"
        },
        errors: extractionResults.errors,
        warnings: extractionResults.warnings
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