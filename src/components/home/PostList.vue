<script setup lang="ts">
import type { PostSearchResult } from '../../composables/usePostSearch';

defineProps<{ results: PostSearchResult[]; loading: boolean; emptyMessage: string }>();
</script>

<template>
  <div id="post-results" class="posts-panel glass-surface" :aria-busy="loading">
    <Transition name="posts-state">
      <div v-if="loading" key="loading" class="posts-skeleton" role="status" aria-label="正在加载文章">
        <div v-for="index in 5" :key="index" class="post-skeleton-row" aria-hidden="true">
          <span class="skeleton skeleton-date"></span>
          <span class="skeleton skeleton-title" :style="{ width: `${44 + index % 3 * 14}%` }"></span>
        </div>
      </div>
      <div v-else-if="results.length" key="results" class="posts-content">
        <TransitionGroup tag="ul" name="post-list" class="post-list">
          <li v-for="result in results" :key="result.post.id" class="post-item">
            <RouterLink :to="`/post/${result.post.id}`" class="post-link">
              <span class="post-date">{{ result.post.date }}</span>
              <h3 class="post-title">
                <template v-for="(segment, index) in result.segments" :key="index"><mark v-if="segment.match" class="search-hit">{{ segment.text }}</mark><span v-else>{{ segment.text }}</span></template>
              </h3>
              <svg class="post-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" /></svg>
            </RouterLink>
          </li>
        </TransitionGroup>
      </div>
      <div v-else key="empty" class="posts-empty empty-state" role="status">
        <svg class="posts-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="10.75" cy="10.75" r="6.75" /><path d="m16 16 4.5 4.5" /></svg>
        <p>{{ emptyMessage }}</p>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.posts-panel { position: relative; overflow: hidden; border-radius: var(--radius-card); }
.post-list { position: relative; margin: 0; padding: 6px 18px; list-style: none; }
.post-item { position: relative; }
.post-item + .post-item::before { content: ''; position: absolute; top: 0; right: 8px; left: 8px; height: 1px; background: var(--line); }
.post-link { position: relative; display: grid; grid-template-columns: 108px minmax(0, 1fr) 18px; align-items: center; gap: 18px; min-height: 76px; padding: 18px 8px; border-radius: 14px; color: var(--ink); text-decoration: none; isolation: isolate; transition: transform var(--duration-exit) var(--ease-out); }
.post-link::after { content: ''; position: absolute; z-index: -1; inset: 5px -7px; border-radius: 15px; background: var(--hover); opacity: 0; pointer-events: none; transition: opacity var(--duration-exit) var(--ease-out); }
.post-link:focus-visible { outline-offset: -3px; }
.post-link:focus-visible::after { opacity: .65; }
.post-link:active { transform: scale(.99); }
.post-link:active::after { opacity: .85; }
.post-date { color: var(--muted); font-size: 11px; line-height: 1.7; letter-spacing: .025em; font-variant-numeric: tabular-nums; white-space: nowrap; }
.post-title { margin: 0; color: var(--ink); font-size: 15px; line-height: 1.65; font-weight: 500; letter-spacing: -.012em; overflow-wrap: anywhere; }
.post-arrow { width: 17px; height: 17px; color: var(--muted); opacity: .4; transform: translateX(-2px); transition: transform var(--duration-enter) var(--ease-out), opacity var(--duration-enter) var(--ease-out); }
.post-link:focus-visible .post-arrow { opacity: .9; transform: none; }
.search-hit { padding: 1px 0; border-radius: 3px; color: var(--ink); background: var(--soft); }
.posts-empty { min-height: 164px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 30px 24px; text-align: center; font-size: 13px; }
.posts-empty-icon { width: 22px; height: 22px; opacity: .55; }
.posts-skeleton { padding: 6px 26px; }
.post-skeleton-row { display: grid; grid-template-columns: 108px minmax(0, 1fr); gap: 18px; align-items: center; height: 76px; }
.post-skeleton-row + .post-skeleton-row { border-top: 1px solid var(--line); }
.skeleton-date { width: 82px; height: 10px; }
.skeleton-title { height: 14px; }
.posts-state-enter-active { transition: opacity var(--duration-enter) var(--ease-out); }
.posts-state-leave-active { position: absolute; inset: 0; pointer-events: none; transition: opacity var(--duration-exit) var(--ease-out); }
.posts-state-enter-from, .posts-state-leave-to { opacity: 0; }
.post-list-move { transition: transform var(--duration-move) var(--ease-move); }
.post-list-enter-active { transition: opacity var(--duration-enter) var(--ease-out), transform var(--duration-enter) var(--ease-out); }
.post-list-leave-active { position: absolute; width: calc(100% - 36px); pointer-events: none; transition: opacity var(--duration-exit) var(--ease-out), transform var(--duration-exit) var(--ease-out); }
.post-list-enter-from, .post-list-leave-to { opacity: 0; transform: translateY(5px); }
@media (hover: hover) and (pointer: fine) { .post-link:hover::after { opacity: .55; } .post-link:hover .post-arrow { transform: translateX(1px); opacity: .85; } }
@media (max-width: 600px) {
  .post-list { padding: 6px 16px; }
  .post-link { grid-template-columns: minmax(0, 1fr) 18px; gap: 5px 12px; min-height: 88px; padding: 16px 6px; }
  .post-date { grid-column: 1; font-size: 11px; }
  .post-title { grid-column: 1; font-size: 15px; }
  .post-arrow { grid-column: 2; grid-row: 1 / span 2; }
  .post-list-leave-active { width: calc(100% - 32px); }
  .posts-skeleton { padding: 6px 22px; }
  .post-skeleton-row { display: flex; height: 88px; flex-direction: column; align-items: flex-start; justify-content: center; gap: 11px; }
  .skeleton-date { width: 82px; height: 9px; }
}
@media (prefers-reduced-motion: reduce) {
  .post-list-move { transition: none; }
  .post-list-enter-from, .post-list-leave-to, .post-link:active, .post-arrow { transform: none; }
  .post-link:hover .post-arrow { transform: none; }
}
</style>
