<script setup lang="ts">
import LayerView from './LayerView.vue';
import Button from '@/components/ui/button/Button.vue';
import HoverButton from '@/components/HoverButton.vue';
import { ref } from 'vue';
import {
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ClipboardIcon,
} from '@heroicons/vue/24/outline';
import ResizablePanelGroup from '@/components/ui/resizable/ResizablePanelGroup.vue';
import ResizableHandle from '@/components/ui/resizable/ResizableHandle.vue';
import ResizablePanel from '@/components/ui/resizable/ResizablePanel.vue';

const input = ref('');
const textInput = ref<HTMLElement | null>(null);
const textOutput = ref<HTMLElement | null>(null);

function updateText(event: Event) {
  const target = event.target as HTMLInputElement;
  input.value = target.value;
}
</script>

<template>
  <main class="h-full">
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
                  <ArrowsPointingInIcon />
                </Button>
              </HoverButton>

              <HoverButton hint="Expand">
                <Button variant="outline" size="icon">
                  <ArrowsPointingOutIcon />
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
                <Button variant="outline" size="icon">
                  <ClipboardIcon />
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
