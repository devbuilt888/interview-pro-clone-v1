'use client';

import { useState } from 'react';

export default function TestPdfExtraction() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    if (file.type !== 'application/pdf') {
      setError('Please select a valid PDF file');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/test-pdf-extraction', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to extract text from PDF');
      }

      setResult(data);
    } catch (err) {
      console.error('Error testing PDF extraction:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">PDF.js Extraction Test</h1>
      
      <div className="bg-gray-50 p-6 rounded-lg shadow-sm border mb-6">
        <h2 className="text-lg font-semibold mb-4">Upload PDF for Testing</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Select PDF File</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="block w-full text-sm border border-gray-300 rounded-lg cursor-pointer bg-white p-2"
            />
            {file && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {file.name} ({Math.round(file.size / 1024)} KB)
              </p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={!file || isLoading}
            className={`py-2 px-4 rounded-lg text-white ${
              !file || isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Testing...' : 'Test PDF Extraction'}
          </button>
        </form>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          <h3 className="font-semibold">Error</h3>
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className="bg-white border rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Test Results</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-md font-medium mb-2">Environment</h3>
              <div className="bg-gray-50 p-3 rounded">
                <p>Node Environment: {result.diagnostics.environment}</p>
                <p>PDF.js Version: {result.diagnostics.pdfjs_version}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-2">Worker-Free Extraction (Serverless Optimized)</h3>
              <div className={`p-3 rounded ${result.diagnostics.worker_free_extraction.success ? 'bg-green-50' : 'bg-red-50'}`}>
                <p>Status: {result.diagnostics.worker_free_extraction.success ? 'Success' : 'Failed'}</p>
                <p>Characters Extracted: {result.diagnostics.worker_free_extraction.text_length}</p>
                {result.diagnostics.worker_free_extraction.success && (
                  <div className="mt-2">
                    <p className="font-medium">Text Sample:</p>
                    <p className="text-sm mt-1 bg-white p-2 rounded border whitespace-pre-wrap">
                      {result.diagnostics.worker_free_extraction.text_sample}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-2">Worker-Based Extraction (Standard Method)</h3>
              <div className={`p-3 rounded ${result.diagnostics.worker_based_extraction.success ? 'bg-green-50' : 'bg-red-50'}`}>
                <p>Status: {result.diagnostics.worker_based_extraction.success ? 'Success' : 'Failed'}</p>
                <p>Characters Extracted: {result.diagnostics.worker_based_extraction.text_length}</p>
                {result.diagnostics.worker_based_extraction.success && (
                  <div className="mt-2">
                    <p className="font-medium">Text Sample:</p>
                    <p className="text-sm mt-1 bg-white p-2 rounded border whitespace-pre-wrap">
                      {result.diagnostics.worker_based_extraction.text_sample}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {result.diagnostics.errors && result.diagnostics.errors.length > 0 && (
              <div>
                <h3 className="text-md font-medium mb-2">Errors</h3>
                <div className="bg-red-50 p-3 rounded">
                  <ul className="list-disc pl-5 space-y-1">
                    {result.diagnostics.errors.map((err: string, i: number) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 