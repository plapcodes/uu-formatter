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

const input = ref('');
const output = ref('');
const { text, copy } = useClipboard({ source: output.value, legacy: true });
const textInput = ref<HTMLElement | null>(null);
const textOutput = ref<HTMLElement | null>(null);
const mode = useColorMode();

function updateText(event: Event) {
  const target = event.target as HTMLInputElement;
  input.value = target.value;
  output.value = input.value;
}

function handleCopy() {
  if (output.value) {
    copy(output.value);
    toast('Copied to clipboard!', {
      description: 'The text has been copied successfully.',
    });
  }
}
</script>

<template>
  <main class="flex-1 shrink-0 min-h-0 h-full">
    <Toaster position="bottom-right" :theme="mode == 'auto' ? 'system' : mode" />
    <ResizablePanelGroup
      id="editor-group"
      direction="horizontal"
      class="h-full w-full px-4 pb-4 gap-3"
    >
      <ResizablePanel id="layer-view-text" :default-size="50">
        <div class="flex flex-col items-center justify-center h-full gap-4">
          <div class="textbox">
            <div class="absolute right-3 top-3 flex gap-2">
              <HoverButton hint="Contract">
                <Button variant="outline" size="icon">
                  <Icon icon="heroicons:arrows-pointing-in" />
                </Button>
              </HoverButton>

              <HoverButton hint="Expand">
                <Button variant="outline" size="icon">
                  <Icon icon="heroicons:arrows-pointing-out" />
                </Button>
              </HoverButton>
            </div>
            <textarea
              ref="textInput"
              id="text-input"
              class="w-full h-full"
              type="text"
              :value="input"
              @input="(event) => updateText(event)"
            />
          </div>

          <div class="textbox">
            <div class="absolute right-3 top-3 flex gap-2">
              <HoverButton hint="Copy to Clipboard">
                <Button variant="outline" size="icon" @click="handleCopy">
                  <Icon icon="heroicons:clipboard" />
                </Button>
              </HoverButton>
            </div>
            <textarea
              ref="textOutput"
              id="text-output"
              class="w-full h-full bg-secondary"
              type="text"
              :value="input"
              readonly
            />
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle with-handle id="editor-handle" />
      <ResizablePanel id="layer-view-group" class="text-nowrap" :default-size="50"
        ><LayerView
      /></ResizablePanel>
    </ResizablePanelGroup>
  </main>
</template>

<style lang="css" scoped>
textarea {
  resize: none;
  border: none;
  outline: none;
  height: 100%;
}
</style>
