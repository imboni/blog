<script setup lang="ts">
import type { PostSearchResult } from '../../composables/usePostSearch';
defineProps<{ results: PostSearchResult[]; loading: boolean; emptyMessage: string }>();
</script>

<template>
  <div id="post-results" class="posts-panel surface-panel" :aria-busy="loading">
    <div v-if="loading" class="posts-skeleton" role="status" aria-label="正在加载文章"><div v-for="index in 5" :key="index" class="post-skeleton-row" aria-hidden="true"><span class="skeleton skeleton-date"></span><span class="skeleton skeleton-title" :style="{ width: `${44 + index % 3 * 14}%` }"></span></div></div>
    <TransitionGroup v-else-if="results.length" tag="ul" name="post-list" class="post-list">
      <li v-for="result in results" :key="result.post.id" class="post-item">
        <RouterLink :to="`/post/${result.post.id}`" class="post-link">
          <span class="post-date">{{ result.post.date }}</span>
          <h3 class="post-title"><template v-for="(segment, index) in result.segments" :key="index"><mark v-if="segment.match" class="search-hit">{{ segment.text }}</mark><span v-else>{{ segment.text }}</span></template></h3>
          <svg class="post-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" /></svg>
        </RouterLink>
      </li>
    </TransitionGroup>
    <div v-else class="posts-empty empty-state" role="status">{{ emptyMessage }}</div>
  </div>
</template>

<style scoped>
.posts-panel { overflow: hidden; border-radius: 28px; }
.post-list { position: relative; margin: 0; padding: 8px 20px; list-style: none; }
.post-item { position: relative; }
.post-item + .post-item::before { content: ''; position: absolute; top: 0; right: 8px; left: 8px; height: 1px; background: var(--line); }
.post-link { position: relative; display: grid; grid-template-columns: 130px minmax(0, 1fr) 20px; align-items: center; gap: 17px; min-height: 80px; padding: 19px 8px; border-radius: 16px; color: var(--ink); text-decoration: none; isolation: isolate; transition: transform var(--duration-exit) var(--ease-out); }
.post-link::after { content: ''; position: absolute; z-index: -1; inset: 6px -7px; border-radius: 16px; background: var(--soft); opacity: 0; pointer-events: none; transition: opacity var(--duration-exit) var(--ease-out); }
.post-link:focus-visible { outline-offset: -3px; }
.post-link:active { transform: scale(.985); }
.post-link:active::after { opacity: .6; }
.post-date { color: var(--muted); font-size: 12px; font-variant-numeric: tabular-nums; white-space: nowrap; }
.post-title { margin: 0; color: var(--ink); font-size: 16px; line-height: 1.65; font-weight: 500; letter-spacing: -.015em; overflow-wrap: anywhere; }
.post-arrow { width: 18px; height: 18px; color: var(--muted); opacity: .55; transition: transform var(--duration-enter) var(--ease-out), opacity var(--duration-enter) var(--ease-out); }
.search-hit { padding: 1px 0; border-radius: 3px; color: var(--ink); background: var(--soft); }
.posts-empty { min-height: 176px; display: grid; place-items: center; padding: 32px 24px; text-align: center; }
.posts-skeleton { padding: 8px 28px; }
.post-skeleton-row { display: flex; gap: 30px; align-items: center; height: 80px; }
.post-skeleton-row + .post-skeleton-row { border-top: 1px solid var(--line); }
.skeleton-date { flex: none; width: 117px; height: 12px; }
.skeleton-title { height: 17px; }
.post-list-move { transition: transform var(--duration-move) var(--ease-move); }
.post-list-enter-active { transition: opacity var(--duration-enter) var(--ease-out), transform var(--duration-enter) var(--ease-out); }
.post-list-leave-active { position: absolute; width: calc(100% - 40px); transition: opacity var(--duration-exit) var(--ease-out), transform var(--duration-exit) var(--ease-out); }
.post-list-enter-from, .post-list-leave-to { opacity: 0; transform: translateY(8px); }
@media (hover: hover) and (pointer: fine) { .post-link:hover::after { opacity: .5; } .post-link:hover .post-arrow { transform: translateX(3px); opacity: 1; } }
@media (max-width: 600px) {
  .post-list { padding: 7px 17px; }
  .post-link { grid-template-columns: minmax(0, 1fr) 20px; gap: 7px 12px; min-height: 96px; padding: 18px 6px; }
  .post-date { grid-column: 1; font-size: 11px; }
  .post-title { grid-column: 1; font-size: 15px; }
  .post-arrow { grid-column: 2; grid-row: 1 / span 2; }
  .post-list-leave-active { width: calc(100% - 34px); }
  .posts-skeleton { padding: 7px 23px; }
  .post-skeleton-row { height: 96px; flex-direction: column; align-items: flex-start; justify-content: center; gap: 13px; }
  .skeleton-date { width: 100px; height: 10px; }
}
</style>
