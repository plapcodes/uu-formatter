<script setup lang="ts">
import type { Layer, LayerGroup } from '@/lib';
import type { Ref } from 'vue';
import { ref } from 'vue';
import TheLayer from './TheLayer.vue';
import { ChevronDownIcon } from '@heroicons/vue/24/outline';
import { isLayerGroup } from '@/lib';
import draggableComponent from 'vuedraggable';

const props = defineProps<{
  group: Ref<LayerGroup>;
}>();

const emit = defineEmits<{
  (e: 'updateGroup', group: LayerGroup): void;
  (e: 'selectLayer', id: string): void;
}>();

function updateLayer(layer: Layer) {
  if (!props.group.value) return;
  const newGroup = {
    ...props.group.value,
    layers: props.group.value.layers.map((l) => (l.id === layer.id ? layer : l)),
  };
  emit('updateGroup', newGroup);
}

function updateGroup(group: LayerGroup) {
  if (!props.group.value) return;
  const newGroup = {
    ...props.group.value,
    layers: props.group.value.layers.map((l) => (l.id === group.id ? group : l)),
  };
  emit('updateGroup', newGroup);
}

function toggleGroupExpansion(group: LayerGroup | Layer) {
  if (!props.group.value) return;
  const newGroup = {
    ...props.group.value,
    layers: props.group.value.layers.map((l) =>
      l.id === group.id ? { ...l, expanded: !l.expanded } : l,
    ),
  };
  emit('updateGroup', newGroup);
}
</script>

<template>
  <draggableComponent tag="ul" :list="group.value.layers" item-key="id" :group="{ name: 'layers' }">
    <template #item="{ element }: { element: LayerGroup | Layer }">
      <div
        class="flex flex-col w-full"
        :class="element.selected ? 'selected-layer' : ''"
        @click.stop="$emit('selectLayer', element.id)"
      >
        <div class="the-layer-group flex flex-col w-full">
          <div class="flex flex-row gap-4">
            <button class="cursor-pointer" @click.stop="toggleGroupExpansion(element)">
              <ChevronDownIcon
                class="w-4 h-4 text-slate-200"
                :class="!element.expanded ? 'rotate-270' : ''"
              />
            </button>
            <span class="text-xl">{{ element.name }}</span>
            <i class="handle"> </i>
          </div>
        </div>
        <div v-if="element.expanded" class="sublayers w-full pl-4">
          <DraggableWrapper
            v-if="isLayerGroup(element)"
            :group="ref(element)"
            @update-group="updateGroup"
            @select-layer="$emit('selectLayer', $event)"
          />
          <TheLayer
            v-else
            :layer="ref(element)"
            @update-layer="updateLayer"
            @click.stop="$emit('selectLayer', element.id)"
          />
        </div>
      </div>
    </template>
  </draggableComponent>
</template>
