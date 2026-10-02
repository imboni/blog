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
async function collapsePosts() { resetPage(); await nextTick(); heading.value?.focus({ preventScroll: true }); }
</script>

<template>
  <section id="posts" class="posts-section" aria-labelledby="posts-heading">
    <div class="posts-heading-row"><h2 id="posts-heading" ref="heading" class="section-heading" tabindex="-1">最新文章</h2><span class="posts-count" role="status" aria-live="polite" aria-atomic="true"><template v-if="loading">加载中</template><template v-else-if="isSearching">命中 {{ results.length }} 篇</template><template v-else>共 {{ posts.length }} 篇</template></span></div>
    <PostSearch v-model="searchQuery" />
    <PostList :results="visibleResults" :loading="loading" :empty-message="emptyMessage" />
    <div v-if="results.length > pageSize" class="posts-pagination">
      <button v-if="hasMore" class="soft-button posts-more" type="button" @click="loadMore"><span>更多</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 10 5 5 5-5" /></svg></button>
      <button v-if="page > 1" class="posts-reset" type="button" @click="collapsePosts">回到默认</button>
    </div>
  </section>
</template>

<style scoped>
.posts-section { display: flex; flex-direction: column; gap: 16px; margin-top: 46px; scroll-margin-top: 104px; }
.posts-heading-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 0 2px; }
.section-heading { margin: 0; }
.section-heading:focus:not(:focus-visible) { outline: none; }
.posts-count { color: var(--muted); font-size: 12px; line-height: 1.5; font-variant-numeric: tabular-nums; }
.posts-pagination { display: flex; align-items: center; justify-content: center; gap: 18px; padding-top: 2px; }
.posts-more { display: inline-flex; align-items: center; justify-content: center; gap: 9px; min-width: 98px; min-height: 42px; font-size: 13px; }
.posts-more svg { width: 16px; height: 16px; }
.posts-reset { padding: 10px 2px; border: 0; background: transparent; color: var(--muted); font-size: 12px; cursor: pointer; transition: color var(--duration-exit) var(--ease-out); }
@media (hover: hover) and (pointer: fine) { .posts-reset:hover { color: var(--ink); } }
@media (max-width: 600px) { .posts-section { margin-top: 36px; gap: 14px; } }
</style>
