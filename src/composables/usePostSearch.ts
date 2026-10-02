import { computed, shallowRef, watch, type Ref } from 'vue';
import Fuse from 'fuse.js';
import type { Post } from '../api/blog';

type MatchRange = [number, number];
export type HighlightSegment = { text: string; match: boolean };
export type PostSearchResult = { post: Post; segments: HighlightSegment[] };

function highlightTitle(title: string, ranges: MatchRange[]): HighlightSegment[] {
  if (!ranges.length) return [{ text: title, match: false }];
  const merged: MatchRange[] = [];
  for (const range of [...ranges].sort((a, b) => a[0] - b[0])) {
    const previous = merged[merged.length - 1];
    if (previous && range[0] <= previous[1] + 1) previous[1] = Math.max(previous[1], range[1]);
    else merged.push([...range]);
  }
  const segments: HighlightSegment[] = [];
  let cursor = 0;
  for (const [start, end] of merged) {
    if (start > cursor) segments.push({ text: title.slice(cursor, start), match: false });
    segments.push({ text: title.slice(start, end + 1), match: true });
    cursor = end + 1;
  }
  if (cursor < title.length) segments.push({ text: title.slice(cursor), match: false });
  return segments.filter((segment) => segment.text.length > 0);
}

export function usePostSearch(posts: Readonly<Ref<Post[]>>) {
  const searchQuery = shallowRef('');
  const page = shallowRef(1);
  const pageSize = 5;
  const query = computed(() => searchQuery.value.trim());
  const isSearching = computed(() => query.value.length > 0);
  const fuse = computed(() => new Fuse(posts.value, {
    keys: [{ name: 'title', weight: .55 }, { name: 'tags', weight: .15 }, { name: 'body', weight: .30 }],
    threshold: .35, ignoreLocation: true, includeMatches: true,
  }));
  const results = computed<PostSearchResult[]>(() => {
    if (!query.value) return posts.value.map((post) => ({ post, segments: [{ text: post.title, match: false }] }));
    return fuse.value.search(query.value).map((result) => ({
      post: result.item,
      segments: highlightTitle(result.item.title, (result.matches ?? [])
        .filter((match) => match.key === 'title')
        .flatMap((match) => match.indices as MatchRange[])),
    }));
  });
  const visibleResults = computed(() => results.value.slice(0, page.value * pageSize));
  const hasMore = computed(() => results.value.length > page.value * pageSize);
  watch(query, () => { page.value = 1; }, { flush: 'sync' });
  function loadMore() { if (hasMore.value) page.value += 1; }
  function resetPage() { page.value = 1; }
  return { searchQuery, page, pageSize, isSearching, results, visibleResults, hasMore, loadMore, resetPage };
}
