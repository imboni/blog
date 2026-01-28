<template>
  <Cursor />
  
  <Navbar />

  <router-view />
</template>

<script setup lang="ts">
import Cursor from './components/Cursor.vue'
import Navbar from './components/Navbar.vue'
</script>