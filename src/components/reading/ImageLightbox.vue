<script setup lang="ts">
import { nextTick, onBeforeUnmount, shallowRef, useTemplateRef, watch } from 'vue';

interface ReadingImage { src: string; alt: string }
const props = defineProps<{ image: ReadingImage | null }>();
const emit = defineEmits<{ close: [] }>();
const dialog = useTemplateRef<HTMLDialogElement>('dialog');
const closeButton = useTemplateRef<HTMLButtonElement>('closeButton');
const visible = shallowRef(false);
const displayedImage = shallowRef<ReadingImage | null>(null);
let previousFocus: HTMLElement | null = null;
let previousOverflow: string | null = null;
let requestId = 0;

function releasePage(force = false) {
  // A closing dialog may finish its transition after another image has opened.
  if (!force && (visible.value || props.image)) return;
  if (previousOverflow !== null) {
    document.documentElement.style.overflow = previousOverflow;
    previousOverflow = null;
  }
  if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
  previousFocus = null;
}

watch(() => props.image, async image => {
  const request = ++requestId;
  if (!image) {
    visible.value = false;
    return;
  }
  if (previousOverflow === null) {
    previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
  }
  displayedImage.value = image;
  visible.value = true;
  await nextTick();
  if (request !== requestId || !visible.value || !dialog.value) return;
  if (!dialog.value.open) dialog.value.showModal();
  closeButton.value?.focus({ preventScroll: true });
}, { immediate: true });

function closeFromBackdrop(event: MouseEvent) {
  if (event.target === event.currentTarget) emit('close');
}

onBeforeUnmount(() => {
  requestId += 1;
  releasePage(true);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="image-viewer" @after-leave="releasePage()">
      <dialog
        v-if="visible"
        ref="dialog"
        class="image-viewer"
        aria-label="图片预览"
        @cancel.prevent="emit('close')"
        @click="closeFromBackdrop"
      >
        <button
          ref="closeButton"
          class="icon-button glass-surface image-viewer-close"
          type="button"
          aria-label="关闭图片预览"
          @click="emit('close')"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
        <figure class="image-viewer-figure" @click="closeFromBackdrop">
          <img class="image-viewer-image" :src="displayedImage?.src" :alt="displayedImage?.alt || ''" />
          <figcaption v-if="displayedImage?.alt" class="image-viewer-caption">{{ displayedImage.alt }}</figcaption>
        </figure>
      </dialog>
    </Transition>
  </Teleport>
</template>

<style scoped>
.image-viewer {
  position: fixed;
  inset: 0;
  width: 100%;
  max-width: none;
  height: 100vh;
  height: 100dvh;
  max-height: none;
  margin: 0;
  padding: 72px 32px 32px;
  border: 0;
  background: #17171dcc;
  color: #f7f7fa;
  -webkit-backdrop-filter: blur(18px);
  backdrop-filter: blur(18px);
  overflow: auto;
  overscroll-behavior: contain;
}
.image-viewer[open] { display: grid; place-items: center; }
.image-viewer::backdrop { background: transparent; }
.image-viewer-close {
  position: fixed;
  z-index: 1;
  top: max(20px, env(safe-area-inset-top));
  right: max(24px, env(safe-area-inset-right));
  background: #ffffff20;
  color: #fff;
  box-shadow: inset 0 1px 0 #ffffff33, inset 0 0 0 1px #ffffff14;
}
.image-viewer-close svg { width: 20px; height: 20px; }
.image-viewer-figure {
  width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  transform-origin: center center;
}
.image-viewer-image {
  display: block;
  max-width: 100%;
  max-height: calc(100vh - 160px);
  max-height: calc(100dvh - 160px);
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 16px 56px #00000024;
}
.image-viewer-caption {
  max-width: 640px;
  color: #e9e9ee;
  font-size: 13px;
  line-height: 1.7;
  text-align: center;
}
.image-viewer-enter-active { transition: opacity var(--duration-enter) var(--ease-out); }
.image-viewer-leave-active { transition: opacity var(--duration-exit) var(--ease-out); }
.image-viewer-enter-active .image-viewer-figure { transition: transform var(--duration-enter) var(--ease-out); }
.image-viewer-leave-active .image-viewer-figure { transition: transform var(--duration-exit) var(--ease-out); }
.image-viewer-enter-from,
.image-viewer-leave-to { opacity: 0; }
.image-viewer-enter-from .image-viewer-figure,
.image-viewer-leave-to .image-viewer-figure { transform: scale(.97); }
@media (max-width: 600px) {
  .image-viewer { padding: 76px 16px 32px; }
  .image-viewer-close { right: max(16px, env(safe-area-inset-right)); }
  .image-viewer-image { border-radius: 8px; }
}
@media (prefers-reduced-motion: reduce) {
  .image-viewer-enter-active,
  .image-viewer-leave-active,
  .image-viewer-enter-active .image-viewer-figure,
  .image-viewer-leave-active .image-viewer-figure { transition: none; }
  .image-viewer-enter-from .image-viewer-figure,
  .image-viewer-leave-to .image-viewer-figure { transform: none; }
}
</style>
