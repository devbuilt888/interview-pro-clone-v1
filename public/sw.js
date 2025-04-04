/**
 * PDF.js Worker Service Worker
 * This service worker improves the caching of PDF.js resources for better performance
 */

const PDF_JS_CACHE = 'pdfjs-cache-v1';
const PDF_JS_RESOURCES = [
  // PDF.js worker files from unpkg (primary)
  'https://unpkg.com/pdfjs-dist@4.0.379/build/pdf.worker.min.js',
  'https://unpkg.com/pdfjs-dist@4.0.379/build/pdf.min.js',
  // ESM versions for modern bundlers
  'https://unpkg.com/pdfjs-dist@4.0.379/build/pdf.worker.mjs',
  'https://unpkg.com/pdfjs-dist@4.0.379/build/pdf.mjs',
  
  // Fallback CDN files (cdnjs)
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.min.js',
  
  // PDF.js supporting resources
  'https://unpkg.com/pdfjs-dist@4.0.379/cmaps/',
  'https://unpkg.com/pdfjs-dist@4.0.379/standard_fonts/'
];

// Patterns to match for caching
const PDF_JS_URL_PATTERNS = [
  /pdf\.worker\.min\.js$/,
  /pdf\.min\.js$/,
  /pdf\.worker\.mjs$/,
  /pdf\.mjs$/,
  /\/cmaps\//,
  /\/standard_fonts\//,
  /pdfjs-dist/
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

// Check if a URL matches any of our PDF.js patterns
function isPdfJsUrl(url) {
  return PDF_JS_URL_PATTERNS.some(pattern => pattern.test(url));
}

// Fetch event - serve from cache first, then network
self.addEventListener('fetch', event => {
  const url = event.request.url;
  
  // Handle PDF.js resources using our pattern matching
  if (isPdfJsUrl(url)) {
    event.respondWith(
      caches.match(event.request).then(response => {
        // Return cached response if found
        if (response) {
          console.log('Service worker serving from cache:', url);
          return response;
        }
        
        // Otherwise fetch from network
        return fetch(event.request).then(networkResponse => {
          // Cache successful responses
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(PDF_JS_CACHE).then(cache => {
              cache.put(event.request, responseToCache);
              console.log('Service worker caching new resource:', url);
            });
          }
          
          return networkResponse;
        }).catch(error => {
          console.error('Service worker fetch error:', error, 'for URL:', url);
          // Return a fallback response or let the error propagate
          throw error;
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