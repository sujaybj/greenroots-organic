// PWA Utilities for managing Progressive Web App features

export const PWAUtils = {
  // Check if the app is running in standalone mode
  isStandalone: () => {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://')
    );
  },

  // Check if the device is iOS
  isIOS: () => {
    return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
  },

  // Check if the device is Android
  isAndroid: () => {
    return /android/i.test(window.navigator.userAgent);
  },

  // Get the platform name
  getPlatform: () => {
    if (PWAUtils.isIOS()) return 'iOS';
    if (PWAUtils.isAndroid()) return 'Android';
    if (window.matchMedia('(prefers-color-scheme: dark)').media === 'not all') return 'Desktop';
    return 'Unknown';
  },

  // Check if PWA is supported
  isPWASupported: () => {
    return 'serviceWorker' in navigator && 'caches' in window;
  },

  // Clear all caches (useful for debugging)
  clearAllCaches: async () => {
    const cacheNames = await caches.keys();
    return Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
  },

  // Get cache size (approximate)
  getCacheSize: async () => {
    if (!('storage' in navigator) || !('estimate' in navigator.storage)) {
      return null;
    }

    const estimate = await navigator.storage.estimate();
    return {
      usage: estimate.usage,
      quota: estimate.quota,
      percentage: Math.round((estimate.usage / estimate.quota) * 100),
    };
  },

  // Request persistent storage (for better cache retention)
  requestPersistentStorage: async () => {
    if ('storage' in navigator && 'persist' in navigator.storage) {
      try {
        const isPersisted = await navigator.storage.persist();
        return isPersisted;
      } catch (error) {
        console.error('Failed to request persistent storage:', error);
        return false;
      }
    }
    return false;
  },

  // Update service worker (manually)
  updateServiceWorker: async () => {
    if (!('serviceWorker' in navigator)) {
      return { success: false, message: 'Service Worker not supported' };
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        return { success: true, message: 'Service Worker updated' };
      }
      return { success: false, message: 'No Service Worker registered' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Unregister service worker
  unregisterServiceWorker: async () => {
    if (!('serviceWorker' in navigator)) {
      return { success: false, message: 'Service Worker not supported' };
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.unregister();
        return { success: true, message: 'Service Worker unregistered' };
      }
      return { success: false, message: 'No Service Worker registered' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Check for service worker updates
  onServiceWorkerUpdate: (callback) => {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration) {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available
              callback?.({
                type: 'UPDATE_AVAILABLE',
                message: 'A new version of the app is available',
              });
            }
          });
        });

        // Check for updates periodically (every 6 hours)
        setInterval(() => {
          registration.update();
        }, 6 * 60 * 60 * 1000);
      }
    });
  },

  // Install app (trigger install prompt)
  installApp: async (deferredPrompt) => {
    if (!deferredPrompt) {
      return { success: false, message: 'Install prompt not available' };
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      return { success: outcome === 'accepted', message: outcome };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Get installed apps
  getInstalledApps: async () => {
    if (!('getInstalledRelatedApps' in navigator)) {
      return [];
    }

    try {
      return await navigator.getInstalledRelatedApps?.();
    } catch (error) {
      console.error('Failed to get installed apps:', error);
      return [];
    }
  },
};

export default PWAUtils;
