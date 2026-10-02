<script setup lang="ts">
import Footer from '../components/Footer.vue';
import PostsSection from '../components/home/PostsSection.vue';
import ProjectsSection from '../components/home/ProjectsSection.vue';
import ContactsSection from '../components/home/ContactsSection.vue';
import { siteConfig } from '../config/site';
import { useHomeContent } from '../composables/useHomeContent';

const { posts, projects, postsLoading, projectsLoading, postsFailed, projectsFailed, lastUpdatedLabel } = useHomeContent();
</script>

<template>
  <main class="page-shell home-page">
    <header class="home-intro">
      <h1 class="home-title">{{ siteConfig.siteName }}</h1>
      <p class="home-tagline">{{ siteConfig.tagline }}</p>
      <p class="home-description">{{ siteConfig.intro }}</p>
      <div class="home-updated"><span class="home-updated-dot" aria-hidden="true"></span>最近更新 {{ lastUpdatedLabel }}</div>
    </header>
    <PostsSection :posts="posts" :loading="postsLoading" :failed="postsFailed" />
    <ProjectsSection :projects="projects" :loading="projectsLoading" :failed="projectsFailed" />
    <ContactsSection :contacts="siteConfig.contacts" />
    <Footer />
  </main>
</template>

<style scoped>
.home-intro { padding: 10px 0 2px; }
.home-title { margin: 0; color: var(--ink); font-size: clamp(30px, 5vw, 40px); font-weight: 600; line-height: 1.25; letter-spacing: -.045em; }
.home-tagline { margin: 17px 0 0; color: var(--accent); font-size: 15px; font-weight: 500; line-height: 1.8; letter-spacing: .045em; }
.home-description { max-width: 600px; margin: 11px 0 0; color: var(--body); font-size: 16px; line-height: 1.9; }
.home-updated { display: flex; align-items: center; gap: 7px; margin-top: 22px; color: var(--muted); font-size: 12px; line-height: 1.7; font-variant-numeric: tabular-nums; }
.home-updated-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); opacity: .65; }
@media (max-width: 600px) { .home-intro { padding-top: 12px; } .home-description { font-size: 15px; } }
</style>
