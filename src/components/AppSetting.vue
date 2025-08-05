<script setup lang="ts">
import Input from '@/components/ui/input/Input.vue';
import Switch from '@/components/ui/switch/Switch.vue';
import { computed, onMounted } from 'vue';

const props = defineProps<{
  name: string;
  description: string;
}>();

const model = defineModel<string | boolean | number>();

const numberModel = computed({
  get: () => model.value as number,
  set: (value: number) => {
    model.value = Number(value);
  },
});

onMounted(() => {
  console.log(typeof model.value);
});
</script>

<template>
  <div class="flex flex-row min-w-3xs items-center">
    <div class="flex flex-row justify-between flex-1 min-w-0 gap-4">
      <div class="flex flex-col">
        <h2 class="text-lg font-semibold">{{ props.name }}</h2>
        <p class="text-sm text-muted-foreground">{{ props.description }}</p>
      </div>
      <div class="flex flex-row items-center">
        <Input
          v-if="typeof model === 'number'"
          type="number"
          v-model.number="numberModel"
          placeholder="Enter number"
        />
        <Input v-else-if="typeof model === 'string'" v-model="model" placeholder="Enter value" />
        <Switch v-else-if="typeof model === 'boolean'" v-model="model" />
      </div>
    </div>
  </div>
</template>
