<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import Navbar from './components/Navbar.vue';

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Tab' || event.key === 'Enter' || event.key === ' ') document.documentElement.dataset.input = 'keyboard';
};
const onPointerdown = () => { document.documentElement.dataset.input = 'pointer'; };
onMounted(() => {
  document.addEventListener('keydown', onKeydown, true);
  document.addEventListener('pointerdown', onPointerdown, true);
});
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown, true);
  document.removeEventListener('pointerdown', onPointerdown, true);
});
</script>

<template>
  <a class="skip-link" href="#main-content">跳到主要内容</a>
  <Navbar />
  <div id="main-content" tabindex="-1">
    <RouterView v-slot="{ Component, route }">
      <Transition name="route" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </div>
</template>
