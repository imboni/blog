<script setup lang="ts">
import { useTemplateRef } from 'vue';
const query = defineModel<string>({ required: true });
const searchField = useTemplateRef<HTMLInputElement>('searchField');
function clearSearch() { query.value = ''; searchField.value?.focus(); }
</script>

<template>
  <div class="post-search glass-surface" role="search" aria-label="搜索文章">
    <svg class="post-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><circle cx="10.75" cy="10.75" r="6.75" /><path d="m16 16 4.5 4.5" /></svg>
    <label for="post-search" class="sr-only">搜索文章</label>
    <input id="post-search" ref="searchField" v-model="query" type="search" inputmode="search" autocomplete="off" placeholder="搜索标题、标签或正文…" class="post-search-field" aria-controls="post-results" @keydown.esc="clearSearch" />
    <div class="post-search-clear-slot"><Transition name="search-clear"><button v-if="query" type="button" class="post-search-clear" aria-label="清空搜索" @click="clearSearch"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="m8 8 8 8M16 8l-8 8" /></svg></button></Transition></div>
  </div>
</template>

<style scoped>
.post-search { display: flex; align-items: center; gap: 12px; min-height: 50px; padding: 6px 9px 6px 18px; border-radius: 999px; transition: box-shadow var(--duration-enter) var(--ease-out); }
.post-search:focus-within { box-shadow: inset 0 0 0 1px var(--accent), 0 4px 16px var(--shadow); }
.post-search-icon { flex: none; width: 19px; height: 19px; color: var(--muted); }
.post-search-field { display: block; flex: 1; min-width: 0; width: 100%; padding: 3px 0; border: 0; outline: none; background: transparent; color: var(--ink); font: inherit; font-size: 14px; line-height: 1.6; }
.post-search-field:focus-visible { outline: none; }
.post-search-field::placeholder { color: var(--muted); opacity: .85; }
.post-search-field::-webkit-search-cancel-button { -webkit-appearance: none; }
.post-search-clear-slot { flex: none; width: 36px; height: 36px; }
.post-search-clear { display: grid; place-items: center; width: 36px; height: 36px; border: 0; border-radius: 50%; color: var(--muted); background: var(--soft); cursor: pointer; transition: transform var(--duration-exit) var(--ease-out); }
.post-search-clear svg { width: 20px; height: 20px; }
.post-search-clear:active { transform: scale(.92); }
.search-clear-enter-active { transition: opacity var(--duration-enter) var(--ease-out), transform var(--duration-enter) var(--ease-out); }
.search-clear-leave-active { transition: opacity var(--duration-exit) var(--ease-out), transform var(--duration-exit) var(--ease-out); }
.search-clear-enter-from, .search-clear-leave-to { opacity: 0; transform: scale(.85); }
@media (max-width: 600px) { .post-search-field { font-size: 16px; } }
</style>
