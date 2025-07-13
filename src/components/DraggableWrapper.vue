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
  depth: number;
}>();

const emit = defineEmits<{
  (e: 'updateGroup', group: LayerGroup): void;
  (e: 'selectLayer', id: string): void;
}>();

interface DndMoveEvent {
  related: HTMLElement;
  from: HTMLElement;
  to: HTMLElement;
  draggedContext: {
    element?: Layer | LayerGroup;
    futureIndex: number;
  };
  relatedContext: {
    element?: Layer | LayerGroup;
  };
}

interface DndEndEvent {
  oldIndex?: number;
  newIndex?: number;
  from: HTMLElement;
  to: HTMLElement;
}

const dropTargetId = ref<string | null>(null);

function onMove(event: DndMoveEvent): boolean {
  const targetEl = event.relatedContext.element;

  const oldTarget = document.querySelector('.drop-target');
  if (oldTarget && oldTarget.id !== targetEl?.id) {
    oldTarget.classList.remove('drop-target');
    dropTargetId.value = null;
  }

  if (targetEl && isLayerGroup(targetEl) && !targetEl.expanded) {
    event.related.classList.add('drop-target');
    dropTargetId.value = targetEl.id;
    return false;
  }

  return true;
}

function onEnd(event: DndEndEvent) {
  const oldTarget = document.querySelector('.drop-target');
  if (oldTarget) {
    oldTarget.classList.remove('drop-target');
  }

  if (dropTargetId.value && event.oldIndex !== undefined) {
    const sourceGroup = props.group.value;
    const draggedItem = sourceGroup.layers[event.oldIndex];

    if (draggedItem && isLayerGroup(draggedItem) && draggedItem.id === dropTargetId.value) {
      dropTargetId.value = null;
      return;
    }

    const findAndMove = (currentGroup: LayerGroup): LayerGroup => {
      const targetGroup = currentGroup.layers.find(
        (l) => l.id === dropTargetId.value,
      ) as LayerGroup;

      if (targetGroup && isLayerGroup(targetGroup)) {
        const newSourceLayers = sourceGroup.layers.filter((l) => l.id !== draggedItem.id);
        targetGroup.layers.unshift(draggedItem);
        return {
          ...sourceGroup,
          layers: newSourceLayers.map((l) => (l.id === targetGroup.id ? targetGroup : l)),
        };
      } else {
        return {
          ...currentGroup,
          layers: currentGroup.layers.map((l) => (isLayerGroup(l) ? findAndMove(l) : l)),
        };
      }
    };

    const newGroup = findAndMove(sourceGroup);
    emit('updateGroup', newGroup);
  }

  dropTargetId.value = null;
}

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
</script>

<template>
  <draggableComponent
    tag="ul"
    :list="group.value.layers"
    item-key="id"
    :group="{ name: 'layers' }"
    :move="onMove"
    @end="onEnd"
  >
    <template #item="{ element }: { element: LayerGroup | Layer }">
      <div
        :id="element.id"
        class="flex flex-col w-full layer-item"
        :class="[element.selected ? 'selected-layer' : '', element.expanded ? 'has-sublayers' : '']"
        @click.stop="$emit('selectLayer', element.id)"
      >
        <div class="flex flex-col w-full" :class="`pl-${depth * 4}`">
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
.drop-target {
  background-color: #4a4a4a;
  border: 1px dashed #ffffff;
}
</style>
