import { computed, onMounted, shallowRef } from 'vue';
import { getPosts, type Post } from '../api/blog';
import { getProjects, type Project } from '../api/projects';
import { loadSiteConfig } from '../config/site';

export function useHomeContent() {
  const posts = shallowRef<Post[]>([]);
  const projects = shallowRef<Project[]>([]);
  const postsLoading = shallowRef(true);
  const projectsLoading = shallowRef(true);
  const postsFailed = shallowRef(false);
  const projectsFailed = shallowRef(false);
  const lastUpdatedLabel = computed(() => posts.value[0]?.date ?? '—');
  onMounted(() => {
    void loadSiteConfig();
    // A failed request must not hide content from the other section.
    void getPosts()
      .then((data) => { posts.value = [...data].sort((a, b) => b.id - a.id); })
      .catch(() => { postsFailed.value = true; })
      .finally(() => { postsLoading.value = false; });
    void getProjects()
      .then((data) => { projects.value = data; })
      .catch(() => { projectsFailed.value = true; })
      .finally(() => { projectsLoading.value = false; });
  });
  return { posts, projects, postsLoading, projectsLoading, postsFailed, projectsFailed, lastUpdatedLabel };
}
