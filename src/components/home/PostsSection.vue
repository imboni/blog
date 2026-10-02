<script setup lang="ts">
import { computed, nextTick, toRef, useTemplateRef } from 'vue';
import type { Post } from '../../api/blog';
import { usePostSearch } from '../../composables/usePostSearch';
import PostSearch from './PostSearch.vue';
import PostList from './PostList.vue';

const props = defineProps<{ posts: Post[]; loading: boolean; failed: boolean }>();
const { searchQuery, page, pageSize, isSearching, results, visibleResults, hasMore, loadMore, resetPage } = usePostSearch(toRef(props, 'posts'));
const heading = useTemplateRef<HTMLHeadingElement>('heading');
const emptyMessage = computed(() => props.failed ? '文章加载失败，请稍后再试。' : isSearching.value ? '没有匹配的文章。' : '暂无文章。');
const resultCount = computed(() => isSearching.value ? results.value.length : props.posts.length);

async function collapsePosts(event: MouseEvent) {
  resetPage();
  await nextTick();
  heading.value?.focus({ preventScroll: true });
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  heading.value?.scrollIntoView({ block: 'start', behavior: event.detail === 0 || reduceMotion ? 'auto' : 'smooth' });
}
</script>

<template>
  <section id="posts" class="posts-section" aria-labelledby="posts-heading">
    <div class="posts-heading-row">
      <h2 id="posts-heading" ref="heading" class="section-heading" tabindex="-1">最新文章</h2>
      <span class="posts-count" role="status" aria-live="polite" aria-atomic="true">
        <template v-if="loading">加载中</template>
        <template v-else><span>{{ isSearching ? '找到' : '共' }}</span><span class="posts-count-number">{{ resultCount }}</span><span>篇</span></template>
      </span>
    </div>
    <PostSearch v-model="searchQuery" />
    <PostList :results="visibleResults" :loading="loading" :empty-message="emptyMessage" />
    <Transition name="posts-pagination">
      <div v-if="results.length > pageSize" class="posts-pagination">
        <button v-if="hasMore" class="posts-more" type="button" aria-controls="post-results" @click="loadMore">
          <span>更多文章</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 10 5 5 5-5" /></svg>
        </button>
        <button v-if="page > 1" class="posts-reset" type="button" aria-controls="post-results" @click="collapsePosts">收起列表</button>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.posts-section { display: flex; flex-direction: column; gap: 12px; margin-top: 42px; scroll-margin-top: 104px; }
.posts-heading-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 24px; margin-bottom: 2px; padding: 0 3px; }
.section-heading { margin: 0; }
.section-heading:focus:not(:focus-visible) { outline: none; }
.posts-count { display: inline-flex; align-items: center; gap: 5px; min-height: 24px; color: var(--muted); font-size: 11px; line-height: 1.5; font-variant-numeric: tabular-nums; }
.posts-count-number { display: inline-grid; place-items: center; min-width: 22px; padding: 2px 5px; border-radius: 7px; background: var(--glass); box-shadow: inset 0 0 0 1px var(--surface-rim, var(--rim)); color: var(--body); }
.posts-pagination { display: flex; align-items: center; justify-content: center; gap: 16px; min-height: 44px; padding-top: 2px; }
.posts-more { position: relative; display: inline-flex; align-items: center; justify-content: center; gap: 9px; min-width: 118px; min-height: 42px; padding: 10px 16px; border: 0; border-radius: 14px; color: var(--body); background: var(--glass); box-shadow: inset 0 0 0 1px var(--surface-rim, var(--rim)); font-size: 12px; font-weight: 500; cursor: pointer; isolation: isolate; transition: transform var(--duration-exit) var(--ease-out); }
.posts-more::before { content: ''; position: absolute; z-index: -1; inset: 0; border-radius: inherit; background: var(--soft); opacity: 0; transition: opacity var(--duration-exit) var(--ease-out); }
.posts-more svg { width: 15px; height: 15px; opacity: .7; transition: transform var(--duration-enter) var(--ease-out); }
.posts-more:active { transform: scale(.97); }
.posts-more:active::before { opacity: .7; }
.posts-reset { min-height: 42px; padding: 10px 4px; border: 0; border-radius: 8px; background: transparent; color: var(--muted); font-size: 12px; cursor: pointer; transition: transform var(--duration-exit) var(--ease-out), opacity var(--duration-exit) var(--ease-out); }
.posts-reset:active { transform: scale(.97); opacity: .7; }
.posts-pagination-enter-active { transition: opacity var(--duration-enter) var(--ease-out), transform var(--duration-enter) var(--ease-out); }
.posts-pagination-leave-active { transition: opacity var(--duration-exit) var(--ease-out); }
.posts-pagination-enter-from, .posts-pagination-leave-to { opacity: 0; }
.posts-pagination-enter-from { transform: translateY(4px); }
@media (hover: hover) and (pointer: fine) { .posts-reset:hover { color: var(--ink); } .posts-more:hover::before { opacity: .55; } .posts-more:hover svg { transform: translateY(2px); } }
@media (max-width: 600px) { .posts-section { margin-top: 34px; gap: 12px; } }
@media (prefers-reduced-motion: reduce) { .posts-more:active, .posts-reset:active, .posts-more:hover svg, .posts-pagination-enter-from { transform: none; } }
</style>
