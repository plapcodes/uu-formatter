<script lang="ts" setup>
import DraggableWrapper from '@/components/DraggableWrapper.vue';
import ExpandingButton from '@/components/ExpandingButton.vue';
import { PlusIcon, FolderPlusIcon } from '@heroicons/vue/24/outline';
import { useLayerStore } from '@/stores/layer';
import { ref } from 'vue';
import type { LayerGroup } from '@/lib';

const layerStore = useLayerStore();

layerStore.$subscribe((mutation, state) => {
  console.log('Layer store updated:', mutation, state);
});

function updateParentGroup(newGroup: LayerGroup) {
  layerStore.$patch({
    parentGroup: newGroup,
  });
}
</script>

<template>
  <div class="layer-view w-1/2 flex flex-col items-center pr-6">
    <div class="w-full flex justify-between items-center">
      <h1 class="text-3xl text-slate-200 font-semibold">Text Processing Layers</h1>
      <div class="flex flex-row gap-4">
        <ExpandingButton text="Add Layer">
          <template #icon>
            <PlusIcon class="w-6 h-6" />
          </template>
        </ExpandingButton>
        <ExpandingButton text="Add Group">
          <template #icon>
            <FolderPlusIcon class="w-6 h-6" />
          </template>
        </ExpandingButton>
      </div>
    </div>

    <div id="layer-list" class="w-full flex-1">
      <DraggableWrapper :group="ref(layerStore.parentGroup)" @update-group="updateParentGroup" />
    </div>
  </div>
</template>
