import { NextResponse, NextRequest } from 'next/server';
import { extractTextFromPDF, getPdfJsVersion } from '../../utils/pdf-extractor';

/**
 * Test endpoint to verify the PDF extraction flow prioritizes 
 * worker-free extraction while maintaining current functionality
 */
export async function POST(req: NextRequest) {
  try {
    console.log('PDF flow test request received');
    
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
    console.log('Testing updated extraction flow...');
    const extractionResult = await extractTextFromPDF(fileData);
    console.log(`Extraction method used: ${extractionResult.method}`);
    console.log(`Extracted text length: ${extractionResult.text.length} characters`);
    
    // Return the test results
    return new Response(JSON.stringify({ 
      status: 'ok',
      method: extractionResult.method,
      text_length: extractionResult.text.length,
      text_sample: extractionResult.text.substring(0, 300) + '...',
      warnings: extractionResult.warnings || [],
      pdfjs_version: await getPdfJsVersion()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    // Enhanced error logging
    console.error('Error in PDF extraction test:', error);
    
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