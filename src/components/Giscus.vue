<template>
  <div ref="container" class="giscus-wrapper"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const container = ref<HTMLDivElement | null>(null);
const config = {
  repo: 'imboni/blog',
  repoId: 'R_kgDORCJG_w',
  category: 'General',
  categoryId: 'DIC_kwDORCJG_84C1lRe',
  mapping: 'pathname',
  strict: '0',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'top',
  theme: 'preferred_color_scheme',
  lang: 'zh-CN',
  loading: 'lazy'
};

const loadGiscus = () => {
  if (!container.value) return;
  container.value.innerHTML = '';

  const script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  script.async = true;
  script.crossOrigin = 'anonymous';

  script.setAttribute('data-repo', config.repo);
  script.setAttribute('data-repo-id', config.repoId);
  script.setAttribute('data-category', config.category);
  script.setAttribute('data-category-id', config.categoryId);
  script.setAttribute('data-mapping', config.mapping);
  script.setAttribute('data-strict', config.strict);
  script.setAttribute('data-reactions-enabled', config.reactionsEnabled);
  script.setAttribute('data-emit-metadata', config.emitMetadata);
  script.setAttribute('data-input-position', config.inputPosition);
  script.setAttribute('data-theme', config.theme);
  script.setAttribute('data-lang', config.lang);
  script.setAttribute('data-loading', config.loading);

  container.value.appendChild(script);
};

onMounted(loadGiscus);
</script>
