<script setup lang="ts">
import LayerView from './LayerView.vue';
import Button from '@/components/ui/button/Button.vue';
import HoverButton from '@/components/HoverButton.vue';
import { ref, watch } from 'vue';
import { Icon } from '@iconify/vue';
import ResizablePanelGroup from '@/components/ui/resizable/ResizablePanelGroup.vue';
import ResizableHandle from '@/components/ui/resizable/ResizableHandle.vue';
import ResizablePanel from '@/components/ui/resizable/ResizablePanel.vue';
import { useClipboard } from '@vueuse/core';
import { toast, Toaster } from 'vue-sonner';
import 'vue-sonner/style.css';
import { useColorMode, useMagicKeys } from '@vueuse/core';
import { useLayerStore } from '@/stores/layer';
import { processLayers, countCharacters } from '@/lib';
import Textarea from '@/components/ui/textarea/Textarea.vue';
import { useConfigStore } from '@/stores/config';

const input = ref('');
const output = ref('');
const expandedInput = ref(false);
const { copy } = useClipboard({ source: output.value, legacy: true });
const mode = useColorMode();

const layerStore = useLayerStore();
const configStore = useConfigStore();

const keys = useMagicKeys();
const ctrlShiftZ = keys['Ctrl+Shift+Z'];
const ctrlZ = keys['Ctrl+Z'];

watch(ctrlShiftZ, (isPressed) => {
  if (isPressed) {
    layerStore.redo();
  }
});

watch(ctrlZ, (isPressed) => {
  if (isPressed && !ctrlShiftZ.value) {
    layerStore.undo();
  }
});

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
  <main class="flex-1 min-h-0">
    <Toaster position="bottom-right" :theme="mode == 'auto' ? 'system' : mode" />
    <ResizablePanelGroup
      id="editor-group"
      direction="horizontal"
      class="responsive-panel-group gap-3 bg-background"
    >
      <ResizablePanel id="layer-view-text" :default-size="50" class="responsive-text-panel">
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
            <div
              v-if="configStore.characterCountingInput"
              class="absolute right-4 bottom-4 flex items-center gap-2 z-10"
            >
              <span class="text-sm text-muted-foreground select-none">
                {{ countCharacters(input, configStore.characterCountingAlgorithm) }} characters
              </span>
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
            <div
              v-if="configStore.characterCountingInput"
              class="absolute right-4 bottom-4 flex items-center gap-2 z-10"
            >
              <span class="text-sm text-muted-foreground select-none">
                {{ countCharacters(output, configStore.characterCountingAlgorithm) }} characters
              </span>
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
      <ResizableHandle
        with-handle
        id="editor-handle"
        :class="expandedInput ? 'hidden' : ''"
        class="responsive-handle hidden md:flex"
      />
      <ResizablePanel
        id="layer-view-group"
        class="text-nowrap responsive-layer-panel"
        :default-size="50"
        :class="expandedInput ? 'hidden' : ''"
      >
        <LayerView />
      </ResizablePanel>
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

/* Mobile responsive styles */
@media (max-width: 767px) {
  .responsive-panel-group {
    flex-direction: column !important;
    padding: 0 !important;
    margin: 0 !important;
    height: 200vh !important;
    max-height: 200vh !important;
    gap: 0 !important;
  }

  .responsive-text-panel {
    flex: 1;
    max-height: calc(100vh - var(--header-height, 48px));
    margin: 0;
    padding: 0.75rem;
  }

  .responsive-layer-panel {
    flex: 1 !important;
    min-height: calc(50vh - 4px);
    margin: 0;
    padding: 0.75rem;
  }

  .responsive-handle {
    min-height: 8px !important;
    max-height: 8px !important;
    height: 8px !important;
    width: 100% !important;
    cursor: row-resize !important;
    flex: 0 0 8px !important;
    margin: 0 !important;
  }

  .responsive-text-panel .textbox {
    min-height: calc(50% - 0.5rem) !important;
    height: calc(50% - 0.5rem) !important;
  }

  /* Remove max-height from textarea on mobile */
  textarea {
    max-height: none !important;
    min-height: 150px;
  }

  /* Make main container full height on mobile */
  main {
    padding: 0 !important;
    margin: 0 !important;
  }
}

/* Desktop styles */
@media (min-width: 768px) {
  .responsive-panel-group {
    flex-direction: row;
  }

  .responsive-handle {
    cursor: col-resize;
  }
}
</style>
