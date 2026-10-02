<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import Footer from '../components/Footer.vue';
import Giscus from '../components/Giscus.vue';
import ReadingContent from '../components/reading/ReadingContent.vue';
import { usePost } from '../composables/usePost';

const route = useRoute();
const { post, loading, fetchFailed, emptyMessage, retry } = usePost(() => route.params.id);
const giscusKey = computed(() => String(route.fullPath));
const discussionTerm = computed(() => `post-${route.params.id ?? ''}`);
</script>

<template>
  <main class="page-shell post-page" :aria-busy="loading">
    <template v-if="post && !loading">
      <nav class="post-navigation" aria-label="文章导航">
        <RouterLink to="/" class="soft-button post-back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M19 12H5m6 6-6-6 6-6" />
          </svg>
          <span>返回目录</span>
        </RouterLink>
      </nav>

      <article class="surface-panel post-paper" :aria-label="post.title">
        <header class="post-heading">
          <div class="post-meta">
            <span v-for="tag in post.tags" :key="tag" class="post-tag">{{ tag }}</span>
            <span class="post-date">{{ post.date }}</span>
          </div>
          <h1 class="post-title">{{ post.title }}</h1>
        </header>
        <ReadingContent :markdown="post.body" />
        <div class="post-end">
          <RouterLink to="/" class="soft-button post-back post-end-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M19 12H5m6 6-6-6 6-6" />
            </svg>
            <span>结束阅读 · 返回目录</span>
          </RouterLink>
        </div>
      </article>

      <section class="surface-panel post-comments" aria-labelledby="post-comments-title">
        <h2 id="post-comments-title" class="section-heading post-comments-title">留言</h2>
        <Giscus :key="giscusKey" mapping="specific" :term="discussionTerm" />
      </section>
      <Footer />
    </template>

    <div v-else-if="loading" class="surface-panel post-loading" role="status" aria-label="正在加载文章">
      <div class="skeleton post-skeleton-meta"></div>
      <div class="skeleton post-skeleton-title"></div>
      <div class="skeleton post-skeleton-line"></div>
      <div class="skeleton post-skeleton-line"></div>
      <div class="skeleton post-skeleton-line post-skeleton-short"></div>
    </div>

    <div v-else class="surface-panel empty-state post-empty" role="status">
      <p>{{ emptyMessage }}</p>
      <button v-if="fetchFailed" type="button" class="soft-button" @click="retry">重新加载</button>
      <RouterLink v-else to="/" class="soft-button">返回目录</RouterLink>
    </div>
  </main>
</template>

<style scoped>
.post-page { min-height: 70vh; }
.post-navigation { margin-bottom: 24px; }
.post-back { display: inline-flex; align-items: center; gap: 9px; font-size: 13px; }
.post-back svg { width: 17px; height: 17px; transition: transform var(--duration-exit) var(--ease-out); }
.post-paper { padding: 40px; }
.post-heading { margin-bottom: 36px; }
.post-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 18px; }
.post-tag { padding: 5px 11px; border-radius: 999px; background: var(--soft); color: var(--accent); font-size: 11px; line-height: 1.5; }
.post-date { margin-left: 4px; color: var(--muted); font-size: 12px; line-height: 1.8; font-variant-numeric: tabular-nums; }
.post-date:first-child { margin-left: 0; }
.post-title { margin: 0; color: var(--ink); font-size: 32px; font-weight: 600; line-height: 1.5; letter-spacing: -.035em; overflow-wrap: anywhere; text-wrap: balance; }
.post-end { margin-top: 48px; padding-top: 28px; border-top: 1px solid var(--line); text-align: center; }
.post-end-link { color: var(--muted); }
.post-comments { margin-top: 24px; padding: 32px 40px; }
.post-comments-title { margin: 0 0 24px; }
.post-loading { min-height: 380px; padding: 40px; }
.post-skeleton-meta { width: 124px; height: 14px; margin-bottom: 24px; }
.post-skeleton-title { width: 70%; height: 36px; margin-bottom: 40px; }
.post-skeleton-line { height: 16px; margin-top: 20px; }
.post-skeleton-short { width: 62%; }
.post-empty { padding: 64px 24px; text-align: center; }
.post-empty p { margin: 0 0 20px; }
@media (hover: hover) and (pointer: fine) {
  .post-back:hover svg { transform: translateX(-3px); }
}
@media (max-width: 600px) {
  .post-navigation { margin-bottom: 20px; }
  .post-paper { padding: 28px 24px; }
  .post-heading { margin-bottom: 28px; }
  .post-title { font-size: 27px; }
  .post-comments { margin-top: 20px; padding: 28px 24px; }
  .post-loading { padding: 28px 24px; }
}
@media (max-width: 380px) {
  .post-paper, .post-comments { padding-inline: 20px; }
}
</style>
