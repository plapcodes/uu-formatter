import { defineStore } from 'pinia';
import { defaultParentGroup, defaultLayer, defaultLayerGroup } from '@/lib';
import type { LayerGroup } from '@/lib';

export const useLayerStore = defineStore('layer', {
  state: () => ({
    parentGroup: null as LayerGroup | null,
  }),
  persist: true,
  actions: {
    initializeParentGroup() {
      if (this.parentGroup === null) {
        this.parentGroup = defaultParentGroup() as LayerGroup;
      }
    },
    addLayer() {
      if (this.parentGroup) {
        const newLayer = defaultLayer();
        this.parentGroup.layers.unshift(newLayer);
      }
    },
    addLayerGroup() {
      if (this.parentGroup) {
        const newGroup = defaultLayerGroup();
        this.parentGroup.layers.unshift(newGroup);
      }
    },
    selectLayer(id: string): void {
      if (this.parentGroup) {
        const searchLayers = (layers: LayerGroup['layers']) => {
          for (const layer of layers) {
            layer.selected = false;
            if (layer.id === id) {
              layer.selected = true;
            } else if ('layers' in layer) {
              searchLayers(layer.layers);
            }
          }
        };
        searchLayers(this.parentGroup.layers);
      }
    },
  },
});
