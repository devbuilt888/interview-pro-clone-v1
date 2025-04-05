/**
 * PDF Text Extraction API
 * 
 * This API endpoint extracts text from uploaded PDFs (resumes),
 * structures the data, and generates an initial greeting using OpenAI.
 */

import { NextResponse, NextRequest } from 'next/server';

// Import from utility modules
import { extractTextFromPDF, getPdfJsVersion } from '../../utils/pdf-extractor';
import { parseResumeText } from '../../utils/resume-parser';
import { generateInitialGreeting } from '../../utils/openai-service';

/**
 * POST handler for PDF text extraction
 */
export async function POST(req: NextRequest) {
  try {
    console.log('PDF extraction request received');
    console.log(`Environment: ${process.env.NODE_ENV}`);
    
    // Parse form data from request
    const formData = await req.formData();
    const file = formData.get('file') as File;

    // Validate file presence
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Log file information
    console.log(`File received: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);
    console.log(`Node environment: ${process.env.NODE_ENV}`);
    console.log(`PDF.js version: ${await getPdfJsVersion()}`);

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileData = new Uint8Array(arrayBuffer);
    console.log(`File buffer created, length: ${fileData.length} bytes`);

    // Extract text from PDF
    console.log('Extracting text from PDF...');
    const extractionResult = await extractTextFromPDF(fileData);
    console.log(`Extraction method used: ${extractionResult.method}`);
    console.log(`Extracted text length: ${extractionResult.text.length} characters`);
    console.log(`Text sample: ${extractionResult.text.substring(0, 100)}...`);
    
    // Log any warnings from extraction process
    if (extractionResult.warnings && extractionResult.warnings.length > 0) {
      console.warn('PDF extraction warnings:', extractionResult.warnings);
    }

    // Parse extracted text into structured resume data
    const resumeData = parseResumeText(extractionResult.text);
    
    // Log parsed resume sections
    console.log(`Extracted resume data sections: ${Object.keys(resumeData).filter(k => k !== 'rawText').join(', ')}`);
    
    if (resumeData.name) {
      console.log(`Extracted name: ${resumeData.name}`);
    }
    
    if (resumeData.skills.length > 0) {
      console.log(`Extracted skills: ${resumeData.skills.join(', ')}`);
    }
    
    if (resumeData.summary) {
      console.log(`Summary found with ${resumeData.summary.length} characters`);
    } else {
      console.log('No summary extracted from text');
    }

    // Generate initial message using OpenAI
    console.log('Sending extracted text to OpenAI');
    const initialMessage = await generateInitialGreeting(resumeData);
    console.log('Received response from OpenAI');
    console.log(`Initial message sample: ${initialMessage.substring(0, 100)}...`);

    // Return the response
    return new Response(JSON.stringify({ 
      status: 'ok',
      text: initialMessage,
      method: extractionResult.method,
      textLength: extractionResult.text.length
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    // Enhanced error logging
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

    // Return error response
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