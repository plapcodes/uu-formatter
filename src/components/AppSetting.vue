<script setup lang="ts">
import Input from '@/components/ui/input/Input.vue';
import Switch from '@/components/ui/switch/Switch.vue';

const props = defineProps<{
  name: string;
  description: string;
}>();

const model = defineModel<string | boolean | number>();
</script>

<template>
  <div class="flex flex-row min-w-sm items-center w-full">
    <div class="flex flex-row justify-between flex-1 w-full min-w-0">
      <div class="flex flex-col">
        <h2 class="text-lg font-semibold">{{ props.name }}</h2>
        <p class="text-sm text-muted-foreground">{{ props.description }}</p>
      </div>
      <div class="flex flex-row items-center">
        <Input v-if="typeof model === 'string'" v-model="model" placeholder="Enter value" />
        <Switch v-else-if="typeof model === 'boolean'" v-model="model" />
        <Input
          v-else-if="typeof model === 'number'"
          type="number"
          v-model.number="model"
          placeholder="Enter number"
        />
      </div>
    </div>
  </div>
</template>
