const STATIC_CACHE = 'greenroots-static-v1';
const RUNTIME_CACHE = 'greenroots-runtime-v1';
const API_CACHE = 'greenroots-api-v1';
const IMAGE_CACHE = 'greenroots-images-v1';

const APP_SHELL = [
  '/',
  '/manifest.json',
  '/service-worker.js',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
];

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'CACHE_FIRST',
  NETWORK_FIRST: 'NETWORK_FIRST',
  STALE_WHILE_REVALIDATE: 'STALE_WHILE_REVALIDATE',
  NETWORK_ONLY: 'NETWORK_ONLY',
};

// Determine cache strategy based on request
const getCacheStrategy = (url) => {
  const { pathname } = new URL(url);

  // API calls: network first
  if (pathname.includes('/api/')) {
    return CACHE_STRATEGIES.NETWORK_FIRST;
  }

  // Images: cache first
  if (pathname.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
    return CACHE_STRATEGIES.CACHE_FIRST;
  }

  // Static assets (CSS, JS): cache first
  if (pathname.match(/\.(css|js)$/i)) {
    return CACHE_STRATEGIES.CACHE_FIRST;
  }

  // HTML documents: network first
  if (pathname.match(/\.html?$/i) || pathname === '/') {
    return CACHE_STRATEGIES.NETWORK_FIRST;
  }

  // Default: stale while revalidate
  return CACHE_STRATEGIES.STALE_WHILE_REVALIDATE;
};

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        cache.addAll(APP_SHELL).catch(() => {
          // Some files might not exist in dev, that's okay
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) =>
                ![STATIC_CACHE, RUNTIME_CACHE, API_CACHE, IMAGE_CACHE].includes(key)
            )
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      networkFirstStrategy(request).catch(() => {
        // Return offline page if available
        return caches.match('/') || new Response('Offline');
      })
    );
    return;
  }

  // API requests
  if (url.origin !== self.location.origin) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Determine strategy and apply
  const strategy = getCacheStrategy(request.url);

  switch (strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE));
      break;
    case CACHE_STRATEGIES.NETWORK_FIRST:
      event.respondWith(networkFirstStrategy(request, RUNTIME_CACHE));
      break;
    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      event.respondWith(staleWhileRevalidateStrategy(request, RUNTIME_CACHE));
      break;
    default:
      event.respondWith(networkFirstStrategy(request));
  }
});

// Cache First Strategy
async function cacheFirstStrategy(request, cacheName = STATIC_CACHE) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (!response || response.status !== 200 || response.type !== 'basic') {
      return response;
    }

    const copy = response.clone();
    caches.open(cacheName).then((cache) => {
      cache.put(request, copy);
    });

    return response;
  } catch (error) {
    return new Response('Offline - Content not available', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'text/plain',
      }),
    });
  }
}

// Network First Strategy
async function networkFirstStrategy(request, cacheName = RUNTIME_CACHE) {
  try {
    const response = await fetch(request);
    if (!response || response.status !== 200) {
      return response;
    }

    if (response.type !== 'error') {
      const copy = response.clone();
      caches.open(cacheName).then((cache) => {
        cache.put(request, copy);
      });
    }

    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }

    return new Response('Offline - Content not available', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'text/plain',
      }),
    });
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidateStrategy(request, cacheName = RUNTIME_CACHE) {
  const cached = await caches.match(request);

  const fetchPromise = fetch(request).then((response) => {
    if (!response || response.status !== 200) {
      return response;
    }

    if (response.type === 'basic') {
      const copy = response.clone();
      caches.open(cacheName).then((cache) => {
        cache.put(request, copy);
      });
    }

    return response;
  });

  return cached || fetchPromise;
}

// Message handling for cache clearing
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((names) => {
      names.forEach((name) => {
        caches.delete(name);
      });
    });
    event.ports[0].postMessage({ cleared: true });
  }

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
