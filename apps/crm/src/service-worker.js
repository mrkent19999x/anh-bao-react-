const CACHE_NAME = 'anhbao-bank-v1.0.1';
const STATIC_CACHE = 'anhbao-bank-static-v1.0.1';
const DYNAMIC_CACHE = 'anhbao-bank-dynamic-v1.0.1';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/login.html',
  '/customers.html',
  '/tasks.html',
  '/employees.html',
  '/chat.html',
  '/documents.html',
  '/reports.html',
  '/internal.html',
  '/form.html',
  '/create-admin.html',
  '/styles/main.css',
  '/styles/customers.css',
  '/styles/tasks.css',
  '/styles/employees.css',
  '/styles/chat.css',
  '/styles/documents.css',
  '/styles/reports.css',
  '/styles/internal.css',
  '/styles/form.css',
  '/scripts/firebase-config.js',
  '/scripts/auth.js',
  '/scripts/customers.js',
  '/scripts/tasks.js',
  '/scripts/employees.js',
  '/scripts/chat.js',
  '/scripts/documents.js',
  '/scripts/reports.js',
  '/scripts/dashboard.js',
  '/scripts/form.js',
  '/scripts/create-admin.js',
  '/manifest.json'
];

// Firebase SDK files to cache
const FIREBASE_FILES = [
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js',
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage-compat.js'
];

// External libraries
const EXTERNAL_FILES = [
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static files...');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('[SW] Static files cached successfully');
        return caches.open(DYNAMIC_CACHE);
      })
      .then((cache) => {
        console.log('[SW] Caching external files...');
        return cache.addAll([...FIREBASE_FILES, ...EXTERNAL_FILES]);
      })
      .then(() => {
        console.log('[SW] All files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Error caching files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Old caches cleaned up');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip Firebase API calls
  if (url.hostname.includes('firebase') || url.hostname.includes('googleapis')) {
    return;
  }
  
  // Skip analytics and tracking
  if (url.hostname.includes('google-analytics') || url.hostname.includes('googletagmanager')) {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          console.log('[SW] Serving from cache:', request.url);
          return response;
        }
        
        // Clone the request for network fallback
        const fetchRequest = request.clone();
        
        return fetch(fetchRequest)
          .then((response) => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response for caching
            const responseToCache = response.clone();
            
            // Cache the response
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseToCache);
                console.log('[SW] Cached new resource:', request.url);
              });
            
            return response;
          })
          .catch((error) => {
            console.error('[SW] Network request failed:', error);
            
            // Return offline page for HTML requests
            if (request.headers.get('accept').includes('text/html')) {
              return caches.match('/index.html');
            }
            
            // Return empty response for other requests
            return new Response('', {
              status: 408,
              statusText: 'Request timeout'
            });
          });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle background sync tasks
      console.log('[SW] Processing background sync...')
    );
  }
});

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Có thông báo mới từ Anh Bảo Bank',
    icon: '/manifest.json',
    badge: '/manifest.json',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Xem chi tiết',
        icon: '/manifest.json'
      },
      {
        action: 'close',
        title: 'Đóng',
        icon: '/manifest.json'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Anh Bảo Bank', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_UPDATED') {
    // Handle cache update notifications
    console.log('[SW] Cache updated notification received');
  }
});

// Error handling
self.addEventListener('error', (event) => {
  console.error('[SW] Service Worker error:', event.error);
});

// Unhandled rejection handling
self.addEventListener('unhandledrejection', (event) => {
  console.error('[SW] Unhandled rejection:', event.reason);
}); 