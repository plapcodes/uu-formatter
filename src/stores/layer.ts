import { defineStore } from 'pinia';
import { defaultParentGroup, defaultLayer, defaultLayerGroup } from '@/lib';
import type { LayerGroup } from '@/lib';
import { deselectAll } from '@/lib';

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
  },
});
