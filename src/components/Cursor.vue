<template>
  <div ref="cursorRef" class="custom-cursor"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import gsap from 'gsap';

const cursorRef = ref<HTMLElement | null>(null);

onMounted(() => {
  window.addEventListener('mousemove', (e) => {
    gsap.to(cursorRef.value, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.5,
      ease: "power3.out"
    });
  });
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
</style>
