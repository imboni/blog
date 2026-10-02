<script setup lang="ts">
import Footer from '../components/Footer.vue';
import { siteConfig, loadSiteConfig } from '../config/site';

loadSiteConfig();
</script>

<template>
  <main class="page-shell about-page">
    <article class="surface-panel about-paper">
      <header class="about-heading">
        <h1 class="about-title">{{ siteConfig.about.title }}</h1>
        <p class="about-subtitle">{{ siteConfig.about.subtitle }}</p>
      </header>
      <section class="about-copy" aria-label="关于我">
        <p v-for="(line, index) in siteConfig.about.paragraphs" :key="index">{{ line }}</p>
      </section>
    </article>
    <Footer />
  </main>
</template>

<style scoped>
.about-page { min-height: 70vh; }
.about-paper { padding: 40px; }
.about-heading { margin-bottom: 36px; }
.about-title { margin: 0 0 12px; color: var(--ink); font-size: 32px; font-weight: 600; line-height: 1.5; letter-spacing: -.035em; }
.about-subtitle { margin: 0; color: var(--muted); font-size: 15px; line-height: 1.9; }
.about-copy { color: var(--body); font-size: 16px; line-height: 2; overflow-wrap: break-word; }
.about-copy p { margin: 0 0 24px; }
.about-copy p:last-child { margin-bottom: 0; }
@media (max-width: 600px) {
  .about-paper { padding: 28px 24px; }
  .about-heading { margin-bottom: 28px; }
  .about-title { font-size: 28px; }
}
</style>
