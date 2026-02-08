<template>
  <nav class="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 md:px-10 min-h-14 flex items-center justify-between gap-3">
      <router-link
        to="/"
        class="text-sm sm:text-base md:text-lg font-bold tracking-[0.14em] sm:tracking-[0.2em] md:tracking-[0.22em] text-slate-900"
        @click="closeMobileMenu"
      >
        {{ siteConfig.siteTitle }}
      </router-link>

      <div
        class="hidden md:flex items-center gap-4 md:gap-6 text-sm md:text-base font-medium tracking-[0.18em] md:tracking-[0.22em] text-slate-500"
      >
        <router-link to="/" class="nav-link hover:text-slate-900 transition-colors">{{ siteConfig.nav.posts }}</router-link>
        <router-link to="/board" class="nav-link hover:text-slate-900 transition-colors">{{ siteConfig.nav.board }}</router-link>
        <router-link to="/about" class="nav-link hover:text-slate-900 transition-colors">{{ siteConfig.nav.about }}</router-link>
        <a :href="rssUrl" class="nav-link hover:text-slate-900 transition-colors" rel="alternate" type="application/rss+xml">
          {{ siteConfig.nav.rss || 'RSS' }}
        </a>
        <button
          type="button"
          @click="toggleTheme"
          class="flex items-center gap-1.5 h-6 py-0 text-sm md:text-base tracking-[0.2em] text-slate-500 hover:text-slate-900 transition-colors leading-none"
        >
          <span class="inline-flex items-center leading-none">{{ themeLabel }}</span>
        </button>
      </div>

      <button
        type="button"
        class="menu-toggle md:hidden inline-flex h-8 w-8 items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
        :aria-expanded="mobileMenuOpen"
        aria-label="切换导航菜单"
        @click="toggleMobileMenu"
      >
        <span class="menu-glyph" :class="{ 'is-open': mobileMenuOpen }">
          <span class="menu-line menu-line-top"></span>
          <span class="menu-line menu-line-mid"></span>
          <span class="menu-line menu-line-bottom"></span>
        </span>
      </button>
    </div>

    <transition name="nav-reveal">
      <div v-if="mobileMenuOpen" class="md:hidden nav-mobile-shell border-t border-slate-200">
        <div class="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-3 text-sm font-medium tracking-[0.14em] text-slate-600">
          <router-link to="/" class="nav-mobile-item hover:text-slate-900 transition-colors" style="--item-index: 0;" @click="closeMobileMenu">
            {{ siteConfig.nav.posts }}
          </router-link>
          <router-link to="/board" class="nav-mobile-item hover:text-slate-900 transition-colors" style="--item-index: 1;" @click="closeMobileMenu">
            {{ siteConfig.nav.board }}
          </router-link>
          <router-link to="/about" class="nav-mobile-item hover:text-slate-900 transition-colors" style="--item-index: 2;" @click="closeMobileMenu">
            {{ siteConfig.nav.about }}
          </router-link>
          <a
            :href="rssUrl"
            class="nav-mobile-item hover:text-slate-900 transition-colors"
            rel="alternate"
            type="application/rss+xml"
            style="--item-index: 3;"
            @click="closeMobileMenu"
          >
            {{ siteConfig.nav.rss || 'RSS' }}
          </a>
          <button
            type="button"
            @click="toggleTheme"
            class="nav-mobile-item inline-flex w-fit items-center gap-1.5 h-6 py-0 text-sm tracking-[0.14em] text-slate-600 hover:text-slate-900 transition-colors leading-none"
            style="--item-index: 4;"
          >
            <span class="inline-flex items-center leading-none">{{ themeLabel }}</span>
          </button>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { siteConfig, loadSiteConfig } from '../config/site';

const theme = ref<'light' | 'dark'>('light');
const storedKey = 'boni-theme';
const mobileMenuOpen = ref(false);
const route = useRoute();

const applyTheme = (value: 'light' | 'dark') => {
  document.documentElement.setAttribute('data-theme', value);
  theme.value = value;
};

const toggleTheme = () => {
  const next = theme.value === 'light' ? 'dark' : 'light';
  applyTheme(next);
  localStorage.setItem(storedKey, next);
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

const themeLabel = computed(() => (theme.value === 'light' ? siteConfig.value.nav.themeDark : siteConfig.value.nav.themeLight));
const rssUrl = computed(() => {
  const base = import.meta.env.BASE_URL || '/';
  return base.replace(/\/$/, '') + '/rss.xml';
});

let mediaQuery: MediaQueryList | null = null;
let mediaHandler: ((event: MediaQueryListEvent) => void) | null = null;
let resizeHandler: (() => void) | null = null;

watch(() => route.fullPath, closeMobileMenu);

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

  resizeHandler = () => {
    if (window.innerWidth >= 768) {
      closeMobileMenu();
    }
  };
  window.addEventListener('resize', resizeHandler);
});

onUnmounted(() => {
  if (mediaQuery && mediaHandler) {
    mediaQuery.removeEventListener('change', mediaHandler);
  }
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
  }
  mediaQuery = null;
  mediaHandler = null;
  resizeHandler = null;
});
</script>

<style scoped lang="less">
.menu-toggle {
  border-radius: 999px;
  transition:
    background-color var(--motion-duration) var(--motion-ease),
    transform var(--motion-duration) var(--motion-ease);

  &:active {
    transform: scale(0.95);
  }
}

.menu-glyph {
  width: 18px;
  height: 14px;
  position: relative;
  display: inline-block;
}

.menu-line {
  position: absolute;
  left: 0;
  width: 100%;
  height: 1.7px;
  border-radius: 999px;
  background: currentColor;
  transform-origin: center;
  transition:
    transform var(--motion-duration) var(--motion-ease),
    opacity var(--motion-duration) var(--motion-ease);
}

.menu-line-top {
  top: 0;
}

.menu-line-mid {
  top: 6px;
}

.menu-line-bottom {
  bottom: 0;
}

.menu-glyph.is-open {
  .menu-line-top {
    transform: translateY(6px) rotate(45deg);
  }

  .menu-line-mid {
    opacity: 0;
    transform: scaleX(0.2);
  }

  .menu-line-bottom {
    transform: translateY(-6px) rotate(-45deg);
  }
}
</style>
