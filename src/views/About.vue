<template>
  <main class="page-shell max-w-3xl mx-auto px-4 sm:px-6 md:px-8 pt-8 sm:pt-10 pb-16 sm:pb-24">
    <transition name="page-fade" appear>
      <div class="min-h-[60vh]">
        <header class="mb-10 space-y-3 cinematic-in" style="--reveal-delay: 40ms;">
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900">{{ siteConfig.about.title }}</h1>
          <p class="text-base text-slate-500">{{ siteConfig.about.subtitle }}</p>
        </header>

        <section class="space-y-6 text-base text-slate-600 leading-relaxed cinematic-in" style="--reveal-delay: 140ms;">
          <p v-for="(line, index) in siteConfig.about.paragraphs" :key="index" class="cinematic-in" :style="{ '--reveal-delay': `${190 + index * 80}ms` }">
            {{ line }}
          </p>
        </section>

        <div class="cinematic-in" style="--reveal-delay: 380ms;">
          <Footer />
        </div>
      </div>
    </transition>
  </main>
</template>

<script setup lang="ts">
import Footer from '../components/Footer.vue';
import { siteConfig, loadSiteConfig } from '../config/site';

loadSiteConfig();
</script>
