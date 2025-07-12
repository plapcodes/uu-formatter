<script setup lang="ts">
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

defineProps<{
  hint: string;
}>();
</script>

<template>
  <HoverCard>
    <HoverCardTrigger as-child>
      <slot></slot>
    </HoverCardTrigger>
    <HoverCardContent class="w-min">
      <div class="text-nowrap text-center">{{ hint }}</div>
    </HoverCardContent>
  </HoverCard>
</template>
