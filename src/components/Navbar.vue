<template>
  <nav class="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
    <div class="mx-auto max-w-6xl px-6 md:px-10 h-14 flex items-center justify-between">
      <router-link to="/" class="text-base md:text-lg font-bold tracking-[0.22em] text-slate-900">
        {{ siteConfig.siteTitle }}
      </router-link>
      <div class="flex items-center gap-4 md:gap-6 text-sm md:text-base font-medium tracking-[0.18em] md:tracking-[0.22em] text-slate-500">
        <router-link to="/" class="hover:text-slate-900 transition-colors">{{ siteConfig.nav.posts }}</router-link>
        <router-link to="/board" class="hover:text-slate-900 transition-colors">{{ siteConfig.nav.board }}</router-link>
        <router-link to="/about" class="hover:text-slate-900 transition-colors">{{ siteConfig.nav.about }}</router-link>
        <button
          type="button"
          @click="toggleTheme"
          class="flex items-center gap-1.5 h-6 py-0 text-sm md:text-base tracking-[0.2em] text-slate-500 hover:text-slate-900 transition-colors leading-none"
        >
          <span class="inline-flex items-center leading-none">{{ themeLabel }}</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { siteConfig, loadSiteConfig } from '../config/site';

const theme = ref<'light' | 'dark'>('light');
const storedKey = 'boni-theme';

const applyTheme = (value: 'light' | 'dark') => {
  document.documentElement.setAttribute('data-theme', value);
  theme.value = value;
};

const toggleTheme = () => {
  const next = theme.value === 'light' ? 'dark' : 'light';
  applyTheme(next);
  localStorage.setItem(storedKey, next);
};

const themeLabel = computed(() => (theme.value === 'light' ? siteConfig.value.nav.themeDark : siteConfig.value.nav.themeLight));

let mediaQuery: MediaQueryList | null = null;
let mediaHandler: ((event: MediaQueryListEvent) => void) | null = null;

onMounted(() => {
  loadSiteConfig();
  const saved = localStorage.getItem(storedKey) as 'light' | 'dark' | null;
  if (saved) {
    applyTheme(saved);
    return;
  }
  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  applyTheme(mediaQuery.matches ? 'dark' : 'light');
  mediaHandler = (event) => {
    if (!localStorage.getItem(storedKey)) {
      applyTheme(event.matches ? 'dark' : 'light');
    }
  };
  mediaQuery.addEventListener('change', mediaHandler);
});

onUnmounted(() => {
  if (mediaQuery && mediaHandler) {
    mediaQuery.removeEventListener('change', mediaHandler);
  }
  mediaQuery = null;
  mediaHandler = null;
});
</script>
