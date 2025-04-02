// import formidable from "formidable";
import { NextResponse, NextRequest } from 'next/server';

// Import types separately to avoid build issues
import type { TextContent, TextItem } from 'pdfjs-dist/types/src/display/api';

function mergeTextContent(textContent: TextContent) {
  return textContent.items.map(item => {
    const { str, hasEOL } = item as TextItem
    return str + (hasEOL ? '\n' : '')
  }).join('')
}

async function fetchOpenAIResponse(extractedText: string, requestUrl: string) {
  // Construct absolute URL for server-side fetching
  let baseUrl = requestUrl;
  
  // Extract origin from the request URL (e.g., https://interview-pro-clone-v1.vercel.app)
  try {
    const url = new URL(requestUrl);
    baseUrl = url.origin;
  } catch (error) {
    console.error('Error parsing URL:', error);
    // Fallback - use the request URL as is
  }
  
  console.log(`Using base URL: ${baseUrl}`);
  
  const response = await fetch(`${baseUrl}/api/openai-gpt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages: [{role: 'user', content: `Here is my resume:
------
${extractedText}` }]}),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API request failed with status: ${response.status}`);
  }

  if (!response.body) {
    throw new Error('No response body');
  }

  const reader = response.body.getReader();
  let chunks = [];

  // Read the stream
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    chunks.push(value);
  }

  // Convert the Uint8Array chunks to string
  const decoder = new TextDecoder('utf-8');
  const text = chunks.map(chunk => decoder.decode(chunk)).join('');

  return text;
}

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405,
    });
  }

  try {
    console.log('PDF extraction request received');
    const formData = await req.formData();
    const [ file ] = formData.getAll('file') as unknown as File[];

    if (!file) {
      console.error('No file uploaded');
      return new Response('No file uploaded', {
        status: 400,
      });
    }

    console.log(`File received: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);
    
    const fileBuffer = await file.arrayBuffer();
    const fileData = new Uint8Array(fileBuffer);
    console.log(`File buffer created, length: ${fileData.length} bytes`);

    // Import PDF.js
    console.log('Importing PDF.js');
    const pdfjs = await import('pdfjs-dist/build/pdf.min.mjs');
    
    // Disable worker for Vercel serverless environment
    console.log('Disabling PDF.js worker for serverless environment');
    // @ts-ignore - Setting to empty string disables worker
    pdfjs.GlobalWorkerOptions.workerSrc = '';

    // Load the PDF from the buffer
    console.log('Loading PDF from buffer without worker');
    const loadingTask = pdfjs.getDocument({ 
      data: fileData,
      // @ts-ignore - These options help in serverless environment
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: false
    });
    
    const pdf = await loadingTask.promise;
    console.log(`PDF loaded with ${pdf.numPages} pages`);

    if (!pdf.numPages) {
      console.warn('PDF has no pages');
      return new Response(JSON.stringify({ status: 'ok', text: null }), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    console.log('Getting text content from first page');
    const page = await pdf.getPage(1);
    const textContent = await page.getTextContent();
    const extractedText = mergeTextContent(textContent);
    console.log(`Extracted text length: ${extractedText.length} characters`);

    // Send extracted resume text to openAI API to get the first question from the AI
    console.log('Sending text to OpenAI');
    const openAIResponse = await fetchOpenAIResponse(extractedText, req.url);
    console.log('Received response from OpenAI');

    return new Response(JSON.stringify({ status: 'ok', text: openAIResponse }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    console.error('Error in PDF extraction:', err);
    return new Response(JSON.stringify({ 
      status: 'error', 
      error: String(err),
      stack: err instanceof Error ? err.stack : undefined 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}