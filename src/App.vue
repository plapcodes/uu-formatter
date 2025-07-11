<script setup lang="ts">
import { RouterView } from 'vue-router';
import TheHeader from '@/components/TheHeader.vue';
</script>

<template>
  <TheHeader class="flex-0" />

  <RouterView class="flex" />
</template>
