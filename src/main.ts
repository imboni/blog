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

const decodeRedirect = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch (_) {
    return value;
  }
};

(async () => {
  const redirect = new URLSearchParams(window.location.search).get('redirect');
  const redirectTarget = redirect ? decodeRedirect(redirect) : null;
  if (redirectTarget) {
    window.history.replaceState(null, '', redirectTarget);
  }
  await loadSiteConfig();
  if (siteConfig.value?.siteTitle) {
    document.title = siteConfig.value.siteTitle;
  }
  const app = createApp(App).use(router);
  app.mount('#app');
  if (redirectTarget && router.currentRoute.value.fullPath !== redirectTarget) {
    await router.replace(redirectTarget);
  }
})();
