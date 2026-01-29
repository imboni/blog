<template>
  <main class="page-shell max-w-3xl mx-auto px-6 md:px-8 pt-10 pb-24">
    <transition name="fade-up" appear>
      <div class="min-h-[60vh]">
        <div v-if="!loading">
          <header class="mb-12 text-center">
            <p class="text-[11px] tracking-[0.35em] text-slate-500 font-semibold">留言</p>
            <h1 class="text-2xl md:text-3xl font-semibold mt-4 mb-3 text-slate-900">写下你想说的</h1>
            <p class="text-slate-500 font-medium text-base">欢迎留下问题、建议或片段想法。</p>
            
            <a :href="newIssueUrl" target="_blank"
               class="inline-flex items-center gap-2 mt-6 px-6 py-2 border border-slate-200 rounded-full text-[11px] font-semibold tracking-[0.25em] text-slate-900 hover-float">
              + 写留言
            </a>
          </header>

          <div v-if="messages.length > 0" class="space-y-6">
            <div v-for="msg in messages" :key="msg.id" 
                 class="border-t border-slate-200 pt-6">
              <div class="flex items-center gap-4 mb-4">
                <img :src="msg.avatar" class="w-10 h-10 rounded-full border border-slate-200 shadow-sm" />
                <div>
                  <p class="text-sm font-semibold text-slate-800">@{{ msg.user }}</p>
                  <p class="text-xs font-semibold text-slate-400 tracking-[0.2em]">{{ msg.date }}</p>
                </div>
              </div>
              <p v-if="msg.body && msg.body.trim().length"
                 class="text-slate-900 font-semibold text-base pl-14 mb-2">
                {{ msg.title }}
              </p>
              <p class="text-slate-600 leading-relaxed font-medium pl-14 whitespace-pre-wrap text-base">
                {{ getMessageBody(msg) }}
              </p>
            </div>
          </div>

          <div v-else class="text-center py-20 text-slate-400 font-semibold">
            {{ messagesEmptyMessage }}
          </div>

          <Footer />
        </div>

        <div v-else class="flex justify-center py-32">
          <div class="loader-ring"></div>
        </div>
      </div>
    </transition>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getPosts, type Post } from '../api/blog';
import Footer from '../components/Footer.vue';

const messages = ref<Post[]>([]);
const loading = ref(true);
const fetchFailed = ref(false);

const newIssueUrl = computed(() => {
  const owner = import.meta.env.VITE_REPO_OWNER;
  const repo = import.meta.env.VITE_REPO_NAME;
  return `https://github.com/${owner}/${repo}/issues/new?labels=guestbook`;
});

const messagesEmptyMessage = computed(() => {
  if (fetchFailed.value) return '留言加载失败，请稍后再试。';
  return '这里还没有留言，来写第一条吧。';
});

const getMessageBody = (msg: Post) => {
  return msg.body && msg.body.trim().length ? msg.body : msg.title;
};

onMounted(async () => {
  try {
    messages.value = await getPosts('message');
    fetchFailed.value = false;
  } catch (_) {
    fetchFailed.value = true;
  } finally {
    loading.value = false;
  }
});
</script>
