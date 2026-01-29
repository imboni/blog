<template>
  <div ref="container" class="giscus-wrapper"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const container = ref<HTMLDivElement | null>(null);
const baseConfig = {
  repo: 'imboni/blog',
  repoId: 'R_kgDORCJG_w',
  category: 'General',
  categoryId: 'DIC_kwDORCJG_84C1lRe',
  strict: '0',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'top',
  theme: 'preferred_color_scheme',
  lang: 'zh-CN',
  loading: 'lazy'
};

const loadGiscus = (mapping: string, term?: string) => {
  if (!container.value) return;
  container.value.innerHTML = '';

  const script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  script.async = true;
  script.crossOrigin = 'anonymous';

  script.setAttribute('data-repo', baseConfig.repo);
  script.setAttribute('data-repo-id', baseConfig.repoId);
  script.setAttribute('data-category', baseConfig.category);
  script.setAttribute('data-category-id', baseConfig.categoryId);
  script.setAttribute('data-mapping', mapping);
  if (term) {
    script.setAttribute('data-term', term);
  }
  script.setAttribute('data-strict', baseConfig.strict);
  script.setAttribute('data-reactions-enabled', baseConfig.reactionsEnabled);
  script.setAttribute('data-emit-metadata', baseConfig.emitMetadata);
  script.setAttribute('data-input-position', baseConfig.inputPosition);
  script.setAttribute('data-theme', baseConfig.theme);
  script.setAttribute('data-lang', baseConfig.lang);
  script.setAttribute('data-loading', baseConfig.loading);

  container.value.appendChild(script);
};

const props = defineProps<{
  mapping?: 'pathname' | 'specific';
  term?: string;
}>();

onMounted(() => loadGiscus(props.mapping ?? 'pathname', props.term || undefined));
</script>
