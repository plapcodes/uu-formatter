<script setup lang="ts">
import type { Layer, LayerGroup, LayerConfig, LayerGroupConfig } from '@/lib';
import { serializeLayer, serializeLayerGroup } from '@/lib';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from '@/components/ui/context-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import Switch from '@/components/ui/switch/Switch.vue';
import Label from '@/components/ui/label/Label.vue';
import Textarea from '@/components/ui/textarea/Textarea.vue';
import Button from '@/components/ui/button/Button.vue';
import { useLayerStore } from '@/stores/layer';
import { ref, onMounted, computed } from 'vue';
import { useClipboard } from '@vueuse/core';
import { toast } from 'vue-sonner';

const layerStore = useLayerStore();

const props = defineProps<{
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

const layerConfig = ref<LayerConfig | LayerGroupConfig | null>(null);
const compressJSON = ref(false);
const useBase64 = ref(false);
const layerJSON = ref('');
const layerJSONOneLine = ref('');
const layerBase64 = ref('');

const { copy: copyToClipboard } = useClipboard();

const textAreaValue = computed(() => {
  if (useBase64.value) {
    return layerBase64.value;
  }
  return compressJSON.value ? layerJSONOneLine.value : layerJSON.value;
});

onMounted(() => {
  if (!props.element) return;
  if ('layers' in props.element) {
    layerConfig.value = serializeLayerGroup(props.element);
  } else {
    layerConfig.value = serializeLayer(props.element);
  }
  layerJSON.value = JSON.stringify(layerConfig.value, null, 2);
  layerJSONOneLine.value = JSON.stringify(layerConfig.value);
  layerBase64.value = btoa(layerJSONOneLine.value);
});

function downloadFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  toast.success(`Downloaded started: ${filename}`);
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

    <DialogContent>
      <DialogHeader>
        <DialogTitle>Export layer {{ 'layers' in element ? 'group' : '' }}</DialogTitle>
        <DialogDescription>
          Export the layer {{ 'layers' in element ? 'group' : '' }} as JSON or compressed (base64)
          format.
        </DialogDescription>
      </DialogHeader>
      <div>
        <div class="flex flex-row items-center justify-between mb-2 gap-2 mx-2">
          <div class="flex flex-row gap-2">
            <Label for="base64">JSON</Label>
            <Switch id="base64" v-model="useBase64" />
            <Label for="base64">Base64</Label>
          </div>
          <div :class="useBase64 ? 'hidden' : ''" class="flex flex-row gap-2">
            <Switch id="compress" v-model="compressJSON" />
            <Label for="compress">Compress JSON</Label>
          </div>
        </div>

        <Textarea class="w-full h-96 text-wrap break-all" v-model="textAreaValue" readonly />
        <div class="mt-2 grid grid-cols-2 gap-2">
          <Button variant="outline" class="w-full" @click="copyToClipboard(textAreaValue)">
            Copy
          </Button>
          <Button
            variant="outline"
            class="w-full"
            @click="downloadFile(useBase64 ? 'layer.uuf' : 'layer.json', textAreaValue)"
          >
            Download
          </Button>
        </div>
      </div>

      <DialogFooter class="sm:justify-start">
        <DialogClose as-child>
          <Button type="button" variant="secondary" class="w-full"> Close </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
