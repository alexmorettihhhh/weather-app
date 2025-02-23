import { Workbox } from 'workbox-window';

declare global {
  interface Window {
    gtag?: (command: string, event: string) => void;
  }
  interface WindowEventMap {
    'beforeinstallprompt': BeforeInstallPromptEvent;
  }
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed',
    platform: string
  }>;
  prompt(): Promise<void>;
}

interface ServiceWorkerConfig {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
}

interface SyncManager {
  register(tag: string): Promise<void>;
  getTags(): Promise<string[]>;
}

interface PeriodicSyncManager {
  register(tag: string, options?: { minInterval: number }): Promise<void>;
  unregister(tag: string): Promise<void>;
  getTags(): Promise<string[]>;
}

interface ServiceWorkerRegistrationWithPeriodicSync extends ServiceWorkerRegistration {
  periodicSync?: PeriodicSyncManager;
  sync?: SyncManager;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const registration: { current: ServiceWorkerRegistrationWithPeriodicSync | null } = { current: null };

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

export function register(config?: ServiceWorkerConfig): void {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL || '', window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL || ''}/service-worker.js`;

      if (isLocalhost) {
        checkValidServiceWorker(swUrl, config);
      } else {
        registerValidSW(swUrl, config);
      }
    });

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;
      showInstallPromotion();
    });

    window.addEventListener('appinstalled', () => {
      deferredPrompt = null;
      hideInstallPromotion();
      if (window.gtag) {
        window.gtag('event', 'pwa_installed');
      }
    });
  }
}

function registerValidSW(swUrl: string, config: ServiceWorkerConfig = {}): void {
  const wb = new Workbox(swUrl);

  wb.addEventListener('installed', (event) => {
    if (event.isUpdate) {
      showUpdatePrompt();
    }
  });

  wb.addEventListener('waiting', showUpdatePrompt);
  wb.addEventListener('controlling', () => {
    window.location.reload();
  });

  wb.register()
    .then((reg) => {
      if (!reg) return;
      
      registration.current = reg as ServiceWorkerRegistrationWithPeriodicSync;
      
      registration.current.addEventListener('updatefound', () => {
        const installingWorker = registration.current?.installing;
        if (installingWorker == null) {
          return;
        }

        installingWorker.addEventListener('statechange', () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              showUpdatePrompt();
              if (config.onUpdate && registration.current) {
                config.onUpdate(registration.current);
              }
            } else {
              console.log('Content is cached for offline use.');
              if (config.onSuccess && registration.current) {
                config.onSuccess(registration.current);
              }
            }
          }
        });
      });

      if (registration.current.sync) {
        setupPeriodicSync(registration.current).catch(console.error);
      }
    })
    .catch((error) => {
      console.error('Error during service worker registration:', error);
    });
}

async function setupPeriodicSync(reg: ServiceWorkerRegistrationWithPeriodicSync): Promise<void> {
  if (reg.periodicSync) {
    try {
      const status = await navigator.permissions.query({
        name: 'periodic-background-sync' as PermissionName,
      });

      if (status.state === 'granted') {
        await reg.periodicSync.register('weather-sync', {
          minInterval: 24 * 60 * 60 * 1000, // 24 hours
        });
      }
    } catch (error) {
      console.error('Periodic sync could not be registered:', error);
    }
  }
}

function checkValidServiceWorker(swUrl: string, config: ServiceWorkerConfig = {}): void {
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('No internet connection found. App is running in offline mode.');
    });
}

export function unregister(): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}

// UI Functions for installation and updates
function showInstallPromotion(): void {
  const installBanner = document.createElement('div');
  installBanner.id = 'pwa-install-banner';
  installBanner.innerHTML = `
    <div class="pwa-install-content">
      <p>Установите приложение для работы офлайн</p>
      <button id="pwa-install-button" class="pwa-button primary">Установить</button>
      <button id="pwa-install-dismiss" class="pwa-button">Отмена</button>
    </div>
  `;
  document.body.appendChild(installBanner);

  const installButton = document.getElementById('pwa-install-button');
  const dismissButton = document.getElementById('pwa-install-dismiss');
  
  if (installButton) {
    installButton.addEventListener('click', installPWA);
  }
  if (dismissButton) {
    dismissButton.addEventListener('click', hideInstallPromotion);
  }
}

function hideInstallPromotion(): void {
  const banner = document.getElementById('pwa-install-banner');
  if (banner) {
    banner.remove();
  }
}

async function installPWA(): Promise<void> {
  if (!deferredPrompt) return;

  try {
    await deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the PWA installation');
    } else {
      console.log('User dismissed the PWA installation');
    }
    
    deferredPrompt = null;
    hideInstallPromotion();
  } catch (err) {
    console.error('Error installing PWA:', err);
  }
}

function showUpdatePrompt(): void {
  const updateBanner = document.createElement('div');
  updateBanner.id = 'pwa-update-banner';
  updateBanner.innerHTML = `
    <div class="pwa-update-content">
      <p>Доступно обновление приложения</p>
      <button id="pwa-update-button" class="pwa-button primary">Обновить</button>
      <button id="pwa-update-dismiss" class="pwa-button">Позже</button>
    </div>
  `;
  document.body.appendChild(updateBanner);

  const updateButton = document.getElementById('pwa-update-button');
  const dismissButton = document.getElementById('pwa-update-dismiss');

  if (updateButton) {
    updateButton.addEventListener('click', () => {
      if (registration.current?.waiting) {
        registration.current.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
      hideUpdatePrompt();
    });
  }
  if (dismissButton) {
    dismissButton.addEventListener('click', hideUpdatePrompt);
  }
}

function hideUpdatePrompt(): void {
  const banner = document.getElementById('pwa-update-banner');
  if (banner) {
    banner.remove();
  }
} 