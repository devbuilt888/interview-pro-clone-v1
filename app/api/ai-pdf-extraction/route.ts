import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import puppeteerCore from 'puppeteer-core';
import chromeLambda from 'chrome-aws-lambda';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// PDF size limit in bytes (20MB)
const MAX_PDF_SIZE = 20 * 1024 * 1024;

/**
 * Get Chrome executable path based on the environment
 */
async function getChromePath() {
  // Check if we're in a serverless environment (Vercel or AWS Lambda)
  if (process.env.AWS_REGION || process.env.VERCEL) {
    // Use chrome-aws-lambda's path
    return await chromeLambda.executablePath;
  }
  
  // For local development, detect the installed Chrome path based on OS
  if (process.platform === 'win32') {
    return 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  } else if (process.platform === 'linux') {
    return '/usr/bin/google-chrome';
  } else {
    return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  }
}

/**
 * Convert PDF to image using puppeteer-core with chrome-aws-lambda
 */
async function convertPdfToImage(pdfBuffer: Buffer): Promise<string> {
  try {
    console.log('Starting PDF conversion with puppeteer-core...');
    
    // Create a temporary directory for the PDF file
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pdf-'));
    const pdfPath = path.join(tempDir, 'document.pdf');
    const outputPath = path.join(tempDir, 'page.png');
    
    // Write the PDF buffer to a file
    fs.writeFileSync(pdfPath, pdfBuffer);
    
    // Configure browser options based on environment
    const isServerless = !!(process.env.AWS_REGION || process.env.VERCEL);
    const options = {
      args: chromeLambda.args,
      defaultViewport: { width: 1600, height: 1200, deviceScaleFactor: 2 },
      executablePath: await getChromePath(),
      headless: true,
      ignoreHTTPSErrors: true
    };
    
    // Launch a headless browser
    const browser = await puppeteerCore.launch(options);
    
    try {
      // Create a new page
      const page = await browser.newPage();
      
      // Navigate to the PDF file using file:// protocol
      await page.goto(`file://${pdfPath}`, {
        waitUntil: 'networkidle0',
        timeout: 60000
      });
      
      // Wait a moment for PDF to render
      await page.waitForTimeout(1000);
      
      // Take a screenshot
      await page.screenshot({ path: outputPath, fullPage: true });
      
      // Close the browser
      await browser.close();
      
      // Read the generated image
      if (fs.existsSync(outputPath)) {
        const imageBuffer = fs.readFileSync(outputPath);
        const base64Image = imageBuffer.toString('base64');
        
        // Clean up temporary files
        try {
          fs.unlinkSync(pdfPath);
          fs.unlinkSync(outputPath);
          fs.rmdirSync(tempDir);
        } catch (cleanupError) {
          console.error('Error cleaning up temporary files:', cleanupError);
        }
        
        return base64Image;
      } else {
        throw new Error('Image file was not created');
      }
    } finally {
      // Ensure browser is closed even if an error occurs
      if (browser) {
        await browser.close().catch(err => console.error('Error closing browser:', err));
      }
    }
  } catch (error) {
    console.error('Error converting PDF to image:', error);
    throw error;
  }
}

/**
 * API endpoint to extract text from PDFs using OpenAI GPT-4o Vision
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

    // Check file size
    if (file.size > MAX_PDF_SIZE) {
      return NextResponse.json(
        { error: `PDF file too large (${(file.size / (1024 * 1024)).toFixed(2)}MB). Maximum size is 20MB.` },
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
    const pdfBuffer = Buffer.from(arrayBuffer);
    
    console.log('Converting PDF to image using puppeteer-core...');
    
    try {
      // Convert PDF to image
      const imageBase64 = await convertPdfToImage(pdfBuffer);
      
      console.log('Successfully converted PDF to image');
      
      // Create content array for OpenAI API
      const content: any[] = [
        { 
          type: "text", 
          text: "Extract all text content from this PDF page image. This is likely a resume or document. Maintain the same structure, formatting, and layout of the original text as much as possible. Include headings, bullet points, contact information, and any structured data present in the document. Be comprehensive and extract all visible text." 
        },
        {
          type: "image_url",
          image_url: {
            url: `data:image/png;base64,${imageBase64}`,
            detail: "high"
          }
        }
      ];
      
      console.log('Sending PDF page image to OpenAI GPT-4o for text extraction...');
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: content
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
      
      console.log(`GPT-4o extracted ${extractedText.length} characters from the PDF page`);
      
      return NextResponse.json({
        message: 'Text extracted successfully with GPT-4o',
        text: extractedText,
        charCount: extractedText.length,
        method: 'gpt4-vision',
        pageCount: 1
      });
      
    } catch (aiError: any) {
      console.error('Error processing PDF or calling OpenAI API:', aiError);
      
      // Log detailed error information
      if (aiError.response) {
        console.error('OpenAI API Error Response:', JSON.stringify({
          status: aiError.response.status,
          statusText: aiError.response.statusText,
          data: aiError.response.data
        }, null, 2));
      }
      
      let errorMessage = 'Failed to process PDF with GPT-4o';
      let details = aiError instanceof Error ? aiError.message : String(aiError);
      
      // Check for common OpenAI API errors
      if (aiError.message?.includes('billing')) {
        errorMessage = 'OpenAI API billing issue. Please check your billing status.';
      } else if (aiError.message?.includes('rate limit')) {
        errorMessage = 'OpenAI API rate limit exceeded. Please try again later.';
      } else if (aiError.message?.includes('invalid_api_key')) {
        errorMessage = 'Invalid OpenAI API key. Please check your API key configuration.';
      } else if (aiError.message?.includes('content_policy')) {
        errorMessage = 'The PDF content violates OpenAI content policy.';
      } else if (aiError.message?.includes('invalid_image_format') || aiError.message?.includes('Invalid MIME type')) {
        errorMessage = 'Error converting PDF to image format. Try with a different PDF file.';
      }
      
      return NextResponse.json(
        { 
          error: errorMessage, 
          details: details
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