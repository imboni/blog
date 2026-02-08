<template>
  <footer class="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm font-semibold text-slate-400 tracking-[0.12em] sm:tracking-[0.2em]">
    <span class="text-slate-600 text-center sm:text-left">{{ footerText }}</span>
    <a
      v-if="siteConfig.repoUrl"
      :href="siteConfig.repoUrl"
      target="_blank"
      class="text-slate-400 hover:text-slate-900 transition-colors text-center sm:text-right"
    >
      本网站已开源 · {{ siteConfig.repoLabel || 'Repo' }}
    </a>
  </footer>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { siteConfig, loadSiteConfig } from '../config/site';

const currentYear = new Date().getFullYear();
const footerText = computed(() => {
  const tpl = siteConfig.value.footerTemplate || `© ${currentYear} / 保留所有权利`;
  return tpl.replace('{year}', String(currentYear));
});

onMounted(() => {
  loadSiteConfig();
});
</script>
