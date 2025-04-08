'use client';

import React, { useState } from 'react';

export default function TestPdfExtraction() {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [characterCount, setCharacterCount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [extractionMethod, setExtractionMethod] = useState<'standard' | 'gpt4-vision'>('standard');
  const [apiKeyMissing, setApiKeyMissing] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      // Reset states when a new file is selected
      setExtractedText('');
      setErrorMessage('');
      setCharacterCount(0);
      setApiKeyMissing(false);
    }
  };

  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setExtractionMethod(e.target.value as 'standard' | 'gpt4-vision');
    setErrorMessage('');
    setApiKeyMissing(false);
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
    setApiKeyMissing(false);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Choose endpoint based on selected method
      const endpoint = extractionMethod === 'standard' 
        ? '/api/test-pdf-extraction' 
        : '/api/ai-pdf-extraction';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        // Check for specific error related to OpenAI API key
        if (data.error && data.error.includes('OpenAI API key')) {
          setApiKeyMissing(true);
          throw new Error('OpenAI API key is not configured. Please add your API key to the .env.local file.');
        }
        throw new Error(data.error || `Failed to extract text using ${extractionMethod} method`);
      }
      
      // Handle the response
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
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
        <h2 className="text-lg font-semibold text-blue-700 mb-2">New Implementation: Vercel-Compatible</h2>
        <p className="mb-2">We've implemented a serverless-friendly PDF extraction approach using puppeteer-core and @sparticuz/chromium-min:</p>
        <ul className="list-disc ml-6 mb-3 text-blue-800">
          <li>Converts PDF first page to high-quality image</li>
          <li>Uses GPT-4o Vision for accurate text extraction</li>
          <li>Works both locally and on Vercel deployment</li>
          <li>Optimized for serverless environments</li>
        </ul>
        <a href="/test-pdf-extraction/puppeteer-test" className="text-blue-600 hover:text-blue-800 font-medium underline">
          Try the Serverless-Compatible Extraction
        </a>
      </div>
      
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
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Extraction Method</label>
          <select
            value={extractionMethod}
            onChange={handleMethodChange}
            className="block w-full p-2 border border-gray-300 rounded-md text-gray-700"
          >
            <option value="standard">Standard (Pattern-based extraction)</option>
            <option value="gpt4-vision">GPT-4 Vision (OpenAI API)</option>
          </select>
          {extractionMethod === 'gpt4-vision' && (
            <div className="mt-2 text-xs space-y-1">
              <p className="text-amber-600">
                Note: This method requires an OpenAI API key and incurs usage costs.
              </p>
              <p className="text-gray-600">
                GPT-4 Vision provides better extraction quality, especially for complex layouts and scanned PDFs.
              </p>
            </div>
          )}
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
          {isLoading ? 
            (extractionMethod === 'gpt4-vision' ? 'Processing with GPT-4 Vision (may take 10-20 seconds)...' : 'Extracting...') : 
            'Extract Text'
          }
        </button>
      </div>
      
      {apiKeyMissing && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded mb-6">
          <h3 className="font-semibold">OpenAI API Key Required</h3>
          <p className="text-sm mt-1">To use GPT-4 Vision, you need to add your OpenAI API key to the .env.local file:</p>
          <pre className="bg-gray-800 text-gray-100 p-2 mt-2 rounded text-xs overflow-x-auto">
            OPENAI_API_KEY=your_api_key_here
          </pre>
          <p className="text-sm mt-2">Then restart the development server.</p>
        </div>
      )}
      
      {errorMessage && !apiKeyMissing && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {errorMessage}
        </div>
      )}
      
      {characterCount > 0 && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          Successfully extracted {characterCount} characters from the PDF using {extractionMethod === 'standard' ? 'standard pattern-based extraction' : 'GPT-4 Vision'}.
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