/**
 * Vercel-optimized PDF rendering module
 * This provides a way to render PDFs in Vercel environment without Puppeteer
 */

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

/**
 * Check if we're running in Vercel environment
 */
const isVercelEnv = process.env.VERCEL === '1' || 
                    !!process.env.VERCEL_URL || 
                    !!process.env.VERCEL_REGION;

/**
 * Detects which PDF tools are available in the current environment
 */
function detectPdfTools() {
  try {
    // Check for common PDF processing tools
    const tools = {};
    
    // In Vercel, we need to rely on our direct methods
    if (isVercelEnv) {
      console.log('Running in Vercel environment, using built-in PDF rendering');
      return { usingBuiltIn: true };
    }
    
    // Check for ImageMagick (convert)
    try {
      execSync('convert -version', { stdio: 'pipe' });
      tools.hasImageMagick = true;
    } catch (e) {
      tools.hasImageMagick = false;
    }
    
    // Check for pdftoppm
    try {
      execSync('pdftoppm -v', { stdio: 'pipe' });
      tools.hasPdftoppm = true;
    } catch (e) {
      tools.hasPdftoppm = false;
    }
    
    // Check for GhostScript
    try {
      execSync('gs --version', { stdio: 'pipe' });
      tools.hasGhostScript = true;
    } catch (e) {
      tools.hasGhostScript = false;
    }
    
    console.log('Detected PDF tools:', tools);
    return tools;
    
  } catch (error) {
    console.error('Error detecting PDF tools:', error);
    return { usingBuiltIn: true };
  }
}

/**
 * Renders a PDF to PNG using the best available method
 */
async function renderPdfToPng(pdfPath, outputPath) {
  console.log('Rendering PDF to PNG...');
  
  try {
    const tools = detectPdfTools();
    
    // In Vercel or when no external tools are available, use our pure JS solution
    if (tools.usingBuiltIn || (!tools.hasImageMagick && !tools.hasPdftoppm && !tools.hasGhostScript)) {
      console.log('Using built-in PDF rendering');
      return await renderWithBuiltIn(pdfPath, outputPath);
    }
    
    // Otherwise use the best available external tool
    if (tools.hasPdftoppm) {
      console.log('Using pdftoppm for PDF rendering');
      return renderWithPdftoppm(pdfPath, outputPath);
    } 
    else if (tools.hasImageMagick) {
      console.log('Using ImageMagick for PDF rendering');
      return renderWithImageMagick(pdfPath, outputPath);
    }
    else if (tools.hasGhostScript) {
      console.log('Using GhostScript for PDF rendering');
      return renderWithGhostScript(pdfPath, outputPath);
    }
    
    // Fallback to built-in
    console.log('No suitable external renderer found, using built-in');
    return await renderWithBuiltIn(pdfPath, outputPath);
    
  } catch (error) {
    console.error('Error rendering PDF to PNG:', error);
    throw error;
  }
}

/**
 * Render PDF with pdftoppm (usually part of poppler-utils)
 */
function renderWithPdftoppm(pdfPath, outputPath) {
  try {
    // -png: output format, -r 300: resolution, -singlefile: single page
    execSync(`pdftoppm -png -r 300 -singlefile "${pdfPath}" "${outputPath.replace('.png', '')}"`, {
      stdio: 'pipe'
    });
    
    // pdftoppm adds -1.png suffix, we need to rename it
    const actualOutputPath = `${outputPath.replace('.png', '')}-1.png`;
    
    if (fs.existsSync(actualOutputPath)) {
      fs.renameSync(actualOutputPath, outputPath);
      return outputPath;
    } else {
      throw new Error('pdftoppm did not generate the expected output file');
    }
  } catch (error) {
    console.error('Error using pdftoppm:', error);
    throw error;
  }
}

/**
 * Render PDF with ImageMagick
 */
function renderWithImageMagick(pdfPath, outputPath) {
  try {
    // -density 300: resolution, -quality 100: quality
    execSync(`convert -density 300 -quality 100 "${pdfPath}[0]" "${outputPath}"`, {
      stdio: 'pipe'
    });
    
    if (fs.existsSync(outputPath)) {
      return outputPath;
    } else {
      throw new Error('ImageMagick did not generate the expected output file');
    }
  } catch (error) {
    console.error('Error using ImageMagick:', error);
    throw error;
  }
}

/**
 * Render PDF with GhostScript
 */
function renderWithGhostScript(pdfPath, outputPath) {
  try {
    // -r300: resolution, -dFirstPage=1 -dLastPage=1: only first page
    execSync(`gs -dSAFER -dBATCH -dNOPAUSE -sDEVICE=png16m -r300 -dFirstPage=1 -dLastPage=1 -sOutputFile="${outputPath}" "${pdfPath}"`, {
      stdio: 'pipe'
    });
    
    if (fs.existsSync(outputPath)) {
      return outputPath;
    } else {
      throw new Error('GhostScript did not generate the expected output file');
    }
  } catch (error) {
    console.error('Error using GhostScript:', error);
    throw error;
  }
}

/**
 * Pure JavaScript PDF rendering fallback
 * This uses pdfjs-dist to render PDFs in memory
 */
async function renderWithBuiltIn(pdfPath, outputPath) {
  try {
    console.log('Using pdfjs-dist for pure JS PDF rendering');
    
    // We'll use sharp for image processing (already a dependency)
    const sharp = require('sharp');
    const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
    
    // Configure PDF.js worker
    const pdfjsWorker = require('pdfjs-dist/legacy/build/pdf.worker.js');
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    
    // Read the PDF file
    const data = new Uint8Array(fs.readFileSync(pdfPath));
    
    // Load the PDF document
    const pdfDocument = await pdfjsLib.getDocument({data}).promise;
    
    // Get the first page
    const page = await pdfDocument.getPage(1);
    
    // Set scale for rendering (2 is usually a good balance for quality vs. size)
    const scale = 2.0;
    const viewport = page.getViewport({scale});
    
    // Create a canvas with Node canvas
    const {createCanvas} = require('canvas');
    const canvas = createCanvas(viewport.width, viewport.height);
    const context = canvas.getContext('2d');
    
    // Render PDF page to canvas
    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    
    await page.render(renderContext).promise;
    
    // Convert canvas to image and save it
    const pngBuffer = canvas.toBuffer('image/png');
    await sharp(pngBuffer).toFile(outputPath);
    
    return outputPath;
  } catch (error) {
    console.error('Error rendering PDF with built-in renderer:', error);
    throw error;
  }
}

module.exports = {
  renderPdfToPng,
  detectPdfTools,
  isVercelEnv
}; 