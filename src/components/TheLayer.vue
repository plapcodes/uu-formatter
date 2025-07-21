<script setup lang="ts">
import type { Layer } from '@/lib';
import {
  ACTIVATOR_MANIFEST,
  type ActivatorMetadata,
  createActivator,
  type IActivator,
} from '@/lib/activators';
import {
  SELECTOR_MANIFEST,
  createSelector,
  type ISelector,
  type SelectorMetadata,
} from '@/lib/selectors';
import {
  TRANSFORMER_MANIFEST,
  createTransformer,
  type TransformerMetadata,
  type ITransformer,
} from '@/lib/transformers';
import { onMounted, type Ref, ref } from 'vue';
import HoverButton from '@/components/HoverButton.vue';
import Button from '@/components/ui/button/Button.vue';
import LayerSettingDrawer from '@/components/LayerSettingDrawer.vue';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Icon } from '@iconify/vue';

const props = defineProps<{
  layer: Ref<Layer>;
}>();

const activator = ref('');
const selector = ref('');
const selectionActivator = ref('');
const transformer = ref('');
const activatorManifest = ref<ActivatorMetadata>();
const selectorManifest = ref<SelectorMetadata>();
const selectionActivatorManifest = ref<ActivatorMetadata>();
const transformerManifest = ref<TransformerMetadata>();

const emit = defineEmits<{
  (e: 'updateLayer', layer: Layer): void;
  (e: 'deleteLayer', layer: Layer): void;
}>();

function findActivatorManifest(type: string): ActivatorMetadata | null {
  const selected = ACTIVATOR_MANIFEST.find((a) => a.type === type);
  if (!selected) return null;
  return selected;
}

function findActivator(type: string): [IActivator, ActivatorMetadata] | null {
  const selected = findActivatorManifest(type);
  if (!selected) return null;
  return [createActivator(selected.getDefaultConfig()), selected];
}

function updateLayerActivator() {
  const data = findActivator(activator.value);
  if (!data) return;
  const [newActivator, manifest] = data;
  activatorManifest.value = manifest;
  const updatedLayer: Layer = { ...props.layer.value, layerActivator: newActivator };
  emit('updateLayer', updatedLayer);
}

function updateSelectionActivator() {
  const data = findActivator(selectionActivator.value);
  if (!data) return;
  const [newActivator, manifest] = data;
  selectionActivatorManifest.value = manifest;
  const updatedLayer: Layer = { ...props.layer.value, selectionActivator: newActivator };
  emit('updateLayer', updatedLayer);
}

function findSelectorManifest(type: string): SelectorMetadata | null {
  const selected = SELECTOR_MANIFEST.find((s) => s.type === type);
  if (!selected) return null;
  return selected;
}

function findSelector(type: string): [ISelector, SelectorMetadata] | null {
  const selected = findSelectorManifest(type);
  if (!selected) return null;
  return [createSelector(selected.getDefaultConfig()), selected];
}

function updateLayerSelector() {
  const data = findSelector(selector.value);
  if (!data) return;
  const [newSelector, manifest] = data;
  selectorManifest.value = manifest;
  const updatedLayer: Layer = { ...props.layer.value, selector: newSelector };
  emit('updateLayer', updatedLayer);
}

function findTransformerManifest(type: string): TransformerMetadata | null {
  const selected = TRANSFORMER_MANIFEST.find((t) => t.type === type);
  if (!selected) return null;
  return selected;
}

function findTransformer(type: string): [ITransformer, TransformerMetadata] | null {
  const selected = findTransformerManifest(type);
  if (!selected) return null;
  return [createTransformer(selected.getDefaultConfig()), selected];
}

function updateLayerTransformer() {
  const data = findTransformer(transformer.value);
  if (!data) return;
  const [newTransformer, manifest] = data;
  const updatedLayer: Layer = { ...props.layer.value, transformer: newTransformer };
  transformerManifest.value = manifest;
  emit('updateLayer', updatedLayer);
}

onMounted(() => {
  activator.value = props.layer.value.layerActivator.config.type;
  selector.value = props.layer.value.selector.config.type;
  selectionActivator.value = props.layer.value.selectionActivator.config.type;
  transformer.value = props.layer.value.transformer.config.type;

  const aManifest = findActivatorManifest(activator.value);
  if (aManifest) {
    activatorManifest.value = aManifest;
  }
  const sManifest = findSelectorManifest(selector.value);
  if (sManifest) {
    selectorManifest.value = sManifest;
  }
  const saManifest = findActivatorManifest(selectionActivator.value);
  if (saManifest) {
    selectionActivatorManifest.value = saManifest;
  }
  const tManifest = findTransformerManifest(transformer.value);
  if (tManifest) {
    transformerManifest.value = tManifest;
  }
});
</script>

<template>
  <div class="the-layer flex items-center gap-2 px-4 py-1 flex-wrap justify-center">
    <div class="flex flex-nowrap items-center gap-2">
      <div class="uppercase italic text-muted-foreground">If</div>
      <Select @update:model-value="updateLayerActivator" v-model="activator">
        <SelectTrigger>
          <SelectValue placeholder="Select an Activator" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Default</SelectLabel>
            <SelectItem
              v-for="manifest of ACTIVATOR_MANIFEST"
              v-bind:key="manifest.type"
              :value="manifest.type"
              >{{ manifest.name }}</SelectItem
            >
          </SelectGroup>
        </SelectContent>
      </Select>
      <LayerSettingDrawer
        v-if="activatorManifest != undefined"
        :manifest="activatorManifest"
        :model-value="props.layer.value.layerActivator"
      >
        <HoverButton hint="Edit Layer Activator">
          <Button variant="outline" size="icon">
            <Icon icon="heroicons:pencil-square" />
          </Button>
        </HoverButton>
      </LayerSettingDrawer>
      <div class="uppercase italic text-muted-foreground">Then Select</div>
      <Select @update:model-value="updateLayerSelector" v-model="selector">
        <SelectTrigger>
          <SelectValue placeholder="Select a Selector" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Default</SelectLabel>
            <SelectItem
              v-for="manifest of SELECTOR_MANIFEST"
              v-bind:key="manifest.type"
              :value="manifest.type"
              >{{ manifest.name }}</SelectItem
            >
          </SelectGroup>
        </SelectContent>
      </Select>
      <LayerSettingDrawer
        v-if="selectorManifest != undefined"
        :manifest="selectorManifest"
        :model-value="props.layer.value.selector"
      >
        <HoverButton hint="Edit Layer Selector">
          <Button variant="outline" size="icon">
            <Icon icon="heroicons:pencil-square" />
          </Button>
        </HoverButton>
      </LayerSettingDrawer>
    </div>
    <div class="flex flex-nowrap items-center gap-2">
      <div class="uppercase italic text-muted-foreground">For Each, If</div>
      <Select @update:model-value="updateSelectionActivator" v-model="selectionActivator">
        <SelectTrigger>
          <SelectValue placeholder="Select an Activator" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Default</SelectLabel>
            <SelectItem
              v-for="manifest of ACTIVATOR_MANIFEST"
              v-bind:key="manifest.type"
              :value="manifest.type"
              >{{ manifest.name }}</SelectItem
            >
          </SelectGroup>
        </SelectContent>
      </Select>
      <LayerSettingDrawer
        v-if="selectionActivatorManifest != undefined"
        :manifest="selectionActivatorManifest"
        :model-value="props.layer.value.selectionActivator"
      >
        <HoverButton hint="Edit Selection Activator">
          <Button variant="outline" size="icon">
            <Icon icon="heroicons:pencil-square" />
          </Button>
        </HoverButton>
      </LayerSettingDrawer>
      <div class="uppercase italic text-muted-foreground">DO</div>
      <Select @update:model-value="updateLayerTransformer" v-model="transformer">
        <SelectTrigger>
          <SelectValue placeholder="Select a Transformer" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Default</SelectLabel>
            <SelectItem
              v-for="manifest of TRANSFORMER_MANIFEST"
              v-bind:key="manifest.type"
              :value="manifest.type"
              >{{ manifest.name }}</SelectItem
            >
          </SelectGroup>
        </SelectContent>
      </Select>
      <LayerSettingDrawer
        v-if="transformerManifest != undefined"
        :manifest="transformerManifest"
        :model-value="props.layer.value.transformer"
      >
        <HoverButton hint="Edit Layer Transformer">
          <Button variant="outline" size="icon">
            <Icon icon="heroicons:pencil-square" />
          </Button>
        </HoverButton>
      </LayerSettingDrawer>
    </div>
  </div>
</template>
