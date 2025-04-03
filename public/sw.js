/**
 * PDF.js Worker Service Worker
 * This service worker improves the caching of PDF.js resources for better performance
 */

const PDF_JS_CACHE = 'pdfjs-cache-v1';
const PDF_JS_RESOURCES = [
  // PDF.js worker files
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.min.js',
  
  // PDF.js supporting resources
  'https://unpkg.com/pdfjs-dist@4.0.379/cmaps/',
  'https://unpkg.com/pdfjs-dist@4.0.379/standard_fonts/'
];

// Install event - cache key resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PDF_JS_CACHE).then(cache => {
      console.log('Service worker installing and caching PDF.js resources');
      return cache.addAll(PDF_JS_RESOURCES);
    })
  );
  // Activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('pdfjs-cache-') && cacheName !== PDF_JS_CACHE;
        }).map(cacheName => {
          console.log('Service worker removing old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
  // Take control of clients immediately
  self.clients.claim();
});

// Fetch event - serve from cache first, then network
self.addEventListener('fetch', event => {
  // Only handle PDF.js related requests
  if (event.request.url.includes('pdf.js') || 
      event.request.url.includes('cmaps') || 
      event.request.url.includes('standard_fonts')) {
    
    event.respondWith(
      caches.match(event.request).then(response => {
        // Return cached response if found
        if (response) {
          console.log('Service worker serving from cache:', event.request.url);
          return response;
        }
        
        // Otherwise fetch from network
        return fetch(event.request).then(networkResponse => {
          // Cache successful responses
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(PDF_JS_CACHE).then(cache => {
              cache.put(event.request, responseToCache);
              console.log('Service worker caching new resource:', event.request.url);
            });
          }
          
          return networkResponse;
        });
      })
    );
  }
});

// Listen for messages
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
}); 