let serviceWorkerRegistration = null;
let updateAvailable = false;

export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Workers are not supported in this browser');
    return;
  }

  const isLocalhost =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    /^127(?:\.\d{1,3}){3}$/.test(window.location.hostname);

  if (process.env.NODE_ENV === 'production' || isLocalhost) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          serviceWorkerRegistration = registration;
          console.log('Service Worker registered successfully:', registration);

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 1000 * 60 * 60); // Check every hour

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available
                updateAvailable = true;
                console.log('New service worker available');

                // Dispatch custom event for UI to show update notification
                window.dispatchEvent(
                  new CustomEvent('serviceWorkerUpdateAvailable', {
                    detail: { registration },
                  })
                );
              }
            });
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
}

// Function to skip waiting and activate new service worker
export function skipWaitingServiceWorker() {
  if (serviceWorkerRegistration && serviceWorkerRegistration.waiting) {
    serviceWorkerRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
    window.location.reload();
  }
}

// Function to unregister service worker
export function unregisterServiceWorker() {
  if (serviceWorkerRegistration) {
    serviceWorkerRegistration.unregister().then(() => {
      console.log('Service Worker unregistered');
    });
  }
}

// Function to clear all caches
export function clearAllCaches() {
  if (serviceWorkerRegistration && serviceWorkerRegistration.active) {
    serviceWorkerRegistration.active.postMessage({ type: 'CLEAR_CACHE' });
  }

  // Also clear via caches API
  if ('caches' in window) {
    caches.keys().then((names) => {
      names.forEach((name) => {
        caches.delete(name);
      });
    });
  }
}

// Function to check if update is available
export function hasUpdateAvailable() {
  return updateAvailable;
}

// Function to get service worker registration
export function getServiceWorkerRegistration() {
  return serviceWorkerRegistration;
}
