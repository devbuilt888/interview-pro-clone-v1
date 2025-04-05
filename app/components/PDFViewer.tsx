'use client';

import { useEffect, useRef, useState } from 'react';

interface PDFViewerProps {
  pdfUrl: string;
  scale?: number;
}

/**
 * Client-side only PDF viewer component
 * Loads PDF.js dynamically and renders PDFs without server-side rendering
 */
const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, scale = 1.0 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;
    
    const loadPDF = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Dynamically import PDF.js
        const pdfjs = await import('pdfjs-dist');
        
        // Configure worker with CDN URL instead of entry import
        pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js';
        
        // Load PDF document
        const loadingTask = pdfjs.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        
        // Store total page count
        setPageCount(pdf.numPages);
        
        // Render the first page
        renderPage(pdf, currentPage);
      } catch (err) {
        console.error('Error loading PDF:', err);
        setError(err instanceof Error ? err.message : 'Failed to load PDF');
        setLoading(false);
      }
    };
    
    const renderPage = async (pdf: any, pageNumber: number) => {
      try {
        if (!canvasRef.current) return;
        
        // Get the page
        const page = await pdf.getPage(pageNumber);
        
        // Set up canvas for rendering
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        // Set dimensions
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        // Render PDF page to canvas
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        
        await page.render(renderContext).promise;
        setLoading(false);
      } catch (err) {
        console.error('Error rendering PDF page:', err);
        setError(err instanceof Error ? err.message : 'Failed to render PDF page');
        setLoading(false);
      }
    };
    
    loadPDF();
  }, [pdfUrl, currentPage, scale]);
  
  // Handle page navigation
  const goToNextPage = () => {
    if (currentPage < pageCount) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  return (
    <div className="pdf-viewer flex flex-col items-center w-full">
      {loading && <div className="pdf-loading text-center p-4 font-medium">Loading PDF...</div>}
      {error && <div className="pdf-error text-center p-4 text-red-500 font-medium">Error: {error}</div>}
      
      <div className="pdf-canvas-container overflow-auto w-full max-w-full border border-gray-200 rounded">
        <canvas ref={canvasRef} className="pdf-canvas mx-auto" />
      </div>
      
      {pageCount > 1 && (
        <div className="pdf-controls flex items-center justify-center gap-4 mt-4">
          <button 
            onClick={goToPreviousPage} 
            disabled={currentPage <= 1}
            className="pdf-control-btn px-4 py-2 bg-gray-100 disabled:opacity-50 rounded"
          >
            Previous
          </button>
          <span className="pdf-page-info font-medium">
            Page {currentPage} of {pageCount}
          </span>
          <button 
            onClick={goToNextPage} 
            disabled={currentPage >= pageCount}
            className="pdf-control-btn px-4 py-2 bg-gray-100 disabled:opacity-50 rounded"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PDFViewer; 