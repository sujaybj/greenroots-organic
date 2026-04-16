import React, { useEffect, useState } from 'react';
import { Download, Share2, X } from 'lucide-react';

const isIosDevice = () => /iphone|ipad|ipod/i.test(window.navigator.userAgent);

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

const InstallAppPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const previouslyDismissed = window.localStorage.getItem('gr_install_prompt_dismissed') === 'true';
    if (previouslyDismissed) {
      setDismissed(true);
    }

    if (isStandalone()) {
      return undefined;
    }

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      if (!previouslyDismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (isIosDevice() && !previouslyDismissed) {
      setShowPrompt(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  if (dismissed || !showPrompt || isStandalone()) return null;

  const handleDismiss = () => {
    setDismissed(true);
    setShowPrompt(false);
    window.localStorage.setItem('gr_install_prompt_dismissed', 'true');
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome !== 'accepted') {
      setShowPrompt(true);
      return;
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const isiOS = isIosDevice();

  return (
    <div
      style={{
        position: 'fixed',
        right: '16px',
        bottom: '16px',
        zIndex: 1200,
        width: 'min(360px, calc(100vw - 24px))',
        background: 'rgba(18, 53, 36, 0.96)',
        color: 'white',
        borderRadius: '18px',
        padding: '16px 16px 14px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.22)',
        border: '1px solid rgba(183, 228, 199, 0.22)',
      }}
    >
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss install prompt"
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'transparent',
          border: 'none',
          color: 'rgba(255,255,255,0.72)',
          cursor: 'pointer',
          display: 'grid',
          placeItems: 'center',
          padding: 0,
        }}
      >
        <X size={16} />
      </button>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '14px',
            background: 'rgba(116, 198, 157, 0.16)',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
        >
          {isiOS ? <Share2 size={18} color="#B7E4C7" /> : <Download size={18} color="#B7E4C7" />}
        </div>

        <div style={{ minWidth: 0 }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: '0.96rem' }}>Add GreenRoots to your home screen</p>
          <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,0.78)', fontSize: '0.85rem', lineHeight: 1.5 }}>
            {isiOS
              ? 'On iPhone or iPad, tap Share and then choose Add to Home Screen for quick access.'
              : 'Install the app to open GreenRoots from your mobile or desktop like a shortcut.'}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
        {deferredPrompt && !isiOS && (
          <button
            type="button"
            onClick={handleInstall}
            className="btn btn-primary btn-sm"
            style={{ minWidth: '132px' }}
          >
            Install App
          </button>
        )}
        {isiOS && (
          <div
            style={{
              fontSize: '0.78rem',
              color: '#B7E4C7',
              background: 'rgba(116, 198, 157, 0.12)',
              borderRadius: '999px',
              padding: '8px 12px',
            }}
          >
            Share <Share2 size={13} style={{ verticalAlign: 'text-bottom' }} /> Add to Home Screen
          </div>
        )}
      </div>
    </div>
  );
};

export default InstallAppPrompt;
