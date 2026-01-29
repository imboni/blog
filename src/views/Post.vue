<template>
  <main class="page-shell max-w-3xl mx-auto px-6 md:px-8 pt-10 pb-24">
    <transition name="page-fade" appear>
      <div class="min-h-[60vh]">
        <div v-if="!loading && post">
          <nav class="mb-10">
            <button
              @click="$router.push('/')" 
              class="group flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[color:var(--accent)] transition-colors tracking-[0.35em]"
            >
              <span class="inline-flex items-center justify-center w-4 h-4 transition-transform group-hover:-translate-x-1">
                <svg viewBox="0 0 24 24" class="w-4 h-4 block" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14.5 6.5 9 12l5.5 5.5" />
                </svg>
              </span>
              返回目录
            </button>
          </nav>

          <header class="mb-10">
            <div class="flex flex-wrap items-center gap-3 mb-5">
              <span v-for="tag in post.tags" :key="tag" class="text-xs font-semibold text-slate-600 px-2.5 py-1 rounded-full border border-slate-200">
                {{ tag }}
              </span>
              <span class="text-xs font-semibold text-slate-400 tracking-[0.25em]">{{ post.date }}</span>
            </div>
            <h1 class="text-2xl md:text-3xl font-semibold leading-snug text-slate-900 mb-4">
              {{ post.title }}
            </h1>
            <div class="h-px w-16 bg-slate-200"></div>
          </header>

          <div class="markdown-body" v-html="renderedContent"></div>

          <div class="mt-14 text-center">
            <button @click="$router.push('/')" class="text-xs font-semibold tracking-[0.35em] text-slate-400 hover:text-[color:var(--accent)] transition-colors">
              结束阅读 · 返回目录
            </button>
          </div>

          <section class="mt-16 pt-10 border-t border-slate-200">
            <p class="text-[11px] tracking-[0.35em] text-slate-500 font-semibold text-center mb-6">留言</p>
            <Giscus />
          </section>

          <Footer />
        </div>

        <div v-else-if="!loading && !post" class="py-20 text-sm text-slate-400 text-center">
          {{ postEmptyMessage }}
        </div>

        <div v-else class="flex justify-center items-center py-32">
          <div class="loader-ring"></div>
        </div>
      </div>
    </transition>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getPosts, type Post } from '../api/blog';
import Footer from '../components/Footer.vue';
import Giscus from '../components/Giscus.vue';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/base16/classic-light.css'; 

const route = useRoute();
const post = ref<Post | null>(null);
const loading = ref(true);
const fetchFailed = ref(false);

const md = new MarkdownIt({
  html: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }
    return ''; 
  }
});

const renderedContent = computed(() => {
  return post.value ? md.render(post.value.body) : '';
});

const postEmptyMessage = computed(() => {
  if (fetchFailed.value) return '文章加载失败，请稍后再试。';
  return '没有找到这篇文章。';
});

onMounted(async () => {
  try {
    const allPosts = await getPosts();
    post.value = allPosts.find(p => p.id === Number(route.params.id)) || null;
    fetchFailed.value = false;
  } catch (_) {
    fetchFailed.value = true;
  } finally {
    loading.value = false;
  }
});
</script>
