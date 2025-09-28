<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { Button } from '@/components/ui/button'

const {
  offlineReady,
  needRefresh,
  updateServiceWorker,
} = useRegisterSW()

async function close() {
  offlineReady.value = false
  needRefresh.value = false
}

// for testing:
const forceShow = false;
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="transform translate-y-4 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform translate-y-4 opacity-0"
  >
    <div
      v-if="offlineReady || needRefresh || forceShow"
      class="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border border-border bg-background p-4 shadow-lg ring-1 ring-black/5 dark:ring-white/10"
      role="alert"
    >
      <div class="mb-3 text-sm font-medium text-foreground">
        <span v-if="offlineReady" class="flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-green-500"></span>
          App ready to work offline
        </span>
        <span v-else class="flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
          New content available, click reload to update.
        </span>
      </div>
      <div class="flex gap-2">
        <Button v-if="needRefresh || forceShow" size="sm" @click="updateServiceWorker()">
          Reload
        </Button>
        <Button variant="outline" size="sm" @click="close">
          Close
        </Button>
      </div>
    </div>
  </Transition>
</template>
