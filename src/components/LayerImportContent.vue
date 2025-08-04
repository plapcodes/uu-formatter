<script setup lang="ts">
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import Button from '@/components/ui/button/Button.vue';
import { computed, ref, watch, type Ref } from 'vue';
import Input from '@/components/ui/input/Input.vue';
import Textarea from '@/components/ui/textarea/Textarea.vue';
import Label from '@/components/ui/label/Label.vue';
import type { Layer, LayerGroup } from '@/lib';
import { makeLayer, makeLayerGroup } from '@/lib';
import { Icon } from '@iconify/vue';
import HoverButton from './HoverButton.vue';

const emit = defineEmits<{
  (e: 'layer-imported', layer: Layer | LayerGroup): void;
}>();

const form = ref<HTMLFormElement | null>(null);
const fileInput = ref('');
const layer: Ref<Layer | LayerGroup | null> = ref(null);
const input = ref('');

const isLayerValid = computed(() => {
  return layer.value !== null && typeof layer.value === 'object';
});

function parseInput(input: string): Layer | LayerGroup | null {
  try {
    const parsed = JSON.parse(input);
    if ('layers' in parsed) {
      return makeLayerGroup(parsed, true);
    } else {
      return makeLayer(parsed, true);
    }
  } catch (e) {
    return null;
  }
}

watch(input, (newValue) => {
  layer.value = parseInput(newValue);
  if (!layer.value) {
    // attempt to parse as base64
    try {
      const parsedBase64 = atob(newValue);
      layer.value = parseInput(parsedBase64);
    } catch (e) {
      layer.value = null;
    }
  }
});

function previewFile(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      fileInput.value = e.target?.result as string;
      input.value = fileInput.value;
    };
    reader.readAsText(file);
  } else {
    input.value = '';
  }
}

function reimport() {
  if (!form.value || !fileInput.value) return;
  input.value = fileInput.value;
}

function pasteFromClipboard() {
  navigator.clipboard
    .readText()
    .then((text) => {
      input.value = text;
    })
    .catch((err) => {
      console.error('Failed to read clipboard contents: ', err);
    });
}
</script>

<template>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Import layer / layer group</DialogTitle>
    </DialogHeader>
    <DialogDescription>
      Import a layer or layer group from JSON or base64 format. You can paste the content directly
      into the textarea below.
    </DialogDescription>
    <div>
      <div class="mt-2 grid grid-cols-2 gap-2 mb-2">
        <div class="flex flex-col justify-end">
          <Button variant="outline" class="w-full" @click="pasteFromClipboard"> Paste </Button>
        </div>
        <form ref="form" class="">
          <div class="flex flex-row justify-between items-center mb-0.5 ml-2">
            <Label for="importfile" class="">From file</Label>
            <HoverButton hint="Reload file">
              <Button variant="ghost" size="icon" @click="reimport" type="button">
                <Icon icon="heroicons:arrow-path" />
              </Button>
            </HoverButton>
          </div>

          <Input id="importfile" type="file" :onchange="previewFile" />
        </form>
      </div>

      <Textarea class="w-full h-96 text-wrap break-all" v-model="input" />
    </div>
    <span>{{
      isLayerValid ? '' : "Layer configuration couldn't be parsed, import impossible."
    }}</span>
    <DialogFooter class="sm:justify-start">
      <DialogClose as-child>
        <Button
          v-if="isLayerValid && layer != null"
          type="button"
          variant="default"
          @click="emit('layer-imported', layer)"
        >
          Import
        </Button>
        <Button v-else type="button" variant="default" disabled> Import </Button>
      </DialogClose>
      <DialogClose as-child>
        <Button type="button" variant="secondary"> Close </Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</template>
