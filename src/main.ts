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

const normalizeRedirect = (value: string) => {
  let next = value;
  for (let i = 0; i < 2; i += 1) {
    try {
      const decoded = decodeURIComponent(next);
      if (decoded === next) break;
      next = decoded;
    } catch (_) {
      break;
    }
  }
  if (next.startsWith('http')) {
    try {
      const url = new URL(next);
      next = `${url.pathname}${url.search}${url.hash}`;
    } catch (_) {}
  }
  if (!next.startsWith('/')) {
    next = `/${next}`;
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
