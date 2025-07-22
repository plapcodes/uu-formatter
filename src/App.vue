<script setup lang="ts">
import { RouterView } from 'vue-router';
import SidebarProvider from '@/components/ui/sidebar/SidebarProvider.vue';
import SidebarInset from '@/components/ui/sidebar/SidebarInset.vue';
import AppSidebar from './components/AppSidebar.vue';
import Navbar from './components/Navbar.vue';

import { useConfigStore } from './stores/config';

const configStore = useConfigStore();
</script>

<template>
  <div>
    <SidebarProvider class="flex" :default-open="configStore.sidebarOpen">
      <AppSidebar />
      <SidebarInset>
        <header class="w-full flex-shrink-0 pt-1">
          <Navbar />
        </header>
        <article class="p-4 justify-self-center flex-1 flex w-full h-full justify-center">
          <RouterView class="flex" />
        </article>
      </SidebarInset>
    </SidebarProvider>
  </div>
</template>
