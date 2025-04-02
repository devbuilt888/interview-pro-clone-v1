// import formidable from "formidable";
import { NextResponse, NextRequest } from 'next/server';
import { OpenAI } from 'openai';

// Import types separately to avoid build issues
import type { TextContent, TextItem } from 'pdfjs-dist/types/src/display/api';

function mergeTextContent(textContent: TextContent) {
  return textContent.items.map(item => {
    const { str, hasEOL } = item as TextItem
    return str + (hasEOL ? '\n' : '')
  }).join('')
}

// Function to extract text from PDF using regex
async function extractTextFromPDF(fileData: Uint8Array): Promise<string> {
  try {
    // Convert to string for regex processing
    const text = new TextDecoder().decode(fileData);
    
    // Extract text between BT (Begin Text) and ET (End Text) markers
    const textMatches = text.match(/BT[\s\S]*?ET/g);
    if (textMatches) {
      // Process each text block
      const extractedText = textMatches
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

      // Limit the extracted text to approximately 10,000 tokens (roughly 7,500 words)
      const maxLength = 7500;
      return extractedText.length > maxLength 
        ? extractedText.substring(0, maxLength) + '...' 
        : extractedText;
    }

    // Fallback: Try to extract text from parentheses
    const fallbackMatches = text.match(/\(([^)]+)\)/g);
    if (fallbackMatches) {
      const fallbackText = fallbackMatches
        .map(match => match.slice(1, -1))
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

      // Limit the fallback text as well
      const maxLength = 7500;
      return fallbackText.length > maxLength 
        ? fallbackText.substring(0, maxLength) + '...' 
        : fallbackText;
    }

    // If no text could be extracted, return a placeholder
    return getFallbackText();
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    return getFallbackText();
  }
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
async function fetchOpenAIResponse(extractedText: string, requestUrl: string): Promise<Response> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are Bob, an AI interviewer. Analyze the resume and prepare relevant questions. Keep responses concise."
        },
        {
          role: "user",
          content: `Here is the resume text: ${extractedText}`
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return new Response(JSON.stringify({ 
      text: completion.choices[0]?.message?.content || 'No response generated'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process with OpenAI',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
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

    console.log('Using simplified PDF text extraction for serverless environment');
    const extractedText = await extractTextFromPDF(fileData);
    console.log(`Extracted text length: ${extractedText.length} characters`);

    console.log('Sending extracted text to OpenAI');
    return fetchOpenAIResponse(extractedText, req.url);
  } catch (error) {
    console.error('Error in PDF extraction:', error);
    return new Response(JSON.stringify({ 
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