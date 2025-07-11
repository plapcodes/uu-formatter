<script setup lang="ts">
import LayerView from './LayerView.vue';
import AnimatedButton from '@/components/AnimatedButton.vue';
import ExpandingButton from '@/components/ExpandingButton.vue';

import { ref } from 'vue';
import {
  ClipboardIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
} from '@heroicons/vue/24/outline';

const input = ref('');
const parentContainer = ref<HTMLElement | null>(null);
const textInput = ref<HTMLElement | null>(null);
const textOutput = ref<HTMLElement | null>(null);

function updateText(event: Event) {
  const target = event.target as HTMLInputElement;
  input.value = target.value;
}
</script>

<template>
  <main class="h-full">
    <div ref="parentContainer" class="flex flex-row w-full h-full pb-4 gap-4">
      <div class="flex flex-col items-center justify-center h-auto w-1/2 gap-4 pl-6">
        <div class="w-full border-2 border-gray-300 rounded-lg relative flex-1">
          <div class="absolute right-3 top-3 flex gap-2">
            <ExpandingButton text="Contract">
              <template #icon>
                <ArrowsPointingInIcon class="w-7 h-7" />
              </template>
            </ExpandingButton>
            <ExpandingButton text="Expand">
              <template #icon>
                <ArrowsPointingOutIcon class="w-6 h-6" />
              </template>
            </ExpandingButton>
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
        <div class="flex flex-row justify-between w-full flex-none">
          <AnimatedButton text="Copy to Clipboard" background-color="bg-green-500">
            <template #icon>
              <ClipboardIcon class="w-6 h-6" />
            </template>
          </AnimatedButton>
        </div>
        <div class="w-full border-2 border-gray-300 rounded-lg relative flex-1">
          <textarea
            ref="textOutput"
            id="text-output"
            class="w-full h-full"
            type="text"
            :value="input"
            readonly
          />
        </div>
      </div>

      <LayerView />
    </div>
  </main>
</template>

<style lang="css" scoped>
textarea {
  resize: none;
  border: none;
  outline: none;
}
</style>
