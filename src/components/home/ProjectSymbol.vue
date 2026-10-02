<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{ name: string }>();
const symbol = computed(() => {
  const name = props.name.toLowerCase();
  if (/volume|audio|sound/.test(name)) return 'audio';
  if (/trivor|gltf|3d|model/.test(name)) return 'cube';
  if (/finder|folder/.test(name)) return 'folder';
  if (/still|photo|image/.test(name)) return 'image';
  return 'code';
});
</script>

<template>
  <span class="project-symbol" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round">
      <template v-if="symbol === 'audio'"><path d="m11 5-5 4H3v6h3l5 4V5Z"/><path d="M15 9a5 5 0 0 1 0 6m3-9a9 9 0 0 1 0 12"/></template>
      <template v-else-if="symbol === 'cube'"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4.5 8 7.5 4.5L19.5 8M12 12.5V21m-4-15.7 8 4.5"/></template>
      <template v-else-if="symbol === 'folder'"><path d="M3 7V5.5A1.5 1.5 0 0 1 4.5 4H9l2 3h8.5A1.5 1.5 0 0 1 21 8.5v10a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5V7Z"/><path d="M12 17v-6m-3 3 3-3 3 3"/></template>
      <template v-else-if="symbol === 'image'"><rect x="3.5" y="3.5" width="17" height="17" rx="4"/><circle cx="9" cy="9" r="1.5"/><path d="m4 16 4-4 4 4 4-6 4 5"/></template>
      <template v-else><rect x="3" y="4" width="18" height="16" rx="4"/><path d="m7 9 3 3-3 3m6 0h4"/></template>
    </svg>
  </span>
</template>

<style scoped>
.project-symbol { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 12px; color: var(--accent); background: var(--glass-selection); box-shadow: inset 0 1px 1px var(--rim), 0 1px 0 var(--surface-rim); }
.project-symbol svg { width: 22px; height: 22px; }
</style>
