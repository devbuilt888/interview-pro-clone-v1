'use client';

import { useState } from 'react';
import { translateGibberishPatterns, improveGibberishText } from '../../utils/pdf-pattern-translator';

export default function TestPatternTranslator() {
  const [inputText, setInputText] = useState<string>('');
  const [result, setResult] = useState<any>(null);
  const [improved, setImproved] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleTranslate = () => {
    if (!inputText.trim()) {
      return;
    }

    try {
      setError(null);
      
      // Apply the pattern translator
      const translationResult = translateGibberishPatterns(inputText);
      setResult(translationResult);
      
      // Also show improved text
      const improvedText = improveGibberishText(inputText);
      setImproved(improvedText);
    } catch (error) {
      console.error('Translation error:', error);
      
      // More detailed error message for debugging
      const errorMessage = error instanceof Error ? 
        `${error.message}\n${error.stack || ''}` : 
        'Unknown error translating patterns';
      
      setError(errorMessage);
      
      // Try to still show the improved text even if the translation had an error
      try {
        const improvedText = improveGibberishText(inputText);
        setImproved(improvedText);
      } catch (secondError) {
        console.error('Improved text error:', secondError);
        
        // Update error message with both errors for more context
        const secondErrorMsg = secondError instanceof Error ? secondError.message : 'Unknown secondary error';
        setError((prevError) => `${prevError}\n\nAdditional error applying text improvements: ${secondErrorMsg}`);
      }
    }
  };

  const handleExampleClick = (example: string) => {
    setInputText(example);
    setError(null);
    setResult(null);
    setImproved('');
  };

  // Sample gibberish examples for testing
  const examples = [
    "S KS S U A D J I^P_1 9 8 John Doe is a software engineer with 5 years of experience.",
    "/Name (John Smith) /Position (Senior Software Engineer)",
    "BT /F1 12 Tf 100 700 Td (Jane Doe) Tj ET BT /F1 10 Tf 100 680 Td (Software Developer) Tj ET",
    "J O H N  D O E Senior Software Engineer",
    "X P R N C 2018 - Present Company Name",
    "D U C T N University of Technology"
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">PDF Pattern Translator Test</h1>
      
      <div className="bg-gray-50 p-6 rounded-lg shadow-sm border mb-6">
        <h2 className="text-lg font-semibold mb-4">Test PDF Pattern Translation</h2>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Example Patterns:</label>
          <div className="flex flex-wrap gap-2">
            {examples.map((example, index) => (
              <button 
                key={index} 
                onClick={() => handleExampleClick(example)}
                className="px-3 py-1 text-sm rounded bg-blue-100 text-blue-800 hover:bg-blue-200"
              >
                Example {index + 1}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Enter PDF Gibberish Text:</label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full p-3 border rounded h-40"
            placeholder="Enter PDF text with gibberish patterns to translate..."
          />
        </div>
        
        <button
          onClick={handleTranslate}
          disabled={!inputText.trim()}
          className={`py-2 px-4 rounded-lg text-white ${
            !inputText.trim() ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Translate Patterns
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          <h3 className="font-semibold">Error</h3>
          <p>{error}</p>
          {improved && (
            <div className="mt-4">
              <p className="font-semibold">Partial Results (Improved Text)</p>
              <pre className="mt-2 bg-white p-3 rounded border whitespace-pre-wrap">{improved}</pre>
            </div>
          )}
        </div>
      )}
      
      {!error && result && (
        <div className="bg-white border rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Translation Results</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-md font-medium mb-2">Improved Text (Auto-Corrected)</h3>
              <div className="bg-green-50 p-3 rounded border border-green-200 whitespace-pre-wrap">
                {improved || "No improvements made"}
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-2">Detected Translations</h3>
              {result.translations.length > 0 ? (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-2 text-left">Type</th>
                      <th className="p-2 text-left">Original Pattern</th>
                      <th className="p-2 text-left">Translated To</th>
                      <th className="p-2 text-left">Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.translations.map((t: any, i: number) => (
                      <tr key={i} className="border-t">
                        <td className="p-2">{t.type}</td>
                        <td className="p-2 font-mono text-xs">{t.original.substring(0, 30)}{t.original.length > 30 ? '...' : ''}</td>
                        <td className="p-2">{t.translated}</td>
                        <td className="p-2">{(t.confidence * 100).toFixed(0)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">No specific patterns translated</p>
              )}
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-2">Raw Translation Output</h3>
              <div className="bg-gray-50 p-3 rounded border whitespace-pre-wrap">
                {result.translatedText}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 