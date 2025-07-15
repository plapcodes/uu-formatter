<script setup lang="ts">
import type { Layer, LayerGroup } from '@/lib';
import type { Ref } from 'vue';
import { ref } from 'vue';
import TheLayer from './TheLayer.vue';
import { ChevronDownIcon } from '@heroicons/vue/24/outline';
import { isLayerGroup } from '@/lib';
import draggableComponent from 'vuedraggable';

const ghostDepth = ref(0);

const props = defineProps<{
  group: Ref<LayerGroup>;
  depth: number;
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

function toggleExpansion(group: LayerGroup | Layer) {
  if (!props.group.value) return;
  const newGroup = {
    ...props.group.value,
    layers: props.group.value.layers.map((l) =>
      l.id === group.id ? { ...l, expanded: !l.expanded } : l,
    ),
  };
  emit('updateGroup', newGroup);
}

function updateName(event: Event, element: LayerGroup | Layer): void {
  if (!props.group.value) return;
  const target = event.target as HTMLSpanElement;
  const newGroup = {
    ...props.group.value,
    layers: props.group.value.layers.map((l) =>
      l.id === element.id ? { ...l, name: target.textContent || '' } : l,
    ),
  };
  emit('updateGroup', newGroup);
}

const handlePaste = (e: ClipboardEvent) => {
  e.preventDefault();
  const text = (e.clipboardData?.getData('text') || '').replace(/[\r\n]+/g, ' ');
  (e.target as HTMLElement).textContent = text;
};

const finishEditing = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    (e.target as HTMLElement).blur();
  }
};

function getLayerDepth(
  layer: Layer | LayerGroup,
  currentGroup: LayerGroup,
  currentDepth: number = 0,
): number {
  if (currentGroup.layers.some((l) => l.id === layer.id)) {
    return currentDepth;
  }

  for (const l of currentGroup.layers) {
    if (isLayerGroup(l)) {
      const foundDepth = getLayerDepth(layer, l, currentDepth + 1);
      if (foundDepth !== -1) return foundDepth;
    }
  }
  return -1;
}

function onChange() {
  // This fires during drag operations, causing reactive updates.
  // Necessary for previewing dragget items.
}

function onDragOver(e: DragEvent) {
  // Stop the event from bubbling up to parent draggable components.
  // This ensures only the deepest nested list handles the event.
  e.stopPropagation();
  // When dragging over this list, update the ghost depth to match this list's depth.
  // The ghost's padding should be based on the depth of the list it's being dropped into.
  ghostDepth.value = props.depth;
}
function fixGhostImage(dataTransfer: DataTransfer, dragEl: HTMLElement) {
  const ghostImage = document.createElement('div');
  ghostImage.id = 'ghost-image';
  ghostImage.className = 'ghost-image';
  const h3 = dragEl.querySelector('h3');
  ghostImage.innerHTML =
    '<div class="some-class"><h3>' + (h3 ? h3.textContent : '') + '</h3></div>';
  ghostImage.style.position = 'absolute';
  ghostImage.style.top = '-1000px';
  ghostImage.style.width = dragEl.getBoundingClientRect().width + 'px';
  document.body.appendChild(ghostImage);
  dataTransfer.setDragImage(ghostImage, 30, 20);
}
</script>

<template>
  <draggableComponent
    tag="ul"
    :list="group.value.layers"
    item-key="id"
    :group="{ name: 'layers' }"
    :setData="fixGhostImage"
    @change="onChange"
    ghost-class="ghost"
    :style="{ '--ghost-depth': ghostDepth }"
    @dragover.prevent="onDragOver"
  >
    <template #item="{ element }: { element: LayerGroup | Layer }">
      <div
        :id="element.id"
        class="flex flex-col w-full layer-item py-0.5"
        @click.stop="$emit('selectLayer', element.id)"
      >
        <div
          class="flex flex-col w-full"
          :class="`pl-${getLayerDepth(element, props.group.value, props.depth) * 4} ${element.selected ? 'selected-layer' : ''} ${element.expanded ? 'has-sublayers' : ''}`"
        >
          <div class="flex flex-row gap-4">
            <button class="cursor-pointer" @click.stop="toggleExpansion(element)">
              <ChevronDownIcon
                class="w-4 h-4 text-slate-200"
                :class="!element.expanded ? 'rotate-270' : ''"
              />
            </button>
            <span
              class="text-xl"
              contenteditable="true"
              @blur="updateName($event, element)"
              @keydown.enter.prevent="finishEditing"
              @paste="(e) => handlePaste(e)"
              >{{ element.name }}</span
            >
            <i class="handle"> </i>
          </div>
        </div>
        <div class="sublayers w-full">
          <DraggableWrapper
            v-if="isLayerGroup(element) && element.expanded"
            :group="ref(element)"
            :depth="depth + 1"
            @update-group="updateGroup"
            @select-layer="$emit('selectLayer', $event)"
          />
          <TheLayer
            v-else-if="!isLayerGroup(element) && element.expanded"
            :layer="ref(element)"
            @update-layer="updateLayer"
            @click.stop="$emit('selectLayer', element.id)"
          />
        </div>
      </div>
    </template>
  </draggableComponent>
</template>

<style scoped>
.ghost {
  background: #4a4a4a;
  opacity: 0.5;
  /* Use the CSS variable for padding */
  padding-left: calc(var(--ghost-depth) * 1rem); /* 1rem = pl-4 in tailwind */
}

.drop-target {
  background-color: #4a4a4a;
  border: 1px dashed #ffffff;
}
</style>
