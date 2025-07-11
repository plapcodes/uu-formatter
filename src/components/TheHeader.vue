<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <header class="w-full">
    <nav class="flex flex-row justify-between items-center px-6 p">
      <div class="m-0 p-0 flex items-center">
        <RouterLink to="/" class="p-0 m-0 inline-flex items-center justify-center">
          <img src="/logo.png" alt="Logo" class="h-16 w-16 p-0 m-0" />
        </RouterLink>
      </div>
      <div class="flex items-center gap-8">
        <div class="flex justify-center items-center">
          <RouterLink to="/" class="text-xl font-bold">Editor</RouterLink>
        </div>
        <div class="pflex justify-center items-center">
          <RouterLink to="/about" class="text-xl font-bold">About</RouterLink>
        </div>
      </div>
      <div></div>
    </nav>
  </header>
</template>
