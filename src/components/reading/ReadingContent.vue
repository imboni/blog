<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import ImageLightbox from './ImageLightbox.vue';

const props = defineProps<{ markdown: string }>();
const selectedImage = shallowRef<{ src: string; alt: string } | null>(null);

// Raw HTML stays disabled. Markdown-it validates URLs and escapes image attributes.
const markdown = new MarkdownIt({
  html: false,
  highlight(code, language) {
    if (language && hljs.getLanguage(language)) {
      try {
        return hljs.highlight(code, { language }).value;
      } catch { /* Fall back to Markdown-it's escaped code output. */ }
    }
    return '';
  },
});
const renderImage = markdown.renderer.rules.image!;
markdown.renderer.rules.image = (tokens, index, options, environment, renderer) => {
  const token = tokens[index]!;
  token.attrSet('loading', 'lazy');
  token.attrSet('decoding', 'async');
  token.attrSet('tabindex', '0');
  token.attrSet('role', 'button');
  token.attrSet('aria-haspopup', 'dialog');
  token.attrSet('aria-label', token.content ? `查看大图：${token.content}` : '查看大图');
  token.attrSet('data-reading-image', '');
  return renderImage(tokens, index, options, environment, renderer);
};
const renderedContent = computed(() => markdown.render(props.markdown));

function openImage(event: MouseEvent | KeyboardEvent) {
  if (event instanceof KeyboardEvent && event.key !== 'Enter' && event.key !== ' ') return;
  const image = event.target;
  if (!(image instanceof HTMLImageElement) || !image.hasAttribute('data-reading-image')) return;
  if (event instanceof MouseEvent && (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey)) return;
  event.preventDefault();
  event.stopPropagation();
  image.focus({ preventScroll: true });
  selectedImage.value = { src: image.currentSrc || image.src, alt: image.alt };
}

watch(() => props.markdown, () => { selectedImage.value = null; });
</script>

<template>
  <div
    class="markdown-body reading-content"
    @click="openImage"
    @keydown="openImage"
    v-html="renderedContent"
  ></div>
  <ImageLightbox :image="selectedImage" @close="selectedImage = null" />
</template>

<style scoped>
.reading-content :deep(img[data-reading-image]) {
  cursor: zoom-in;
  transition: opacity var(--duration-exit) var(--ease-out);
}
.reading-content :deep(img[data-reading-image]:focus-visible) {
  outline: 2px solid var(--accent);
  outline-offset: 5px;
}
@media (hover: hover) and (pointer: fine) {
  .reading-content :deep(img[data-reading-image]:hover) { opacity: .94; }
}
</style>
