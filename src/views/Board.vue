<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Footer from '../components/Footer.vue';
import Giscus from '../components/Giscus.vue';

const route = useRoute();
const giscusKey = computed(() => String(route.fullPath));
</script>

<template>
  <main class="page-shell board-page">
    <section class="surface-panel board-paper" aria-labelledby="board-title">
      <header class="board-heading">
        <p class="board-eyebrow">留言</p>
        <h1 id="board-title" class="board-title">写下你想说的</h1>
        <p class="board-subtitle">欢迎留下问题、建议或片段想法。</p>
      </header>
      <Giscus :key="giscusKey" mapping="specific" term="board" />
    </section>
    <Footer />
  </main>
</template>

<style scoped>
.board-page { min-height: 70vh; }
.board-paper { min-height: 380px; padding: 40px; }
.board-heading { margin-bottom: 36px; text-align: center; }
.board-eyebrow { margin: 0 0 16px; color: var(--accent); font-size: 12px; line-height: 1.8; }
.board-title { margin: 0 0 12px; color: var(--ink); font-size: 32px; font-weight: 600; line-height: 1.5; letter-spacing: -.035em; }
.board-subtitle { margin: 0; color: var(--muted); font-size: 15px; line-height: 1.9; }
@media (max-width: 600px) {
  .board-paper { padding: 32px 24px; }
  .board-heading { margin-bottom: 28px; }
  .board-title { font-size: 28px; }
  .board-subtitle { font-size: 14px; }
}
</style>
