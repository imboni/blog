import { createApp } from 'vue'
import './style.less'
import App from './App.vue'
import router from './router'
import { loadSiteConfig, siteConfig } from './config/site'

const storedTheme = localStorage.getItem('boni-theme');
if (storedTheme === 'light' || storedTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', storedTheme);
} else {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  document.documentElement.setAttribute('data-theme', prefersDark.matches ? 'dark' : 'light');
}

const swCleanupKey = 'boni-sw-cleanup-v1';
if (!localStorage.getItem(swCleanupKey)) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister();
      });
    });
  }

  if ('caches' in window) {
    caches.keys().then((keys) => {
      keys.forEach((key) => {
        caches.delete(key);
      });
    });
  }
  localStorage.setItem(swCleanupKey, '1');
}

const normalizeRedirect = (value: string) => {
  let next = value;
  try {
    next = decodeURIComponent(next);
  } catch (_) {}
  if (next.startsWith('http')) {
    try {
      const url = new URL(next);
      next = `${url.pathname}${url.search}${url.hash}`;
    } catch (_) {}
  }
  if (!next.startsWith('/')) {
    next = `/${next}`;
  }
  if (next.includes('?') && next.includes('giscus=')) {
    const [path, rest = ''] = next.split('?');
    const [query = '', hash] = rest.split('#');
    const safeQuery = query.replace(/\+/g, '%2B');
    next = `${path}?${safeQuery}${hash ? `#${hash}` : ''}`;
  }
  return next;
};

(async () => {
  const redirect = new URLSearchParams(window.location.search).get('redirect');
  const redirectTarget = redirect ? normalizeRedirect(redirect) : null;
  await loadSiteConfig();
  if (siteConfig.value?.siteTitle) {
    document.title = siteConfig.value.siteTitle;
  }
  const app = createApp(App).use(router);
  if (redirectTarget) {
    await router.replace(redirectTarget);
  }
  await router.isReady();
  app.mount('#app');
})();
