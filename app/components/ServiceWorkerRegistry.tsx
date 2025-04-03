'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistry() {
  useEffect(() => {
    // Register service worker for PDF.js improvements
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('PDF.js Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.error('PDF.js Service Worker registration failed:', error);
        });
    }
  }, []);

  // This component doesn't render anything
  return null;
} 