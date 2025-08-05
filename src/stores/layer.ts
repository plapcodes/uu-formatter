import { defineStore, type StateTree } from 'pinia';
import {
  defaultParentGroup,
  defaultLayer,
  defaultLayerGroup,
  serializeLayerGroup,
  serializeLayer,
  makeLayerGroup,
  makeLayer,
} from '@/lib';
import type { LayerGroup, Layer, LayerGroupConfig, LayerConfig } from '@/lib';
import { deselectAll } from '@/lib';
import { useConfigStore } from './config';

const configStore = useConfigStore();

export const useLayerStore = defineStore('layer', {
  state: () => ({
    parentGroup: null as LayerGroup | null,
    parentGroupRedos: [] as LayerGroup[],
    parentGroupUndos: [] as LayerGroup[],
    savedLayers: [] as (LayerGroup | Layer)[],
  }),
  persist: {
    storage: localStorage,
    key: 'editor-layer',
    serializer: {
      serialize: (value: StateTree) => {
        const obj = value as {
          parentGroup: LayerGroup | null;
          parentGroupUndos: LayerGroup[];
          parentGroupRedos: LayerGroup[];
          savedLayers: (LayerGroup | Layer)[];
        };
        const parentGroup = obj.parentGroup;
        const savedLayers = obj.savedLayers;
        const serialized = JSON.stringify({
          parentGroup: parentGroup ? serializeLayerGroup(parentGroup) : null,
          parentGroupUndos: obj.parentGroupUndos.map((group) => serializeLayerGroup(group)),
          parentGroupRedos: obj.parentGroupRedos.map((group) => serializeLayerGroup(group)),
          savedLayers: savedLayers.map((layer) =>
            'layers' in layer
              ? serializeLayerGroup(layer as LayerGroup)
              : serializeLayer(layer as Layer),
          ),
        });
        return serialized;
      },
      deserialize: (value: string) => {
        const parsed = JSON.parse(value);
        return {
          parentGroup: parsed.parentGroup ? makeLayerGroup(parsed.parentGroup) : null,
          parentGroupUndos: parsed.parentGroupUndos.map((group: LayerGroupConfig) =>
            makeLayerGroup(group),
          ),
          parentGroupRedos: parsed.parentGroupRedos.map((group: LayerGroupConfig) =>
            makeLayerGroup(group),
          ),
          savedLayers: parsed.savedLayers.map((layer: LayerGroupConfig | LayerConfig) => {
            if ('layers' in layer) {
              return makeLayerGroup(layer as LayerGroupConfig);
            }
            return makeLayer(layer as LayerConfig);
          }),
        };
      },
    },
  },
  actions: {
    initializeParentGroup() {
      if (this.parentGroup === null) {
        this.parentGroup = defaultParentGroup() as LayerGroup;
      }
    },
    addLayer() {
      this.pushHistory();
      if (this.parentGroup) {
        const newLayer = defaultLayer();
        this.parentGroup.layers.unshift(newLayer);
      }
    },
    addLayerGroup() {
      this.pushHistory();
      if (this.parentGroup) {
        const newGroup = defaultLayerGroup();
        this.parentGroup.layers.unshift(newGroup);
      }
    },
    selectLayer(id: string): void {
      if (!this.parentGroup) return;
      // 1. Deselect all layers first
      const updatedGroup = deselectAll(this.parentGroup);

      // 2. Then, find and select the new layer
      const selectInTree = (group: LayerGroup): LayerGroup => {
        return {
          ...group,
          layers: group.layers.map((item) => {
            if (item.id === id) {
              return { ...item, selected: true };
            }
            if ('layers' in item && item.layers) {
              return selectInTree(item as LayerGroup);
            }
            return item;
          }),
        };
      };

      this.parentGroup = selectInTree(updatedGroup);
    },
    deleteLayer(id: string) {
      this.pushHistory();
      if (!this.parentGroup) return;
      this.parentGroup.layers = this.parentGroup.layers.filter((layer) => layer.id !== id);
      if (this.parentGroup.layers.length === 0) {
        this.parentGroup = null;
      } else {
        this.parentGroup = deselectAll(this.parentGroup);
      }
    },
    saveLayer(layer: Layer | LayerGroup) {
      if (!this.savedLayers) return;
      this.savedLayers.push(layer);
    },
    loadLayer(index: number): Layer | LayerGroup | null {
      if (index < 0 || index >= this.savedLayers.length) {
        return null;
      }
      const layer = this.savedLayers[index];
      if ('layers' in layer) {
        return layer as LayerGroup;
      } else {
        return layer as Layer;
      }
    },
    deleteSavedLayerByIndex(index: number) {
      if (index < 0 || index >= this.savedLayers.length) return;
      this.savedLayers.splice(index, 1);
    },
    deleteSavedLayerByObject(layer: Layer | LayerGroup) {
      const index = this.savedLayers.findIndex((savedLayer) => {
        if ('layers' in savedLayer && 'layers' in layer) {
          return savedLayer.id === layer.id;
        } else if (!('layers' in savedLayer) && !('layers' in layer)) {
          return savedLayer.id === layer.id;
        }
        return false;
      });
      if (index !== -1) {
        this.savedLayers.splice(index, 1);
      }
    },
    isLayerSaved(layer: Layer | LayerGroup): boolean {
      return this.savedLayers.some((savedLayer) => {
        // separate check for LayerGroup and Layer, in case of id collision
        if ('layers' in savedLayer && 'layers' in layer) {
          return savedLayer.id === layer.id;
        } else if (!('layers' in savedLayer) && !('layers' in layer)) {
          return savedLayer.id === layer.id;
        }
        return false;
      });
    },
    addLayerOrGroupToEditor(layer: Layer | LayerGroup) {
      this.pushHistory();
      if (!this.parentGroup) return;

      this.parentGroup.layers.unshift(layer);
    },
    addLayerOrGroupToSaved(layer: Layer | LayerGroup) {
      if (!this.savedLayers) return;

      this.savedLayers.push(layer);
    },
    undo(): void {
      if (this.parentGroupUndos.length > 0 && this.parentGroup) {
        console.log(this.parentGroupUndos, this.parentGroupRedos);
        const lastState = this.parentGroupUndos.pop();
        if (lastState) {
          const serialized = serializeLayerGroup(this.parentGroup);
          const deepCopy = makeLayerGroup(serialized);
          this.parentGroupRedos.push(deepCopy);
          this.parentGroup = lastState;
        }
      }
      // Limit the size of the undos
      if (this.parentGroupUndos.length > configStore.undoHistoryLength) {
        this.parentGroupUndos.shift();
      }
    },
    redo(): void {
      if (this.parentGroupRedos.length > 0 && this.parentGroup) {
        const lastState = this.parentGroupRedos.pop();
        if (lastState) {
          const serialized = serializeLayerGroup(this.parentGroup);
          const deepCopy = makeLayerGroup(serialized);
          this.parentGroupUndos.push(deepCopy);
          this.parentGroup = lastState;
        }
      }
      // Limit the size of the redos
      if (this.parentGroupRedos.length > configStore.redoHistoryLength) {
        this.parentGroupRedos.shift();
      }
    },
    pushHistory(): void {
      if (this.parentGroup) {
        const serialized = serializeLayerGroup(this.parentGroup);
        const deepCopy = makeLayerGroup(serialized);
        this.parentGroupUndos.push(deepCopy);
        this.parentGroupRedos = [];
      }
      // Limit the size of the undos
      if (this.parentGroupUndos.length > configStore.undoHistoryLength) {
        this.parentGroupUndos.shift();
      }
    },
  },
});
