<script setup lang="ts">
import { computed } from 'vue';
import { siteConfig } from '../config/site';
const footerText = computed(() => (siteConfig.value.footerTemplate || '© {year} / 保留所有权利').replace('{year}', String(new Date().getFullYear())));
</script>

<template>
  <footer class="site-footer">
    <span>{{ footerText }}</span>
    <a v-if="siteConfig.repoUrl" :href="siteConfig.repoUrl" target="_blank" rel="noopener noreferrer">
      本网站已开源 · {{ siteConfig.repoLabel || 'Repo' }}
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" /></svg>
    </a>
  </footer>
</template>

<style scoped>
.site-footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px 20px; margin-top: 56px; padding-top: 24px; border-top: 1px solid var(--line); color: var(--muted); font-size: 11px; line-height: 1.8; }
.site-footer a { display: inline-flex; align-items: center; gap: 4px; transition: color var(--duration-exit) ease; }
.site-footer a svg { transition: transform var(--duration-exit) var(--ease-out); }
@media (hover: hover) and (pointer: fine) { .site-footer a:hover { color: var(--ink); } .site-footer a:hover svg { transform: translate(1px, -1px); } }
@media (max-width: 480px) { .site-footer { align-items: flex-start; flex-direction: column; gap: 8px; margin-top: 40px; } }
</style>
