<script setup lang="ts">
import { RouterView } from 'vue-router';
import TheHeader from '@/components/TheHeader.vue';
</script>

<template>
  <TheHeader class="flex-none" />

  <RouterView class="flex" />
</template>
