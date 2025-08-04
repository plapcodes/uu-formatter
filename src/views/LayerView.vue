<script lang="ts" setup>
import DraggableWrapper from '@/components/DraggableWrapper.vue';
import { Icon } from '@iconify/vue';
import { useLayerStore } from '@/stores/layer';
import { onMounted, ref } from 'vue';
import type { LayerGroup } from '@/lib';
import Button from '@/components/ui/button/Button.vue';
import HoverButton from '@/components/HoverButton.vue';
import ScrollArea from '@/components/ui/scroll-area/ScrollArea.vue';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import LayerImportContent from '@/components/LayerImportContent.vue';

const layerStore = useLayerStore();

onMounted(() => {
  layerStore.initializeParentGroup();
});

function updateParentGroup(newGroup: LayerGroup) {
  layerStore.$patch({
    parentGroup: newGroup,
  });
}

function addLayer() {
  layerStore.addLayer();
}

function addGroup() {
  layerStore.addLayerGroup();
}
</script>

<template>
  <div class="layer-view flex flex-col items-center gap-2 h-full max-h-full">
    <div class="w-full flex justify-between items-center flex-0">
      <h1 class="text-2xl font-bold">Text Processing Layers</h1>
      <div class="flex flex-row gap-4 items-center">
        <Dialog>
          <HoverButton hint="Import Layer">
            <DialogTrigger as-child>
              <Button variant="outline" size="icon">
                <Icon icon="heroicons:cloud-arrow-up" />
              </Button>
            </DialogTrigger>
          </HoverButton>

          <LayerImportContent
            @layer-imported="
              (layer) => {
                layerStore.addLayerOrGroupToEditor(layer);
              }
            "
          />
        </Dialog>
        <HoverButton hint="Add Layer">
          <Button variant="outline" size="icon" @click="addLayer">
            <Icon icon="heroicons:plus" />
          </Button>
        </HoverButton>

        <HoverButton hint="Add Layer Group">
          <Button variant="outline" size="icon" @click="addGroup">
            <Icon icon="heroicons:folder-plus" />
          </Button>
        </HoverButton>
      </div>
    </div>

    <ScrollArea class="w-full flex-1 min-h-0 max-h-full">
      <DraggableWrapper
        v-if="layerStore.parentGroup !== null"
        :group="ref(layerStore.parentGroup)"
        :depth="0"
        @update-group="updateParentGroup"
        @select-layer="layerStore.selectLayer"
        @delete-layer="layerStore.deleteLayer"
      />
    </ScrollArea>
  </div>
</template>
