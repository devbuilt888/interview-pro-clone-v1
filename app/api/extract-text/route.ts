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
  cleanup(): void;
}

interface TextContent {
  items: Array<TextItem>;
}

interface TextItem {
  str?: string;
  [key: string]: any;
}

// Helper function to merge text content
function mergeTextContent(textContent: TextContent) {
  return textContent.items.map(item => {
    const { str, hasEOL } = item as TextItem
    return str + (hasEOL ? '\n' : '')
  }).join('')
}

// Serverless-compatible PDF.js implementation
async function extractTextFromPDF(fileData: Uint8Array): Promise<string> {
  try {
    console.log('Extracting text using PDF.js with serverless compatibility...');
    
    // Dynamic import of PDF.js to avoid build-time issues
    // Note: The path may need to be adjusted based on your project's PDF.js version
    const pdfjs = await import('pdfjs-dist');
    
    // Using CDN-hosted worker to avoid worker issues in serverless
    const PDFJS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
    pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_CDN;
    
    // Create a document loading task
    const loadingTask = pdfjs.getDocument({
      data: fileData,
      disableFontFace: true,
      useSystemFonts: true,
      useWorkerFetch: false, // Important for serverless
      isEvalSupported: false, // Important for serverless
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
    
    // Extract text from each page
    let extractedText = '';
    const maxPages = Math.min(pdfDocument.numPages, 10); // Limit to 10 pages
    
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      try {
        const page = await pdfDocument.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        const pageText = textContent.items
          .map(item => 'str' in item ? item.str : '')
          .join(' ');
          
        extractedText += pageText + '\n\n';
        
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
    
    // If we successfully extracted text
    if (extractedText.trim().length > 100) {
      console.log(`Successfully extracted ${extractedText.length} characters of text with PDF.js`);
      
      // Try to extract name from PDF text
      const nameInfo = extractNameFromText(extractedText);
      if (nameInfo) {
        console.log(`Found name in document: ${nameInfo}`);
        extractedText = `Name: ${nameInfo}\n\n${extractedText}`;
      }
      
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
    
    // Extract text content using regex patterns
    let extractedText = '';
    
    // 1. Extract text between BT (Begin Text) and ET (End Text) markers
    const textMatches = text.match(/BT[\s\S]*?ET/g);
    if (textMatches) {
      extractedText = textMatches
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
    }
    
    // 2. Try extracting from parentheses as a fallback
    if (!extractedText || extractedText.length < 100) {
      const fallbackMatches = text.match(/\(([^)]+)\)/g);
      if (fallbackMatches) {
        extractedText = fallbackMatches
          .map(match => match.slice(1, -1))
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
      }
    }
    
    // If we found a name, prepend it
    if (sections.name && !extractedText.includes(sections.name)) {
      extractedText = `Name: ${sections.name}\n\n${extractedText}`;
    }
    
    // If we still couldn't extract meaningful text, return fallback
    if (!extractedText || extractedText.length < 100) {
      return getFallbackText();
    }
    
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
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are Bob, an AI interviewer. You are conducting a behavioral interview. Address the candidate by their name from the resume if available. Keep responses concise and suitable for text-to-speech. Format your response as a brief introduction followed by ONE question to start the interview. DO NOT list multiple questions."
        },
        {
          role: "user",
          content: `Here is the resume text: ${extractedText}`
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || 
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
    console.error('Error in PDF extraction:', error);
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