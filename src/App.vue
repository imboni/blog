<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from './components/Navbar.vue';
import { cancelRouteScroll, markRouteReady } from './router';

const currentRoute = useRoute();
let readyFrame = 0;
function onRouteEnter(element: Element) {
  cancelAnimationFrame(readyFrame);
  // Give cached article data a microtask to render, then restore scroll while opacity is zero.
  readyFrame = requestAnimationFrame(() => {
    if (!element.isConnected) return;
    const path = element.getAttribute('data-route-path');
    if (path) markRouteReady(path);
  });
}

const onKeydown = (event: KeyboardEvent) => {
  if (!['Shift', 'Control', 'Meta', 'Alt'].includes(event.key)) document.documentElement.dataset.input = 'keyboard';
};
const onPointerdown = () => { document.documentElement.dataset.input = 'pointer'; };
onMounted(() => {
  document.addEventListener('keydown', onKeydown, true);
  document.addEventListener('pointerdown', onPointerdown, true);
  markRouteReady(currentRoute.fullPath);
});
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown, true);
  document.removeEventListener('pointerdown', onPointerdown, true);
  cancelAnimationFrame(readyFrame);
  cancelRouteScroll();
});
</script>

<template>
  <a class="skip-link" href="#main-content">跳到主要内容</a>
  <Navbar />
  <div id="main-content" tabindex="-1">
    <RouterView v-slot="{ Component, route }">
      <Transition name="route" mode="out-in" @enter="onRouteEnter">
        <KeepAlive include="Index" :max="1">
          <component :is="Component" :key="route.path" :data-route-path="route.fullPath" />
        </KeepAlive>
      </Transition>
    </RouterView>
  </div>
</template>
