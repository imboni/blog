<template>
  <div ref="container" class="giscus-wrapper"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted, watch, computed } from 'vue';

const container = ref<HTMLDivElement | null>(null);
// 存储已加载的 script 实例，避免重复创建
const giscusScript = ref<HTMLScriptElement | null>(null);

const baseConfig = {
  repo: 'imboni/blog',
  repoId: 'R_kgDORCJG_w',
  category: 'General',
  categoryId: 'DIC_kwDORCJG_84C1lRe',
  strict: '0', // 已关闭严格模式（关键）
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'top',
  theme: 'preferred_color_scheme',
  lang: 'zh-CN',
  loading: 'lazy',
  // 新增：解决 Cookie/登录状态持久化的核心配置
  cookieConsent: 'auto', // 自动适配 Cookie 授权
  origin: window.location.origin // 显式指定博客根域名（解决跨域/子路径问题）
};

const props = defineProps<{
  mapping?: 'pathname' | 'specific';
  term?: string;
}>();

// 计算最终配置，确保参数不重复
const finalConfig = computed(() => ({
  ...baseConfig,
  mapping: props.mapping ?? 'pathname',
  term: props.term
}));

// 优化后的加载逻辑：避免重复创建 script，保留登录状态
const loadGiscus = () => {
  if (!container.value) return;

  // 如果已有 script 实例，先移除（避免重复加载）
  if (giscusScript.value) {
    giscusScript.value.remove();
    giscusScript.value = null;
  }

  const script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  script.async = true;
  script.crossOrigin = 'anonymous';

  // 基础配置
  script.setAttribute('data-repo', finalConfig.value.repo);
  script.setAttribute('data-repo-id', finalConfig.value.repoId);
  script.setAttribute('data-category', finalConfig.value.category);
  script.setAttribute('data-category-id', finalConfig.value.categoryId);
  script.setAttribute('data-mapping', finalConfig.value.mapping);
  // 可选参数：仅当 term 存在时设置
  if (finalConfig.value.term) {
    script.setAttribute('data-term', finalConfig.value.term);
  }
  script.setAttribute('data-strict', finalConfig.value.strict);
  script.setAttribute('data-reactions-enabled', finalConfig.value.reactionsEnabled);
  script.setAttribute('data-emit-metadata', finalConfig.value.emitMetadata);
  script.setAttribute('data-input-position', finalConfig.value.inputPosition);
  script.setAttribute('data-theme', finalConfig.value.theme);
  script.setAttribute('data-lang', finalConfig.value.lang);
  script.setAttribute('data-loading', finalConfig.value.loading);
  
  // 新增：修复登录状态的核心属性
  script.setAttribute('data-cookie-consent', finalConfig.value.cookieConsent);
  script.setAttribute('data-origin', finalConfig.value.origin);

  // 存储 script 实例，方便后续清理
  giscusScript.value = script;
  container.value.appendChild(script);
};

// 监听 props 变化，动态更新 giscus（如路由切换时）
watch([() => props.mapping, () => props.term], () => {
  loadGiscus();
}, { immediate: false });

// 组件挂载时加载
onMounted(() => {
  loadGiscus();
});

// 组件卸载时清理 script，避免内存泄漏
onUnmounted(() => {
  if (giscusScript.value) {
    giscusScript.value.remove();
    giscusScript.value = null;
  }
});
</script>

<style scoped>
.giscus-wrapper {
  width: 100%;
  margin: 20px 0;
}
</style>