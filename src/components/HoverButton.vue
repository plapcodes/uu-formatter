<script setup lang="ts">
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

defineProps<{
  hint: string;
}>();
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <slot></slot>
      </TooltipTrigger>
      <TooltipContent class="w-min">
        <p class="text-nowrap text-center">{{ hint }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
