<template>
  <div ref="cursorRef" class="custom-cursor"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import gsap from 'gsap';

const cursorRef = ref<HTMLElement | null>(null);
let moveHandler: ((event: MouseEvent) => void) | null = null;

onMounted(() => {
  const cursorEl = cursorRef.value;
  if (!cursorEl) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

  const moveX = gsap.quickTo(cursorEl, 'x', { duration: 0.5, ease: 'power3.out' });
  const moveY = gsap.quickTo(cursorEl, 'y', { duration: 0.5, ease: 'power3.out' });
  moveHandler = (event) => {
    moveX(event.clientX);
    moveY(event.clientY);
  };
  window.addEventListener('mousemove', moveHandler);
});

onUnmounted(() => {
  if (moveHandler) {
    window.removeEventListener('mousemove', moveHandler);
    moveHandler = null;
  }
});
</script>

<style scoped lang="less">
.custom-cursor {
  position: fixed;
  top: 0;
  left: 0;
  width: 8px;
  height: 8px;
  background-color: #111827;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  opacity: 0.5;
}

@media (hover: none), (pointer: coarse) {
  .custom-cursor {
    display: none;
  }
}
</style>
