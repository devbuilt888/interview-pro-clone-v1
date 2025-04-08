import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Dynamic import for webpack bundling issues
const { puppeteer, chromium, getChromePath, isVercelProduction } = require('./webpack-ignore');

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// PDF size limit in bytes (20MB)
const MAX_PDF_SIZE = 20 * 1024 * 1024;

/**
 * Convert PDF to image using a hybrid approach (local puppeteer or alternative methods)
 */
async function convertPdfToImage(pdfBuffer: Buffer): Promise<string> {
  try {
    console.log('Starting PDF conversion...');
    
    // Always use the same method, whether on Vercel or local development
    // This simplifies our approach and avoids compatibility issues
    return await createImageFromPdf(pdfBuffer);
  } catch (error) {
    console.error('Error converting PDF to image:', error);
    throw error;
  }
}

/**
 * Universal method to convert PDF to image (works on both environments)
 */
async function createImageFromPdf(pdfBuffer: Buffer): Promise<string> {
  try {
    console.log('Creating image from PDF...');
    
    // Create a temporary directory for the PDF file
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pdf-'));
    const pdfPath = path.join(tempDir, 'document.pdf');
    const outputPath = path.join(tempDir, 'page.png');
    
    // Write the PDF buffer to a file
    fs.writeFileSync(pdfPath, pdfBuffer);
    
    // Configure browser options
    const options: any = {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ],
      headless: true,
      ignoreHTTPSErrors: true
    };
    
    // Only set the executablePath if we're running locally
    if (!isVercelProduction) {
      try {
        const executablePath = await getChromePath();
        if (executablePath) {
          options.executablePath = executablePath;
          console.log('Using local Chrome path:', executablePath);
        } else {
          console.log('No executablePath found, using default');
        }
      } catch (chromPathError) {
        console.error('Error getting Chrome path:', chromPathError);
        // Continue without executablePath - Puppeteer will use its default
      }
    } else {
      console.log('Running in Vercel environment, using default browser');
    }
    
    let browser;
    try {
      // Launch a headless browser with timeout and retry logic
      console.log('Launching browser with options:', JSON.stringify(options, null, 2));
      browser = await puppeteer.launch(options).catch(async (err) => {
        console.error('First browser launch attempt failed:', err);
        // Try one more time with even more minimal options
        const fallbackOptions = {
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
          headless: true
        };
        console.log('Retrying with fallback options');
        return await puppeteer.launch(fallbackOptions);
      });
      
      // Create a new page
      const page = await browser.newPage();
      
      // Set viewport size
      await page.setViewport({ width: 1600, height: 1200, deviceScaleFactor: 2 });
      
      // Navigate to the PDF file using file:// protocol
      await page.goto(`file://${pdfPath}`, {
        waitUntil: 'networkidle0',
        timeout: 60000
      });
      
      // Wait a moment for PDF to render
      await new Promise(r => setTimeout(r, 1000));
      
      // Take a screenshot
      await page.screenshot({ path: outputPath, fullPage: true });
      
      // Close the browser
      await browser.close();
      browser = null;
      
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
    } catch (error) {
      console.error('Error in PDF-to-image conversion:', error);
      // Ensure browser is closed in case of errors
      if (browser) {
        try {
          await browser.close();
        } catch (closeError) {
          console.error('Error closing browser after error:', closeError);
        }
      }
      throw error;
    } finally {
      // Double-check that browser is closed
      if (browser) {
        try {
          await browser.close();
        } catch (finalCloseError) {
          console.error('Error in final browser close:', finalCloseError);
        }
      }
    }
  } catch (error) {
    console.error('Error in PDF-to-image conversion:', error);
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
    
    console.log('Converting PDF to image format...');
    
    try {
      // Convert PDF to image format
      const imageBase64 = await convertPdfToImage(pdfBuffer);
      
      console.log('Successfully converted PDF to image');
      
      // Create a properly formatted data URL with proper MIME type
      // Ensure it doesn't exceed OpenAI's size limits by compressing if needed
      const dataUrl = `data:image/png;base64,${imageBase64}`;
      
      // Check image size
      const approximateImageSizeInMB = (dataUrl.length * 3/4) / (1024 * 1024);
      console.log(`Approximate image size: ${approximateImageSizeInMB.toFixed(2)}MB`);
      
      // If the image is too large (OpenAI has ~20MB limit), we should implement compression
      // For now, we'll just warn about it
      if (approximateImageSizeInMB > 15) {
        console.warn('Warning: Image size is very large and may exceed OpenAI limits');
      }
      
      // Create a properly typed content array for the OpenAI API
      const textContent = {
        type: "text" as const,
        text: "Extract all text content from this PDF page image. This is likely a resume or document. Maintain the same structure, formatting, and layout of the original text as much as possible. Include headings, bullet points, contact information, and any structured data present in the document. Be comprehensive and extract all visible text."
      };
      
      const imageContent = {
        type: "image_url" as const,
        image_url: {
          url: dataUrl,
          detail: "high" as const
        }
      };
      
      console.log('Sending PDF image to OpenAI GPT-4o for text extraction...');
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [textContent, imageContent]
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
      
      console.log(`GPT-4o extracted ${extractedText.length} characters from the PDF`);
      
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
      } else if (aiError.message?.includes('file_id')) {
        errorMessage = 'Error with file format. The application is using image-based extraction which may not be compatible with your current environment.';
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