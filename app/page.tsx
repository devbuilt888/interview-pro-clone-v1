'use client';

import Image from 'next/image';
import ResumeUploader from './components/ResumeUploader';
import BackgroundAnimation from './components/BackgroundAnimation';
import { useState } from 'react';

export default function Home() {
  const [isChatActive, setIsChatActive] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="mb-4 text-3xl font-bold">PDF Testing Components</h1>
        
        <div className="w-full mt-6 space-y-4">
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">PDF Extraction Tests</h2>
            <div className="space-y-2">
              <div>
                <a href="/test-pdf-extraction" className="text-blue-600 hover:underline block">
                  PDF Extraction Test
                </a>
                <p className="text-sm text-gray-600">Test the basic PDF text extraction capabilities</p>
              </div>
              
              <div>
                <a href="/test-pdf-viewer" className="text-blue-600 hover:underline block">
                  PDF Viewer Test
                </a>
                <p className="text-sm text-gray-600">Test the PDF viewer and rendering</p>
              </div>
              
              <div>
                <a href="/test-extraction-flow/pattern-translator" className="text-blue-600 hover:underline block">
                  PDF Pattern Translator
                </a>
                <p className="text-sm text-gray-600">Test the new pattern translator for handling gibberish text</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}