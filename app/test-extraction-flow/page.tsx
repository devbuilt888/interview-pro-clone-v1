'use client';

import { useState } from 'react';

export default function TestExtractionFlowPage() {
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

      const response = await fetch('/api/test-extraction-flow', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to test extraction flow');
      }

      setResult(data);
    } catch (err) {
      console.error('Error testing extraction flow:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Updated PDF Extraction Flow Test</h1>
      
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
            {isLoading ? 'Testing...' : 'Test Extraction Flow'}
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
              <h3 className="text-md font-medium mb-2">PDF.js Version</h3>
              <p className="bg-gray-50 p-3 rounded">{result.pdfjs_version}</p>
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-2">Extraction Details</h3>
              <div className="bg-gray-50 p-3 rounded">
                <p><span className="font-medium">Method Used:</span> {result.method}</p>
                <p><span className="font-medium">Characters Extracted:</span> {result.text_length}</p>
                
                {result.warnings && result.warnings.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium">Warnings:</p>
                    <ul className="list-disc pl-5 text-amber-700">
                      {result.warnings.map((warning: string, i: number) => (
                        <li key={i}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            {result.text_sample && (
              <div>
                <h3 className="text-md font-medium mb-2">Text Sample</h3>
                <p className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap">
                  {result.text_sample}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 