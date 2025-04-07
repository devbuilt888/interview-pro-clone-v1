'use client';

import React, { useState } from 'react';

export default function TestPdfExtraction() {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [characterCount, setCharacterCount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      // Reset states when a new file is selected
      setExtractedText('');
      setErrorMessage('');
      setCharacterCount(0);
    }
  };

  const handleExtract = async () => {
    if (!file) {
      setErrorMessage('Please select a PDF file first.');
      return;
    }

    if (file.type !== 'application/pdf') {
      setErrorMessage('Only PDF files are supported.');
      return;
    }

    // Reset states
    setExtractedText('');
    setErrorMessage('');
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/test-pdf-extraction', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to extract text from PDF');
      }

      const data = await response.json();
      
      // Handle the new simplified response format
      if (data.text) {
        setExtractedText(data.text);
        setCharacterCount(data.charCount || data.text.length);
      } else {
        setErrorMessage('No text was extracted from the PDF.');
      }
    } catch (error) {
      console.error('Error extracting text:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred during extraction');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Test PDF Text Extraction</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Upload PDF File</label>
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
          className={`py-2 px-4 rounded-md text-white font-medium ${
            !file || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Extracting...' : 'Extract Text'}
        </button>
      </div>
      
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {errorMessage}
        </div>
      )}
      
      {characterCount > 0 && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          Successfully extracted {characterCount} characters from the PDF.
        </div>
      )}
      
      {extractedText && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Extracted Text ({characterCount} characters)</h2>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 whitespace-pre-wrap max-h-[500px] overflow-y-auto text-sm font-mono">
            {extractedText}
          </div>
        </div>
      )}
    </div>
  );
} 