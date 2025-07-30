<script setup lang="ts">
import type { Layer, LayerGroup } from '@/lib';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from '@/components/ui/context-menu';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useLayerStore } from '@/stores/layer';
import LayerExportContent from './LayerExportContent.vue';

const layerStore = useLayerStore();

defineProps<{
  element: Layer | LayerGroup;
}>();

const emit = defineEmits<{
  (e: 'selectLayer', id: string): void;
  (e: 'deleteLayer', id: string): void;
}>();

function onContextMenuOpen(open: boolean, id: string) {
  if (open) {
    emit('selectLayer', id);
  }
}
</script>

<template>
  <Dialog>
    <ContextMenu v-on:update:open="(open) => onContextMenuOpen(open, element.id)">
      <ContextMenuTrigger>
        <slot></slot>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          v-if="!layerStore.isLayerSaved(element)"
          @select="layerStore.saveLayer(element)"
        >
          Bookmark Layer {{ 'layers' in element ? 'Group' : '' }}
        </ContextMenuItem>
        <ContextMenuItem v-else @select="layerStore.deleteSavedLayerByObject(element)">
          Unsave Layer {{ 'layers' in element ? 'Group' : '' }}
        </ContextMenuItem>
        <DialogTrigger aschild>
          <ContextMenuItem> Export Layer </ContextMenuItem>
        </DialogTrigger>

        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive" @select="$emit('deleteLayer', element.id)">
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>

    <LayerExportContent :element="element" />
  </Dialog>
</template>
