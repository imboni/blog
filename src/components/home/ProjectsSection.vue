<script setup lang="ts">
import { computed } from 'vue';
import ProjectSymbol from './ProjectSymbol.vue';
import type { Project } from '../../api/projects';
const props = defineProps<{ projects: Project[]; loading: boolean; failed: boolean }>();
const emptyMessage = computed(() => props.failed ? '项目加载失败，请稍后再试。' : '暂无项目。');
</script>

<template>
  <section class="projects-section" aria-labelledby="projects-heading" :aria-busy="loading">
    <h2 id="projects-heading" class="section-heading">业余项目</h2>
    <div v-if="loading" class="project-grid" role="status" aria-label="正在加载项目"><div v-for="index in 2" :key="index" class="project-card surface-panel project-skeleton" aria-hidden="true"><span class="skeleton skeleton-period"></span><span class="skeleton skeleton-name"></span><span class="skeleton skeleton-description"></span></div></div>
    <div v-else-if="projects.length" class="project-grid" :class="{ 'project-grid--single': projects.length === 1 }">
      <a v-for="project in projects" :key="project.href" :href="project.href" target="_blank" rel="noopener noreferrer" class="project-card surface-panel">
        <div class="project-meta"><ProjectSymbol :name="project.name" /><span class="project-period">{{ project.period }}</span><svg class="project-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" /></svg></div>
        <h3 class="project-name">{{ project.name }}</h3><p v-if="project.desc" class="project-description">{{ project.desc }}</p>
      </a>
    </div>
    <p v-else class="project-empty empty-state">{{ emptyMessage }}</p>
  </section>
</template>

<style scoped>
.projects-section { margin-top: 44px; }
.section-heading { margin: 0 2px 17px; }
.project-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.project-grid--single { grid-template-columns: minmax(0, 1fr); }
.project-card { display: flex; flex-direction: column; min-width: 0; padding: 21px 23px 24px; border-radius: 22px; text-decoration: none; transition: transform var(--duration-enter) var(--ease-out), box-shadow var(--duration-enter) var(--ease-out); }
.project-meta { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.project-period { margin-left: auto; color: var(--muted); font-size: 11px; line-height: 1.7; font-variant-numeric: tabular-nums; }
.project-arrow { width: 16px; height: 16px; color: var(--muted); opacity: .45; transition: transform var(--duration-enter) var(--ease-out), opacity var(--duration-enter) var(--ease-out); }
.project-name { margin: 18px 0 0; color: var(--ink); font-size: 16px; font-weight: 500; line-height: 1.45; letter-spacing: -.025em; overflow-wrap: anywhere; }
.project-description { margin: 9px 0 0; color: var(--muted); font-size: 13px; line-height: 1.85; overflow-wrap: anywhere; }
.project-card:active { transform: scale(.98); }
.project-empty { margin: 0; padding: 24px; border-radius: 24px; background: var(--glass); }
.project-skeleton { min-height: 152px; gap: 18px; }
.skeleton-period { width: 60px; height: 10px; }
.skeleton-name { width: 55%; height: 18px; }
.skeleton-description { width: 88%; height: 12px; }
@media (hover: hover) and (pointer: fine) { .project-card:hover { transform: translateY(-2px); box-shadow: inset 0 0 0 1px var(--surface-rim), 0 10px 24px var(--shadow); } .project-card:hover .project-arrow { transform: translate(2px, -2px); opacity: 1; } }
@media (max-width: 600px) { .projects-section { margin-top: 34px; } .project-grid { gap: 12px; } .project-card { padding: 20px; border-radius: 20px; } .project-name { font-size: 16px; } }
@media (max-width: 440px) { .project-grid { grid-template-columns: minmax(0, 1fr); } }
</style>
