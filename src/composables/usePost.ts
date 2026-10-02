import { computed, shallowRef, toValue, watch, type MaybeRefOrGetter } from 'vue';
import { getPosts, type Post } from '../api/blog';

/** Load the current article without allowing an older route request to replace it. */
export function usePost(id: MaybeRefOrGetter<string | string[] | undefined>) {
  const post = shallowRef<Post | null>(null);
  const loading = shallowRef(true);
  const fetchFailed = shallowRef(false);
  const requestVersion = shallowRef(0);

  const emptyMessage = computed(() => fetchFailed.value
    ? '文章加载失败，请稍后再试。'
    : '没有找到这篇文章。');

  watch([() => toValue(id), requestVersion], async ([currentId], _previous, onCleanup) => {
    let active = true;
    onCleanup(() => { active = false; });
    loading.value = true;
    post.value = null;
    fetchFailed.value = false;

    try {
      const posts = await getPosts();
      if (active) post.value = posts.find(item => item.id === Number(currentId)) ?? null;
    } catch {
      if (active) fetchFailed.value = true;
    } finally {
      if (active) loading.value = false;
    }
  }, { immediate: true });

  function retry() {
    requestVersion.value += 1;
  }

  return { post, loading, fetchFailed, emptyMessage, retry };
}
