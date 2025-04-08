'use client';

import React, { useState, useEffect } from 'react';

export default function PuppeteerTestPage() {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isClient, setIsClient] = useState<boolean>(false);

  // Ensure hydration consistency
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setErrorMessage('');
    }
  };

  const handleExtract = async () => {
    if (!file) {
      setErrorMessage('Please select a PDF file.');
      return;
    }

    if (file.type !== 'application/pdf') {
      setErrorMessage('Only PDF files are supported.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setExtractedText('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/ai-pdf-extraction', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract text from PDF');
      }

      setExtractedText(data.text);
    } catch (error) {
      console.error('Error extracting text:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred during extraction');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">PDF-Puppeteer Text Extraction Test</h1>
      
      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-6">
        <p className="text-amber-700 font-medium">
          This page uses the most appropriate method for your environment to extract text from PDF files:
        </p>
        <ul className="list-disc ml-6 text-amber-800 mt-2">
          <li>On local development: puppeteer-core renders the PDF and sends it to GPT-4o as an image</li>
          <li>On Vercel: PDF is sent directly to GPT-4o which can now process PDF files natively</li>
        </ul>
        <p className="text-amber-700 mt-2">
          Both approaches use OpenAI GPT-4o Vision for accurate text extraction, maintaining the same user experience.
        </p>
      </div>

      {isClient && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">Upload PDF File</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            />
          </div>
          
          <button
            onClick={handleExtract}
            disabled={!file || isLoading}
            className={`py-2 px-4 rounded-md text-white font-medium flex items-center ${
              !file || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading && (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isLoading ? 'Processing with GPT-4o (may take 10-30 seconds)...' : 'Extract Text with Puppeteer & GPT-4o'}
          </button>
        </div>
      )}
      
      {errorMessage && isClient && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {errorMessage}
        </div>
      )}
      
      {extractedText && isClient && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Extracted Text ({extractedText.length} characters)</h2>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 whitespace-pre-wrap max-h-[500px] overflow-y-auto text-sm font-mono">
            {extractedText}
          </div>
        </div>
      )}
      
      {isClient && (
        <div className="mt-6">
          <a href="/test-pdf-extraction" className="text-blue-600 hover:text-blue-800">
            &larr; Back to main extraction page
          </a>
        </div>
      )}
    </div>
  );
} 