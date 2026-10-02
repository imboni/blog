<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, shallowRef, useTemplateRef, watch } from 'vue';
import { useRoute } from 'vue-router';
import { siteConfig } from '../config/site';
import { useTheme } from '../composables/useTheme';

const route = useRoute();
const { isDark, toggleTheme } = useTheme();
const mobileMenuOpen = shallowRef(false);
const navRoot = useTemplateRef<HTMLElement>('navRoot');
const menuButton = useTemplateRef<HTMLButtonElement>('menuButton');
const links = computed(() => [
  { to: '/', label: siteConfig.value.nav.posts },
  { to: '/board', label: siteConfig.value.nav.board },
  { to: '/about', label: siteConfig.value.nav.about },
]);
const activeIndex = computed(() => route.path === '/board' ? 1 : route.path === '/about' ? 2 : 0);
const themeLabel = computed(() => isDark.value ? '切换浅色模式' : '切换深色模式');
const rssUrl = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/rss.xml`;
const closeMenu = () => { mobileMenuOpen.value = false; };
const toggleMenu = () => { mobileMenuOpen.value = !mobileMenuOpen.value; };
const onOutsideClick = (event: PointerEvent) => {
  if (mobileMenuOpen.value && event.target instanceof Node && !navRoot.value?.contains(event.target)) closeMenu();
};
const onEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && mobileMenuOpen.value) { closeMenu(); menuButton.value?.focus(); }
};
const onResize = () => { if (window.innerWidth >= 640) closeMenu(); };
const onFocusOut = () => {
  nextTick(() => { if (mobileMenuOpen.value && !navRoot.value?.contains(document.activeElement)) closeMenu(); });
};
watch(() => route.fullPath, closeMenu);
onMounted(() => {
  document.addEventListener('pointerdown', onOutsideClick);
  document.addEventListener('keydown', onEscape);
  window.addEventListener('resize', onResize);
});
onUnmounted(() => {
  document.removeEventListener('pointerdown', onOutsideClick);
  document.removeEventListener('keydown', onEscape);
  window.removeEventListener('resize', onResize);
});
</script>

<template>
  <header ref="navRoot" class="site-nav" @focusout="onFocusOut">
    <div class="nav-frame glass-surface">
      <RouterLink to="/" class="nav-brand" @click="closeMenu">
        <span>{{ siteConfig.siteTitle }}</span>
      </RouterLink>
      <div class="nav-actions">
        <nav class="nav-tabs" aria-label="主要导航">
          <span class="nav-indicator" :style="{ transform: `translateX(${activeIndex * 100}%)` }" aria-hidden="true"></span>
          <RouterLink v-for="(link, index) in links" :key="link.to" :to="link.to" class="nav-tab" :class="{ 'is-active': index === activeIndex }" :aria-current="index === activeIndex ? 'page' : undefined">{{ link.label }}</RouterLink>
        </nav>
        <span class="nav-divider" aria-hidden="true"></span>
        <a :href="rssUrl" class="icon-button nav-rss" aria-label="RSS 订阅" title="RSS 订阅" rel="alternate" type="application/rss+xml">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 11a8 8 0 0 1 8 8M5 5a14 14 0 0 1 14 14"/><circle cx="5" cy="19" r="1" fill="currentColor" stroke="none"/></svg>
        </a>
        <button type="button" class="icon-button theme-toggle" :aria-label="themeLabel" :title="themeLabel" @click="toggleTheme">
          <Transition name="theme-symbol" mode="out-in">
            <svg v-if="isDark" key="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 13A8.5 8.5 0 0 1 11 3.5 8.5 8.5 0 1 0 20.5 13Z"/></svg>
            <svg v-else key="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42m0-14.14-1.42 1.42M6.35 17.65l-1.42 1.42"/></svg>
          </Transition>
        </button>
        <button ref="menuButton" type="button" class="icon-button menu-toggle" :aria-expanded="mobileMenuOpen" aria-controls="mobile-navigation" :aria-label="mobileMenuOpen ? '收起导航菜单' : '打开导航菜单'" @click="toggleMenu">
          <span class="menu-glyph" :class="{ 'is-open': mobileMenuOpen }" aria-hidden="true"><span></span><span></span></span>
        </button>
      </div>
    </div>
    <Transition name="nav-reveal">
      <nav v-if="mobileMenuOpen" id="mobile-navigation" class="mobile-navigation glass-surface" aria-label="移动端导航">
        <RouterLink v-for="(link, index) in links" :key="link.to" :to="link.to" class="mobile-nav-link" :class="{ 'is-active': index === activeIndex }" :aria-current="index === activeIndex ? 'page' : undefined" @click="closeMenu">
          {{ link.label }}<span class="mobile-current" aria-hidden="true"></span>
        </RouterLink>
        <a :href="rssUrl" class="mobile-nav-link mobile-rss" rel="alternate" type="application/rss+xml" @click="closeMenu">{{ siteConfig.nav.rss || 'RSS' }}<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M5 11a8 8 0 0 1 8 8M5 5a14 14 0 0 1 14 14"/><circle cx="5" cy="19" r="1" fill="currentColor" stroke="none"/></svg></a>
      </nav>
    </Transition>
  </header>
</template>

<style scoped>
.site-nav { position: sticky; top: max(16px, env(safe-area-inset-top)); z-index: 50; width: min(704px, calc(100% - 64px)); margin: 24px auto 0; }
.nav-frame { display: flex; align-items: center; justify-content: space-between; gap: 20px; min-height: 60px; padding: 7px 8px 7px 23px; border-radius: 999px; background-color: var(--toolbar-glass); }
.nav-brand { display: inline-flex; align-items: center; gap: 12px; min-width: 0; color: var(--ink); font-size: 15px; font-weight: 600; letter-spacing: -.025em; line-height: 1.3; transition: opacity var(--duration-exit) ease; }
.nav-brand:active { opacity: .65; }
.nav-actions { display: flex; align-items: center; gap: 4px; flex: none; }
.nav-tabs { display: grid; grid-template-columns: repeat(3, 62px); position: relative; isolation: isolate; }
.nav-indicator { position: absolute; top: 0; left: 0; z-index: -1; width: 62px; height: 44px; border-radius: 999px; background: var(--glass-selection); box-shadow: inset 0 1px 0 var(--surface-top); transition: transform var(--duration-move) var(--ease-out); }
.nav-tab { display: grid; place-items: center; height: 44px; border-radius: 999px; font-size: 13px; font-weight: 500; color: var(--muted); transition: color var(--duration-exit) ease, transform var(--duration-exit) var(--ease-out); }
.nav-tab.is-active { color: var(--ink); }
.nav-tab:active { transform: scale(.96); }
.nav-divider { width: 1px; height: 18px; margin: 0 8px; background: var(--rim); }
.menu-toggle { display: none; }
.menu-glyph { position: relative; width: 18px; height: 12px; }
.menu-glyph span { position: absolute; left: 0; width: 18px; height: 1.75px; background: currentColor; border-radius: 2px; transform-origin: center; transition: transform var(--duration-enter) var(--ease-out); }
.menu-glyph span:first-child { top: 2px; }
.menu-glyph span:last-child { bottom: 2px; }
.menu-glyph.is-open span:first-child { transform: translateY(3px) rotate(45deg); }
.menu-glyph.is-open span:last-child { transform: translateY(-3px) rotate(-45deg); }
.mobile-navigation { position: absolute; top: calc(100% + 10px); right: 0; width: min(260px, 100%); padding: 8px; border-radius: 24px; transform-origin: calc(100% - 30px) top; background-color: var(--toolbar-glass); }
.mobile-nav-link { display: flex; align-items: center; justify-content: space-between; min-height: 48px; padding: 12px 18px; border-radius: 17px; font-size: 14px; color: var(--body); transition: background-color var(--duration-exit) ease, transform var(--duration-exit) var(--ease-out); }
.mobile-nav-link:active { transform: scale(.98); }
.mobile-nav-link.is-active { background: var(--glass-selection); color: var(--ink); }
.mobile-current { width: 5px; height: 5px; border-radius: 50%; background: currentColor; opacity: 0; }
.is-active .mobile-current { opacity: .7; }
.mobile-rss { margin-top: 4px; }
.nav-reveal-enter-active { transition: opacity var(--duration-enter) var(--ease-out), transform var(--duration-enter) var(--ease-out); }
.nav-reveal-leave-active { transition: opacity var(--duration-exit) var(--ease-out), transform var(--duration-exit) var(--ease-out); }
.nav-reveal-enter-from, .nav-reveal-leave-to { opacity: 0; transform: translateY(-4px) scale(.97); }
.theme-symbol-enter-active, .theme-symbol-leave-active { transition: opacity 100ms var(--ease-out), transform 140ms var(--ease-out); }
.theme-symbol-enter-from, .theme-symbol-leave-to { opacity: 0; transform: rotate(-20deg) scale(.9); }
@media (hover: hover) and (pointer: fine) { .nav-tab:hover { color: var(--ink); } .mobile-nav-link:hover { background: var(--glass-selection); } }
@media (max-width: 639px) {
  .site-nav { top: max(12px, env(safe-area-inset-top)); margin-top: 16px; }
  .nav-frame { min-height: 58px; padding: 6px 7px 6px 20px; gap: 12px; }
  .nav-brand { font-size: 15px; gap: 10px; }
  .nav-tabs, .nav-divider, .nav-rss { display: none; }
  .menu-toggle { display: inline-grid; }
  .nav-actions { gap: 2px; }
}
@media (max-width: 600px) { .site-nav { width: calc(100% - 40px); } }
</style>
