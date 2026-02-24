<template>
  <main class="page-shell max-w-3xl mx-auto px-4 sm:px-6 md:px-8 pt-8 sm:pt-10 pb-16 sm:pb-24">
    <transition name="page-fade" appear>
      <div class="min-h-[60vh]">
        <div v-if="!loading">
          <header class="mb-10 space-y-4 cinematic-in" style="--reveal-delay: 40ms;">
            <h1 class="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900">{{ siteConfig.siteName }}</h1>
            <p class="text-base sm:text-lg text-slate-500">{{ siteConfig.tagline }}</p>
            <p class="text-base text-slate-600">{{ siteConfig.intro }}</p>
            <div class="text-sm text-slate-400">最近更新 {{ lastUpdatedLabel }}</div>
          </header>

          <section id="posts" class="mt-12 space-y-6 cinematic-in" style="--reveal-delay: 140ms;">
            <div class="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm tracking-[0.18em] sm:tracking-[0.3em] text-slate-500 font-semibold">
              <span>最新文章</span>
              <span class="text-xs sm:text-sm tracking-[0.14em] sm:tracking-[0.2em] text-slate-400">
                <template v-if="isSearching">命中 {{ filteredPosts.length }} 篇</template>
                <template v-else>共 {{ posts.length }} 篇</template>
              </span>
            </div>
            <div class="space-y-2">
              <label for="post-search" class="sr-only">搜索文章</label>
              <div class="search-box flex items-center gap-2 rounded-xl px-3 py-2">
                <svg viewBox="0 0 24 24" class="search-icon w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
                <input
                  id="post-search"
                  v-model.trim="searchQuery"
                  type="search"
                  inputmode="search"
                  autocomplete="off"
                  placeholder="搜索标题、标签或正文..."
                  class="search-field w-full bg-transparent border-0 outline-none text-sm sm:text-base"
                />
                <button
                  v-if="searchQuery"
                  type="button"
                  @click="clearSearch"
                  class="search-clear text-xs transition-colors"
                >
                  清空
                </button>
              </div>
            </div>
            <div class="border-t border-slate-200 divide-y divide-slate-200">
              <div
                v-for="(post, index) in visiblePosts"
                :key="post.id"
                @click="$router.push(`/post/${post.id}`)"
                class="post-row cursor-pointer cinematic-in"
                :style="{ '--reveal-delay': `${220 + index * 60}ms` }"
              >
                <div class="grid grid-cols-1 sm:grid-cols-[120px_1fr] md:grid-cols-[140px_1fr] gap-2 sm:gap-5 items-start sm:items-center">
                  <span class="text-sm sm:text-base text-slate-500 tracking-[0.1em] sm:whitespace-nowrap sm:min-w-[120px] md:min-w-[140px]">
                    {{ post.date }}
                  </span>
                  <h2 class="text-base md:text-lg font-semibold text-slate-900">
                    <span class="post-title-ink">
                      <template v-for="(segment, segmentIndex) in getTitleSegments(post)" :key="`${post.id}-${segmentIndex}`">
                        <mark
                          v-if="segment.match"
                          class="search-hit-mark"
                        >
                          {{ segment.text }}
                        </mark>
                        <span v-else>{{ segment.text }}</span>
                      </template>
                    </span>
                  </h2>
                </div>
              </div>
              <div v-if="visiblePosts.length === 0" class="py-10 text-base text-slate-400">
                {{ postsEmptyMessage }}
              </div>
            </div>
            <div v-if="filteredPosts.length > pageSize" class="pt-2 flex items-center gap-4">
              <button
                v-if="hasMore"
                type="button"
                @click="loadMore"
                class="text-base text-slate-600 hover:text-slate-900 transition-colors"
              >
                更多
              </button>
              <button
                v-if="page > 1"
                type="button"
                @click="resetPage"
                class="text-base text-slate-400 hover:text-slate-900 transition-colors"
              >
                回到默认
              </button>
            </div>
          </section>

          <section class="mt-12 space-y-4 cinematic-in" style="--reveal-delay: 240ms;">
            <div class="text-sm tracking-[0.3em] text-slate-500 font-semibold">业余项目</div>
            <div v-if="projects.length" class="space-y-4">
              <div v-for="(project, index) in projects" :key="project.name" class="space-y-1 cinematic-in" :style="{ '--reveal-delay': `${290 + index * 70}ms` }">
                <div class="text-sm text-slate-400 tracking-[0.2em]">{{ project.period }}</div>
                <a :href="project.href" target="_blank" class="text-base font-semibold text-slate-900 hover:opacity-70 transition-opacity">
                  {{ project.name }}
                </a>
                <p class="text-base text-slate-600">{{ project.desc }}</p>
              </div>
            </div>
            <p v-else class="text-base text-slate-400">暂无项目。</p>
          </section>

          <section class="mt-12 space-y-3 cinematic-in" style="--reveal-delay: 340ms;">
            <div class="text-sm tracking-[0.3em] text-slate-500 font-semibold">保持联系</div>
            <div class="flex flex-wrap items-center gap-x-5 gap-y-2 text-base text-slate-600">
              <a
                v-for="contact in contacts"
                :key="contact.label"
                :href="contact.href"
                target="_blank"
                class="hover:opacity-70 transition-opacity"
              >
                {{ contact.label }}
              </a>
              <router-link to="/board" class="hover:opacity-70 transition-opacity">留言</router-link>
            </div>
          </section>

          <div class="cinematic-in" style="--reveal-delay: 430ms;">
            <Footer />
          </div>
        </div>

        <div v-else class="flex justify-center items-center py-32">
          <div class="loader-ring"></div>
        </div>
      </div>
    </transition>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import Fuse from 'fuse.js';
import { getPosts, type Post } from '../api/blog';
import Footer from '../components/Footer.vue';
import { siteConfig, loadSiteConfig } from '../config/site';

const posts = ref<Post[]>([]);
const loading = ref(true);
const fetchFailed = ref(false);
const pageSize = 5;
const page = ref(1);
const searchQuery = ref('');
const projects = computed(() => siteConfig.value.projects || []);
const contacts = computed(() => siteConfig.value.contacts || []);

const firstPost = computed(() => (posts.value.length ? posts.value[0] : null));
const lastUpdatedLabel = computed(() => firstPost.value?.date ?? '—');

const isSearching = computed(() => searchQuery.value.length > 0);
type MatchRange = [number, number];
type HighlightSegment = { text: string; match: boolean };
type SearchHit = {
  item: Post;
  titleRanges: MatchRange[];
};

const fuse = computed(() => new Fuse(posts.value, {
  keys: [
    { name: 'title', weight: 0.55 },
    { name: 'tags', weight: 0.15 },
    { name: 'body', weight: 0.30 },
  ],
  threshold: 0.35,
  ignoreLocation: true,
  includeMatches: true,
}));

const searchHits = computed(() => {
  if (!searchQuery.value) {
    return posts.value.map((post) => ({
      item: post,
      titleRanges: [] as MatchRange[],
    }));
  }

  return fuse.value.search(searchQuery.value).map((result) => {
    const titleRanges = (result.matches || [])
      .filter((match) => match.key === 'title')
      .flatMap((match) => (match.indices || []) as MatchRange[]);

    return {
      item: result.item,
      titleRanges: normalizeRanges(titleRanges),
    };
  }) satisfies SearchHit[];
});

const filteredPosts = computed(() => {
  return searchHits.value.map((hit) => hit.item);
});

const titleSegmentsById = computed(() => {
  const map = new Map<number, HighlightSegment[]>();
  for (const hit of searchHits.value) {
    map.set(hit.item.id, buildHighlightSegments(hit.item.title, hit.titleRanges));
  }
  return map;
});

const getTitleSegments = (post: Post): HighlightSegment[] => {
  return titleSegmentsById.value.get(post.id) ?? [{ text: post.title, match: false }];
};

const visiblePosts = computed(() => {
  return filteredPosts.value.slice(0, page.value * pageSize);
});

const hasMore = computed(() => filteredPosts.value.length > page.value * pageSize);

const loadMore = () => {
  if (hasMore.value) {
    page.value += 1;
  }
};

const resetPage = () => {
  page.value = 1;
};

const clearSearch = () => {
  searchQuery.value = '';
};

const postsEmptyMessage = computed(() => {
  if (fetchFailed.value) return '文章加载失败，请稍后再试。';
  if (isSearching.value) return '没有匹配的文章。';
  return '暂无文章。';
});

watch(searchQuery, () => {
  page.value = 1;
});

function normalizeRanges(ranges: MatchRange[]): MatchRange[] {
  if (ranges.length <= 1) return ranges;
  const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
  const [first, ...rest] = sorted;
  if (!first) return [];

  const merged: MatchRange[] = [[first[0], first[1]]];

  for (const current of rest) {
    const last = merged[merged.length - 1]!;
    if (current[0] <= last[1] + 1) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      merged.push([current[0], current[1]]);
    }
  }

  return merged;
}

function buildHighlightSegments(text: string, ranges: MatchRange[]): HighlightSegment[] {
  if (!isSearching.value || ranges.length === 0) {
    return [{ text, match: false }];
  }

  const segments: HighlightSegment[] = [];
  let cursor = 0;

  for (const [start, end] of ranges) {
    if (start > cursor) {
      segments.push({ text: text.slice(cursor, start), match: false });
    }
    segments.push({ text: text.slice(start, end + 1), match: true });
    cursor = end + 1;
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), match: false });
  }

  return segments.filter((segment) => segment.text.length > 0);
}

onMounted(async () => {
  try {
    loadSiteConfig();
    const data = await getPosts();
    posts.value = data.sort((a, b) => b.id - a.id);
    page.value = 1;
    fetchFailed.value = false;
  } catch (_) {
    fetchFailed.value = true;
  } finally {
    loading.value = false;
  }
});
</script>
