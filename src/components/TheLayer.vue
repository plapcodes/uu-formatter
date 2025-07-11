<script setup lang="ts">
import type { Layer } from '@/lib';
import type { Ref } from 'vue';

const props = defineProps<{
  layer: Ref<Layer>;
}>();

const emit = defineEmits<{
  (e: 'updateLayer', layer: Layer): void;
}>();

const updateLayerName = (event: Event) => {
  const target = event.target as HTMLSpanElement;
  const newLayer: Layer = { ...props.layer.value, name: target.textContent || '' };
  emit('updateLayer', newLayer);
};

const handlePaste = (e: ClipboardEvent) => {
  e.preventDefault();
  const text = (e.clipboardData?.getData('text') || '').replace(/[\r\n]+/g, ' ');
  (e.target as HTMLElement).textContent = text;
};
</script>

<template>
  <div class="the-layer">
    <span
      contenteditable="true"
      @input="updateLayerName"
      @keydown.enter.prevent
      @paste="(e) => handlePaste(e)"
      >{{ props.layer.value.name }}</span
    >
  </div>
</template>
