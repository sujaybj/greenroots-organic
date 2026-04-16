export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  const isLocalhost =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    /^127(?:\.\d{1,3}){3}$/.test(window.location.hostname);

  if (process.env.NODE_ENV === 'production' || isLocalhost) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').catch(() => {});
    });
  }
}
