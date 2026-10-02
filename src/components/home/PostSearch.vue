<script setup lang="ts">
import { useTemplateRef } from 'vue';

const query = defineModel<string>({ required: true });
const searchField = useTemplateRef<HTMLInputElement>('searchField');

function clearSearch() {
  query.value = '';
  searchField.value?.focus();
}
</script>

<template>
  <div class="post-search" role="search" aria-label="搜索文章">
    <svg class="post-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true">
      <circle cx="10.75" cy="10.75" r="6.75" /><path d="m16 16 4.5 4.5" />
    </svg>
    <label for="post-search" class="sr-only">搜索文章</label>
    <input
      id="post-search"
      ref="searchField"
      v-model="query"
      type="search"
      inputmode="search"
      autocomplete="off"
      placeholder="搜索标题、标签或正文…"
      class="post-search-field"
      aria-controls="post-results"
      @keydown.esc="clearSearch"
    />
    <div class="post-search-clear-slot">
      <Transition name="search-clear">
        <button v-if="query" type="button" class="post-search-clear" aria-label="清空搜索" @click="clearSearch">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="m8 8 8 8M16 8l-8 8" /></svg>
        </button>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.post-search {
  position: relative;
  display: flex;
  align-items: center;
  gap: 11px;
  min-height: 46px;
  padding: 2px 3px 2px 16px;
  border-radius: 16px;
  background: var(--glass);
  box-shadow: inset 0 0 0 1px var(--surface-rim, var(--rim));
  isolation: isolate;
}
.post-search::after {
  content: '';
  position: absolute;
  z-index: -1;
  inset: 0;
  border-radius: inherit;
  background: var(--surface);
  box-shadow: 0 0 0 3px var(--focus-ring, var(--soft)), inset 0 0 0 1px var(--surface-rim, var(--rim));
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--duration-enter) var(--ease-out);
}
.post-search:focus-within::after { opacity: 1; }
.post-search-icon { flex: none; width: 18px; height: 18px; color: var(--muted); opacity: .8; transition: opacity var(--duration-enter) var(--ease-out); }
.post-search:focus-within .post-search-icon { opacity: 1; }
.post-search-field { display: block; flex: 1; min-width: 0; width: 100%; padding: 7px 0; border: 0; outline: none; background: transparent; color: var(--ink); font: inherit; font-size: 13px; line-height: 1.6; }
.post-search-field:focus-visible { outline: none; }
.post-search-field::placeholder { color: var(--muted); opacity: .85; }
.post-search-field::-webkit-search-cancel-button { -webkit-appearance: none; }
.post-search-clear-slot { flex: none; width: 40px; height: 40px; }
.post-search-clear { position: relative; display: grid; place-items: center; width: 40px; height: 40px; padding: 0; border: 0; border-radius: 12px; color: var(--muted); background: transparent; cursor: pointer; transition: transform var(--duration-exit) var(--ease-out); }
.post-search-clear::before { content: ''; position: absolute; inset: 5px; border-radius: 50%; background: var(--soft); opacity: .65; transition: opacity var(--duration-exit) var(--ease-out); }
.post-search-clear svg { position: relative; width: 18px; height: 18px; }
.post-search-clear:active { transform: scale(.94); }
.post-search-clear:focus-visible { outline-offset: -2px; }
.search-clear-enter-active { transition: opacity var(--duration-enter) var(--ease-out), transform var(--duration-enter) var(--ease-out); }
.search-clear-leave-active { transition: opacity var(--duration-exit) var(--ease-out), transform var(--duration-exit) var(--ease-out); }
.search-clear-enter-from, .search-clear-leave-to { opacity: 0; transform: scale(.94); }
@media (hover: hover) and (pointer: fine) { .post-search-clear:hover::before { opacity: 1; } }
@media (max-width: 600px) { .post-search-field { font-size: 16px; } }
@media (prefers-reduced-motion: reduce) { .search-clear-enter-from, .search-clear-leave-to, .post-search-clear:active { transform: none; } }
</style>
