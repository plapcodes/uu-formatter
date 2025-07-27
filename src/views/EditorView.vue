<script setup lang="ts">
import LayerView from './LayerView.vue';
import Button from '@/components/ui/button/Button.vue';
import HoverButton from '@/components/HoverButton.vue';
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import ResizablePanelGroup from '@/components/ui/resizable/ResizablePanelGroup.vue';
import ResizableHandle from '@/components/ui/resizable/ResizableHandle.vue';
import ResizablePanel from '@/components/ui/resizable/ResizablePanel.vue';
import { useClipboard } from '@vueuse/core';
import { toast, Toaster } from 'vue-sonner';
import 'vue-sonner/style.css';
import { useColorMode } from '@vueuse/core';
import { useLayerStore } from '@/stores/layer';
import { processLayers } from '@/lib';
import Textarea from '@/components/ui/textarea/Textarea.vue';

const input = ref('');
const output = ref('');
const expandedInput = ref(false);
const { copy } = useClipboard({ source: output.value, legacy: true });
const mode = useColorMode();

const layerStore = useLayerStore();

function updateText() {
  if (layerStore.parentGroup) {
    output.value = processLayers(layerStore.parentGroup, input.value);
  }
}

function handleCopy() {
  if (output.value) {
    copy(output.value);
    toast('Copied to clipboard!', {
      description: 'The text has been copied successfully.',
    });
  }
}

layerStore.$subscribe(() => {
  updateText();
});
</script>

<template>
  <main class="flex-1 shrink-0 min-h-0 h-full">
    <Toaster position="bottom-right" :theme="mode == 'auto' ? 'system' : mode" />
    <ResizablePanelGroup id="editor-group" direction="horizontal" class="h-full w-full gap-3">
      <ResizablePanel id="layer-view-text" :default-size="50">
        <div class="flex flex-col items-center h-full gap-4">
          <div class="textbox flex-1">
            <div class="absolute right-4 top-4 flex items-center gap-2 z-10">
              <span class="text-sm text-muted-foreground select-none">INPUT</span>
              <HoverButton hint="Contract">
                <Button
                  variant="ghost"
                  size="icon"
                  :class="expandedInput ? '' : 'hidden'"
                  @click="expandedInput = false"
                >
                  <Icon icon="heroicons:arrows-pointing-in" />
                </Button>
              </HoverButton>

              <HoverButton hint="Expand">
                <Button
                  variant="ghost"
                  size="icon"
                  :class="expandedInput ? 'hidden' : ''"
                  @click="expandedInput = true"
                >
                  <Icon icon="heroicons:arrows-pointing-out" />
                </Button>
              </HoverButton>
            </div>
            <Textarea
              id="text-input"
              class="w-full h-full resize-none overflow-auto"
              type="text"
              v-model="input"
              @input="updateText"
            />
          </div>

          <div class="textbox flex-1" v-if="!expandedInput">
            <div class="absolute right-4 top-4 flex items-center gap-2 z-10">
              <span class="text-sm text-muted-foreground select-none">OUTPUT</span>
              <HoverButton hint="Copy to Clipboard">
                <Button variant="ghost" size="icon" @click="handleCopy">
                  <Icon icon="heroicons:clipboard" />
                </Button>
              </HoverButton>
            </div>
            <Textarea
              id="text-output"
              type="text"
              :value="output"
              readonly
              class="w-full h-full resize-none overflow-auto"
            />
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle with-handle id="editor-handle" :class="expandedInput ? 'hidden' : ''" />
      <ResizablePanel
        id="layer-view-group"
        class="text-nowrap"
        :default-size="50"
        :class="expandedInput ? 'hidden' : ''"
        ><LayerView
      /></ResizablePanel>
    </ResizablePanelGroup>
  </main>
</template>

<style lang="css" scoped>
textarea {
  padding: 0.5rem;
  margin: 0;
  resize: none;
  border: none;
  outline: none;
  max-height: 150px;
  min-height: 100%;
  box-sizing: border-box;
}

.textbox {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  min-height: 0;
}
</style>
