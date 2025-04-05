'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the PDF viewer component with no SSR
const PDFViewer = dynamic(() => import('../components/PDFViewer'), {
  ssr: false,
  loading: () => <div>Loading PDF viewer...</div>
});

export default function TestPDFViewerPage() {
  const [pdfUrl, setPdfUrl] = useState('https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf');
  const [customPdfUrl, setCustomPdfUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPdfUrl) {
      setPdfUrl(customPdfUrl);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">PDF Viewer Test</h1>
      <div className="mb-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <label htmlFor="pdfUrl" className="font-medium">
            PDF URL:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="pdfUrl"
              className="border border-gray-300 rounded p-2 flex-grow"
              value={customPdfUrl}
              onChange={(e) => setCustomPdfUrl(e.target.value)}
              placeholder="Enter PDF URL..."
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Load PDF
            </button>
          </div>
        </form>
      </div>

      <div className="border border-gray-300 rounded p-4">
        <PDFViewer pdfUrl={pdfUrl} scale={1.2} />
      </div>
    </div>
  );
} 