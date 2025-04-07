import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * API endpoint to extract text from PDFs using OpenAI GPT-4 Vision
 */
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

    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    // Get file contents as array buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Convert to base64 for OpenAI API
    const base64Pdf = buffer.toString('base64');
    
    // Send to OpenAI GPT-4 Vision
    try {
      console.log('Sending PDF to OpenAI GPT-4 Vision for text extraction...');
      
      const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              { 
                type: "text", 
                text: "Extract all text from this PDF resume, preserving formatting where possible. Maintain section headers, bullet points, and organizational structure. Focus on extracting name, contact info, work experience, skills, and education." 
              },
              { 
                type: "image_url", 
                image_url: {
                  url: `data:application/pdf;base64,${base64Pdf}`,
                  detail: "high"
                }
              }
            ]
          }
        ],
        max_tokens: 4096
      });
      
      const extractedText = response.choices[0]?.message?.content || "";
      
      if (!extractedText || extractedText.length < 50) {
        return NextResponse.json(
          { error: 'Failed to extract meaningful text from the PDF' },
          { status: 500 }
        );
      }
      
      console.log(`GPT-4 Vision extracted ${extractedText.length} characters`);
      
      return NextResponse.json({
        message: 'Text extracted successfully with GPT-4 Vision',
        text: extractedText,
        charCount: extractedText.length,
        method: 'gpt4-vision'
      });
      
    } catch (aiError) {
      console.error('Error calling OpenAI API:', aiError);
      return NextResponse.json(
        { 
          error: 'Failed to process PDF with GPT-4 Vision', 
          details: aiError instanceof Error ? aiError.message : String(aiError) 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing the request', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 