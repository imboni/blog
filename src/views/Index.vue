<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import Footer from '../components/Footer.vue';
import PostsSection from '../components/home/PostsSection.vue';
import ProjectsSection from '../components/home/ProjectsSection.vue';
import ContactsSection from '../components/home/ContactsSection.vue';
import { siteConfig } from '../config/site';
import { useHomeContent } from '../composables/useHomeContent';
import { useHomeEntrance } from '../composables/useHomeEntrance';

const props = defineProps<{ initialEntry?: boolean }>();
const homePage = useTemplateRef<HTMLElement>('homePage');
useHomeEntrance(homePage, { enabled: props.initialEntry === true });

const greeting = computed(() => {
  const match = /^(Welcome!)\s*(.+)$/.exec(siteConfig.value.siteName);
  return match ? { welcome: match[1], name: match[2] } : { welcome: '', name: siteConfig.value.siteName };
});

const { posts, projects, postsLoading, projectsLoading, postsFailed, projectsFailed, lastUpdatedLabel } = useHomeContent();
</script>

<template>
  <main ref="homePage" class="page-shell home-page">
    <header class="home-intro">
      <div class="home-intro-top">
        <div class="home-intro-identity" data-home-enter="0">
          <h1 class="home-title"><span v-if="greeting.welcome" class="home-welcome">{{ greeting.welcome }} </span><span class="home-name">{{ greeting.name }}</span></h1>
          <p class="home-tagline">{{ siteConfig.tagline }}</p>
        </div>
        <div class="home-portrait" data-home-enter="25" aria-hidden="true"><img src="/logo.png" alt="" width="88" height="88" /></div>
      </div>
      <p class="home-description" data-home-enter="55">{{ siteConfig.intro }}</p>
      <div class="home-updated" data-home-enter="80"><span>最近更新</span><span class="home-updated-date">{{ lastUpdatedLabel }}</span></div>
    </header>
    <PostsSection data-home-enter="105" :posts="posts" :loading="postsLoading" :failed="postsFailed" />
    <ProjectsSection data-home-enter="135" :projects="projects" :loading="projectsLoading" :failed="projectsFailed" />
    <ContactsSection data-home-enter="165" :contacts="siteConfig.contacts" />
    <Footer data-home-enter="190" />
  </main>
</template>

<style scoped>
.home-intro { padding: 10px 0 4px; }
.home-intro-top { display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.home-intro-identity { min-width: 0; }
.home-title { margin: 0; color: var(--ink); font-weight: 500; }
.home-welcome { display: block; margin-bottom: 9px; color: var(--muted); font-size: 14px; line-height: 1.6; letter-spacing: .01em; font-weight: 400; }
.home-name { display: block; font-size: clamp(36px, 5vw, 46px); line-height: 1.12; letter-spacing: -.05em; overflow-wrap: anywhere; }
.home-tagline { margin: 17px 0 0; color: var(--accent); font-size: 13px; font-weight: 500; line-height: 1.8; letter-spacing: .06em; }
.home-portrait { flex: none; width: 94px; height: 94px; margin-right: 5px; padding: 5px; border-radius: 29px; background: var(--glass); box-shadow: inset 0 1px 0 var(--edge), inset 0 0 0 1px var(--rim), 0 8px 20px var(--shadow); transform: rotate(3deg); }
.home-portrait img { width: 84px; height: 84px; border-radius: 24px; object-fit: cover; }
.home-description { max-width: 31em; margin: 26px 0 0; color: var(--body); font-size: 15px; line-height: 1.95; text-wrap: pretty; }
.home-updated { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; margin-top: 19px; color: var(--muted); font-size: 11px; line-height: 1.8; }
.home-updated-date { font-variant-numeric: tabular-nums; letter-spacing: .015em; }
@media (max-width: 600px) {
  .home-intro { padding-top: 8px; }
  .home-intro-top { gap: 16px; }
  .home-portrait { width: 76px; height: 76px; padding: 4px; margin-right: 3px; border-radius: 24px; }
  .home-portrait img { width: 68px; height: 68px; border-radius: 20px; }
  .home-name { font-size: 38px; }
  .home-description { margin-top: 22px; font-size: 14px; }
}
@media (max-width: 360px) { .home-name { font-size: 34px; } .home-portrait { width: 66px; height: 66px; } .home-portrait img { width: 58px; height: 58px; border-radius: 18px; } }
</style>
