<template>
  <main class="page-shell max-w-3xl mx-auto px-6 md:px-8 pt-10 pb-24">
    <transition name="fade-up" appear>
      <div class="min-h-[60vh]">
        <div v-if="!loading">
          <header class="mb-12 text-center">
            <p class="text-[11px] tracking-[0.35em] text-slate-500 font-semibold">留言</p>
            <h1 class="text-2xl md:text-3xl font-semibold mt-4 mb-3 text-slate-900">写下你想说的</h1>
            <p class="text-slate-500 font-medium text-base">欢迎留下问题、建议或片段想法。</p>
          </header>

          <Giscus :key="'board'" />

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
import { ref } from 'vue';
import Footer from '../components/Footer.vue';
import Giscus from '../components/Giscus.vue';

const loading = ref(false);
</script>
