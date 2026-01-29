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

(async () => {
  const redirect = new URLSearchParams(window.location.search).get('redirect');
  if (redirect) {
    const target = decodeURIComponent(redirect);
    window.history.replaceState(null, '', target);
  }
  await loadSiteConfig();
  if (siteConfig.value?.siteTitle) {
    document.title = siteConfig.value.siteTitle;
  }
  createApp(App).use(router).mount('#app');
})();
