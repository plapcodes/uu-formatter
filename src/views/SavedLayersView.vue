<script setup lang="ts">
import { useLayerStore } from '@/stores/layer';
import CenterScreen from '@/components/CenterScreen.vue';
import Separator from '@/components/ui/separator/Separator.vue';
import HoverButton from '@/components/HoverButton.vue';
import Button from '@/components/ui/button/Button.vue';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Icon } from '@iconify/vue';
import LayerExportContent from '@/components/LayerExportContent.vue';
import LayerImportContent from '@/components/LayerImportContent.vue';

const layerStore = useLayerStore();
</script>

<template>
  <div class="w-full h-full">
    <CenterScreen>
      <div class="flex flex-row justify-between items-center">
        <div class="flex flex-col w-full mb-2">
          <h1 class="text-2xl font-bold">Saved Layers</h1>
          <p class="text-sm text-muted-foreground">
            Here you can view and manage your saved layers.
          </p>
        </div>
        <div class="flex flex-row items-center">
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
                  layerStore.addLayerOrGroupToSaved(layer);
                }
              "
            />
          </Dialog>
        </div>
      </div>

      <Separator orientation="horizontal" />
      <div v-for="element in layerStore.savedLayers" v-bind:key="element.id" class="mt-2">
        <Dialog>
          <div class="w-full flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-lg font-semibold">{{ element.name }}</span>
              <span class="text-sm text-muted-foreground">{{ element.description }}</span>
            </div>
            <div class="flex items-center gap-2">
              <HoverButton hint="Export layer">
                <DialogTrigger as-child>
                  <Button variant="outline" size="icon">
                    <Icon icon="heroicons:arrow-down-on-square" />
                  </Button>
                </DialogTrigger>
              </HoverButton>
              <HoverButton hint="Remove from saved layers">
                <Button
                  variant="destructive"
                  size="icon"
                  @click="layerStore.deleteSavedLayerByObject(element)"
                >
                  <Icon icon="heroicons:trash" />
                </Button>
              </HoverButton>
            </div>
          </div>
          <LayerExportContent :element="element" />
        </Dialog>
      </div>
    </CenterScreen>
  </div>
</template>
