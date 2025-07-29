<script setup lang="ts">
import { useLayerStore } from '@/stores/layer';
import CenterScreen from '@/components/CenterScreen.vue';
import Separator from '@/components/ui/separator/Separator.vue';
import HoverButton from '@/components/HoverButton.vue';
import Button from '@/components/ui/button/Button.vue';
import { Icon } from '@iconify/vue';

const layerStore = useLayerStore();
</script>

<template>
  <div class="w-full h-full">
    <CenterScreen>
      <div class="flex flex-col w-full mb-2">
        <h1 class="text-2xl font-bold">Saved Layers</h1>
        <p class="text-sm text-muted-foreground">Here you can view and manage your saved layers.</p>
      </div>
      <Separator orientation="horizontal" />
      <div v-for="element in layerStore.savedLayers" v-bind:key="element.id" class="mt-2">
        <div class="w-full flex items-center justify-between">
          <div class="flex flex-col">
            <span class="text-lg font-semibold">{{ element.name }}</span>
            <span class="text-sm text-muted-foreground">{{ element.description }}</span>
          </div>
          <div class="flex items-center">
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
      </div>
    </CenterScreen>
  </div>
</template>
